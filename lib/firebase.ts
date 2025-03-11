import { type Analytics, getAnalytics } from 'firebase/analytics'
import { type FirebaseApp, FirebaseError, getApps, initializeApp } from 'firebase/app'
import {
  type Auth,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  signInWithCustomToken,
} from 'firebase/auth'
import {
  type Firestore,
  disableNetwork as disableFirestoreNetwork,
  enableNetwork as enableFirestoreNetwork,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore'
import { type FirebaseStorage, getStorage } from 'firebase/storage'

import { errorRecovery } from './services/error-recovery'

// Tipos personalizados para errores
interface FirebaseInitError extends FirebaseError {
  customData?: Record<string, unknown>
}

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
] as const

// Verificar variables de entorno antes de inicializar
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  const errorMessage = `
    Missing required environment variables:
    ${missingEnvVars.join('\n    ')}
    
    Please check the following:
    1. Ensure you have a .env or .env.local file in your project root
    2. Make sure all required variables are defined
    3. If running in development, try running 'npm run dev' again
    4. If running in production, verify your deployment environment variables
    
    See .env.example for all required variables.
  `.trim()

  console.error(errorMessage)

  if (typeof window !== 'undefined') {
    // Notificar al usuario a través del sistema de error recovery
    const error = new Error(errorMessage)
    errorRecovery.handleError(error).catch(console.error)
  } else {
    throw new Error(errorMessage)
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
} as const

// Tipos para el singleton
interface FirebaseServices {
  app: FirebaseApp
  db: Firestore
  auth: Auth
  storage: FirebaseStorage
  analytics?: Analytics
}

// Singleton para servicios de Firebase
let services: FirebaseServices | null = null

// Estado de la conexión
let isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true

async function initializeFirebase(): Promise<FirebaseServices> {
  if (typeof window === 'undefined') {
    throw new Error('Firebase initialization is not supported during SSR')
  }

  try {
    if (services) {
      return services
    }

    const existingApps = getApps()
    const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig)

    // Configurar el servicio de recuperación de errores
    errorRecovery.setApp(app)

    // Inicializar servicios
    const auth = getAuth(app)
    const db = getFirestore(app)
    const storage = getStorage(app)

    // Configurar persistencia de autenticación
    await setPersistence(auth, browserLocalPersistence)

    // Habilitar persistencia offline para Firestore
    try {
      await enableMultiTabIndexedDbPersistence(db)
    } catch (err) {
      if (
        err instanceof FirebaseError &&
        err.code !== 'failed-precondition' &&
        err.code !== 'unimplemented'
      ) {
        await errorRecovery.handleError(err)
      }
    }

    services = {
      app,
      db,
      auth,
      storage,
    }

    // Inicializar Analytics solo si está habilitado
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
      try {
        services.analytics = getAnalytics(app)
      } catch (error) {
        console.warn('Analytics initialization failed:', error)
        if (error instanceof Error) {
          await errorRecovery.handleError(error)
        }
      }
    }

    // Configurar manejo de conectividad
    window.addEventListener('online', async () => {
      isOnline = true
      console.log('Reconnecting to Firebase services...')
      try {
        // Intentar reconectar servicios
        await Promise.all(
          [
            enableFirestoreNetwork(db),
            auth.currentUser && signInWithCustomToken(auth, await auth.currentUser.getIdToken()),
          ].filter(Boolean)
        )
      } catch (error) {
        if (error instanceof Error) {
          await errorRecovery.handleError(error)
        }
      }
    })

    window.addEventListener('offline', () => {
      isOnline = false
      console.log('Connection lost. Switching to offline mode...')
      disableFirestoreNetwork(db).catch(console.error)
    })

    // Configurar manejadores de error globales para Firebase
    if (!process.env.NEXT_PUBLIC_FIREBASE_TEST_MODE) {
      auth.onAuthStateChanged(async (user) => {
        if (!user && services?.auth.currentUser) {
          try {
            await signInAnonymously(auth)
          } catch (error) {
            if (error instanceof Error) {
              await errorRecovery.handleError(error)
            }
          }
        }
      })
    }

    return services
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error('Firebase initialization error:', {
        message: error.message,
        code: error.code,
        customData: (error as FirebaseInitError).customData,
      })
      await errorRecovery.handleError(error)
    } else {
      console.error('Unknown initialization error:', error)
      if (error instanceof Error) {
        await errorRecovery.handleError(error)
      }
    }
    throw error
  }
}

// Exportar servicios inicializados
let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined
let storage: FirebaseStorage | undefined
let initialized = false

// Solo inicializar en el cliente y cuando no estamos en modo de prueba
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_TEST_MODE) {
  // Inicialización asíncrona
  initializeFirebase()
    .then((initializedServices) => {
      app = initializedServices.app
      db = initializedServices.db
      auth = initializedServices.auth
      storage = initializedServices.storage
      initialized = true

      // Configurar manejadores de error globales para Firebase después de la inicialización
      auth?.onAuthStateChanged(async (user) => {
        if (!user && auth?.currentUser) {
          try {
            await signInAnonymously(auth)
          } catch (error) {
            if (error instanceof Error) {
              await errorRecovery.handleError(error)
            }
          }
        }
      })
    })
    .catch(async (error) => {
      console.error('Failed to initialize Firebase:', error)
      if (error instanceof Error) {
        await errorRecovery.handleError(error)
      }
    })
}

// Función de utilidad para verificar el estado de la conexión
export function isConnected(): boolean {
  return isOnline
}

// Función para obtener la instancia de Firestore inicializada
export async function getInitializedDb(): Promise<Firestore> {
  if (!initialized || !db) {
    const services = await initializeFirebase()
    return services.db
  }
  return db
}

// Función para obtener la instancia de Auth inicializada
export async function getInitializedAuth(): Promise<Auth> {
  if (!initialized || !auth) {
    const services = await initializeFirebase()
    return services.auth
  }
  return auth
}

// Función para obtener la instancia de Storage inicializada
export async function getInitializedStorage(): Promise<FirebaseStorage> {
  if (!initialized || !storage) {
    const services = await initializeFirebase()
    return services.storage
  }
  return storage
}

// Función para obtener la instancia de Analytics inicializada
export async function getInitializedAnalytics(): Promise<Analytics | undefined> {
  if (!initialized) {
    const services = await initializeFirebase()
    return services.analytics
  }
  return services?.analytics
}

// Función para obtener la instancia de App inicializada
export async function getInitializedApp(): Promise<FirebaseApp> {
  if (!initialized || !app) {
    const services = await initializeFirebase()
    return services.app
  }
  return app
}

// Función para reinicializar Firebase (útil para pruebas)
export async function reinitializeFirebase(): Promise<FirebaseServices> {
  services = null
  initialized = false
  return initializeFirebase()
}

export { app, auth, storage }

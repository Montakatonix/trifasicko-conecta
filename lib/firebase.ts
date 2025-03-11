import { type Analytics, getAnalytics } from 'firebase/analytics'
import { type FirebaseApp, FirebaseError, getApps, initializeApp } from 'firebase/app'
import {
  type Auth,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Verificar la configuración antes de inicializar
const missingConfig = Object.entries(firebaseConfig).filter(([_, value]) => !value)

if (typeof window !== 'undefined' && missingConfig.length > 0) {
  console.error('Missing Firebase configuration:', missingConfig.map(([key]) => key))
}

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

// Variables exportadas
export let app: FirebaseApp | undefined
export let db: Firestore | undefined
export let auth: Auth | undefined
export let storage: FirebaseStorage | undefined
export let analytics: Analytics | undefined
let initialized = false

async function initializeFirebase(): Promise<FirebaseServices> {
  if (typeof window === 'undefined') {
    throw new Error('Firebase initialization is not supported during SSR')
  }

  try {
    if (services) {
      return services
    }

    const existingApps = getApps()
    app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig)

    // Configurar el servicio de recuperación de errores
    errorRecovery.setApp(app)

    // Inicializar servicios
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

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
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
      try {
        analytics = getAnalytics(app)
        services.analytics = analytics
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
        if (db && auth?.currentUser) {
          await Promise.all([
            enableFirestoreNetwork(db),
            auth.currentUser.getIdToken().then(token => 
              signInWithCustomToken(auth, token)
            )
          ])
        } else if (db) {
          await enableFirestoreNetwork(db)
        }
      } catch (error) {
        console.error('Error reconnecting:', error)
        if (error instanceof Error) {
          await errorRecovery.handleError(error)
        }
      }
    })

    window.addEventListener('offline', () => {
      isOnline = false
      console.log('Connection lost. Switching to offline mode...')
      if (db) {
        disableFirestoreNetwork(db).catch(console.error)
      }
    })

    // Configurar manejadores de error globales para Firebase
    if (!process.env.NEXT_PUBLIC_FIREBASE_TEST_MODE && auth) {
      onAuthStateChanged(auth, async (user) => {
        if (!user && auth.currentUser) {
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

    initialized = true
    return services
  } catch (error) {
    console.error('Firebase initialization error:', error)
    if (error instanceof Error) {
      await errorRecovery.handleError(error)
    }
    throw error
  }
}

// Solo inicializar en el cliente
if (typeof window !== 'undefined') {
  initializeFirebase().catch((error) => {
    console.error('Failed to initialize Firebase:', error)
  })
}

export function isInitialized(): boolean {
  return initialized
}

export function isConnected(): boolean {
  return isOnline
}

export async function getInitializedDb(): Promise<Firestore> {
  if (!db) {
    await initializeFirebase()
  }
  return db!
}

export async function getInitializedAuth(): Promise<Auth> {
  if (!auth) {
    await initializeFirebase()
  }
  return auth!
}

export async function getInitializedStorage(): Promise<FirebaseStorage> {
  if (!storage) {
    await initializeFirebase()
  }
  return storage!
}

export async function getInitializedAnalytics(): Promise<Analytics | undefined> {
  if (!initialized) {
    await initializeFirebase()
  }
  return analytics
}

export async function getInitializedApp(): Promise<FirebaseApp> {
  if (!app) {
    await initializeFirebase()
  }
  return app!
}

// Re-exportar tipos para conveniencia
export type { FirebaseApp, Auth, Firestore, FirebaseStorage, Analytics }


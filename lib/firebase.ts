import { initializeApp, getApps, type FirebaseApp, FirebaseError } from "firebase/app"
import { 
  getFirestore, 
  type Firestore, 
  enableMultiTabIndexedDbPersistence,
  enableNetwork as enableFirestoreNetwork,
  disableNetwork as disableFirestoreNetwork
} from "firebase/firestore"
import { 
  getAuth, 
  type Auth, 
  browserLocalPersistence, 
  setPersistence,
  signInAnonymously,
  signInWithCustomToken
} from "firebase/auth"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { errorRecovery } from './services/error-recovery'

// Tipos personalizados para errores
interface FirebaseInitError extends FirebaseError {
  customData?: {
    [key: string]: any;
  };
}

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
] as const

// Verificar variables de entorno antes de inicializar
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  const errorMessage = `
    Missing required environment variables:
    ${missingEnvVars.join("\n    ")}
    
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
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
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
      if (err instanceof FirebaseError && 
          err.code !== 'failed-precondition' && 
          err.code !== 'unimplemented') {
        await errorRecovery.handleError(err)
      }
    }

    services = {
      app,
      db,
      auth,
      storage
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
        await Promise.all([
          enableFirestoreNetwork(db),
          auth.currentUser && signInWithCustomToken(auth, await auth.currentUser.getIdToken())
        ].filter(Boolean))
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

    return services
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase initialization error:", {
        message: error.message,
        code: error.code,
        customData: (error as FirebaseInitError).customData
      })
      await errorRecovery.handleError(error)
    } else {
      console.error("Unknown initialization error:", error)
      if (error instanceof Error) {
        await errorRecovery.handleError(error)
      }
    }
    throw error
  }
}

// Exportar servicios inicializados
let app: FirebaseApp
let db: Firestore
let auth: Auth
let storage: FirebaseStorage

// Solo inicializar en el cliente
if (typeof window !== 'undefined') {
  // Inicialización asíncrona
  initializeFirebase().then((initializedServices) => {
    app = initializedServices.app
    db = initializedServices.db
    auth = initializedServices.auth
    storage = initializedServices.storage
  }).catch(async (error) => {
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

export { app, db, auth, storage }


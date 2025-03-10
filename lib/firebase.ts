import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Debug: Mostrar la configuración (sin la apiKey por seguridad)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[CONFIGURED]' : '[MISSING]'
})

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
}

let app: FirebaseApp
let db: Firestore
let auth: Auth

try {
  const existingApps = getApps()
  app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
  
  console.log('Firebase services initialized successfully')
} catch (error) {
  console.error("Firebase initialization error:", error instanceof Error ? error.message : "Unknown error")
  throw error
}

export { app, db, auth }


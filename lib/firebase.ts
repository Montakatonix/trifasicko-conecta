import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCJGrPnnYW3s7JL5ylGKv760JEMSvm23TI",
  authDomain: "trifasicoconectaweb.firebaseapp.com",
  projectId: "trifasicoconectaweb",
  storageBucket: "trifasicoconectaweb.firebasestorage.app",
  messagingSenderId: "607386841601",
  appId: "1:607386841601:web:da540e195fb7ac8c31c600",
  measurementId: "G-NRF2LN4CL8"
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
  
  if (existingApps.length > 0) {
    console.log('Using existing Firebase app')
    app = existingApps[0]
  } else {
    console.log('Initializing new Firebase app')
    app = initializeApp(firebaseConfig)
  }
  
  db = getFirestore(app)
  auth = getAuth(app)
  
  // Initialize Analytics only in the browser
  if (typeof window !== 'undefined') {
    getAnalytics(app)
  }
  
  console.log('Firebase services initialized successfully')
} catch (error) {
  console.error("Firebase initialization error:", error instanceof Error ? error.message : "Unknown error")
  throw error
}

export { app, db, auth }


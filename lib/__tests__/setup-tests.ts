import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, jest } from '@jest/globals'
import { setupFetchMocks, clearFetchMocks } from './handlers'
import { type User } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { errorRecovery } from '@/lib/services/error-recovery'

// Configuración de Firebase para pruebas
const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-auth-domain',
  projectId: 'test-project-id',
  storageBucket: 'test-storage-bucket',
  messagingSenderId: 'test-messaging-sender-id',
  appId: 'test-app-id',
  measurementId: 'test-measurement-id',
}

// Mock de las variables de entorno
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket'
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-messaging-sender-id'
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id'
process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'test-measurement-id'
process.env.NEXT_PUBLIC_FIREBASE_TEST_MODE = 'true'

// Store original console functions
let originalWarn = console.warn
let originalError = console.error

// Mock Firebase modules
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((_auth: unknown, callback: (user: User | null) => void) => {
    callback(null)
    return () => {}
  }),
  getIdToken: jest.fn(() => Promise.resolve('mock-token')),
}

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => ({
    name: '[DEFAULT]',
    options: {},
  })),
  FirebaseError: class FirebaseError extends Error {
    code: string
    constructor(code: string, message: string) {
      super(message)
      this.code = code
      this.name = 'FirebaseError'
    }
  },
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  })),
  onAuthStateChanged: jest.fn((_auth: unknown, callback: (user: User | null) => void) => {
    callback(null)
    return () => {}
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  User: jest.fn(),
}))

jest.mock('firebase/firestore', () => {
  const mockBatch = {
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  }

  return {
    getFirestore: jest.fn(() => ({
      batch: jest.fn(() => mockBatch),
    })),
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          data: () => ({}),
          exists: true,
        }),
      })),
    })),
    doc: jest.fn(() => ({
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue({
        data: () => ({}),
        exists: true,
      }),
    })),
    getDoc: jest.fn().mockResolvedValue({
      data: () => ({}),
      exists: true,
    }),
    setDoc: jest.fn().mockResolvedValue(undefined),
    updateDoc: jest.fn().mockResolvedValue(undefined),
    deleteDoc: jest.fn().mockResolvedValue(undefined),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn().mockResolvedValue({
      docs: [],
      empty: true,
    }),
    writeBatch: jest.fn(() => mockBatch),
  }
})

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}))

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
}))

// Setup
beforeAll(() => {
  setupFetchMocks()
  
  // Mock window.navigator.onLine
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: true,
  })

  // Inicializar Firebase para pruebas
  const app = initializeApp(firebaseConfig, 'test')
  errorRecovery.setApp(app)

  // Suppress specific console warnings
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ReactDOM.render is no longer supported') ||
        args[0].includes('useLayoutEffect does nothing on the server'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }

  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
       args[0].includes('Error:') ||
       args[0].includes('Invalid hook call') ||
       args[0].includes('ReactDOM.render is no longer supported'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

// Reset mocks after each test
afterEach(() => {
  cleanup()
  jest.clearAllMocks()
  errorRecovery.clearRetryCounters()
})

// Cleanup
afterAll(() => {
  clearFetchMocks()
  console.warn = originalWarn
  console.error = originalError
})

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor() {
    this.observe = jest.fn()
    this.unobserve = jest.fn()
    this.disconnect = jest.fn()
  }

  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
  takeRecords = () => []
}

window.IntersectionObserver = MockIntersectionObserver

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  constructor() {
    this.observe = jest.fn()
    this.unobserve = jest.fn()
    this.disconnect = jest.fn()
  }

  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
}

window.ResizeObserver = MockResizeObserver

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}) 
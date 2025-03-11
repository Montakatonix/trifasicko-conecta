import { FirebaseError } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

interface ErrorRecoveryStrategy {
  condition: (error: Error) => boolean
  action: (error: Error) => Promise<void>
  maxRetries: number
}

interface ErrorLogOptions {
  context?: string
  metadata?: Record<string, unknown>
  shouldNotify?: boolean
}

interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  retryCount?: number
}

class ErrorRecoveryService {
  private static instance: ErrorRecoveryService
  private retryCounters: Map<string, number> = new Map()
  private isRecovering: boolean = false
  private app: FirebaseApp | null = null
  private retryQueue: Map<string, RetryConfig>

  private strategies: ErrorRecoveryStrategy[] = [
    // Firebase Network Error Strategy
    {
      condition: (error: Error) =>
        error instanceof FirebaseError &&
        (error.code === 'failed-precondition' || error.code === 'unavailable'),
      action: async (_error) => {
        console.log('Attempting to recover from Firebase network error...')
        if (!this.app) return

        const db = getFirestore(this.app)
        await disableNetwork(db)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await enableNetwork(db)
      },
      maxRetries: 3,
    },
    // Authentication Error Strategy
    {
      condition: (error: Error) => error instanceof FirebaseError && error.code.startsWith('auth/'),
      action: async (_error) => {
        console.log('Attempting to recover from authentication error...')
        await new Promise((resolve) => setTimeout(resolve, 1000))
      },
      maxRetries: 2,
    },
    // General Network Error Strategy
    {
      condition: (error: Error) => error instanceof TypeError && error.message.includes('network'),
      action: async (_error) => {
        console.log('Attempting to recover from network error...')
        await new Promise((resolve) => setTimeout(resolve, 2000))
      },
      maxRetries: 3,
    },
  ]

  private constructor() {
    this.retryQueue = new Map()
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandling()
    }
  }

  public static getInstance(): ErrorRecoveryService {
    if (!ErrorRecoveryService.instance) {
      ErrorRecoveryService.instance = new ErrorRecoveryService()
    }
    return ErrorRecoveryService.instance
  }

  public setApp(app: FirebaseApp) {
    this.app = app
  }

  private setupGlobalErrorHandling() {
    window.addEventListener('unhandledrejection', async (event) => {
      await this.handleError(event.reason)
    })

    window.addEventListener('error', async (event) => {
      await this.handleError(event.error)
    })
  }

  public async handleError(error: Error): Promise<void> {
    if (this.isRecovering) {
      console.log('Already attempting recovery, skipping...')
      return
    }

    try {
      this.isRecovering = true
      const errorId = this.getErrorId(error)
      const retryCount = this.retryCounters.get(errorId) || 0

      console.error('Error detected:', {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name,
      })

      for (const strategy of this.strategies) {
        if (strategy.condition(error)) {
          if (retryCount < strategy.maxRetries) {
            console.log(
              `Applying recovery strategy. Attempt ${retryCount + 1}/${strategy.maxRetries}`
            )
            await strategy.action(error)
            this.retryCounters.set(errorId, retryCount + 1)
            return
          } else {
            console.log(`Max retries (${strategy.maxRetries}) reached for error: ${errorId}`)
            this.notifyError(error)
          }
        }
      }
    } finally {
      this.isRecovering = false
    }
  }

  private getErrorId(error: Error): string {
    return `${error.constructor.name}-${error.message}`
  }

  private notifyError(error: Error) {
    console.error('Unrecoverable error:', error)

    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-error-toast', {
        detail: {
          message: 'Se ha producido un error. Estamos trabajando en solucionarlo.',
          error: error.message,
        },
      })
      window.dispatchEvent(event)
    }
  }

  public addStrategy(strategy: ErrorRecoveryStrategy) {
    this.strategies.push(strategy)
  }

  public clearRetryCounters() {
    this.retryCounters.clear()
  }

  public async reconnectFirebase() {
    if (!this.app) return

    try {
      const auth = getAuth(this.app)
      const db = getFirestore(this.app)

      await Promise.all([
        enableNetwork(db),
        auth.currentUser && signInWithCustomToken(auth, await auth.currentUser.getIdToken()),
      ])
    } catch (_error) {
      console.error('Failed to reconnect to Firebase')
    }
  }

  public async handleNetworkError(
    operationId: string,
    operation: () => Promise<unknown>,
    _error: unknown
  ): Promise<unknown> {
    return this.retryOperation(operationId, operation, _error, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
    })
  }

  public async handleDatabaseError(
    operationId: string,
    operation: () => Promise<unknown>,
    _error: unknown
  ): Promise<unknown> {
    return this.retryOperation(operationId, operation, _error, {
      maxRetries: 5,
      baseDelay: 2000,
      maxDelay: 10000,
    })
  }

  private async retryOperation(
    operationId: string,
    operation: () => Promise<unknown>,
    _error: unknown,
    config: RetryConfig
  ): Promise<unknown> {
    const retryCount = (this.retryQueue.get(operationId)?.retryCount || 0) + 1

    if (retryCount > config.maxRetries) {
      this.retryQueue.delete(operationId)
      throw new Error(`Max retries exceeded for operation ${operationId}`)
    }

    this.retryQueue.set(operationId, {
      ...config,
      retryCount,
    })

    const delay = this.calculateDelay(retryCount, config)
    await this.wait(delay)

    try {
      const result = await operation()
      this.retryQueue.delete(operationId)
      return result
    } catch (_error) {
      return this.retryOperation(operationId, operation, _error, config)
    }
  }

  private calculateDelay(retryCount: number, config: RetryConfig): number {
    const exponentialDelay = Math.min(
      config.maxDelay,
      config.baseDelay * Math.pow(2, retryCount - 1)
    )
    const jitter = Math.random() * 1000
    return exponentialDelay + jitter
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const errorRecovery = ErrorRecoveryService.getInstance()

function getErrorMessage(_error: ErrorResponse, context: string): string {
  const contextMessages: Record<string, string> = {
    auth: 'Error de autenticación',
    network: 'Error de conexión',
    api: 'Error en la solicitud',
    validation: 'Error de validación',
    general: 'Ha ocurrido un error',
  }
  
  return contextMessages[context] || 'Ha ocurrido un error inesperado'
}

export function handleError(_error: unknown, options: ErrorLogOptions = {}): ErrorResponse {
  const { context = 'general', metadata = {}, shouldNotify = false } = options
  
  const normalizedError = normalizeError(_error)
  logError(normalizedError, context, metadata)
  
  if (shouldNotify) {
    notifyError(normalizedError, context)
  }
  
  return normalizedError
}

function normalizeError(_error: unknown): ErrorResponse {
  if (_error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      message: _error.message,
      details: {
        name: _error.name,
        stack: _error.stack,
      },
    }
  }
  
  if (typeof _error === 'string') {
    return {
      code: 'INTERNAL_ERROR',
      message: _error,
    }
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    details: { originalError: _error },
  }
}

function logError(_error: ErrorResponse, context: string, metadata: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    error: _error,
    metadata,
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', logEntry)
    return
  }
}

function notifyError(_error: ErrorResponse, context: string): void {
  if (typeof window === 'undefined') return
  
  const event = new CustomEvent('show-error-toast', {
    detail: {
      message: getErrorMessage(_error, context),
      error: _error.message,
    },
  })
  
  window.dispatchEvent(event)
}

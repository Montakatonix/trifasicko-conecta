import { FirebaseError } from 'firebase/app'
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore'
import type { FirebaseApp } from 'firebase/app'

interface ErrorRecoveryStrategy {
  condition: (error: Error) => boolean
  action: (error: Error) => Promise<void>
  maxRetries: number
}

class ErrorRecoveryService {
  private static instance: ErrorRecoveryService
  private retryCounters: Map<string, number> = new Map()
  private isRecovering: boolean = false
  private app: FirebaseApp | null = null

  private strategies: ErrorRecoveryStrategy[] = [
    // Firebase Network Error Strategy
    {
      condition: (error: Error) => 
        error instanceof FirebaseError && 
        (error.code === 'failed-precondition' || error.code === 'unavailable'),
      action: async (error) => {
        console.log('Attempting to recover from Firebase network error...')
        if (!this.app) return

        const db = getFirestore(this.app)
        await disableNetwork(db)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await enableNetwork(db)
      },
      maxRetries: 3
    },
    // Authentication Error Strategy
    {
      condition: (error: Error) =>
        error instanceof FirebaseError && 
        error.code.startsWith('auth/'),
      action: async (error) => {
        console.log('Attempting to recover from authentication error...')
        // Implementar lógica de reautenticación si es necesario
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
      maxRetries: 2
    },
    // General Network Error Strategy
    {
      condition: (error: Error) =>
        error instanceof TypeError && 
        error.message.includes('network'),
      action: async (error) => {
        console.log('Attempting to recover from network error...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      maxRetries: 3
    }
  ]

  private constructor() {
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
        type: error.constructor.name
      })

      for (const strategy of this.strategies) {
        if (strategy.condition(error)) {
          if (retryCount < strategy.maxRetries) {
            console.log(`Applying recovery strategy. Attempt ${retryCount + 1}/${strategy.maxRetries}`)
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
    // Implementar notificación al usuario
    console.error('Unrecoverable error:', error)
    
    // Si tienes un servicio de notificaciones, úsalo aquí
    if (typeof window !== 'undefined') {
      // Ejemplo con toast notification
      const event = new CustomEvent('show-error-toast', {
        detail: {
          message: 'Se ha producido un error. Estamos trabajando en solucionarlo.',
          error: error.message
        }
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
}

export const errorRecovery = ErrorRecoveryService.getInstance() 
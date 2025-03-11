import { ErrorResponse } from '../types/api-responses'

interface ErrorLogOptions {
  context?: string
  metadata?: Record<string, unknown>
  shouldNotify?: boolean
}

export function handleError(error: unknown, options: ErrorLogOptions = {}): ErrorResponse {
  const { context = 'general', metadata = {}, shouldNotify = false } = options
  
  // Normalizar el error a un formato consistente
  const normalizedError = normalizeError(error)
  
  // Loggear el error
  logError(normalizedError, context, metadata)
  
  // Notificar si es necesario
  if (shouldNotify) {
    notifyError(normalizedError, context)
  }
  
  return normalizedError
}

function normalizeError(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
      },
    }
  }
  
  if (typeof error === 'string') {
    return {
      code: 'INTERNAL_ERROR',
      message: error,
    }
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    details: { originalError: error },
  }
}

function logError(error: ErrorResponse, context: string, metadata: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    error,
    metadata,
  }
  
  // En desarrollo, usar console.error
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', logEntry)
    return
  }
  
  // En producción, aquí iría la lógica para enviar a un servicio de logging
  // Por ejemplo: Sentry, LogRocket, etc.
}

function notifyError(error: ErrorResponse, context: string): void {
  if (typeof window === 'undefined') return
  
  // Disparar evento personalizado para mostrar toast de error
  const event = new CustomEvent('show-error-toast', {
    detail: {
      message: getErrorMessage(error, context),
      error: error.message,
    },
  })
  
  window.dispatchEvent(event)
}

function getErrorMessage(error: ErrorResponse, context: string): string {
  // Mensajes de error personalizados según el contexto
  const contextMessages: Record<string, string> = {
    auth: 'Error de autenticación',
    network: 'Error de conexión',
    api: 'Error en la solicitud',
    validation: 'Error de validación',
    general: 'Ha ocurrido un error',
  }
  
  return contextMessages[context] || 'Ha ocurrido un error inesperado'
}

// Utilidad para manejar errores en componentes
export function createErrorBoundary(component: string) {
  return function componentErrorHandler(error: unknown) {
    handleError(error, {
      context: `component:${component}`,
      shouldNotify: true,
    })
    
    // Retornar null o un componente de fallback
    return null
  }
} 
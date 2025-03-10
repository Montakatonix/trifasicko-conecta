import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ErrorToastEvent {
  detail: {
    message: string
    error: string
  }
}

export function ErrorToast() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const handleErrorToast = (event: CustomEvent<ErrorToastEvent['detail']>) => {
      toast.error(event.detail.message, {
        description: event.detail.error,
        duration: 5000,
        action: {
          label: 'Reintentar',
          onClick: () => window.location.reload()
        }
      })
    }

    window.addEventListener('show-error-toast' as any, handleErrorToast as any)

    return () => {
      window.removeEventListener('show-error-toast' as any, handleErrorToast as any)
    }
  }, [])

  if (!isClient) return null

  return null
} 
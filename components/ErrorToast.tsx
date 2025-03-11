import { useEffect, useState } from 'react'

import { toast } from 'sonner'

interface ErrorToastDetail {
  message: string
  error: string
}

interface ErrorToastEvent extends CustomEvent {
  detail: ErrorToastDetail
}

declare global {
  interface WindowEventMap {
    'show-error-toast': ErrorToastEvent
  }
}

export function ErrorToast() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const handleErrorToast = (event: ErrorToastEvent) => {
      toast.error(event.detail.message, {
        description: event.detail.error,
        duration: 5000,
        action: {
          label: 'Reintentar',
          onClick: () => window.location.reload(),
        },
      })
    }

    window.addEventListener('show-error-toast', handleErrorToast)

    return () => {
      window.removeEventListener('show-error-toast', handleErrorToast)
    }
  }, [])

  if (!isClient) return null

  return null
}

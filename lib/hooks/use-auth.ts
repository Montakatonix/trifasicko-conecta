import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setState({
          user,
          loading: false,
          error: null,
        })
      },
      (error) => {
        setState({
          user: null,
          loading: false,
          error: 'Authentication error occurred',
        })
      }
    )

    return () => unsubscribe()
  }, [])

  return state
} 
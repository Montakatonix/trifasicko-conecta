'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      setError('Firebase Auth is not initialized')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
        setError(null)
      },
      (error) => {
        setError(error instanceof Error ? error.message : 'Authentication error')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleAuthError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Authentication error'
    setError(message)
    throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      if (!auth) throw new Error('Firebase Auth is not initialized')
      setLoading(true)
      setError(null)
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(newUser, { displayName: name })
      setUser(newUser)
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!auth) throw new Error('Firebase Auth is not initialized')
      setLoading(true)
      setError(null)
      const { user: signedInUser } = await signInWithEmailAndPassword(auth, email, password)
      setUser(signedInUser)
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      if (!auth) throw new Error('Firebase Auth is not initialized')
      setLoading(true)
      setError(null)
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const contextValue = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }

  return React.createElement(AuthContext.Provider, {
    value: contextValue,
    children,
  })
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

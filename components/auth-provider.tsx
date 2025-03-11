'use client'

import type React from 'react'

import { AuthProvider as FirebaseAuthProvider } from '@/lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
}

import { getInitializedAuth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth'

interface AuthCredentials {
  email: string
  password: string
}

interface RegisterData extends AuthCredentials {
  name: string
}

interface AuthResponse {
  success: boolean
  user?: any
  error?: string
}

export const loginUser = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  try {
    const auth = await getInitializedAuth()
    const result = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: 'Invalid email or password' }
  }
}

export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    const auth = await getInitializedAuth()
    const result = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    )
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: 'Email already in use' }
  }
}

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    const auth = await getInitializedAuth()
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error during logout' }
  }
} 
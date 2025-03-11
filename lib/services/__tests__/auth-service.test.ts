import { mockUser } from '@/lib/__mocks__/test-data'
import { auth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { loginUser, registerUser, logoutUser } from '../auth-service'

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  getAuth: jest.fn(),
  setPersistence: jest.fn().mockResolvedValue(undefined),
  browserLocalPersistence: 'LOCAL',
}))

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loginUser', () => {
    it('successfully logs in a user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      ;(signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      })

      const result = await loginUser(credentials)

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        credentials.email,
        credentials.password
      )
      expect(result).toEqual({ success: true, user: mockUser })
    })

    it('handles login errors', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password',
      }

      const error = new Error('auth/wrong-password')
      ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(error)

      const result = await loginUser(credentials)

      expect(result).toEqual({
        success: false,
        error: 'Invalid email or password',
      })
    })
  })

  describe('registerUser', () => {
    it('successfully registers a new user', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      }

      ;(createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { ...mockUser, email: userData.email },
      })

      const result = await registerUser(userData)

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        userData.email,
        userData.password
      )
      expect(result).toEqual({
        success: true,
        user: expect.objectContaining({ email: userData.email }),
      })
    })

    it('handles registration errors', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      }

      const error = new Error('auth/email-already-in-use')
      ;(createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(error)

      const result = await registerUser(userData)

      expect(result).toEqual({
        success: false,
        error: 'Email already in use',
      })
    })
  })

  describe('logoutUser', () => {
    it('successfully logs out a user', async () => {
      ;(signOut as jest.Mock).mockResolvedValueOnce(undefined)

      const result = await logoutUser()

      expect(signOut).toHaveBeenCalledWith(auth)
      expect(result).toEqual({ success: true })
    })

    it('handles logout errors', async () => {
      const error = new Error('auth/no-current-user')
      ;(signOut as jest.Mock).mockRejectedValueOnce(error)

      const result = await logoutUser()

      expect(result).toEqual({
        success: false,
        error: 'Error during logout',
      })
    })
  })
}) 
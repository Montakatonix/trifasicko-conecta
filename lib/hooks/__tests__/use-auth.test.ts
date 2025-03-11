import { renderHook, act } from '@/lib/__tests__/test-utils'
import { mockUser } from '@/lib/__mocks__/test-data'
import { useAuth } from '../use-auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  })),
}))

describe('useAuth Hook', () => {
  let authStateCallback: (user: any) => void
  let unsubscribe: jest.Mock

  beforeEach(() => {
    unsubscribe = jest.fn()
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback, onError) => {
      authStateCallback = callback
      return unsubscribe
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with loading state and no user', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      user: null,
      loading: true,
      error: null,
    })
  })

  it('updates state when user logs in', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      authStateCallback(mockUser)
    })

    expect(result.current).toEqual({
      user: mockUser,
      loading: false,
      error: null,
    })
  })

  it('updates state when user logs out', async () => {
    const { result } = renderHook(() => useAuth())

    // Simular login
    await act(async () => {
      authStateCallback(mockUser)
    })

    // Simular logout
    await act(async () => {
      authStateCallback(null)
    })

    expect(result.current).toEqual({
      user: null,
      loading: false,
      error: null,
    })
  })

  it('handles authentication errors', async () => {
    const errorMessage = 'Authentication error occurred'
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback, onError) => {
      onError(new Error(errorMessage))
      return unsubscribe
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      user: null,
      loading: false,
      error: errorMessage,
    })
  })

  it('unsubscribes from auth state changes on unmount', () => {
    const { unmount } = renderHook(() => useAuth())
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })
}) 
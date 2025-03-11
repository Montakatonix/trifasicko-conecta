import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@radix-ui/react-toast'

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithMatch(...args: any[]): R
    }
  }
}

// Create a custom render function that includes providers
function render(ui: React.ReactElement, { theme = 'light', ...options } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme={theme} enableSystem={true}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

// Custom async utilities
const waitForData = async () => {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// Store original console.error
const originalConsoleError = console.error

// Mock console.error function
const mockConsoleError = () => {
  console.error = jest.fn()
  return () => {
    console.error = originalConsoleError
  }
}

// Custom matchers
expect.extend({
  toHaveBeenCalledWithMatch(received: jest.Mock, ...expected: any[]) {
    const pass = received.mock.calls.some((call) =>
      expected.every((arg, index) => {
        if (typeof arg === 'object' && arg !== null) {
          return expect.objectContaining(arg).asymmetricMatch(call[index])
        }
        return arg === call[index]
      })
    )

    return {
      pass,
      message: () =>
        `expected ${received.getMockName()} to have been called with arguments matching ${expected}`,
    }
  },
})

export * from '@testing-library/react'
export { render, waitForData, mockConsoleError }

// Tests
describe('Test Utilities', () => {
  describe('render', () => {
    it('renders component with default theme', () => {
      const TestComponent = () => <div>Test</div>
      const { container } = render(<TestComponent />)
      expect(container).toBeInTheDocument()
    })

    it('renders component with custom theme', () => {
      const TestComponent = () => <div>Test</div>
      const { container } = render(<TestComponent />, { theme: 'dark' })
      expect(container).toBeInTheDocument()
    })
  })

  describe('waitForData', () => {
    it('resolves after timeout', async () => {
      const start = Date.now()
      await waitForData()
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(0)
    })
  })

  describe('mockConsoleError', () => {
    it('mocks console.error', () => {
      const cleanup = mockConsoleError()
      console.error('test error')
      expect(console.error).toHaveBeenCalledWith('test error')
      cleanup()
    })
  })

  describe('custom matchers', () => {
    it('toHaveBeenCalledWithMatch matches exact values', () => {
      const mockFn = jest.fn()
      mockFn('test', 123)
      expect(mockFn).toHaveBeenCalledWithMatch('test', 123)
    })

    it('toHaveBeenCalledWithMatch matches objects', () => {
      const mockFn = jest.fn()
      mockFn({ foo: 'bar', extra: 'value' })
      expect(mockFn).toHaveBeenCalledWithMatch({ foo: 'bar' })
    })
  })
}) 
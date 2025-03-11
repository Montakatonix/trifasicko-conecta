import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Toast, ToastAction } from '../toast'
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast'
import { toast } from '@/hooks/use-toast'

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}))

describe('Toast Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders toast correctly', () => {
    render(
      <ToastProvider>
        <Toast>
          <div>Test Toast</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Test Toast')).toBeInTheDocument()
  })

  it('renders destructive variant', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive">
          <div>Error Toast</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const toastElement = screen.getByText('Error Toast').closest('[role="status"]')
    expect(toastElement?.className).toContain('destructive')
  })

  it('renders with action button', () => {
    const onAction = jest.fn()

    render(
      <ToastProvider>
        <Toast>
          <div>Action Toast</div>
          <ToastAction altText="test action" onClick={onAction}>
            Action
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const actionButton = screen.getByText('Action')
    fireEvent.click(actionButton)
    expect(onAction).toHaveBeenCalled()
  })

  it('handles close button click', () => {
    const onOpenChange = jest.fn()

    render(
      <ToastProvider>
        <Toast onOpenChange={onOpenChange}>
          <div>Close Test</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('handles swipe to dismiss', async () => {
    const onOpenChange = jest.fn()

    render(
      <ToastProvider>
        <Toast onOpenChange={onOpenChange}>
          <div>Swipe Test</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const toastElement = screen.getByRole('status')
    fireEvent.mouseDown(toastElement)
    fireEvent.mouseMove(toastElement, { clientX: 500 })
    fireEvent.mouseUp(toastElement)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <Toast className="custom-toast">
          <div>Custom Class</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const toastElement = screen.getByRole('status')
    expect(toastElement.className).toContain('custom-toast')
  })

  it('can be controlled with open prop', () => {
    const { rerender } = render(
      <ToastProvider>
        <Toast open={true}>
          <div>Controlled Toast</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Controlled Toast')).toBeInTheDocument()

    rerender(
      <ToastProvider>
        <Toast open={false}>
          <div>Controlled Toast</div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.queryByText('Controlled Toast')).not.toBeInTheDocument()
  })
}) 
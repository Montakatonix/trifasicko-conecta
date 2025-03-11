import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/lib/__tests__/test-utils'
import { Dialog } from '../dialog'
import { Button } from '../button'

describe('Dialog Component', () => {
  it('renders trigger button correctly', () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
  })

  it('opens dialog when trigger is clicked', async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
      expect(screen.getByText('This is a test dialog')).toBeInTheDocument()
      expect(screen.getByText('Dialog content')).toBeInTheDocument()
    })
  })

  it('closes dialog when close button is clicked', async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
          <Dialog.Close asChild>
            <Button>Close Dialog</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog>
    )

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Close dialog
    fireEvent.click(screen.getByRole('button', { name: 'Close Dialog' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes dialog when escape key is pressed', async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Press escape
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('handles onOpenChange callback', async () => {
    const handleOpenChange = jest.fn()

    render(
      <Dialog onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }))
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true)
    })

    // Press escape to close
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('renders with custom className', async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content className="custom-dialog">
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveClass('custom-dialog')
    })
  })

  it('handles controlled open state', async () => {
    const { rerender } = render(
      <Dialog open={true}>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    rerender(
      <Dialog open={false}>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>This is a test dialog</Dialog.Description>
          </Dialog.Header>
          <div>Dialog content</div>
        </Dialog.Content>
      </Dialog>
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
}) 
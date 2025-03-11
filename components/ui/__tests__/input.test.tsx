import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    const placeholder = 'Enter text'
    render(<Input placeholder={placeholder} />)
    const input = screen.getByPlaceholderText(placeholder)
    expect(input).toBeInTheDocument()
  })

  it('handles text input', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input).toHaveValue('test')
  })

  it('handles password type', () => {
    render(<Input type="password" aria-label="Password input" />)
    const input = screen.getByLabelText('Password input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('handles required state', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('handles readonly state', () => {
    render(<Input readOnly />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('handles error state', () => {
    render(<Input error />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('handles onChange callback', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('handles onFocus callback', () => {
    const handleFocus = jest.fn()
    render(<Input onFocus={handleFocus} />)
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalled()
  })

  it('handles onBlur callback', () => {
    const handleBlur = jest.fn()
    render(<Input onBlur={handleBlur} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalled()
  })
}) 
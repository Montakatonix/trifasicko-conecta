import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Select from '../select'

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]

  beforeAll(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  const renderSelect = (props: SelectProps = {}) => {
    return render(
      <Select defaultValue={props.value} {...props}>
        <Select.Trigger className={props.className}>
          <Select.Value placeholder="Select an option" />
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  }

  it('renders correctly with default props', () => {
    renderSelect()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  it('selects an option when clicked', async () => {
    const onValueChange = jest.fn()
    renderSelect({ onValueChange })
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    await waitFor(() => {
      const option = screen.getByText('Option 1')
      fireEvent.click(option)
      expect(onValueChange).toHaveBeenCalledWith('option1')
    })
  })

  it('can be disabled', () => {
    renderSelect({ disabled: true })
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows error state', () => {
    const errorClass = 'border-red-500'
    renderSelect({ className: errorClass })
    const trigger = screen.getByRole('combobox')
    expect(trigger.className).toContain(errorClass)
  })

  it('handles keyboard navigation', async () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    
    fireEvent.keyDown(trigger, { key: 'Enter' })
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    
    const listbox = screen.getByRole('listbox')
    fireEvent.keyDown(listbox, { key: 'ArrowDown' })
    
    await waitFor(() => {
      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveAttribute('data-highlighted', 'true')
    })
  })

  it('handles controlled value', () => {
    renderSelect({ value: 'option1' })
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })
}) 
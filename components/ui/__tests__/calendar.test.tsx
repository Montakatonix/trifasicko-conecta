import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { format, addDays, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '../calendar'
import { DateRange } from 'react-day-picker'

describe('Calendar Component', () => {
  const today = new Date(2025, 2, 11, 10, 59, 4, 702)

  const findDayButton = (date: Date) => {
    return screen.getByLabelText(format(date, 'dd MMMM yyyy', { locale: es }))
  }

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(today)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('renders correctly', () => {
    render(<Calendar mode="single" />)
    expect(screen.getByTestId('calendar')).toBeInTheDocument()
  })

  it('navigates between months', () => {
    render(<Calendar mode="single" defaultMonth={today} />)
    
    const prevButton = screen.getByRole('button', { name: /previous month/i })
    const nextButton = screen.getByRole('button', { name: /next month/i })
    
    fireEvent.click(nextButton)
    expect(screen.getByText(/abril/i)).toBeInTheDocument()
    
    fireEvent.click(prevButton)
    expect(screen.getByText(/marzo/i)).toBeInTheDocument()
  })

  it('selects a date in single mode', () => {
    const onSelect = jest.fn()
    const { rerender } = render(
      <Calendar 
        mode="single" 
        onSelect={onSelect}
        defaultMonth={today}
      />
    )

    const dayButton = findDayButton(today)
    fireEvent.click(dayButton)
    expect(onSelect).toHaveBeenCalledWith(today)

    rerender(
      <Calendar 
        mode="single" 
        selected={today}
        onSelect={onSelect}
        defaultMonth={today}
      />
    )

    expect(dayButton).toHaveAttribute('data-selected')
    expect(dayButton).toHaveAttribute('aria-selected', 'true')
  })

  it('handles range selection', () => {
    const onSelect = jest.fn()
    const startDate = today
    const endDate = addDays(today, 5)

    const { rerender } = render(
      <Calendar 
        mode="range" 
        onSelect={onSelect}
        defaultMonth={today}
      />
    )

    const startButton = findDayButton(startDate)
    fireEvent.click(startButton)
    expect(onSelect).toHaveBeenCalledWith({ from: startDate, to: undefined })

    rerender(
      <Calendar 
        mode="range" 
        selected={{ from: startDate, to: undefined }}
        onSelect={onSelect}
        defaultMonth={today}
      />
    )

    const endButton = findDayButton(endDate)
    fireEvent.click(endButton)
    expect(onSelect).toHaveBeenCalledWith({ from: startDate, to: endDate })
  })

  it('shows outside days', () => {
    const nextMonth = new Date(2025, 3, 1) // April 1st, 2025
    const outsideDay = new Date(2025, 2, 1) // March 1st, 2025
    
    render(
      <Calendar 
        mode="single"
        defaultMonth={nextMonth}
        showOutsideDays={true}
      />
    )
    
    const outsideDayButton = findDayButton(outsideDay)
    expect(outsideDayButton).toHaveAttribute('data-outside')
  })

  it('handles disabled dates', () => {
    render(
      <Calendar 
        mode="single"
        defaultMonth={today}
        disabled={{
          before: addDays(today, 1),
        }}
      />
    )
    
    const todayButton = findDayButton(today)
    expect(todayButton).toHaveAttribute('data-disabled')
    expect(todayButton).toBeDisabled()
  })

  it('highlights today', () => {
    render(
      <Calendar 
        mode="single"
        defaultMonth={today}
      />
    )
    
    const todayButton = findDayButton(today)
    expect(todayButton).toHaveAttribute('data-today')
    expect(todayButton).toHaveClass('bg-accent')
    expect(todayButton).toHaveClass('text-accent-foreground')
  })

  it('applies custom classNames', () => {
    const customClassNames = {
      day: 'custom-day',
      day_selected: 'custom-selected',
      day_today: 'custom-today'
    }

    render(
      <Calendar 
        mode="single"
        defaultMonth={today}
        classNames={customClassNames}
      />
    )
    
    const todayButton = findDayButton(today)
    expect(todayButton).toHaveClass('custom-day')
  })

  it('handles keyboard navigation', () => {
    render(
      <Calendar 
        mode="single"
        defaultMonth={today}
      />
    )
    
    const todayButton = findDayButton(today)
    todayButton.focus()
    expect(todayButton).toHaveFocus()

    fireEvent.keyDown(todayButton, { key: 'ArrowRight' })
    const nextDay = addDays(today, 1)
    const nextDayButton = findDayButton(nextDay)
    expect(nextDayButton).toHaveFocus()
  })
}) 
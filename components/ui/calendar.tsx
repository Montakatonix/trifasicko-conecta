'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, DateRange, DayPickerSingleProps, DayPickerRangeProps } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format, isSameDay, isAfter, isBefore } from 'date-fns'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BaseCalendarProps = {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  locale?: Locale
  defaultMonth?: Date
  disabled?: {
    before?: Date
    after?: Date
  }
}

type SingleCalendarProps = BaseCalendarProps & {
  mode: 'single'
  selected?: Date
  onSelect?: (date?: Date) => void
}

type RangeCalendarProps = BaseCalendarProps & {
  mode: 'range'
  selected?: DateRange
  onSelect?: (range?: DateRange) => void
}

type CalendarProps = SingleCalendarProps | RangeCalendarProps

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = es,
  defaultMonth,
  disabled,
  mode,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const today = new Date()

  const handleSelect = React.useCallback((value: unknown) => {
    if (!onSelect) return

    if (mode === 'single') {
      const date = value as Date | undefined
      onSelect(date)
    } else {
      onSelect(value as DateRange | undefined)
    }
  }, [mode, onSelect])

  const components = {
    IconLeft: () => <ChevronLeft className="h-4 w-4" />,
    IconRight: () => <ChevronRight className="h-4 w-4" />,
    Day: (props: any) => {
      const { date, selected, modifiers = {}, ...rest } = props

      const isSelected = selected || modifiers.selected || false
      const isToday = modifiers.today || false
      const isOutside = modifiers.outside || false
      const isDisabled = modifiers.disabled || false

      const dataAttributes = {
        'data-today': isToday ? '' : undefined,
        'data-selected': isSelected ? '' : undefined,
        'data-outside': isOutside ? '' : undefined,
        'data-disabled': isDisabled ? '' : undefined,
      }

      return (
        <button
          {...rest}
          {...dataAttributes}
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            isToday && "bg-accent text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            isOutside && "text-muted-foreground opacity-50",
            isDisabled && "text-muted-foreground opacity-50",
            classNames?.day,
            rest.className
          )}
          aria-label={format(date, 'dd MMMM yyyy', { locale })}
          aria-selected={isSelected}
          disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
        >
          {rest.children}
        </button>
      )
    }
  }

  const modifiers = {
    selected: (date: Date) => {
      if (mode === 'single') {
        return selected instanceof Date && isSameDay(date, selected)
      }
      if (mode === 'range' && selected) {
        const range = selected as DateRange
        return Boolean(
          (range.from && isSameDay(date, range.from)) || 
          (range.to && isSameDay(date, range.to))
        )
      }
      return false
    },
    today: (date: Date) => isSameDay(date, today),
    outside: (date: Date) => {
      if (!defaultMonth) return false
      const month = new Date(defaultMonth.getFullYear(), defaultMonth.getMonth())
      const dateMonth = new Date(date.getFullYear(), date.getMonth())
      return month.getTime() !== dateMonth.getTime()
    },
    disabled: (date: Date) => {
      if (!disabled) return false
      if (disabled.before && isBefore(date, disabled.before)) return true
      if (disabled.after && isAfter(date, disabled.after)) return true
      return false
    },
  }

  if (mode === 'single') {
    return (
      <DayPicker
        mode="single"
        selected={selected as Date | undefined}
        onSelect={handleSelect as DayPickerSingleProps['onSelect']}
        defaultMonth={defaultMonth}
        showOutsideDays={showOutsideDays}
        className={cn("rdp p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            classNames?.day
          ),
          day_range_end: "day-range-end",
          day_range_start: "day-range-start",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={components}
        modifiers={modifiers}
        locale={locale}
        data-testid="calendar"
        {...props}
      />
    )
  }

  return (
    <DayPicker
      mode="range"
      selected={selected as DateRange | undefined}
      onSelect={handleSelect as DayPickerRangeProps['onSelect']}
      defaultMonth={defaultMonth}
      showOutsideDays={showOutsideDays}
      className={cn("rdp p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          classNames?.day
        ),
        day_range_end: "day-range-end",
        day_range_start: "day-range-start",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={components}
      modifiers={modifiers}
      locale={locale}
      data-testid="calendar"
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }

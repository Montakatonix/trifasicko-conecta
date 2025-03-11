import type React from 'react'

import NextImage from 'next/image'

import { cn } from '@/lib/utils'

interface ImageProps extends React.ComponentProps<typeof NextImage> {
  className?: string
}

export function Image({ className, alt, ...props }: ImageProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg', className)}>
      <NextImage className='object-cover transition-all hover:scale-105' alt={alt} {...props} />
    </div>
  )
}

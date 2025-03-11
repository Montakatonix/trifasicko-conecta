import { Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
  avatarSrc?: string
}

export function TestimonialCard({ name, role, content, rating, avatarSrc }: TestimonialCardProps) {
  return (
    <Card className='h-full flex flex-col'>
      <CardContent className='pt-6 flex-grow'>
        <div className='flex mb-2'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <blockquote className='text-lg'>&ldquo;{content}&rdquo;</blockquote>
      </CardContent>
      <CardFooter className='border-t pt-4'>
        <div className='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='font-semibold'>{name}</div>
            <div className='text-sm text-muted-foreground'>{role}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

import { Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface UserReviewProps {
  name: string
  rating: number
  date: string
  comment: string
  avatarSrc?: string
  verifiedPurchase?: boolean
  service: 'luz' | 'internet'
}

export function UserReview({
  name,
  rating,
  date,
  comment,
  avatarSrc,
  verifiedPurchase,
  service,
}: UserReviewProps) {
  return (
    <Card className='h-full flex flex-col'>
      <CardContent className='pt-6 flex-grow'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <Badge variant={service === 'luz' ? 'default' : 'secondary'}>
            {service === 'luz' ? 'Luz' : 'Internet'}
          </Badge>
        </div>
        <p className='text-sm mb-4'>{comment}</p>
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
            <div className='text-sm text-muted-foreground'>{date}</div>
          </div>
        </div>
        {verifiedPurchase && (
          <Badge variant='outline' className='ml-auto'>
            Compra verificada
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}

'use client'

import { Facebook, Linkedin, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className='flex space-x-2'>
      <Button
        size='sm'
        variant='outline'
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            '_blank'
          )
        }
      >
        <Twitter className='h-4 w-4 mr-2' />
        Twitter
      </Button>
      <Button
        size='sm'
        variant='outline'
        onClick={() =>
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
        }
      >
        <Facebook className='h-4 w-4 mr-2' />
        Facebook
      </Button>
      <Button
        size='sm'
        variant='outline'
        onClick={() =>
          window.open(
            `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            '_blank'
          )
        }
      >
        <Linkedin className='h-4 w-4 mr-2' />
        LinkedIn
      </Button>
    </div>
  )
}

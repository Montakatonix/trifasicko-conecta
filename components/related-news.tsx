'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { getInitializedDb } from '@/lib/firebase'

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: { seconds: number }
  source: string
  category: 'energia' | 'telefonia'
}

interface RelatedNewsProps {
  currentNewsId: string
  category: 'energia' | 'telefonia'
}

export function RelatedNews({ currentNewsId, category }: RelatedNewsProps) {
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRelatedNews() {
      try {
        const db = await getInitializedDb()
        const newsRef = collection(db, 'news')
        const q = query(
          newsRef,
          where('category', '==', category),
          where('id', '!=', currentNewsId),
          orderBy('publishedAt', 'desc'),
          limit(3)
        )
        const querySnapshot = await getDocs(q)
        const news = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as NewsItem)
        setRelatedNews(news)
      } catch (err) {
        console.error('Error al cargar noticias relacionadas:', err)
        setError('Error al cargar noticias relacionadas')
      } finally {
        setLoading(false)
      }
    }
    fetchRelatedNews()
  }, [currentNewsId, category])

  if (loading) {
    return <div>Cargando noticias relacionadas...</div>
  }

  if (error) {
    return null // No mostramos el error para no afectar la experiencia del usuario
  }

  if (relatedNews.length === 0) {
    return null
  }

  return (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-4'>Noticias relacionadas</h2>
      <div className='grid gap-4 md:grid-cols-3'>
        {relatedNews.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className='text-lg'>{item.title}</CardTitle>
              <CardDescription>
                {new Date(item.publishedAt.seconds * 1000).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={`/blog/${item.id}`}>
                <Button variant='outline'>Leer más</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getInitializedDb } from '@/lib/firebase'
import type { HighlightedNews } from '@/lib/types'

export function HighlightedNewsSection() {
  const [highlights, setHighlights] = useState<HighlightedNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const db = await getInitializedDb()
        const highlightsRef = collection(db, 'highlighted_news')
        const q = query(highlightsRef, orderBy('importance', 'desc'), limit(8))
        const querySnapshot = await getDocs(q)
        const fetchedHighlights = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as HighlightedNews
        )
        setHighlights(fetchedHighlights)
      } catch (err) {
        console.error('Error al cargar noticias destacadas:', err)
        setError('Error al cargar noticias destacadas')
      } finally {
        setLoading(false)
      }
    }
    fetchHighlights()
  }, [])

  if (loading) {
    return <div>Cargando noticias destacadas...</div>
  }

  if (error) {
    return null // No mostramos el error para no afectar la experiencia del usuario
  }

  const energyHighlights = highlights.filter((h) => h.category === 'energia')
  const telecomHighlights = highlights.filter((h) => h.category === 'telefonia')

  if (highlights.length === 0) {
    return null
  }

  return (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-4'>Noticias Destacadas</h2>
      <Tabs defaultValue='energia'>
        <TabsList>
          <TabsTrigger value='energia'>Energía</TabsTrigger>
          <TabsTrigger value='telefonia'>Telefonía</TabsTrigger>
        </TabsList>
        <TabsContent value='energia'>
          <div className='grid gap-4 md:grid-cols-2'>{energyHighlights.map(renderHighlight)}</div>
        </TabsContent>
        <TabsContent value='telefonia'>
          <div className='grid gap-4 md:grid-cols-2'>{telecomHighlights.map(renderHighlight)}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderHighlight(highlight: HighlightedNews) {
  return (
    <Card key={highlight.id}>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-lg'>{highlight.title}</CardTitle>
          <Badge variant={getBadgeVariant(highlight.type)}>{highlight.type}</Badge>
        </div>
        <CardDescription>{new Date(highlight.publishedAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{highlight.description}</p>
      </CardContent>
    </Card>
  )
}

function getBadgeVariant(type: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type) {
    case 'noticia':
      return 'default'
    case 'dato':
      return 'secondary'
    case 'tendencia':
      return 'destructive'
    case 'consejo':
      return 'outline'
    default:
      return 'default'
  }
}

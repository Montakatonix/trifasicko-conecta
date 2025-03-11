'use client'

import { useEffect } from 'react'
import { storeHighlightedNewsItems, storeNewsItem } from '@/lib/news'

async function updateNews() {
  try {
    const response = await fetch('/api/update-news')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update news')
    }

    // Almacenar las noticias y destacados en Firebase
    await Promise.all([storeNewsItem(data.news), storeHighlightedNewsItems(data.highlights)])

    console.log('News and highlights updated successfully')
    return data
  } catch (error) {
    console.error('Error updating news:', error)
    throw error
  }
}

export function NewsUpdater() {
  useEffect(() => {
    const interval = setInterval(updateNews, 6 * 60 * 60 * 1000) // 6 hours
    updateNews()
    return () => clearInterval(interval)
  }, [])

  // Este componente no renderiza nada
  return null
}

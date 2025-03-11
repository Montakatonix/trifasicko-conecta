import { NextResponse } from 'next/server'

import { fetchHighlights, fetchNews } from '@/lib/news'

export async function GET() {
  if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
    return NextResponse.json({ error: 'News API key is not configured' }, { status: 500 })
  }

  try {
    // Obtener noticias del lado del servidor
    const [energyNews, telecomNews, energyHighlights, telecomHighlights] = await Promise.all([
      fetchNews('(energía eléctrica OR tarifas de luz) AND (España OR Spanish)', 'energia'),
      fetchNews(
        '(compañías telefónicas OR tarifas de internet) AND (España OR Spanish)',
        'telefonia'
      ),
      fetchHighlights('energia'),
      fetchHighlights('telefonia'),
    ])

    // Devolver los datos para que el cliente los almacene
    return NextResponse.json({
      news: [...energyNews, ...telecomNews],
      highlights: [...energyHighlights, ...telecomHighlights],
    })
  } catch (error) {
    console.error('Error fetching news and highlights:', error)
    return NextResponse.json({ error: 'Failed to fetch news and highlights' }, { status: 500 })
  }
}

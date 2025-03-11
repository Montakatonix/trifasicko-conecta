import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import type { NewsItem, NewsAPIResponse, HighlightedNews } from '@/lib/types/api-responses'
import { getInitializedDb } from './firebase'

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

// Función del lado del servidor para obtener noticias
export async function fetchNews(
  searchQuery: string,
  category: 'energia' | 'telefonia'
): Promise<NewsItem[]> {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=es&sortBy=publishedAt&apiKey=${API_KEY}`
  )
  const data = (await response.json()) as NewsAPIResponse

  return data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    publishedAt: article.publishedAt,
    source: article.source.name,
    category,
  }))
}

// Función del lado del servidor para obtener noticias destacadas
export async function fetchHighlights(
  category: 'energia' | 'telefonia'
): Promise<HighlightedNews[]> {
  // Aquí iría la lógica para obtener noticias destacadas de diversas fuentes
  // Por ahora, simularemos algunos datos

  const highlights: HighlightedNews[] = [
    {
      id: `${category}-${Date.now()}`,
      title:
        category === 'energia'
          ? 'Récord de generación solar en España'
          : 'Nueva tecnología 5G llega a más ciudades',
      description:
        category === 'energia'
          ? 'España alcanza un nuevo récord de generación solar, cubriendo el 40% de la demanda en un día'
          : 'La tecnología 5G se expande a 50 nuevas ciudades, mejorando la conectividad',
      url: 'https://ejemplo.com',
      publishedAt: new Date().toISOString(),
      source: 'Trifasicko Análisis',
      category,
      importance: 9,
      type: 'noticia',
    },
    {
      id: `${category}-${Date.now() + 1}`,
      title:
        category === 'energia' ? 'Precio de la luz hoy' : 'Velocidad media de Internet en España',
      description:
        category === 'energia'
          ? `El precio medio de la luz hoy es de ${(Math.random() * 0.15 + 0.1).toFixed(3)} €/kWh`
          : `La velocidad media de Internet en España alcanza los ${Math.floor(Math.random() * 50 + 100)} Mbps`,
      url: 'https://ejemplo.com',
      publishedAt: new Date().toISOString(),
      source: 'Trifasicko Datos',
      category,
      importance: 8,
      type: 'dato',
    },
    {
      id: `${category}-${Date.now() + 2}`,
      title:
        category === 'energia'
          ? 'Tendencia: Auge de la energía eólica marina'
          : 'Tendencia: Aumento del trabajo remoto',
      description:
        category === 'energia'
          ? 'La inversión en energía eólica marina se triplica en el último año'
          : 'El trabajo remoto impulsa la demanda de conexiones de Internet de alta velocidad en zonas rurales',
      url: 'https://ejemplo.com',
      publishedAt: new Date().toISOString(),
      source: 'Trifasicko Tendencias',
      category,
      importance: 7,
      type: 'tendencia',
    },
    {
      id: `${category}-${Date.now() + 3}`,
      title:
        category === 'energia'
          ? 'Consejo: Optimiza tu consumo en horas valle'
          : 'Consejo: Mejora tu señal Wi-Fi',
      description:
        category === 'energia'
          ? 'Programa tus electrodomésticos para funcionar en horas valle y ahorra hasta un 30% en tu factura'
          : 'Coloca tu router en un lugar central y elevado para mejorar la cobertura Wi-Fi en toda tu casa',
      url: 'https://ejemplo.com',
      publishedAt: new Date().toISOString(),
      source: 'Trifasicko Consejos',
      category,
      importance: 6,
      type: 'consejo',
    },
  ]

  return highlights
}

// Función del lado del cliente para almacenar noticias
export async function storeNewsItem(newsItems: NewsItem[]): Promise<void> {
  try {
    const db = await getInitializedDb()
    const newsRef = collection(db, 'news')

    for (const newsItem of newsItems) {
      const querySnapshot = await getDocs(
        query(newsRef, where('url', '==', newsItem.url))
      )

      if (querySnapshot.empty) {
        await addDoc(newsRef, {
          ...newsItem,
          createdAt: new Date(),
        })
      }
    }
  } catch (error) {
    console.error('Error storing news items:', error)
    throw error
  }
}

// Función del lado del cliente para almacenar noticias destacadas
export async function storeHighlightedNewsItems(highlightedNews: HighlightedNews[]): Promise<void> {
  try {
    const db = await getInitializedDb()
    const highlightedRef = collection(db, 'highlighted_news')

    for (const news of highlightedNews) {
      const querySnapshot = await getDocs(
        query(highlightedRef, where('id', '==', news.id))
      )

      if (querySnapshot.empty) {
        await addDoc(highlightedRef, {
          ...news,
          createdAt: new Date(),
        })
      }
    }
  } catch (error) {
    console.error('Error storing highlighted news:', error)
    throw error
  }
}

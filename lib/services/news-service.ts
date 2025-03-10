import type { Noticia } from "@/lib/types"

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY
const ESIOS_TOKEN = process.env.NEXT_PUBLIC_ESIOS_TOKEN

interface NewsAPIResponse {
  articles: {
    title: string
    description: string
    content: string
    url: string
    urlToImage: string
    publishedAt: string
    author: string
  }[]
}

interface ESIOSResponse {
  // Tipado para la respuesta de ESIOS
  // Se completará cuando tengamos acceso a la API
}

export async function fetchEnergyNews(): Promise<Noticia[]> {
  try {
    // Noticias generales sobre energía
    const newsApiResponse = await fetch(
      `https://newsapi.org/v2/everything?q=energia+renovable+españa&language=es&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    )
    const newsData: NewsAPIResponse = await newsApiResponse.json()

    // Datos del mercado eléctrico
    const esiosResponse = await fetch(
      "https://api.esios.ree.es/indicators/1001", // Precio mercado diario
      {
        headers: {
          "Accept": "application/json",
          "Authorization": `Token token=${ESIOS_TOKEN}`
        }
      }
    )
    const esiosData: ESIOSResponse = await esiosResponse.json()

    // Transformar noticias de NewsAPI
    const newsApiNoticias = newsData.articles.map(article => ({
      id: Math.random().toString(36).substr(2, 9),
      titulo: article.title,
      descripcion: article.description,
      contenido: article.content,
      imagen: article.urlToImage,
      categoria: "energia" as const,
      autor: article.author || "Redacción",
      fechaPublicacion: new Date(article.publishedAt),
      tags: ["energía", "renovables", "sostenibilidad"],
      slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }))

    // Aquí se agregarían más fuentes de noticias y datos

    return newsApiNoticias
  } catch (error) {
    console.error("Error fetching energy news:", error)
    return []
  }
}

export async function fetchTelecomNews(): Promise<Noticia[]> {
  try {
    // Noticias de telecomunicaciones
    const newsApiResponse = await fetch(
      `https://newsapi.org/v2/everything?q=telecomunicaciones+fibra+5g+españa&language=es&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    )
    const newsData: NewsAPIResponse = await newsApiResponse.json()

    // Datos de la CNMC
    const cnmcResponse = await fetch(
      "https://datosabiertos.cnmc.es/api/datos-telecomunicaciones"
      // Endpoint ejemplo, necesitaría configuración específica
    )
    const cnmcData = await cnmcResponse.json()

    const noticias = newsData.articles.map(article => ({
      id: Math.random().toString(36).substr(2, 9),
      titulo: article.title,
      descripcion: article.description,
      contenido: article.content,
      imagen: article.urlToImage,
      categoria: "internet" as const,
      autor: article.author || "Redacción",
      fechaPublicacion: new Date(article.publishedAt),
      tags: ["telecomunicaciones", "fibra", "5G", "internet"],
      slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }))

    return noticias
  } catch (error) {
    console.error("Error fetching telecom news:", error)
    return []
  }
}

// Función para mantener las noticias actualizadas en Firestore
export async function syncNewsToFirestore(db: any) {
  const energyNews = await fetchEnergyNews()
  const telecomNews = await fetchTelecomNews()
  
  const batch = db.batch()
  
  // Actualizar noticias de energía
  energyNews.forEach(noticia => {
    const ref = db.collection("noticias").doc(noticia.id)
    batch.set(ref, {
      ...noticia,
      fechaPublicacion: new Date(noticia.fechaPublicacion),
      updatedAt: new Date()
    })
  })

  // Actualizar noticias de telecomunicaciones
  telecomNews.forEach(noticia => {
    const ref = db.collection("noticias").doc(noticia.id)
    batch.set(ref, {
      ...noticia,
      fechaPublicacion: new Date(noticia.fechaPublicacion),
      updatedAt: new Date()
    })
  })

  await batch.commit()
} 
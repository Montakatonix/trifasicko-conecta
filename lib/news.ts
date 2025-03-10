import { db } from "./firebase"
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore"

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  category: "energia" | "telefonia"
}

export interface HighlightedNews {
  id: string
  importance: number
  category: "energia" | "telefonia"
  type: "noticia" | "dato" | "tendencia" | "consejo"
  title: string
  description: string
  publishedAt: string
  url?: string
  source: string
}

export async function fetchAndStoreNews() {
  const energyNews = await fetchNews("(energía eléctrica OR tarifas de luz) AND (España OR Spanish)", "energia")
  const telecomNews = await fetchNews(
    "(compañías telefónicas OR tarifas de internet) AND (España OR Spanish)",
    "telefonia",
  )

  const allNews = [...energyNews, ...telecomNews]

  for (const news of allNews) {
    await storeNewsItem(news)
  }
}

export async function fetchAndStoreHighlightedNews() {
  const energyHighlights = await fetchHighlights("energia")
  const telecomHighlights = await fetchHighlights("telefonia")

  const allHighlights = [...energyHighlights, ...telecomHighlights]

  for (const highlight of allHighlights) {
    await storeHighlightedNewsItem(highlight)
  }
}

async function fetchNews(query: string, category: "energia" | "telefonia"): Promise<NewsItem[]> {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=es&sortBy=publishedAt&apiKey=${API_KEY}`,
  )
  const data = await response.json()

  return data.articles.map((article: any) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    publishedAt: article.publishedAt,
    source: article.source.name,
    category,
  }))
}

async function fetchHighlights(category: "energia" | "telefonia"): Promise<HighlightedNews[]> {
  // Aquí iría la lógica para obtener noticias destacadas de diversas fuentes
  // Por ahora, simularemos algunos datos

  const highlights: HighlightedNews[] = [
    {
      id: `${category}-${Date.now()}`,
      title:
        category === "energia" ? "Récord de generación solar en España" : "Nueva tecnología 5G llega a más ciudades",
      description:
        category === "energia"
          ? "España alcanza un nuevo récord de generación solar, cubriendo el 40% de la demanda en un día"
          : "La tecnología 5G se expande a 50 nuevas ciudades, mejorando la conectividad",
      url: "https://ejemplo.com",
      publishedAt: new Date().toISOString(),
      source: "Trifasicko Análisis",
      category,
      importance: 9,
      type: "noticia",
    },
    {
      id: `${category}-${Date.now() + 1}`,
      title: category === "energia" ? "Precio de la luz hoy" : "Velocidad media de Internet en España",
      description:
        category === "energia"
          ? `El precio medio de la luz hoy es de ${(Math.random() * 0.15 + 0.1).toFixed(3)} €/kWh`
          : `La velocidad media de Internet en España alcanza los ${Math.floor(Math.random() * 50 + 100)} Mbps`,
      url: "https://ejemplo.com",
      publishedAt: new Date().toISOString(),
      source: "Trifasicko Datos",
      category,
      importance: 8,
      type: "dato",
    },
    {
      id: `${category}-${Date.now() + 2}`,
      title:
        category === "energia"
          ? "Tendencia: Auge de la energía eólica marina"
          : "Tendencia: Aumento del trabajo remoto",
      description:
        category === "energia"
          ? "La inversión en energía eólica marina se triplica en el último año"
          : "El trabajo remoto impulsa la demanda de conexiones de Internet de alta velocidad en zonas rurales",
      url: "https://ejemplo.com",
      publishedAt: new Date().toISOString(),
      source: "Trifasicko Tendencias",
      category,
      importance: 7,
      type: "tendencia",
    },
    {
      id: `${category}-${Date.now() + 3}`,
      title: category === "energia" ? "Consejo: Optimiza tu consumo en horas valle" : "Consejo: Mejora tu señal Wi-Fi",
      description:
        category === "energia"
          ? "Programa tus electrodomésticos para funcionar en horas valle y ahorra hasta un 30% en tu factura"
          : "Coloca tu router en un lugar central y elevado para mejorar la cobertura Wi-Fi en toda tu casa",
      url: "https://ejemplo.com",
      publishedAt: new Date().toISOString(),
      source: "Trifasicko Consejos",
      category,
      importance: 6,
      type: "consejo",
    },
  ]

  return highlights
}

async function storeNewsItem(news: NewsItem) {
  const newsRef = collection(db, "news")
  const q = query(newsRef, where("url", "==", news.url))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    await addDoc(newsRef, {
      ...news,
      publishedAt: Timestamp.fromDate(new Date(news.publishedAt)),
      createdAt: Timestamp.now(),
    })
  }
}

async function storeHighlightedNewsItem(news: HighlightedNews) {
  const newsRef = collection(db, "highlighted_news")
  const q = query(newsRef, where("id", "==", news.id))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    await addDoc(newsRef, {
      ...news,
      publishedAt: Timestamp.fromDate(new Date(news.publishedAt)),
      createdAt: Timestamp.now(),
    })
  }
}


import { Firestore, collection, doc, writeBatch } from 'firebase/firestore'
import type { NewsItem, EsiosResponse, CnmcResponse } from '@/lib/types/api-responses'

export async function fetchEnergyNews(): Promise<NewsItem[]> {
  try {
    const esiosResponse = await fetch('https://api.esios.ree.es/indicators/1001', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Host': 'api.esios.ree.es',
        'Authorization': `Token token=${process.env.NEXT_PUBLIC_ESIOS_TOKEN}`,
      },
    })
    const esiosData = (await esiosResponse.json()) as EsiosResponse

    // Procesar datos de ESIOS para crear noticias
    const energyNews: NewsItem[] = esiosData.data.map(item => ({
      title: `Precio de la energía: ${item.price}€/MWh`,
      description: `Precio de la energía registrado el ${new Date(item.timestamp).toLocaleDateString()}`,
      url: 'https://www.esios.ree.es/es/mercados-y-precios',
      publishedAt: item.timestamp,
      source: 'ESIOS',
      category: 'energia',
    }))

    return energyNews
  } catch (error) {
    console.error('Error fetching energy news:', error)
    return []
  }
}

export async function fetchTelecomNews(): Promise<NewsItem[]> {
  try {
    const cnmcResponse = await fetch('https://api.cnmc.es/telecoms/speeds', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const cnmcData = (await cnmcResponse.json()) as CnmcResponse

    // Procesar datos de CNMC para crear noticias
    const telecomNews: NewsItem[] = cnmcData.data.map(item => ({
      title: `Velocidad media de Internet: ${item.speed}Mbps`,
      description: `Velocidad media de Internet en ${item.region}`,
      url: 'https://www.cnmc.es/ambitos-de-actuacion/telecomunicaciones',
      publishedAt: new Date().toISOString(),
      source: 'CNMC',
      category: 'telefonia',
    }))

    return telecomNews
  } catch (error) {
    console.error('Error fetching telecom news:', error)
    return []
  }
}

// Función para mantener las noticias actualizadas en Firestore
export async function syncNewsToFirestore(db: Firestore) {
  if (!db) {
    throw new Error('Firestore instance is required')
  }

  try {
    const energyNews = await fetchEnergyNews()
    const telecomNews = await fetchTelecomNews()

    const batch = writeBatch(db)
    const noticiasRef = collection(db, 'noticias')

    // Actualizar noticias de energía
    energyNews.forEach((noticia) => {
      const docId = `energia-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      const docRef = doc(noticiasRef, docId)
      batch.set(docRef, {
        ...noticia,
        id: docId,
        publishedAt: new Date(noticia.publishedAt),
        updatedAt: new Date(),
      })
    })

    // Actualizar noticias de telecomunicaciones
    telecomNews.forEach((noticia) => {
      const docId = `telefonia-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      const docRef = doc(noticiasRef, docId)
      batch.set(docRef, {
        ...noticia,
        id: docId,
        publishedAt: new Date(noticia.publishedAt),
        updatedAt: new Date(),
      })
    })

    await batch.commit()
    console.log('Noticias sincronizadas correctamente')
  } catch (error) {
    console.error('Error al sincronizar noticias:', error)
    throw error
  }
}

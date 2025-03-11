export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ComparisonResult {
  id: string
  userId: string
  type: 'luz' | 'internet'
  date: string
  results: unknown[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  preferences: Record<string, unknown>
}

export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Tipos específicos para respuestas de APIs externas
export interface NewsAPIArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
  author?: string
  content?: string
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

export interface EsiosDataPoint {
  price: number
  timestamp: string
  unit: string
  market: string
}

export interface EsiosResponse {
  success: boolean
  data: EsiosDataPoint[]
  metadata: {
    lastUpdate: string
    nextUpdate: string
  }
}

export interface CnmcDataPoint {
  speed: number
  region: string
  technology: string
  operator: string
  date: string
}

export interface CnmcResponse {
  success: boolean
  data: CnmcDataPoint[]
  metadata: {
    period: string
    source: string
  }
}

export interface InstallerInfo {
  name: string
  phone: string
  distance: number
  availability: string[]
  rating: number
  reviews: number
}

export interface CoverageResponse {
  available: boolean
  installers: InstallerInfo[]
  estimatedInstallationTime: string
  coverage: {
    type: string
    quality: number
    restrictions?: string[]
  }
}

export interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  category: 'energia' | 'telefonia'
}

export interface HighlightedNews extends NewsItem {
  id: string
  importance: number
  type: 'noticia' | 'dato' | 'tendencia' | 'consejo'
}

export interface SecurityCoverage {
  available: boolean
  installers: {
    name: string
    phone: string
    distance: number
  }[]
  estimatedInstallationTime: string
} 
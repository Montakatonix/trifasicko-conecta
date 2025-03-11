// Tipos para el comparador de tarifas de luz
export interface TarifaLuz {
  id: string
  compañia: string
  nombre: string
  precio: number
  potenciaContratada?: number
  descuento?: number
  tipo?: 'fijo' | 'variable'
  urlContratacion?: string
  logoUrl?: string
}

export interface ConsumoElectrico {
  consumoPunta?: number
  consumoValle?: number
}

export interface Electrodomestico {
  nombre: string
  potencia: number
  uso: 'simultaneo' | 'individual'
  horasUso?: number
  cantidad?: number
}

// Tipos para el comparador de tarifas de internet
export interface FiltrosInternet {
  codigoPostal: string
  velocidadMinima: number
  tipoConexion: string
  precioMaximo: number
  sinPermanencia: boolean
}

export interface TarifaInternet {
  id: string
  operador: string
  nombre: string
  velocidadBajada: number
  velocidadSubida: number
  precio: number
  permanencia: number
  cobertura: string[]
  caracteristicas: string[]
  urlContratacion: string
  logoUrl: string
}

// Tipos para reseñas y valoraciones
export interface Review {
  id: string
  userId: string
  userName: string
  servicio: 'luz' | 'internet'
  proveedor: string
  puntuacion: number
  comentario: string
  pros?: string[]
  contras?: string[]
  createdAt: Date
  updatedAt?: Date
}

// Tipos para noticias y blog
export interface Noticia {
  id: string
  titulo: string
  descripcion: string
  contenido: string
  imagen: string
  categoria: 'energia' | 'internet' | 'sostenibilidad'
  autor: string
  fechaPublicacion: Date
  tags: string[]
  slug: string
}

// Tipos para el perfil de usuario
export interface PerfilUsuario {
  id: string
  nombre: string
  email: string
  direccion?: {
    calle: string
    numero: string
    piso?: string
    codigoPostal: string
    ciudad: string
    provincia: string
  }
  serviciosContratados?: {
    luz?: {
      comercializadora: string
      tarifa: string
      potenciaContratada: number
      cups: string
    }
    internet?: {
      operador: string
      tarifa: string
      velocidad: number
      tipoConexion: string
    }
  }
  comparacionesGuardadas?: {
    luz: string[]
    internet: string[]
  }
  notificaciones: boolean
  createdAt: Date
  updatedAt: Date
}

// Tipos para el foro y noticias
export interface ForumPost {
  id: string
  titulo: string
  contenido: string
  autor: {
    id: string
    nombre: string
    avatar?: string
  }
  categoria: 'energia' | 'telefonia' | 'inmobiliaria' | 'seguridad'
  tags: string[]
  likes: number
  comentarios: Comentario[]
  createdAt: Date
  updatedAt?: Date
}

export interface Comentario {
  id: string
  contenido: string
  autor: {
    id: string
    nombre: string
    avatar?: string
  }
  createdAt: Date
  updatedAt?: Date
}

// Tipos para sistemas de seguridad
export interface SistemaSeguridad {
  id: string
  nombre: string
  proveedor: string
  tipo: 'alarma' | 'camara' | 'kit' | 'sensor'
  precio: number
  precioInstalacion: number
  cuotaMensual: number
  caracteristicas: string[]
  especificaciones: {
    conectividad?: string[]
    alimentacion?: string
    resolucion?: string
    angulo?: string
    almacenamiento?: string
    sensores?: string[]
  }
  compatibilidad: string[]
  garantia: number
  urlContratacion: string
  imagenes: string[]
  videoDemo?: string
}

// Tipos para inmobiliaria
export interface Inmueble {
  id: string
  tipo: 'piso' | 'casa' | 'chalet' | 'local' | 'oficina'
  operacion: 'venta' | 'alquiler'
  titulo: string
  descripcion: string
  precio: number
  superficie: number
  habitaciones?: number
  banos?: number
  caracteristicas: string[]
  servicios: {
    agua: boolean
    luz: boolean
    gas: boolean
    internet: boolean
  }
  eficienciaEnergetica: {
    certificado: string
    consumoAnual: number
    emisiones: number
  }
  ubicacion: {
    direccion: string
    codigoPostal: string
    ciudad: string
    provincia: string
    coordenadas: {
      lat: number
      lng: number
    }
  }
  imagenes: string[]
  video360?: string
  contacto: {
    nombre: string
    telefono: string
    email: string
    horario?: string
  }
  createdAt: Date
  updatedAt?: Date
}

export interface FiltrosInmuebles {
  tipo?: string[]
  operacion: 'venta' | 'alquiler'
  precioMin?: number
  precioMax?: number
  superficieMin?: number
  superficieMax?: number
  habitacionesMin?: number
  banosMin?: number
  ciudad?: string
  provincia?: string
  codigoPostal?: string
  serviciosRequeridos?: ('agua' | 'luz' | 'gas' | 'internet')[]
  eficienciaEnergeticaMin?: string
}

export interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  category: 'energia' | 'telefonia'
}

export interface HighlightedNews {
  id: string
  importance: number
  category: 'energia' | 'telefonia'
  type: 'noticia' | 'dato' | 'tendencia' | 'consejo'
  title: string
  description: string
  publishedAt: string
  url?: string
  source: string
}

export type SecuritySystemType = 'alarma' | 'camara' | 'kit' | 'sensor'

export interface SecuritySystem {
  id: string
  name: string
  brand: string
  type: SecuritySystemType
  description: string[]
  features: string[]
  price: number
  monthlyFee: number
  connectivity: string[]
  powerSource: string
  sensorTypes: string[]
  compatibility: string[]
  productUrl: string
  imageUrl: string
  videoUrl?: string
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

export interface FiltrosLuz {
  potenciaMinima: number
  potenciaMaxima: number
  precioMaximoKWh: number
  discriminacionHoraria: boolean
  sinPermanencia: boolean
}

export interface ConsumoInternet {
  velocidadMinima: number
  tipoConexion: string
  codigoPostal: string
}

export interface Ahorro {
  ahorroAnual: number
  mejorTarifaLuz?: TarifaLuz
  mejorTarifaInternet?: TarifaInternet
}

export interface FormularioContacto {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
}

// Tipos para el comparador de propiedades
export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: 'casa' | 'piso'
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  features: string[]
  status: 'disponible' | 'reservado' | 'vendido'
  yearBuilt?: number
  parking?: number
  garden?: boolean
  pool?: boolean
  terrace?: boolean
  furnished?: boolean
  energyRating?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface PropertyFilters {
  location?: string
  minPrice?: number
  maxPrice?: number
  type?: 'casa' | 'piso' | 'all'
  minBedrooms?: number
  minBathrooms?: number
  minArea?: number
  maxArea?: number
  features?: string[]
  status?: 'disponible' | 'reservado' | 'vendido'
  furnished?: boolean
  garden?: boolean
  pool?: boolean
  terrace?: boolean
}

export interface PropertySearchResponse {
  properties: Property[]
  total: number
  page: number
  totalPages: number
}

// Tipos comunes
export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
  service: 'luz' | 'internet' | 'propiedad'
  propertyId?: string
}

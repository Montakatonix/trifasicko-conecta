import type { SecurityCoverage } from '@/lib/types/api-responses'
import { errorRecovery } from '@/lib/services/error-recovery'

const ADT_API_KEY = process.env.NEXT_PUBLIC_ADT_API_KEY
const SECURITAS_API_KEY = process.env.NEXT_PUBLIC_SECURITAS_API_KEY

// Función de utilidad para hacer peticiones fetch con manejo de errores
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      await errorRecovery.handleError(error)
    }
    throw error
  }
}

interface InstallerResponse {
  name: string
  phone: string
  distance: number
}

interface ADTCoverageResponse {
  available: boolean
  installers: InstallerResponse[]
  estimatedTime: string
}

interface SecuritasCoverageResponse {
  available: boolean
  installers: InstallerResponse[]
  installTime: string
}

interface ADTProduct {
  id: string
  name: string
  type: string
  price: number
  installationFee: number
  monthlyFee: number
  features: string[]
  connectivity: string[]
  powerSupply: string
  resolution?: string
  angle?: string
  storage?: string
  sensors: string[]
  compatibility: string[]
  purchaseUrl: string
  images: string[]
  demoVideo?: string
  warranty: number
}

interface SecuritySystem {
  id: string
  nombre: string
  proveedor: string
  tipo: 'alarma' | 'camara' | 'kit' | 'sensor'
  precio: number
  precioInstalacion: number
  cuotaMensual: number
  caracteristicas: string[]
  especificaciones: {
    conectividad: string[]
    alimentacion: string
    resolucion?: string
    angulo?: string
    almacenamiento?: string
    sensores: string[]
  }
  compatibilidad: string[]
  garantia: number
  urlContratacion: string
  imagenes: string[]
  videoDemo?: string
}

export async function checkSecurityCoverage(codigoPostal: string): Promise<SecurityCoverage> {
  try {
    const [adtData, securitasData] = await Promise.all([
      safeFetch<ADTCoverageResponse>(
        `https://api.adt.es/coverage/${codigoPostal}`,
        {
          headers: {
            Authorization: `Bearer ${ADT_API_KEY}`,
          },
        }
      ),
      safeFetch<SecuritasCoverageResponse>(
        'https://api.securitas.es/coverage',
        {
          headers: {
            'X-API-Key': SECURITAS_API_KEY || '',
          },
        }
      )
    ])

    return {
      available: true,
      installers: [
        ...(adtData.installers || []).map((installer) => ({
          name: installer.name,
          phone: installer.phone,
          distance: installer.distance
        })),
        ...(securitasData.installers || []).map((installer) => ({
          name: installer.name,
          phone: installer.phone,
          distance: installer.distance
        }))
      ],
      estimatedInstallationTime: adtData.estimatedTime || securitasData.installTime || '3-5 días hábiles'
    }
  } catch (error) {
    if (error instanceof Error) {
      await errorRecovery.handleError(error)
    }
    return {
      available: false,
      installers: [],
      estimatedInstallationTime: '3-5 días hábiles'
    }
  }
}

export async function fetchSecuritySystems(): Promise<SecuritySystem[]> {
  try {
    // Obtener productos de ADT
    const adtProducts = await safeFetch<ADTProduct[]>('https://api.adt.es/products', {
      headers: {
        Authorization: `Bearer ${ADT_API_KEY}`,
      },
    })

    // Obtener productos de Securitas como complemento
    const securitasProducts = await safeFetch<ADTProduct[]>('https://api.securitas.es/products', {
      headers: {
        'X-API-Key': SECURITAS_API_KEY || '',
      },
    })

    // Transformar productos a nuestro formato
    const sistemas: SecuritySystem[] = [
      ...adtProducts.map(transformADTProduct),
      ...securitasProducts.map(transformSecuritasProduct),
    ]

    return sistemas
  } catch (error) {
    if (error instanceof Error) {
      await errorRecovery.handleError(error)
    }
    // Devolver datos de ejemplo si las APIs fallan
    return defaultSecuritySystems
  }
}

// Funciones auxiliares para transformar datos
function transformADTProduct(product: ADTProduct): SecuritySystem {
  return {
    id: product.id,
    nombre: product.name,
    proveedor: 'ADT',
    tipo: mapProductType(product.type),
    precio: product.price,
    precioInstalacion: product.installationFee,
    cuotaMensual: product.monthlyFee,
    caracteristicas: product.features,
    especificaciones: {
      conectividad: product.connectivity,
      alimentacion: product.powerSupply,
      resolucion: product.resolution,
      angulo: product.angle,
      almacenamiento: product.storage,
      sensores: product.sensors,
    },
    compatibilidad: product.compatibility,
    garantia: product.warranty,
    urlContratacion: product.purchaseUrl,
    imagenes: product.images,
    videoDemo: product.demoVideo,
  }
}

function transformSecuritasProduct(product: ADTProduct): SecuritySystem {
  // Transformación similar para productos de Securitas
  // Se implementará cuando tengamos acceso a su API
  return transformADTProduct(product)
}

function mapProductType(type: string): 'alarma' | 'camara' | 'kit' | 'sensor' {
  const typeMap: Record<string, 'alarma' | 'camara' | 'kit' | 'sensor'> = {
    alarm: 'alarma',
    camera: 'camara',
    kit: 'kit',
    sensor: 'sensor',
  }
  return typeMap[type.toLowerCase()] || 'kit'
}

// Datos de ejemplo para fallback
const defaultSecuritySystems: SecuritySystem[] = [
  {
    id: '1',
    nombre: 'Kit Básico ADT',
    proveedor: 'ADT',
    tipo: 'kit',
    precio: 299,
    precioInstalacion: 99,
    cuotaMensual: 39.9,
    caracteristicas: [
      'Panel de control Smart',
      '2 sensores de movimiento',
      '3 sensores de puerta/ventana',
      'Sirena interior',
      'Conexión 24/7 con central receptora',
    ],
    especificaciones: {
      conectividad: ['WiFi', 'GSM'],
      alimentacion: 'Red eléctrica con batería de respaldo',
      sensores: ['Movimiento', 'Apertura', 'Temperatura'],
    },
    compatibilidad: ['Alexa', 'Google Assistant'],
    garantia: 24,
    urlContratacion: 'https://adt.es/kit-basico',
    imagenes: ['/images/adt/kit-basico.jpg'],
    videoDemo: 'https://youtube.com/watch?v=demo-kit-basico',
  },
]

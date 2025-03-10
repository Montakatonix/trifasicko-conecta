import type { SistemaSeguridad } from "@/lib/types"

const ADT_API_KEY = process.env.NEXT_PUBLIC_ADT_API_KEY
const SECURITAS_API_KEY = process.env.NEXT_PUBLIC_SECURITAS_API_KEY

interface CoverageResponse {
  available: boolean
  installers: {
    name: string
    phone: string
    distance: number
  }[]
  estimatedInstallationTime: string
}

export async function checkSecurityCoverage(codigoPostal: string): Promise<CoverageResponse> {
  try {
    // Verificar cobertura con ADT
    const adtResponse = await fetch(
      `https://api.adt.es/coverage/${codigoPostal}`,
      {
        headers: new Headers({
          "Authorization": `Bearer ${ADT_API_KEY}`
        })
      }
    )
    const adtData = await adtResponse.json()

    // Verificar cobertura con Securitas Direct como backup
    const securitasResponse = await fetch(
      `https://api.securitas.es/coverage/check?postal_code=${codigoPostal}`,
      {
        headers: new Headers({
          "X-API-Key": SECURITAS_API_KEY || ""
        })
      }
    )
    const securitasData = await securitasResponse.json()

    // Combinar resultados
    return {
      available: adtData.available || securitasData.available,
      installers: [
        ...adtData.installers || [],
        ...securitasData.installers || []
      ],
      estimatedInstallationTime: adtData.estimatedTime || securitasData.installTime || "3-5 días hábiles"
    }
  } catch (error) {
    console.error("Error checking security coverage:", error)
    // Respuesta por defecto si las APIs fallan
    return {
      available: true,
      installers: [],
      estimatedInstallationTime: "3-5 días hábiles"
    }
  }
}

export async function fetchSecuritySystems(): Promise<SistemaSeguridad[]> {
  try {
    // Obtener productos de ADT
    const adtResponse = await fetch(
      "https://api.adt.es/products",
      {
        headers: new Headers({
          "Authorization": `Bearer ${ADT_API_KEY}`
        })
      }
    )
    const adtProducts = await adtResponse.json()

    // Obtener productos de Securitas como complemento
    const securitasResponse = await fetch(
      "https://api.securitas.es/products",
      {
        headers: new Headers({
          "X-API-Key": SECURITAS_API_KEY || ""
        })
      }
    )
    const securitasProducts = await securitasResponse.json()

    // Transformar productos a nuestro formato
    const sistemas: SistemaSeguridad[] = [
      ...adtProducts.map(transformADTProduct),
      ...securitasProducts.map(transformSecuritasProduct)
    ]

    return sistemas
  } catch (error) {
    console.error("Error fetching security systems:", error)
    // Devolver datos de ejemplo si las APIs fallan
    return defaultSecuritySystems
  }
}

// Funciones auxiliares para transformar datos
function transformADTProduct(product: any): SistemaSeguridad {
  return {
    id: product.id,
    nombre: product.name,
    proveedor: "ADT",
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
      sensores: product.sensors
    },
    compatibilidad: product.compatibility,
    garantia: product.warranty,
    urlContratacion: product.purchaseUrl,
    imagenes: product.images,
    videoDemo: product.demoVideo
  }
}

function transformSecuritasProduct(product: any): SistemaSeguridad {
  // Transformación similar para productos de Securitas
  // Se implementará cuando tengamos acceso a su API
  return {} as SistemaSeguridad
}

function mapProductType(type: string): "alarma" | "camara" | "kit" | "sensor" {
  const typeMap: Record<string, "alarma" | "camara" | "kit" | "sensor"> = {
    "alarm": "alarma",
    "camera": "camara",
    "kit": "kit",
    "sensor": "sensor"
  }
  return typeMap[type.toLowerCase()] || "kit"
}

// Datos de ejemplo para fallback
const defaultSecuritySystems: SistemaSeguridad[] = [
  {
    id: "1",
    nombre: "Kit Básico ADT",
    proveedor: "ADT",
    tipo: "kit",
    precio: 299,
    precioInstalacion: 99,
    cuotaMensual: 39.90,
    caracteristicas: [
      "Panel de control Smart",
      "2 sensores de movimiento",
      "3 sensores de puerta/ventana",
      "Sirena interior",
      "Conexión 24/7 con central receptora"
    ],
    especificaciones: {
      conectividad: ["WiFi", "GSM"],
      alimentacion: "Red eléctrica con batería de respaldo",
      sensores: ["Movimiento", "Apertura", "Temperatura"]
    },
    compatibilidad: ["Alexa", "Google Assistant"],
    garantia: 24,
    urlContratacion: "https://adt.es/kit-basico",
    imagenes: ["/images/adt/kit-basico.jpg"],
    videoDemo: "https://youtube.com/watch?v=demo-kit-basico"
  }
  // Más sistemas de ejemplo...
] 
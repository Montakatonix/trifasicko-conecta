import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ConsumoElectrico, FiltrosInternet, TarifaInternet, TarifaLuz } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para calcular el coste mensual de una tarifa de luz
export function calcularCosteLuz(tarifa: TarifaLuz, consumo: ConsumoElectrico): number {
  let costeTotal = 0

  // Coste por potencia contratada (término fijo)
  const costePotencia = tarifa.potenciaContratada * consumo.potenciaContratada * 30 // €/kW/día * kW * días

  if (
    consumo.discriminacionHoraria &&
    consumo.consumoPunta !== undefined &&
    consumo.consumoValle !== undefined &&
    tarifa.precioKwhPunta &&
    tarifa.precioKwhValle
  ) {
    // Coste con discriminación horaria
    costeTotal =
      costePotencia +
      tarifa.precioKwhPunta * consumo.consumoPunta +
      tarifa.precioKwhValle * consumo.consumoValle
  } else if (tarifa.precioKWh) {
    // Coste sin discriminación horaria
    costeTotal = costePotencia + tarifa.precioKWh * consumo.consumoMensual
  } else if (tarifa.precioKwhPunta) {
    // Si no hay precio único, usar el precio punta como fallback
    costeTotal = costePotencia + tarifa.precioKwhPunta * consumo.consumoMensual
  }

  // Aplicar descuento si existe
  if (tarifa.descuento) {
    costeTotal *= 1 - tarifa.descuento / 100
  }

  // Aplicar impuestos
  const impuestoElectricidad = 0.0511269632 // 5.11269632%
  costeTotal *= 1 + impuestoElectricidad

  // IVA
  costeTotal *= 1.21 // 21% IVA

  return Number(costeTotal.toFixed(2))
}

// Función para filtrar tarifas de internet según criterios
export function filtrarTarifasInternet(
  tarifas: TarifaInternet[],
  filtros: FiltrosInternet
): TarifaInternet[] {
  return tarifas.filter((tarifa) => {
    // Verificar cobertura
    if (!tarifa.cobertura.includes(filtros.codigoPostal)) {
      return false
    }

    // Verificar velocidad mínima
    if (tarifa.velocidadBajada < filtros.velocidadMinima) {
      return false
    }

    // Verificar tipo de conexión
    if (tarifa.tipo !== filtros.tipoConexion) {
      return false
    }

    // Verificar precio máximo
    if (tarifa.precio > filtros.precioMaximo) {
      return false
    }

    // Verificar permanencia
    if (filtros.sinPermanencia && tarifa.permanencia > 0) {
      return false
    }

    return true
  })
}

// Función para ordenar tarifas por precio
export function ordenarTarifasPorPrecio(tarifas: TarifaInternet[]): TarifaInternet[] {
  return [...tarifas].sort((a, b) => a.precio - b.precio)
}

// Función para calcular el ahorro anual entre dos tarifas
export function calcularAhorroAnual(tarifaActual: number, tarifaNueva: number): number {
  const ahorroMensual = tarifaActual - tarifaNueva
  const ahorroAnual = ahorroMensual * 12
  return Number(ahorroAnual.toFixed(2))
}

// Función para formatear precios
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio)
}

// Función para validar un CUPS (Código Universal de Punto de Suministro)
export function validarCUPS(cups: string): boolean {
  // El CUPS tiene 20 o 22 caracteres
  if (!/^[A-Z]{2}\d{16}[A-Z0-9]{2}(\d{2})?$/.test(cups)) {
    return false
  }

  // Los dos primeros caracteres deben ser ES para España
  if (cups.substring(0, 2) !== 'ES') {
    return false
  }

  return true
}

// Función para validar un código postal español
export function validarCodigoPostal(codigoPostal: string): boolean {
  return /^[0-9]{5}$/.test(codigoPostal)
}

// Función para calcular la potencia recomendada según consumo y equipamiento
export interface Electrodomestico {
  nombre: string
  potencia: number
  uso: 'simultaneo' | 'individual'
}

export function calcularPotenciaRecomendada(electrodomesticos: Electrodomestico[]): number {
  // Separar electrodomésticos por tipo de uso
  const simultaneos = electrodomesticos.filter((e) => e.uso === 'simultaneo')
  const individuales = electrodomesticos.filter((e) => e.uso === 'individual')

  // Sumar potencias de uso simultáneo
  const potenciaSimultanea = simultaneos.reduce((sum, e) => sum + e.potencia, 0)

  // Encontrar el electrodoméstico individual de mayor potencia
  const potenciaIndividualMax = Math.max(...individuales.map((e) => e.potencia), 0)

  // La potencia recomendada es la suma de ambas
  const potenciaTotal = potenciaSimultanea + potenciaIndividualMax

  // Redondear a la potencia normalizada superior más cercana
  const potenciasNormalizadas = [2.3, 3.45, 4.6, 5.75, 6.9, 8.05, 9.2, 10.35, 11.5, 14.49]
  return (
    potenciasNormalizadas.find((p) => p >= potenciaTotal) ||
    potenciasNormalizadas[potenciasNormalizadas.length - 1]
  )
}

import { NextResponse } from 'next/server'

// Datos de ejemplo (en una implementación real, estos vendrían de una base de datos)
const tarifas = [
  { id: 1, nombre: 'Tarifa Básica', tipo: 'luz', precio: 0.12, compania: 'EnergíaPlus' },
  { id: 2, nombre: 'Tarifa Eco', tipo: 'luz', precio: 0.14, compania: 'NaturalPower' },
  { id: 3, nombre: 'Fibra 300Mb', tipo: 'internet', precio: 29.99, compania: 'FibraMax' },
  { id: 4, nombre: 'Fibra 600Mb', tipo: 'internet', precio: 39.99, compania: 'VelocityNet' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo')

  let resultado = tarifas

  if (tipo) {
    resultado = tarifas.filter((tarifa) => tarifa.tipo === tipo)
  }

  return NextResponse.json(resultado)
}

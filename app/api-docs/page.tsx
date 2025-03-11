import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentación API | Trifasicko Conecta',
  description: 'Documentación para desarrolladores de la API de Trifasicko Conecta.',
}

export default function ApiDocsPage() {
  return (
    <div className='container py-12'>
      <h1 className='text-3xl font-bold mb-6'>Documentación API</h1>
      <p className='text-muted-foreground mb-8'>
        Bienvenido a la documentación de la API de Trifasicko Conecta. Esta API permite a los
        desarrolladores acceder a nuestros datos de tarifas de luz e internet.
      </p>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Autenticación</h2>
        <p>
          Actualmente, la API no requiere autenticación. Sin embargo, en el futuro, implementaremos
          un sistema de API keys para un acceso más seguro y controlado.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Endpoints</h2>

        <div className='space-y-4'>
          <div>
            <h3 className='text-xl font-medium'>GET /api/tarifas</h3>
            <p>Retorna una lista de todas las tarifas disponibles.</p>
            <h4 className='font-medium mt-2'>Parámetros de consulta opcionales:</h4>
            <ul className='list-disc list-inside'>
              <li>
                <code>tipo</code>: Filtra las tarifas por tipo ("luz" o "internet")
              </li>
            </ul>
            <h4 className='font-medium mt-2'>Ejemplo de respuesta:</h4>
            <pre className='bg-muted p-4 rounded-md overflow-x-auto'>
              {JSON.stringify(
                [
                  {
                    id: 1,
                    nombre: 'Tarifa Básica',
                    tipo: 'luz',
                    precio: 0.12,
                    compania: 'EnergíaPlus',
                  },
                  {
                    id: 2,
                    nombre: 'Tarifa Eco',
                    tipo: 'luz',
                    precio: 0.14,
                    compania: 'NaturalPower',
                  },
                ],
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-4'>Límites de uso</h2>
        <p>
          Actualmente no hay límites de uso establecidos. Sin embargo, te pedimos que hagas un uso
          responsable de la API para garantizar su disponibilidad para todos los usuarios.
        </p>
      </section>
    </div>
  )
}

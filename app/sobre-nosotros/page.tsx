import type { Metadata } from 'next'

import { CheckCircle } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Image } from '@/components/ui/image'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Trifasicko Conecta',
  description:
    'Conoce más sobre Trifasicko Conecta, nuestra misión y el equipo detrás de nuestro servicio de comparación de tarifas.',
}

const teamMembers = [
  {
    name: 'Ana Sánchez',
    role: 'CEO y Fundadora',
    bio: 'Con más de 15 años de experiencia en el sector energético, Ana fundó Trifasicko Conecta con la misión de hacer el mercado más transparente para los consumidores.',
    imageSrc: '/placeholder.svg?height=300&width=300',
  },
  {
    name: 'Pedro Gómez',
    role: 'CTO',
    bio: 'Ingeniero de software con experiencia en startups, Pedro lidera el desarrollo de nuestra plataforma de comparación, asegurando que sea rápida, segura y fácil de usar.',
    imageSrc: '/placeholder.svg?height=300&width=300',
  },
  {
    name: 'Lucía Fernández',
    role: 'Directora de Operaciones',
    bio: 'Experta en optimización de procesos, Lucía se asegura de que nuestras comparaciones sean precisas y que nuestro servicio al cliente sea excepcional.',
    imageSrc: '/placeholder.svg?height=300&width=300',
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className='container py-12'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Sobre Nosotros</h1>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-4'>Nuestra Misión</h2>
          <div className='grid gap-6 md:grid-cols-2 items-center'>
            <div>
              <p className='text-muted-foreground mb-6'>
                En Trifasicko Conecta, nuestra misión es empoderar a los consumidores para que tomen
                decisiones informadas sobre sus servicios de luz e Internet. Creemos que todos
                merecen acceso a información clara y comparaciones imparciales para encontrar las
                mejores tarifas que se adapten a sus necesidades.
              </p>
              <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <CheckCircle className='mr-2 h-5 w-5 text-primary' />
                      Transparencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nos comprometemos a proporcionar información clara y precisa sobre todas las
                      tarifas y ofertas disponibles.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <CheckCircle className='mr-2 h-5 w-5 text-primary' />
                      Imparcialidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nuestras comparaciones son objetivas y no favorecen a ningún proveedor en
                      particular.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <CheckCircle className='mr-2 h-5 w-5 text-primary' />
                      Innovación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Constantemente mejoramos nuestra plataforma para ofrecer la mejor experiencia
                      de comparación posible.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <CheckCircle className='mr-2 h-5 w-5 text-primary' />
                      Servicio al Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Estamos comprometidos a proporcionar un excelente soporte a nuestros usuarios
                      en cada paso del proceso.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Image
              src='/images/our-mission.jpg'
              width={400}
              height={300}
              alt='Nuestra misión'
              className='rounded-xl shadow-lg'
            />
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-4'>Nuestro Equipo</h2>
          <p className='text-muted-foreground mb-6'>
            Detrás de Trifasicko Conecta hay un equipo apasionado de expertos en energía, tecnología
            y servicio al cliente. Conozca a algunas de las personas que hacen posible nuestro
            servicio:
          </p>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {teamMembers.map((member, index) => (
              <Card key={index} className='overflow-hidden'>
                <Image
                  src={member.imageSrc || '/placeholder.svg'}
                  alt={member.name}
                  width={300}
                  height={300}
                  className='w-full h-48 object-cover'
                />
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Nuestra Historia</h2>
          <div className='grid gap-6 md:grid-cols-2 items-center'>
            <Image
              src='/images/our-history.jpg'
              width={400}
              height={300}
              alt='Nuestra historia'
              className='rounded-xl shadow-lg'
            />
            <div>
              <p className='text-muted-foreground mb-4'>
                Fundada en 2020, Trifasicko Conecta nació de la frustración de nuestros fundadores
                con la complejidad del mercado energético y de telecomunicaciones. Desde entonces,
                hemos ayudado a más de 100,000 usuarios a encontrar mejores tarifas y ahorrar en sus
                facturas.
              </p>
              <p className='text-muted-foreground'>
                Hoy, seguimos comprometidos con nuestra misión original de hacer el mercado más
                transparente y accesible para todos. Continuamos innovando y expandiendo nuestros
                servicios para satisfacer las necesidades cambiantes de nuestros usuarios.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Trifasicko Conecta',
  description:
    'Encuentra respuestas a las preguntas más comunes sobre nuestro servicio de comparación de tarifas de luz e Internet.',
}

const faqs = [
  {
    question: '¿Cómo funciona el comparador de tarifas?',
    answer:
      'Nuestro comparador analiza tu consumo actual y lo compara con las ofertas disponibles en el mercado. Introduciendo tus datos de consumo, te mostramos las mejores opciones que pueden ayudarte a ahorrar en tus facturas de luz e Internet.',
  },
  {
    question: '¿Es gratis usar el comparador?',
    answer:
      'Sí, el uso de nuestro comparador es completamente gratuito. No cobramos ninguna comisión por mostrar las ofertas ni por ayudarte a cambiar de compañía.',
  },
  {
    question: '¿Cómo puedo confiar en que las comparaciones son imparciales?',
    answer:
      'Nos comprometemos a mostrar todas las ofertas disponibles de manera transparente y sin favorecer a ninguna compañía en particular. Nuestro algoritmo se basa únicamente en los datos de consumo que proporcionas y las tarifas actuales del mercado.',
  },
  {
    question: '¿Qué información necesito para hacer una comparación?',
    answer:
      'Para una comparación de luz, necesitarás tu potencia contratada y consumo mensual aproximado. Para Internet, necesitas tu código postal y velocidad actual. Tener a mano una factura reciente te ayudará a proporcionar datos más precisos.',
  },
  {
    question: '¿Puedo cambiar de compañía directamente a través de vuestra web?',
    answer:
      'Actualmente, nuestro servicio se limita a mostrar comparativas. Sin embargo, te proporcionamos toda la información necesaria para que puedas contactar directamente con la compañía que elijas y realizar el cambio.',
  },
  {
    question: '¿Con qué frecuencia se actualizan las tarifas?',
    answer:
      'Nos esforzamos por mantener nuestra base de datos actualizada diariamente. Sin embargo, te recomendamos verificar siempre los detalles finales con la compañía proveedora antes de tomar una decisión.',
  },
  {
    question: '¿Qué hago si no entiendo mi factura actual?',
    answer:
      'Entender una factura de luz o Internet puede ser complicado. Ofrecemos una guía detallada en nuestra sección de blog sobre cómo interpretar tu factura. Si aún tienes dudas, nuestro equipo de soporte estará encantado de ayudarte.',
  },
  {
    question: '¿Cómo puedo saber si he ahorrado realmente después de cambiar?',
    answer:
      'Te recomendamos guardar tus comparaciones en tu perfil. Después de cambiar, puedes volver a introducir tus nuevos datos de consumo y compararlos con tu situación anterior para ver el ahorro real.',
  },
]

export default function PreguntasFrecuentesPage() {
  return (
    <div className='container py-12'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Preguntas Frecuentes</h1>
        <p className='text-muted-foreground mb-8'>
          Encuentra respuestas a las preguntas más comunes sobre nuestro servicio de comparación de
          tarifas de luz e Internet.
        </p>

        <Accordion type='single' collapsible className='w-full'>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

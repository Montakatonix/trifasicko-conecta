'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error'
import { Mail, Phone, MapPin } from 'lucide-react'

interface FormData {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

export default function Contacto() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setError('Por favor, rellena todos los campos obligatorios')
      setLoading(false)
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, introduce un email válido')
      setLoading(false)
      return
    }

    try {
      // Simular envío del formulario
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
      })
    } catch (err) {
      setError('Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Contacto</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold">Información de contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@trifasickoconecta.es</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>900 123 456</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Calle Principal 123, 28001 Madrid</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Horario de atención</h2>
            <p className="text-muted-foreground">
              Lunes a Viernes: 9:00 - 18:00
              <br />
              Sábados: 10:00 - 14:00
              <br />
              Domingos y festivos: Cerrado
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-2xl font-semibold">Envíanos un mensaje</h2>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
              Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="Tu teléfono (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="mensaje">Mensaje *</Label>
              <textarea
                id="mensaje"
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                placeholder="¿En qué podemos ayudarte?"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingSpinner /> : 'Enviar mensaje'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

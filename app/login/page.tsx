'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos')
      return
    }

    try {
      setLoading(true)
      await signIn(formData.email, formData.password)
      router.push('/perfil')
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Correo electrónico o contraseña incorrectos')
            break
          case 'auth/invalid-email':
            setError('El correo electrónico no es válido')
            break
          case 'auth/too-many-requests':
            setError('Demasiados intentos fallidos. Por favor, inténtalo más tarde')
            break
          default:
            setError('Error al iniciar sesión. Por favor, inténtalo de nuevo')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Accede a tu cuenta para gestionar tus servicios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='email'>Correo electrónico</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='tu@email.com'
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor='password'>Contraseña</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  disabled={loading}
                />
              </div>
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2 items-center'>
          <Link href='/registro' className='text-sm text-primary hover:underline'>
            ¿No tienes una cuenta? Regístrate
          </Link>
          <Link
            href='/recuperar-contrasena'
            className='text-sm text-muted-foreground hover:underline'
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

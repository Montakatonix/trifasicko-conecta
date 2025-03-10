"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("perfil")

  // Perfil
  const [nombre, setNombre] = useState(user?.displayName || "")
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null)
  const [successPerfil, setSuccessPerfil] = useState<string | null>(null)

  // Email
  const [email, setEmail] = useState(user?.email || "")
  const [passwordEmail, setPasswordEmail] = useState("")
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [errorEmail, setErrorEmail] = useState<string | null>(null)
  const [successEmail, setSuccessEmail] = useState<string | null>(null)

  // Contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [errorPassword, setErrorPassword] = useState<string | null>(null)
  const [successPassword, setSuccessPassword] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const actualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPerfil(null)
    setSuccessPerfil(null)

    if (!nombre.trim()) {
      setErrorPerfil("El nombre no puede estar vacío")
      return
    }

    try {
      setLoadingPerfil(true)
      await updateProfile(user, { displayName: nombre })
      setSuccessPerfil("Perfil actualizado correctamente")
      setTimeout(() => setSuccessPerfil(null), 3000)
    } catch (err) {
      console.error(err)
      setErrorPerfil("Error al actualizar el perfil. Por favor, inténtalo de nuevo.")
    } finally {
      setLoadingPerfil(false)
    }
  }

  const actualizarEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorEmail(null)
    setSuccessEmail(null)

    if (!email.trim()) {
      setErrorEmail("El email no puede estar vacío")
      return
    }

    if (!passwordEmail) {
      setErrorEmail("Debes introducir tu contraseña actual para cambiar el email")
      return
    }

    try {
      setLoadingEmail(true)

      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(user.email!, passwordEmail)
      await reauthenticateWithCredential(user, credential)

      // Actualizar email
      await updateEmail(user, email)

      setSuccessEmail("Email actualizado correctamente")
      setPasswordEmail("")
      setTimeout(() => setSuccessEmail(null), 3000)
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/wrong-password") {
        setErrorEmail("Contraseña incorrecta")
      } else if (err.code === "auth/email-already-in-use") {
        setErrorEmail("Este email ya está en uso")
      } else {
        setErrorEmail("Error al actualizar el email. Por favor, inténtalo de nuevo.")
      }
    } finally {
      setLoadingEmail(false)
    }
  }

  const actualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPassword(null)
    setSuccessPassword(null)

    if (!currentPassword) {
      setErrorPassword("Debes introducir tu contraseña actual")
      return
    }

    if (!newPassword) {
      setErrorPassword("La nueva contraseña no puede estar vacía")
      return
    }

    if (newPassword.length < 6) {
      setErrorPassword("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorPassword("Las contraseñas no coinciden")
      return
    }

    try {
      setLoadingPassword(true)

      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(user.email!, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Actualizar contraseña
      await updatePassword(user, newPassword)

      setSuccessPassword("Contraseña actualizada correctamente")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setSuccessPassword(null), 3000)
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/wrong-password") {
        setErrorPassword("Contraseña actual incorrecta")
      } else {
        setErrorPassword("Error al actualizar la contraseña. Por favor, inténtalo de nuevo.")
      }
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Contraseña</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de perfil</CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent>
                {errorPerfil && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorPerfil}</AlertDescription>
                  </Alert>
                )}

                {successPerfil && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">{successPerfil}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={actualizarPerfil} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/50">
                      <span>{user.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Para cambiar tu email, ve a la pestaña "Email"</p>
                  </div>

                  <Button type="submit" disabled={loadingPerfil}>
                    {loadingPerfil ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar perfil"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar email</CardTitle>
                <CardDescription>Actualiza la dirección de email asociada a tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                {errorEmail && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorEmail}</AlertDescription>
                  </Alert>
                )}

                {successEmail && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">{successEmail}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={actualizarEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Nuevo email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordEmail">Contraseña actual</Label>
                    <Input
                      id="passwordEmail"
                      type="password"
                      value={passwordEmail}
                      onChange={(e) => setPasswordEmail(e.target.value)}
                      placeholder="Introduce tu contraseña actual para confirmar"
                    />
                  </div>

                  <Button type="submit" disabled={loadingEmail}>
                    {loadingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Cambiar email"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar contraseña</CardTitle>
                <CardDescription>Actualiza la contraseña de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                {errorPassword && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorPassword}</AlertDescription>
                  </Alert>
                )}

                {successPassword && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">{successPassword}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={actualizarPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={loadingPassword}>
                    {loadingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Cambiar contraseña"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


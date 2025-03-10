"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from "firebase/firestore"
import type { ForumPost } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, MessageSquare, ThumbsUp, Tag, AlertCircle } from "lucide-react"

export default function ForoPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("todos")
  const [newPost, setNewPost] = useState({
    titulo: "",
    contenido: "",
    categoria: "energia",
    tags: [] as string[]
  })

  // Suscripción a actualizaciones en tiempo real
  useEffect(() => {
    let q = query(collection(db, "forum_posts"), orderBy("createdAt", "desc"))
    
    if (activeCategory !== "todos") {
      q = query(
        collection(db, "forum_posts"),
        where("categoria", "==", activeCategory),
        orderBy("createdAt", "desc")
      )
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as ForumPost[]
      
      setPosts(updatedPosts)
      setLoading(false)
    }, (error) => {
      console.error("Error al obtener posts:", error)
      setError("Error al cargar los posts del foro")
      setLoading(false)
    })

    return () => unsubscribe()
  }, [activeCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("Debes iniciar sesión para publicar")
      return
    }

    if (!newPost.titulo || !newPost.contenido) {
      setError("Por favor, completa todos los campos")
      return
    }

    try {
      await addDoc(collection(db, "forum_posts"), {
        ...newPost,
        autor: {
          id: user.uid,
          nombre: user.displayName || "Usuario anónimo",
          avatar: user.photoURL
        },
        likes: 0,
        comentarios: [],
        createdAt: serverTimestamp()
      })

      setNewPost({
        titulo: "",
        contenido: "",
        categoria: "energia",
        tags: []
      })
    } catch (error) {
      console.error("Error al crear post:", error)
      setError("Error al publicar el post")
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Foro de la Comunidad</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="energia">Energía</TabsTrigger>
              <TabsTrigger value="telefonia">Telefonía</TabsTrigger>
              <TabsTrigger value="inmobiliaria">Inmobiliaria</TabsTrigger>
              <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory}>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : posts.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No hay publicaciones en esta categoría. ¡Sé el primero en publicar!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={post.autor.avatar} />
                              <AvatarFallback>
                                {post.autor.nombre.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle>{post.titulo}</CardTitle>
                              <CardDescription>
                                Por {post.autor.nombre} • {formatDate(post.createdAt)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge>{post.categoria}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{post.contenido}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {post.comentarios.length}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Nueva publicación</CardTitle>
              <CardDescription>
                Comparte tus experiencias y dudas con la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={newPost.titulo}
                    onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
                    placeholder="Escribe un título descriptivo"
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={newPost.categoria}
                    onValueChange={(value) => setNewPost({ ...newPost, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energia">Energía</SelectItem>
                      <SelectItem value="telefonia">Telefonía</SelectItem>
                      <SelectItem value="inmobiliaria">Inmobiliaria</SelectItem>
                      <SelectItem value="seguridad">Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contenido">Contenido</Label>
                  <Textarea
                    id="contenido"
                    value={newPost.contenido}
                    onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })}
                    placeholder="Escribe tu mensaje..."
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags.join(", ")}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="ahorro, facturas, consejos..."
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Publicar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
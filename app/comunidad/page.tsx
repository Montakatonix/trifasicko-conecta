"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { app } from "@/lib/firebase"

interface Post {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: Date
  likes: number
}

export default function ComunidadPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    if (!app) {
      console.error("Firebase is not initialized")
      return
    }
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20))
    const querySnapshot = await getDocs(q)
    const fetchedPosts = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Post,
    )
    setPosts(fetchedPosts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newPost.trim() || !app) return

    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: user.displayName || "Usuario anónimo",
        content: newPost,
        createdAt: serverTimestamp(),
        likes: 0,
      })
      setNewPost("")
      fetchPosts()
    } catch (error) {
      console.error("Error adding post:", error)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Comunidad Trifasicko</h1>
      {app ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Comparte tu experiencia</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <Textarea
                    placeholder="Comparte tus consejos de ahorro o experiencias con nuestros servicios..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={!user || !newPost.trim()}>
                    Publicar
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-medium">{post.userName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm">
                    👍 {post.likes}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p>La funcionalidad de la comunidad no está disponible en este momento.</p>
      )}
    </div>
  )
}


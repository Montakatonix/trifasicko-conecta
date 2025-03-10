"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShareButtons } from "@/components/share-buttons"
import { RelatedNews } from "@/components/related-news"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: { seconds: number }
  source: string
  category: "energia" | "telefonia"
}

export default function NewsDetailPage() {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    async function fetchNewsItem() {
      if (typeof id !== "string") return
      const docRef = doc(db, "news", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setNewsItem({ id: docSnap.id, ...docSnap.data() } as NewsItem)
      }
    }
    fetchNewsItem()
  }, [id])

  if (!newsItem) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {new Date(newsItem.publishedAt.seconds * 1000).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                {newsItem.category === "energia" ? "Energía" : "Telefonía"}
              </span>
            </div>
            <CardTitle className="text-2xl">{newsItem.title}</CardTitle>
            <CardDescription>Fuente: {newsItem.source}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{newsItem.description}</p>
            <ShareButtons url={`https://trifasickoconecta.com/blog/${newsItem.id}`} title={newsItem.title} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/blog">
              <Button variant="outline">Volver al blog</Button>
            </Link>
            <Link href={newsItem.url} target="_blank" rel="noopener noreferrer">
              <Button>Leer artículo completo</Button>
            </Link>
          </CardFooter>
        </Card>
        <RelatedNews currentNewsId={newsItem.id} category={newsItem.category} />
      </div>
    </div>
  )
}


"use client"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useEffect, useState } from "react"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: { seconds: number }
  source: string
  category: "energia" | "telefonia"
}

interface RelatedNewsProps {
  currentNewsId: string
  category: "energia" | "telefonia"
}

export function RelatedNews({ currentNewsId, category }: RelatedNewsProps) {
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])

  useEffect(() => {
    async function fetchRelatedNews() {
      const newsRef = collection(db, "news")
      const q = query(
        newsRef,
        where("category", "==", category),
        where("id", "!=", currentNewsId),
        orderBy("publishedAt", "desc"),
        limit(3),
      )
      const querySnapshot = await getDocs(q)
      const news = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as NewsItem)
      setRelatedNews(news)
    }
    fetchRelatedNews()
  }, [currentNewsId, category])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Noticias relacionadas</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {relatedNews.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{new Date(item.publishedAt.seconds * 1000).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={`/blog/${item.id}`}>
                <Button variant="outline">Leer más</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


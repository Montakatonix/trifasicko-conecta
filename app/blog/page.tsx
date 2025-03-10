"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: { seconds: number }
  source: string
  category: "energia" | "telefonia"
}

export default function BlogPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchNews()
  }, [])

  async function fetchNews() {
    const newsRef = collection(db, "news")
    const q = query(newsRef, orderBy("publishedAt", "desc"), limit(20))
    const querySnapshot = await getDocs(q)

    const fetchedNews = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as NewsItem,
    )

    setNews(fetchedNews)
  }

  const filteredNews = news.filter(
    (item) =>
      (filter === "all" || item.category === filter) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blog y Noticias</h1>
        <p className="text-muted-foreground mb-8">
          Últimas noticias sobre energía eléctrica, compañías telefónicas y consejos de ahorro.
        </p>

        <div className="flex gap-4 mb-8">
          <Input
            type="search"
            placeholder="Buscar artículos..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="energia">Energía</SelectItem>
              <SelectItem value="telefonia">Telefonía</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredNews.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.publishedAt.seconds * 1000).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {item.category === "energia" ? "Energía" : "Telefonía"}
                  </span>
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description.slice(0, 100)}...</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Link href={`/blog/${item.id}`}>
                  <Button variant="outline">Leer más</Button>
                </Link>
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <Button>Fuente original</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


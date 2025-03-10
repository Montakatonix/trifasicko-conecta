"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HighlightedNews } from "@/lib/news"

export function HighlightedNewsSection() {
  const [highlights, setHighlights] = useState<HighlightedNews[]>([])

  useEffect(() => {
    async function fetchHighlights() {
      const highlightsRef = collection(db, "highlighted_news")
      const q = query(highlightsRef, orderBy("importance", "desc"), limit(8))
      const querySnapshot = await getDocs(q)
      const fetchedHighlights = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as HighlightedNews)
      setHighlights(fetchedHighlights)
    }
    fetchHighlights()
  }, [])

  const energyHighlights = highlights.filter((h) => h.category === "energia")
  const telecomHighlights = highlights.filter((h) => h.category === "telefonia")

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Noticias Destacadas</h2>
      <Tabs defaultValue="energia">
        <TabsList>
          <TabsTrigger value="energia">Energía</TabsTrigger>
          <TabsTrigger value="telefonia">Telefonía</TabsTrigger>
        </TabsList>
        <TabsContent value="energia">
          <div className="grid gap-4 md:grid-cols-2">{energyHighlights.map(renderHighlight)}</div>
        </TabsContent>
        <TabsContent value="telefonia">
          <div className="grid gap-4 md:grid-cols-2">{telecomHighlights.map(renderHighlight)}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderHighlight(highlight: HighlightedNews) {
  return (
    <Card key={highlight.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{highlight.title}</CardTitle>
          <Badge variant={getBadgeVariant(highlight.type)}>{highlight.type}</Badge>
        </div>
        <CardDescription>{new Date(highlight.publishedAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{highlight.description}</p>
      </CardContent>
    </Card>
  )
}

function getBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "noticia":
      return "default"
    case "dato":
      return "secondary"
    case "tendencia":
      return "destructive"
    case "consejo":
      return "outline"
    default:
      return "default"
  }
}


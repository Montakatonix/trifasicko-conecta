import { NextResponse } from "next/server"
import { fetchAndStoreNews, fetchAndStoreHighlightedNews } from "@/lib/news"

export async function GET() {
  if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
    return NextResponse.json({ error: "News API key is not configured" }, { status: 500 })
  }

  try {
    await Promise.all([fetchAndStoreNews(), fetchAndStoreHighlightedNews()])
    return NextResponse.json({ message: "News and highlights updated successfully" })
  } catch (error) {
    console.error("Error updating news and highlights:", error)
    return NextResponse.json({ error: "Failed to update news and highlights" }, { status: 500 })
  }
}


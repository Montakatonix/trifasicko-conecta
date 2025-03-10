import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Notifications } from "@/components/notifications"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trifasicko Conecta | Comparador de Tarifas",
  description: "Encuentra las mejores tarifas de luz e Internet con nuestro comparador profesional",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Notifications />
            <Chatbot />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
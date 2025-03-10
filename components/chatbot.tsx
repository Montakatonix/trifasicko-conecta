"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"

interface Message {
  text: string
  sender: "user" | "bot"
}

const initialMessages: Message[] = [
  { text: "¡Hola! Soy el asistente virtual de Trifasicko Conecta. ¿En qué puedo ayudarte hoy?", sender: "bot" },
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = { text: input, sender: "user" }
    setMessages([...messages, userMessage])
    setInput("")

    // Simular respuesta del bot (en una implementación real, esto se conectaría a un servicio de IA)
    setTimeout(() => {
      const botResponse: Message = { text: getBotResponse(input), sender: "bot" }
      setMessages((prevMessages) => [...prevMessages, botResponse])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    if (lowerInput.includes("comparar") || lowerInput.includes("tarifa")) {
      return "Para comparar tarifas, puedes usar nuestros comparadores de luz o internet en la página principal. ¿Necesitas ayuda para encontrarlos?"
    } else if (lowerInput.includes("ahorro") || lowerInput.includes("ahorrar")) {
      return "Tenemos muchos consejos de ahorro en nuestro blog. También puedes usar nuestra calculadora de ahorro para estimar cuánto podrías ahorrar cambiando de tarifa."
    } else if (lowerInput.includes("problema") || lowerInput.includes("ayuda")) {
      return "Lamento que estés teniendo problemas. ¿Podrías darme más detalles sobre el problema que estás experimentando?"
    } else {
      return "No estoy seguro de cómo responder a eso. ¿Puedes reformular tu pregunta o elegir entre comparar tarifas, consejos de ahorro o reportar un problema?"
    }
  }

  return (
    <>
      {!isOpen && (
        <Button className="fixed bottom-4 right-4 rounded-full p-4" onClick={() => setIsOpen(true)}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Asistente Trifasicko</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block rounded-lg px-3 py-2 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu mensaje..." />
              <Button type="submit">Enviar</Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { getNotifications, markNotificationAsRead } from "@/lib/notifications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification } from "@/lib/notifications"

function getVariantFromType(type: Notification["type"]): "default" | "secondary" | "destructive" {
  switch (type) {
    case "success":
      return "default"
    case "info":
      return "secondary"
    case "warning":
      return "destructive"
    default:
      return "default"
  }
}

function NotificationsPanel({ notifications, onMarkAsRead }: { 
  notifications: Notification[]
  onMarkAsRead: (id: string) => void 
}) {
  return (
    <ScrollArea className="h-[300px] w-[350px] p-4">
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground">No tienes notificaciones nuevas</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="rounded-lg border p-3">
              <div className="flex justify-between w-full">
                <span className="font-medium">{notification.message}</span>
                <Badge variant={getVariantFromType(notification.type)}>{notification.type}</Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
              <Button
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Marcar como leído
              </Button>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}

export function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!user) return
    try {
      setLoading(true)
      const fetchedNotifications = await getNotifications(user.uid)
      setNotifications(fetchedNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative" disabled={loading}>
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 py-px text-xs">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <NotificationsPanel 
          notifications={notifications} 
          onMarkAsRead={handleMarkAsRead} 
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


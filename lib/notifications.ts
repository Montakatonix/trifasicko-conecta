import { db } from "./firebase"
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, Timestamp } from "firebase/firestore"

export interface Notification {
  id: string
  userId: string
  message: string
  type: "success" | "info" | "warning"
  createdAt: string
  read: boolean
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const notificationsRef = collection(db, "notifications")
    const q = query(notificationsRef, where("userId", "==", userId), where("read", "==", false))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[]
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

export async function addNotification(notification: Omit<Notification, "id" | "createdAt">) {
  try {
    const notificationsRef = collection(db, "notifications")
    await addDoc(notificationsRef, {
      ...notification,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding notification:", error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notificationRef = doc(db, "notifications", notificationId)
    await deleteDoc(notificationRef)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}


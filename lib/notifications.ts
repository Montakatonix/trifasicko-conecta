import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

import { getInitializedDb } from './firebase'

export interface Notification {
  id: string
  userId: string
  message: string
  type: 'success' | 'info' | 'warning'
  createdAt: string
  read: boolean
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const db = await getInitializedDb()
    const notificationsRef = collection(db, 'notifications')
    const q = query(notificationsRef, where('userId', '==', userId), where('read', '==', false))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[]
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
  try {
    const db = await getInitializedDb()
    const notificationsRef = collection(db, 'notifications')
    await addDoc(notificationsRef, {
      ...notification,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error adding notification:', error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const db = await getInitializedDb()
    const notificationRef = doc(db, 'notifications', notificationId)
    await deleteDoc(notificationRef)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

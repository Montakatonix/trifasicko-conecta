import { Inter } from 'next/font/google'

import { Chatbot } from '@/components/chatbot'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { NewsUpdater } from '@/components/news-updater'
import { Notifications } from '@/components/notifications'
import { ThemeProvider } from '@/components/theme-provider'

import { AuthProvider } from '@/lib/auth'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trifasicko Conecta',
  description: 'Compara y ahorra en tus servicios de luz, internet y más',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <AuthProvider>
            <div className='min-h-screen flex flex-col'>
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
              <NewsUpdater />
              <Notifications />
              <Chatbot />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

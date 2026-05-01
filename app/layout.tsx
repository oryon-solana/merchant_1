import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { PointsProvider } from '@/lib/contexts/PointsContext'
import { CartProvider } from '@/lib/contexts/CartContext'
import Navbar from '@/components/Navbar'
import LenisProvider from '@/components/LenisProvider'
import AppLoader from '@/components/AppLoader'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Whitesinyo Coffee — Premium Coffee & Loyalty Rewards',
  description: 'Specialty coffee crafted with intention. Order online and earn points on every cup.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          <PointsProvider>
            <CartProvider>
              <LenisProvider>
                <AppLoader>
                  <Navbar />
                  <main className="pt-20">
                    {children}
                  </main>
                </AppLoader>
              </LenisProvider>
            </CartProvider>
          </PointsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

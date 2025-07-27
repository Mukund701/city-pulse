// apps/web/src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import ParticlesBackground from '@/components/ui/particles-background'
import { Header } from '@/components/ui/header' // <-- NEW: Import Header
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'City Pulse',
  description: 'Discover the pulse of cities around the world',
  keywords: ['cities', 'events', 'urban', 'pulse', 'data'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ParticlesBackground>
            <div className="relative z-10 flex flex-col min-h-screen">
              {/* ================================================================= */}
              {/* ========= UPDATED: Using the new Header component =========== */}
              <Header />
              {/* ================================================================= */}

              <main className="flex-grow">
                {children}
              </main>

              <footer className="bg-transparent border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} City Pulse. Built with Next.js and TypeScript.</p>
                  </div>
                </div>
              </footer>
            </div>
          </ParticlesBackground>
        </ThemeProvider>
      </body>
    </html>
  )
}
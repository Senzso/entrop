import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Entropy AI',
  description: 'Explore the depths of AI with Entropy',
  icons: {
    icon: [
      { url: '/newicon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/newicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/newicon.png" type="image/png" sizes="180x180" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/newicon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileImage" content="/newicon.png" />
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body className={inter.className}>
        {children}
        <Script id="icon-refresh">
          {`
            function refreshFavicon() {
              var link = document.querySelector("link[rel~='icon']");
              if (link) {
                link.href = "/newicon.png?v=" + new Date().getTime();
              }
            }
            window.onload = refreshFavicon;
          `}
        </Script>
      </body>
    </html>
  )
}


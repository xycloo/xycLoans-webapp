import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/nav'
import { CookiesProvider } from 'next-client-cookies/server';


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <Navbar />
          {children}
        </CookiesProvider>
      </body>
    </html>
  )
}

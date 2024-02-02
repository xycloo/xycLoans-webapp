import { Inter } from 'next/font/google'
import './globals.css'
import AppNavbar from './components/nav'
import { CookiesProvider } from 'next-client-cookies/server';


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <AppNavbar />
          {children}
        </CookiesProvider>
      </body>
    </html>
  )
}

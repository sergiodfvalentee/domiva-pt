import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Larify.pt - Sente-te em casa desde o primeiro clique',
  description: 'A plataforma moderna onde particulares e agentes imobiliários podem anunciar imóveis gratuitamente em Portugal.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 
import './globals.css'

export const metadata = {
  title: 'Domiva - Encontre a casa dos seus sonhos',
  description: 'A plataforma mais moderna para comprar, vender e arrendar imóveis em Portugal. Tecnologia avançada, experiência simplificada.',
  keywords: 'imóveis, casas, apartamentos, Portugal, comprar casa, arrendar, vender imóvel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body className="antialiased">
        {children}
        {/* Analytics removido para desenvolvimento offline */}
      </body>
    </html>
  )
} 
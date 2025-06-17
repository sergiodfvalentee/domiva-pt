import { Search, Home, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Larify.pt</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-600">Imóveis</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">Sobre</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">Contacto</a>
            </nav>
            <div className="flex space-x-4">
              <button className="btn-secondary">Entrar</button>
              <button className="btn-primary">Registar</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sente-te em casa desde o primeiro clique
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              A plataforma moderna onde particulares e agentes podem anunciar imóveis gratuitamente em Portugal
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Localização (ex: Lisboa, Porto...)"
                    className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="btn-primary flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Pesquisar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Porquê escolher o Larify.pt?
            </h2>
            <p className="text-xl text-gray-600">
              A forma mais simples de encontrar ou anunciar a casa dos seus sonhos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Anúncios Gratuitos</h3>
              <p className="text-gray-600">
                Particulares podem anunciar os seus imóveis sem qualquer custo
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Para Todos</h3>
              <p className="text-gray-600">
                Tanto particulares como agentes imobiliários podem usar a plataforma
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seguro e Confiável</h3>
              <p className="text-gray-600">
                Todos os anúncios são verificados para garantir a máxima segurança
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pronto para encontrar a sua casa ideal?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de portugueses que já encontraram o lar perfeito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">
              Explorar Imóveis
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Anunciar Imóvel
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="h-6 w-6 text-primary-400" />
                <span className="ml-2 text-xl font-bold">Larify.pt</span>
              </div>
              <p className="text-gray-400">
                Sente-te em casa desde o primeiro clique
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Imóveis</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Comprar</a></li>
                <li><a href="#" className="hover:text-white">Arrendar</a></li>
                <li><a href="#" className="hover:text-white">Investir</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Ajuda</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">RGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Larify.pt. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 
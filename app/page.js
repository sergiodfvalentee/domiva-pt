'use client'

import { Search, Home, Users, Shield, ArrowRight, MapPin, Star, TrendingUp, Eye, Heart, ChevronDown, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, signOut } from '../lib/auth'

export default function HomePage() {
  const [selectedFilters, setSelectedFilters] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()

    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleFilter = (filter) => {
    console.log('Toggling filter:', filter, 'Current filters:', selectedFilters)
    setSelectedFilters(prev => {
      const newFilters = prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
      console.log('New filters:', newFilters)
      return newFilters
    })
  }

  const quickFilters = [
    // Tipologias
    { id: 'T1', label: 'T1', category: 'tipologia' },
    { id: 'T2', label: 'T2', category: 'tipologia' },
    { id: 'T3', label: 'T3', category: 'tipologia' },
    { id: 'T4', label: 'T4', category: 'tipologia' },
    { id: 'T5+', label: 'T5+', category: 'tipologia' },
    
    // Características da propriedade
    { id: 'jardim', label: 'Com Jardim', category: 'caracteristicas' },
    { id: 'garagem', label: 'Com Garagem', category: 'caracteristicas' },
    { id: 'piscina', label: 'Com Piscina', category: 'caracteristicas' },
    { id: 'terraço', label: 'Com Terraço', category: 'caracteristicas' },
    { id: 'elevador', label: 'Com Elevador', category: 'caracteristicas' },
    
    // Proximidade e localização
    { id: 'metro', label: 'Perto do Metro', category: 'localizacao' },
    { id: 'escola', label: 'Perto de Escolas', category: 'localizacao' },
    { id: 'hospital', label: 'Perto de Hospitais', category: 'localizacao' },
    { id: 'centro_comercial', label: 'Centro Comercial', category: 'localizacao' },
    { id: 'praia', label: 'Perto da Praia', category: 'localizacao' },
    { id: 'centro_cidade', label: 'Centro da Cidade', category: 'localizacao' },
    
    // Transportes e acessibilidade
    { id: 'autoestrada', label: 'Acesso à Autoestrada', category: 'transportes' },
    { id: 'aeroporto', label: 'Perto do Aeroporto', category: 'transportes' },
    { id: 'estacao_comboio', label: 'Estação de Comboio', category: 'transportes' },
    
    // Serviços e comodidades
    { id: 'supermercado', label: 'Supermercados', category: 'servicos' },
    { id: 'farmacia', label: 'Farmácias', category: 'servicos' },
    { id: 'ginasio', label: 'Ginásios', category: 'servicos' },
    { id: 'restaurantes', label: 'Restaurantes', category: 'servicos' },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="absolute top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom">
          <div className={`flex justify-between items-center py-3 md:py-4 ${isVisible ? 'fade-in' : ''}`}>
            <div className="flex items-center space-x-2 hover-lift">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Domiva</span>
            </div>
            
            <nav className={`hidden md:flex items-center space-x-8 ${isVisible ? 'slide-in-left delay-200' : ''}`}>
              <a href="#" className="btn-ghost hover-lift">Comprar</a>
              <a href="#" className="btn-ghost hover-lift">Arrendar</a>
              <a href="#" className="btn-ghost hover-lift">Vender</a>
              <a href="#" className="btn-ghost hover-lift">Sobre</a>
            </nav>
            
            <div className={`flex items-center space-x-3 ${isVisible ? 'slide-in-right delay-300' : ''}`}>
              {!isLoading && (
                user ? (
                  // Authenticated user
                  <div className="flex items-center space-x-3">
                    <Link href="/dashboard" className="flex items-center space-x-2 btn-ghost hover-lift">
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button onClick={handleSignOut} className="btn-primary hover-glow">
                      Sair
                    </button>
                  </div>
                ) : (
                  // Non-authenticated user
                  <>
                    <Link href="/criar-conta" className="btn-ghost hover-lift">Criar conta</Link>
                    <Link href="/login" className="btn-primary hover-glow">Entrar</Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20 md:pt-24 lg:pt-28 overflow-hidden">
        <div className="container-custom text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight ${isVisible ? 'slide-up delay-400' : ''}`}>
              <span className="gradient-text">Sinta-se em casa</span>
              <br />
              <span className="text-gray-900">desde o primeiro clique</span>
            </h1>
            
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 md:mb-12 font-light leading-relaxed px-4 ${isVisible ? 'slide-up delay-500' : ''}`}>
              A plataforma mais moderna para comprar, vender e arrendar imóveis em Portugal
            </p>
            
            {/* Advanced Search Bar with Property Type */}
            <div className={`max-w-6xl mx-auto mb-16 ${isVisible ? 'scale-in delay-600' : ''}`}>
              <div className="search-bar hover-glow">
                <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2">
                  {/* Location Input - Made much wider */}
                  <div className="w-full lg:w-1/2 flex items-center space-x-3 px-4 py-3 min-w-0">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Localização, cidade ou código postal" 
                      className="search-input"
                    />
                  </div>
                  
                  <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
                  
                  {/* Property Type Dropdown */}
                  <div className="relative flex-shrink-0">
                    <select className="appearance-none text-gray-600 bg-transparent border-none outline-none px-3 py-3 pr-6 cursor-pointer font-medium hover:text-gray-900 transition-colors whitespace-nowrap">
                      <option value="">Todos os tipos</option>
                      <option value="apartamento">Apartamentos</option>
                      <option value="moradia">Moradias</option>
                      <option value="terreno">Terrenos</option>
                      <option value="comercial">Espaços Comerciais</option>
                      <option value="escritorio">Escritórios</option>
                      <option value="armazem">Armazéns</option>
                      <option value="quinta">Quintas</option>
                      <option value="loft">Lofts</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
                  
                  {/* Transaction Type & Price Range */}
                  <div className="flex items-center space-x-2 px-2 flex-shrink-0">
                    <div className="relative">
                      <select className="appearance-none text-gray-600 bg-transparent border-none outline-none pr-6 cursor-pointer font-medium hover:text-gray-900 transition-colors">
                        <option>Comprar</option>
                        <option>Arrendar</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
                  
                  <div className="flex items-center px-2 flex-shrink-0">
                    <div className="relative">
                      <select className="appearance-none text-gray-600 bg-transparent border-none outline-none pr-6 cursor-pointer font-medium hover:text-gray-900 transition-colors">
                        <option>Qualquer preço</option>
                        <option>Até €100k</option>
                        <option>€100k - €200k</option>
                        <option>€200k - €350k</option>
                        <option>€350k - €500k</option>
                        <option>€500k - €750k</option>
                        <option>€750k - €1M</option>
                        <option>€1M+</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Search Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 pulse-glow">
                    <Search className="h-5 w-5" />
                    <span>Pesquisar</span>
                  </button>
                </div>
              </div>
              
              {/* Enhanced Quick Filter Tags */}
              <div className={`mt-8 ${isVisible ? 'slide-up delay-700' : ''}`}>
                {/* Debug Info */}
                {selectedFilters.length > 0 && (
                  <div className="text-center mb-4">
                    <p className="text-xs text-blue-600">
                      Filtros ativos: {selectedFilters.join(', ')}
                    </p>
                  </div>
                )}
                
                {/* Filter Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Filtros Rápidos</h3>
                  
                  {/* Tipologias */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 text-center">Tipologias</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickFilters.filter(f => f.category === 'tipologia').map((filter, index) => {
                        const isSelected = selectedFilters.includes(filter.id)
                        return (
                          <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter-tag ${isSelected ? 'active' : ''} ${isVisible ? `scale-in delay-${800 + (index * 100)}` : ''}`}
                          >
                            {filter.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Características */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 text-center">Características</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickFilters.filter(f => f.category === 'caracteristicas').map((filter, index) => {
                        const isSelected = selectedFilters.includes(filter.id)
                        return (
                          <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter-tag ${isSelected ? 'active' : ''}`}
                          >
                            {filter.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Localização e Proximidade */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 text-center">Localização e Proximidade</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickFilters.filter(f => f.category === 'localizacao').map((filter) => {
                        const isSelected = selectedFilters.includes(filter.id)
                        return (
                          <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter-tag ${isSelected ? 'active' : ''}`}
                          >
                            {filter.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Transportes */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 text-center">Transportes</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickFilters.filter(f => f.category === 'transportes').map((filter) => {
                        const isSelected = selectedFilters.includes(filter.id)
                        return (
                          <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter-tag ${isSelected ? 'active' : ''}`}
                          >
                            {filter.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Serviços */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 text-center">Serviços e Comodidades</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickFilters.filter(f => f.category === 'servicos').map((filter) => {
                        const isSelected = selectedFilters.includes(filter.id)
                        return (
                          <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter-tag ${isSelected ? 'active' : ''}`}
                          >
                            {filter.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Clear Filters Button */}
                {selectedFilters.length > 0 && (
                  <div className="text-center">
                    <button
                      onClick={() => setSelectedFilters([])}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors underline hover-lift"
                    >
                      Limpar filtros ({selectedFilters.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Real-Time Stats */}
            <div className={`bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto hover-lift ${isVisible ? 'slide-up delay-800' : ''}`}>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 stats-counter">12,847</div>
                  <div className="text-gray-600">Imóveis Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 stats-counter">€287k</div>
                  <div className="text-gray-600">Preço Médio</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 stats-counter">98%</div>
                  <div className="text-gray-600">Satisfação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements with improved animations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 floating-animation"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-100 rounded-full opacity-20 floating-animation delay"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 floating-animation"></div>
      </section>

      {/* Features Section - Minimalist */}
      <section className="section-spacing bg-gray-50">
        <div className="container-custom">
          <div className={`text-center mb-20 ${isVisible ? 'slide-up delay-200' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Porquê escolher o Domiva?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Tecnologia avançada, experiência simplificada e resultados extraordinários
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className={`text-center group hover-lift ${isVisible ? 'slide-up delay-300' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Preços Reais</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Algoritmos avançados garantem preços justos e transparentes baseados em dados de mercado
              </p>
            </div>
            
            <div className={`text-center group hover-lift ${isVisible ? 'slide-up delay-400' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Visitas Virtuais</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Explore imóveis em 360° com tours virtuais imersivos sem sair de casa
              </p>
            </div>
            
            <div className={`text-center group hover-lift ${isVisible ? 'slide-up delay-500' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Match Perfeito</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                IA personalizada encontra imóveis que correspondem exatamente às suas preferências
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings - Real Data */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className={`text-center mb-16 ${isVisible ? 'slide-up delay-200' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Descubra as melhores oportunidades do mercado imobiliário português
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sample property cards */}
            <div className={`property-card ${isVisible ? 'slide-up delay-300' : ''}`}>
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  T3
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Apartamento T3 - Lisboa</h3>
                <p className="text-gray-600 text-sm mb-4">Príncipe Real, Lisboa</p>
                <div className="text-2xl font-bold text-gray-900">€425,000</div>
              </div>
            </div>
            
            <div className={`property-card ${isVisible ? 'slide-up delay-400' : ''}`}>
              <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 relative">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  T2
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Apartamento T2 - Porto</h3>
                <p className="text-gray-600 text-sm mb-4">Cedofeita, Porto</p>
                <div className="text-2xl font-bold text-gray-900">€285,000</div>
              </div>
            </div>
            
            <div className={`property-card ${isVisible ? 'slide-up delay-500' : ''}`}>
              <div className="h-48 bg-gradient-to-br from-pink-100 to-red-100 relative">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  Moradia
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Moradia T4 - Cascais</h3>
                <p className="text-gray-600 text-sm mb-4">Centro Cascais</p>
                <div className="text-2xl font-bold text-gray-900">€750,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className={`bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden hover-lift ${isVisible ? 'scale-in delay-600' : ''}`}>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para começar?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                Junte-se a milhares de portugueses que já encontraram o lar perfeito através do Domiva
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 hover-lift">
                  <span>Explorar Imóveis</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border border-gray-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover-lift">
                  Anunciar Grátis
                </button>
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 floating-animation"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30 floating-animation delay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className={`flex items-center space-x-2 mb-6 hover-lift ${isVisible ? 'slide-in-left' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Domiva</span>
              </div>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                A plataforma mais moderna para encontrar e anunciar imóveis em Portugal. 
                Tecnologia avançada, experiência simplificada.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer hover-lift">
                  <span className="text-gray-600 font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer hover-lift">
                  <span className="text-gray-600 font-semibold">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer hover-lift">
                  <span className="text-gray-600 font-semibold">ig</span>
                </div>
              </div>
            </div>
            
            <div className={isVisible ? 'slide-up delay-200' : ''}>
              <h3 className="font-semibold text-gray-900 mb-4">Imóveis</h3>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Comprar</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Arrendar</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Vender</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Avaliar</a></li>
              </ul>
            </div>
            
            <div className={isVisible ? 'slide-up delay-300' : ''}>
              <h3 className="font-semibold text-gray-900 mb-4">Empresa</h3>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Carreiras</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Imprensa</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Contacto</a></li>
              </ul>
            </div>
            
            <div className={isVisible ? 'slide-up delay-400' : ''}>
              <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Ajuda</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Termos</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">Privacidade</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors hover-lift">RGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8">
            <div className={`flex flex-col md:flex-row justify-between items-center ${isVisible ? 'fade-in delay-500' : ''}`}>
              <p className="text-gray-500 font-light">
                © 2024 Domiva. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-sm text-gray-500 font-light">Feito com ❤️ em Portugal</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
} 
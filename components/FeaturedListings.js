'use client'

import { useState, useEffect } from 'react'
import { getFeaturedListings } from '../lib/supabaseClient'
import { MapPin, Bed, Bath, Square } from 'lucide-react'

/**
 * Featured listings component with static data load
 */
export default function FeaturedListings() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Format price in Portuguese locale
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Format area
  const formatArea = (area) => {
    return area ? `${area}m²` : 'N/A'
  }

  // Get first image or placeholder
  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return images[0]
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'
  }

  useEffect(() => {
    // Load initial listings once
    const loadListings = async () => {
      try {
        const data = await getFeaturedListings(6)
        setListings(data)
      } catch (error) {
        console.error('Error loading listings:', error)
        // Keep empty array if error
      } finally {
        setIsLoading(false)
      }
    }

    loadListings()
  }, []) // Empty dependency array - runs only once

  if (isLoading) {
    return (
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Descubra as melhores oportunidades do mercado imobiliário português
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (listings.length === 0) {
    return (
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Em breve teremos imóveis incríveis para mostrar aqui
            </p>
          </div>
          
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Primeiros Imóveis em Breve
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Seja o primeiro a anunciar o seu imóvel na nossa plataforma moderna e alcance milhares de potenciais compradores.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Imóveis em Destaque
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Descubra as melhores oportunidades do mercado imobiliário português
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <div key={listing.id} className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(listing.images)}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                      {listing.typology}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location_text}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(listing.price)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    {listing.rooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {listing.rooms}
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {listing.bathrooms}
                      </div>
                    )}
                    {listing.area && (
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {formatArea(listing.area)}
                      </div>
                    )}
                  </div>
                  
                  {listing.profiles && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Por {listing.profiles.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          listing.profiles.role === 'agente' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.profiles.role === 'agente' ? 'Agente' : 'Particular'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="btn-primary">
            Ver Todos os Imóveis
          </button>
        </div>
      </div>
    </section>
  )
} 
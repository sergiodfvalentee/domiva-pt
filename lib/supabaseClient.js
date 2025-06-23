import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase = null

// Debug environment variables in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Environment Variables Check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set ✅' : 'Missing ❌')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set ✅' : 'Missing ❌')
  
  if (supabaseUrl) {
    console.log('Supabase URL:', supabaseUrl)
  }
  if (supabaseAnonKey) {
    console.log('Anon Key length:', supabaseAnonKey.length, 'characters')
  }
}

// Create Supabase client if environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Supabase client created successfully')
      console.log('Client URL:', supabase.supabaseUrl)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('❌ Supabase client creation failed:', error)
    }
  }
} else {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Missing environment variables, using mock data')
    console.warn('URL missing:', !supabaseUrl)
    console.warn('Key missing:', !supabaseAnonKey)
  }
}

// Export the supabase client
export { supabase }

// Fallback mock data
const mockStats = {
  listings: 10,
  users: 8,
  satisfaction: 98
}

const mockListings = [
  {
    id: '1',
    title: 'Apartamento T3 com Vista Mar - Cascais',
    price: 450000,
    location_text: 'Cascais, Lisboa',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format'
    ],
    typology: 'T3',
    area: 120,
    rooms: 3,
    bathrooms: 2,
    created_at: '2024-01-15T10:30:00Z',
    profiles: {
      name: 'Maria Silva',
      role: 'agente'
    }
  },
  {
    id: '2',
    title: 'Moradia V4 com Jardim - Sintra',
    price: 680000,
    location_text: 'Sintra, Lisboa',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'
    ],
    typology: 'V4',
    area: 180,
    rooms: 4,
    bathrooms: 3,
    created_at: '2024-01-14T15:20:00Z',
    profiles: {
      name: 'João Santos',
      role: 'particular'
    }
  },
  {
    id: '3',
    title: 'Apartamento T2 Renovado - Porto Centro',
    price: 320000,
    location_text: 'Porto, Porto',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&auto=format'
    ],
    typology: 'T2',
    area: 85,
    rooms: 2,
    bathrooms: 1,
    created_at: '2024-01-13T09:15:00Z',
    profiles: {
      name: 'Ana Costa',
      role: 'agente'
    }
  },
  {
    id: '4',
    title: 'Loft Moderno - Lisboa Príncipe Real',
    price: 550000,
    location_text: 'Príncipe Real, Lisboa',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format'
    ],
    typology: 'Loft',
    area: 95,
    rooms: 1,
    bathrooms: 1,
    created_at: '2024-01-12T14:45:00Z',
    profiles: {
      name: 'Pedro Oliveira',
      role: 'particular'
    }
  },
  {
    id: '5',
    title: 'Apartamento T4 com Terraço - Braga',
    price: 280000,
    location_text: 'Braga, Braga',
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1505843795480-5cfb3c03f6ff?w=800&h=600&fit=crop&auto=format'
    ],
    typology: 'T4',
    area: 140,
    rooms: 4,
    bathrooms: 2,
    created_at: '2024-01-11T11:30:00Z',
    profiles: {
      name: 'Sofia Ferreira',
      role: 'agente'
    }
  },
  {
    id: '6',
    title: 'Quinta com Piscina - Aveiro',
    price: 750000,
    location_text: 'Aveiro, Aveiro',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format'
    ],
    typology: 'Quinta',
    area: 300,
    rooms: 6,
    bathrooms: 4,
    created_at: '2024-01-10T16:00:00Z',
    profiles: {
      name: 'Miguel Rodrigues',
      role: 'particular'
    }
  }
]

/**
 * Get real-time statistics from database
 */
export async function getStats() {
  if (!supabase) {
    console.log('Using fallback stats - Supabase not available')
    return mockStats
  }

  try {
    // Get total listings count
    const { count: listingsCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aprovado')

    // Get total users count
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Calculate satisfaction rate based on approved vs total listings
    const { count: totalListings } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })

    const satisfactionRate = totalListings > 0 
      ? Math.round((listingsCount / totalListings) * 100)
      : 98

    console.log('Real Supabase stats loaded:', { listingsCount, usersCount, satisfactionRate })

    return {
      listings: listingsCount || 0,
      users: usersCount || 0,
      satisfaction: satisfactionRate
    }
  } catch (error) {
    console.error('Error fetching stats from Supabase:', error)
    console.log('Using fallback stats')
    return mockStats
  }
}

/**
 * Get featured listings for homepage
 */
export async function getFeaturedListings(limit = 6) {
  if (!supabase) {
    console.log('Using fallback listings - Supabase not available')
    return [] // Return empty array when Supabase is not configured
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        location_text,
        images,
        typology,
        area,
        rooms,
        bathrooms,
        created_at,
        profiles (
          name,
          role
        )
      `)
      .eq('status', 'aprovado')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    console.log('Real Supabase listings loaded:', data?.length || 0, 'listings')
    return data || []
  } catch (error) {
    console.error('Error fetching listings from Supabase:', error)
    console.log('Using empty listings - database query failed')
    return [] // Return empty array when database query fails
  }
}

 
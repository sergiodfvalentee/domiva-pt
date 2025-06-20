'use client'

import { useState, useEffect } from 'react'
import { Home, User, Settings, LogOut, Heart, Eye, Plus, Bell, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProfile, signOut } from '../../lib/auth'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          router.push('/login')
          return
        }

        setUser(currentUser)

        // Get user profile from database
        const { data: profileData, error: profileError } = await getUserProfile(currentUser.id)
        
        if (profileError && profileError.message === 'PROFILE_NOT_FOUND') {
          // Profile doesn't exist, create it from user metadata
          console.log('Creating missing profile for user:', currentUser.id)
          const newProfile = {
            id: currentUser.id,
            name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Utilizador',
            email: currentUser.email,
            phone: currentUser.user_metadata?.phone || '',
            role: currentUser.user_metadata?.user_type || 'particular'
          }
          
          // Try to create the profile
          try {
            const { data } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single()
            
            if (data) {
              setProfile(data)
            } else {
              setProfile(newProfile) // Use the data we have
            }
          } catch (err) {
            console.error('Error creating profile:', err)
            setProfile(newProfile) // Use the data we have anyway
          }
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Domiva</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile?.name || user?.user_metadata?.name || 'Utilizador'}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                  profile?.role === 'agente' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {profile?.role === 'agente' ? 'Agente Imobiliário' : 'Particular'}
                </span>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/imoveis" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                  <Plus className="h-5 w-5" />
                  <span>Meus Imóveis</span>
                </Link>
                <Link href="/dashboard/favoritos" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Favoritos</span>
                </Link>
                <Link href="/dashboard/perfil" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta, {profile?.name?.split(' ')[0] || 'Utilizador'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                {profile?.role === 'agente' 
                  ? 'Gerir os seus imóveis e clientes nunca foi tão fácil.'
                  : 'Encontre a casa dos seus sonhos com a Domiva.'
                }
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {profile?.role === 'agente' ? 'Adicionar Imóvel' : 'Pesquisar Imóveis'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {profile?.role === 'agente' 
                    ? 'Publique um novo imóvel na plataforma'
                    : 'Encontre imóveis que combinam consigo'
                  }
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Favoritos</h3>
                <p className="text-gray-600 text-sm">
                  Veja os imóveis que guardou para mais tarde
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualizações</h3>
                <p className="text-gray-600 text-sm">
                  {profile?.role === 'agente' 
                    ? 'Veja as estatísticas dos seus imóveis'
                    : 'Histórico de imóveis visualizados'
                  }
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividade Recente</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Bem-vindo à Domiva!</p>
                    <p className="text-gray-600 text-sm">Conta criada com sucesso</p>
                  </div>
                  <span className="text-gray-500 text-xs">Agora</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
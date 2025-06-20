'use client'

import { useState, useEffect } from 'react'
import { Home, Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, signInWithProvider, isAuthenticated, resendVerificationEmail } from '../../lib/auth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated()
      if (authenticated) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await signIn(formData)
      
      if (error) {
        setError(getErrorMessage(error.message))
        return
      }

      if (data?.user) {
        setSuccess('Login realizado com sucesso! Redirecionando...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await signInWithProvider(provider)
      if (error) {
        setError(`Erro ao entrar com ${provider}. Tente novamente.`)
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user types
    if (error) setError('')
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Por favor, introduza o seu email primeiro.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await resendVerificationEmail(formData.email)
      if (error) {
        setError('Erro ao reenviar email. Tente novamente.')
      } else {
        setSuccess('Email de verificação reenviado! Verifique a sua caixa de entrada.')
        setError('')
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (error) => {
    if (error.includes('NEED_EMAIL_VERIFICATION')) {
      return 'Por favor, confirme o seu email antes de fazer login. Verifique a sua caixa de entrada e pasta de spam.'
    }
    if (error.includes('Invalid login credentials')) {
      return 'Email ou palavra-passe incorretos.'
    }
    if (error.includes('Email not confirmed')) {
      return 'Por favor, confirme o seu email antes de fazer login.'
    }
    if (error.includes('Too many requests')) {
      return 'Muitas tentativas. Tente novamente mais tarde.'
    }
    return 'Erro ao fazer login. Verifique os seus dados.'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="absolute top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom">
          <div className="flex justify-between items-center py-3 md:py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Domiva</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <Link href="/criar-conta" className="btn-ghost">
                Criar conta
              </Link>
              <Link href="/login" className="btn-primary">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bem-vindo de volta
                </h1>
                <p className="text-gray-600">
                  Entre na sua conta Domiva
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                  {(error.includes('NEED_EMAIL_VERIFICATION') || error.includes('Email not confirmed') || error.includes('confirme o seu email')) && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                      className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Reenviando...' : 'Reenviar email de verificação'}
                    </button>
                  )}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Palavra-passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                  </label>
                  <Link href="/recuperar-password" className="text-sm text-gray-900 hover:underline">
                    Esqueceu a palavra-passe?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                  <span>{isLoading ? 'Entrando...' : 'Entrar'}</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium text-gray-700">Continuar com Google</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium text-gray-700">Continuar com Facebook</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Ainda não tem conta?{' '}
                  <Link href="/criar-conta" className="text-gray-900 font-medium hover:underline">
                    Criar conta gratuita
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 
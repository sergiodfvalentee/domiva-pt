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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="absolute top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/50">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Domiva
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/criar-conta" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300">
                Não tem conta?
              </Link>
              <Link href="/criar-conta" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Login Form */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Bem-vindo de volta
                </h1>
                <p className="text-gray-600 text-lg">
                  Entre na sua conta Domiva
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200/50">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                  {(error.includes('NEED_EMAIL_VERIFICATION') || error.includes('Email not confirmed') || error.includes('confirme o seu email')) && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                      className="mt-3 w-full bg-red-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Reenviando...' : 'Reenviar email de verificação'}
                    </button>
                  )}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50/80 backdrop-blur-sm border border-green-200/50">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Palavra-passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="A sua palavra-passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/recuperar-password" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300">
                    Esqueceu-se da palavra-passe?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <span>Entrar na conta</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium">ou continue com</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/80 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-semibold text-gray-700">Continuar com Google</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/80 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-semibold text-gray-700">Continuar com Facebook</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Não tem uma conta?{' '}
                  <Link href="/criar-conta" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
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
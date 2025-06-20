'use client'

import { useState, useEffect } from 'react'
import { Home, Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { updatePassword, getCurrentUser } from '../../lib/auth'
import { validatePassword } from '../../lib/validation'
import { useRouter } from 'next/navigation'

export default function RedefinirPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has a valid session (came from email link)
    const checkSession = async () => {
      const user = await getCurrentUser()
      if (user) {
        setIsValidSession(true)
      } else {
        setError('Sessão inválida. Solicite um novo link de recuperação.')
      }
    }
    
    checkSession()
  }, [])

  const validateForm = () => {
    if (!password) {
      setError('Nova palavra-passe é obrigatória.')
      return false
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message)
      return false
    }

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { error } = await updatePassword(password)
      
      if (error) {
        setError('Erro ao redefinir palavra-passe. Tente novamente.')
        return
      }

      setSuccess('Palavra-passe redefinida com sucesso! Redirecionando...')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession && !error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-900" />
          <p className="text-gray-600">Verificando sessão...</p>
        </div>
      </main>
    )
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

      {/* Reset Password Form */}
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-gray-900" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Redefinir palavra-passe
                </h1>
                <p className="text-gray-600">
                  Escolha uma nova palavra-passe segura para a sua conta
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-6 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {isValidSession && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Nova palavra-passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (error) setError('')
                        }}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        placeholder="Nova palavra-passe"
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
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 8 caracteres com pelo menos uma letra
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar palavra-passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (error) setError('')
                        }}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        placeholder="Confirmar palavra-passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                    <span>{isLoading ? 'Redefinindo...' : 'Redefinir palavra-passe'}</span>
                  </button>
                </form>
              )}

              {/* Back to Login */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Voltar ao{' '}
                  <Link href="/login" className="text-gray-900 font-medium hover:underline">
                    login
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
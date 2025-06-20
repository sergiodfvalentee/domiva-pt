'use client'

import { useState, useEffect } from 'react'
import { Home, Eye, EyeOff, Mail, Lock, User, Phone, Loader, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, signInWithProvider, isAuthenticated } from '../../lib/auth'
import { 
  validateRegistrationForm, 
  sanitizeString, 
  detectSuspiciousActivity,
  checkClientRateLimit 
} from '../../lib/validation'

export default function CriarContaPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'particular',
    acceptTerms: false
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

  const validateForm = () => {
    // Check for suspicious activity
    const inputs = [formData.name, formData.email, formData.phone]
    for (const input of inputs) {
      if (detectSuspiciousActivity(input)) {
        setError('Dados inválidos detectados.')
        return false
      }
    }

    // Use comprehensive validation
    const validation = validateRegistrationForm(formData)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      setError(firstError)
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Check client-side rate limiting (very relaxed for development)
    if (!checkClientRateLimit('registration', 100, 60 * 60 * 1000)) { // 100 attempts per hour
      setError('Muitas tentativas de registo. Tente novamente mais tarde.')
      return
    }

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { data, error } = await signUp({
        email: sanitizeString(formData.email.toLowerCase()),
        password: formData.password,
        name: sanitizeString(formData.name),
        phone: sanitizeString(formData.phone),
        userType: formData.userType
      })
      
      if (error) {
        setError(getErrorMessage(error.message))
        return
      }

      if (data?.user) {
        if (data.user.email_confirmed_at) {
          setSuccess('Conta criada e verificada com sucesso! Pode agora fazer login.')
        } else {
          setSuccess('Conta criada com sucesso! ✨ Enviámos um email de verificação para ' + formData.email + '. Clique no link no email para ativar a sua conta antes de fazer login.')
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          userType: 'particular',
          acceptTerms: false
        })
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = async (provider) => {
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await signInWithProvider(provider)
      if (error) {
        setError(`Erro ao registar com ${provider}. Tente novamente.`)
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // Clear errors when user types
    if (error) setError('')
  }

  const getErrorMessage = (error) => {
    // Check for our custom duplicate email message first
    if (error.includes('Este email já está registado')) {
      return error // Return the exact message from auth.js
    }
    if (error.includes('User already registered') || error.includes('already registered')) {
      return 'Este email já está registado. Tente fazer login ou recuperar a password.'
    }
    if (error.includes('Password should be at least') || error.includes('password')) {
      return 'A palavra-passe deve ter pelo menos 8 caracteres.'
    }
    if (error.includes('Invalid email') || error.includes('email')) {
      return 'Email inválido.'
    }
    if (error.includes('Invalid API key')) {
      return 'Erro de configuração. Contacte o administrador.'
    }
    // Return the original error message if it's already user-friendly
    return error
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

      {/* Sign Up Form */}
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Criar conta gratuita
                </h1>
                <p className="text-gray-600">
                  Junte-se à Domiva e encontre a casa dos seus sonhos
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de conta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.userType === 'particular' 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="userType"
                        value="particular"
                        checked={formData.userType === 'particular'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Particular</span>
                    </label>
                    <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.userType === 'agente' 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="userType"
                        value="agente"
                        checked={formData.userType === 'agente'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Agente</span>
                    </label>
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                </div>

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

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      placeholder="+351 xxx xxx xxx"
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
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
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

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 mt-1"
                    required
                  />
                  <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                    Aceito os{' '}
                    <Link href="/termos" className="text-gray-900 hover:underline">
                      Termos e Condições
                    </Link>
                    {' '}e a{' '}
                    <Link href="/privacidade" className="text-gray-900 hover:underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                  <span>{isLoading ? 'Criando conta...' : 'Criar conta gratuita'}</span>
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
                  onClick={() => handleSocialSignUp('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium text-gray-700">Continuar com Google</span>
                </button>
                <button 
                  onClick={() => handleSocialSignUp('facebook')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium text-gray-700">Continuar com Facebook</span>
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Já tem conta?{' '}
                  <Link href="/login" className="text-gray-900 font-medium hover:underline">
                    Entrar
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
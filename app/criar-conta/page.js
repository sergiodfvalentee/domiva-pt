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
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300">
                Já tem conta?
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                Entrar
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

      {/* Sign Up Form */}
      <section className="pt-24 pb-16 relative z-10">
        <div className="container-custom">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Criar conta gratuita
                </h1>
                <p className="text-gray-600 text-lg">
                  Junte-se à Domiva e encontre a casa dos seus sonhos
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200/50">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50/80 backdrop-blur-sm border border-green-200/50">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="O seu nome completo"
                      required
                    />
                  </div>
                </div>

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

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="+351 912 345 678"
                      required
                    />
                  </div>
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de utilizador
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="particular"
                        checked={formData.userType === 'particular'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.userType === 'particular' 
                          ? 'border-blue-500 bg-blue-50/50 shadow-lg' 
                          : 'border-gray-200 bg-white/30 hover:border-gray-300'
                      }`}>
                        <div className="text-center">
                          <User className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Particular</span>
                        </div>
                      </div>
                    </label>
                    <label className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="agente"
                        checked={formData.userType === 'agente'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.userType === 'agente' 
                          ? 'border-blue-500 bg-blue-50/50 shadow-lg' 
                          : 'border-gray-200 bg-white/30 hover:border-gray-300'
                      }`}>
                        <div className="text-center">
                          <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Agente</span>
                        </div>
                      </div>
                    </label>
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
                      placeholder="Mínimo 8 caracteres"
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

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar palavra-passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Repita a palavra-passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
                    Concordo com os{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Termos de Serviço
                    </Link>{' '}
                    e{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.acceptTerms}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <span>Criar conta gratuita</span>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                    Entrar agora
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
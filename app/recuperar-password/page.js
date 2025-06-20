'use client'

import { useState } from 'react'
import { Home, Mail, ArrowLeft, Loader } from 'lucide-react'
import Link from 'next/link'
import { resetPassword } from '../../lib/auth'

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Email é obrigatório.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        setError('Erro ao enviar email de recuperação. Verifique o email inserido.')
        return
      }

      setSuccess('Email de recuperação enviado! Verifique a sua caixa de entrada.')
      setEmail('')
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
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

      {/* Recovery Form */}
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Back Button */}
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Voltar ao login</span>
              </Link>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Recuperar palavra-passe
                </h1>
                <p className="text-gray-600">
                  Insira o seu email e enviaremos instruções para redefinir a sua palavra-passe
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-6">
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError('')
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                  <span>{isLoading ? 'Enviando...' : 'Enviar email de recuperação'}</span>
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Lembrou-se da palavra-passe?{' '}
                  <Link href="/login" className="text-gray-900 font-medium hover:underline">
                    Fazer login
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
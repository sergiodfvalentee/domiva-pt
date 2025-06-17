'use client'

import { useState, useEffect } from 'react'
import { getStats } from '../lib/supabaseClient'

/**
 * Real-time statistics component
 * @param {Object} props - Component props
 * @param {Object} props.fallbackStats - Fallback stats to show while loading
 */
export default function RealTimeStats({ fallbackStats = { listings: 1250, users: 850, satisfaction: 98 } }) {
  const [stats, setStats] = useState(fallbackStats)
  const [isLoading, setIsLoading] = useState(true)

  // Format numbers with Portuguese locale
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k+`
    }
    return num.toString()
  }

  // Format satisfaction as percentage
  const formatSatisfaction = (rate) => {
    return `${rate}%`
  }

  useEffect(() => {
    // Load initial stats once
    const loadStats = async () => {
      try {
        const realStats = await getStats()
        setStats(realStats)
      } catch (error) {
        console.error('Error loading stats:', error)
        // Keep fallback stats if error
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, []) // Empty dependency array - runs only once

  return (
    <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <div className={`text-3xl font-bold text-gray-900 mb-1 transition-all duration-500 ${isLoading ? 'animate-pulse' : ''}`}>
          {formatNumber(stats.listings)}
        </div>
        <div className="text-sm text-gray-600">Imóveis</div>
      </div>
      
      <div className="text-center">
        <div className={`text-3xl font-bold text-gray-900 mb-1 transition-all duration-500 ${isLoading ? 'animate-pulse' : ''}`}>
          {formatNumber(stats.users)}
        </div>
        <div className="text-sm text-gray-600">Utilizadores</div>
      </div>
      
      <div className="text-center">
        <div className={`text-3xl font-bold text-gray-900 mb-1 transition-all duration-500 ${isLoading ? 'animate-pulse' : ''}`}>
          {formatSatisfaction(stats.satisfaction)}
        </div>
        <div className="text-sm text-gray-600">Aprovação</div>
      </div>
    </div>
  )
} 
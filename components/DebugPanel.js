import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState({
    envVars: {
      url: null,
      keyLength: null,
      hasSupabase: false
    },
    connection: {
      status: 'checking',
      error: null,
      detailed: null
    }
  })

  useEffect(() => {
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔍 DEBUG: Environment Variables')
    console.log('URL:', url ? 'Set ✅' : 'Missing ❌')
    console.log('Key:', key ? 'Set ✅' : 'Missing ❌')
    console.log('Supabase instance:', supabase ? 'exists' : 'null')

    setDebugInfo(prev => ({
      ...prev,
      envVars: {
        url: url || 'MISSING',
        keyLength: key ? key.length : 0,
        hasSupabase: !!supabase
      }
    }))

    // Test connection with multiple approaches
    const testConnection = async () => {
      if (!supabase) {
        setDebugInfo(prev => ({
          ...prev,
          connection: {
            status: 'error',
            error: 'Supabase client not initialized',
            detailed: 'Client creation failed'
          }
        }))
        return
      }

      try {
        console.log('🧪 Testing Supabase connection...')
        
        // Test 1: Simple auth check
        console.log('🧪 Test 1: Auth getUser...')
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError && !userError.message.includes('not authenticated')) {
          throw new Error(`Auth test failed: ${userError.message}`)
        }
        
        console.log('✅ Auth test passed')
        
        // Test 2: Simple database query
        console.log('🧪 Test 2: Database connection...')
        const { data: dbData, error: dbError } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true })
          .limit(0)
        
        if (dbError) {
          console.log('⚠️ Database test failed but auth works:', dbError.message)
          setDebugInfo(prev => ({
            ...prev,
            connection: {
              status: 'partial',
              error: 'Auth works, DB fails',
              detailed: dbError.message
            }
          }))
          return
        }

        console.log('✅ Database test passed')
        console.log('✅ Full connection test successful')
        setDebugInfo(prev => ({
          ...prev,
          connection: {
            status: 'success',
            error: null,
            detailed: 'All tests passed'
          }
        }))
      } catch (error) {
        console.error('❌ Connection test failed:', error)
        
        setDebugInfo(prev => ({
          ...prev,
          connection: {
            status: 'error',
            error: error.message,
            detailed: error.name + ': ' + error.message
          }
        }))
      }
    }

    testConnection()
  }, [])

  // Show in all environments for now (debugging production)
  // if (process.env.NODE_ENV !== 'development') {
  //   return null // Only show in development
  // }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-yellow-400 mb-2">🔧 Debug Panel</h3>
      
      <div className="mb-2">
        <h4 className="font-semibold text-blue-400">Environment Variables:</h4>
        <div>URL: <span className={debugInfo.envVars.url === 'MISSING' ? 'text-red-400' : 'text-green-400'}>
          {debugInfo.envVars.url === 'MISSING' ? 'MISSING' : 'SET ✅'}
        </span></div>
        <div>Key Length: <span className={debugInfo.envVars.keyLength === 0 ? 'text-red-400' : 'text-green-400'}>
          {debugInfo.envVars.keyLength}
        </span></div>
        <div>Supabase Client: <span className={!debugInfo.envVars.hasSupabase ? 'text-red-400' : 'text-green-400'}>
          {debugInfo.envVars.hasSupabase ? '✅' : '❌'}
        </span></div>
      </div>

      <div>
        <h4 className="font-semibold text-blue-400">Connection Test:</h4>
        <div>Status: <span className={
          debugInfo.connection.status === 'success' ? 'text-green-400' : 
          debugInfo.connection.status === 'partial' ? 'text-yellow-400' :
          debugInfo.connection.status === 'error' ? 'text-red-400' : 'text-yellow-400'
        }>
          {debugInfo.connection.status}
        </span></div>
        {debugInfo.connection.error && (
          <div className="text-red-400 text-xs mt-1">
            Error: {debugInfo.connection.error}
          </div>
        )}
        {debugInfo.connection.detailed && (
          <div className="text-gray-300 text-xs mt-1 break-words">
            Details: {debugInfo.connection.detailed}
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        Check console (F12) for detailed logs
      </div>
    </div>
  )
} 
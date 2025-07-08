import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Usuario } from '../../types'

interface AuthContextType {
  user: Usuario | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setUser(userData)
      }
      
      setLoading(false)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session?.user.id)
          .single()
        
        setUser(userData)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) throw error
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

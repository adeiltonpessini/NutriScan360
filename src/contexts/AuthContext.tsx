import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Usuario } from '../types'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: Usuario | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, nome: string, role: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  loading: true
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
        navigate('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        navigate('/login')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) throw error
    setLoading(false)
  }

  const signUp = async (email: string, password: string, nome: string, role: string) => {
    setLoading(true)
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) throw authError

    if (data.user) {
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          id: data.user.id,
          nome,
          email,
          role
        })

      if (insertError) throw insertError
    }

    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

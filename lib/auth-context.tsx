"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

type UserProfile = {
  id: string
  email: string
  full_name: string
  avatar_url: string
  created_at: string
  updated_at: string
}

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const getProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // Silently ignore missing profile rows or RLS errors
    setUserProfile(profile ?? null)
    return profile
  }

  const refreshProfile = async () => {
    if (user) {
      await getProfile(user.id)
    }
  }

  const signOut = async () => {
    console.log('Attempting to sign out...')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out from Supabase:', error.message)
        alert(`Sign out failed: ${error.message}`)
      } else {
        console.log('Successfully signed out from Supabase. Clearing user state.')
        setUser(null)
        setUserProfile(null)
        router.push('/')
        router.refresh()
        console.log('Redirected to home and refreshed.')
      }
    } catch (error) {
      console.error('An unexpected error occurred during sign out:', error)
      alert(`An unexpected error occurred: ${error}`)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await getProfile(session.user.id)
      }
      } catch (error) {
        console.error('Error getting initial session:', error)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        if (session?.user) {
          setUser(session.user)
          await getProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Add a method to force refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
        return false
      }
      if (data.session?.user) {
        setUser(data.session.user)
        await getProfile(data.session.user.id)
      }
      return true
    } catch (error) {
      console.error('Error in refreshSession:', error)
      return false
    }
  }

  const value = {
    user,
    userProfile,
    isLoading,
    signOut,
    refreshProfile,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

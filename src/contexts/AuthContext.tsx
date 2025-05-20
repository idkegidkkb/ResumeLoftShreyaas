import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Types for our database tables
export type Profile = {
  id: string
  created_at: string
  email: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string | null
  is_pro?: boolean; // Added is_pro field - assuming it's a boolean
}

// Define a type that includes both User and Profile data
export type AuthenticatedUser = User & { profile?: Profile }

type AuthContextType = {
  user: AuthenticatedUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<string> // Changed return type from void to string
  signOut: () => Promise<void>
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile
  const getProfile = async (userId: string) => {
    try {
      // Remove the delay that could cause hanging
      // await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, created_at, email, full_name, avatar_url, updated_at, is_pro')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Exception fetching profile:', error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    // Check active sessions and sets the user
    const fetchSessionAndProfile = async () => {
      try {
        setLoading(true)
        console.log('Fetching session...')
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        console.log('Session fetched:', session ? 'Session exists' : 'No session')

        if (session?.user) {
          try {
            console.log('Fetching profile for user:', session.user.id)
            // Add timeout to profile fetch
            const profilePromise = getProfile(session.user.id)
            
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Profile fetch timed out')), 2000)
            })
            
            // Race the profile fetch against a timeout
            const profile = await Promise.race([
              profilePromise,
              timeoutPromise
            ]).catch(err => {
              console.warn('Profile fetch issue:', err)
              return null // Return null if timeout or error
            })
            
            console.log('Profile fetched:', profile ? 'Profile exists' : 'No profile')
            
            if (mounted) {
              setUser({ ...session.user, profile: profile || undefined } as AuthenticatedUser)
            }
          } catch (profileError) {
            console.error('Error fetching profile in session check:', profileError)
            if (mounted) {
              // Still set the user even if profile fetch fails
              setUser({ ...session.user } as AuthenticatedUser)
            }
          }
        } else {
          if (mounted) {
            setUser(null)
          }
        }
      } catch (err) {
        console.error('Session fetch error:', err)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchSessionAndProfile()

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      try {
        if (session?.user) {
          try {
            // Add timeout to profile fetch
            const profilePromise = getProfile(session.user.id)
            
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Profile fetch timed out')), 2000)
            })
            
            // Race the profile fetch against a timeout
            const profile = await Promise.race([
              profilePromise,
              timeoutPromise
            ]).catch(err => {
              console.warn('Profile fetch issue:', err)
              return null // Return null if timeout or error
            })
            
            if (mounted) {
              setUser({ ...session.user, profile: profile || undefined } as AuthenticatedUser)
            }
          } catch (profileError) {
            console.error('Error fetching profile in auth state change:', profileError)
            if (mounted) {
              // Still set the user even if profile fetch fails
              setUser({ ...session.user } as AuthenticatedUser)
            }
          }
        } else {
          if (mounted) {
            setUser(null)
          }
        }
      } catch (err) {
        console.error('Auth state change error:', err)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) {
        console.error('Login error:', error)
        throw error
      }
      
      if (data.user) {
        try {
          // Add timeout to profile fetch
          const profilePromise = getProfile(data.user.id)
          
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile fetch timed out')), 2000)
          })
          
          // Race the profile fetch against a timeout
          const profile = await Promise.race([
            profilePromise,
            timeoutPromise
          ]).catch(err => {
            console.warn('Profile fetch issue:', err)
            return null // Return null if timeout or error
          })
          
          // Set user even if profile fetch times out
          setUser({ ...data.user, profile: profile || undefined } as AuthenticatedUser)
        } catch (profileError) {
          console.error('Error fetching profile after login:', profileError)
          // Still set the user even if profile fetch fails
          setUser({ ...data.user } as AuthenticatedUser)
        }
      } else {
        // Handle case where no error but also no user
        console.warn('Sign in returned no error but also no user data')
        setUser(null)
      }
    } catch (error) {
      console.error('Login error:', error)
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true)
      
      // Signup with Supabase - no timeout, let it complete naturally
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
            email: email
          },
          // Disable auto confirmation of email to ensure clean signup process
          emailRedirectTo: window.location.origin + '/login'
        }
      })

      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      if (!data.user) {
        throw new Error('No user data returned after signup')
      }

      console.log('Signup successful, user created:', data.user.id)
      
      // Explicitly create the profile after signup to avoid race conditions
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName || null
          })
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Log but continue - don't throw, as user is created
        } else {
          console.log('Profile created successfully for user:', data.user.id)
        }
      } catch (profileErr) {
        console.error('Failed to create profile:', profileErr)
        // Continue despite profile creation failure
      }
      
      // Return the user ID to confirm signup was successful
      return data.user.id
      
    } catch (error: any) {
      console.error('Signup process error:', error)
      
      if (error.message?.includes('already registered') || 
          error.message?.includes('already exists')) {
        throw new Error('An account with this email already exists')
      } else if (error.message?.includes('network') || 
                error.message?.includes('timeout')) {
        throw new Error('Network error. Please check your internet connection and try again.')
      } else {
        throw new Error(error.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
    } catch (error) {
      console.error('Signout error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setLoading(true)
      
      // Remove arbitrary delay
      // await new Promise(resolve => setTimeout(resolve, 500))
      
      const { error, data: updateData } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
      
      if (error) {
        console.error('Update profile error:', error)
        
        // If the profile update fails because profile doesn't exist yet, try inserting it
        if (error.code === '23503' || error.message?.includes('violates foreign key constraint')) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              ...data
            })
          
          if (insertError) throw insertError
        } else {
          throw error
        }
      }
      
      // After updating profile, refetch with timeout to keep context in sync
      try {
        // Add timeout to profile fetch
        const profilePromise = getProfile(user.id)
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile fetch timed out')), 2000)
        })
        
        // Race the profile fetch against a timeout
        const updatedProfile = await Promise.race([
          profilePromise,
          timeoutPromise
        ]).catch(err => {
          console.warn('Profile fetch issue:', err)
          return null // Return null if timeout or error
        })
        
        if (!updatedProfile) {
          console.warn('Could not fetch updated profile, using local update')
          // Create a locally updated profile if fetch failed
          const currentProfile = user.profile || {
            id: user.id,
            created_at: new Date().toISOString(),
            email: user.email || '',
            full_name: null,
            avatar_url: null,
            updated_at: new Date().toISOString(),
            is_pro: false // Default to false for new profiles
          }
          
          setUser({ 
            ...user, 
            profile: { 
              ...currentProfile, 
              ...data,
              updated_at: new Date().toISOString()
            } 
          } as AuthenticatedUser)
        } else {
          setUser({ ...user, profile: updatedProfile } as AuthenticatedUser)
        }
      } catch (fetchError) {
        console.error('Error fetching updated profile:', fetchError)
        // Still update the user with local data on error
        const currentProfile = user.profile || {
          id: user.id,
          created_at: new Date().toISOString(),
          email: user.email || '',
          full_name: null,
          avatar_url: null,
          updated_at: new Date().toISOString()
        }
        
        setUser({ 
          ...user, 
          profile: { 
            ...currentProfile, 
            ...data,
            updated_at: new Date().toISOString()
          } 
        } as AuthenticatedUser)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
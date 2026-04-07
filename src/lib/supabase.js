import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a mock client if credentials are missing (dev mode without Supabase)
const isMock = !supabaseUrl || !supabaseAnonKey

let supabaseClient

if (isMock) {
  console.warn('⚠️ Supabase credentials not configured. Running in demo mode with local data.')
  // Create a mock supabase client that returns empty data
  const mockResponse = { data: null, error: null, count: 0 }
  const mockQuery = () => {
    const chain = {
      select: () => chain,
      insert: () => Promise.resolve(mockResponse),
      update: () => chain,
      upsert: () => Promise.resolve(mockResponse),
      delete: () => chain,
      eq: () => chain,
      neq: () => chain,
      order: () => chain,
      limit: () => chain,
      single: () => Promise.resolve(mockResponse),
      then: (resolve) => resolve(mockResponse),
    }
    return chain
  }
  supabaseClient = {
    from: () => mockQuery(),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: (cb) => {
        cb('INITIAL_SESSION', null)
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient

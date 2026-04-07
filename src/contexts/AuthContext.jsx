import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function signUp({ email, password, firstName, lastName, whatsapp, countryCode, address }) {
    // Daftar tanpa kirim email konfirmasi — verifikasi dilakukan oleh admin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,  // tidak ada redirect email
        data: { first_name: firstName, last_name: lastName },
      },
    })
    if (error) throw error

    if (data.user) {
      // Insert profil dengan role hardcoded 'pengguna' & belum terverifikasi
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        whatsapp,
        country_code: countryCode,
        address,
        role: 'pengguna',   // tidak bisa diubah dari form
        is_verified: false, // admin yang verifikasi
      })
      if (profileError) throw profileError
    }
    return data
  }

  async function signIn({ email, password }) {
    // 1. Login ke Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Email atau password salah.')
      }
      if (error.message === 'Email not confirmed') {
        // Email belum dikonfirmasi Supabase — tampilkan sebagai "belum verifikasi admin"
        throw new Error('BELUM_VERIFIKASI')
      }
      throw error
    }

    // 2. Cek status verifikasi admin di tabel profiles
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('is_verified, role')
      .eq('id', data.user.id)
      .single()

    if (profileErr || !profileData) {
      await supabase.auth.signOut()
      throw new Error('Gagal memuat profil. Coba lagi nanti.')
    }

    // 3. Blokir login jika belum diverifikasi admin
    if (!profileData.is_verified) {
      await supabase.auth.signOut() // paksa logout dari Supabase
      throw new Error(
        'BELUM_VERIFIKASI' // kode khusus, ditangkap di Login.jsx
      )
    }

    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin: profile?.role === 'admin',
    isVerified: profile?.is_verified === true,
    isLoggedIn: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

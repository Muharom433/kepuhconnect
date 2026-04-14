import { createContext, useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const VillageContext = createContext({})

export const useVillage = () => useContext(VillageContext)

// Label tampilan untuk tipe desa
const VILLAGE_TYPE_LABELS = {
  desa: 'Desa',
  dusun: 'Padukuhan',
  kelurahan: 'Kelurahan',
  nagari: 'Nagari',
}

// Kata-kata yang tidak boleh dipakai sebagai slug desa
export const RESERVED_SLUGS = [
  'login', 'superadmin', 'tentang', 'syarat-ketentuan',
  'daftar-desa', 'api', 'admin', 'static', 'assets',
]

export function VillageProvider({ children }) {
  const { villageSlug } = useParams()
  const [village, setVillage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!villageSlug) {
      setLoading(false)
      return
    }

    // Jika slug adalah reserved word, langsung set not found
    if (RESERVED_SLUGS.includes(villageSlug.toLowerCase())) {
      setNotFound(true)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchVillage() {
      try {
        setLoading(true)
        setError(null)
        setNotFound(false)

        const { data, error: fetchError } = await supabase
          .from('villages')
          .select('*')
          .eq('slug', villageSlug.toLowerCase())
          .eq('status', 'active')
          .single()

        if (cancelled) return

        if (fetchError || !data) {
          setNotFound(true)
          setVillage(null)
        } else {
          setVillage(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Gagal memuat data desa')
          console.error('VillageContext error:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchVillage()

    return () => { cancelled = true }
  }, [villageSlug])

  const villageTypeLabel = village?.village_type
    ? VILLAGE_TYPE_LABELS[village.village_type] || village.village_type
    : ''

  const value = {
    village,
    villageId: village?.id || null,
    villageSlug: villageSlug || null,
    villageName: village?.name || '',
    villageType: village?.village_type || null,
    villageTypeLabel,
    villageSettings: village?.settings || {},
    loading,
    error,
    isNotFound: notFound,
  }

  return (
    <VillageContext.Provider value={value}>
      {children}
    </VillageContext.Provider>
  )
}

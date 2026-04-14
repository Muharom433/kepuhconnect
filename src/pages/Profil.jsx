import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import { Target, Eye, Award } from 'lucide-react'
import SimpleOrgChart from '../components/SimpleOrgChart'

export default function Profil() {
  const [villageInfo, setVillageInfo] = useState({})
  const [jabatanRaw, setJabatanRaw] = useState([])
  const { villageId } = useVillage()

  useEffect(() => {
    if (!villageId) return
    async function fetch() {
      const [infoRes, structRes] = await Promise.all([
        supabase.from('village_info').select('*').eq('village_id', villageId),
        supabase.from('village_structure')
          .select('*, profiles(id, first_name, last_name, avatar_url)')
          .eq('village_id', villageId)
          .order('sort_order'),
      ])
      if (infoRes.data) {
        const info = {}
        infoRes.data.forEach(item => { info[item.key] = item.value })
        setVillageInfo(info)
      }
      if (structRes.data) {
        setJabatanRaw(structRes.data)
      }
    }
    fetch()
  }, [villageId])

  const visi = villageInfo.visi || 'Mewujudkan Padukuhan Kepuh yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Partisipasi Aktif Masyarakat'
  const misi = villageInfo.misi || '1. Meningkatkan kualitas pelayanan publik\n2. Mengembangkan potensi ekonomi lokal\n3. Meningkatkan kualitas SDM\n4. Melestarikan budaya lokal\n5. Mewujudkan infrastruktur memadai'

  return (
    <div className="page-enter">
      {/* Page Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Tentang Kami</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Profil Padukuhan Kepuh</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Mengenal lebih dekat Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Gunung Kidul
          </p>
        </div>
      </section>

      {/* Visi */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="animate-fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={28} />
                </div>
                <h2 style={{ margin: 0 }}>Visi</h2>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                "{visi}"
              </p>
            </div>
            <div className="animate-fade-in-up delay-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={28} />
                </div>
                <h2 style={{ margin: 0 }}>Misi</h2>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {misi.split(/\\n|\n/).filter(Boolean).map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      {i + 1}
                    </span>
                    {item.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Pemerintahan Desa</span>
            <h2 className="section-title">Struktur Organisasi</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Susunan perangkat Padukuhan Kepuh yang melayani masyarakat
            </p>
          </div>
          <SimpleOrgChart jabatanRaw={jabatanRaw} />
        </div>
      </section>

    </div>
  )
}

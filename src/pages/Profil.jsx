import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import { Target, Eye, MapPin, CheckCircle } from 'lucide-react'
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

      {/* ─── HERO / PAGE HEADER ─────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '52vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #032d1c 0%, #00844F 45%, #005a5f 80%, #032d1c 100%)'
      }}>
        {/* Motif batik halus */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='32' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3Ccircle cx='0' cy='0' r='20' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3Ccircle cx='80' cy='80' r='20' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', pointerEvents: 'none'
        }} />
        {/* Accent glow kanan — oranye */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(239,100,44,0.14) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0
        }} />
        {/* Accent glow kiri — teal */}
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,128,134,0.18) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        <div className="container text-center" style={{ position: 'relative', zIndex: 1, padding: '5rem 1rem 4rem' }}>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(239,100,44,0.18)', border: '1px solid rgba(239,100,44,0.35)',
            borderRadius: '999px', padding: '0.35rem 1rem',
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
            color: '#f4a97a', textTransform: 'uppercase', marginBottom: '1.5rem'
          }}>
            <MapPin size={12} style={{ color: '#EF642C' }} />
            Tentang Kami
          </div>

          <h1 style={{
            color: '#ffffff', fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em',
            textShadow: '0 2px 20px rgba(0,0,0,0.35)'
          }}>Profil Padukuhan Kepuh</h1>

          {/* Garis aksen oranye */}
          <div style={{ width: 48, height: 2, background: '#EF642C', borderRadius: 2, opacity: 0.75, margin: '0 auto 1.25rem' }} />

          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem',
            maxWidth: 560, margin: '0 auto', lineHeight: 1.8
          }}>
            Mengenal lebih dekat Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Gunung Kidul
          </p>

          {/* Trust pills */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            {['Desa Aktif', 'Gunung Kidul', 'DIY'].map((label, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)',
                padding: '0.35rem 0.75rem', fontWeight: 500,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px'
              }}>
                <CheckCircle size={12} style={{ color: '#EF642C', opacity: 0.7 }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISI & MISI ─────────────────────────────── */}
      <section className="section batik-bg">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

            {/* Visi */}
            <div className="animate-fade-in-up" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem 2rem',
              boxShadow: '0 4px 24px rgba(0,132,79,0.06)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Aksen garis atas */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-bg)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,132,79,0.15)'
                }}>
                  <Eye size={26} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Pandangan Kami</p>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--primary-dark)' }}>Visi</h2>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-bg), rgba(0,128,134,0.05))',
                borderLeft: '3px solid var(--primary)',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                padding: '1.25rem 1.5rem'
              }}>
                <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                  "{visi}"
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="animate-fade-in-up delay-2" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem 2rem',
              boxShadow: '0 4px 24px rgba(239,100,44,0.06)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Aksen garis atas — oranye */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #EF642C, #f4a97a)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: 'rgba(239,100,44,0.1)', color: '#EF642C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(239,100,44,0.15)'
                }}>
                  <Target size={26} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Tujuan Kami</p>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text)' }}>Misi</h2>
                </div>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {misi.split(/\\n|\n/).filter(Boolean).map((item, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                    fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.65,
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    background: i % 2 === 0 ? 'var(--bg-alt)' : 'transparent',
                    transition: 'background 0.2s'
                  }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 1,
                      boxShadow: '0 2px 8px rgba(0,132,79,0.25)'
                    }}>
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

      {/* ─── STRUKTUR ORGANISASI ─────────────────────── */}
      <section className="section" style={{
        background: 'var(--bg-alt)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Subtle batik overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='24' fill='none' stroke='rgba(0,132,79,0.08)' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='12' fill='none' stroke='rgba(0,132,79,0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            {/* Accent label oranye — selaras landing page */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#EF642C',
              background: 'rgba(239,100,44,0.08)', border: '1px solid rgba(239,100,44,0.18)',
              borderRadius: '999px', padding: '0.3rem 0.875rem', marginBottom: '1rem'
            }}>Pemerintahan Desa</span>
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

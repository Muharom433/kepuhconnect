import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Info, FileText, CheckCircle } from 'lucide-react'

export default function Persyaratan() {
  const [suratTypes, setSuratTypes] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('surat_types').select('*').eq('is_active', true)
      if (data) setSuratTypes(data)
    }
    fetch()
  }, [])

  const defaultTypes = [
    { id: 1, name: 'Surat Keterangan Domisili', description: 'Surat yang menerangkan domisili/tempat tinggal seseorang', requirements: 'KTP, KK, Pas Foto 3x4' },
    { id: 2, name: 'Surat Keterangan Tidak Mampu', description: 'Surat keterangan untuk warga kurang mampu', requirements: 'KTP, KK, Surat Pengantar RT/RW' },
    { id: 3, name: 'Surat Keterangan Usaha', description: 'Surat keterangan untuk keperluan usaha', requirements: 'KTP, KK, Surat Izin Usaha (jika ada)' },
    { id: 4, name: 'Surat Pengantar SKCK', description: 'Surat pengantar untuk pembuatan SKCK', requirements: 'KTP, KK, Pas Foto 4x6 background merah' },
    { id: 5, name: 'Surat Keterangan Kelahiran', description: 'Surat keterangan kelahiran anak', requirements: 'KTP Orang Tua, KK, Surat Keterangan dari Bidan/RS' },
    { id: 6, name: 'Surat Keterangan Kematian', description: 'Surat keterangan kematian warga', requirements: 'KTP Almarhum, KK, Surat Keterangan dari RS/Dokter' },
  ]

  const displayTypes = suratTypes.length > 0 ? suratTypes : defaultTypes

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Informasi</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Info Persyaratan</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Informasi persyaratan dokumen yang diperlukan untuk setiap jenis surat
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {displayTypes.map(type => (
              <div key={type.id} className="card-flat">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.375rem' }}>{type.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{type.description}</p>
                    <div style={{ background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>Persyaratan:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {type.requirements?.split(',').map((req, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                            <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                            {req.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

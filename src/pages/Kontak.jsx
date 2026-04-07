import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function Kontak() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Hubungi Kami</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Kontak & Lokasi</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Hubungi kami untuk informasi lebih lanjut atau kunjungi kantor desa kami
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Contact Info */}
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Informasi Kontak</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="card-flat" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Alamat</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Kabupaten Gunung Kidul, D.I. Yogyakarta</p>
                  </div>
                </div>
                <div className="card-flat" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Telepon</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>(0231) 123456</p>
                  </div>
                </div>
                <div className="card-flat" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Email</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>info@desakepuh.id</p>
                  </div>
                </div>
                <div className="card-flat" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Jam Operasional</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Senin - Jumat: 08:00 - 16:00 WIB</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sabtu: 08:00 - 12:00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div style={{ width: '100%', height: 250, borderRadius: 'var(--radius-lg)', background: 'var(--bg-alt)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <div className="text-center">
                  <MapPin size={32} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem' }}>Google Maps akan ditampilkan di sini</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Kirim Pesan</h3>
              {submitted && (
                <div className="alert alert-success">
                  Pesan berhasil dikirim! Kami akan segera merespons.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama lengkap" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subjek</label>
                  <input type="text" className="form-input" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subjek pesan" />
                </div>
                <div className="form-group">
                  <label className="form-label">Pesan</label>
                  <textarea className="form-input" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tulis pesan Anda..." rows={5} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <Send size={18} /> Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

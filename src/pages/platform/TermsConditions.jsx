import { Link } from 'react-router-dom'
import { FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsConditions() {
  const sections = [
    { title: '1. Tentang NusaDesa', content: 'NusaDesa adalah platform digital yang dirancang untuk membantu desa, dusun, dan kelurahan di seluruh Indonesia dalam mengelola informasi, layanan persuratan, UMKM, dan data kependudukan secara online. Platform ini dikembangkan untuk mendukung transformasi digital di tingkat pemerintahan desa.' },
    { title: '2. Pendaftaran Desa', content: 'Setiap desa yang ingin bergabung harus mengisi formulir pendaftaran dengan data yang valid dan lengkap. Tim NusaDesa akan memverifikasi data sebelum mengaktifkan akun desa. Desa yang terdaftar akan mendapatkan URL unik untuk mengakses platform. Satu desa hanya boleh mendaftarkan satu akun.' },
    { title: '3. Peran dan Tanggung Jawab', content: 'Super Admin NusaDesa bertanggung jawab mengelola platform secara keseluruhan. Admin Desa bertanggung jawab mengelola data dan layanan desanya masing-masing. Pengguna (warga) bertanggung jawab atas kebenaran data yang diinputkan.' },
    { title: '4. Penggunaan Data', content: 'Data yang diinputkan ke platform NusaDesa akan digunakan semata-mata untuk kepentingan pelayanan desa. NusaDesa berkomitmen menjaga kerahasiaan dan keamanan data pengguna sesuai peraturan yang berlaku. Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan.' },
    { title: '5. Konten dan Tindakan Terlarang', content: 'Pengguna dilarang mengunggah konten yang melanggar hukum, bersifat SARA, pornografi, atau merugikan pihak lain. Desa yang melanggar ketentuan ini dapat dinonaktifkan oleh Super Admin tanpa pemberitahuan sebelumnya.' },
    { title: '6. Ketersediaan Layanan', content: 'NusaDesa berusaha menyediakan layanan 24/7, namun tidak menjamin ketersediaan tanpa gangguan. Maintenance dan update berkala dapat menyebabkan downtime sementara. Pengguna akan diberitahu melalui platform jika terdapat maintenance terjadwal.' },
    { title: '7. Pembatasan Tanggung Jawab', content: 'NusaDesa tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan platform di luar ketentuan ini. Keputusan administratif desa merupakan tanggung jawab Admin Desa masing-masing.' },
    { title: '8. Perubahan Ketentuan', content: 'NusaDesa berhak mengubah Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui platform. Pengguna yang tetap menggunakan platform setelah perubahan dianggap menyetujui ketentuan baru.' },
  ]

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Legal</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Syarat & Ketentuan
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Harap baca dengan seksama sebelum menggunakan platform NusaDesa
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sections.map((s, i) => (
              <div key={i} className="card-flat" style={{ padding: '1.5rem 2rem' }}>
                <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                  {s.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.8 }}>
                  {s.content}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Dengan mendaftar di NusaDesa, Anda dianggap telah membaca dan menyetujui seluruh Syarat & Ketentuan di atas.
            </p>
            <Link to="/daftar-desa" className="btn btn-primary btn-lg">
              Setuju & Daftarkan Desa
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

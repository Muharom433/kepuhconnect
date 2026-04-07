# KepuhConnect - Website Desa Kepuh

Modern village website for Desa Kepuh with role-based access, digital services, and UMKM marketplace.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the SQL schema in your Supabase dashboard:
   - Go to SQL Editor in Supabase
   - Run `supabase-schema.sql`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Features

- **Public Pages**: Home, Profil Desa, Berita, Ekonomi (UMKM + Kost), Kontak
- **User Services**: Formulir Surat, Status Permohonan, Info Persyaratan
- **Admin Dashboard**: Analytics, Data Management, Persuratan, UMKM, Users
- **3 Roles**: Pengunjung, Pengguna (verified), Admin
- **Supabase**: Database, Auth, RLS policies
- **Netlify**: Ready for deployment

## Tech Stack

- Vite + React
- React Router v6
- Supabase (Auth + Database)
- Lucide React (Icons)
- Vanilla CSS with Design System

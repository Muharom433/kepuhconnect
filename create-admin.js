/**
 * KepuhConnect - Script Buat Admin Pertama
 * Jalankan: node create-admin.js
 * 
 * Butuh SERVICE_ROLE key dari Supabase Dashboard:
 * Project Settings > API > service_role (secret)
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(resolve => rl.question(q, resolve))

async function main() {
  console.log('\n================================================')
  console.log('  KepuhConnect - Setup Admin Pertama')
  console.log('================================================\n')

  console.log('📌 Dapatkan SERVICE_ROLE key dari:')
  console.log('   Supabase Dashboard → Project Settings → API → service_role\n')

  const supabaseUrl = 'https://lopdwftuzlmilhbgiidb.supabase.co'
  const serviceRoleKey = await ask('🔑 Masukkan SERVICE_ROLE key: ')

  if (!serviceRoleKey.trim()) {
    console.error('❌ SERVICE_ROLE key tidak boleh kosong!')
    process.exit(1)
  }

  console.log()
  const email = await ask('📧 Email admin       : ')
  const password = await ask('🔒 Password admin    : ')
  const firstName = await ask('👤 Nama depan        : ')
  const lastName = await ask('👤 Nama belakang     : ')
  const whatsapp = await ask('📱 Nomor WhatsApp    : ')
  rl.close()

  // Validasi sederhana
  if (!email || !password || !firstName || !lastName) {
    console.error('\n❌ Semua field wajib diisi!')
    process.exit(1)
  }
  if (password.length < 6) {
    console.error('\n❌ Password minimal 6 karakter!')
    process.exit(1)
  }

  console.log('\n⏳ Membuat akun admin...')

  // Gunakan service_role key untuk bypass RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey.trim(), {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  try {
    // 1. Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password.trim(),
      email_confirm: true, // langsung terverifikasi email-nya
    })

    if (authError) {
      console.error('\n❌ Gagal membuat auth user:', authError.message)
      process.exit(1)
    }

    const userId = authData.user.id
    console.log('✅ Auth user berhasil dibuat:', userId)

    // 2. Insert ke tabel profiles dengan role admin
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      country_code: '+62',
      address: 'Padukuhan Kepuh',
      role: 'admin',
      is_verified: true,
    })

    if (profileError) {
      console.error('\n❌ Gagal membuat profil admin:', profileError.message)
      // Rollback: hapus auth user yang baru dibuat
      await supabase.auth.admin.deleteUser(userId)
      console.log('↩️  Auth user di-rollback.')
      process.exit(1)
    }

    console.log('\n================================================')
    console.log('  ✅ AKUN ADMIN BERHASIL DIBUAT!')
    console.log('================================================')
    console.log(`  Nama   : ${firstName.trim()} ${lastName.trim()}`)
    console.log(`  Email  : ${email.trim()}`)
    console.log(`  Role   : admin`)
    console.log(`  Status : Terverifikasi`)
    console.log('================================================')
    console.log('\n🚀 Silakan login di: http://localhost:5173/login\n')

  } catch (err) {
    console.error('\n❌ Error tidak terduga:', err.message)
    process.exit(1)
  }
}

main()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function setup() {
  const { data, error } = await supabase.storage.createBucket('media', {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: 10485760
  })
  
  if (error && error.message !== 'The resource already exists') {
    console.error('Error creating bucket:', error)
  } else {
    console.log('Bucket "media" ready!')
  }
}

setup()

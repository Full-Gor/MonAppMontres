import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://qnqhlvznqaffiglhfmhm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucWhsdnpucWFmZmlnbGhmbWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzI0MjgsImV4cCI6MjA2NzU0ODQyOH0.p6HY4DFfurV0DM3qoi2aysxwF6U8PP3sPHQHtCLswmY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
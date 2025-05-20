import { createClient } from '@supabase/supabase-js'

// You can directly set thhttps://aocqkuhaighvvsuwpvsw.supabase.coese values here
const supabaseUrl = 'https://aocqkuhaighvvsuwpvsw.supabase.co' // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvY3FrdWhhaWdodnZzdXdwdnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTg0MzAsImV4cCI6MjA2MzI3NDQzMH0.jWvVDpP-shznyfdvFUtuJwRiXT2d7xD-OiPjw8ZOPnQ' // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Profile = {
  id: string
  created_at: string
  email: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string | null
  is_pro: boolean | null
} 
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export interface UserDiagram {
  id: string
  user_id: string
  title: string
  source_code: string
  diagram_data: any
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_diagrams: {
        Row: UserDiagram
        Insert: Omit<UserDiagram, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<UserDiagram>
      }
    }
  }
}
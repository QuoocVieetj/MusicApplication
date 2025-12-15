// Supabase Client Configuration for Backend
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_CONFIG = require('./supabaseConfig');

// Khởi tạo Supabase client với Service Role Key (có quyền cao, chỉ dùng ở backend)
const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = supabase;
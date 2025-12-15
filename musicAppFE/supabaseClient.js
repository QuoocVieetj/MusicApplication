// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config/supabaseConfig';

// Khởi tạo Supabase client với config từ supabaseConfig.js
const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export default supabase;
export { supabase };
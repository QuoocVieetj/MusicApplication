import { createClient } from "@supabase/supabase-js";
import SUPABASE_CONFIG from "./supabaseConfig.js";

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

export default supabase;

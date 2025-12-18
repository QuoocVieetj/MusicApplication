require("dotenv").config(); // ⬅️ BẮT BUỘC

const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is missing in .env");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in .env");
}

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

module.exports = supabaseAdmin;

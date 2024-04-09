/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    NEXT_PUBLIC_SUPABASE_URL:process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY:process.env.OPENAI_API_KEY
    },
};

export default nextConfig;

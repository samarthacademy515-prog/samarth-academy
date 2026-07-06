import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fvjklkfdvvkuffrwjskb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_3216hSAI8cKIih00iv1c6g_R8aNO4wz";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

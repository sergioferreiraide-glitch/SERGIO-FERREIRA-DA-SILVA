import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  const val = (import.meta as any).env[key];
  return (val && val !== 'undefined' && val !== 'null') ? val : null;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || localStorage.getItem('magic_supabase_url');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || localStorage.getItem('magic_supabase_anon');

// Inicialização segura para evitar crash se as chaves estiverem vazias
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

if (!supabase) {
  console.warn('Supabase: Credenciais ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no menu Settings.');
}

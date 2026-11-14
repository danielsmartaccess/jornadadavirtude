/* Configuração do Supabase (conta opcional e sincronização).
 * A chave "publishable" é pública por definição: ela identifica o projeto, e o acesso
 * aos dados é protegido por Row Level Security no banco. Nunca coloque aqui a chave
 * "secret"/"service_role". Para apontar para outro projeto, defina VITE_SUPABASE_URL e
 * VITE_SUPABASE_KEY (ver .env.example). */
const env = import.meta.env;

export const SUPABASE_URL: string = env.VITE_SUPABASE_URL || 'https://nfjanvrgroozomymlndt.supabase.co';
export const SUPABASE_KEY: string = env.VITE_SUPABASE_KEY || 'sb_publishable_-uN2RJucy38UPs3zLI3I9Q_b8x3AmZ1';

export const cloudConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

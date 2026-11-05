import { createClient } from '@supabase/supabase-js';

const STORAGE_CONFIG_KEY = 'neuroquiz_supabase_config_v1';

export function getStoredSupabaseConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.url && parsed?.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore storage read error
  }
  return null;
}

export function saveSupabaseConfig(url, anonKey) {
  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();
  if (!cleanUrl || !cleanKey) {
    localStorage.removeItem(STORAGE_CONFIG_KEY);
    return null;
  }
  const config = { url: cleanUrl, anonKey: cleanKey };
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  return config;
}

const storedConfig = typeof window !== 'undefined' ? getStoredSupabaseConfig() : null;

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const activeUrl = storedConfig?.url || envUrl;
const activeKey = storedConfig?.anonKey || envKey;

export const isLiveSupabaseConfigured = Boolean(
  activeUrl &&
    activeKey &&
    activeUrl.startsWith('http') &&
    !activeUrl.includes('your-project-id.supabase.co') &&
    activeKey !== 'your-supabase-anon-key'
);

export const supabase = isLiveSupabaseConfigured
  ? createClient(activeUrl, activeKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getActiveSupabaseInfo() {
  return {
    isConfigured: isLiveSupabaseConfigured,
    url: activeUrl || '',
    hasAnonKey: Boolean(activeKey && activeKey !== 'your-supabase-anon-key'),
  };
}


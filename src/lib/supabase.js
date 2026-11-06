import { createClient } from '@supabase/supabase-js';

// Universal Storage Polyfill for React Native (Expo Go) & Web
const memoryStore = {};
const memoryStorage = {
  getItem: (key) => (Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null),
  setItem: (key, value) => {
    memoryStore[key] = String(value);
  },
  removeItem: (key) => {
    delete memoryStore[key];
  },
};

if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = memoryStorage;
  }
  if (typeof globalThis.sessionStorage === 'undefined') {
    globalThis.sessionStorage = memoryStorage;
  }
  if (typeof globalThis.btoa === 'undefined') {
    globalThis.btoa = (str) => {
      try {
        return encodeURIComponent(str);
      } catch (e) {
        return String(str);
      }
    };
  }
}

const STORAGE_CONFIG_KEY = 'neuroquiz_supabase_config_v1';

const DEFAULT_SUPABASE_URL = 'https://tconnnzwlytfplopymaf.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_OyOrV1WnvNslAg_dbUFqmA_qrOS5DZW';

export function getStoredSupabaseConfig() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.url && parsed?.anonKey) {
          return parsed;
        }
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
  try {
    if (!cleanUrl || !cleanKey) {
      localStorage.removeItem(STORAGE_CONFIG_KEY);
      return null;
    }
    const config = { url: cleanUrl, anonKey: cleanKey };
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    return config;
  } catch (e) {
    return null;
  }
}

const storedConfig = getStoredSupabaseConfig();

const activeUrl = storedConfig?.url || DEFAULT_SUPABASE_URL;
const activeKey = storedConfig?.anonKey || DEFAULT_SUPABASE_KEY;

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
        detectSessionInUrl: false,
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

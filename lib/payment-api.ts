const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const hasSupabasePaymentApi = Boolean(supabaseUrl && supabaseKey);

function functionUrl(name: 'checkout' | 'session') {
  if (!supabaseUrl) throw new Error('Supabase is not configured.');
  return `${supabaseUrl}/functions/v1/${name}`;
}

function headers() {
  if (!supabaseKey) throw new Error('Supabase is not configured.');
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };
}

export function checkoutApiUrl() {
  return hasSupabasePaymentApi ? functionUrl('checkout') : '/api/checkout';
}

export function sessionApiUrl(id: string) {
  const base = hasSupabasePaymentApi ? functionUrl('session') : '/api/session';
  return `${base}?id=${encodeURIComponent(id)}`;
}

export function paymentApiHeaders(): Record<string, string> | undefined {
  return hasSupabasePaymentApi ? headers() : undefined;
}

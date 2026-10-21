const fallbackCorsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
};

export function allowedOrigins() {
  const configured =
    Deno.env.get('ALLOWED_ORIGINS') ||
    Deno.env.get('SITE_URL') ||
    'https://iamzhangjinpeng.github.io/form-and-field-storefront';
  return configured
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      try {
        return new URL(entry).origin;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
}

export function corsHeaders(origin: string | null) {
  const allowed = allowedOrigins();
  const originIsAllowed = Boolean(origin && allowed.includes(origin));
  return {
    ...fallbackCorsHeaders,
    'Access-Control-Allow-Origin': originIsAllowed ? origin! : allowed[0] || 'null',
  };
}

export function json(
  request: Request,
  payload: unknown,
  status = 200,
  extraHeaders: HeadersInit = {},
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request.headers.get('origin')),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return Boolean(origin && allowedOrigins().includes(origin));
}

export function handleOptions(request: Request) {
  return new Response('ok', { headers: corsHeaders(request.headers.get('origin')) });
}

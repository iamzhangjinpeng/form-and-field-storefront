import { validateLines } from './order';
export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'FI', name: 'Finland' },
  { code: 'DK', name: 'Denmark' },
];
export function validateCheckout(body: unknown) {
  if (!body || typeof body !== 'object') throw new Error('Please check your checkout details.');
  const data = body as Record<string, unknown>;
  const clean = (name: string, max = 150) => {
    const value = data[name];
    if (typeof value !== 'string' || !value.trim() || value.length > max)
      throw new Error(`Please enter a valid ${name}.`);
    return value.trim();
  };
  const email = clean('email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error('Please enter a valid email address.');
  const country = clean('country', 2);
  if (!countries.some((c) => c.code === country))
    throw new Error('Please choose a supported country.');
  return {
    lines: validateLines(data.lines),
    email,
    firstName: clean('firstName', 80),
    lastName: clean('lastName', 80),
    address: clean('address'),
    apartment: typeof data.apartment === 'string' ? data.apartment.trim().slice(0, 100) : '',
    city: clean('city', 100),
    region: clean('region', 100),
    postal: clean('postal', 20),
    country,
  };
}

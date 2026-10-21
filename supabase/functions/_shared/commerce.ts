export type CartLine = {
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

export const catalog = [
  {
    id: 'arc-lounge-chair',
    name: 'The Arc Lounge Chair',
    price: 28900,
    sku: 'FF-ARC-001',
    colors: ['Natural oak', 'Smoked oak'],
    sizes: ['Standard'],
  },
  {
    id: 'forma-vase',
    name: 'Forma Ceramic Vase',
    price: 4800,
    sku: 'FF-FOR-002',
    colors: ['Chalk', 'Terracotta'],
    sizes: ['Small', 'Large'],
  },
  {
    id: 'everyday-linen',
    name: 'Everyday Linen Throw',
    price: 8900,
    sku: 'FF-LIN-003',
    colors: ['Oat', 'Olive', 'Clay'],
    sizes: ['130 × 170 cm', '150 × 200 cm'],
  },
  {
    id: 'milo-table-lamp',
    name: 'Milo Table Lamp',
    price: 12500,
    sku: 'FF-MIL-004',
    colors: ['Sand', 'Walnut'],
    sizes: ['Standard'],
  },
  {
    id: 'oak-side-table',
    name: 'Oak Side Table',
    price: 15900,
    sku: 'FF-OAK-005',
    colors: ['Natural oak', 'Smoked oak'],
    sizes: ['Ø 40 cm', 'Ø 50 cm'],
  },
  {
    id: 'ritual-cup',
    name: 'Ritual Stoneware Cup',
    price: 2400,
    sku: 'FF-RIT-006',
    colors: ['Chalk', 'Clay'],
    sizes: ['250 ml', '350 ml'],
  },
  {
    id: 'woven-cushion',
    name: 'Woven Linen Cushion',
    price: 5400,
    sku: 'FF-WOV-007',
    colors: ['Oat', 'Olive', 'Clay'],
    sizes: ['45 × 45 cm', '50 × 50 cm'],
  },
  {
    id: 'paper-pendant',
    name: 'Paper Moon Pendant',
    price: 9800,
    sku: 'FF-PAP-008',
    colors: ['Ivory'],
    sizes: ['Ø 40 cm', 'Ø 60 cm'],
  },
] as const;

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
] as const;

export function validateLines(input: unknown): CartLine[] {
  if (!Array.isArray(input) || input.length === 0 || input.length > 30)
    throw new Error('Please add 1–30 items to your bag.');
  const seen = new Set<string>();
  return input.map((raw) => {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid bag item.');
    const line = raw as Record<string, unknown>;
    const product = catalog.find((candidate) => candidate.id === line.productId);
    if (
      !product ||
      !product.colors.includes(line.color as never) ||
      !product.sizes.includes(line.size as never) ||
      !Number.isInteger(line.quantity) ||
      (line.quantity as number) < 1 ||
      (line.quantity as number) > 10
    )
      throw new Error('An item in your bag is invalid. Please review your bag.');
    const clean: CartLine = {
      productId: product.id,
      color: line.color as string,
      size: line.size as string,
      quantity: line.quantity as number,
    };
    const key = `${clean.productId}|${clean.color}|${clean.size}`;
    if (seen.has(key)) throw new Error('Duplicate bag item.');
    seen.add(key);
    return clean;
  });
}

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
  if (!countries.some((candidate) => candidate.code === country))
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

export function subtotalFor(lines: CartLine[]) {
  return lines.reduce(
    (sum, line) => sum + catalog.find((p) => p.id === line.productId)!.price * line.quantity,
    0,
  );
}

export function shippingCost(subtotal: number) {
  return subtotal >= 15000 ? 0 : 1200;
}

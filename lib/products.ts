export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  alternate: string;
  description: string;
  colors: string[];
  sizes: string[];
  sku: string;
  tag?: string;
  material: string;
};
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
export const money = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(cents / 100);
export const products: Product[] = [
  {
    id: 'arc-lounge-chair',
    name: 'The Arc Lounge Chair',
    category: 'Furniture',
    price: 28900,
    image: 'chair-studio',
    alternate: 'interior',
    description:
      'A softer place to land. Sculptural curves and a generous seat bring a little quiet to your favorite corner.',
    colors: ['Natural oak', 'Smoked oak'],
    sizes: ['Standard'],
    sku: 'FF-ARC-001',
    tag: 'Bestseller',
    material: 'Solid oak frame · woven natural cord seat',
  },
  {
    id: 'forma-vase',
    name: 'Forma Ceramic Vase',
    category: 'Objects',
    price: 4800,
    image: 'vase-studio',
    alternate: 'interior',
    description:
      'A considered curve, a chalky glaze. Beautiful with a single stem, just as lovely left empty.',
    colors: ['Chalk', 'Terracotta'],
    sizes: ['Small', 'Large'],
    sku: 'FF-FOR-002',
    tag: 'Small everyday joys',
    material: 'Glazed stoneware · hand-finished texture',
  },
  {
    id: 'everyday-linen',
    name: 'Everyday Linen Throw',
    category: 'Textiles',
    price: 8900,
    image: 'linen-studio',
    alternate: 'interior',
    description:
      'Soft from the first day. A relaxed, breathable layer for slow mornings and evenings on the sofa.',
    colors: ['Oat', 'Olive', 'Clay'],
    sizes: ['130 × 170 cm', '150 × 200 cm'],
    sku: 'FF-LIN-003',
    material: '100% washed flax linen',
  },
  {
    id: 'milo-table-lamp',
    name: 'Milo Table Lamp',
    category: 'Lighting',
    price: 12500,
    image: 'lamp-studio',
    alternate: 'interior',
    description:
      'Warm light, gentle lines. A little pool of calm for your bedside, reading nook or working day.',
    colors: ['Sand', 'Walnut'],
    sizes: ['Standard'],
    sku: 'FF-MIL-004',
    tag: 'New arrival',
    material: 'Ceramic base · woven linen shade · E27 socket',
  },
  {
    id: 'oak-side-table',
    name: 'Oak Side Table',
    category: 'Furniture',
    price: 15900,
    image: 'table-studio',
    alternate: 'interior',
    description:
      'A companion for your daily rituals. Warm grain and simple proportions, with room for the things you reach for.',
    colors: ['Natural oak', 'Smoked oak'],
    sizes: ['Ø 40 cm', 'Ø 50 cm'],
    sku: 'FF-OAK-005',
    material: 'Solid oak · natural oil finish',
  },
  {
    id: 'ritual-cup',
    name: 'Ritual Stoneware Cup',
    category: 'Objects',
    price: 2400,
    image: 'cup',
    alternate: 'cup-detail',
    description:
      'Make the first sip count. A tactile, gently rounded cup that fits comfortably in your hands.',
    colors: ['Chalk', 'Clay'],
    sizes: ['250 ml', '350 ml'],
    sku: 'FF-RIT-006',
    material: 'Glazed stoneware · dishwasher safe',
  },
  {
    id: 'woven-cushion',
    name: 'Woven Linen Cushion',
    category: 'Textiles',
    price: 5400,
    image: 'cushion-studio',
    alternate: 'linen-studio',
    description: 'An easy layer of texture. A soft neutral that feels at home wherever you put it.',
    colors: ['Oat', 'Olive', 'Clay'],
    sizes: ['45 × 45 cm', '50 × 50 cm'],
    sku: 'FF-WOV-007',
    material: 'Linen blend cover · feather-free insert',
  },
  {
    id: 'paper-pendant',
    name: 'Paper Moon Pendant',
    category: 'Lighting',
    price: 9800,
    image: 'pendant-studio',
    alternate: 'interior',
    description:
      'A light touch. Delicate paper diffuses a warm, even glow above the moments that make a home.',
    colors: ['Ivory'],
    sizes: ['Ø 40 cm', 'Ø 60 cm'],
    sku: 'FF-PAP-008',
    material: 'Rice paper shade · steel wire frame · E27 socket',
  },
];
export const categories = ['All objects', 'Furniture', 'Objects', 'Textiles', 'Lighting'];
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const shippingCost = (subtotal: number) => (subtotal >= 15000 ? 0 : 1200);

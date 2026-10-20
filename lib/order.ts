import { getProduct } from './products';
export type CartLine = { productId: string; color: string; size: string; quantity: number };
export const lineKey = (line: CartLine) => `${line.productId}|${line.color}|${line.size}`;
export function validateLines(input: unknown): CartLine[] {
  if (!Array.isArray(input) || input.length === 0 || input.length > 30)
    throw new Error('Please add 1–30 items to your bag.');
  const seen = new Set<string>();
  return input.map((line: CartLine) => {
    if (!line || typeof line !== 'object') throw new Error('Invalid bag item.');
    const product = getProduct(line.productId);
    if (
      !product ||
      !product.colors.includes(line.color) ||
      !product.sizes.includes(line.size) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 10
    )
      throw new Error('An item in your bag is invalid. Please review your bag.');
    if (seen.has(lineKey(line))) throw new Error('Duplicate bag item.');
    seen.add(lineKey(line));
    return { productId: product.id, color: line.color, size: line.size, quantity: line.quantity };
  });
}
export function subtotalFor(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + getProduct(line.productId)!.price * line.quantity, 0);
}

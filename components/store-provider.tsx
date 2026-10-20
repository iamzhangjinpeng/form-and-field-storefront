'use client';
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { CartLine, lineKey, validateLines, subtotalFor } from '@/lib/order';

type Store = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (line: CartLine) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  notice: string;
  announce: (text: string) => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem('ff-bag-v1') || '[]');
      if (Array.isArray(value) && value.length) setLines(validateLines(value));
    } catch {
      /* A corrupt or unavailable store starts with an empty bag. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem('ff-bag-v1', JSON.stringify(lines));
      } catch {
        /* The bag still works for this browser session. */
      }
    }
  }, [lines, ready]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  const add = useCallback((line: CartLine) => {
    validateLines([line]);
    setLines((old) => {
      const existing = old.find((item) => lineKey(item) === lineKey(line));
      if (existing)
        return old.map((item) =>
          lineKey(item) === lineKey(line)
            ? { ...item, quantity: Math.min(10, item.quantity + line.quantity) }
            : item,
        );
      if (old.length >= 30) return old;
      return [...old, line];
    });
    setNotice('A little something lovely, added to your bag.');
  }, []);
  const clear = useCallback(() => setLines([]), []);
  return (
    <Context.Provider
      value={{
        lines,
        ready,
        count: lines.reduce((sum, line) => sum + line.quantity, 0),
        subtotal: subtotalFor(lines),
        add,
        update: (key, quantity) =>
          setLines((old) =>
            old.map((line) =>
              lineKey(line) === key
                ? { ...line, quantity: Math.max(1, Math.min(10, quantity)) }
                : line,
            ),
          ),
        remove: (key) => setLines((old) => old.filter((line) => lineKey(line) !== key)),
        clear,
        notice,
        announce: setNotice,
      }}
    >
      {children}
      <div className={`toast ${notice ? 'visible' : ''}`} role="status">
        {notice}
      </div>
    </Context.Provider>
  );
}
export function useStore() {
  const context = useContext(Context);
  if (!context) throw new Error('StoreProvider is required.');
  return context;
}

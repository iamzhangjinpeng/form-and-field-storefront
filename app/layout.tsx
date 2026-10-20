import type { Metadata } from 'next';
import { StoreProvider } from '@/components/store-provider';
import { Navbar, Footer } from '@/components/shell';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'FORM & FIELD — Objects for a slower life', template: '%s | FORM & FIELD' },
  description:
    'A considered collection of furniture, lighting and everyday objects. Explore an interactive ecommerce concept with a complete guest checkout.',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg` },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

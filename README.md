# FORM & FIELD

### A considered collection. A complete shopping experience.

A warm, editorial ecommerce storefront for a fictional homewares brand. Built to demonstrate the full customer journey: discover a product, choose a finish and size, manage a persistent shopping bag, and complete guest checkout.

**Next.js App Router · TypeScript · React · Tailwind CSS · Stripe Checkout**

![Animated preview of the FORM & FIELD home page, collection, and product detail](docs/images/storefront-preview.gif)

_Storefront preview: browse the collection and explore product options. The public demo continues to Stripe Checkout in test mode; use the test card below to try it. No real payment is taken._

## Try the experience

Browse eight objects across furniture, ceramics, textiles, and lighting. Search or filter the collection, choose product variants, add an item to your bag, and complete guest checkout. No account is needed. The live demo uses Stripe test mode, so use the test card below; no real payment is taken.

- **Public demo target:** [FORM & FIELD on GitHub Pages](https://iamzhangjinpeng.github.io/form-and-field-storefront/) — the included workflow can publish either the no-card demo or Stripe test checkout backed by Supabase Edge Functions.

> This is a portfolio concept. Products, prices, policies, and brand details are illustrative. No real money is charged, no emails are sent, and no products are shipped.

## What works

- A responsive, English-language storefront with a coherent visual identity and locally bundled photography.
- Eight product pages with descriptions, finish and size selection, quantities, material details, and related products.
- Category filtering, text search, price sorting, and helpful empty states.
- A versioned `localStorage` shopping bag that survives refreshes, merges identical variants, and supports quantity changes and removal.
- Guest checkout with contact and shipping validation, server-owned catalog prices, and consistent shipping calculations.
- **Stripe test mode:** a server-created Checkout Session, hosted payment page, cancel/retry flow, and server-verified payment confirmation.
- **No-key demo mode:** a clearly identified, card-free simulated order that works on a static host and a fresh local checkout.
- Loading states, accessible form labels, keyboard navigation, focus states, reduced-motion support, and mobile navigation.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3006](http://localhost:3006). Leaving `STRIPE_SECRET_KEY` blank selects demo checkout.

For a production build:

```sh
npm run build
npm start
```

## Enable Stripe test payments

1. Create or select a Stripe sandbox and copy its **test secret key** into your local `.env.local` or Vercel environment variables.
2. Set `STRIPE_SECRET_KEY=sk_test_…` and `SITE_URL` to the application's origin, such as `http://localhost:3006` or your Vercel URL. Restart or redeploy after changing environment variables.
3. Add an item, complete the guest form, and continue to the Stripe-hosted page.
4. Use `4242 4242 4242 4242`, any future expiry, and any three-digit CVC. The success page retrieves and verifies the test session on the server.

Only test keys are accepted. The secret stays on the server and must never use a `NEXT_PUBLIC_` variable. Live keys are rejected. No payment-card details are collected by the storefront. Prices and allowed variants are validated against the catalog rather than trusted from the browser.

This demo deliberately has no inventory, fulfillment system, customer accounts, or order database. A production store would add durable orders, signed Stripe webhooks, idempotent fulfillment, tax handling, and abuse controls before accepting real payments. The success page is a customer-facing verification step, not a fulfillment system.

See [Stripe’s Checkout documentation](https://docs.stripe.com/payments/checkout/quickstarts) for the hosted-payment integration.

## Enable Stripe test payments on GitHub Pages

The public site is static, so it cannot run the Next.js API routes. The browser calls the Supabase Edge Functions in `supabase/functions/` instead. The functions validate cart variants and prices on the server, create a hosted Stripe Checkout Session, and retrieve the session before confirming success.

1. In Supabase, add `STRIPE_SECRET_KEY` as an Edge Function secret. Use a Stripe test/sandbox key only.
2. Add `SITE_URL=https://iamzhangjinpeng.github.io/form-and-field-storefront` as an Edge Function secret. The function uses this for Stripe return URLs and CORS origin validation.
3. In GitHub **Settings → Secrets and variables → Actions**, add repository variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Create a Supabase access token and add it as the GitHub Actions repository secret `SUPABASE_ACCESS_TOKEN`. On the next workflow run, it derives the project reference from `NEXT_PUBLIC_SUPABASE_URL`, deploys both Edge Functions, then builds Pages with the public Supabase configuration.
5. Use `4242 4242 4242 4242`, any future expiry, and any three-digit CVC to test. A blank Stripe secret or missing deployment credentials keeps the public Pages build in clearly labeled demo mode.

The Stripe secret remains in Supabase and never enters GitHub or the frontend. Supabase's publishable key is intended for browser use. Do not add Stripe live keys. Supabase Functions are configured as public endpoints, so they validate request origins, checkout fields, product variants and server-owned prices. Add durable orders, signed webhooks, idempotent fulfillment and rate limits before adapting this portfolio code for real sales.

## Deploy the static portfolio to GitHub Pages

Pushes to `main` run the checks, build the production app, export the static demo, and publish it to GitHub Pages. Ensure repository **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**.

You can also run the workflow manually from **Actions → Validate and deploy portfolio → Run workflow** and select **Publish to GitHub Pages**. Manual runs default to checks only.

```sh
npm run build:pages
```

The exporter removes server API routes from the static build and restores them afterward. If the Supabase browser variables are available at build time, the static checkout calls Supabase; otherwise it is explicitly simulated. The default path is `/form-and-field-storefront`. Override `NEXT_PUBLIC_BASE_PATH` when using another repository name or a custom domain. Do not run the normal and static builds concurrently.

## Verification

```sh
npm test                 # Pricing, variants, quantities, shipping, input validation
npm run typecheck
npm run build            # Production compilation and route generation
```

Browser checks require Playwright Chromium and a running demo-mode server:

```sh
npx playwright install chromium
npm run test:e2e
```

Set `TEST_URL` for another server, or `PLAYWRIGHT_EXECUTABLE_PATH` for an existing Chromium installation. The browser script exercises catalog filtering/search, product options, cart persistence, quantities, checkout, success handling, mobile navigation, and layouts at 390px and 320px. It saves screenshots in `docs/images/`.

The public demo currently has Stripe test payments enabled through Supabase Edge Functions. To test it, use the test card above; no payment credentials are included in this repository. The automated browser checks exercise the separate no-key demo mode.

## A closer look

| Collection                                     | Product detail                              |
| ---------------------------------------------- | ------------------------------------------- |
| ![Product catalog](docs/images/collection.png) | ![Product options](docs/images/product.png) |

| Local demo checkout                              | Local demo order confirmation                                  |
| ------------------------------------------------- | --------------------------------------------------------------- |
| ![Local no-key demo checkout](docs/images/checkout.png) | ![Local no-key demo confirmation](docs/images/success.png) |

These two screenshots show the no-key local fallback. On the public demo, checkout continues to Stripe's hosted test payment page instead.

<details>
<summary>Mobile storefront</summary>

<img src="docs/images/home-mobile.png" width="360" alt="FORM & FIELD mobile storefront" />

</details>

## Project structure

```text
app/                       App Router pages and server route handlers
  api/checkout/            Create Stripe test Checkout Sessions
  api/session/             Verify a completed test payment
  products/[id]/           Product detail and static route generation
  cart/ checkout/ success/ Customer purchase journey
components/                Shared shell, catalog, bag and checkout UI
lib/                       Typed catalog, validation, pricing, Stripe integration
public/images/             Local image assets; no runtime image-service dependency
scripts/                   Static export and browser verification
tests/                     Order validation and price integrity tests
docs/                      Screenshots, image provenance and handoff notes
```

Concept product photography combines AI-generated catalog images and Unsplash lifestyle photography. See [image provenance](docs/image-provenance.md) for sources and prompts.

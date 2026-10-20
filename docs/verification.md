# Verification

Verified on October 20, 2026.

- Next.js production build and TypeScript validation passed.
- Static export for the `/form-and-field-storefront` GitHub Pages path passed. Server API sources were restored after export.
- Seven automated checks passed: catalog integrity, server-owned pricing, shipping thresholds, variant and quantity validation, shipping/contact validation, cross-site request rejection, browser-facing host handling, and refusal of live Stripe keys.
- A real browser completed the customer journey against both the Next.js server and the static export: search/filter, choose finish and size, add to bag, refresh, change quantity, submit a guest demo order, view confirmation, and return to shopping.
- Checked desktop at 1440px and mobile layouts at 390px and 320px. Verified image loading, mobile navigation, policy dialogs, and no browser runtime errors.
- Recorded the README walkthrough in a real 1440px desktop browser, from home and product options through the bag, guest checkout, and demo confirmation. The optimized 960×600 animation is in `docs/images/storefront-walkthrough.gif`.
- Confirmed that visiting an old success page does not discard a newly started bag and that a direct success-page visit without an order does not display a false confirmation.

Screenshots are in `docs/images/`. Inputs in screenshots and browser scripts are fictional.

## Remaining integration acceptance check

No Stripe account or test secret was supplied. The Stripe server integration is implemented and compiles, but an actual hosted Stripe test payment has **not** been executed. Configure a Stripe test secret and `SITE_URL`, then complete a payment with the documented test card before claiming this integration is fully verified.

Publishing requires a repository and deployment access. A successful local build does not establish that a public URL is live.

# Verification

Verified on October 21, 2026.

- Next.js production build and TypeScript validation passed.
- Static export for the `/form-and-field-storefront` GitHub Pages path passed. Server API sources were restored after export.
- Seven automated checks passed: catalog integrity, server-owned pricing, shipping thresholds, variant and quantity validation, shipping/contact validation, cross-site request rejection, browser-facing host handling, and refusal of live Stripe keys.
- A real browser completed the customer journey against both the Next.js server and the static export: search/filter, choose finish and size, add to bag, refresh, change quantity, submit a guest demo order, view confirmation, and return to shopping.
- Checked desktop at 1440px and mobile layouts at 390px and 320px. Verified image loading, mobile navigation, policy dialogs, and no browser runtime errors.
- Recorded the README walkthrough in a real 1440px desktop browser, from home and product options through the bag, guest checkout, and demo confirmation. The optimized 960×600 animation is in `docs/images/storefront-walkthrough.gif`.
- Confirmed that visiting an old success page does not discard a newly started bag and that a direct success-page visit without an order does not display a false confirmation.
- GitHub Pages deployment passed in [GitHub Actions run 5](https://github.com/iamzhangjinpeng/form-and-field-storefront/actions/runs/39433376340). The public homepage and bundled hero image both returned HTTP 200.
- Supabase Edge Function handlers now mirror server-side product and checkout validation, create test Checkout Sessions, and verify paid sessions. Automated tests cover catalog parity, prices, shipping, and invalid checkout data.

Screenshots are in `docs/images/`. Inputs in screenshots and browser scripts are fictional.

## Remaining integration acceptance checks

An actual hosted Stripe test payment has **not** yet been executed. The Pages workflow deploys Supabase functions only when `SUPABASE_ACCESS_TOKEN` and the Supabase URL repository variable are configured; the website remains in demo mode until that deployment succeeds. Configure `STRIPE_SECRET_KEY` and `SITE_URL` in Supabase Function Secrets, then follow [the outstanding work list](TODO.zh-CN.md).

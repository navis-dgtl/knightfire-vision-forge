# Auto-Responder for Website Form Submissions

## Goal
Every person who submits a form on the site (Contact form, Brochure request, Distributor application) automatically receives a confirmation email:

> "Hello, Thank you for your inquiry! A member of our team will be in contact with you shortly regarding your request. Thank you for your interest in KnightTek, we look forward to working with you. Kind regards, The KnightTek Inquiry Team"

## Blocker: email sending domain not verified
The sender domain `notify.knightfiretek.com` failed DNS verification (timed out — records were never added/confirmed at the domain provider). Until this is fixed, no emails can send.

**User action needed:** add these records at the domain provider (wherever knightfiretek.com DNS is managed), then re-verify in Project Settings → Email:

| Type | Host | Value |
|------|------|-------|
| TXT | `_lovable-email.knightfiretek.com` | `lovable_email_verify=0ef539872c95d83e8c044a4e798fec0184308ce3e3b984f7db28e8bb502e5595` |
| NS | `notify.knightfiretek.com` | `ns3.lovable.cloud` |
| NS | `notify.knightfiretek.com` | `ns4.lovable.cloud` |

I can build everything now so it starts working the moment the domain verifies.

## What I'll build
1. **Confirmation email template** — a branded "Thank you for your inquiry" email (white background, KnightTek styling, the exact copy above, personalized with the submitter's first name).
2. **Send function** — the standard app-email sending function that queues and delivers the email with automatic retries.
3. **Wire into all three forms:**
   - Contact form (`src/pages/Contact.tsx` + inline contact form block)
   - Brochure request form (Contact page)
   - Distributor application (`src/pages/Distributors.tsx`)
   Each form, after a successful submission, triggers the confirmation email to the address the person entered. Uses an idempotency key so retries never double-send.
4. **Unsubscribe page** — required branded page the email footer links to.
5. Deploy the email functions and verify the flow end-to-end.

## Notes
- The email goes to the submitter (one person, triggered by their own action) — fully compliant transactional email.
- Team notification emails (to miranda@ktekglobal.com) stay as-is via Formspree for now; this adds the auto-reply to the submitter.
- If DNS can't be added at the current provider, alternatives: transfer the domain into Lovable, or move DNS hosting to a provider that supports NS records (e.g. Cloudflare free).

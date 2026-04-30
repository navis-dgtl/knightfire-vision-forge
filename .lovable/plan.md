## Investigation: Why contact form submissions may not be reaching the team

### Current setup
The Contact page (`src/pages/Contact.tsx`) and Distributors page (`src/pages/Distributors.tsx`) both submit directly to **Formspree** via standard HTML form POST:

- Contact form → `https://formspree.io/f/mzdagajq`
- Distributor form → `https://formspree.io/f/xzdagako`

There is no backend, no database record, and no delivery confirmation — submissions vanish into Formspree, and if Formspree doesn't email them out, they're effectively lost.

### Likely root causes (in order of probability)

1. **Formspree free-plan submission cap exceeded.** The free tier allows only ~50 submissions/month. Once hit, additional submissions are silently dropped or held until next cycle. This is the #1 cause of "missing" submissions in Formspree setups.
2. **Notification email going to spam / wrong inbox.** Formspree sends notifications from `noreply@formspree.io`. Without SPF/DKIM alignment to your domain, these often land in junk, especially in Microsoft 365 / Outlook.
3. **Notification address misconfigured in the Formspree dashboard.** If the recipient email on the Formspree form was changed, deactivated, or never confirmed, emails won't deliver. We can't see/verify this from the codebase.
4. **Formspree account issue** — unverified, suspended, or the form ID was archived.
5. **No fallback / no record kept on our side.** Even when Formspree fails, we have zero visibility because nothing is stored in our own database. There is also no error handling on the form — a failed POST shows the user no error.
6. **Minor bug:** the `products[]` checkbox inputs and the hidden `products` input both submit, which can cause duplicate/confusing fields in Formspree but does not cause loss.

### What I cannot verify without access
- Formspree dashboard: submission count, plan limits, recipient email, verification status, spam-filter logs.
- Whether the team's inbox is filtering `noreply@formspree.io`.

### Recommended action — what I'd do first (no code change required)
Before migrating, the team should:
- Log into the Formspree dashboard and check (a) submission counts vs. plan limit, (b) the configured notification email address, (c) whether the form is active.
- Search spam/junk folders for `formspree.io`.
- Add `noreply@formspree.io` to the safe-sender list.

If submissions ARE in Formspree but emails aren't arriving → it's a deliverability problem. If submissions are NOT in Formspree at all → the form POST itself is failing (rare).

---

## Alternative form-collection approaches

Listed from least to most effort. All are more reliable than the current setup because they store the submission in **our own database** so nothing is ever truly lost.

### Option A — Lovable Cloud database + email notification (recommended)
Store every submission in a `contact_submissions` table in Lovable Cloud, then send an email notification to the team using Lovable's built-in email system.

**Pros**
- Submissions are permanently stored — even if email fails, the data is safe and retrievable.
- Email comes from your own domain (`notify.knightfiretek.com` or similar) → far better deliverability than `noreply@formspree.io`.
- Built-in queue with automatic retries on rate-limits / transient failures.
- No third-party account, no monthly submission cap, no per-form fees.
- Same approach works for the Distributors form.
- Could later add a simple admin page to view all submissions in-app.

**Cons**
- Requires setting up an email sender domain (one-time DNS step at the registrar — takes a few minutes plus DNS propagation).

### Option B — Lovable Cloud database only (no email)
Store submissions in Lovable Cloud and review them via a protected admin page in the site. No email at all.

**Pros**
- Simplest reliable option; no DNS work.
- 100% capture — nothing depends on email delivery.

**Cons**
- The team has to actively check the admin page; no inbox push notification.

### Option C — Resend (third-party email API, via a Lovable connector)
Use the Resend connector to send notifications from your domain.

**Pros**
- Solid deliverability; nice analytics dashboard on Resend.
- Works well if the team prefers a dedicated email vendor.

**Cons**
- Requires a Resend account + DNS verification of the sending domain on Resend.
- Doesn't store submissions on our side unless we also add a database table (Option A is essentially this, but using Lovable's native infrastructure instead of a third party).

### Option D — Stay on Formspree but upgrade and harden
Upgrade the Formspree plan to lift the submission cap, fix the recipient email, and add domain authentication on Formspree.

**Pros**
- Zero code change.

**Cons**
- Still no record on our side if Formspree ever loses a submission, gets blocked by a spam filter, or has an outage.
- Ongoing monthly cost with no functional upside vs. Option A.

---

## My recommendation
**Option A — Lovable Cloud database + email notifications from your own domain.** It eliminates every failure mode of the current setup: submissions are stored permanently, the team gets a notification email from your own brand domain (much better inbox placement than Formspree's noreply address), and we get retry logic for free. We can apply the same pattern to the Distributors form and the brochure download form so the whole site is consistent.

## What I'd build (if you approve Option A)
1. Add a `contact_submissions` table in Lovable Cloud with fields matching the form (name, email, phone, company, products, details, submitted_at, source page).
2. Add a `distributor_applications` table similarly for the Distributors form.
3. Set up an email sender domain (one-time — I'll walk you through the DNS step).
4. Create two app email templates: "New contact form submission" and "New distributor application", sent to a team inbox you choose (e.g. `info@ktekglobal.com`).
5. Update both forms to: insert into the database → trigger the notification email → show a success toast (and a real error message if anything fails).
6. Remove the Formspree endpoints from the codebase.

### Open questions before we build
- Which email address(es) should receive the notifications?
- Should we also build a simple in-app admin page to browse past submissions, or is email enough?
- Same treatment for the Distributors form and the brochure-request flow on the Contact page? (Recommended: yes, for consistency.)

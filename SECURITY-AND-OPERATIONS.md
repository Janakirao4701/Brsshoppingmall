# Advanced Security & Operations Guide

## 1. Bot Protection & Anti-Scraping (Honeypot)

We implemented a **Honeypot Strategy** on the Bulk Inquiry form to prevent automated spam without annoying legitimate users with CAPTCHAs.

**How it works:**
1. A hidden field `website_url` is added to the form (`BulkOrderForm.tsx`) but moved off-screen (`opacity-0 absolute -z-50`).
2. Real users cannot see it and will leave it blank.
3. Automated spambots parse the HTML and fill all `<input>` fields they find.
4. If the `/api/bulk-inquiry` route detects that `website_url` has a value, it immediately returns a `200 OK` success response (to fool the bot into thinking it worked) but **does not save the data to the database**.

## 2. File Upload Security

A new SQL migration (`supabase/migrations/002_storage_security.sql`) was added to lock down the Supabase Storage buckets.

**Protections implemented:**
1. **Role-Based Access:** Only `authenticated` users (Admins) can `INSERT`, `UPDATE`, or `DELETE` images in the `products` and `banners` buckets.
2. **File Type Verification:** The policy enforces strict file extensions (`jpg`, `jpeg`, `png`, `webp`). This prevents attackers from uploading malicious executables or HTML files.
3. **Filename Length:** Capped at 100 characters to prevent buffer overflow or DoS attacks on the filesystem.

*Action Required:* Run `002_storage_security.sql` in your Supabase SQL Editor.

## 3. Monitoring & Alerting

We installed and configured **Vercel Analytics** and **Vercel Speed Insights** in the global layout.

- **Vercel Analytics (`@vercel/analytics`)**: Tracks real-time page views, unique visitors, and user demographics (countries/OS/browsers) with privacy-first compliance.
- **Vercel Speed Insights (`@vercel/speed-insights`)**: Captures real-world Core Web Vitals (LCP, INP, CLS) from actual users' devices, helping you maintain the >90 Lighthouse score requirement.

These metrics will automatically appear in your Vercel Dashboard under the "Analytics" and "Speed Insights" tabs once deployed.

### Sentry Integration (Optional)
If you require detailed stack traces for server-side exceptions (like Razorpay webhook failures), you can add Sentry later by running `npx @sentry/wizard@latest -i nextjs`.

## 4. Backup & Disaster Recovery Strategy

Since BSR Shopping Mall handles critical financial data (Orders & Inquiries), a disaster recovery plan is essential.

**Strategy:**
1. **Database:** Supabase automatically performs daily backups. For an e-commerce store, we recommend upgrading to the **Supabase Pro Plan**, which includes **Point-in-Time Recovery (PITR)**. This allows you to revert the database to any exact second in the last 7 days (e.g., if a rogue admin deletes products).
2. **Manual Snapshots:** Before major sales (like Diwali or Dussehra), take a manual pg_dump:
   ```bash
   pg_dump -h db.[PROJECT_REF].supabase.co -U postgres -F p -f bsr-backup.sql
   ```
3. **High Availability:** Vercel automatically deploys the frontend across global edge nodes, ensuring 99.99% uptime even during regional outages.

---

*These features complete the advanced hardening requirements requested.*

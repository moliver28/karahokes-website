# Deployment & DNS Runbook

Launch runbook for the practice site: the domain karahokes.com is registered at Namecheap, the site is published to GitHub Pages by the `.github/workflows/deploy.yml` workflow, and Cloudflare provides the appointment-form backend (Worker + D1 + Email Routing). The form backend has its own deploy runbook in [worker/README.md](worker/README.md); this file covers DNS records, the one-time Cloudflare setup, verification, and the certificate timeline.

## GitHub Pages DNS records (apply at Namecheap > Advanced DNS)

These five records point the domain at GitHub Pages. They serve both names at once: the `www` CNAME makes **https://www.karahokes.com** the live site, and the four apex A records make **karahokes.com** redirect to it.

| Type  | Host | Value                | TTL       |
|-------|------|----------------------|-----------|
| A     | @    | 185.199.108.153      | Automatic |
| A     | @    | 185.199.109.153      | Automatic |
| A     | @    | 185.199.110.153      | Automatic |
| A     | @    | 185.199.111.153      | Automatic |
| CNAME | www  | moliver28.github.io. | Automatic |

**CRITICAL — delete Namecheap's default parking records before adding these.** Namecheap ships every new domain with a **URL Redirect Record on `@`** (to a parking page) and a **CNAME on `www`** (to its parking host). DELETE BOTH first. Leftover records conflict with the Pages records: the apex keeps answering with the redirect and DNS resolution becomes unpredictable until they are gone.

## Cloudflare Email Routing records (apply at Namecheap, values from the Cloudflare dashboard)

After Email Routing is enabled (next section), the Cloudflare dashboard's Email Routing page lists the exact records the zone needs. Apply them at Namecheap > Advanced DNS, filling every placeholder from what the dashboard reports — do not guess or hand-write these values.

| Type | Host                   | Value                                             | Notes                        |
|------|------------------------|---------------------------------------------------|------------------------------|
| MX   | @                      | route1.mx.cloudflare.net                          | priority per CF dashboard (fill from CF dashboard) |
| MX   | @                      | route2.mx.cloudflare.net                          | priority per CF dashboard (fill from CF dashboard) |
| MX   | @                      | route3.mx.cloudflare.net                          | priority per CF dashboard (fill from CF dashboard) |
| TXT  | @                      | "v=spf1 include:_spf.mx.cloudflare.net ~all"      | SPF — confirm exact string in the dashboard (fill from CF dashboard) |
| TXT  | (DKIM name CF reports) | (DKIM value CF reports)                           | one or more DKIM records — copy name and value exactly (fill from CF dashboard) |

## One-time Cloudflare setup (human, dashboard)

These steps need a human in the Cloudflare dashboard; Wrangler and the deploy workflow cannot do them. In order:

1. Create a free Cloudflare account at dash.cloudflare.com (free plan, no card required).
2. Add karahokes.com to the account as a **PARTIAL (CNAME) setup** zone, keeping Namecheap's nameservers — the zone stays DNS-hosted at Namecheap.
3. Enable Email Routing on the zone.
4. Add the destination address karahokes@gmail.com, then **click the confirmation email** Gmail receives (check the spam folder). Mail does not route to the practice inbox until that click happens.
5. On this machine, run `npx wrangler login` once (browser authorization; needed for the form-backend deploys — see worker/README.md).
6. Apply the GitHub Pages DNS records and the Email Routing DNS records at Namecheap > Advanced DNS (tables above).

## Verification (agent-run)

Poll DNS with PowerShell's `Resolve-DnsName` every 15 minutes, bounded at 72 hours (registrar propagation and GitHub's DNS verification can take that long). Expected results:

| Check | Expected |
|-------|----------|
| `Resolve-DnsName karahokes.com -Type A` | exactly 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 — no other A records (a leftover parking record shows up here) |
| `Resolve-DnsName www.karahokes.com -Type CNAME` | `moliver28.github.io.` |
| `Resolve-DnsName karahokes.com -Type MX` | `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net` (priorities as reported by the CF dashboard) |
| `Resolve-DnsName karahokes.com -Type TXT` | the SPF string `v=spf1 include:_spf.mx.cloudflare.net ~all` plus the DKIM record(s) from the CF dashboard |

## Certificate timeline note

GitHub provisions the custom-domain certificate for www.karahokes.com only after DNS verification passes. Provisioning takes anywhere from minutes to 72 hours. The "Enforce HTTPS" setting (`https_enforced`) must be switched on ONLY after the certificate reaches the approved state in the Pages settings — flipping it earlier can block certificate provisioning and leave the domain stuck without HTTPS.

## Form backend (Cloudflare)

The appointment form's backend is a Cloudflare Worker with a D1 database and an Email Routing notification; its deploy runbook, bindings, and behavior are documented in [worker/README.md](worker/README.md). That file is the authority — this section is only a pointer plus the data notes.

D1 data notes: `consult_request` rows are retained as practice records; there is no automatic purge. The QA process submits exactly ONE test row through the live form and deletes that row after the live check (test-row cleanup), so afterward the table holds only real submissions. Capacity is a non-issue: the D1 free tier allows 5M row reads and 100k row writes per day, far above this practice's needs.

## If Email Routing is unavailable

If Cloudflare requires full nameserver setup for the zone (which makes Email Routing unavailable under the partial setup), the documented fallback is the Resend-based swap in the "Resend fallback (only if triggered)" section of [worker/README.md](worker/README.md). Whether to trigger that fallback is a go/no-go decision made during the DNS setup itself, not in this document.

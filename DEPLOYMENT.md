# Deployment & DNS Runbook

Launch runbook for the practice site: the domain karahokes.com is registered at Namecheap, the site is published to GitHub Pages by the `.github/workflows/deploy.yml` workflow, and Cloudflare provides the appointment-form backend (Worker + D1 + Email Routing). The form backend has its own deploy runbook in [worker/README.md](worker/README.md); this file covers DNS records, the one-time Cloudflare setup, verification, and the certificate timeline.

## DNS records (Cloudflare zone)

DNS for karahokes.com lives in the Cloudflare zone `karahokes.com` under a **full Cloudflare setup**: the zone's nameservers are `macy.ns.cloudflare.com` and `matteo.ns.cloudflare.com`. The domain remains registered at Namecheap, but records are not edited there.

The records that matter to the site: four apex A records pointing at GitHub Pages (185.199.108.153 through 185.199.111.153) and a `www` CNAME to `moliver28.github.io`. Together they make **https://www.karahokes.com** the live site, with **karahokes.com** redirecting to it. The Email Routing records (MX, SPF, DKIM) are managed by Cloudflare and locked — they exist because Email Routing is enabled on the zone and cannot be edited at a registrar.

## One-time Cloudflare setup (human, dashboard — completed)

These steps needed a human in the Cloudflare dashboard; Wrangler and the deploy workflow cannot do them. All are done:

1. Create a free Cloudflare account at dash.cloudflare.com (free plan, no card required).
2. Add karahokes.com to the account as a **full-setup zone** — Cloudflare nameservers (`macy.ns.cloudflare.com`, `matteo.ns.cloudflare.com`) became authoritative for the domain.
3. Enable Email Routing on the zone.
4. Add the destination address karahokes@gmail.com, then **click the confirmation email** Gmail receives (check the spam folder). Mail does not route to the practice inbox until that click happens.
5. On this machine, run `npx wrangler login` once (browser authorization; needed for the form-backend deploys — see worker/README.md).
6. The GitHub Pages DNS records live in the Cloudflare zone (see the DNS records section above).

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

As observed on this launch (2026-10-07): after DNS went green and the Pages config settled (`build_type=workflow`), the Let's Encrypt leaf certificate was issued at 02:14 UTC (SANs covering both karahokes.com and www.karahokes.com) and the Pages API first reported `https_certificate.state=approved` at 03:27 UTC — about an hour after the certificate itself was already valid, so the API state can lag the live certificate. HTTPS enforcement (`https_enforced=true`) was on at that same observation, and all four paths verified: http://karahokes.com, http://www.karahokes.com, and https://karahokes.com each 301 to https://www.karahokes.com/, which serves 200 over TLS from Let's Encrypt. The certificate renews automatically.

## Form backend (Cloudflare)

The appointment form's backend is a Cloudflare Worker with a D1 database and an Email Routing notification; its deploy runbook, bindings, and behavior are documented in [worker/README.md](worker/README.md). That file is the authority — this section is only a pointer plus the data notes.

D1 data notes: `consult_request` rows are retained as practice records; there is no automatic purge. The QA process submits exactly ONE test row through the live form and deletes that row after the live check (test-row cleanup), so afterward the table holds only real submissions. Capacity is a non-issue: the D1 free tier allows 5M row reads and 100k row writes per day, far above this practice's needs.

## If Email Routing is unavailable

If Email Routing ever becomes unavailable (for example, if the zone setup changes), the documented fallback is the Resend-based swap in the "Resend fallback (only if triggered)" section of [worker/README.md](worker/README.md). Whether to trigger that fallback is a go/no-go decision for whoever maintains the site, not something to decide in this document.

import { SITE } from "@/lib/site";

/**
 * Cloudflare Web Analytics beacon token. The token is the public "JS beacon"
 * token from the Cloudflare dashboard (Web Analytics -> karahokes.com), and
 * it is public by design — it appears in the HTML of every page load, so it
 * is safe to ship in a static bundle.
 */
export const CLOUDFLARE_BEACON_TOKEN: string =
  "be3535b176254d898532afbf4b233cc5";

/**
 * Hostnames the beacon is allowed to fire on. The canonical host is derived
 * from SITE.siteUrl ("www" is canonical per src/lib/site.ts, which also
 * notes the apex domain), and the apex is listed as well in case a visitor
 * lands there before the redirect. Everything else — localhost dev, e2e
 * runs, preview deploys — renders no beacon and stays out of the stats.
 */
export const PROD_HOSTNAMES: readonly string[] = [
  new URL(SITE.siteUrl).hostname,
  "karahokes.com",
];

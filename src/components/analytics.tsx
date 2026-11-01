"use client";

import * as React from "react";
import Script from "next/script";
import { CLOUDFLARE_BEACON_TOKEN, PROD_HOSTNAMES } from "@/lib/analytics";

/**
 * Cloudflare Web Analytics beacon, gated to the production hostnames so
 * localhost dev and Playwright e2e traffic never reach the dashboard. The
 * gate runs after mount — window.location is client-only, and deciding in
 * an effect keeps server and client HTML identical (no hydration
 * mismatch). While the token placeholder is empty the component renders
 * nothing on any host. Cloudflare Web Analytics is cookieless and
 * aggregate-only, so no consent banner is needed.
 */
export function Analytics() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    setEnabled(
      CLOUDFLARE_BEACON_TOKEN !== "" &&
        PROD_HOSTNAMES.includes(window.location.hostname),
    );
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Script
      id="cf-web-analytics"
      strategy="afterInteractive"
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CLOUDFLARE_BEACON_TOKEN })}
    />
  );
}

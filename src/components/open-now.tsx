"use client";

import * as React from "react";

/**
 * A live "right now" line under the practice hours, computed in Pacific
 * time from the hours this remote practice keeps: most weekdays 9am to 5pm.
 * (The profile says "available most weekdays"; these are the usual hours
 * for sessions, calls, and replies.) Renders nothing until mounted so
 * server and client never disagree about what time it is, and re-checks
 * every minute so the line stays honest while the tab sits open.
 */

type OpenState = {
  open: boolean;
  text: string;
};

function computeOpenState(now: Date): OpenState {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(now)) {
    parts[p.type] = p.value;
  }

  const weekday = parts.weekday;
  const minutes =
    (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10);

  const OPEN_AT = 9 * 60;
  const CLOSE_AT = 17 * 60;

  if (weekday === "Sat" || weekday === "Sun") {
    return {
      open: false,
      text: "Closed for the weekend. Messages sent now get answered Monday morning.",
    };
  }

  if (minutes >= OPEN_AT && minutes < CLOSE_AT) {
    return {
      open: true,
      text: "At my desk right now: video sessions and replies run most weekdays until 5pm Pacific.",
    };
  }

  if (minutes < OPEN_AT) {
    return {
      open: false,
      text: "Not at the desk yet. Usual hours: 9am to 5pm Pacific, most weekdays.",
    };
  }

  return {
    open: false,
    text: "Off the clock right now. Messages sent now get answered the next business morning.",
  };
}

export function OpenNow() {
  const [state, setState] = React.useState<OpenState | null>(null);

  React.useEffect(() => {
    const tick = () => setState(computeOpenState(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!state) return null;

  return (
    <li className="flex items-start gap-3 text-muted-foreground">
      <span
        className={[
          "flex size-9 items-center justify-center rounded-lg",
          state.open ? "bg-primary/10" : "bg-muted",
        ].join(" ")}
      >
        <span className="relative flex size-2.5" aria-hidden="true">
          {state.open ? (
            <>
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </>
          ) : (
            <span className="relative inline-flex size-2.5 rounded-full bg-muted-foreground/40" />
          )}
        </span>
      </span>
      <span>
        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Right now
        </span>
        {state.text}
      </span>
    </li>
  );
}

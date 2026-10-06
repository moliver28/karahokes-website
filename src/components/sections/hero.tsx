import Image from "next/image";
import { ArrowRight, LifeBuoy, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <HeroImage />

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* A face before any copy: for someone deciding whether to trust a
              stranger with hard things, the photo is the first answer. The
              name is adjacent text, so the image is decorative to readers. */}
          <Reveal>
            <div className="flex items-center gap-3.5">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-background shadow-md shadow-primary/15">
                <Image
                  src={SITE.avatar}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-semibold text-foreground">
                  {SITE.fullName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {SITE.role} · {SITE.pronouns}
                </span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-primary">
              <Video className="size-3.5" aria-hidden="true" />
              Online-only practice · {SITE.licenseShort}
            </span>
          </Reveal>

          <Reveal delay={0.16}>
            <h1
              id="hero-heading"
              className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl"
            >
              When each day feels like a roller coaster, therapy can help you
              get off the ride.
            </h1>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              I&apos;m Dr. Kara Hokes, a clinical psychologist in Tacoma,
              Washington, with almost ten years of experience helping people
              adapt to hard circumstances: trauma, emotion dysregulation,
              anxiety, anger, and perinatal mental health. I work with
              veterans, first responders, survivors of sexual and domestic
              violence, and people of all backgrounds and cultures, over
              secure video.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-6 shadow-md shadow-primary/20 motion-safe:transition-all motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-primary/25 motion-safe:active:translate-y-0"
              >
                <a href="#contact" className="group">
                  Book a Free 15-Minute Call
                  <ArrowRight
                    className="size-4 transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/30 bg-background/70 px-6 text-foreground hover:bg-secondary hover:text-foreground"
              >
                <a href="#communities">See who I work with</a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="size-4 shrink-0 text-primary/80" aria-hidden="true" />
              Secure video across Washington State and PSYPACT states · $150
              per session with a free 15-minute intro call · Most major
              insurance accepted
            </p>
          </Reveal>

          {/* The two things an anxious visitor scans for most (cost and what
              to do if tonight is the hard night) now sit above the fold. */}
          <Reveal delay={0.48}>
            <p className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <LifeBuoy
                className="mt-0.5 size-3.5 shrink-0 text-destructive/80"
                aria-hidden="true"
              />
              <span>
                In crisis right now? Call or text{" "}
                <a
                  href="tel:988"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  988
                </a>
                , veterans press 1. This site isn&apos;t watched around the
                clock.
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the hero landscape image full-bleed behind the section,
 * with graceful fallback to the soft gradient already layered below.
 */
function HeroImage() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      {/* Soft gradient backdrop acts as fallback if image fails to load */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.94_0.025_100)] via-background/60 to-[oklch(0.88_0.03_145)]" />
      {/* Background image via CSS, degrades gracefully to gradient if missing */}
      <div
        className="absolute inset-0 opacity-90 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-landscape.png')" }}
      />
      {/* Cream wash on the left so headline text stays readable; image shows through on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent md:via-background/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
}

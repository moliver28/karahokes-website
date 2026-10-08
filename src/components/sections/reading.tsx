import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

type Book = {
  title: string;
  author: string;
  note: string;
  cover: string;
};

const BOOKS: Book[] = [
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    note: "The classic on how trauma lives in the body. Dense in places, and worth the effort.",
    cover: "/book-body-keeps-score.png",
  },
  {
    title: "Transforming the Living Legacy of Trauma",
    author: "Janina Fisher",
    note: "A workbook, not a lecture. Gentle exercises for the days when therapy feels like too much.",
    cover: "/book-living-legacy.png",
  },
  {
    title: "What My Bones Know",
    author: "Stephanie Foo",
    note: "A memoir of complex PTSD. Clients tell me it's the first time they saw themselves on the page.",
    cover: "/book-what-my-bones-know.png",
  },
  {
    title: "It Didn't Start with You",
    author: "Mark Wolynn",
    note: "On how family pain echoes forward. I suggest it when the history predates you.",
    cover: "/book-didnt-start-with-you.png",
  },
];

const RESOURCES = [
  {
    name: "VA National Center for PTSD",
    url: "https://www.ptsd.va.gov",
    display: "ptsd.va.gov",
    note: "Treatment explanations, self-help tools, and a treatment decision aid. Built for veterans, useful to anyone with PTSD.",
  },
  {
    name: "National Institute of Mental Health",
    url: "https://www.nimh.nih.gov",
    display: "nimh.nih.gov",
    note: "Plain-language fact sheets on PTSD, anxiety, and depression, reviewed by researchers.",
  },
  {
    name: "RAINN: National Sexual Assault Hotline",
    url: "https://www.rainn.org",
    display: "rainn.org",
    note: "24/7 phone and chat support for survivors of sexual violence, plus practical guides on safety, reporting, and recovery.",
  },
  {
    name: "National Domestic Violence Hotline",
    url: "https://www.thehotline.org",
    display: "thehotline.org",
    note: "24/7 phone, chat, and text support for anyone affected by domestic violence, with quiet, judgment-free safety-planning tools.",
  },
  {
    name: "The Trevor Project",
    url: "https://www.thetrevorproject.org",
    display: "thetrevorproject.org",
    note: "Crisis support and community for LGBTQ+ young people, staffed around the clock by counselors who get it.",
  },
];

/** Bookshop.org search: supports independent bookstores, no affiliate tracking. */
function bookshopUrl(title: string, author: string): string {
  return `https://bookshop.org/search?keywords=${encodeURIComponent(
    `${title} ${author}`
  )}`;
}

export function Reading() {
  return (
    <section
      id="reading"
      aria-labelledby="reading-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Reading
            </span>
            <h2
              id="reading-heading"
              className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground text-balance sm:text-4xl"
            >
              Books I find myself recommending.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              No book replaces therapy, but the right one can help you feel
              understood between sessions. These are the four I reach for
              most, plus free resources I trust for veterans, survivors, and
              queer and trans folks.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.07}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BOOKS.map((b, index) => (
            <RevealItem key={b.title}>
              <Card className="group h-full rounded-2xl border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
                <CardContent className="flex h-full flex-col p-5">
                  <a
                    href={bookshopUrl(b.title, b.author)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${b.title} by ${b.author}, find it on Bookshop.org (opens in a new tab)`}
                    className="group/link relative block overflow-hidden rounded-xl border border-border/60 shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:group-hover/link:ring-1 motion-safe:group-hover/link:ring-primary/40"
                  >
                    <Image
                      src={b.cover}
                      alt=""
                      width={864}
                      height={1152}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="aspect-[3/4] w-full object-cover transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/15 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-serif text-base font-semibold leading-snug text-background text-balance">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-background/75">
                        {b.author}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <ExternalLink className="size-4" />
                    </span>
                    {index === 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-sm">
                        Start here
                      </span>
                    )}
                  </a>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {b.note}
                  </p>
                  <a
                    href={bookshopUrl(b.title, b.author)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Find it on Bookshop.org
                    <ExternalLink
                      className="size-3.5"
                      aria-hidden="true"
                    />
                  </a>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border/70 bg-secondary/40 p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Free, reliable online resources
            </h3>
            <ul className="mt-4 space-y-4">
              {RESOURCES.map((r) => (
                <li key={r.url} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {r.display}
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                    <span className="sr-only">{r.name}</span>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {r.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
              The book links open Bookshop.org, which supports independent
              bookstores. I don't receive anything for recommending any of
              this. They're on the list because they've helped people I've
              worked with.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

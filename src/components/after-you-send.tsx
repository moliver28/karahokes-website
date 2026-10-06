import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

const STEPS = [
  {
    title: "It comes straight to me.",
    body: "Your note lands in my practice inbox. I read every message myself; there is no assistant in between.",
  },
  {
    title: "I reply within two business days.",
    body: `The reply comes from ${SITE.email}. If nothing has arrived by then, check spam, then call the practice.`,
  },
  {
    title: "We talk for 15 minutes, free.",
    body: "You ask what you want; I explain how I work and what treatment could look like. If I'm not the right fit, I'll say so and suggest someone who is.",
  },
];

/**
 * A compact three-step answer to the question every first-time visitor has
 * after reaching the form: what actually happens once I press send. Written
 * to be honest about timing and about the possibility of a referral out.
 */
export function AfterYouSend() {
  return (
    <Reveal delay={0.06}>
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-center gap-3">
          {/* Her face on the promise: the reply is from a person, not a
              practice inbox. Name is adjacent text, so alt is empty. */}
          <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/20">
            <Image
              src={SITE.avatar}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground">
              After you send this
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The whole path, so nothing about it is a surprise.
            </p>
          </div>
        </div>

        <ol className="relative mt-6 space-y-5">
          {/* The connecting line runs behind the numbered circles. */}
          <span
            aria-hidden="true"
            className="absolute left-[15px] top-3 bottom-3 w-px bg-primary/15"
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4">
              <span
                aria-hidden="true"
                className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground ring-4 ring-card"
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

/**
 * Shared FAQ content. Kept outside the client component so both the
 * rendered FAQ section and the server-rendered JSON-LD (FAQPage schema)
 * read from exactly the same source of truth. Practice facts (insurance
 * list, fee, license, hours) come from the Psychology Today profile; the
 * plan list itself lives in @/lib/insurance so the Insurance section's
 * cards and this answer can never drift apart.
 */
import { INSURANCE_LIST_TEXT } from "@/lib/insurance";
import { SITE } from "@/lib/site";

export type QA = { q: string; a: string };

export const FAQ_ITEMS: QA[] = [
  {
    q: "Do you take insurance?",
    a: `Yes. I accept ${INSURANCE_LIST_TEXT}. I'm licensed in Washington State, so insurance covers clients who live here. Before we start, I'll help you confirm exactly what your plan covers so nothing about cost comes as a surprise.`,
  },
  {
    q: "Do you take TriCare or VA Community Care?",
    a: "I'm not in-network with TriCare, VA Community Care, or CHAMPVA, so if that's the coverage you hold, I won't be the right billing fit. A few honest paths: if you also carry a civilian plan from the list above, I can take that. Vet Centers provide free counseling to veterans and their families, no insurance involved, and ptsd.va.gov can help you find one. If you'd rather pay directly, I'm $150 a session with sliding-scale options. Bring your benefits questions to the free consultation and we'll sort out what makes sense.",
  },
  {
    q: "What does therapy cost?",
    a: "Sessions are $150 each. If you're uninsured and money is what's keeping you from care, email me and we'll talk about sliding-scale options (a lower fee based on what you can afford); that's a door I keep open on purpose. If you're paying without insurance, federal law gives you the right to a Good Faith Estimate of what care is expected to cost: ask me any time and I'll write one for you.",
  },
  {
    q: "Are sessions really all remote?",
    a: "Yes, and on purpose. Every session happens over secure video, which is how I can see clients anywhere in Washington State and, for private-pay clients (paying directly instead of using insurance), in the 40-plus states participating in PSYPACT. Research comparing video therapy with in-person care for trauma has repeatedly found the outcomes come out about the same, and there's one real advantage: you do hard work from a room that already feels safe. You need a private spot, headphones if you have them, and a connection steady enough for video; a phone works in a pinch.",
  },
  {
    q: "Who do you work with?",
    a: "Veterans and first responders, survivors of sexual and domestic violence, and people who have caused harm and want to stop. Also the communities too often overlooked in care: queer and trans folks, people of color, immigrants, elders, and anyone immunocompromised or chronically ill who's tired of explaining that part of their life. Individuals of all backgrounds and cultures are welcome, and I see individuals and groups.",
  },
  {
    q: "I've hurt someone. Can I still come to therapy?",
    a: "Yes. Part of my practice is working with people who have used violence, or caused sexual or domestic harm, and want to stop for good. You'll be treated with respect, and you'll also be held accountable: this work means understanding what drove the harm and building relationships that are actually safe. If a court or another agency is requiring treatment, tell me exactly what's required and I'll be honest about whether I can provide it.",
  },
  {
    q: "What if I'm in crisis right now?",
    a: "I'm not a crisis service, and this practice isn't staffed around the clock. If you're in immediate danger, call 911 or go to your nearest emergency room. Call or text 988 for the Suicide & Crisis Lifeline; veterans can dial 988 and press 1 for the Veterans Crisis Line. If someone is hurting you at home, the National Domestic Violence Hotline is 1-800-799-7233. Once you're stable and looking for longer-term work, I'd be glad to help.",
  },
  {
    q: "Is what I share confidential?",
    a: "Yes. The legal exceptions are few, and I'll walk you through them in our first session: imminent risk of serious harm to yourself or someone else, suspected abuse of a child or vulnerable adult, and court orders. Sessions run on a HIPAA-compliant video platform, nothing is recorded on either side, and your records live in an encrypted system.",
  },
  {
    q: "Will my employer or the military find out I'm in therapy?",
    a: "Being in therapy isn't the kind of thing that gets reported to an employer, a command, or a licensing board; what you say stays between us except for the few legal exceptions above. One honest caveat: if we bill your insurance, the plan processes the claim and may send its own paperwork to your home. If you'd rather keep therapy entirely outside any insurance record, private pay is always an option. We can talk through both on the free call and you decide with the full picture.",
  },
  {
    q: "What if I need to cancel or reschedule?",
    a: "Life happens. Email or call as soon as you know and we'll find another time; I'd much rather move a session than have you white-knuckle it through a bad week. The specific notice window and any fees are spelled out plainly before we start treatment, so nothing catches you by surprise later.",
  },
  {
    q: "Do you prescribe medication?",
    a: "No. Psychologists don't prescribe in Washington. If medication might help (some people find therapy easier when depression or panic isn't running the show), I'll coordinate with a psychiatrist or your primary care doctor so your care stays connected.",
  },
  {
    q: "What ages do you see?",
    a: "Teens, adults, and elders 65+, all by video, as individuals or in groups. For young children I'll refer you to colleagues who specialize in child and adolescent work, people I would send my own family to.",
  },
  {
    q: "Do you offer supervision or consultation for other clinicians?",
    a: "Yes. Clinical supervision and consultation are part of my practice, whether you're licensed and looking for a thinking partner or still collecting hours. Email me and put \u201cconsultation\u201d in the subject line.",
  },
  {
    q: "How soon can we start?",
    a: `Usually quickly: I have immediate availability most weeks, so first openings often land within the next week. Call ${SITE.phoneDisplay} or email me for a free 15-minute consultation, and we'll get an intake on the calendar. If I'm not the right fit, I'll tell you honestly and point you toward someone who is.`,
  },
];

/** Index of the clinician-consultation question, used for the deep link. */
export const CLINICIAN_FAQ_INDEX = 12;

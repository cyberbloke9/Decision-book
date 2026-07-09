# VISION-1M.md — Reimagining Pocket Decision Book for a million users

Raw human request (2026-07-09, verbatim): "Reimagine a version where a million users will appreciate this application. Plan deeply! Along with whatever is already planned!"

## 0. First principles — what actually gets a product like this to 1M

A million users require THREE independent machines, and today the app has zero of them:

1. **Acquisition** — a reason strangers find it. Nobody searches "mental models app"; they search *"should I quit my job"*, *"can't decide between two offers"*, *"how do I stop procrastinating"*. The product must meet people AT their decision, in their language, where they already look (search, app stores, shares from friends).
2. **Retention** — a reason to return that compounds. A reference library is visited twice; a *practice with accruing personal data* (your journal, your mastery, your streak) is visited daily. This is the already-planned v3 layer.
3. **Distribution surface** — being installable/findable where a normal (non-PWA-aware) person lives: the App Store, Play Store, Google results, a friend's WhatsApp message.

**The identity shift that unlocks all three:** from *"a pocket reference of 74 frameworks"* to *"the decision companion — bring a real dilemma, leave with a decision you can defend, in 3 minutes."* The 74-framework library (v1/v2's asset) becomes the engine room, not the storefront.

**The soul constraints (non-negotiable, every future contract inherits them):**
- Opens in under a second, works fully offline, core free forever, no account required for anything core, decisions never leave the device by default. These are simultaneously the product ethos, the privacy brand, AND the cheapest possible infrastructure (static CDN ≈ $0 at 1M users). Guard them like B1–B23.

## 1. North-star metric

**Weekly Decisions Supported (WDS)** = journal entries written + walkthroughs completed per week. Not DAU, not installs. Every milestone below must state its expected WDS mechanism. (Aggregate, privacy-first counting only — see §6.)

## 2. The four growth loops (acquisition machines)

- **L1 — Share-card loop.** Every framework diagram and every completed walkthrough can be exported as a beautiful image/card ("my Eisenhower matrix for this week", "my pre-mortem for the move to Bangalore") — watermarked with the app name/URL. Decisions are inherently social; people already send "help me decide" texts. Give that text a beautiful artifact. K-factor engine #1.
- **L2 — SEO loop.** 74 public landing pages (one per framework) with the full card content — essence, diagram, the five persona examples. Long-tail queries ("sunk cost fallacy relationship example", "eisenhower matrix for students") have huge volume and weak competition. The 370 persona examples ARE the content moat; they were built for exactly these queries. Free to serve (static).
- **L3 — Store loop.** App Store + Play Store presence via a thin native wrapper (Capacitor/WKWebView around the SAME codebase). Store search is where a million normal users actually install things; PWA-only is a hard growth ceiling. Store featuring is plausible: distinctive design + offline + privacy story is exactly what editorial teams feature.
- **L4 — Companion-to-the-canon loop.** The Decision Book sold 1M+ copies; fs.blog/mental-models content has a colossal audience that reads and forgets. Position as "the practice companion to the thinking books you keep reading" — partnerships/content targeting that audience (newsletter creators, book clubs, podcasts).

## 3. The hero flow — decision-first entry (the reimagined core UX)

Today: user picks a situation → gets a framework list. Reimagined:

1. **"What are you deciding?"** — the home screen is a single input (type or dictate the dilemma; on-device).
2. **Routing** — a local, on-device classifier (keyword/trigger mapping over the existing situations + Cynefin-style triage; NO server, NO AI required; optional AI assist later, §7) picks a **playbook**.
3. **Playbook walkthrough** — a chained, fill-in sequence of 2–4 frameworks (e.g. big irreversible choice: Cynefin classify → WRAP steps → pre-mortem → Stop Rule tripwire). The user fills in THEIR decision; the book's own DNA ("models are methods you fill in") finally becomes interactive.
4. **Decision record** — the output artifact: a clean one-screen summary (what I'm deciding, options, the framework's verdict, my confidence, my tripwire/review date). Saved to the journal (v3), exportable as a share card (L1), review-scheduled (SRS).

Curated playbook set for v4 (each maps to a top search intent): Career fork / Quit-or-stay; Big purchase; Ending something (project, relationship, commitment); Too many options; I keep procrastinating; Conflict with someone; Big irreversible bet; Should I trust this person/deal.

## 4. Retention machine (already planned v3 + additions)

- **v3 practice layer (as planned):** decision journal (Farnam Street fields), SRS over frameworks ("how automatic is this?" intervals), reverse quiz (scenario → which framework?). Prereqs already logged: PDB_STORE shared versioned storage, persona-tabs extraction with onSelect hook.
- **Notification cue** (post-deploy): one daily push, user-chosen time, framed as the daily card question ("Today: Inversion — what would guarantee failure?"). Implementation-intentions research: the cue is everything.
- **Home-screen widget** (needs native wrapper): today's card on the home screen = daily impression with zero opens.
- **Calm streak** (exists) + weekly review ritual: Sunday "decision review" prompt over open journal entries whose review dates arrived (closes the loop the research says almost nobody closes: comparing expected vs. actual outcomes).

## 5. Personalization — the persona system becomes user-facing

Onboarding (3 taps, skippable): "Who are you right now?" (the five personas, already built) + "What season are you in?" (career / money / relationships / focus / leading people). Effects: featured examples re-rank to YOUR persona; daily deck weights toward your season; situations screen reorders. Zero backend — all local preference. This converts v2's biggest content asset (370 persona examples) into felt personalization.

## 6. Reach infrastructure

- **Deploy** (immediate, already pending): static host (Vercel or GitHub Pages) → HTTPS PWA installable on any phone.
- **Stores:** Capacitor wrapper, iOS + Android, same codebase + widget + push plumbing. Apple dev account $99/yr. Trade-off: review friction + 15–30% cut IF selling in-app (mitigation: sell Pro on web, stores get the free app).
- **i18n:** the app is pure text + SVG — highly localizable. Ship an i18n framework, then languages by TAM/fit: Hindi, Spanish, German (the book's original language), Portuguese. Each language multiplies L2 (SEO) too.
- **Privacy-first analytics:** aggregate event counts only (no PII, no per-user tracking; e.g. self-hosted Plausible or on-device counts with opt-in aggregate ping). Needed to steer playbooks/content; must never contradict the privacy brand.
- **A name check:** "Pocket Decision Book" may collide with the book's trademark in stores. Evaluate a distinct brand (e.g. "Decided", "Crossroads", "ThinkKit") before store submission; keep "inspired by the mental-models canon" positioning without implying affiliation. LEGAL CHECK REQUIRED before store listing (name, store screenshots must not reproduce book branding).

## 7. Monetization (sustains it; must not throttle growth)

- **Free forever:** all 74 frameworks, daily card, situations, search, favorites, 3 playbooks, journal (capped entries), share cards.
- **Pro (one-time purchase ~$15 or cheap annual — book-like, fits the ethos):** unlimited journal + export, full SRS, all playbooks, custom "my models" workbook, widgets, optional end-to-end-encrypted sync, all languages.
- **Optional AI assist (BYO or metered):** dilemma → routed playbook with AI-drafted first-pass fills. Strictly optional, clearly labeled, off by default — the on-device keyword router is the default forever (cost + privacy + offline).
- Explicit anti-goals: ads (never), selling data (never), engagement-bait mechanics (never — calm streak stays calm).

## 8. Community (later, carefully)

"My models" workbook (build your own framework card) → opt-in, human-moderated public gallery of user models with attribution. The book itself ends with "now build your own" — this is the faithful community feature, and user-generated frameworks feed L2. Strictly after v5; moderation is a real cost.

## 9. Milestone roadmap (each = one GYWD milestone → one harness run)

- **v3 "Practice"** (retention): PDB_STORE versioned storage → persona-tabs extraction + onSelect → decision journal → SRS engine → reverse quiz → weekly review. Prereq: none. WDS mechanism: journal entries.
- **v4 "Companion"** (the reimagined core): decision-first home input + on-device router → 8 playbooks with fill-in walkthroughs → decision records → share-card image export (L1) → onboarding personalization (§5). WDS mechanism: walkthroughs completed.
- **v5 "Reach"** (distribution): deploy + SEO landing pages (L2) → brand/name decision + legal check → Capacitor wrappers + store listings (L3) → push notifications + widgets → analytics (privacy-first) → i18n framework + first language. WDS mechanism: acquisition volume × existing loops.
- **v6 "Sustain"**: Pro tier + payments (web-first) → optional E2E-encrypted sync → second/third languages → my-models gallery (§8).

Sequencing logic: retention BEFORE acquisition (filling a leaky bucket is waste), acquisition surface BEFORE monetization (price nothing until strangers arrive), community last (moderation cost). Each milestone keeps the soul constraints (§0) as blocking contract terms.

## 10. Honest trade-offs & kill-criteria

- **Native wrappers** cost recurring money/friction; if PWA-only install conversion post-deploy is strong in the user's circles, stores can defer to v5.5. Kill-criterion: if store review forces compromising offline/privacy, ship PWA-only and invest in L2.
- **AI routing** risks cost + privacy dilution; default keyword router must be good enough alone. Kill-criterion: if AI assist can't run within Pro margins, drop it — playbooks work without it.
- **i18n** is a content-quality risk (370 examples × languages); machine-translate-then-human-review only, one language at a time.
- **The biggest risk is soul-loss:** every added surface (onboarding, notifications, Pro) is one more thing between a stuck human and their answer. The 1-second-open, offline, no-account core is the moat — it is also what a million users will actually *appreciate* rather than merely install.

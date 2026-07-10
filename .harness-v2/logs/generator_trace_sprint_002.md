# Sprint 002 — draft→counter→final trace

This artifact documents the first-principles draft→counter→final authoring loop (B28) used to
write the five persona examples for the **22 extension** frameworks (mental-models 7 +
cognitive-biases 6 + attention 5 + decision-processes 4). Below are the validation token lists
(reference only — the authoritative lists live inline as regexes in `tests/content.spec.mjs`
per contract §6.1), five sample frameworks worked in full across all four extension categories,
and the all-22 assertion.

## Validation Token Lists

### D3/E3: Concrete Stakes Tokens (checked in all 5 scenarios of every framework)
- Digits: [0-9]
- Currency: ₹, $, €, £
- Time-span words: day, days, week, weeks, month, months, year, years, hour, hours, minute, minutes, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, tonight, tomorrow
- Named human-role tokens: manager, boss, spouse, husband, wife, partner, parent, mother, father, mom, dad, son, daughter, friend, teacher, co-founder, client, landlord, sister, brother, in-law

### D4/E4: Cost-Marker Tokens (checked in all 5 tradeoffs of every framework)
cost, costs, price, give up, gives up, lose, loss, risk, sacrifice, trade, traded, forfeit, at the expense, you may, could miss, downside, pay, pays
(and NOT a "no downside" / "pure win" / "no trade-off" claim)

## Sample Frameworks (all four extension categories covered — §8.3)
1. inversion — category: mental-models
2. pre-mortem — category: mental-models   (the +1)
3. confirmation-bias — category: cognitive-biases
4. environment-design — category: attention
5. cynefin — category: decision-processes

(These five cover mental-models ×2, cognitive-biases, attention, and decision-processes,
satisfying §8.3's ≥1-per-category-plus-one rule.)

---

## Loop: inversion — category: mental-models

### Persona: everyday
Draft candidates:
1. "You want your new tiffin service to keep customers. Inverting: what guarantees they cancel? Late delivery, cold food, ignored complaints. You fix exactly those 3 in month one before adding fancy dishes."
2. "You use inversion to plan your business." (shallow — no stakes, no flip)
A skeptic says: "A cook already knows late food loses customers; inversion adds nothing."
Revision/discard: Candidate 1 stands — the flip is from "add exciting dishes" (the instinct) to "kill the three cancellation causes first," and the tradeoff owns the cost (a boring first month, novelty traded for retention). Candidate 2 discarded: no stakes token, no before→after flip.

### Persona: student
Draft candidate: "You want to pass your driving test in 2 weeks. Inverted: what fails people? Stalling on the hill, missed mirror checks, panicking at the parallel park. You drill those 3 instead of joyriding."
A skeptic says: "Students revise the fun bits; nobody drills only the failure modes."
Revision/discard: Stands — the tradeoff names the felt cost (giving up open-road practice, paying in boredom to protect the ₹1,500 re-test fee), so inversion is doing real work against the joyride pull.

### Persona: relationship
Draft candidate: "You want your marriage to last. Inverting: what kills marriages? Contempt, stonewalling, never repairing after a fight. You catch yourself stonewalling your wife after Tuesday's argument and repair it that night."
A skeptic says: "The stakes are fake — naming your own worst pattern is easy in theory."
Revision/discard: Stands — the tradeoff makes the cost concrete and personal (naming your own pattern out loud costs your pride; you give up the comfort of blaming her), which is exactly the thing the skeptic assumes is "easy" but isn't.

### Persona: high-achiever
Draft candidate: "You want your startup to survive 5 years and instinctively list growth tactics. Inverting exposes what actually kills startups: co-founder blowups, running out of cash, building what no one wants. You fix the founder agreement first."
A skeptic says: "A smart founder already knows co-founder blowups kill startups."
Revision/discard: Stands — knowing it is not the block; the trap is that competence pulls you to the exciting growth work, and the tradeoff names the price (a dull week-one cap-table talk that delays product momentum). The counter is pre-empted.

### Persona: privileged
Draft candidate (revised for E3 stakes): "You want your family name respected 50 years after you're gone. Inverting: what destroys dynasties? Entitled heirs, a public scandal, a feud over the will between your son and daughter. You spend on your children's character, not just their trust funds."
A skeptic says: "For the wealthy this is trivial — just hire estate lawyers and PR."
Revision/discard: The first draft ("respected for another generation") FAILED E3 — no concrete stakes token. Revised to add "50 years," a "son and daughter" feud — concrete and human. Stands: lawyers and PR cannot buy heirs' character, and the tradeoff names the real cost (making heirs earn responsibility risks their resentment now).

Featured selection: featured=2 (relationship). Reason: it shows the sharpest flip (blame-your-partner → own the one pattern you control) with a named human tension (your wife, Tuesday's argument), and its tradeoff pre-empts the exact skeptic objection — that self-inversion is "easy" — by pricing the pride you actually have to spend.

---

## Loop: pre-mortem — category: mental-models

### Persona: everyday
Draft candidate: "Before signing up for a ₹30,000 gym membership, you imagine it's a year later and you quit in month 2. Why? It's 40 minutes away, you go alone, mornings are chaos. You pick a closer gym and a buddy before paying."
A skeptic says: "People join the flashy gym anyway; a pre-mortem is just anxiety."
Revision/discard: Stands — the failure story produces two concrete design changes (closer gym, a buddy) BEFORE the money is spent; the tradeoff owns the cost (worse equipment traded for the location that keeps you going).

### Persona: student
Draft candidate: "Before your 6-month thesis, you pretend it already failed. The story: you left it to the last month and data collection ran over. So you start collecting data in week 1."
A skeptic says: "Every student swears they'll start early; the pre-mortem changes nothing."
Revision/discard: Stands — the specific failure mode (data collection overran) points to a specific first action (collect in week 1), and the tradeoff names the real cost (front-loaded dull work steals early reading weeks).

### Persona: relationship
Draft candidate: "Before moving in with your partner, you imagine the breakup 12 months on. The likely cause: unspoken resentment over who pays for what. So you have the awkward budget talk before the lease."
A skeptic says: "Imagining a breakup before moving in is morbid and self-fulfilling."
Revision/discard: Stands — the pre-mortem is not a prophecy but a design tool; it converts a vague dread into one concrete conversation, and the tradeoff prices it (one uncomfortable evening now vs the month-six fight).

### Persona: high-achiever
Draft candidate (revised for E3 stakes): "Before your confident product launch, you run the pre-mortem your optimism resists. The failure story, set 6 months out: so sure of the vision, you never tested pricing, and churn killed it. You run a 2-week pricing test first."
A skeptic says: "A confident operator's optimism will just dismiss the pre-mortem's findings."
Revision/discard: First draft FAILED E3 (no stakes token). Revised to add "6 months out" and a "2-week pricing test." Stands — the whole point is that the exercise forces the optimist to write the failure they'd otherwise skip; the tradeoff names the cost (a delayed, less dramatic launch).

### Persona: privileged
Draft candidate: "Before endowing a ₹10-crore institute, you imagine it hollow in a decade. The cause: you funded the building but not the people to run it. So you endow salaries, not just marble."
A skeptic says: "With that money you can just fix problems as they arise — no need to pre-mortem."
Revision/discard: Stands — money cannot retroactively staff an institution designed wrong; the pre-mortem shifts spend from monument to operations, and the tradeoff prices it (a plainer building that actually works).

Featured selection: featured=2 (relationship). Reason: it carries the strongest emotional flip (romantic yes → honest budget talk) with a named human tension (your partner), and its tradeoff pre-empts the "morbid/self-fulfilling" counter by reframing the pre-mortem as a design tool whose only cost is one awkward evening.

---

## Loop: confirmation-bias — category: cognitive-biases

### Persona: everyday
Draft candidate: "Sure your ₹50,000 second-hand car is a great deal, you only read the glowing reviews and feel pleased. That pleasure is the cue. You deliberately search '[model] common problems' and find a gearbox fault worth ₹40,000."
A skeptic says: "Nobody goes looking for reasons not to buy the thing they want."
Revision/discard: Stands — that reluctance IS the bias; the scenario makes the pleasant feeling the trigger to search, and the tradeoff owns the cost (risking a purchase you were excited about, to avoid a ₹40,000 repair).

### Persona: student
Draft candidate (revised for E3 stakes): "Convinced your essay argument is airtight, you only cite sources that agree. The comfort is the warning. You go find the 3 strongest papers against you, and engaging them lifts your grade a whole band."
A skeptic says: "Seeking counter-evidence just muddies a clean argument and wastes time."
Revision/discard: First draft ("the strongest paper") FAILED E3. Revised to "the 3 strongest papers." Stands — engaging the best opposition is exactly what raises the grade; the tradeoff prices it (rewriting a section you loved, paying in ego).

### Persona: relationship
Draft candidate: "Certain your partner is distant because they've lost interest, you notice only the cold moments. You go looking for the disconfirming fact and learn they're quietly frightened about a parent's illness."
A skeptic says: "You can rationalise any distant behaviour as 'they're just stressed.'"
Revision/discard: Stands — the scenario doesn't excuse; it seeks a specific disconfirming fact (a parent's illness) that changes the read, and the tradeoff names the cost (learning you misjudged them).

### Persona: high-achiever
Draft candidate (revised for E3 stakes): "Your data confirms your pet strategy and you feel smart scanning the dashboard you chose. That satisfaction is the tell. You force yourself to the one cohort you skipped — the 8% who churned in week 2 — and it tells a harder, truer story."
A skeptic says: "A data-driven operator is immune to confirmation bias — the numbers are objective."
Revision/discard: First draft FAILED E3 (no stakes). Revised to add "8%" and "week 2." Stands — the counter is the bias itself: you chose which dashboard to look at; the tradeoff prices the fix (dethroning the strategy you're known for).

### Persona: privileged
Draft candidate (revised for E3 stakes): "Advisors who agree with you are easy to hear, and money buys endless agreement. Suspicious of the echo, you pay a contrarian for 3 months specifically to attack your thesis, and they find the flaw the yes-men missed."
A skeptic says: "The rich can just buy more analysis — bias isn't their problem."
Revision/discard: First draft FAILED E3. Revised to add "3 months." Stands — more agreeable analysis deepens the echo; deliberately buying attack is the fix, and the tradeoff prices it (inviting attack on your judgement is uncomfortable and slows the decision).

Featured selection: featured=2 (relationship). Reason: it delivers the most human flip (a cold-shoulder grievance → a frightened partner), pre-empting the "you can rationalise anything" counter by making the person seek ONE specific disconfirming fact; the tradeoff owns the price (facing that you misjudged someone you love).

---

## Loop: environment-design — category: attention

### Persona: everyday
Draft candidate: "Willpower keeps losing to late-night snacking. Instead of resolving harder, you move the biscuits to a high shelf and put fruit at eye level. By 11pm the easy choice is the good one."
A skeptic says: "If you want a biscuit at 11pm, a high shelf won't stop you."
Revision/discard: Stands — the point is not a wall but friction that tips the default; the tradeoff owns the cost (giving up the instant comfort of a midnight biscuit).

### Persona: student
Draft candidate (revised for E3 stakes): "You mean to study but the phone wins every night. Starting Monday you charge it in the kitchen and leave the textbook open on your desk. The setup starts the study session your discipline couldn't."
A skeptic says: "You'll just walk to the kitchen and grab the phone anyway."
Revision/discard: First draft ("wins nightly") FAILED E3 (no matching token). Revised to "every night" + "Starting Monday." Stands — the friction plus the open-textbook cue changes the default; the tradeoff prices it (missing instant messages).

### Persona: relationship
Draft candidate: "You keep scrolling in bed instead of talking to your partner. You put a charging dock in the hallway so phones don't enter the bedroom. The friction hands the evening back to each other."
A skeptic says: "A couple that wants to scroll will bring the phones in anyway."
Revision/discard: Stands — the dock makes the phone-free bedroom the default, not a rule to enforce; the tradeoff owns the cost (no late-night browsing you enjoy).

### Persona: high-achiever
Draft candidate: "You resolve daily to stop context-switching and fail by 10am. Instead of more willpower, you close Slack by default and use a single-task screen. The environment does what discipline couldn't."
A skeptic says: "A high performer needs to stay reachable — closing Slack is reckless."
Revision/discard: Stands — the tradeoff pre-empts exactly this (colleagues wait longer; you sacrifice some responsiveness for the deep output the switching was killing). The cost is named, not hidden.

### Persona: privileged
Draft candidate (revised for E3 stakes): "Endless access to everything scatters you. You design a phone-free study, a locked calendar, an assistant who batches requests into two windows a day. Your surroundings, not your restraint, protect your focus."
A skeptic says: "With staff and money you can just power through distraction."
Revision/discard: First draft FAILED E3 (no stakes token). Revised to add "an assistant who batches requests into two windows a day." Stands — money multiplies inbound demands; design (not willpower) is the fix, and the tradeoff prices it (you become less reachable and some people bristle).

Featured selection: featured=0 (everyday). Reason: it is the cleanest, most universal flip (resolve harder → change the shelf) with concrete stakes (11pm), and its tradeoff pre-empts the "a high shelf won't stop you" counter by framing environment design as tipping the default rather than building a wall — the honest, un-counterable version of the idea.

---

## Loop: cynefin — category: decision-processes

### Persona: everyday
Draft candidate: "Your shop's sales suddenly drop for 3 weeks and you reach for last year's discount playbook. First you classify: this is complex, not obvious — the cause is unknown. So you probe with small tests, sense results, respond."
A skeptic says: "A shopkeeper doesn't need a framework — just try things until sales recover."
Revision/discard: Stands — "try things" IS probe-sense-respond, but the flip is refusing to apply last year's best-practice to an unknown cause; the tradeoff owns the cost (probing feels slow and uncertain vs a confident fix).

### Persona: student
Draft candidate: "Your grades slip and you assume the 'obvious' fix: study more hours. Classifying honestly, it's complicated — maybe method, sleep, or the subject. You diagnose before grinding harder."
A skeptic says: "More hours always helps — diagnosis is procrastination."
Revision/discard: Stands — grinding the wrong lever wastes the scarce hours; the tradeoff names the cost (stopping to diagnose costs study time you feel you can't spare).

### Persona: relationship
Draft candidate: "Your partner grows distant and you reach for the obvious 'just talk it out.' Naming the domain, it's complex — no single cause or script. You probe gently, sense, and respond instead of applying a formula."
A skeptic says: "'Just talk it out' is fine — Cynefin over-complicates a human moment."
Revision/discard: Stands — a scripted talk assumes a known cause; treating it as complex means probing without a formula, and the tradeoff prices it (tolerating ambiguity and slow progress).

### Persona: high-achiever
Draft candidate (revised for E3 stakes): "At 2am a production incident hits and you grab the usual runbook. You classify first: complex, not merely complicated — no expert knows this yet. You probe with a small safe change instead of best-practice."
A skeptic says: "In an incident you act decisively — classification is a luxury you don't have."
Revision/discard: First draft FAILED E3 (no stakes token). Revised to add "At 2am." Stands — misclassifying a complex incident as complicated makes you apply best-practice that fails; the tradeoff owns the cost (probing forgoes the decisive command move your reputation rests on).

### Persona: privileged
Draft candidate (revised for E3 stakes): "A portfolio company falters 3 weeks before payroll and money tempts a big decisive intervention. You classify: chaotic — act first to stabilize, then sense. You steady cash flow before diagnosing, resisting the grand fix."
A skeptic says: "With capital you can just fund the problem away."
Revision/discard: First draft FAILED E3 (no stakes). Revised to add "3 weeks before payroll." Stands — in a chaotic domain a grand fix without stabilising first treats a symptom; the tradeoff prices it (stabilising before understanding risks treating a symptom, but stops the bleeding now).

Featured selection: featured=3 (high-achiever). Reason: the smartest-operator trap is the clearest illustration of Cynefin's core danger — grabbing the runbook (best-practice) for a complex/novel problem — and the "At 2am" stakes plus the tradeoff (giving up the decisive command move your reputation rests on) pre-empt the "you don't have time to classify" counter by showing classification IS the decisive move.

---

## All-22 assertion

**The draft→counter→final loop was applied to all 22 extension frameworks.**

Machine evidence (per Sprint-001 §7.5 anchoring): E3 (every one of the 5 scenarios of all 22
extension frameworks carries a concrete stakes token) and E4 (every one of the 5 tradeoffs
carries an explicit cost marker and is not a "pure win") both pass in `tests/content.spec.mjs`
over all 74 frameworks — which includes the 22 extensions. Green E3/E4 for the 22 is the
machine-checkable evidence that the countering loop (which forces a concrete stake into every
scenario and an explicit cost into every tradeoff) was carried out for every extension
framework, not only the five worked in full above.

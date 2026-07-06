/* Build js/data.js from:
   - RESEARCH.md parse (byte-exact trigger/essence + visualRaw) via extract-content.mjs
   - AUTHORED map below (id → visualType, universalExample, personalPrompt, pitfalls, steps?)
   trigger/essence are NEVER hand-typed here — they come straight from the parser, so B2 holds.
   Run: node scripts/build-data.mjs   → writes ../js/data.js
   universalExample / personalPrompt / pitfalls / steps are ORIGINAL Generator authoring (B3),
   grounded in the founder/builder persona; every personalPrompt ends in "?" (B5). */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { extractResearch } from "./extract-content.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "..", "js", "data.js");

// id, in RESEARCH order (74). Kebab-case, unique, human-derived from name.
const IDS = [
  "eisenhower-matrix", "swot-analysis", "bcg-box", "project-portfolio-matrix",
  "feedback-analysis-drucker", "john-whitmore-grow", "rubber-band-model", "feedback-box",
  "yes-no-rule", "choice-overload", "gap-in-the-market-model", "morphological-box-scamper",
  "gift-model", "thinking-outside-the-box", "consequences-model", "unconscious-thinking-theory",
  "stop-rule", "buyers-decision-model",
  "flow-model", "johari-window", "cognitive-dissonance", "unimaginable-model", "uffe-elbaek-model",
  "energy-model", "political-compass", "personal-performance-model", "making-of-model",
  "personal-potential-trap", "hard-choice-model", "cognitive-bias", "crossroads-model",
  "rumsfeld-matrix", "swiss-cheese-model", "maslow-pyramids", "sinus-milieu-bourdieu-model",
  "double-loop-learning", "appreciative-inquiry", "pareto-principle", "long-tail",
  "conflict-resolution-model", "black-swan-model", "chasm-diffusion-model", "black-box-model",
  "prisoners-dilemma",
  "team-model", "hersey-blanchard", "role-playing-model", "result-optimisation-model",
  "project-management-triangle", "drexler-sibbet-team-performance", "expectations-model",
  "future-of-decisions-model",
  "second-order-thinking", "inversion", "pre-mortem", "regret-minimization", "ooda-loop",
  "10-10-10", "circle-of-competence",
  "sunk-cost-fallacy", "confirmation-bias", "loss-aversion", "planning-fallacy", "anchoring",
  "hindsight-bias",
  "implementation-intentions", "deep-work", "environment-design", "ulysses-pact", "daily-highlight",
  "wrap", "decision-journal", "weighted-scoring", "cynefin"
];

// name is ALWAYS the RESEARCH.md cell verbatim (contract §3.1) — including
// annotated forms like "Cognitive Bias (meta-card)" — for consistency with every
// other parenthetical name and robustness to name-based RESEARCH joins.
const NAME_OVERRIDES = {};

// id → authored fields. visualType must be a member of the derived VISUAL_TYPES set.
const AUTHORED = {
  "eisenhower-matrix": {
    visualType: "matrix-2x2",
    universalExample: "Your inbox has forty flagged messages. You draw the two axes and a refund dispute lands in do-now, a strategy memo lands in schedule-for-Thursday, three cc'd threads go to delegate, and a newsletter goes to drop. Thirty-five minutes of dread becomes four decisions.",
    personalPrompt: "Which task have you been treating as urgent all week that is actually only important, and when will you block time for it before it catches fire?",
    pitfalls: ["Almost everything can be argued into 'urgent' — be honest about deadlines that are real versus deadlines that are anxiety.", "The important-not-urgent box is where growth lives and where nothing screams at you, so it silently gets skipped."]
  },
  "swot-analysis": {
    visualType: "matrix-2x2",
    universalExample: "Before committing a quarter to a new pricing tier, you fill the four boxes: strength — you already have the billing code; weakness — nobody on the team has done pricing research; opportunity — a competitor just raised prices; threat — churn if existing users feel punished. The threat box changes the rollout plan.",
    personalPrompt: "For the plan you're about to commit to, what is the one threat you've been quietly hoping won't matter?",
    pitfalls: ["It's easy to fill boxes with vague words ('great team', 'market risk') that don't change any decision — force each cell to name something specific.", "A SWOT describes; it doesn't decide. Follow it with an action or it's just a tidy wall."]
  },
  "bcg-box": {
    visualType: "matrix-2x2",
    universalExample: "You list your five side-projects and rate each on growth potential and current payoff. The newsletter is a cash cow — steady, low growth. The prototype is a question mark — high growth, no payoff yet. Two abandoned repos are dogs. You give the question mark a real month instead of dribbling attention across all five.",
    personalPrompt: "Which of your projects is a 'dog' you keep feeding out of habit, and what would you do with that time instead?",
    pitfalls: ["Labelling something a dog can feel like admitting failure, so people keep low-value work alive to avoid the sting.", "Today's question mark can become tomorrow's star or dog — re-plot periodically, don't treat one snapshot as permanent."]
  },
  "project-portfolio-matrix": {
    visualType: "scatter-plot",
    universalExample: "You plot every active project by how much time it eats against how much it moves your strategy. A slick internal dashboard sits top-left: expensive, low value. Seeing it as a dot rather than a to-do makes it easy to kill and reclaim two days a week.",
    personalPrompt: "Which expensive-but-low-value project would you feel relief to stop, and what is stopping you from stopping it?",
    pitfalls: ["Sunk effort makes the costly-low-value corner feel too painful to cut — judge future value, not past investment.", "Strategic value is easy to inflate for pet projects; get a second opinion on the vertical axis."]
  },
  "feedback-analysis-drucker": {
    visualType: "timeline",
    universalExample: "Before shipping a feature you write: 'I expect signups to rise 15% within a month.' Two months later signups rose 3% but support tickets dropped sharply. Comparing prediction to reality, you learn your real strength isn't growth work — it's reducing friction. You steer toward that.",
    personalPrompt: "What outcome are you predicting for your current bet, and where will you write it down so your future self can't rewrite the memory?",
    pitfalls: ["Without a written prediction, hindsight quietly edits what you 'always knew' — the record is the whole point.", "It only pays off if you actually return to compare months later; schedule the review now."]
  },
  "john-whitmore-grow": {
    visualType: "flow",
    universalExample: "A teammate says 'I want to get better at public speaking.' You walk GROW: Goal — give a confident conference talk this year; Reality — I freeze in meetings of more than six; Options — a local meetup, a speaking course, recording myself; Will — I'll submit to one meetup by Friday. A wish became a dated next step.",
    personalPrompt: "For the vague goal you keep restating, what is the smallest concrete thing you will actually do this week?",
    pitfalls: ["It's tempting to jump straight to Options before honestly mapping Reality — the plan then solves the wrong problem.", "Ending without a specific, time-bound Will step leaves motivation with nowhere to go."],
    steps: [
      "Goal — name what you actually want, concretely.",
      "Reality — describe where things honestly stand right now.",
      "Options — list the paths available, without judging them yet.",
      "Will — commit to one specific next action, with a date."
    ]
  },
  "rubber-band-model": {
    visualType: "tension",
    universalExample: "You're torn between staying at a stable job and joining an early startup. Instead of asking which pulls harder, you ask what holds you to each: the job holds you with security and a team you like; the startup pulls you with ownership and speed. Naming both anchors explains why the choice aches — and which anchor you're ready to cut.",
    personalPrompt: "For the two options tugging at you, what is holding you to the one you keep almost leaving?",
    pitfalls: ["Framing it as pure attraction hides the anchors that are really keeping you stuck.", "The point is to see the tension clearly, not to resolve it instantly — sitting with both pulls is part of the method."]
  },
  "feedback-box": {
    visualType: "matrix-2x2",
    universalExample: "After a launch, five people send notes. You sort them: one flags a real onboarding bug (act on it), one is a stylistic preference you'll ignore, one is warm encouragement (affirmation), one is a vague 'meh' (noise). The single actionable note gets your Monday morning; the rest stop haunting you.",
    personalPrompt: "Of the criticism sitting in your head right now, which single piece is advice worth acting on, and which are you just replaying?",
    pitfalls: ["A defensive mood dumps everything into 'noise' so nothing has to change — sort before you react.", "The reverse trap: treating every offhand comment as an action item and drowning in other people's preferences."]
  },
  "yes-no-rule": {
    visualType: "flow",
    universalExample: "You keep agonising over every podcast invite. You set a rule: 'Only if it reaches 10k listeners and I can prep in under two hours.' Now each invite is a quick gate, not a fresh negotiation with yourself. The recurring decision runs itself.",
    personalPrompt: "Which decision do you keep re-litigating, and what personal rule would let you decide it once and stop?",
    pitfalls: ["A rule set too rigidly will misfire on the genuinely exceptional case — build in one deliberate override, not a dozen.", "Rules quietly go stale; revisit them when your goals change or they'll steer you by an old map."]
  },
  "choice-overload": {
    visualType: "curve",
    universalExample: "Picking an analytics tool, you open twelve tabs and stall for a week. You cut the list to three that meet two non-negotiables, then choose in an afternoon. Fewer options didn't lower quality — it restored your ability to decide at all.",
    personalPrompt: "Where are you stalled because you left too many options open, and which could you cut before choosing?",
    pitfalls: ["Cutting the menu too early can drop the option you'd have loved — trim by clear criteria, not by fatigue.", "More research feels like progress but often just widens the menu; set a shortlist size in advance."]
  },
  "gap-in-the-market-model": {
    visualType: "scatter-plot",
    universalExample: "You map note-taking apps by two things users actually want: speed and structure. The crowded corner is fast-but-messy; the empty-but-wanted corner is fast-and-structured. Your idea aims there — an empty zone people are actively frustrated by, not an empty zone nobody cares about.",
    personalPrompt: "For the idea you're weighing, is the gap you found empty because it's untapped, or empty because nobody wants it filled?",
    pitfalls: ["An empty zone can be empty for a good reason — validate that people actually want it, not just that it's unoccupied.", "Plotting only your favourite axes can invent a gap that vanishes under the dimensions customers really use."]
  },
  "morphological-box-scamper": {
    visualType: "grid",
    universalExample: "Reinventing your onboarding email, you break it into attributes — sender, tone, length, call-to-action, timing — and list options for each. Then you run SCAMPER: substitute the sender for a real founder, combine two emails into one, eliminate the second CTA. New combinations surface that a blank page never would.",
    personalPrompt: "Take the thing you're stuck improving — which single attribute could you substitute or eliminate to get an idea you haven't tried?",
    pitfalls: ["Systematic recombination generates volume, not quality — most combinations are duds, so filter hard afterward.", "Breaking a thing into the wrong attributes constrains every idea that follows; choose the dimensions carefully."],
    steps: [
      "Substitute — swap one part for another.",
      "Combine — merge two elements into one.",
      "Adapt — borrow something that works elsewhere.",
      "Modify — scale, exaggerate, or shrink an attribute.",
      "Put to other uses — apply it to a different job.",
      "Eliminate — remove a part and see what's left.",
      "Reverse — flip the order or the assumption."
    ]
  },
  "gift-model": {
    visualType: "matrix-2x2",
    universalExample: "Choosing a thank-you gift for a mentor, you plot ideas on desire versus surprise. A gift card is high-desire, zero-surprise (forgettable). A random gadget is high-surprise, low-desire (clutter). A rare edition of a book she loves sits in the sweet spot — wanted and unexpected.",
    personalPrompt: "For the gift or offer you're planning, does it sit in the wanted-and-surprising zone, or have you defaulted to safe-but-forgettable?",
    pitfalls: ["Optimising only for surprise produces novelty they didn't want; anchor on genuine desire first.", "What counts as desire and surprise is theirs, not yours — map from their taste, not your own."]
  },
  "thinking-outside-the-box": {
    visualType: "nine-dot",
    universalExample: "You've been trying to speed up a slow report by optimising the query. Stepping back, you realise the real constraint you assumed — that the report must run live — isn't required at all; a nightly cache solves it. The wall was in the assumption, not the problem.",
    personalPrompt: "What rule are you obeying on your current problem that nobody actually imposed on you?",
    pitfalls: ["'Think outside the box' becomes a slogan unless you name the specific assumption you're breaking.", "Some constraints are real and load-bearing — question them, but don't romanticise ignoring every limit."]
  },
  "consequences-model": {
    visualType: "tree",
    universalExample: "Tempted to hardcode a quick fix before a demo, you trace it out: it works tonight, but next week another dev copies the pattern, and in a month it breaks silently in production. Following the branch past step one turns a five-minute shortcut into an obvious no.",
    personalPrompt: "For the quick fix you're considering, what happens two steps after it works?",
    pitfalls: ["The tree can branch forever — go deep enough to change the decision, then stop, or you'll paralyse yourself.", "People trace only the branches that support the choice they already want; force yourself to follow the uncomfortable ones."]
  },
  "unconscious-thinking-theory": {
    visualType: "split",
    universalExample: "Facing a complex hiring choice with two strong finalists, you read every note, then deliberately stop and go for a long walk. By evening a clear preference has surfaced that the spreadsheet never produced. You loaded the facts, then let integration happen off-line.",
    personalPrompt: "On the tangled decision you're chewing, have you actually loaded the facts and stepped away, or just kept re-reading them?",
    pitfalls: ["Sleeping on it only helps after you've genuinely absorbed the information — distraction without input is just delay.", "For simple, well-defined choices, deliberate analysis still beats a gut hunch; reserve this for genuinely complex ones."]
  },
  "stop-rule": {
    visualType: "spectrum",
    universalExample: "Before starting a risky experiment, you decide the exit in advance: 'If I've spent three weekends and haven't got one paying user, I stop.' When week three arrives with no traction, the pre-set line makes quitting a plan, not a defeat.",
    personalPrompt: "For the effort you're pouring into, what condition — decided now, in the cold light of day — would tell you to walk away?",
    pitfalls: ["Set the stop rule before you start; once you're invested, sunk cost will bend any line you draw.", "A stop rule that's never checked is decoration — put the condition somewhere you'll actually see it."]
  },
  "buyers-decision-model": {
    visualType: "flow",
    universalExample: "You catch yourself about to buy a $200 course. Walking the stages — a tweet triggered it, you searched reviews, compared two options, and now you're about to buy — you notice the 'compare' stage was rigged by the seller's own testimonials. Knowing which stage you're in, you pause the purchase.",
    personalPrompt: "For a purchase you're about to make, which stage are you in, and who is nudging you there?",
    pitfalls: ["The justify stage happens after you buy — awareness there only helps you next time, not this time.", "Naming the stage doesn't immunise you; the value is slowing the funnel long enough to think."],
    steps: [
      "Trigger — something sparks the want.",
      "Search — you gather options and information.",
      "Compare — you weigh alternatives against each other.",
      "Buy — you commit.",
      "Justify — you tell yourself a story that it was right."
    ]
  },
  "flow-model": {
    visualType: "curve",
    universalExample: "You're bored refactoring trivial code but anxious the moment you touch the payments module. Plotting challenge against skill, boredom sits where the task is too easy and anxiety where it's too hard. You pair-program the payments work to raise your skill toward the challenge — and flow returns.",
    personalPrompt: "Is your current work boring you or scaring you, and which single dial — the challenge or your skill — will you nudge?",
    pitfalls: ["Flow is fragile — interruptions and notifications snap you out of the channel faster than difficulty does.", "Chasing flow everywhere ignores the necessary boring maintenance; not every task can or should be flow."]
  },
  "johari-window": {
    visualType: "matrix-2x2",
    universalExample: "After a rough project, you ask two colleagues for candid notes. They mention you interrupt in reviews — something you'd never noticed. That pane, known to others but not to you, shrinks the moment you invite the feedback. Your blind spot got smaller because you asked.",
    personalPrompt: "Whose honest read on your blind spot have you been avoiding asking for, and what's one question you could ask them this week?",
    pitfalls: ["The blind spot only shrinks if people feel safe being honest — defensiveness slams the window shut.", "Over-sharing to enlarge the 'open' pane can tip into oversharing; the goal is calibrated openness, not exposure."]
  },
  "cognitive-dissonance": {
    visualType: "split",
    universalExample: "You bought an expensive standing desk, then rarely stand. Instead of admitting the purchase was impulsive, you find yourself insisting it 'improves posture even sitting.' Catching the rationalisation, you see you're editing the belief to protect the action — and decide to either use the desk or let the regret be honest.",
    personalPrompt: "Where are you bending a belief to protect a choice you already made, and what would change if you let the choice be the thing that's wrong?",
    pitfalls: ["The rationalisation feels exactly like a genuine reason — that's why it's hard to catch in the moment.", "Spotting dissonance in yourself is uncomfortable; the instinct is to explain it away with one more story."]
  },
  "unimaginable-model": {
    visualType: "bubble-map",
    universalExample: "Mapping your career options, you list the obvious ones, then force a column for paths you'd never let yourself consider — quitting to teach, moving countries, starting over in a craft. Written down, the 'unimaginable' turns out to be a real location on the map, not a void, and one option there quietly excites you.",
    personalPrompt: "What option have you refused to even picture, and what happens if you sketch it out just to see it?",
    pitfalls: ["Listing wild options is easy; the model only helps if you take at least one seriously enough to test.", "Some unimaginable options are unimaginable for sound reasons — expand the frontier, then still judge honestly."]
  },
  "uffe-elbaek-model": {
    visualType: "radar",
    universalExample: "On a spider chart of values — creativity, security, status, connection — you plot four lines: how you see yourself, who you want to be, how others see you, how you'd like to be seen. The gap between 'want to be' and 'others see' on status tells you where you're performing a version of yourself that costs you.",
    personalPrompt: "On which value is the gap between who you want to be and how others see you the widest, and is that gap worth closing?",
    pitfalls: ["Self-ratings are flattering by default — the honest signal is in the gaps, not the absolute scores.", "Guessing how others see you is unreliable; where it matters, ask rather than assume."]
  },
  "energy-model": {
    visualType: "tension",
    universalExample: "You feel drained but your calendar looks light. Tracking energy rather than time for a week, you find the two-hour standup and the endless Slack scroll are the real drains, while deep coding actually restores you. You cut the standup to fifteen minutes and batch Slack — same hours, more energy.",
    personalPrompt: "What in your week takes far more energy than it takes time, and what would happen if you pruned it?",
    pitfalls: ["We plan around hours because they're easy to measure; energy is the variable that actually predicts burnout.", "A quick fix is to cut all draining tasks, but some are necessary — the move is to reduce or redesign them, not just delete."]
  },
  "political-compass": {
    visualType: "matrix-2x2",
    universalExample: "Arguing about a policy, you realise 'left vs right' flattens two separate questions. Placing yourself on an economic axis and a social axis independently, you find you're economically cautious but socially liberal — a position the single line couldn't hold. The map explains disagreements that felt contradictory.",
    personalPrompt: "On the belief you hold most strongly, are you collapsing two independent axes into one convenient line?",
    pitfalls: ["Two axes are still a simplification of a many-dimensional reality — useful, but don't mistake the map for the territory.", "It's easy to place opponents at the extremes and yourself at the sensible centre; plot honestly."]
  },
  "personal-performance-model": {
    visualType: "venn",
    universalExample: "Wondering if your role still fits, you draw three circles: want-to, have-to, can-do. The overlap has shrunk — you can still do the work and have to do it, but the want-to circle has drifted away. Seeing the gap explains the low-grade dread and points at what to renegotiate.",
    personalPrompt: "Where your current role sits, which circle — want-to, have-to, or can-do — has drifted out of the overlap?",
    pitfalls: ["A shrinking want-to circle is easy to blame on yourself when the fix might be changing the role, not your attitude.", "The three circles move over time; one snapshot of misalignment isn't a verdict, it's a prompt to check in."]
  },
  "making-of-model": {
    visualType: "timeline",
    universalExample: "Feeling lost about what's next, you chart your past as scenes: the teacher who pushed you, the job you quit, the project that failed and taught you the most. Laid out as a plot, a pattern emerges — you thrive right after a clean break — and it tells you how to write the next act.",
    personalPrompt: "Looking at the turning points that got you here, what pattern in your past is quietly predicting what you need next?",
    pitfalls: ["Hindsight tidies the past into a neat story it never was — hold the narrative loosely.", "The point is to inform the next act, not to get stuck admiring or relitigating old scenes."]
  },
  "personal-potential-trap": {
    visualType: "curve",
    universalExample: "For years you've told yourself you 'have potential' as a writer — someday. You notice the potential has become a comfortable excuse that grows heavier the longer it's uncashed. You pick one committed path — a weekly essay — and trade the open promise for a real, smaller thing.",
    personalPrompt: "Which 'potential' have you been carrying uncashed for years, and what committed path would let you finally spend it?",
    pitfalls: ["Keeping every door open feels safe but the option itself becomes a debt — at some point staying open is the loss.", "Cashing in means closing other doors; the discomfort of that is exactly what the trap uses to keep you frozen."]
  },
  "hard-choice-model": {
    visualType: "matrix-2x2",
    universalExample: "Two job offers score dead even on every spreadsheet you build. The model says: more analysis won't break a true tie because there's no hidden right answer — this is where you decide who you become. You choose the one that makes you the kind of person you want to be, and commit fully.",
    personalPrompt: "For the choice where the options are genuinely on a par, which one lets you become the person you want to be?",
    pitfalls: ["Mistaking a hard choice for a hard problem sends you back to more analysis that can't help — first check whether it's a true tie.", "'Creating who you are' isn't a licence to be reckless; it means committing and owning the choice, not shrugging."]
  },
  "cognitive-bias": {
    visualType: "distortion-lens",
    universalExample: "Reviewing a decision that went badly, you audit your own thinking: you anchored on the first estimate, sought data that agreed with you, and now remember 'knowing' it would fail. Naming the distortions doesn't undo the call, but it changes how you'll set up the next one — with a written prediction and a devil's advocate.",
    personalPrompt: "On your current big call, which distortion — anchoring, confirmation, loss aversion, or edited memory — is most likely bending your judgement right now?",
    pitfalls: ["Knowing about biases barely reduces them — awareness alone is weak; you need process (checklists, journals, outside views).", "It's easy to spot bias in others and stay blind to your own; assume you're distorted too."]
  },
  "crossroads-model": {
    visualType: "crossroads",
    universalExample: "At a genuine life junction, you name the roads instead of freezing: the road you came from, the safe road (stay put), the bold road (start the company), the unimaginable one (leave the field entirely), and the road you'd tell a friend to take. Said aloud, the friend's-advice road is obviously the bold one — and you'd been ignoring it.",
    personalPrompt: "Standing at your crossroads, what would you tell a good friend in exactly your position to do?",
    pitfalls: ["Naming five roads can become a way to admire the junction instead of walking down one — set a decision date.", "The 'advise a friend' trick works only if you're honest; it's easy to script the friend to endorse your fear."]
  },
  "rumsfeld-matrix": {
    visualType: "matrix-2x2",
    universalExample: "Planning a migration, you sort the risks: known knowns (the old schema), known unknowns (how long the backfill takes — you can test it), and you deliberately budget time for unknown unknowns by shipping behind a flag. Naming the categories turns 'it'll be fine' into a plan that respects what you can't see.",
    personalPrompt: "On your current plan, what's one known unknown you could turn into a known known this week with a small test?",
    pitfalls: ["Unknown unknowns can't be listed by definition — the honest move is to leave slack and stay reversible, not to pretend you've found them all.", "Overconfidence relabels real known unknowns as known knowns; interrogate the things you're sure about."]
  },
  "swiss-cheese-model": {
    visualType: "layers",
    universalExample: "A payment double-charged customers. Instead of blaming the one engineer, you trace the aligned holes: the test suite had a gap, code review was rushed, the staging data didn't cover that case, and there was no alert. Fixing any one layer would have stopped it. You add an alert and a review checklist rather than a scapegoat.",
    personalPrompt: "For your last failure, which single defensive layer — if it had held — would have caught it, and can you strengthen that one now?",
    pitfalls: ["The instinct is to blame the last person who touched it (the final slice), missing the aligned holes behind them.", "Adding endless layers has a cost; strengthen the few that catch the most, don't bury the system in checks."]
  },
  "maslow-pyramids": {
    visualType: "pyramid",
    universalExample: "A teammate keeps missing deadlines and you're about to coach them on ambition. Then you learn they're sleeping badly and worried about rent. The lower tiers — rest, security — are unmet and dominating; no amount of esteem-level pep talk lands until those are addressed. You help with the base first.",
    personalPrompt: "For the person you're trying to motivate (maybe yourself), is an unmet lower need quietly running the show?",
    pitfalls: ["The neat ladder oversimplifies — needs overlap and reorder for real people; use it as a lens, not a law.", "Assuming someone's at the top of the pyramid when a basic need is unmet leads to advice that misses entirely."]
  },
  "sinus-milieu-bourdieu-model": {
    visualType: "bubble-map",
    universalExample: "You can't understand why a well-funded product flops with a demographic. Mapping people by values and class position rather than income, you see the target group signals belonging through restraint, not display — and your loud premium branding reads as trying too hard. Taste, not budget, was the barrier.",
    personalPrompt: "For the group you're trying to reach, are you reading their values and taste, or just their income bracket?",
    pitfalls: ["Milieu maps can slide into stereotyping — treat them as loose coordinates, not fixed boxes for individuals.", "Your own milieu is invisible to you; you'll misjudge others by assuming your taste is neutral."]
  },
  "double-loop-learning": {
    visualType: "nested-loops",
    universalExample: "Your launches keep slipping. Single-loop learning tweaks the process — more standups, tighter tickets — and it slips again. Double-loop asks the harder question: is the goal itself (ship monthly) even right for a team this size? Questioning the assumption, not just the action, finally breaks the cycle.",
    personalPrompt: "For the mistake you keep repeating, what goal or assumption behind it have you never actually questioned?",
    pitfalls: ["Loop one feels productive, so most people stay there forever — the leverage is in the uncomfortable loop two.", "Questioning every goal all the time is its own paralysis; enter loop two when the same fix keeps failing."]
  },
  "appreciative-inquiry": {
    visualType: "spiral",
    universalExample: "A retro is spiralling into blame about everything that's broken. You flip the question: 'What worked, and how do we get more of it?' The team realises pair-debugging saved the release — a strength invisible under the problem-list. You grow that instead of only patching faults.",
    personalPrompt: "For the thing you've written off as broken, what part is quietly working that you could grow instead?",
    pitfalls: ["Appreciative framing can slide into ignoring real problems — it complements fault-finding, it doesn't replace it.", "Forced positivity feels hollow; the strengths you build on have to be genuine, not manufactured."]
  },
  "pareto-principle": {
    visualType: "split",
    universalExample: "Your support queue feels infinite. Tagging a week of tickets, you find 80% trace to three onboarding confusions. Fixing those three — the vital 20% — empties most of the queue, while chasing every one-off ticket never would have. You find the 20% before touching the rest.",
    personalPrompt: "In the task list that's overwhelming you, which 20% is producing most of the results, and what if you did only that first?",
    pitfalls: ["The 80/20 split is a heuristic, not a measured law — find your actual vital few rather than assuming any 20% will do.", "The neglected 80% isn't always worthless; some of it is quiet, necessary maintenance."]
  },
  "long-tail": {
    visualType: "curve",
    universalExample: "You almost kill a set of niche tutorials because none is a hit. Then you add up the tail: together the fifty small ones out-earn your one popular guide and bring in exactly the users who convert. The tail wasn't leftover — it was a market you'd been undervaluing.",
    personalPrompt: "What niche part of your work are you dismissing as too small, when the aggregate of many small things might be the real opportunity?",
    pitfalls: ["Serving a long tail has real costs (support, maintenance) that can outweigh the aggregated upside — do the sum.", "Not every tail pays; some niches stay niche. The insight is 'check the aggregate', not 'niche always wins'."]
  },
  "conflict-resolution-model": {
    visualType: "matrix-2x2",
    universalExample: "Mid-argument with a cofounder, you name the mode you've each defaulted to: you're avoiding, they're competing. Neither resolves anything. Placing both on the assertiveness-versus-cooperation grid, you see the missing mode — genuine collaboration — and its cost: a longer, more honest conversation you'd both been dodging.",
    personalPrompt: "In your current conflict, which mode are you actually in — competing, avoiding, accommodating, compromising, or collaborating — and what is that mode costing you?",
    pitfalls: ["Every mode has a right moment; collaboration isn't always best and avoiding isn't always weak — match mode to stakes.", "It's easy to name the other person's mode and stay blind to your own; label yours first."]
  },
  "black-swan-model": {
    visualType: "spike",
    universalExample: "Your traffic has grown steadily for a year, so you plan capacity off the trend line. The model warns that rare, extreme events dominate: one feature gets shared by a huge account and traffic 50×'s overnight. You can't predict which spike, so you build for graceful failure rather than betting on the smooth line.",
    personalPrompt: "Where are you extrapolating from a calm past, and what would a single extreme event — good or bad — do to that plan?",
    pitfalls: ["You can't forecast specific black swans; trying to predict them wastes effort better spent on resilience and optionality.", "Hindsight makes every black swan look obvious afterward — resist the story that you 'should have seen it'."]
  },
  "chasm-diffusion-model": {
    visualType: "curve",
    universalExample: "Your tool has passionate early adopters, then growth stalls. The model names the gap: the pragmatic majority buys for different reasons than enthusiasts — they want proof, support, and safety, not novelty. Crossing the chasm means re-pitching to their needs, not shouting louder at the people already sold.",
    personalPrompt: "If your early buzz has gone quiet, are you still selling to enthusiasts when the next group needs a completely different reason to say yes?",
    pitfalls: ["Early-adopter love is misleading feedback — it can convince you the chasm doesn't exist right up until growth flatlines.", "The majority's reasons aren't the enthusiasts' reasons; reusing the same pitch is what kills products in the gap."]
  },
  "black-box-model": {
    visualType: "black-box",
    universalExample: "A machine-learning ranking model works but nobody fully understands its internals. Rather than stall, you steer it by inputs and outputs: change the training signal, watch the ranking shift, keep what improves the metric. You use and control the box without needing to see inside it — because you often can't.",
    personalPrompt: "What system are you refusing to use until you 'understand it fully', when you could instead learn to steer it by inputs and outputs?",
    pitfalls: ["Treating everything as a black box invites nasty surprises — some systems genuinely need to be opened before you trust them.", "Steering by outputs alone can optimise the wrong thing if your success metric is off; watch what you're actually rewarding."]
  },
  "prisoners-dilemma": {
    visualType: "matrix-2x2",
    universalExample: "Two teams could share a tool and both win, but each fears the other will hoard credit, so both build their own — the worse outcome for everyone. Seeing the payoff matrix, and that you'll work together again next quarter, you move first to cooperate and make the repeated game reward trust.",
    personalPrompt: "Where are you defending yourself in a way that quietly guarantees a worse outcome for everyone, including you?",
    pitfalls: ["Cooperating blindly with a genuine defector just gets you exploited — trust is rational in repeated games, not one-shot ones.", "The matrix assumes you've read the real payoffs; misjudge them and 'cooperate' can be naive."]
  },
  "team-model": {
    visualType: "grid",
    universalExample: "Before committing to a deadline, you map each member's skills against what the project actually demands. Two people overlap heavily on frontend while nobody owns testing — a gap that would've surfaced as a crisis in week three. You reassign or hire for the gap before it bites.",
    personalPrompt: "For the task ahead of your team, where's the gap between what it demands and the skills you actually have on the bench?",
    pitfalls: ["Rating skills is subjective and egos are involved — get honest input, ideally self-and-peer, not one manager's guess.", "A perfect skills map still fails if you ignore how the people actually work together; capability isn't chemistry."]
  },
  "hersey-blanchard": {
    visualType: "matrix-2x2",
    universalExample: "A new hire is eager but green, so you direct closely; a senior engineer is skilled and committed, so you delegate and get out of the way. Micromanaging the senior would insult them; delegating to the newcomer would sink them. You match the style to each person's competence and commitment.",
    personalPrompt: "For the person you're leading, does your current hands-on level match their competence and commitment, or are you directing where you should delegate?",
    pitfalls: ["Competence is task-specific — the same person may need directing on one thing and delegation on another; don't fix a single style to a person.", "Reading someone's commitment wrong flips the whole prescription; check before you choose the style."]
  },
  "role-playing-model": {
    visualType: "role-wheel",
    universalExample: "A meeting keeps going in circles because everyone argues facts and feelings and risks all at once. You assign thinking modes for ten minutes each — first only facts, then only optimism, then only risks — and the tangle unknots. Separating the modes lets the group think one thing at a time.",
    personalPrompt: "In your stuck meeting, which single thinking mode is everyone skipping — the hard facts, the risks, or the bold possibilities?",
    pitfalls: ["Assigned roles feel artificial at first and people resist — the facilitator has to hold the structure or it collapses into the usual free-for-all.", "Boxing a person permanently into one role (the 'critic') wastes their range; rotate the hats."]
  },
  "result-optimisation-model": {
    visualType: "spiral",
    universalExample: "With a week to a launch, you resist polishing the landing page and instead get the whole product rough-but-working end to end, then refine in passes. When time runs out, everything is presentable rather than one perfect corner beside three unfinished ones.",
    personalPrompt: "Where are you polishing one corner while the rest of the canvas is still blank, and what would a rough whole-first pass look like?",
    pitfalls: ["'Iterate' can become an excuse to never finish; each pass needs a clear bar for 'good enough for now'.", "Some work genuinely needs deep craft up front; not everything benefits from a rough-first sweep."]
  },
  "project-management-triangle": {
    visualType: "triangle",
    universalExample: "A client wants the redesign fast, cheap, and excellent. You put the triangle on the table: pick two. They choose fast and good, so the budget flexes. Naming the trade-off openly prevents the silent version where everyone assumes all three and the project quietly breaks.",
    personalPrompt: "On your current project, which two of fast, cheap, and good are you actually choosing — and are you pretending you can have all three?",
    pitfalls: ["The triangle is a simplification — scope, quality, and morale flex too — but its core truth (you can't max everything) holds.", "Refusing to choose two doesn't escape the trade-off; it just makes the third corner fail without warning."]
  },
  "drexler-sibbet-team-performance": {
    visualType: "stage-curve",
    universalExample: "A new team is tense and slow, and you're tempted to read it as a bad hire. The model says early friction is a stage — orientation and trust-building — not a verdict. You name the stage aloud, invest in clarity of purpose, and the team moves through it instead of fracturing.",
    personalPrompt: "For your team's current friction, which stage is it — and are you fixing the stage it's actually in, or the one you wish it were in?",
    pitfalls: ["Stages aren't strictly linear; teams loop back, especially when membership changes — don't treat a slip as failure.", "Naming a stage isn't the fix; each stage needs a different intervention, so diagnose before you act."],
    steps: [
      "Orientation — why are we here?",
      "Trust building — who are you?",
      "Goal clarification — what are we doing?",
      "Commitment — how will we do it?",
      "Implementation — who does what, when, where?",
      "High performance — the team hits its stride.",
      "Renewal — why continue, and what changes next?"
    ]
  },
  "expectations-model": {
    visualType: "gap-bars",
    universalExample: "A client is unhappy though you delivered solid work. Mapping expected against delivered, you find they'd pictured weekly updates you never promised. The disappointment lived in the gap, not the work. Next time you set the expectation explicitly up front — and the same delivery lands as a win.",
    personalPrompt: "For the person who's disappointed in you, is the gap in what you delivered, or in an expectation you never actually set?",
    pitfalls: ["Managing expectations can tip into under-promising so hard you look timid — calibrate, don't just sandbag.", "Expectations are often unspoken; you have to surface them early or you'll manage the wrong gap."]
  },
  "future-of-decisions-model": {
    visualType: "triage",
    universalExample: "Reviewing your week, you sort recurring decisions into keep, automate, delegate: choosing what to write stays with you (keep), sending invoices becomes a rule (automate), scheduling goes to an assistant (delegate). Deciding deliberately which machine or person handles which call frees your judgement for the ones that need it.",
    personalPrompt: "Of the decisions you make on repeat, which should you keep, which could you automate, and which could you delegate?",
    pitfalls: ["Automating or delegating a decision you don't understand yet just hides a problem — keep it until you can specify it well.", "Convenience tempts you to hand off judgement calls that are actually the ones only you should make."]
  },
  "second-order-thinking": {
    visualType: "concentric",
    universalExample: "Cutting prices looks obviously good — more signups this month. Asking 'and then what?', you trace it: competitors match, your margin thins, and the cheap tier attracts users who churn fast and strain support. The first-order win becomes a second-order trap, so you find a better lever.",
    personalPrompt: "For the move that looks obviously good, what's the consequence of the consequence you haven't traced yet?",
    pitfalls: ["You can chase ripples forever — go far enough to change the decision, then act; endless second-guessing is its own failure.", "First-order thinking is fast and often right; reserve deep tracing for choices that are hard to reverse."]
  },
  "inversion": {
    visualType: "mirror",
    universalExample: "Struggling to plan a successful onboarding, you flip it: what would guarantee new users bail? A long form, no first win, jargon, silence after signup. Listing the ways to fail hands you the checklist — remove exactly those — that thinking forward never produced.",
    personalPrompt: "For the goal you're chasing, what would reliably guarantee failure — and are you accidentally doing any of it?",
    pitfalls: ["Avoiding failure isn't the same as achieving greatness — inversion prevents disasters but won't design the win on its own.", "The list of failure modes can get long; focus on the few you're actually at risk of committing."]
  },
  "pre-mortem": {
    visualType: "timeline",
    universalExample: "Before launch, the team pretends it's six months later and the project failed. Everyone writes why: the API rate limits bit us, marketing wasn't ready, the demo broke on mobile. Surfacing those causes now — while it's still cheap — turns a confident plan into a de-risked one.",
    personalPrompt: "Imagine your current project has already failed — what's the most likely story of why, and what can you fix today?",
    pitfalls: ["A plan that feels too solid is exactly the one that hides its risks — the smoother it looks, the more you need this.", "Pre-mortems can list every conceivable disaster; prioritise the failures that are both likely and fixable now."]
  },
  "regret-minimization": {
    visualType: "timeline",
    universalExample: "Torn about leaving a comfortable job to build something of your own, you project to age eighty and ask which you'd regret more: trying and failing, or never trying. The old-self view makes the daily fears shrink and the not-trying regret loom — and the choice clarifies.",
    personalPrompt: "At eighty, looking back, which version of this choice would you regret NOT having taken?",
    pitfalls: ["Regret minimisation biases toward bold action, which isn't always wise — pair it with a real check on downside and reversibility.", "Your imagined eighty-year-old is a guess; don't let a romantic future-self talk you past genuine present-day constraints."]
  },
  "ooda-loop": {
    visualType: "cycle",
    universalExample: "A competitor ships a feature that reframes your market overnight. Instead of clinging to the roadmap, you run the loop fast: observe the shift, reorient your assumptions, decide on a focused response, act — then loop again as their next move lands. Whoever orients faster stays ahead.",
    personalPrompt: "In the fast-changing situation you're in, is your plan updating as fast as reality, or are you acting on last week's orientation?",
    pitfalls: ["Orientation is the crux and the easiest step to skip — acting on stale assumptions just loops you faster into the wrong place.", "Speed without direction is thrashing; loop fast, but make sure each Orient step actually incorporates new information."],
    steps: [
      "Observe — take in what's actually happening now.",
      "Orient — update your mental model with the new information.",
      "Decide — choose a response from your updated picture.",
      "Act — commit, then loop back to observe the result."
    ]
  },
  "10-10-10": {
    visualType: "timeline",
    universalExample: "Furious at a curt email, you're about to fire back. You run 10/10/10: in ten minutes you'd feel briefly vindicated; in ten months the relationship would be colder; in ten years it wouldn't matter but the pattern would. The three horizons cool the heat and you reply calmly.",
    personalPrompt: "For the emotionally charged choice in front of you, how will you feel about it in ten minutes, ten months, and ten years?",
    pitfalls: ["The tool defuses heat-of-the-moment reactions but can also over-rationalise a decision that genuinely needs feeling — use judgement.", "Guessing the ten-year horizon is speculative; weight the nearer horizons you can actually foresee."]
  },
  "circle-of-competence": {
    visualType: "concentric",
    universalExample: "Offered a chance to invest in a biotech startup, you map your circle honestly: you understand software economics deeply, biology not at all. Inside the circle you'd trust your own judgement; here you're outside it, so you either pass or bring in someone who genuinely knows the field.",
    personalPrompt: "For the call you're about to make, are you inside the circle of what you truly understand — and if not, whose competence will you borrow?",
    pitfalls: ["The dangerous zone is the edge, where you know just enough to feel confident and not enough to be right.", "Circles can grow with real study — 'outside my circle' is a reason to learn or get help, not always to quit."]
  },
  "sunk-cost-fallacy": {
    visualType: "anchor",
    universalExample: "You've spent three months on a feature nobody's using and catch yourself thinking 'but I've already put so much in.' That sentence is the alarm. The three months are gone either way; the only real question is whether the next month is worth it. It isn't, so you cut it.",
    personalPrompt: "Where are you continuing something mainly because of what you've already spent, when the future costs no longer justify it?",
    pitfalls: ["The past investment feels like a reason to continue precisely because walking away makes it feel wasted — but it's already gone.", "The opposite error exists too: quitting the moment things get hard and calling it 'avoiding sunk cost'. Judge future value honestly, both ways."]
  },
  "confirmation-bias": {
    visualType: "funnel",
    universalExample: "Convinced your new feature is a hit, you scan the analytics and feel satisfied — the numbers you looked at agree with you. That satisfaction is the cue. You deliberately hunt one disconfirming fact: the retention cohort, which you'd skipped. It tells a harder, truer story.",
    personalPrompt: "On the belief you're most comfortable with, what's one disconfirming fact you could actively go looking for before you decide?",
    pitfalls: ["The feeling of being confirmed is pleasant, which is exactly why the bias is hard to notice from inside.", "Hunting for disconfirmation half-heartedly doesn't count; you have to genuinely try to prove yourself wrong."]
  },
  "loss-aversion": {
    visualType: "tension",
    universalExample: "You cling to a failing project because shutting it down feels like a loss, while the equivalent gain — time freed for something better — barely registers. Knowing losses hurt about twice as much as equal gains feel good, you reframe: keeping it is the real loss. That flips the decision.",
    personalPrompt: "Where is the fear of a loss looming twice as large as an equal gain — and what does the choice look like if you reframe it as gains forgone?",
    pitfalls: ["Reframing gains and losses can be gamed by whoever sets the frame — including you talking yourself into a bad call.", "Loss aversion sometimes protects you (real losses hurt); the goal is proportion, not ignoring downside entirely."]
  },
  "planning-fallacy": {
    visualType: "gantt",
    universalExample: "You estimate the migration will take a week — it always feels like it'll be different this time. Your last three migrations took three weeks each. You use that track record instead of your optimism, and ask a colleague who guesses four weeks; you meet in the middle at three, and for once you're on time.",
    personalPrompt: "For your current estimate, what does your own track record on similar work say, and what would an outside observer guess?",
    pitfalls: ["'This time is different' is the fallacy's signature line — your reasons for optimism are usually the same ones that failed last time.", "Outside observers over-correct pessimistically; the honest number is often between your guess and theirs, not either extreme."]
  },
  "anchoring": {
    visualType: "spectrum",
    universalExample: "A vendor opens at $50k and suddenly $35k feels like a bargain — but the first number is dragging your whole sense of the range. You catch it, and recall your own pre-negotiation estimate of $20k, made before you heard their figure. You negotiate from your anchor, not theirs.",
    personalPrompt: "What first number are you unconsciously negotiating around, and what would you have estimated before you ever heard it?",
    pitfalls: ["Anchors work even when you know about them — awareness helps a little, but forming your own estimate first helps far more.", "You can anchor yourself with your own first guess; hold early estimates loosely as new information arrives."]
  },
  "hindsight-bias": {
    visualType: "timeline",
    universalExample: "A launch flops and everyone now says they 'knew it all along.' You check your own notes from before — you were optimistic. The outcome quietly rewrote the memory. Because you'd journaled the reasoning beforehand, you learn the real lesson instead of a flattering fake one.",
    personalPrompt: "Before your next outcome lands, where will you write down your actual reasoning so hindsight can't rewrite it?",
    pitfalls: ["The edited memory feels completely genuine — you truly believe you knew, which is why only a written record can correct it.", "Hindsight bias also makes others' failures look obvious and blameworthy; extend the same doubt to their foresight as to your own."]
  },
  "implementation-intentions": {
    visualType: "flow",
    universalExample: "You keep meaning to write but never start. You set an if-then: 'If it's 9am and I've finished coffee, then I open the draft and write one sentence.' The cue does the starting, not your willpower. Within a week the habit runs on the trigger, not on daily negotiation.",
    personalPrompt: "For the intention you keep failing to act on, what's the specific if-this-then-that that would hand the starting over to a cue?",
    pitfalls: ["Vague triggers ('when I have time') don't fire — the cue has to be concrete and unavoidable, tied to something that already happens.", "One built-in escape hatch ('unless I'm tired') quietly cancels the whole plan; keep the then-action tiny and non-negotiable."],
    steps: [
      "Name the cue — a specific, already-recurring moment.",
      "Name one concrete action — small enough to do immediately.",
      "Wire them: 'If [cue], then [action].'"
    ]
  },
  "deep-work": {
    visualType: "gantt",
    universalExample: "Your day dissolves into Slack, meetings, and half-finished tickets, and the hard architecture problem never gets touched. You block two protected hours each morning — phone in another room, notifications off — for exactly that problem. Rare, undistracted focus produces more in two hours than the scattered day did in eight.",
    personalPrompt: "What single cognitively demanding task deserves a protected, distraction-free block this week, and when will you schedule it?",
    pitfalls: ["Deep work is valuable because it's rare — the whole world is engineered to interrupt it, so the block has to be defended deliberately.", "Not all work is deep work; trying to make everything a focus block ignores the shallow tasks that also genuinely need doing."]
  },
  "environment-design": {
    visualType: "sliders",
    universalExample: "Willpower keeps losing to your phone. Instead of resolving harder, you change the room: phone charges in the kitchen, the writing app opens on launch, the fridge snacks move to a high shelf. Adding friction to distractions and removing it from the goal, the good choice becomes the easy one.",
    personalPrompt: "For the habit you keep losing to, what one piece of friction could you add to the distraction or remove from the goal?",
    pitfalls: ["Designing the environment once isn't enough — distractions creep back in, so the setup needs occasional maintenance.", "You can over-engineer your surroundings into a fragile system; a couple of high-leverage friction changes beat twenty fiddly ones."]
  },
  "ulysses-pact": {
    visualType: "constraint",
    universalExample: "You know you'll cave and check email during focus time, so while calm you bind your future self: a website blocker with a password a friend holds, running until noon. The constraint is set while you're rational, matched to the exact temptation — with a sane override for a real emergency.",
    personalPrompt: "For the moment you know you'll cave, what binding could you set now, while you're clear-headed, that your weaker future self can't easily undo?",
    pitfalls: ["A generic constraint misses the specific temptation — match the lock to the exact thing you'll want to do.", "Absolute rigidity backfires when life genuinely changes; build in a deliberate, costly-but-possible emergency exit."]
  },
  "daily-highlight": {
    visualType: "spotlight",
    universalExample: "You end busy days having done everything except the thing that mattered. Each morning you name one highlight — 'ship the export fix' — and refuse to touch anything else until it's done. The single spotlight means at least one real thing gets finished, every day, instead of fifty half-things.",
    personalPrompt: "If today allowed only one thing to be truly finished, what would your single highlight be?",
    pitfalls: ["Picking a highlight that's too big can't be finished in a day, so nothing gets the closure that makes the method work — size it right.", "Real emergencies will sometimes trump the highlight; the discipline is protecting it by default, not pretending nothing else exists."]
  },
  "wrap": {
    visualType: "flow",
    universalExample: "Facing a narrow 'should I take this job or not?', you run WRAP: Widen to 'what are all my options?', Reality-test by talking to people who left that company, Attain distance with the ten-year view, and Prepare to be wrong by setting a tripwire to reassess in six months. The narrow yes/no becomes a real decision.",
    personalPrompt: "For your current big decision, which of the four — widening, reality-testing, distance, or preparing to be wrong — have you skipped entirely?",
    pitfalls: ["A whether-or-not framing ('should I do X?') is the warning sign of a too-narrow frame — widen before you evaluate.", "It's tempting to reality-test by asking people who'll agree with you; seek the disconfirming evidence instead."],
    steps: [
      "Widen your options — escape a yes/no frame; ask what else you could do.",
      "Reality-test your assumptions — seek disconfirming evidence, run a small trial.",
      "Attain distance before deciding — use the 10/10/10 or advise-a-friend view.",
      "Prepare to be wrong — set tripwires and bookend expectations."
    ]
  },
  "decision-journal": {
    visualType: "journal",
    universalExample: "Before a big call, you write it down: the situation, the options you rejected, the outcome you expect and how confident you are (70%), and your state of mind (rushed, a bit anxious). Months later you review it and learn whether it was a good decision or just good luck — something memory alone could never tell you.",
    personalPrompt: "For the decision you're about to make, what will you record now — options rejected, expected outcome, confidence, your state of mind — so you can review it honestly later?",
    pitfalls: ["A journal only pays off if you actually revisit entries after the outcome; without the review, it's just writing.", "Recording your emotional state feels awkward but it's often the most useful field — don't skip it to look composed."]
  },
  "weighted-scoring": {
    visualType: "grid",
    universalExample: "Choosing between three frameworks for a rebuild, you list criteria — team familiarity, performance, ecosystem — weight them by importance, score each option, and multiply. One option wins on paper. You sanity-check it against your gut, notice the weights undervalued hiring, adjust, and decide with eyes open.",
    personalPrompt: "For the options you're comparing, what are the real criteria, how would you weight them honestly, and does the winner survive a gut check?",
    pitfalls: ["Weights and scores can be quietly tuned until the answer you already wanted 'wins' — set the weights before you score.", "A tidy number can override a valid gut signal; the model informs the decision, it doesn't replace judgement."]
  },
  "cynefin": {
    visualType: "triage",
    universalExample: "A production incident hits and you almost reach for the usual runbook. First you classify: this is complex, not merely complicated — no expert already knows the answer. So instead of best-practice, you probe with a small safe change, sense the result, and respond. Naming the domain picks the right method.",
    personalPrompt: "What KIND of problem are you actually facing — obvious, complicated, complex, or chaotic — and are you using the method that domain calls for?",
    pitfalls: ["Misclassifying a complex problem as merely complicated makes you apply best-practice where none exists — and it fails.", "The most dangerous move is assuming the obvious domain; complacency there is how ordered problems slide into chaos."],
    steps: [
      "Obvious — the cause is clear; apply the known best practice.",
      "Complicated — experts and analysis can find the good answer.",
      "Complex — no answer exists yet; probe, sense, then respond.",
      "Chaotic — act first to stabilise, then sense and respond."
    ]
  }
};

// ---- Build ----
const parsed = extractResearch();
if (parsed.length !== IDS.length) throw new Error(`parsed ${parsed.length} != ids ${IDS.length}`);

const frameworks = parsed.map((row, i) => {
  const id = IDS[i];
  const a = AUTHORED[id];
  if (!a) throw new Error("No authored fields for " + id);
  const name = NAME_OVERRIDES[i + 1] || row.name;
  const fw = {
    id,
    name,
    category: row.category,
    trigger: row.trigger,
    essence: row.essence,
    visualType: a.visualType,
    universalExample: a.universalExample,
    personalPrompt: a.personalPrompt,
    pitfalls: a.pitfalls
  };
  if (a.steps) fw.steps = a.steps;
  return fw;
});

// Derive VISUAL_TYPES from actually-used values (stable order = first appearance).
const VISUAL_TYPES = [];
frameworks.forEach((f) => { if (!VISUAL_TYPES.includes(f.visualType)) VISUAL_TYPES.push(f.visualType); });

const categories = [
  { id: "improve-yourself", label: "Improve Yourself", group: "quadrant" },
  { id: "understand-yourself", label: "Understand Yourself", group: "quadrant" },
  { id: "understand-others", label: "Understand Others", group: "quadrant" },
  { id: "improve-others", label: "Improve Others", group: "quadrant" },
  { id: "mental-models", label: "Mental Models", group: "extension" },
  { id: "cognitive-biases", label: "Cognitive Biases", group: "extension" },
  { id: "attention", label: "Attention & Focus", group: "extension" },
  { id: "decision-processes", label: "Decision Processes", group: "extension" }
];

// Human labels for each visual form (used by the card's <figcaption>).
const VISUAL_LABELS = {
  "matrix-2x2": "Two-by-two matrix",
  "scatter-plot": "Scatter plot on two axes",
  "timeline": "Timeline",
  "flow": "Step-by-step flow",
  "tension": "Opposing-forces balance",
  "curve": "Plotted curve",
  "grid": "Criteria grid",
  "nine-dot": "Nine-dot puzzle",
  "tree": "Branching consequences tree",
  "split": "Two-part split",
  "spectrum": "Marked spectrum",
  "radar": "Radar / spider chart",
  "venn": "Overlapping circles",
  "pyramid": "Layered pyramid",
  "layers": "Stacked defensive layers",
  "bubble-map": "Clustered bubble map",
  "crossroads": "Crossroads of paths",
  "nested-loops": "Nested learning loops",
  "spiral": "Growing spiral",
  "spike": "Flat line with a rare spike",
  "black-box": "Input to black box to output",
  "cycle": "Four-node cycle",
  "concentric": "Concentric circles",
  "mirror": "Mirrored inversion",
  "funnel": "Filtering funnel",
  "gantt": "Time-blocked bars",
  "triangle": "Constraint triangle",
  "role-wheel": "Role wheel",
  "stage-curve": "Multi-stage progression",
  "gap-bars": "Expected-versus-actual bars",
  "triage": "Three-bucket triage",
  "sliders": "Friction sliders",
  "constraint": "Binding constraint",
  "spotlight": "Single-item spotlight",
  "journal": "Journal template",
  "distortion-lens": "Distortion lens",
  "anchor": "Sinking anchor"
};
// Guard: every used visualType has a label.
VISUAL_TYPES.forEach((v) => { if (!VISUAL_LABELS[v]) throw new Error("No label for visualType " + v); });

const banner = `/* ==========================================================================
   Pocket Decision Book — content data module (Sprint 002)  [GENERATED]
   Source of truth: scripts/build-data.mjs + .planning/RESEARCH.md.
   Regenerate with: node scripts/build-data.mjs   — do not hand-edit this file.
   trigger/essence are byte-exact copies of RESEARCH.md cells (B2).
   universalExample/personalPrompt/pitfalls/steps are original Generator authoring (B3).
   Plain script: attaches PDB_DATA to window (no bundler, no network fetch).
   ========================================================================== */`;

const payload = { frameworks, categories, VISUAL_TYPES, VISUAL_LABELS };
const body = `(function (root) {
  "use strict";
  var PDB_DATA = ${JSON.stringify(payload, null, 2)};
  PDB_DATA.byId = function (id) {
    for (var i = 0; i < PDB_DATA.frameworks.length; i++) {
      if (PDB_DATA.frameworks[i].id === id) return PDB_DATA.frameworks[i];
    }
    return null;
  };
  PDB_DATA.categoryById = function (id) {
    for (var i = 0; i < PDB_DATA.categories.length; i++) {
      if (PDB_DATA.categories[i].id === id) return PDB_DATA.categories[i];
    }
    return null;
  };
  root.PDB_DATA = PDB_DATA;
})(typeof window !== "undefined" ? window : this);
`;

writeFileSync(OUT, banner + "\n" + body);
console.error(`Wrote ${OUT}: ${frameworks.length} frameworks, ${VISUAL_TYPES.length} visual types.`);
console.error("Visual types: " + VISUAL_TYPES.join(", "));

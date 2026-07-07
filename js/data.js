/* ==========================================================================
   Pocket Decision Book — content data module (Sprint 002)  [GENERATED]
   Source of truth: scripts/build-data.mjs + .planning/RESEARCH.md.
   Regenerate with: node scripts/build-data.mjs   — do not hand-edit this file.
   trigger/essence are byte-exact copies of RESEARCH.md cells (B2).
   examples/personalPrompt/pitfalls/steps are original Generator authoring (B3).
   Plain script: attaches PDB_DATA to window (no bundler, no network fetch).
   ========================================================================== */
(function (root) {
  "use strict";
  var PDB_DATA = {
  "frameworks": [
    {
      "id": "eisenhower-matrix",
      "name": "Eisenhower Matrix",
      "category": "improve-yourself",
      "trigger": "\"Everything feels urgent\"",
      "essence": "Sort tasks by important vs urgent; schedule the important-not-urgent before it becomes urgent. Quadrant actions: do now / schedule / delegate / drop",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You run a 4-table cafe. Three customers wave for refills while your landlord wants the ₹40,000 rent decision by Friday. The matrix flags the rent reply as important-not-urgent, so you answer the landlord first — where before you'd have chased the loudest table.",
          "tradeoff": "You let a waiting customer cool for ten minutes to protect the lease; the cost is a smaller tip tonight weighed against a signed roof for the year."
        },
        {
          "persona": "student",
          "scenario": "It's exam term. Friends are pinging about tonight's party while a 6-week project worth 40% of the grade sits untouched. The grid drops the party and schedules the project for Saturday, so you stop answering whichever phone buzzes loudest.",
          "tradeoff": "You give up the party and some social standing this week; the risk is real FOMO now traded for a grade that outlives the night."
        },
        {
          "persona": "relationship",
          "scenario": "Your group chats never stop, but your father's cardiology appointment has gone unbooked for 3 weeks. You sort them: the chats are urgent-not-important, the appointment important-not-urgent, so you book it before replying to anyone.",
          "tradeoff": "You leave friends on read and risk looking distant; the price is a little social friction paid to catch a health problem early."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're a senior engineer who can close any ticket fast, so you clear 20 urgent bugs a day and feel productive. The matrix exposes that the architecture rewrite — important, never urgent — has slipped 6 months because your own speed keeps feeding you quick wins.",
          "tradeoff": "Choosing the rewrite means your visible ticket count drops and a manager who rewards output notices; you trade short-term applause for the thing that compounds."
        },
        {
          "persona": "privileged",
          "scenario": "Money is no object; your calendar is the scarce thing. Your foundation's staff bring 30 'urgent' asks a week while the succession plan for who runs it after you keeps slipping. The grid protects one quarterly day for succession.",
          "tradeoff": "You disappoint people used to instant access and may look disengaged; the cost is present-day goodwill spent to secure the institution's future."
        }
      ],
      "featured": 0,
      "personalPrompt": "Which task have you been treating as urgent all week that is actually only important, and when will you block time for it before it catches fire?",
      "pitfalls": [
        "Almost everything can be argued into 'urgent' — be honest about deadlines that are real versus deadlines that are anxiety.",
        "The important-not-urgent box is where growth lives and where nothing screams at you, so it silently gets skipped."
      ]
    },
    {
      "id": "swot-analysis",
      "name": "SWOT Analysis",
      "category": "improve-yourself",
      "trigger": "\"Is this plan any good?\"",
      "essence": "Map strengths, weaknesses, opportunities, threats before committing",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You're about to sign a 2-year lease on a bigger salon. SWOT: strength — loyal regulars; weakness — no cash cushion; opportunity — the mall footfall; threat — a chain opening 200m away next month. The threat box makes you demand a 6-month break clause first.",
          "tradeoff": "Insisting on the break clause risks the landlord walking to a faster tenant; you pay a higher rent to keep an exit."
        },
        {
          "persona": "student",
          "scenario": "Before picking a final-year specialisation you fill the boxes: strength — you code fast; weakness — you freeze in vivas; opportunity — an AI module everyone's hiring for; threat — it's graded 70% on a live oral. The threat cell steers you to a project-graded track.",
          "tradeoff": "You give up the fashionable AI label on your CV; the cost is a less hyped specialisation chosen to match how you actually perform."
        },
        {
          "persona": "relationship",
          "scenario": "You're weighing moving in with your partner. Strength — you rarely fight; weakness — you've never split a bill; opportunity — halved rent; threat — their ex still lives one floor up. Naming the threat turns a romantic yes into an honest conversation first.",
          "tradeoff": "Raising the ex out loud risks a tense evening; you trade a smooth week now for a problem surfaced before a joint lease binds you."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're a star consultant sure a solo practice will fly. SWOT forces the weakness box you keep skipping: in 8 years you've only ever delivered, never sold. The one cell your confidence hid reshapes month one into learning to pitch.",
          "tradeoff": "Admitting the sales gap delays your launch by a quarter; you sacrifice momentum to fix the hole that sinks most experts who go alone."
        },
        {
          "persona": "privileged",
          "scenario": "You can fund any venture, so you nearly greenlight a ₹2-crore vanity magazine. SWOT's threat box asks what money won't fix: your name on a failing title. The reputational threat, not the budget, makes you back it quietly instead of front it.",
          "tradeoff": "Staying behind the scenes costs you the public credit you'd enjoy; you trade visible glory for a name that survives a flop."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the plan you're about to commit to, what is the one threat you've been quietly hoping won't matter?",
      "pitfalls": [
        "It's easy to fill boxes with vague words ('great team', 'market risk') that don't change any decision — force each cell to name something specific.",
        "A SWOT describes; it doesn't decide. Follow it with an action or it's just a tidy wall."
      ]
    },
    {
      "id": "bcg-box",
      "name": "BCG Box",
      "category": "improve-yourself",
      "trigger": "\"Where should my effort go?\"",
      "essence": "Rate each project by growth potential vs current payoff: stars, cash cows, question marks, dogs",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You juggle 5 income streams after your day job. The tuition classes are a cash cow (steady, flat), the Etsy shop a question mark (growing, tiny), two old gigs are dogs. You give the shop one real month instead of dribbling 30 minutes across all five.",
          "tradeoff": "Betting the month on the shop may leave it tiny while the guaranteed ₹8,000 of tuition cash goes unbanked; you risk a sure thing chasing a maybe."
        },
        {
          "persona": "student",
          "scenario": "You run 4 clubs to pad your CV. The debate society is a star, the coding club a question mark, two are dogs eating your Tuesday nights. You resign the dogs to give the coding club a full term to grow.",
          "tradeoff": "Quitting two clubs shrinks your CV's length and one friend group; you lose breadth to buy depth in the one place that can become a star."
        },
        {
          "persona": "relationship",
          "scenario": "You spread thin across 6 friendships. Seen as a portfolio, two are stars (mutual, deep), one a question mark worth investing in, three are dogs you keep out of guilt. You let the dogs fade to give the question-mark friend real time.",
          "tradeoff": "Letting old friends drift feels like a small betrayal; you pay in guilt to stop starving the friendships that actually feed you."
        },
        {
          "persona": "high-achiever",
          "scenario": "You lead 5 workstreams and each feels essential because you're good at all of them. The box says the analytics revamp is a dog — high effort, dead market. Your competence disguised it. You kill it and pour that week into the star.",
          "tradeoff": "Killing your own competent work stings and a peer may inherit it and shine; you trade ego for the one project that actually grows."
        },
        {
          "persona": "privileged",
          "scenario": "Your family office holds 9 legacy holdings. The vineyard is a beloved dog — draining, flat, sentimental. Plotting it honestly against the fund's stars forces the question your money let you dodge for a decade.",
          "tradeoff": "Selling the vineyard severs a family story and invites relatives' anger; you sacrifice heritage sentiment to stop a slow, quiet bleed."
        }
      ],
      "featured": 0,
      "personalPrompt": "Which project, commitment, or even relationship is a 'dog' you keep feeding out of habit, and what would you do with that time instead?",
      "pitfalls": [
        "Labelling something a dog can feel like admitting failure, so people keep low-value work alive to avoid the sting.",
        "Today's question mark can become tomorrow's star or dog — re-plot periodically, don't treat one snapshot as permanent."
      ]
    },
    {
      "id": "project-portfolio-matrix",
      "name": "Project Portfolio Matrix",
      "category": "improve-yourself",
      "trigger": "\"Too many projects at once\"",
      "essence": "Plot all projects by cost/time vs strategic value; kill the expensive-low-value ones",
      "visualType": "scatter-plot",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "As a shift-manager you plot your recurring duties by hours-eaten against value. The hand-written weekly stock report eats 3 hours and moves nothing. Seen as a dot, not a duty, it's easy to switch to a 20-minute photo log.",
          "tradeoff": "Dropping the detailed report risks missing a slow discrepancy; you trade some visibility for 2.5 hours back every week."
        },
        {
          "persona": "student",
          "scenario": "You map your study activities by time versus grade-impact. Re-copying notes into three colours eats 4 hours a week for near-zero marks. Plotting it kills the ritual and frees the time for past-papers.",
          "tradeoff": "Ditching the pretty notes loses the calm the ritual gave you; you pay in comfort for hours aimed at what's actually examined."
        },
        {
          "persona": "relationship",
          "scenario": "You plot how your weekends go by effort against closeness gained. Hosting a big monthly dinner costs a whole Saturday and leaves everyone tired, not closer. As a dot it's obviously cuttable in favour of one real walk with a friend.",
          "tradeoff": "Cancelling the dinner disappoints the wider circle who expect it; you give up being the reliable host to protect real connection."
        },
        {
          "persona": "high-achiever",
          "scenario": "You run 12 initiatives and pride says all are strategic. Plotted, a slick internal dashboard you built sits top-left: expensive, low value. Your skill made it fun, not important. Two days a week reclaimed.",
          "tradeoff": "Shelving your own polished tool means admitting the effort was misspent; you trade sunk pride for the two days the roadmap needs."
        },
        {
          "persona": "privileged",
          "scenario": "Your calendar, not cash, is scarce. You plot your board seats by hours against genuine influence. Three prestigious but powerless charity boards eat 40 hours a quarter. As dots, they're obvious to resign.",
          "tradeoff": "Leaving the marquee boards costs you visible status and some gala invitations; you trade prestige for hours spent where you actually move things."
        }
      ],
      "featured": 0,
      "personalPrompt": "Which expensive-but-low-value project or commitment would you feel relief to stop, and what is stopping you from stopping it?",
      "pitfalls": [
        "Sunk effort makes the costly-low-value corner feel too painful to cut — judge future value, not past investment.",
        "Strategic value is easy to inflate for pet projects; get a second opinion on the vertical axis."
      ]
    },
    {
      "id": "feedback-analysis-drucker",
      "name": "Feedback Analysis (Drucker)",
      "category": "improve-yourself",
      "trigger": "\"Am I actually good at this?\"",
      "essence": "Write down expected outcomes at decision time; compare with reality months later to find your real strengths",
      "visualType": "timeline",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Before starting a food stall you write: 'I expect 50 customers a day by month two.' Two months on you get 20 customers who each spend double your guess. Prediction versus reality teaches your edge is premium, not volume — so you raise prices instead of chasing footfall.",
          "tradeoff": "Committing the prediction to paper risks being proven wrong in your own hand; you trade the comfort of a flexible memory for a lesson you can't fudge."
        },
        {
          "persona": "student",
          "scenario": "Before a semester you write 'group projects will be my strength.' Grades come back: your solo essays scored 15 points higher. The record contradicts your self-story, so you pick a dissertation over a group capstone next year.",
          "tradeoff": "Believing the data over your self-image costs you the identity of a 'team player'; you give up a flattering label for a truer one."
        },
        {
          "persona": "relationship",
          "scenario": "Before a friend's wedding you predict 'I'll be fine seeing my ex there.' The evening proves you spiralled by 9pm. Because you wrote the prediction first, you can't rewrite it as 'I always knew it'd be hard,' and you plan an early exit next time.",
          "tradeoff": "Facing that you misjudged your own resilience stings; you pay in a bruised self-image to plan honestly for the next encounter."
        },
        {
          "persona": "high-achiever",
          "scenario": "Sure your genius is strategy, you predict your new venture wins on vision. A year of notes shows every win came from your dull operational fixes. The written record dethrones your favourite self-story, and you lean into ops.",
          "tradeoff": "Accepting that your strength is unglamorous costs your ego its preferred title; you trade the 'visionary' badge for the skill that actually pays."
        },
        {
          "persona": "privileged",
          "scenario": "You fund 3 initiatives and assume your judgement is why one soars. Comparing your written predictions, you'd rated the two failures higher. Only the record shows your instinct is average — so you hire a real analyst instead of trusting the gut money let you never test.",
          "tradeoff": "Admitting your judgement is ordinary punctures the myth wealth built around you; you give up a flattering story to make better bets."
        }
      ],
      "featured": 0,
      "personalPrompt": "What outcome are you predicting for your current bet, and where will you write it down so your future self can't rewrite the memory?",
      "pitfalls": [
        "Without a written prediction, hindsight quietly edits what you 'always knew' — the record is the whole point.",
        "It only pays off if you actually return to compare months later; schedule the review now."
      ]
    },
    {
      "id": "john-whitmore-grow",
      "name": "John Whitmore Model (GROW)",
      "category": "improve-yourself",
      "trigger": "\"Vague goal, no plan\"",
      "essence": "Goal → Reality → Options → Will: walk a goal from wish to committed next step",
      "visualType": "flow",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You keep saying 'I should get fitter.' You run GROW: Goal — climb the 4 flights to your flat without stopping; Reality — you're winded by floor 2; Options — daily stairs, a ₹500 skipping rope, a walking buddy; Will — take the stairs starting tomorrow. The wish became a Monday act.",
          "tradeoff": "Committing to one option means dropping the comforting 'someday I'll join a gym'; you trade a big fantasy for a small real thing."
        },
        {
          "persona": "student",
          "scenario": "You keep restating 'I want better grades.' GROW: Goal — a B in statistics; Reality — you skip the 8am lectures; Options — record them, a study group, office hours; Will — email the professor for notes by Friday. A wish became a dated step.",
          "tradeoff": "Choosing the concrete step commits you publicly to the professor; you give up the deniability of a private, undated intention."
        },
        {
          "persona": "relationship",
          "scenario": "Your partner keeps hearing 'we should talk more.' You run GROW together: Goal — one honest 20-minute check-in a week; Reality — you both scroll after dinner; Options — a no-phone walk, Sunday coffee; Will — walk this Sunday. Vague longing became a plan.",
          "tradeoff": "Naming a fixed slot risks the talk feeling scheduled, not spontaneous; you trade some romance-of-chance for a conversation that actually happens."
        },
        {
          "persona": "high-achiever",
          "scenario": "You coach a bright junior who says 'I want to lead.' You resist handing them the answer and run GROW; their Reality — they've never chaired a meeting — surfaces the real gap. They commit to running Thursday's standup. Your restraint made them own it.",
          "tradeoff": "Withholding your ready-made solution costs you the quick win and feels slower; you sacrifice looking clever for their actually growing."
        },
        {
          "persona": "privileged",
          "scenario": "Your heir keeps saying 'I'll run the foundation someday.' You walk GROW instead of handing over a title: Reality — they've never sat with a grantee; Will — shadow one visit this month. The dated step replaces an inherited assumption with earned readiness.",
          "tradeoff": "Making succession conditional on real steps risks family tension and a delayed handover; you trade smooth inheritance for a successor who's actually ready."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the vague goal you keep restating, what is the smallest concrete thing you will actually do this week?",
      "pitfalls": [
        "It's tempting to jump straight to Options before honestly mapping Reality — the plan then solves the wrong problem.",
        "Ending without a specific, time-bound Will step leaves motivation with nowhere to go."
      ],
      "steps": [
        "Goal — name what you actually want, concretely.",
        "Reality — describe where things honestly stand right now.",
        "Options — list the paths available, without judging them yet.",
        "Will — commit to one specific next action, with a date."
      ]
    },
    {
      "id": "rubber-band-model",
      "name": "Rubber Band Model",
      "category": "improve-yourself",
      "trigger": "\"Torn between two options\"",
      "essence": "Ask not \"what pulls me?\" but \"what holds me AND what pulls me?\" — both options attract, that's why it hurts",
      "visualType": "tension",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You're torn between a steady ₹40,000 factory job and a cousin's risky workshop. Instead of asking which excites you, you name the anchors: the job holds you with a provident fund and your kids' school fees; the workshop pulls you with part-ownership. Naming both shows why leaving aches.",
          "tradeoff": "Seeing the anchors clearly won't cut them for you; you give up the fantasy of a painless choice and sit with a real one."
        },
        {
          "persona": "student",
          "scenario": "You can't decide between a safe local college and a distant dream course. You map the bands: home holds you with your mother's health and zero debt; the dream pulls with a field you love. The anchors, not the brochures, explain the ache.",
          "tradeoff": "Facing that your mother's health is the real anchor risks guilt either way; you trade a clean decision for an honest one."
        },
        {
          "persona": "relationship",
          "scenario": "You keep almost leaving a 6-year relationship but never do. The model asks what holds you: shared friends, a lease, and the fear of starting over at 34. Naming the anchors shows you're held by logistics, not love — a harder truth.",
          "tradeoff": "Seeing that logistics, not love, keeps you there forces a decision you were dodging; you pay in comfort lost for clarity gained."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're a top surgeon eyeing a research post but you never jump. The bands: clinical work holds you with status and a 7-figure income; research pulls with meaning. Your competence is itself an anchor — being the best keeps you where you're bored.",
          "tradeoff": "Admitting your own excellence traps you costs the story that you 'could leave anytime'; you trade that comfort for a real look at why you stay."
        },
        {
          "persona": "privileged",
          "scenario": "You could retire tomorrow but can't leave the family firm. The anchors aren't money: it's your late father's name on the door and 200 staff who trust you. Naming them shows meaning, not need, holds you.",
          "tradeoff": "Seeing that legacy is the anchor forces you to choose it deliberately or not; you give up drifting on duty for an owned decision."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the two options tugging at you, what is holding you to the one you keep almost leaving?",
      "pitfalls": [
        "Framing it as pure attraction hides the anchors that are really keeping you stuck.",
        "The point is to see the tension clearly, not to resolve it instantly — sitting with both pulls is part of the method."
      ]
    },
    {
      "id": "feedback-box",
      "name": "Feedback Box",
      "category": "improve-yourself",
      "trigger": "\"Got criticism, feeling defensive\"",
      "essence": "Sort feedback: advice to act on / to ignore / affirmation / noise. Not all feedback is equal",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "After your bakery's first week, 5 people leave notes. You sort: one flags the queue was chaotic (act on it), one wants a flavour you'll skip (preference), one is warm praise (affirmation), one just 'meh' (noise). The queue fix gets Monday; the rest stop haunting you.",
          "tradeoff": "Filing four notes as noise risks dismissing a slow-burn signal; you trade completeness for the sanity of acting on one real thing."
        },
        {
          "persona": "student",
          "scenario": "You get feedback on a draft from 4 classmates. One names a genuine logic gap (act), one prefers a different topic (ignore), one says 'great job' (affirmation), one is vague (noise). You fix the logic gap before the Friday deadline and drop the rest.",
          "tradeoff": "Ignoring the topic suggestion may cost a mark if the marker shared that taste; you gamble on the one fix you can actually make in time."
        },
        {
          "persona": "relationship",
          "scenario": "Your partner, mother, and best friend all critique your new job move. You sort: your partner names a real budget risk (act), your mother repeats an old fear (noise for now), your friend is encouraging (affirmation). You address the budget, not the anxiety.",
          "tradeoff": "Boxing your mother's worry as noise risks her feeling unheard; you pay in a slightly hurt parent to avoid deciding by her fear."
        },
        {
          "persona": "high-achiever",
          "scenario": "As a lead you get 12 pieces of feedback on your strategy. Your instinct is to defensively file all of it as noise. Forcing the sort, exactly one — a junior's note on a data gap — is gold. Your smartness nearly binned the one thing that mattered.",
          "tradeoff": "Taking the junior's note seriously costs you the fiction that you'd covered everything; you trade ego for the flaw that would have sunk the plan."
        },
        {
          "persona": "privileged",
          "scenario": "As a patron, everyone flatters you, so real feedback hides in the noise. You sort a gala's reactions: 30 compliments (affirmation), one quiet aside that your speech ran long and self-serving (act). The single honest note is the only useful one.",
          "tradeoff": "Acting on the lone critic over the crowd of flatterers risks trusting the wrong voice; you give up easy applause to hear what money usually buys silence on."
        }
      ],
      "featured": 3,
      "personalPrompt": "Of the criticism sitting in your head right now, which single piece is advice worth acting on, and which are you just replaying?",
      "pitfalls": [
        "A defensive mood dumps everything into 'noise' so nothing has to change — sort before you react.",
        "The reverse trap: treating every offhand comment as an action item and drowning in other people's preferences."
      ]
    },
    {
      "id": "yes-no-rule",
      "name": "Yes/No Rule",
      "category": "improve-yourself",
      "trigger": "\"I keep re-deciding the same thing\"",
      "essence": "Pre-set personal rules (\"never more than X\") so recurring decisions become automatic",
      "visualType": "flow",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Relatives keep asking you for small loans and each one is an agonising negotiation. You set a rule: 'I lend up to ₹2,000, once per person per year, no exceptions.' Now each ask is a quick gate, not a fresh guilt-trip.",
          "tradeoff": "A fixed rule will sometimes refuse a genuinely desperate case; you trade a little compassion-on-demand for an end to being bled dry."
        },
        {
          "persona": "student",
          "scenario": "Every party invite during term derails a week of study. You set a rule: 'Only Friday nights, only if the next day is free.' The recurring decision now answers itself instead of eating an hour each time.",
          "tradeoff": "The rule will make you miss a Wednesday event you'd have loved; you give up a few good nights to protect the grade."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner fight over every 'should we go to your family's thing?' You agree a rule: 'We each get 2 family events a month; beyond that it's optional.' The recurring row is settled once.",
          "tradeoff": "A rule can feel cold when a one-off event really matters; you trade some flexibility for peace over a fight you kept re-having."
        },
        {
          "persona": "high-achiever",
          "scenario": "Every podcast and panel invite tempts you because you can add value to all of them. You set a rule: 'Only 10k-plus audience and under 2 hours' prep.' The gate stops your own capability from saying yes to everything.",
          "tradeoff": "The rule will screen out a small but perfect-fit show; you sacrifice a few gems to stop death by a thousand yeses."
        },
        {
          "persona": "privileged",
          "scenario": "Charities court you constantly and each ask feels worthy. You set a rule: 'I fund 3 causes deeply, decided each January; mid-year asks get a polite no.' The rule protects focus from an infinite worthy queue.",
          "tradeoff": "You'll turn away a genuinely urgent cause in June; you give up responsiveness to avoid scattering money thinly across fifty logos."
        }
      ],
      "featured": 0,
      "personalPrompt": "Which decision do you keep re-litigating, and what personal rule would let you decide it once and stop?",
      "pitfalls": [
        "A rule set too rigidly will misfire on the genuinely exceptional case — build in one deliberate override, not a dozen.",
        "Rules quietly go stale; revisit them when your goals change or they'll steer you by an old map."
      ]
    },
    {
      "id": "choice-overload",
      "name": "Choice Overload",
      "category": "improve-yourself",
      "trigger": "\"Too many options, can't pick\"",
      "essence": "Beyond a handful of options, satisfaction drops. Cut the menu before choosing from it",
      "visualType": "curve",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Buying a fridge, you open 15 tabs and stall for 2 weeks while the old one leaks. You cut to 3 that fit two non-negotiables — size and budget — and choose in an afternoon. Fewer options restored your ability to decide.",
          "tradeoff": "Trimming to 3 risks skipping a model you'd have marginally preferred; you trade the perfect fridge for a working one before the kitchen floods."
        },
        {
          "persona": "student",
          "scenario": "Picking electives, you agonise over 20 modules and nearly miss the enrolment deadline. You cut to 3 that match your timetable and interest, then pick fast. The shortlist unfroze you.",
          "tradeoff": "Cutting early may drop a hidden-gem module; you trade breadth of consideration for making the deadline at all."
        },
        {
          "persona": "relationship",
          "scenario": "On dating apps you swipe 40 profiles a night and never message anyone. You force yourself to consider only 3 at a time and actually reply. Fewer options turned endless scrolling into a real conversation.",
          "tradeoff": "Narrowing risks passing someone you'd have clicked with; you give up the illusion of infinite options for an actual first date."
        },
        {
          "persona": "high-achiever",
          "scenario": "You keep every strategic option open because you see merit in all 8, and the team stalls waiting on you. You force a shortlist of 2 and commit. Your own breadth of vision was the paralysis.",
          "tradeoff": "Closing 6 doors means you may shut the eventual best path; you sacrifice optionality for a team that can finally move."
        },
        {
          "persona": "privileged",
          "scenario": "You can buy any of 30 houses in the city, so you view them for a year and buy none while your family lives in limbo. You cut to 3 by one rule — walk to the kids' school — and choose. Unlimited budget was the trap.",
          "tradeoff": "The rule eliminates a stunning house across town; you trade a dream view for a decision your family has waited a year for."
        }
      ],
      "featured": 0,
      "personalPrompt": "Where are you stalled because you left too many options open, and which could you cut before choosing?",
      "pitfalls": [
        "Cutting the menu too early can drop the option you'd have loved — trim by clear criteria, not by fatigue.",
        "More research feels like progress but often just widens the menu; set a shortlist size in advance."
      ]
    },
    {
      "id": "gap-in-the-market-model",
      "name": "Gap-in-the-Market Model",
      "category": "improve-yourself",
      "trigger": "\"Is my idea worth building?\"",
      "essence": "Plot the market's crowded and empty zones; a viable idea sits in an empty zone people actually want filled",
      "visualType": "scatter-plot",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Opening a tiffin service, you map 8 rivals by price and health. The crowded corner is cheap-and-oily; the empty-and-wanted corner is affordable-and-genuinely-healthy. You aim there — a gap people actually complain about, not one nobody cares about.",
          "tradeoff": "The healthy niche costs more per meal to run; you trade fat margins for a spot customers are actively frustrated by."
        },
        {
          "persona": "student",
          "scenario": "Choosing a thesis, you map the field and spot an untouched sub-topic. Before committing 8 months, you check: empty because it's new, or because no journal cares? You pick a gap supervisors actually want filled.",
          "tradeoff": "The wanted gap is more crowded than the truly empty one; you give up easy novelty for research someone will read."
        },
        {
          "persona": "relationship",
          "scenario": "You're the friend who always organises, and everyone leans on you. You notice the real gap in your circle isn't another planner — it's someone who checks in one-to-one. You fill the wanted gap, not the empty-but-ignored one.",
          "tradeoff": "Being the deep-check-in friend costs more emotional energy than group logistics; you trade easy visibility for a role people quietly need."
        },
        {
          "persona": "high-achiever",
          "scenario": "You spot an unserved niche and your intellect races to build it. First you ask, before committing 6 months: empty because untapped, or empty because tried and failed? Your cleverness wants the elegant answer; the honest check confirms people actively want it.",
          "tradeoff": "Validating first delays your build by a month; you sacrifice speed to avoid a beautiful product nobody asked for."
        },
        {
          "persona": "privileged",
          "scenario": "You can fund any 'gap' your circle dreams up. You nearly bankroll a ₹5-crore members' club — until you map it and see the wanted gap is a quiet co-working space, not more exclusivity. Money let you skip the check; you don't.",
          "tradeoff": "The wanted option is less glamorous than the club; you trade prestige for a venture people will actually use."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the idea you're weighing, is the gap you found empty because it's untapped, or empty because nobody wants it filled?",
      "pitfalls": [
        "An empty zone can be empty for a good reason — validate that people actually want it, not just that it's unoccupied.",
        "Plotting only your favourite axes can invent a gap that vanishes under the dimensions customers really use."
      ]
    },
    {
      "id": "morphological-box-scamper",
      "name": "Morphological Box + SCAMPER",
      "category": "improve-yourself",
      "trigger": "\"Need a new idea from old parts\"",
      "essence": "Break a thing into attributes, recombine systematically; SCAMPER = Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse",
      "visualType": "grid",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your small catering menu feels stale and bookings dropped 30%. You break a dish into attributes — protein, sauce, format, price — and run SCAMPER: substitute the format for a lunchbox, eliminate the pricey garnish. A fresh combo appears a blank page never gave.",
          "tradeoff": "Systematic recombination throws up mostly duds; you pay with an evening of filtering to find the two ideas worth cooking."
        },
        {
          "persona": "student",
          "scenario": "Stuck on a project topic for 3 weeks, you break your field into attributes and force substitutions and reversals. One reversed assumption becomes your whole angle — something staring at a blank doc never produced.",
          "tradeoff": "Most combinations are junk; you pay in an hour of dross to surface one usable idea before the deadline."
        },
        {
          "persona": "relationship",
          "scenario": "Your date nights have become the same dinner every Friday. You break 'date' into attributes — time, place, activity, cost — and swap: a dawn walk instead of dinner, ₹0 instead of ₹2,000. The recombination revives a stale ritual.",
          "tradeoff": "Some experiments will flop and feel forced; you trade a reliably okay evening for the chance of a memorable one."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're brilliant but keep designing the same product shape for 3 releases. Forcing SCAMPER on your own idea, 'eliminate the dashboard' unlocks a direction your expertise had ruled out on instinct. The method beat your pattern.",
          "tradeoff": "Entertaining 'bad' combinations wastes some of your scarce time; you sacrifice efficiency to escape your own well-worn groove."
        },
        {
          "persona": "privileged",
          "scenario": "Planning a legacy gift, you'd default to funding a building with your name on it. SCAMPER on 'donation' — combine, put-to-other-use — surfaces funding 20 scholarships instead. The method broke a rich person's reflex.",
          "tradeoff": "The recombined gift is less visible than a plaque; you trade a monument for impact fewer people will attribute to you."
        }
      ],
      "featured": 0,
      "personalPrompt": "Take the thing you're stuck improving — which single attribute could you substitute or eliminate to get an idea you haven't tried?",
      "pitfalls": [
        "Systematic recombination generates volume, not quality — most combinations are duds, so filter hard afterward.",
        "Breaking a thing into the wrong attributes constrains every idea that follows; choose the dimensions carefully."
      ],
      "steps": [
        "Substitute — swap one part for another.",
        "Combine — merge two elements into one.",
        "Adapt — borrow something that works elsewhere.",
        "Modify — scale, exaggerate, or shrink an attribute.",
        "Put to other uses — apply it to a different job.",
        "Eliminate — remove a part and see what's left.",
        "Reverse — flip the order or the assumption."
      ]
    },
    {
      "id": "gift-model",
      "name": "Gift Model",
      "category": "improve-yourself",
      "trigger": "\"What should I give/offer?\"",
      "essence": "Good gifts sit between what they desire and what surprises them; map gift ideas on desire × surprise",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "For your mother's 60th you nearly default to a ₹5,000 gift card (wanted, zero surprise). Plotting desire against surprise, you instead track down a reprint of the novel she lost in a flood — wanted and unexpected.",
          "tradeoff": "The thoughtful gift takes 3 weeks to hunt down; you trade the ease of a card for a present that actually lands."
        },
        {
          "persona": "student",
          "scenario": "Thanking a professor who wrote your reference, you'd grab ₹500 chocolates (safe, forgettable). The grid pushes you to a hand-annotated copy of a paper that changed your direction — high desire, high surprise, near-zero cost.",
          "tradeoff": "The personal gift risks seeming presumptuous to a formal professor; you trade safety for something that might actually be remembered."
        },
        {
          "persona": "relationship",
          "scenario": "For your partner's birthday you keep buying perfume they never wear. Mapping desire against surprise, you realise a day with both phones off and a walk they've mentioned twice sits in the sweet spot — wanted, unexpected, ₹0.",
          "tradeoff": "The experience leaves nothing to unwrap on the day; you give up the visible gesture for the thing they actually wanted."
        },
        {
          "persona": "high-achiever",
          "scenario": "For your partner you always pick the objectively 'best' gadget — high spec, low delight — optimising gifts like a spreadsheet. The model says surprise is theirs to feel, not yours to calculate; you choose the odd, personal thing your logic rejected.",
          "tradeoff": "Trusting their taste over your analysis risks a gift you'd never pick; you sacrifice control for a chance at real delight."
        },
        {
          "persona": "privileged",
          "scenario": "You can buy anyone anything, so your gifts read as expensive and impersonal. For a friend who has everything, the wanted-and-surprising axis points to your time — a private dinner you cook, not a ₹1-lakh watch.",
          "tradeoff": "Cooking yourself exposes you in a way a cheque never does; you trade the safety of money for the risk of actually showing up."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the gift or offer you're planning, does it sit in the wanted-and-surprising zone, or have you defaulted to safe-but-forgettable?",
      "pitfalls": [
        "Optimising only for surprise produces novelty they didn't want; anchor on genuine desire first.",
        "What counts as desire and surprise is theirs, not yours — map from their taste, not your own."
      ]
    },
    {
      "id": "thinking-outside-the-box",
      "name": "Thinking Outside the Box",
      "category": "improve-yourself",
      "trigger": "\"Stuck in the obvious answers\"",
      "essence": "The nine-dot lesson: the constraint you can't break usually isn't in the problem, it's in your head",
      "visualType": "nine-dot",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your commute eats 2 hours a day and you keep hunting faster routes. Stepping back, the assumption — that you must be in the office daily — was never enforced; two work-from-home days halve it. The wall was in your head.",
          "tradeoff": "Asking to work from home risks your manager reading it as slacking; you trade a little standing for four hours a week reclaimed."
        },
        {
          "persona": "student",
          "scenario": "You've spent a month trying to memorise a huge syllabus faster. The unexamined rule was 'cover everything'; the past 5 papers only ever test a third. Dropping the assumption changes the whole plan.",
          "tradeoff": "Betting on the likely topics risks the one year the pattern breaks; you trade total coverage for time spent where marks actually are."
        },
        {
          "persona": "relationship",
          "scenario": "You keep trying to 'win' the same argument with your brother about the family home. The assumed constraint — that one of you must be right — dissolves when you ask what you both actually want: neither wanted the house, both feared saying so.",
          "tradeoff": "Dropping the need to win means conceding the moral high ground; you give up being right to get to a real answer."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're optimising a slow report's query for the third week. Your expertise assumed it must run live; a nightly cache — beneath your skill level — solves it in an hour. Your competence hid the cheap answer.",
          "tradeoff": "Accepting the unglamorous fix means the elegant optimisation you enjoyed goes unbuilt; you trade craft for the problem actually going away."
        },
        {
          "persona": "privileged",
          "scenario": "You keep throwing money at a charity's fundraising problem for a year. The assumption — that more marketing is the lever — hides the real constraint: donors don't trust where the money goes. No budget fixes that; transparency does.",
          "tradeoff": "Publishing full accounts exposes past waste; you trade a comfortable opacity for the trust that actually raises funds."
        }
      ],
      "featured": 0,
      "personalPrompt": "What rule are you obeying on your current problem that nobody actually imposed on you?",
      "pitfalls": [
        "'Think outside the box' becomes a slogan unless you name the specific assumption you're breaking.",
        "Some constraints are real and load-bearing — question them, but don't romanticise ignoring every limit."
      ]
    },
    {
      "id": "consequences-model",
      "name": "Consequences Model",
      "category": "improve-yourself",
      "trigger": "\"Quick fix vs right fix\"",
      "essence": "Trace each option's consequences beyond step one before acting",
      "visualType": "tree",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Tempted to skip the ₹1,200 service on your scooter to save this month, you trace it: fine this week, a strained engine next month, a ₹9,000 repair by monsoon. Following the branch turns a saving into an obvious cost.",
          "tradeoff": "Paying now means a tight month you'd rather avoid; you trade present ease for not being stranded later."
        },
        {
          "persona": "student",
          "scenario": "You're about to copy a friend's assignment to hit tonight's deadline. You trace it: submitted tonight, flagged by the similarity checker next week, on your record for years. Step two changes the whole calculus.",
          "tradeoff": "Doing it honestly risks a lower mark or a late penalty; you trade this grade for not gambling your degree."
        },
        {
          "persona": "relationship",
          "scenario": "You want to vent about your partner to a mutual friend after a fight. You trace it: relief tonight, the friend's changed view of them next month, an awkwardness that outlives the argument. The second step stops you.",
          "tradeoff": "Holding the vent in means sitting with the frustration tonight; you give up the release to protect a partner the friend can't unhear things about."
        },
        {
          "persona": "high-achiever",
          "scenario": "You want to hardcode a quick fix before a big demo. You trace it: works tonight, another dev copies the pattern next week, it fails silently in production within a month. Your speed made the shortcut tempting; the branch makes it a no.",
          "tradeoff": "Doing it properly risks a rougher demo; you trade a polished tonight for a system that doesn't rot."
        },
        {
          "persona": "privileged",
          "scenario": "You're about to pull strings to get your child into a top school. You trace it: they're in this year, out of their depth next year, and they learn that rules bend for them for life. The far branch is the real cost.",
          "tradeoff": "Not pulling the string means a lesser school now; you trade a prestigious label for a child who earns their own place."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the quick fix you're considering, what happens two steps after it works?",
      "pitfalls": [
        "The tree can branch forever — go deep enough to change the decision, then stop, or you'll paralyse yourself.",
        "People trace only the branches that support the choice they already want; force yourself to follow the uncomfortable ones."
      ]
    },
    {
      "id": "unconscious-thinking-theory",
      "name": "Unconscious Thinking Theory",
      "category": "improve-yourself",
      "trigger": "\"Big decision, analysis paralysis\"",
      "essence": "For complex choices: load the facts, then sleep on it — deliberate distraction lets integration happen",
      "visualType": "split",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Choosing between two flats within your ₹18,000 budget, you re-read the listings for days and stall. You gather every fact, then deliberately spend a Sunday away from it. By evening a clear preference has surfaced the spreadsheet never gave.",
          "tradeoff": "Trusting the gut that surfaced means you can't fully justify it on paper; you trade a defensible list for a decision that actually feels right."
        },
        {
          "persona": "student",
          "scenario": "Torn between two dissertation topics, you keep re-reading the same 3 papers. You load the material, then go for a long run. The run, not the fourth re-read, delivers the answer.",
          "tradeoff": "Stepping away costs you a day you feel you should be working; you trade the comfort of visible effort for genuine clarity."
        },
        {
          "persona": "relationship",
          "scenario": "Unsure whether to forgive a friend's betrayal, you replay the argument on loop for a week. You lay out what actually happened, then stop and sleep on it. Overnight, integration you couldn't force tells you where you stand.",
          "tradeoff": "Waiting risks the friend reading your silence as an answer; you trade a fast reply for one you won't regret."
        },
        {
          "persona": "high-achiever",
          "scenario": "Facing a complex hire with 2 strong finalists, you build ever-bigger comparison grids. The theory says your conscious analysis has hit its ceiling; you read every note, then walk away. The walk decides what the grid couldn't.",
          "tradeoff": "Letting the unconscious decide feels like abandoning rigour; you sacrifice the illusion of full control for a better call."
        },
        {
          "persona": "privileged",
          "scenario": "You've hired 3 consultants to decide a family-business succession and still can't choose. All the data is in; the block is that you keep re-analysing. You step fully away for a week — and the answer, long known, surfaces.",
          "tradeoff": "Stepping back risks the impatient board reading it as indecision; you trade the look of decisiveness for a choice you can live with."
        }
      ],
      "featured": 0,
      "personalPrompt": "On the tangled decision you're chewing, have you actually loaded the facts and stepped away, or just kept re-reading them?",
      "pitfalls": [
        "Sleeping on it only helps after you've genuinely absorbed the information — distraction without input is just delay.",
        "For simple, well-defined choices, deliberate analysis still beats a gut hunch; reserve this for genuinely complex ones."
      ]
    },
    {
      "id": "stop-rule",
      "name": "Stop Rule",
      "category": "improve-yourself",
      "trigger": "\"When do I quit?\"",
      "essence": "Decide the quitting condition BEFORE you start; sunk effort will blind you later",
      "visualType": "spectrum",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Before opening a weekend food stall, you set the exit: 'If I've run it 8 weekends and cleared under ₹5,000 total, I stop.' When week 8 comes with ₹3,000, quitting is a plan you made cold, not a failure.",
          "tradeoff": "The rule may cut a venture that would've turned the corner in week 9; you trade a slim upside for not bleeding your savings indefinitely."
        },
        {
          "persona": "student",
          "scenario": "Starting a side hustle in first year, you set: 'If it's cost me 3 hours a night for a month and made ₹0, I pause it for exams.' The pre-set line makes stopping a decision, not a defeat.",
          "tradeoff": "You might quit just before it clicked; you trade a possible breakthrough for a protected GPA."
        },
        {
          "persona": "relationship",
          "scenario": "Re-entering dating after a hard breakup, you decide in advance: 'If a new person makes me feel small twice in the first month, I walk — no fourth chance.' Set while calm, the rule holds when attachment would bend it.",
          "tradeoff": "The rule may end something that could have grown past a rough start; you trade a maybe for not repeating an old pattern."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're clever enough to keep 'fixing' a failing project forever. You set the stop rule before you start: 'No paying user by week 6, I kill it.' The rule binds the future you who'll rationalise one more sprint.",
          "tradeoff": "You may kill something your skill could have rescued; you trade that rescue-fantasy for years not sunk into a corpse."
        },
        {
          "persona": "privileged",
          "scenario": "You can fund a passion project indefinitely, which is exactly the danger. You set a rule: 'If the gallery hasn't sold a single piece in 12 months, I close it.' Money removed the natural stop, so you build one.",
          "tradeoff": "The rule may shut a venture that only needed patient capital; you trade infinite patience for not mistaking a hobby for a business forever."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the effort you're pouring into, what condition — decided now, in the cold light of day — would tell you to walk away?",
      "pitfalls": [
        "Set the stop rule before you start; once you're invested, sunk cost will bend any line you draw.",
        "A stop rule that's never checked is decoration — put the condition somewhere you'll actually see it."
      ]
    },
    {
      "id": "buyers-decision-model",
      "name": "Buyer's Decision Model",
      "category": "improve-yourself",
      "trigger": "\"Why did I buy that?\"",
      "essence": "Purchases pass through trigger → search → compare → buy → justify; know which stage you're being manipulated in",
      "visualType": "flow",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You're about to buy a ₹15,000 blender after a glowing ad. Walking the stages, you spot the 'compare' step was built entirely from the seller's own testimonials. Naming the stage, you pause and check independent reviews.",
          "tradeoff": "Slowing down means you might miss a genuine sale price; you trade a possible discount for not being steered into a lemon."
        },
        {
          "persona": "student",
          "scenario": "About to buy an ₹8,000 online course a friend hyped, you map the stages and see your 'search' was one enthusiastic Instagram post. Knowing which stage you skipped, you actually compare free alternatives first.",
          "tradeoff": "Researching properly costs you the excitement of buying now; you trade the dopamine of the purchase for money kept."
        },
        {
          "persona": "relationship",
          "scenario": "You're about to say yes to a friend's MLM 'opportunity' out of loyalty. You map the stages and see the 'compare' step was skipped entirely — loyalty rushed you to buy. Naming it lets you decline without guilt.",
          "tradeoff": "Pausing risks the friend feeling rejected; you trade a moment's awkwardness for not funding a pyramid out of politeness."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're about to greenlight a ₹5-lakh tool because the vendor flattered your team's sophistication. You map the funnel and catch the 'justify' story forming before you've even bought. Your own confidence was the lever they pulled.",
          "tradeoff": "Slowing the deal frustrates a vendor you liked; you trade a smooth relationship for a purchase your ego didn't make."
        },
        {
          "persona": "privileged",
          "scenario": "A dealer offers a rare ₹2-crore car and everything feels urgent. You map the stages and see the whole 'trigger' was manufactured scarcity aimed at exactly your profile. Naming it cools the urgency.",
          "tradeoff": "Waiting risks the car genuinely selling to someone else; you trade a possible loss for not being played by your own status."
        }
      ],
      "featured": 0,
      "personalPrompt": "For a purchase you're about to make, which stage are you in, and who is nudging you there?",
      "pitfalls": [
        "The justify stage happens after you buy — awareness there only helps you next time, not this time.",
        "Naming the stage doesn't immunise you; the value is slowing the funnel long enough to think."
      ],
      "steps": [
        "Trigger — something sparks the want.",
        "Search — you gather options and information.",
        "Compare — you weigh alternatives against each other.",
        "Buy — you commit.",
        "Justify — you tell yourself a story that it was right."
      ]
    },
    {
      "id": "flow-model",
      "name": "Flow Model",
      "category": "understand-yourself",
      "trigger": "\"Bored or anxious at work\"",
      "essence": "Flow lives where challenge slightly exceeds skill; too easy = boredom, too hard = anxiety. Adjust one axis",
      "visualType": "curve",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your factory data-entry job bores you flat by 11am, and you blame yourself for laziness. Plotting challenge against skill, the task sits far below your skill — that's boredom, not a flaw. You ask your manager for a stock-analysis task to raise the challenge.",
          "tradeoff": "Taking on harder work risks visible mistakes early; you trade the safety of easy tasks for hours that don't drag."
        },
        {
          "persona": "student",
          "scenario": "You freeze every time you open the 6-chapter statistics text and call yourself stupid. On the grid it's anxiety — challenge far above current skill. You spend a week on the basics with a tutor to lift skill toward the challenge.",
          "tradeoff": "Going back to basics feels like falling behind peers; you give up looking advanced for actually catching flow."
        },
        {
          "persona": "relationship",
          "scenario": "Conversations with your teenage son have gone flat and you assume he's just distant. Seen as flow, your shared activities are too easy to engage him. You raise the challenge — a real project you build together over a month.",
          "tradeoff": "A harder shared project risks friction and dropped balls; you trade comfortable small talk for a chance at real connection."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're anxious the moment you touch the payments module and bored everywhere else, and you push through both by willpower every day. The grid says willpower is the wrong lever — pair up to raise skill on payments, delegate the trivial. Your grit was masking a mismatch.",
          "tradeoff": "Admitting willpower isn't the fix costs your self-image as someone who just powers through; you trade that pride for sustainable focus."
        },
        {
          "persona": "privileged",
          "scenario": "You've mastered everything your role offers and drift, bored, through days money can't make interesting. The grid says raise the challenge, not the comfort: you take on a hard, unpaid cause outside your expertise for a year.",
          "tradeoff": "Choosing a challenge you might fail at risks embarrassment your status usually shields; you trade safe boredom for the discomfort that brings you alive."
        }
      ],
      "featured": 0,
      "personalPrompt": "Is your current work boring you or scaring you, and which single dial — the challenge or your skill — will you nudge?",
      "pitfalls": [
        "Flow is fragile — interruptions and notifications snap you out of the channel faster than difficulty does.",
        "Chasing flow everywhere ignores the necessary boring maintenance; not every task can or should be flow."
      ]
    },
    {
      "id": "johari-window",
      "name": "Johari Window",
      "category": "understand-yourself",
      "trigger": "\"How do others see me?\"",
      "essence": "Four panes: known/unknown to self × known/unknown to others. Shrink the blind spot by inviting feedback",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You keep getting passed over for the shift-lead role and don't know why. You ask 2 trusted co-workers for candid notes; they mention you snap under pressure — something you'd never noticed. The blind pane shrank the moment you asked.",
          "tradeoff": "Hearing you snap under pressure stings and can't be unheard; you pay in a bruised self-image to fix what was quietly costing you promotions."
        },
        {
          "persona": "student",
          "scenario": "Your essays keep scoring lower than you expect. You ask your teacher exactly where they lose marks; she says your arguments never conclude. A blind spot of years closes in a 10-minute conversation.",
          "tradeoff": "Asking risks hearing your best work has a basic flaw; you give up the comfort of not knowing for a weakness you can fix."
        },
        {
          "persona": "relationship",
          "scenario": "Your partner seems distant and you assume it's their mood. You finally ask what you do that pushes them away; they name a habit of interrupting you'd never seen. The pane opens because you asked, not because they nagged.",
          "tradeoff": "Inviting that honesty risks hearing something that hurts about yourself; you trade a comfortable ignorance for a marriage that can actually change."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're the smartest in every room, so in 10 years no one has told you how you land. You explicitly ask a junior for the thing people say when you leave; they admit you talk over the team. Your very competence had sealed the window shut.",
          "tradeoff": "Asking a junior to critique you costs some authority in the moment; you sacrifice a little status for the feedback your brilliance was blocking."
        },
        {
          "persona": "privileged",
          "scenario": "Everyone flatters you, so your blind pane is enormous. You pay a coach ₹50,000 to tell you the unflattering truth your circle won't: your generosity reads as control. Money bought the honesty your status usually repels.",
          "tradeoff": "Hearing that your giving controls people is deeply uncomfortable; you trade a flattering self-image for a relationship with reality."
        }
      ],
      "featured": 2,
      "personalPrompt": "Whose honest read on your blind spot have you been avoiding asking for, and what's one question you could ask them this week?",
      "pitfalls": [
        "The blind spot only shrinks if people feel safe being honest — defensiveness slams the window shut.",
        "Over-sharing to enlarge the 'open' pane can tip into oversharing; the goal is calibrated openness, not exposure."
      ]
    },
    {
      "id": "cognitive-dissonance",
      "name": "Cognitive Dissonance",
      "category": "understand-yourself",
      "trigger": "\"I'm justifying something I chose\"",
      "essence": "When actions and beliefs clash, we edit the belief, not the action. Catch yourself rationalizing",
      "visualType": "split",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You bought a ₹30,000 treadmill and rarely use it, so you catch yourself insisting it 'still helps as motivation.' That story is the tell. You see you're bending the belief to protect the purchase, and either use it or sell it honestly.",
          "tradeoff": "Admitting the buy was impulsive stings your sense of being careful with money; you trade a comforting story for an honest ledger."
        },
        {
          "persona": "student",
          "scenario": "You picked a degree you now dislike, so you keep telling friends 'the job prospects make it worth it' — a reason you invented after enrolling a year ago. Spotting the rationalisation, you look at a transfer instead of defending a sunk choice.",
          "tradeoff": "Considering a transfer means admitting a year may have been misspent; you give up the tidy story for a truer path."
        },
        {
          "persona": "relationship",
          "scenario": "You stayed in a friendship that drains you and now insist 'they're just going through a phase' — for the third year. The belief exists to justify not leaving. Naming it, you let the friendship, not your patience, be the problem.",
          "tradeoff": "Letting the friendship be the problem risks a painful goodbye; you trade a soothing narrative for an honest boundary."
        },
        {
          "persona": "high-achiever",
          "scenario": "You championed a strategy that's failing, so your sharp mind keeps generating reasons it 'just needs 6 more months.' Your intelligence makes the rationalisations airtight — which is the danger. You let the strategy be wrong.",
          "tradeoff": "Killing your own strategy costs public face after you argued for it; you sacrifice ego for a decision that isn't defending a mistake."
        },
        {
          "persona": "privileged",
          "scenario": "You backed a family venture that's clearly failing after 2 years but insist 'it's a long-term play' — because admitting otherwise means admitting your judgement, which your wealth rarely questions. You let the venture be the failure.",
          "tradeoff": "Facing the failed judgement punctures the infallibility money built; you trade a flattering self-image for a decision grounded in reality."
        }
      ],
      "featured": 0,
      "personalPrompt": "Where are you bending a belief to protect a choice you already made, and what would change if you let the choice be the thing that's wrong?",
      "pitfalls": [
        "The rationalisation feels exactly like a genuine reason — that's why it's hard to catch in the moment.",
        "Spotting dissonance in yourself is uncomfortable; the instinct is to explain it away with one more story."
      ]
    },
    {
      "id": "unimaginable-model",
      "name": "Unimaginable Model",
      "category": "understand-yourself",
      "trigger": "\"I can't picture any other life\"",
      "essence": "Sketch the options you've never allowed yourself to consider; the unimaginable is a location, not a void",
      "visualType": "bubble-map",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Mapping your career options at 40, you list the obvious ones, then force a column for paths you'd never allow — quitting to run a small farm, retraining as a nurse. Written down, one 'unimaginable' option quietly excites you.",
          "tradeoff": "Taking the wild option seriously risks unsettling a stable life; you trade the safety of never-asking for a door you might actually walk through."
        },
        {
          "persona": "student",
          "scenario": "Choosing a career, you list the expected graduate jobs, then force yourself to write the ones you'd be embarrassed to admit — a trade apprenticeship, a year abroad. One turns out to fit you better than the 'sensible' list.",
          "tradeoff": "Admitting you want the unconventional path risks your parents' disappointment; you give up their easy approval for a choice that's yours."
        },
        {
          "persona": "relationship",
          "scenario": "Stuck in a marriage that's neither happy nor terrible, you list the obvious fixes, then force the unimaginable column — separate for a year, live in different cities. Just seeing it written changes the conversation.",
          "tradeoff": "Naming the unthinkable option out loud risks frightening your spouse; you trade a comfortable silence for an honest look at what you both want."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're sure your only options are the 3 prestigious roles your CV points to. Forced to write the unimaginable — leave the field entirely, start over at the bottom — you find your competence had fenced off the one path that thrills you.",
          "tradeoff": "Considering a fresh start means risking the status your track record earned; you sacrifice the sunk prestige for a life you'd choose again."
        },
        {
          "persona": "privileged",
          "scenario": "Every option your money buys is on the table, so you list them and feel nothing. Forcing the unimaginable — give most of it away, live simply for a year — surfaces the only option that stirs you.",
          "tradeoff": "Taking radical simplicity seriously threatens the identity your wealth built; you trade certainty of comfort for a shot at meaning."
        }
      ],
      "featured": 0,
      "personalPrompt": "What option have you refused to even picture, and what happens if you sketch it out just to see it?",
      "pitfalls": [
        "Listing wild options is easy; the model only helps if you take at least one seriously enough to test.",
        "Some unimaginable options are unimaginable for sound reasons — expand the frontier, then still judge honestly."
      ]
    },
    {
      "id": "uffe-elbaek-model",
      "name": "Uffe Elbaek Model",
      "category": "understand-yourself",
      "trigger": "\"Who am I vs who I want to be\"",
      "essence": "Rate yourself on value spectrums four ways: how you see yourself, want to be, how others see you, how you'd like them to. The gaps are the story",
      "visualType": "radar",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "On a spider chart of values — security, connection, status, creativity — you plot 4 lines: how you see yourself, who you want to be, how others see you, how you'd like to be seen. The wide gap on status shows you're performing a success you don't feel.",
          "tradeoff": "Seeing the gap forces a choice to close it or own it; you give up the comfort of the performance for an honest self-picture."
        },
        {
          "persona": "student",
          "scenario": "Mapping your values on the chart, the gap between 'who I want to be' (independent) and 'how my parents see me' (their extension) is the widest of the 4 lines. It explains a low-grade resentment you couldn't name for years.",
          "tradeoff": "Naming that gap risks a hard conversation with your parents; you trade a quiet peace for the chance to actually be seen."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner each plot the chart. The gap between how you want to be seen by them and how they actually see you is huge on 'reliable.' The chart turns a vague hurt of 2 years into a specific one you can talk about.",
          "tradeoff": "Surfacing that gap risks a painful evening; you trade a comfortable vagueness for a problem you can finally fix."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your self-ratings are all 9s because you're genuinely good. The honest signal is the gap on 'connection' between want-to-be and how-others-see — your competence hides a loneliness the scores flatter over.",
          "tradeoff": "Facing that gap costs the clean story of a life that's 'all handled'; you sacrifice the flattering scores for the truth in the gaps."
        },
        {
          "persona": "privileged",
          "scenario": "Everything you value seems attained, so all lines sit high. The one gap — between how you want to be seen (generous) and how others see you (transactional) — has been invisible to you and obvious to them for 5 years.",
          "tradeoff": "Closing that gap means giving without the strings your wealth made habitual; you trade easy leverage for being genuinely trusted."
        }
      ],
      "featured": 0,
      "personalPrompt": "On which value is the gap between who you want to be and how others see you the widest, and is that gap worth closing?",
      "pitfalls": [
        "Self-ratings are flattering by default — the honest signal is in the gaps, not the absolute scores.",
        "Guessing how others see you is unreliable; where it matters, ask rather than assume."
      ]
    },
    {
      "id": "energy-model",
      "name": "Energy Model",
      "category": "understand-yourself",
      "trigger": "\"Drained, don't know why\"",
      "essence": "Track what gives vs takes energy, not what takes time. Prune the drains",
      "visualType": "tension",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You feel drained though your calendar looks light. Tracking energy for a week, the 2-hour standup and the endless WhatsApp scroll are the real drains, while your actual work restores you. You cut the standup to 15 minutes.",
          "tradeoff": "Trimming the standup risks a manager who reads presence as commitment; you trade some visibility for energy you actually keep."
        },
        {
          "persona": "student",
          "scenario": "You study 8 hours a day and still feel exhausted and behind. Tracking energy, it's not the study — it's the 3 draining group chats and one toxic friend. Cutting those, the same study hours feel lighter.",
          "tradeoff": "Muting the friend risks a rift; you give up an old closeness to stop a daily energy leak."
        },
        {
          "persona": "relationship",
          "scenario": "You blame your tiredness on work, but tracking energy for a week shows the weekly call with your mother leaves you flat for hours. Naming the drain lets you shorten and reschedule it, not resent it.",
          "tradeoff": "Shortening the call risks your mother feeling cut off; you trade a little guilt for not arriving at your own life depleted."
        },
        {
          "persona": "high-achiever",
          "scenario": "You optimise your calendar to the minute and still burn out. Energy, not time, is the missing variable: 6 back-to-back wins drain more than the count suggests. Your efficiency was measuring the wrong thing.",
          "tradeoff": "Managing energy means leaving productive-looking hours empty; you sacrifice the optics of a full calendar for a sustainable pace."
        },
        {
          "persona": "privileged",
          "scenario": "Time isn't your constraint — you have staff for that — but you're constantly depleted. Tracking energy, the drain is the 30 shallow social obligations a month your position demands. You prune the ones that only perform status.",
          "tradeoff": "Declining the events risks looking aloof to your circle; you trade some social capital for the energy to do anything real."
        }
      ],
      "featured": 0,
      "personalPrompt": "What in your week takes far more energy than it takes time, and what would happen if you pruned it?",
      "pitfalls": [
        "We plan around hours because they're easy to measure; energy is the variable that actually predicts burnout.",
        "A quick fix is to cut all draining tasks, but some are necessary — the move is to reduce or redesign them, not just delete."
      ]
    },
    {
      "id": "political-compass",
      "name": "Political Compass",
      "category": "understand-yourself",
      "trigger": "\"What do I actually believe?\"",
      "essence": "Politics isn't one line; place yourself on economic and social axes independently",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Arguing politics with your father every Sunday, 'left vs right' keeps flattening you both. Placing yourself on economic and social axes separately, you find you're economically cautious but socially liberal — a spot the single line couldn't hold.",
          "tradeoff": "Seeing the nuance costs you the ease of a tribe; you give up belonging to a simple side for an honest position."
        },
        {
          "persona": "student",
          "scenario": "In a debate class you keep getting boxed as 'right-wing' for one economic view. Mapping 2 axes, you show you're economically moderate and socially progressive. The map ends an argument the single line kept fuelling.",
          "tradeoff": "Refusing the label risks both sides distrusting you; you trade the safety of a camp for accuracy."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner think you're politically opposite and it strains dinners. Plotting both on 2 axes, you're close on social values and only differ on economics. The map shrinks a fight that felt fundamental.",
          "tradeoff": "Seeing you mostly agree removes a dramatic story you'd both leaned on; you trade the intensity for peace."
        },
        {
          "persona": "high-achiever",
          "scenario": "You pride yourself on a coherent worldview and place everyone else on your single sophisticated line. Mapping 2 axes reveals your own positions don't sit on one line either — your cleverness had oversimplified you too.",
          "tradeoff": "Admitting your worldview isn't one clean axis costs the elegance you enjoyed; you sacrifice a tidy identity for a truer one."
        },
        {
          "persona": "privileged",
          "scenario": "Your circle assumes your politics from your bank balance. Mapping 2 axes for yourself, you're economically conservative but socially radical — a combination your wealth's stereotype erased. The map reclaims a self others had assigned.",
          "tradeoff": "Owning the unexpected mix risks alienating peers who assumed you shared theirs; you trade easy belonging for being actually known."
        }
      ],
      "featured": 0,
      "personalPrompt": "On the belief you hold most strongly, are you collapsing two independent axes into one convenient line?",
      "pitfalls": [
        "Two axes are still a simplification of a many-dimensional reality — useful, but don't mistake the map for the territory.",
        "It's easy to place opponents at the extremes and yourself at the sensible centre; plot honestly."
      ]
    },
    {
      "id": "personal-performance-model",
      "name": "Personal Performance Model",
      "category": "understand-yourself",
      "trigger": "\"Is this job still right?\"",
      "essence": "Rate current work on want-to / have-to / can-do; misalignment predicts burnout or boredom",
      "visualType": "venn",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Wondering why your job feels like dread, you draw 3 circles: want-to, have-to, can-do. You can still do it and have to, but want-to drifted away 2 years ago. The shrunk overlap explains the dread and points at what to renegotiate.",
          "tradeoff": "Naming the drifted want-to means facing a change you'd rather avoid; you trade comfortable numbness for an honest look at the role."
        },
        {
          "persona": "student",
          "scenario": "You're burning out on a degree and blaming your discipline. The 3 circles show can-do and have-to are fine — it's want-to that's gone. The problem is the fit, not your effort.",
          "tradeoff": "Admitting the degree may be wrong risks a year lost and parents' worry; you give up the safe story of 'just work harder' for a real question."
        },
        {
          "persona": "relationship",
          "scenario": "Your marriage feels heavy and you assume you've failed. The circles reframe it: you both still can-do and have-to the routines, but the want-to overlap has thinned over 5 years. It's a maintenance problem, not a verdict.",
          "tradeoff": "Seeing the thinned want-to means actively rebuilding it, which is work; you trade the ease of drifting for a marriage that needs tending."
        },
        {
          "persona": "high-achiever",
          "scenario": "You can do everything your role demands brilliantly, so you assume you should be happy. The circles show can-do is huge but want-to is a sliver — your competence trapped you in work you stopped wanting 3 years ago.",
          "tradeoff": "Following the shrunk want-to means leaving work you're excellent at; you sacrifice the identity of being the best for doing what you'd choose."
        },
        {
          "persona": "privileged",
          "scenario": "You have no have-to at all — money removed obligation — and you drift for years. The circles reveal that without the have-to circle, want-to alone doesn't organise a life. You deliberately take on a real duty.",
          "tradeoff": "Choosing an obligation you could avoid costs your freedom; you trade limitless choice for the structure that gives it meaning."
        }
      ],
      "featured": 0,
      "personalPrompt": "Where your current role sits, which circle — want-to, have-to, or can-do — has drifted out of the overlap?",
      "pitfalls": [
        "A shrinking want-to circle is easy to blame on yourself when the fix might be changing the role, not your attitude.",
        "The three circles move over time; one snapshot of misalignment isn't a verdict, it's a prompt to check in."
      ]
    },
    {
      "id": "making-of-model",
      "name": "Making-Of Model",
      "category": "understand-yourself",
      "trigger": "\"How did I get here?\"",
      "essence": "Chart your past as scenes — turning points, key people, decisions — to see the plot before writing the next act",
      "visualType": "timeline",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Feeling stuck at 45, you chart your life as scenes: the boss who pushed you, the job you quit, the move that revived you. Laid out, a pattern shows you thrive right after a clean break — and it tells you what the next year needs.",
          "tradeoff": "Trusting the pattern means risking another disruptive break; you trade the safety of staying put for what has actually worked before."
        },
        {
          "persona": "student",
          "scenario": "Lost about a career, you plot your turning points as scenes over 20 years. The pattern: every time you were happiest, you were teaching someone. It points at a path your course-list never suggested.",
          "tradeoff": "Following the pattern risks a less prestigious path than peers; you give up the expected track for one your own history endorses."
        },
        {
          "persona": "relationship",
          "scenario": "Confused about why relationships keep ending the same way, you chart your last 4 as scenes. The pattern is clear: you leave the moment things get real. Seeing it written is the first step to breaking it.",
          "tradeoff": "Facing the pattern means owning your part in each ending; you trade the comfort of bad luck for uncomfortable responsibility."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're between big moves and your analytical mind keeps optimising the next role in isolation. Charting your scenes shows every real leap in 15 years came from following curiosity, not strategy. The plot corrects your planning.",
          "tradeoff": "Trusting curiosity over strategy costs the control you prize; you sacrifice the optimised path for the one your history says works."
        },
        {
          "persona": "privileged",
          "scenario": "You can do anything next, which is paralysing. Charting your life as scenes, the through-line isn't wealth — it's the 2 times you built something from nothing. The pattern points past comfort at creation.",
          "tradeoff": "Following it means leaving ease for hard work you don't need; you trade guaranteed comfort for the thing that ever made you feel alive."
        }
      ],
      "featured": 0,
      "personalPrompt": "Looking at the turning points that got you here, what pattern in your past is quietly predicting what you need next?",
      "pitfalls": [
        "Hindsight tidies the past into a neat story it never was — hold the narrative loosely.",
        "The point is to inform the next act, not to get stuck admiring or relitigating old scenes."
      ]
    },
    {
      "id": "personal-potential-trap",
      "name": "Personal Potential Trap",
      "category": "understand-yourself",
      "trigger": "\"Chasing potential forever\"",
      "essence": "'Potential' can become a debt that grows; at some point you must cash it in on a committed path",
      "visualType": "curve",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "For 10 years you've told yourself you 'have potential' as a musician — someday. The potential has become a comfortable excuse that grows heavier the longer it's uncashed. You commit to one open-mic a month and trade the promise for a real thing.",
          "tradeoff": "Cashing it in means risking public mediocrity; you give up the flattering 'could have been' for the smaller truth of what you are."
        },
        {
          "persona": "student",
          "scenario": "Everyone calls you 'gifted' and you coast on it, half-trying, for 3 years. The trap: unspent gift feels safe but becomes a debt. You pick one hard subject to actually commit to, closing the 'could ace anything' story.",
          "tradeoff": "Committing means finding your limits in one place; you trade the safety of untested potential for real, bounded skill."
        },
        {
          "persona": "relationship",
          "scenario": "You keep an old flame as an open 'maybe someday,' never acting, for years. The unrealised possibility becomes an anchor on your present relationships. You close the door deliberately to be actually present with your partner.",
          "tradeoff": "Closing that door means grieving a fantasy; you give up the comforting 'what if' for a real relationship you're fully in."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're a prodigy who keeps every path open because you could excel at all of them. The open options themselves are the debt — at 35 you've cashed none. You pick one and go all in, closing the rest.",
          "tradeoff": "Committing to one field means the others' potential dies; you sacrifice the identity of limitless promise for a single real achievement."
        },
        {
          "persona": "privileged",
          "scenario": "Your wealth lets you keep every possibility open forever, which is the trap in pure form. The uncashed potential — the company you'd start, the book you'd write for 15 years — is a growing debt no money settles. You commit to one.",
          "tradeoff": "Choosing one closes a hundred glamorous doors; you trade the comfort of infinite possibility for one finished thing."
        }
      ],
      "featured": 3,
      "personalPrompt": "Which 'potential' have you been carrying uncashed for years, and what committed path would let you finally spend it?",
      "pitfalls": [
        "Keeping every door open feels safe but the option itself becomes a debt — at some point staying open is the loss.",
        "Cashing in means closing other doors; the discomfort of that is exactly what the trap uses to keep you frozen."
      ]
    },
    {
      "id": "hard-choice-model",
      "name": "Hard Choice Model",
      "category": "understand-yourself",
      "trigger": "\"Both options seem equal\"",
      "essence": "If options are truly on a par, no more analysis will break the tie — the choice is where you CREATE who you are",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Two job offers score dead even — same ₹50,000 salary, same commute, same hours. The model says more analysis won't break a true tie; there's no hidden right answer. You choose the one that makes you who you want to be, and commit fully.",
          "tradeoff": "Committing without a 'winner' means owning the choice with no spreadsheet to blame; you give up certainty for wholehearted commitment."
        },
        {
          "persona": "student",
          "scenario": "Two degree paths score identically on every rubric you build over a month. The model says stop analysing — a true tie is where you author yourself. You pick the one that fits the person you want to become.",
          "tradeoff": "Choosing on identity not data risks second-guessing later; you trade the false comfort of a 'right' answer for a choice you fully own."
        },
        {
          "persona": "relationship",
          "scenario": "Two partners, both wonderful in different ways, leave you genuinely torn for months. The model reframes: this isn't a problem with a solution, it's a choice about who you become with whom. You choose and commit.",
          "tradeoff": "Committing means grieving the road not taken; you sacrifice the other good life for wholly living this one."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your analytical gift keeps you spreadsheeting two even options for 3 weeks, sure more data will decide. The model names the trap: on a true tie, your intelligence is just spinning. You commit and become, rather than compute.",
          "tradeoff": "Stopping the analysis costs your faith that thinking solves everything; you trade the illusion of an optimal answer for a decisive life."
        },
        {
          "persona": "privileged",
          "scenario": "Money makes both ₹1-crore options equally attainable, which removes the usual tiebreaker. The model says a true par is decided by who you want to be, not what you can afford. You choose on character, not cost.",
          "tradeoff": "Deciding on identity forfeits the safety of a 'sensible' financial answer; you trade an easy metric for the harder work of self-definition."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the choice where the options are genuinely on a par, which one lets you become the person you want to be?",
      "pitfalls": [
        "Mistaking a hard choice for a hard problem sends you back to more analysis that can't help — first check whether it's a true tie.",
        "'Creating who you are' isn't a licence to be reckless; it means committing and owning the choice, not shrugging."
      ]
    },
    {
      "id": "cognitive-bias",
      "name": "Cognitive Bias (meta-card)",
      "category": "understand-yourself",
      "trigger": "\"Can I trust my own thinking?\"",
      "essence": "Your brain systematically distorts: it confirms what it believes, overweights losses, anchors on first numbers, edits memories",
      "visualType": "distortion-lens",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Reviewing a ₹2-lakh car buy that went badly, you audit your thinking: you anchored on the first quote, sought only reviews that agreed, and now 'always knew' it was wrong. Naming the distortions won't undo it, but the next big buy gets a written checklist.",
          "tradeoff": "Admitting you were fooled by your own mind stings; you trade the comfort of 'bad luck' for a process that catches you next time."
        },
        {
          "persona": "student",
          "scenario": "After a bad exam you audit the bias: you revised only what confirmed you understood, and remember 'knowing' the hard topics. Naming it, you build a devil's-advocate revision plan for the next 3 months.",
          "tradeoff": "Facing that you fooled yourself costs your confidence; you give up a comfortable self-image for a study method that works."
        },
        {
          "persona": "relationship",
          "scenario": "After a fight with your partner you audit your own biases: you remembered every slight, discounted every kindness, and anchored on the worst thing said. Seeing the distortions, you apologise for a version of events your mind edited.",
          "tradeoff": "Admitting your memory was biased means conceding ground in the argument; you trade being right for being accurate."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're sure your judgement is too sharp to be biased — which is itself the bias. Auditing an 8-month decision, anchoring and confirmation are all over it. Your intelligence made the distortions invisible, not absent.",
          "tradeoff": "Accepting you're as distorted as anyone punctures a prized self-image; you sacrifice the myth of your objectivity for real rigour."
        },
        {
          "persona": "privileged",
          "scenario": "Surrounded by yes-people, your biases go unchallenged for years. Auditing a failed bet, confirmation bias ran unchecked because no one contradicts you. You install a paid contrarian into your process.",
          "tradeoff": "Inviting contradiction costs the comfort of constant agreement; you trade a pleasant echo for decisions that survive scrutiny."
        }
      ],
      "featured": 3,
      "personalPrompt": "On your current big call, which distortion — anchoring, confirmation, loss aversion, or edited memory — is most likely bending your judgement right now?",
      "pitfalls": [
        "Knowing about biases barely reduces them — awareness alone is weak; you need process (checklists, journals, outside views).",
        "It's easy to spot bias in others and stay blind to your own; assume you're distorted too."
      ]
    },
    {
      "id": "crossroads-model",
      "name": "Crossroads Model",
      "category": "understand-yourself",
      "trigger": "\"So — what next?\"",
      "essence": "At life junctions, name the roads: where you came from, which road is safe, which is bold, which is unimaginable, and which you'd advise a friend to take",
      "visualType": "crossroads",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "At a genuine junction — stay in a safe ₹35,000 job or take a risky offer — you freeze. Instead you name the roads: the one you came from, the safe road, the bold road, the unimaginable one, and the road you'd tell a friend to take. Said aloud, the friend's road is obviously the bold one.",
          "tradeoff": "Naming the roads doesn't walk one for you; you give up the comfort of freezing for the discomfort of choosing."
        },
        {
          "persona": "student",
          "scenario": "Standing between a safe local course and a bold distant one, you name all 5 roads. The 'what would I tell a friend' road makes the bold choice obvious — you'd never tell a friend to shrink.",
          "tradeoff": "The friend's-advice trick only works if you're honest; you risk scripting the friend to endorse your fear, and you have to catch that."
        },
        {
          "persona": "relationship",
          "scenario": "Torn about proposing after 4 years, you name the roads: stay as you are, propose, leave, the unimaginable, and what you'd advise a friend. The friend's-advice road clarifies what your fear was clouding.",
          "tradeoff": "Following the clear road means acting despite fear; you trade the safety of the junction for a committed direction."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your clever mind generates 12 options and freezes on all of them. The model forces just 5 named roads, and the 'advise a friend' road cuts through the analysis your intelligence hid behind.",
          "tradeoff": "Reducing to 5 roads feels like a loss of sophistication; you sacrifice the illusion of infinite nuance for a decision."
        },
        {
          "persona": "privileged",
          "scenario": "Every road is affordable, so you've admired the junction for a year without moving. Naming the 5 roads and asking what you'd tell a friend ends the luxurious paralysis money enabled.",
          "tradeoff": "Choosing forfeits the comfortable optionality wealth gave you; you trade the pleasant view from the crossroads for actually arriving somewhere."
        }
      ],
      "featured": 0,
      "personalPrompt": "Standing at your crossroads, what would you tell a good friend in exactly your position to do?",
      "pitfalls": [
        "Naming five roads can become a way to admire the junction instead of walking down one — set a decision date.",
        "The 'advise a friend' trick works only if you're honest; it's easy to script the friend to endorse your fear."
      ]
    },
    {
      "id": "rumsfeld-matrix",
      "name": "Rumsfeld Matrix",
      "category": "understand-others",
      "trigger": "\"What am I missing?\"",
      "essence": "Sort risk into known knowns, known unknowns, unknown unknowns; work to move things left",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Planning a ₹3-lakh home renovation, you sort risks: known knowns (the tiling cost), known unknowns (whether the old wiring holds — you can test it), and you budget 15% for unknown unknowns as contingency. 'It'll be fine' becomes a plan.",
          "tradeoff": "Holding a 15% contingency means a smaller renovation now; you trade some scope for not being wiped out by a surprise."
        },
        {
          "persona": "student",
          "scenario": "Before a 3-month research project you sort what you know: the method (known known), how long data collection takes (known unknown — pilot it), and you leave slack for the unknown unknowns. Naming them beats blind optimism.",
          "tradeoff": "Leaving slack means committing to less ambitious results; you give up a grander proposal for one you can actually finish."
        },
        {
          "persona": "relationship",
          "scenario": "Before moving in with your partner, you sort the risks: known knowns (you both snore), known unknowns (how you split bills — discuss now), and you agree to expect unknown unknowns with a 3-month check-in. Romance becomes a plan that survives.",
          "tradeoff": "Naming risks before moving in kills some spontaneity; you trade the fantasy of effortless love for a foundation that holds."
        },
        {
          "persona": "high-achiever",
          "scenario": "Leading a migration, your confidence relabels real known unknowns as known knowns — you're sure you know the backfill time. The matrix forces you to test it, and it's 3 times your guess. Your certainty was the risk.",
          "tradeoff": "Testing your assumptions delays the launch a week; you sacrifice a confident timeline for one that's true."
        },
        {
          "persona": "privileged",
          "scenario": "Funding a new venture, your resources let you assume any problem is buyable. The matrix names the unknown unknowns money can't pre-solve: you stay reversible and keep 6 months' runway unallocated instead of committing it all.",
          "tradeoff": "Holding runway back means a slower, less impressive launch; you trade momentum for the ability to survive what you can't foresee."
        }
      ],
      "featured": 0,
      "personalPrompt": "On your current plan, what's one known unknown you could turn into a known known this week with a small test?",
      "pitfalls": [
        "Unknown unknowns can't be listed by definition — the honest move is to leave slack and stay reversible, not to pretend you've found them all.",
        "Overconfidence relabels real known unknowns as known knowns; interrogate the things you're sure about."
      ]
    },
    {
      "id": "swiss-cheese-model",
      "name": "Swiss Cheese Model",
      "category": "understand-others",
      "trigger": "\"How did this failure happen?\"",
      "essence": "Accidents happen when holes in multiple defense layers line up; blame the alignment, not one slice",
      "visualType": "layers",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A customer was double-charged ₹4,000 and everyone blames the new cashier. Tracing the aligned holes: the till software allowed it, no receipt check, no daily reconciliation. Fixing one layer — a daily reconciliation — stops it, not a scapegoat.",
          "tradeoff": "Adding a reconciliation step costs 20 minutes a day; you trade a little time for errors that no longer reach customers."
        },
        {
          "persona": "student",
          "scenario": "You missed an assignment deadline and blame yourself entirely. The model shows aligned holes: no calendar reminder, an unclear deadline, a laptop that died on Friday. You add one reliable reminder rather than just resolving to 'try harder.'",
          "tradeoff": "Building the system feels less noble than willpower; you give up the story of self-discipline for a defence that actually holds."
        },
        {
          "persona": "relationship",
          "scenario": "A big misunderstanding blew up with your partner and you each blame the other's last comment. Tracing it, the holes aligned: a stressful week, a vague text, no check-in. You add a weekly check-in instead of re-fighting who started it.",
          "tradeoff": "A scheduled check-in feels unromantic; you trade spontaneity for a layer that catches problems before they explode."
        },
        {
          "persona": "high-achiever",
          "scenario": "A production outage hits and your instinct is to blame the engineer who deployed. As the smart lead you see further: the tests had a gap, review was rushed, no alert fired for 20 minutes. You fix the alert, not the person.",
          "tradeoff": "Owning the systemic failure means you can't offload blame downward; you sacrifice an easy scapegoat for a system that won't repeat it."
        },
        {
          "persona": "privileged",
          "scenario": "A scandal hits your foundation and advisors want to fire one junior staffer. You trace the aligned holes: no vetting policy, no oversight, no audit in 2 years. You fix the layers, resisting the reputationally-convenient scapegoat.",
          "tradeoff": "Fixing systems instead of firing someone slows the PR relief; you trade a quick clean narrative for a body that won't fail the same way."
        }
      ],
      "featured": 0,
      "personalPrompt": "For your last failure, which single defensive layer — if it had held — would have caught it, and can you strengthen that one now?",
      "pitfalls": [
        "The instinct is to blame the last person who touched it (the final slice), missing the aligned holes behind them.",
        "Adding endless layers has a cost; strengthen the few that catch the most, don't bury the system in checks."
      ]
    },
    {
      "id": "maslow-pyramids",
      "name": "Maslow Pyramids",
      "category": "understand-others",
      "trigger": "\"What do they (or I) actually need?\"",
      "essence": "Needs stack: physical → safety → belonging → esteem → self-actualization; unmet lower layers dominate",
      "visualType": "pyramid",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your teammate keeps missing deadlines and you're about to coach them on focus. Then you learn they're sleeping 4 hours and worried about rent. No productivity tip lands while the base is unmet; you help with the base first.",
          "tradeoff": "Helping with their rent problem isn't your job and costs you time; you trade some boundary for a teammate who can actually function."
        },
        {
          "persona": "student",
          "scenario": "A classmate you tutor isn't improving and you push harder on technique. You discover they skip meals to afford ₹3,000 textbooks. Esteem-level coaching can't land on an unmet physiological need; you point them to the food bank first.",
          "tradeoff": "Getting involved in their situation costs your study time; you give up some hours to remove the block your tutoring couldn't."
        },
        {
          "persona": "relationship",
          "scenario": "Your partner seems unmotivated and distant, and you're tempted to talk about goals. Then you see the real issue is they feel unsafe about money after a layoff last month. Security, not esteem, is the unmet tier; you address that first.",
          "tradeoff": "Focusing on their security need means shelving the growth conversation you wanted; you trade your agenda for meeting them where they are."
        },
        {
          "persona": "high-achiever",
          "scenario": "You're pushing a talented junior toward stretch goals and they keep faltering for weeks. You assume low ambition; really they don't feel they belong on the team yet. Belonging, a lower tier, blocks the esteem work. You fix inclusion first.",
          "tradeoff": "Slowing down to build their belonging delays the results you wanted; you sacrifice speed for a person who can then actually stretch."
        },
        {
          "persona": "privileged",
          "scenario": "You fund a scholarship for 20 students and can't understand why they underperform despite every material need met. The unmet tier isn't money — it's belonging in an elite space that signals they don't fit. You fund mentorship, not just the fees.",
          "tradeoff": "Addressing belonging costs more than writing cheques and is harder to measure; you trade a clean metric for help that actually works."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the person you're trying to motivate (maybe yourself), is an unmet lower need quietly running the show?",
      "pitfalls": [
        "The neat ladder oversimplifies — needs overlap and reorder for real people; use it as a lens, not a law.",
        "Assuming someone's at the top of the pyramid when a basic need is unmet leads to advice that misses entirely."
      ]
    },
    {
      "id": "sinus-milieu-bourdieu-model",
      "name": "Sinus Milieu / Bourdieu Model",
      "category": "understand-others",
      "trigger": "\"Why do they live so differently?\"",
      "essence": "People cluster by values and class position, not just income; taste is social coordinates",
      "visualType": "bubble-map",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your shop's premium line flops with a wealthy neighbourhood for 3 months. Mapping them by taste, not income, you see they signal status through restraint — your gold-trimmed packaging reads as trying too hard. You switch to plain, and sales climb.",
          "tradeoff": "Redesigning for their taste costs a reprint and abandons packaging you loved; you trade your own aesthetic for one that actually sells."
        },
        {
          "persona": "student",
          "scenario": "Your fundraising drive falls flat over a week with a group you assumed would give. Mapping their milieu, they value grassroots authenticity over polished campaigns — your slick posters signalled the wrong tribe. You go handmade.",
          "tradeoff": "The authentic approach costs more hours and looks less professional; you give up polish for a signal that lands with them."
        },
        {
          "persona": "relationship",
          "scenario": "You keep clashing with your in-laws for 2 years and blame personality. Mapping their milieu, they value a formality you read as coldness, while your casual warmth reads as disrespect to them. Taste, not character, was the gap.",
          "tradeoff": "Adapting to their formality costs you some authenticity at dinners; you trade a little of yourself for a bridge across a class divide."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your well-funded product flops with a demographic and your data-brain blames features for a month. Mapping milieu, the group signals belonging through restraint, and your loud premium branding reads as insecure. Your analytics never captured taste.",
          "tradeoff": "Rebranding quieter costs the bold identity you'd invested in; you sacrifice a distinctive look for one that reads as belonging."
        },
        {
          "persona": "privileged",
          "scenario": "You assume your philanthropy will be welcomed everywhere. Mapping a community's milieu, your grand gestures read as condescension in a culture that values reciprocity, not charity. You fund through a local partner instead.",
          "tradeoff": "Working through partners means less visible credit for your giving; you trade recognition for help that's actually received well."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the people you're trying to reach or win over — customers, in-laws, a whole community — are you reading their values and taste, or just their income bracket?",
      "pitfalls": [
        "Milieu maps can slide into stereotyping — treat them as loose coordinates, not fixed boxes for individuals.",
        "Your own milieu is invisible to you; you'll misjudge others by assuming your taste is neutral."
      ]
    },
    {
      "id": "double-loop-learning",
      "name": "Double-Loop Learning",
      "category": "understand-others",
      "trigger": "\"Same mistake, again\"",
      "essence": "Loop 1 fixes the action; loop 2 questions the goal/assumption behind it. Most people never enter loop 2",
      "visualType": "nested-loops",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your ₹30,000 monthly budget keeps blowing up and you keep tightening categories (single-loop). Double-loop asks the harder question: is the goal — this lifestyle in this expensive area — even right? Questioning the assumption, not the spreadsheet, finally works.",
          "tradeoff": "Questioning the lifestyle goal risks an unsettling conclusion — maybe you should move; you trade comfortable tweaks for a real answer."
        },
        {
          "persona": "student",
          "scenario": "Your grades keep slipping for 3 terms and you keep changing study techniques (single-loop). Double-loop asks: is this the right degree for how your mind works? Questioning the goal, not the method, breaks the cycle.",
          "tradeoff": "Questioning the degree itself risks a scary conclusion and lost time; you give up the safety of 'try harder' for a deeper question."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner keep fighting about chores and keep renegotiating the rota (single-loop). Double-loop asks whether the real issue — feeling unappreciated — is what the rota can't fix. You question the assumption, not the schedule.",
          "tradeoff": "Naming the deeper issue risks a harder, more vulnerable conversation; you trade the tidy logistics fight for the real one."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your launches keep slipping and you keep adding process — more standups, tighter tickets (single-loop). Your competence keeps you polishing the machine. Double-loop asks if 'ship monthly' is even right for a team of 4. The assumption was the bug.",
          "tradeoff": "Questioning your own cadence goal costs the identity of a relentless shipper; you sacrifice that badge for a goal that fits reality."
        },
        {
          "persona": "privileged",
          "scenario": "Your foundation's programme keeps underdelivering for years and you keep refining its operations (single-loop). Double-loop asks whether the goal — helping in the way you chose — is what people actually need. Questioning that changes everything.",
          "tradeoff": "Questioning your chosen mission risks admitting years of well-funded effort aimed wrong; you trade a comfortable legacy for genuine impact."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the mistake you keep repeating, what goal or assumption behind it have you never actually questioned?",
      "pitfalls": [
        "Loop one feels productive, so most people stay there forever — the leverage is in the uncomfortable loop two.",
        "Questioning every goal all the time is its own paralysis; enter loop two when the same fix keeps failing."
      ]
    },
    {
      "id": "appreciative-inquiry",
      "name": "AI Model (Appreciative Inquiry)",
      "category": "understand-others",
      "trigger": "\"Everything about this is broken\"",
      "essence": "Ask what works and how to grow it, instead of what's broken and who's at fault",
      "visualType": "spiral",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A team retro at your shop spirals into blaming everything broken. You flip the question: 'What worked this month, and how do we get more?' Someone names that the 5pm handover saved chaos — a strength no one saw. You build on it.",
          "tradeoff": "Focusing on strengths risks a real problem going unaddressed; you trade some fault-finding for momentum you can actually build on."
        },
        {
          "persona": "student",
          "scenario": "Your study group meetings become gripe sessions about the course for an hour. You ask instead what's working: the shared flashcards doubled everyone's recall. Growing that beat cataloguing complaints.",
          "tradeoff": "The positive frame can feel like ignoring genuine grievances; you give up venting for building, which not everyone wants."
        },
        {
          "persona": "relationship",
          "scenario": "Every conversation with your partner lately is about what's wrong. You deliberately ask 'when did we feel closest recently?' The answer — a Sunday with phones off — is a strength to repeat, not a fault to fix.",
          "tradeoff": "Asking what works risks papering over a real issue that needs airing; you trade problem-solving for connection, and must not overdo it."
        },
        {
          "persona": "high-achiever",
          "scenario": "You run a sharp, critical retro that lists 15 failures. As the analytical leader you're great at fault-finding — which blinds you to strengths. Asking what worked surfaces a quiet process that saved the release. Your critique had hidden it.",
          "tradeoff": "Leading with appreciation feels soft to your rigorous self; you sacrifice the satisfaction of a thorough teardown for a team that grows."
        },
        {
          "persona": "privileged",
          "scenario": "Reviewing your foundation's year, consultants present a 40-page problem audit. You ask the missing question: what's genuinely working that we could double? One small programme, overlooked, is the real win. You fund it up.",
          "tradeoff": "Betting on the bright spot means diverting money from fixing the audit's problems; you trade comprehensive repair for concentrated growth."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the thing you've written off as broken, what part is quietly working that you could grow instead?",
      "pitfalls": [
        "Appreciative framing can slide into ignoring real problems — it complements fault-finding, it doesn't replace it.",
        "Forced positivity feels hollow; the strengths you build on have to be genuine, not manufactured."
      ]
    },
    {
      "id": "pareto-principle",
      "name": "Pareto Principle",
      "category": "understand-others",
      "trigger": "\"Overwhelmed by the task list\"",
      "essence": "~80% of results come from ~20% of causes; find your 20% first",
      "visualType": "split",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your repair-shop queue feels infinite. Tagging a week of jobs, 80% trace to 3 recurring faults. Fixing those 3 — the vital 20% — empties most of the queue; chasing every one-off never would.",
          "tradeoff": "Focusing on the top 3 means some rare jobs wait longer; you trade completeness for clearing the bulk fast."
        },
        {
          "persona": "student",
          "scenario": "You're drowning revising 12 topics equally. Checking past papers, 80% of the marks come from 3 topics. You put most hours there. The vital few beat spreading thin.",
          "tradeoff": "Betting on 3 topics risks the year the pattern shifts; you give up full coverage for the marks that actually recur."
        },
        {
          "persona": "relationship",
          "scenario": "You try to please your whole extended family and burn out. You notice 80% of the warmth comes from 3 people who actually reciprocate. Investing there, the guilt-driven rest matters less.",
          "tradeoff": "Pulling back from the wider family risks hurt feelings; you trade broad duty for depth with the few who give back."
        },
        {
          "persona": "high-achiever",
          "scenario": "You do everything at 100% because you can. The principle says 80% of your impact comes from 20% of your work; the rest is polish nobody notices. You cut the low-leverage 80%.",
          "tradeoff": "Doing less on the trivial many costs your identity as thorough; you sacrifice completeness for outsized results."
        },
        {
          "persona": "privileged",
          "scenario": "Your philanthropy funds 50 small causes and you feel scattered. The 80/20 lens shows 3 grantees drive most of the real change. You concentrate there instead of sprinkling.",
          "tradeoff": "Concentrating means cutting 47 causes that still do some good; you trade breadth of goodwill for genuine impact."
        }
      ],
      "featured": 0,
      "personalPrompt": "In the work or life that's overwhelming you, which 20% — of tasks, or of the people and habits you pour time into — produces most of what matters, and what if you started there?",
      "pitfalls": [
        "The 80/20 split is a heuristic, not a measured law — find your actual vital few rather than assuming any 20% will do.",
        "The neglected 80% isn't always worthless; some of it is quiet, necessary maintenance."
      ]
    },
    {
      "id": "long-tail",
      "name": "Long Tail",
      "category": "understand-others",
      "trigger": "\"Is niche worthless?\"",
      "essence": "Aggregated niches can outweigh the hits; the tail is a market, not a leftover",
      "visualType": "curve",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You nearly drop the 20 slow-selling spice blends in your shop to focus on the bestseller. Adding them up, together they out-earn the hit and bring the loyal customers who come every week. The tail was a market you undervalued.",
          "tradeoff": "Keeping 20 slow lines costs shelf space and stock-management effort; you trade simplicity for the aggregate the tail quietly earns."
        },
        {
          "persona": "student",
          "scenario": "You almost delete 30 niche study videos you made because none went viral. Summed, they've earned more over a year than your one popular one and reach exactly the students who subscribe.",
          "tradeoff": "Maintaining 30 videos costs upkeep hours; you give up focus for a tail that out-earns the hit in aggregate."
        },
        {
          "persona": "relationship",
          "scenario": "You value only your 2 closest friends and neglect the 20 acquaintances. Then a job loss comes and it's the wide, weak-tie network — not the 2 — that surfaces the opportunity. The tail of light ties held real value.",
          "tradeoff": "Tending many light ties costs the depth you'd give the few; you trade some intimacy for a network that catches you when the few can't."
        },
        {
          "persona": "high-achiever",
          "scenario": "You focus your product only on power users, dismissing the 40 scattered small use-cases. Aggregated, the tail of niche uses is a bigger market than your flagship. Your 'focus' was leaving money on the table.",
          "tradeoff": "Serving the tail costs support and maintenance the flagship didn't; you sacrifice a clean product for a larger aggregate market."
        },
        {
          "persona": "privileged",
          "scenario": "Your foundation funds only 3 flagship, headline programmes. The dozens of tiny community grants you almost cut, summed, reach more people more cheaply than the flagships. The tail was the real leverage.",
          "tradeoff": "Backing many small grants costs oversight the flagships didn't need; you trade a clean headline for diffuse but larger reach."
        }
      ],
      "featured": 0,
      "personalPrompt": "What niche part of your work — or which quiet, minor relationships — are you dismissing as too small, when the aggregate of many small things might be the real value?",
      "pitfalls": [
        "Serving a long tail has real costs (support, maintenance) that can outweigh the aggregated upside — do the sum.",
        "Not every tail pays; some niches stay niche. The insight is 'check the aggregate', not 'niche always wins'."
      ]
    },
    {
      "id": "conflict-resolution-model",
      "name": "Conflict Resolution Model",
      "category": "understand-others",
      "trigger": "\"We're stuck in a fight\"",
      "essence": "Name the mode you're in — escalate, avoid, concede, compromise, or genuinely resolve — and what each costs",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Mid-argument with your landlord over a ₹10,000 deposit, you name the modes: you're avoiding, he's competing. Neither resolves it. Seeing the grid, you shift to collaborating — a longer, more honest talk you'd been dodging.",
          "tradeoff": "Collaborating means a harder conversation you'd rather skip; you trade a quick avoidance for a resolution that actually holds."
        },
        {
          "persona": "student",
          "scenario": "In a group project, you keep accommodating to avoid friction and resent it for weeks. Naming your mode on the grid, you see accommodating is costing you the grade. You shift to compromising and speak up.",
          "tradeoff": "Speaking up risks the harmony you were protecting; you give up being the easy one for a fairer share of the work."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner fight and you always compete to win. The grid shows both of you competing means nobody resolves. Naming it, you try collaborating — and the recurring fight finally moves after months.",
          "tradeoff": "Dropping the need to win means being the first to soften; you sacrifice the momentary upper hand for a real resolution."
        },
        {
          "persona": "high-achiever",
          "scenario": "In conflicts you default to competing because you're usually right — and win every battle while losing the relationship over years. The grid names the cost your competence hid. You choose collaborating with a peer you keep beating.",
          "tradeoff": "Collaborating means not proving you're right; you trade the win you'd certainly get for a working relationship."
        },
        {
          "persona": "privileged",
          "scenario": "You avoid conflict entirely because you can just pay or walk away. That avoidance leaves real issues with staff unresolved for 2 years. The grid names avoidance as a mode with a cost, not neutrality.",
          "tradeoff": "Engaging means discomfort your money usually spares you; you trade the ease of avoidance for problems that finally get solved."
        }
      ],
      "featured": 0,
      "personalPrompt": "In your current conflict, which mode are you actually in — competing, avoiding, accommodating, compromising, or collaborating — and what is that mode costing you?",
      "pitfalls": [
        "Every mode has a right moment; collaboration isn't always best and avoiding isn't always weak — match mode to stakes.",
        "It's easy to name the other person's mode and stay blind to your own; label yours first."
      ]
    },
    {
      "id": "black-swan-model",
      "name": "Black Swan Model",
      "category": "understand-others",
      "trigger": "\"Nobody saw it coming\"",
      "essence": "The past is a poor guardrail: rare, extreme events dominate outcomes and are rationalized only afterwards",
      "visualType": "spike",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your small shop's sales grew steadily for a year, so you signed a 2-year stock contract off the trend. The model warns rare shocks dominate: a road closure could halve footfall overnight. You keep flexible terms instead of betting on the smooth line.",
          "tradeoff": "Flexible terms cost a higher unit price than the bulk contract; you trade some margin for surviving a shock you can't predict."
        },
        {
          "persona": "student",
          "scenario": "You plan your finances assuming your part-time income holds steady all year. The model says one extreme event — losing the job, a family emergency — dominates the average. You build a 3-month buffer instead of trusting the trend.",
          "tradeoff": "Saving a buffer means a tighter month now; you give up small comforts to not be wiped out by one bad event."
        },
        {
          "persona": "relationship",
          "scenario": "You assume your relationship's calm year predicts a calm future and stop investing in it. The model warns a single rare shock — an affair, a death, a move — tests everything. You build resilience now, not smugness.",
          "tradeoff": "Actively fortifying a good relationship feels unnecessary; you trade present ease for a bond that survives the rare storm."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your metrics have grown smoothly for a year and you plan capacity off the line. The model says a black swan — one huge customer, a viral moment — could 50 times your traffic overnight. You build for graceful failure, not the trend.",
          "tradeoff": "Building for extremes costs engineering time the smooth line doesn't justify; you sacrifice short-term velocity for surviving the spike."
        },
        {
          "persona": "privileged",
          "scenario": "Your wealth has compounded calmly for 10 years and you assume it always will. The model warns rare extreme events — a crash, a fraud, a lawsuit — dominate outcomes. You diversify and stay liquid rather than trust the streak.",
          "tradeoff": "Diversifying and holding cash lowers your returns in calm years; you trade some upside for surviving the tail event that ruins the overconfident."
        }
      ],
      "featured": 0,
      "personalPrompt": "Where are you extrapolating from a calm past, and what would a single extreme event — good or bad — do to that plan?",
      "pitfalls": [
        "You can't forecast specific black swans; trying to predict them wastes effort better spent on resilience and optionality.",
        "Hindsight makes every black swan look obvious afterward — resist the story that you 'should have seen it'."
      ]
    },
    {
      "id": "chasm-diffusion-model",
      "name": "Chasm / Diffusion Model",
      "category": "understand-others",
      "trigger": "\"Early buzz, then silence\"",
      "essence": "Innovations spread innovators → early adopters → (CHASM) → majority; most die in the gap",
      "visualType": "curve",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your homemade pickle has passionate fans at the local market, but the supermarket buyer won't bite for 3 months. The chasm: the buyer wants proof, shelf-life, and consistency, not passion. You re-pitch to their needs, not louder to fans.",
          "tradeoff": "Meeting the buyer's needs costs certification and standardisation that dilutes the artisanal charm; you trade some soul for scale."
        },
        {
          "persona": "student",
          "scenario": "Your student society is loved by 20 core members but can't grow past them. The majority wants low-commitment, clear value — not the intense culture the core loves. You add a casual tier to cross the gap.",
          "tradeoff": "A casual tier risks diluting the tight culture the core treasures; you give up some intensity for growth."
        },
        {
          "persona": "relationship",
          "scenario": "You're beloved by your close friends but struggle to make new ones. The chasm: new people need low-stakes, easy entry, not the deep intensity your close circle bonded over across years. You offer lighter first steps.",
          "tradeoff": "Offering a lighter version of yourself feels less authentic; you trade immediate depth for a bridge new people can actually cross."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your product has passionate early adopters, then growth stalls at 6 months. You keep shouting the novelty that won them. The pragmatic majority wants proof and safety, not novelty. You re-pitch entirely, resisting the instinct to market harder.",
          "tradeoff": "Re-pitching to the majority alienates the enthusiasts who loved the edge; you sacrifice your first fans' delight for a market that scales."
        },
        {
          "persona": "privileged",
          "scenario": "Your exclusive members' club thrills its founding 50, but new members won't join. The chasm: the next group wants accessibility and clear benefit, not more exclusivity. You open a path in, against your instinct to stay rarefied.",
          "tradeoff": "Opening up costs the exclusivity your founders paid for; you trade some prestige for the growth the club needs to survive."
        }
      ],
      "featured": 3,
      "personalPrompt": "If your early buzz has gone quiet, are you still selling to enthusiasts when the next group needs a completely different reason to say yes?",
      "pitfalls": [
        "Early-adopter love is misleading feedback — it can convince you the chasm doesn't exist right up until growth flatlines.",
        "The majority's reasons aren't the enthusiasts' reasons; reusing the same pitch is what kills products in the gap."
      ]
    },
    {
      "id": "black-box-model",
      "name": "Black Box Model",
      "category": "understand-others",
      "trigger": "\"I don't get why it works\"",
      "essence": "You can use, test, and steer a system by inputs/outputs without understanding its insides — and you often must",
      "visualType": "black-box",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your teenager's mood is a black box you can't decode. Instead of demanding they explain, you steer by inputs and outputs: more sleep and fewer late nights visibly improve things over a week. You control what you can without cracking the box open.",
          "tradeoff": "Steering by outputs means never fully understanding what's going on inside; you trade the comfort of knowing for what actually helps."
        },
        {
          "persona": "student",
          "scenario": "You don't fully understand how the grading rubric weights things — it's a black box. Rather than stall, you submit a draft, see the mark, adjust, resubmit within the 2 weeks. You steer by output without decoding the marker's mind.",
          "tradeoff": "Optimising to the output risks gaming the grade over real learning; you trade depth for a mark you can actually move."
        },
        {
          "persona": "relationship",
          "scenario": "Why your partner withdraws is a black box, and interrogating it makes it worse. You steer by inputs instead: you notice a calm evening and a shared meal reliably help. You act on what works, not on a full diagnosis.",
          "tradeoff": "Managing by what-works means the root cause stays unexamined; you trade complete understanding for a relationship that functions."
        },
        {
          "persona": "high-achiever",
          "scenario": "A machine-learning model your team relies on is a black box even to you, and it galls your need to understand. Rather than stall the launch, you steer by training signal and output metrics over 2 weeks. You control it without seeing inside — because you can't.",
          "tradeoff": "Steering by outputs risks optimising the wrong metric unseen; you sacrifice full comprehension for shipping something that works."
        },
        {
          "persona": "privileged",
          "scenario": "A complex market you're invested in behaves as a black box no advisor fully explains. Instead of demanding the certainty money usually buys, you steer by inputs and outputs — adjust exposure, watch returns month by month. You act without full sight.",
          "tradeoff": "Acting without full understanding risks a blind spot blowing up; you trade the certainty your wealth expects for staying in the game."
        }
      ],
      "featured": 3,
      "personalPrompt": "What system are you refusing to use until you 'understand it fully', when you could instead learn to steer it by inputs and outputs?",
      "pitfalls": [
        "Treating everything as a black box invites nasty surprises — some systems genuinely need to be opened before you trust them.",
        "Steering by outputs alone can optimise the wrong thing if your success metric is off; watch what you're actually rewarding."
      ]
    },
    {
      "id": "prisoners-dilemma",
      "name": "Prisoner's Dilemma",
      "category": "understand-others",
      "trigger": "\"Should I cooperate or protect myself?\"",
      "essence": "Individually rational betrayal produces mutually worse outcomes; repeated games reward trust",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You and a neighbour both want the shared driveway repaved but each waits for the other to pay, so it stays broken for 3 years. Seeing you'll live next door for a decade, you offer to split it first — the repeated game rewards trust.",
          "tradeoff": "Moving first risks the neighbour freeloading on your ₹20,000; you trade the safety of waiting for a driveway both of you finally use."
        },
        {
          "persona": "student",
          "scenario": "You and your lab partner each hold back your best ideas fearing the other takes credit, so the project stays mediocre. Realising you'll partner all term, you share first — and they reciprocate. The repeated game beats hoarding.",
          "tradeoff": "Sharing first risks them taking the credit once; you give up a guarded advantage for a better joint result over the term."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner each withhold affection until the other gives first, and both feel starved for weeks. Seeing this is a repeated game for life, you give warmth first without keeping score — and it compounds.",
          "tradeoff": "Giving first risks feeling unreciprocated some days; you trade the safety of scorekeeping for a warmth that grows."
        },
        {
          "persona": "high-achiever",
          "scenario": "Two teams could share a tool and both win, but each fears the other hoards credit, so both rebuild it — the worse outcome. Seeing you'll collaborate again in 3 months, you cooperate first and make the repeated game reward trust.",
          "tradeoff": "Cooperating first risks the other team exploiting it once; you sacrifice a guaranteed edge for a partnership that pays over quarters."
        },
        {
          "persona": "privileged",
          "scenario": "You and a rival family-business could merge supply chains and both profit, but distrust keeps you separate and duplicating cost for years. Recognising a decades-long repeated game, you extend trust first with a small shared contract.",
          "tradeoff": "Extending trust first risks them defecting on the first deal; you trade a defensive posture for a cooperation that compounds for decades."
        }
      ],
      "featured": 3,
      "personalPrompt": "Where are you defending yourself in a way that quietly guarantees a worse outcome for everyone, including you?",
      "pitfalls": [
        "Cooperating blindly with a genuine defector just gets you exploited — trust is rational in repeated games, not one-shot ones.",
        "The matrix assumes you've read the real payoffs; misjudge them and 'cooperate' can be naive."
      ]
    },
    {
      "id": "team-model",
      "name": "Team Model",
      "category": "improve-others",
      "trigger": "\"Is this team up to it?\"",
      "essence": "Map members' skill sets against what the task demands; gaps and overlaps become visible",
      "visualType": "grid",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Before committing your 5-person shop team to a busy festival week, you map skills against demands: two are great with customers, nobody handles the till fast under pressure. You train one now, before week three's queue melts down.",
          "tradeoff": "Cross-training the till person costs a slow afternoon of practice; you trade some current output for not collapsing at peak."
        },
        {
          "persona": "student",
          "scenario": "Before a group project you map each member's skills against what it needs. Three of you can write, nobody can do the stats — a gap that would've hit in the final week. You recruit a stats-strong classmate early.",
          "tradeoff": "Recruiting a fourth means splitting the grade wider; you give up a bigger individual share for a project that doesn't fail on stats."
        },
        {
          "persona": "relationship",
          "scenario": "Planning a wedding with your partner, you map who's good at what against the 40 tasks. You both hate logistics and neither tracks budgets — the gap that sinks weddings. You delegate that to a planner before it bites.",
          "tradeoff": "Hiring a planner costs ₹50,000 you'd rather save; you trade money for a gap that would have caused months of fights."
        },
        {
          "persona": "high-achiever",
          "scenario": "You assemble a team of 5 people just like you — all brilliant builders — and assume it's covered. Mapping skills, everyone overlaps on building and nobody does testing or sales. Your instinct to hire mirrors left a fatal gap.",
          "tradeoff": "Hiring for the gap means bringing on people unlike you who'll challenge the culture; you sacrifice easy harmony for a team that's actually complete."
        },
        {
          "persona": "privileged",
          "scenario": "You can hire anyone, so you stack your foundation with 6 famous names. Mapping their skills against what the mission needs, they all bring prestige and none bring operational grip. Fame filled the board; the gap is execution.",
          "tradeoff": "Adding an unglamorous operator costs a marquee seat; you trade star power on the letterhead for a mission that actually delivers."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the task ahead of your team, where's the gap between what it demands and the skills you actually have on the bench?",
      "pitfalls": [
        "Rating skills is subjective and egos are involved — get honest input, ideally self-and-peer, not one manager's guess.",
        "A perfect skills map still fails if you ignore how the people actually work together; capability isn't chemistry."
      ]
    },
    {
      "id": "hersey-blanchard",
      "name": "Hersey–Blanchard (Situational Leadership)",
      "category": "improve-others",
      "trigger": "\"How hands-on should I be?\"",
      "essence": "Match style to the person's competence & commitment: direct → coach → support → delegate",
      "visualType": "matrix-2x2",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You run a 6-person shop and manage everyone the same close way. A new hire needs that direction, but your 10-year veteran finds it insulting and disengages. You delegate to the veteran and direct the newcomer.",
          "tradeoff": "Delegating to the veteran risks a mistake you'd have caught; you trade some control for a senior person who stays motivated."
        },
        {
          "persona": "student",
          "scenario": "Leading a study group, you spoon-feed all 5 members equally. The strong students are bored and the weak ones still lost. Matching support to each person's level, you stretch the strong and scaffold the weak.",
          "tradeoff": "Differentiating costs you more prep time per person; you give up the ease of one approach for a group that all actually progress."
        },
        {
          "persona": "relationship",
          "scenario": "Helping your teenage son with life skills, you either hover or abandon. The model says match to competence: direct closely on the new thing (driving), step back on what they've mastered (cooking). You stop applying one mode to everything.",
          "tradeoff": "Stepping back on mastered skills risks the odd mistake; you trade a little safety for a teenager who grows independent."
        },
        {
          "persona": "high-achiever",
          "scenario": "You delegate everything because that's how you'd want to be led — and your junior, out of their depth, quietly drowns for a month. The model says a new person needs directing, not the freedom you'd crave. You adjust to them, not you.",
          "tradeoff": "Directing closely feels like micromanaging to you; you sacrifice your preferred hands-off style for a junior who doesn't sink."
        },
        {
          "persona": "privileged",
          "scenario": "You lead by giving total autonomy, mistaking it for respect, to staff who need clarity. Two projects stall for weeks because people didn't know they should ask. You match style to readiness rather than applying your own ideal.",
          "tradeoff": "Providing more direction costs the generous hands-off image you liked; you trade that self-image for staff who actually deliver."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the person you're leading, does your current hands-on level match their competence and commitment, or are you directing where you should delegate?",
      "pitfalls": [
        "Competence is task-specific — the same person may need directing on one thing and delegation on another; don't fix a single style to a person.",
        "Reading someone's commitment wrong flips the whole prescription; check before you choose the style."
      ]
    },
    {
      "id": "role-playing-model",
      "name": "Role-Playing Model (Belbin / de Bono)",
      "category": "improve-others",
      "trigger": "\"Meetings go nowhere\"",
      "essence": "Assign thinking roles (de Bono's hats) or recognize natural team roles (Belbin); separate the thinking modes",
      "visualType": "role-wheel",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your family meeting about moving house goes in circles — facts, fears, hopes all at once. You assign 10 minutes each: first only facts, then only worries, then only possibilities. The tangle unknots when each is heard alone.",
          "tradeoff": "Forcing structured turns feels stiff for a family chat; you trade natural flow for a decision that actually gets made."
        },
        {
          "persona": "student",
          "scenario": "Your project group argues features and risks and timelines simultaneously and stalls. You run modes for 15 minutes each — facts, then optimism, then risks. Separating them lets the group think one thing at a time.",
          "tradeoff": "The structure feels artificial and some resist it; you give up spontaneity for progress you weren't making."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner planning finances mix dreams, fears, and numbers into one heated tangle. You agree to do it in modes: tonight only the facts, tomorrow the hopes. The separation cools a fight.",
          "tradeoff": "Splitting an emotional talk into modes can feel clinical; you trade the catharsis of venting for a plan you both can hold."
        },
        {
          "persona": "high-achiever",
          "scenario": "You dominate 1-hour meetings by arguing all angles at once because you can hold them all. It steamrolls the team. Assigning one mode at a time forces space for others' facts and risks your brilliance drowned out.",
          "tradeoff": "Holding to one mode restrains your fast, multi-angle thinking; you sacrifice your natural pace for a team that contributes."
        },
        {
          "persona": "privileged",
          "scenario": "You chair a board where deference means everyone just agrees with you for years. Assigning thinking modes — a mandated 'risks only' round — forces the critique your status usually suppresses. The structure buys honesty money can't.",
          "tradeoff": "Inviting a risks round surfaces criticism of your pet ideas; you trade comfortable agreement for decisions that survive scrutiny."
        }
      ],
      "featured": 0,
      "personalPrompt": "In your stuck meeting or tangled family conversation, which single thinking mode is everyone skipping — the hard facts, the risks, or the bold possibilities?",
      "pitfalls": [
        "Assigned roles feel artificial at first and people resist — the facilitator has to hold the structure or it collapses into the usual free-for-all.",
        "Boxing a person permanently into one role (the 'critic') wastes their range; rotate the hats."
      ]
    },
    {
      "id": "result-optimisation-model",
      "name": "Result Optimisation Model",
      "category": "improve-others",
      "trigger": "\"Deadline vs perfection\"",
      "essence": "Iterate in passes: rough whole first, then refine — never polish one corner of an unfinished canvas",
      "visualType": "spiral",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "With a week to your stall's launch, you're tempted to perfect the signage. Instead you get everything rough-but-working — menu, stall, till, samples — then refine. When the day comes, all of it is presentable, not one perfect sign beside chaos.",
          "tradeoff": "A rough-whole approach means nothing is beautiful on day one; you trade polish for a launch that actually works end to end."
        },
        {
          "persona": "student",
          "scenario": "With 3 days to an essay deadline, you keep perfecting the introduction. You switch to a rough full draft — every section present — then improve. You hand in a complete argument, not a gorgeous intro and a blank conclusion.",
          "tradeoff": "The rough-first draft feels embarrassingly unpolished mid-way; you give up the comfort of a perfect opening for a finished whole."
        },
        {
          "persona": "relationship",
          "scenario": "Planning a surprise anniversary, you obsess over the perfect gift for weeks and leave everything else. You switch to roughing the whole day — meal, time, place, gift — then refining. The day lands as a whole, not one dazzling gift and no plan.",
          "tradeoff": "Roughing the whole means the gift is less perfect; you trade one dazzling detail for a day that flows."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your craftsmanship makes you polish one module to perfection for a week while the product's rest is blank. The model says rough the whole first. Your very excellence at the detail was starving the system. You do a rough end-to-end pass.",
          "tradeoff": "A rough whole offends your standards; you sacrifice the satisfaction of one perfect corner for a product that actually ships."
        },
        {
          "persona": "privileged",
          "scenario": "You can fund endless polish, so your venture perfects its brand for months while the actual product doesn't exist. The model says get the whole thing rough and working first. Money enabled the imbalance. You force an end-to-end version.",
          "tradeoff": "A rough whole looks less impressive than a gorgeous brand; you trade the beautiful facade for something that functions."
        }
      ],
      "featured": 3,
      "personalPrompt": "Where are you polishing one corner while the rest of the canvas is still blank, and what would a rough whole-first pass look like?",
      "pitfalls": [
        "'Iterate' can become an excuse to never finish; each pass needs a clear bar for 'good enough for now'.",
        "Some work genuinely needs deep craft up front; not everything benefits from a rough-first sweep."
      ]
    },
    {
      "id": "project-management-triangle",
      "name": "Project Management Triangle",
      "category": "improve-others",
      "trigger": "\"Fast, cheap, good?\"",
      "essence": "You can maximize two of fast/cheap/good; pretending otherwise breaks projects",
      "visualType": "triangle",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A customer wants their tailoring fast, cheap, and perfect by Friday. You put the triangle on the counter: pick two. They choose fast and good, so the price goes up. Naming it openly stops the silent version where they expected all three.",
          "tradeoff": "Being upfront risks losing the customer who wanted the impossible; you trade a possible sale for not being blamed for an unfair expectation."
        },
        {
          "persona": "student",
          "scenario": "Your group wants the project done fast, easy, and top-grade in 2 weeks. You name the triangle: pick two. Choosing fast and good means it won't be easy — real hours are needed. The honest trade prevents the week-three blowup.",
          "tradeoff": "Naming it forces the group to commit real time now; you give up the comfortable illusion of an easy A."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner want the wedding cheap, quick, and dreamy. The triangle forces the honest talk: pick two. Choosing cheap and dreamy means it takes a year to plan. Naming it prevents resentment later.",
          "tradeoff": "Facing the trade means giving up one wish out loud; you trade a fantasy of having it all for a plan you both accept."
        },
        {
          "persona": "high-achiever",
          "scenario": "A client demands the redesign fast, cheap, and excellent in 6 weeks, and your confidence makes you believe you can defy the triangle. You can't; something gives silently. You put it on the table: pick two. Your ego was the risk.",
          "tradeoff": "Admitting you can't beat the triangle dents your can-do image; you sacrifice the hero pitch for a project that doesn't quietly break."
        },
        {
          "persona": "privileged",
          "scenario": "You assume money removes the triangle — you can buy fast, cheap, and good. But rushing a quality build for 3 months just burns cash and still slips. You accept the trade money can't erase and choose two openly.",
          "tradeoff": "Accepting the trade means a project that's not all three despite your budget; you trade the illusion of omnipotence for a realistic plan."
        }
      ],
      "featured": 0,
      "personalPrompt": "On your current project — a launch, a house move, or a wedding — which two of fast, cheap, and good are you actually choosing, and are you pretending you can have all three?",
      "pitfalls": [
        "The triangle is a simplification — scope, quality, and morale flex too — but its core truth (you can't max everything) holds.",
        "Refusing to choose two doesn't escape the trade-off; it just makes the third corner fail without warning."
      ]
    },
    {
      "id": "drexler-sibbet-team-performance",
      "name": "Drexler/Sibbet Team Performance",
      "category": "improve-others",
      "trigger": "\"New team, rough start\"",
      "essence": "Teams pass through 7 stages from orientation to renewal; friction is stage-specific, so is the fix",
      "visualType": "stage-curve",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your new 5-person shop team is tense and slow after 2 weeks and you fear you hired wrong. The model says early friction is the orientation stage, not a verdict. You invest in clarity of purpose and the team settles instead of fracturing.",
          "tradeoff": "Naming it a stage means tolerating weeks of discomfort; you trade the quick relief of blaming a hire for a team that matures."
        },
        {
          "persona": "student",
          "scenario": "Your group project is all friction in week 1 and you assume the group is doomed. The model reframes it as the trust-building stage. You spend a session on roles, and the tension eases into progress.",
          "tradeoff": "Investing a session in roles feels like lost time; you give up an hour of 'real work' for a group that stops fighting."
        },
        {
          "persona": "relationship",
          "scenario": "You and a new stepfamily clash constantly in the first months and you fear it'll never work. The model names it as an orientation stage — normal, not fatal. You focus on shared purpose and let the stage pass.",
          "tradeoff": "Treating the friction as a stage means patience when you want it fixed now; you trade the comfort of a verdict for a family that gets time to form."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your new team is slow and tense after a month and your instinct is to swap people. The model says you're reading a normal early stage as a talent problem. You name the stage aloud and build trust, resisting the urge to reshuffle.",
          "tradeoff": "Holding the team together costs you the decisive 'fix' of firing; you sacrifice the illusion of a quick reset for a team that grows through it."
        },
        {
          "persona": "privileged",
          "scenario": "You fund a new hand-picked team and expect instant brilliance for your money within weeks. Early friction reads to you as failure. The model says it's a stage; you invest in purpose and trust rather than throwing more resources at it.",
          "tradeoff": "Waiting out the stage means your money doesn't buy instant results; you trade the expectation of bought excellence for a team that actually gels."
        }
      ],
      "featured": 3,
      "personalPrompt": "For your team's current friction, which stage is it — and are you fixing the stage it's actually in, or the one you wish it were in?",
      "pitfalls": [
        "Stages aren't strictly linear; teams loop back, especially when membership changes — don't treat a slip as failure.",
        "Naming a stage isn't the fix; each stage needs a different intervention, so diagnose before you act."
      ],
      "steps": [
        "Orientation — why are we here?",
        "Trust building — who are you?",
        "Goal clarification — what are we doing?",
        "Commitment — how will we do it?",
        "Implementation — who does what, when, where?",
        "High performance — the team hits its stride.",
        "Renewal — why continue, and what changes next?"
      ]
    },
    {
      "id": "expectations-model",
      "name": "Expectations Model",
      "category": "improve-others",
      "trigger": "\"They're disappointed and I don't know why\"",
      "essence": "Disappointment = gap between what was expected and what was delivered; manage the expectation, not just the delivery",
      "visualType": "gap-bars",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A customer is unhappy though you did solid work on their ₹8,000 repair. Mapping expected against delivered, they'd pictured a same-day turnaround you never promised. The gap, not the work, was the problem. Next time you state the timeline up front.",
          "tradeoff": "Setting expectations up front risks scaring off a customer who wanted it faster; you trade a possible booking for not being blamed for an unspoken hope."
        },
        {
          "persona": "student",
          "scenario": "Your professor seems disappointed though your essay was good. The gap: they expected you to use last week's feedback, which you'd missed. You set expectations by asking exactly what they want next time.",
          "tradeoff": "Asking what's expected risks looking unsure; you give up appearing effortless for hitting the actual target."
        },
        {
          "persona": "relationship",
          "scenario": "Your partner is hurt though you thought the weekend went fine. Mapping it, they'd expected a real conversation you never knew was wanted. The disappointment was in the unspoken expectation. You start naming what you each want.",
          "tradeoff": "Surfacing expectations kills the romance of being 'just known'; you trade the fantasy of mind-reading for needs that actually get met."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your client is unhappy despite objectively excellent work over 3 months. Your competence made you assume the work would speak for itself; they'd expected weekly updates you never set up. The gap was expectation, not quality.",
          "tradeoff": "Managing expectations feels beneath work this good; you sacrifice the belief that excellence sells itself for a client who feels informed."
        },
        {
          "persona": "privileged",
          "scenario": "You fund a project generously and the team seems ungrateful after a year. The gap: they expected involvement and direction, not just a cheque. Your money set an expectation of partnership you didn't meet. You clarify your role.",
          "tradeoff": "Clarifying you're only funding, not leading, may disappoint them; you trade being the hero for an honest, met expectation."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the person who's disappointed in you, is the gap in what you delivered, or in an expectation you never actually set?",
      "pitfalls": [
        "Managing expectations can tip into under-promising so hard you look timid — calibrate, don't just sandbag.",
        "Expectations are often unspoken; you have to surface them early or you'll manage the wrong gap."
      ]
    },
    {
      "id": "future-of-decisions-model",
      "name": "Future-of-Decisions Model",
      "category": "improve-others",
      "trigger": "\"Will machines decide for us?\"",
      "essence": "A closing reflection: which decisions should you keep, automate, or delegate — choose deliberately",
      "visualType": "triage",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Running your shop, every tiny call comes to you and you're drowning by 3pm. You sort recurring decisions: what to stock stays yours (keep), reorder levels become a rule (automate), staff rota goes to your senior (delegate). Your judgement is freed for what needs it.",
          "tradeoff": "Delegating the rota risks a scheduling slip; you trade some control for the hours to run the actual business."
        },
        {
          "persona": "student",
          "scenario": "You agonise over every small study choice and burn out by week 4. You triage: what to focus on stays yours (keep), daily review becomes a fixed rule (automate), and a study app schedules spacing (delegate). Decision fatigue drops.",
          "tradeoff": "Automating your schedule risks a rigid plan on an off day; you give up flexibility for the energy real thinking needs."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner debate every household decision and it's exhausting. You sort: big moves stay joint (keep), the weekly menu becomes a rotating rule (automate), and each of you fully owns certain domains (delegate). Fewer negotiations, more peace.",
          "tradeoff": "Handing your partner full ownership of a domain means living with their choices; you trade veto power for far fewer daily negotiations."
        },
        {
          "persona": "high-achiever",
          "scenario": "You make every decision because you're best at all of them, and you're the bottleneck for 12 people. You triage: strategy stays yours (keep), approvals become rules (automate), hiring goes to a trusted lead (delegate). Your talent stops being the ceiling.",
          "tradeoff": "Delegating decisions you'd make better yourself means accepting good-enough calls; you sacrifice peak quality on each for a team that isn't blocked on you."
        },
        {
          "persona": "privileged",
          "scenario": "Everyone routes every choice to you because your say carries weight, and it consumes your days. You sort what only you should decide (keep), what can be standing policy (automate), and what a trusted deputy owns (delegate). You reclaim your attention.",
          "tradeoff": "Delegating decisions your name usually blesses risks a call you'd have made differently; you trade some influence for a life that isn't all approvals."
        }
      ],
      "featured": 3,
      "personalPrompt": "Of the decisions you make on repeat, which should you keep, which could you automate, and which could you delegate?",
      "pitfalls": [
        "Automating or delegating a decision you don't understand yet just hides a problem — keep it until you can specify it well.",
        "Convenience tempts you to hand off judgement calls that are actually the ones only you should make."
      ]
    },
    {
      "id": "second-order-thinking",
      "name": "Second-Order Thinking",
      "category": "mental-models",
      "trigger": "\"This looks obviously good\"",
      "essence": "And then what? Trace consequences of consequences before acting",
      "visualType": "concentric",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A delivery app dangles a ₹200 bonus for 15 extra trips tonight. 'And then what?' — your already-sore knee needs 3 days off next week, costing more shifts than the bonus pays. Tracing the second consequence, you skip it.",
          "tradeoff": "You give up ₹200 you could use this week; the cost is protecting a knee that earns you every future week."
        },
        {
          "persona": "student",
          "scenario": "A ₹500 pack of solved assignments would save you a weekend. 'And then what?' — the mid-term worth 30% tests the exact material you'd skip learning. The downstream exam makes the shortcut expensive.",
          "tradeoff": "You lose a free weekend to actually learn the unit; you pay in leisure to not fail the exam that copying can't sit for you."
        },
        {
          "persona": "relationship",
          "scenario": "Your sister asks to borrow ₹50,000 and yes feels kind. 'And then what?' — she's borrowed twice unpaid, and a third loan curdles into resentment at every family dinner for a year. The second-order cost is the bond, not the cash.",
          "tradeoff": "Offering help-in-kind instead of a loan risks looking stingy tonight; you trade her disappointment for a relationship that survives it."
        },
        {
          "persona": "high-achiever",
          "scenario": "You can close a ₹2-crore deal by promising a feature your team can't build in 3 months. 'And then what?' — you ship late, burn the client's trust and your delivery reputation, the thing that wins the next ten deals. Your closing skill hid the trap.",
          "tradeoff": "Walking back the promise loses this quarter's headline number; you sacrifice one visible win to protect the credibility that compounds."
        },
        {
          "persona": "privileged",
          "scenario": "A fast ₹1-crore donation to a flashy cause buys instant praise. 'And then what?' — the charity can't absorb it, half is wasted, and your name attaches to a failure the press finds in a year. The real effect is reputational.",
          "tradeoff": "Funding capacity first delays the applause you'd enjoy now; you trade a quick headline for money that actually lands."
        }
      ],
      "featured": 3,
      "personalPrompt": "For the move that looks obviously good, what's the consequence of the consequence you haven't traced yet?",
      "pitfalls": [
        "You can chase ripples forever — go far enough to change the decision, then act; endless second-guessing is its own failure.",
        "First-order thinking is fast and often right; reserve deep tracing for choices that are hard to reverse."
      ]
    },
    {
      "id": "inversion",
      "name": "Inversion",
      "category": "mental-models",
      "trigger": "\"I can't see the risks\"",
      "essence": "Ask what would guarantee failure, then avoid exactly that",
      "visualType": "mirror",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You want your new tiffin service to keep customers. Inverting: what guarantees they cancel? Late delivery, cold food, ignored complaints. You fix exactly those 3 in month one before adding fancy dishes.",
          "tradeoff": "You spend the first month on boring reliability instead of exciting menu items; you trade novelty for the retention that pays rent."
        },
        {
          "persona": "student",
          "scenario": "You want to pass your driving test in 2 weeks. Inverted: what fails people? Stalling on the hill, missed mirror checks, panicking at the parallel park. You drill those 3 instead of joyriding.",
          "tradeoff": "You give up the fun of open-road practice for repetitive maneuvers; you pay in boredom to not lose the ₹1,500 re-test fee."
        },
        {
          "persona": "relationship",
          "scenario": "You want your marriage to last. Inverting: what kills marriages? Contempt, stonewalling, never repairing after a fight. You catch yourself stonewalling your wife after Tuesday's argument and repair it that night.",
          "tradeoff": "Naming your own worst pattern out loud costs your pride; you trade the comfort of blaming her for owning the thing you control."
        },
        {
          "persona": "high-achiever",
          "scenario": "You want your startup to survive 5 years and instinctively list growth tactics. Inverting exposes what actually kills startups: co-founder blowups, running out of cash, building what no one wants. You fix the founder agreement first.",
          "tradeoff": "Spending week one on a dull cap-table talk delays product work; you sacrifice momentum to remove the failure that ends most smart teams."
        },
        {
          "persona": "privileged",
          "scenario": "You want your family name respected 50 years after you're gone. Inverting: what destroys dynasties? Entitled heirs, a public scandal, a feud over the will between your son and daughter. You spend on your children's character, not just their trust funds.",
          "tradeoff": "Making heirs earn responsibility risks their resentment now; you trade their short-term comfort for a name that outlives the money."
        }
      ],
      "featured": 2,
      "personalPrompt": "For the goal you're chasing, what would reliably guarantee failure — and are you accidentally doing any of it?",
      "pitfalls": [
        "Avoiding failure isn't the same as achieving greatness — inversion prevents disasters but won't design the win on its own.",
        "The list of failure modes can get long; focus on the few you're actually at risk of committing."
      ]
    },
    {
      "id": "pre-mortem",
      "name": "Pre-Mortem",
      "category": "mental-models",
      "trigger": "\"Plan feels solid… too solid\"",
      "essence": "Assume the project already failed; write the story of why. Fix those causes now",
      "visualType": "timeline",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Before signing up for a ₹30,000 gym membership, you imagine it's a year later and you quit in month 2. Why? It's 40 minutes away, you go alone, mornings are chaos. You pick a closer gym and a buddy before paying.",
          "tradeoff": "The closer gym has worse equipment; you trade fancy machines for the location that keeps you actually going."
        },
        {
          "persona": "student",
          "scenario": "Before your 6-month thesis, you pretend it already failed. The story: you left it to the last month and data collection ran over. So you start collecting data in week 1.",
          "tradeoff": "Front-loading the dull data work steals early weeks you'd rather spend reading; you pay in early grind to avoid a March panic."
        },
        {
          "persona": "relationship",
          "scenario": "Before moving in with your partner, you imagine the breakup 12 months on. The likely cause: unspoken resentment over who pays for what. So you have the awkward budget talk before the lease.",
          "tradeoff": "Raising money before romance risks a cold conversation now; you trade one uncomfortable evening for the fight you'd have in month six."
        },
        {
          "persona": "high-achiever",
          "scenario": "Before your confident product launch, you run the pre-mortem your optimism resists. The failure story, set 6 months out: so sure of the vision, you never tested pricing, and churn killed it. You run a 2-week pricing test first.",
          "tradeoff": "Testing delays your triumphant launch by weeks; you sacrifice the dramatic reveal to catch the failure your confidence was hiding."
        },
        {
          "persona": "privileged",
          "scenario": "Before endowing a ₹10-crore institute, you imagine it hollow in a decade. The cause: you funded the building but not the people to run it. So you endow salaries, not just marble.",
          "tradeoff": "Spending on unglamorous operating costs means a plainer building; you trade a grand monument for one that actually works."
        }
      ],
      "featured": 2,
      "personalPrompt": "Imagine the thing you're about to commit to — a project, a move, a relationship — has already failed a year from now; what's the most likely story of why, and what can you fix today?",
      "pitfalls": [
        "A plan that feels too solid is exactly the one that hides its risks — the smoother it looks, the more you need this.",
        "Pre-mortems can list every conceivable disaster; prioritise the failures that are both likely and fixable now."
      ]
    },
    {
      "id": "regret-minimization",
      "name": "Regret Minimization",
      "category": "mental-models",
      "trigger": "\"Big life fork\"",
      "essence": "Project to age 80 and ask which choice you'd regret NOT taking",
      "visualType": "timeline",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "At 34 you're scared to leave a stable ₹40,000 job for a shot at your own repair shop. Projecting to 80, the regret that looms isn't a failed shop — it's never trying. You give it a bounded 12-month attempt.",
          "tradeoff": "The attempt risks a year's savings and the safe salary; you trade security now for a regret you won't carry at 80."
        },
        {
          "persona": "student",
          "scenario": "You're too shy to ask the professor for a research spot, afraid of the 'no.' At 80, the unasked question is the regret, not the rejection. You email her Friday.",
          "tradeoff": "Asking risks a bruising rejection this week; you pay a little pride to avoid a lifelong 'what if.'"
        },
        {
          "persona": "relationship",
          "scenario": "You've loved a friend for 2 years but fear that saying so ends the friendship. Projecting to 80, unspoken love is the heavier regret. You tell them, prepared for either answer.",
          "tradeoff": "Speaking up may cost you the friendship as it is; you risk a comfortable present for a truthful future."
        },
        {
          "persona": "high-achiever",
          "scenario": "You've built a career others envy but always wanted to write a novel, endlessly 'not the right time.' At 80, the unwritten book is the regret success can't offset. You block Sunday mornings to write.",
          "tradeoff": "The writing time comes out of career momentum you're proud of; you trade some professional edge for the thing you'd regret skipping."
        },
        {
          "persona": "privileged",
          "scenario": "You could fund anything but keep deferring reconciliation with an estranged brother, telling yourself there's time. At 80, the unmended rift is the one thing money can't buy back. You call him this month.",
          "tradeoff": "Reaching out risks his rejection and reopening old wounds; you trade your pride for a chance the years won't return."
        }
      ],
      "featured": 0,
      "personalPrompt": "At eighty, looking back, which version of this choice would you regret NOT having taken?",
      "pitfalls": [
        "Regret minimisation biases toward bold action, which isn't always wise — pair it with a real check on downside and reversibility.",
        "Your imagined eighty-year-old is a guess; don't let a romantic future-self talk you past genuine present-day constraints."
      ]
    },
    {
      "id": "ooda-loop",
      "name": "OODA Loop",
      "category": "mental-models",
      "trigger": "\"Situation changing faster than my plans\"",
      "essence": "Observe → Orient → Decide → Act, faster than the situation changes; orientation is the crux",
      "visualType": "cycle",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your food cart's regular corner gets blocked by 3 weeks of roadwork. Instead of waiting and losing income, you loop fast: see the barricades, reorient, move to the metro exit, act — and re-check daily as the work shifts.",
          "tradeoff": "Moving daily costs you the loyal regulars who knew your old spot; you trade a familiar corner for the footfall that pays this week."
        },
        {
          "persona": "student",
          "scenario": "A week before finals the professor switches the exam from essays to a viva. You don't cling to essay notes: you observe, reorient to spoken answers, practice aloud with a friend, and adjust nightly.",
          "tradeoff": "Switching prep style late throws away hours of essay-shaped notes; you sacrifice sunk study for the format actually being tested."
        },
        {
          "persona": "relationship",
          "scenario": "Your teenage son suddenly goes quiet and withdrawn. Instead of running last year's nagging playbook, you observe the change, reorient, try listening over lecturing, and adjust as he responds across the week.",
          "tradeoff": "Dropping the rules you trusted risks feeling like lost authority; you trade control for the connection that stale tactics were losing."
        },
        {
          "persona": "high-achiever",
          "scenario": "A competitor's launch reframes your market overnight and your detailed 5-year roadmap is now a liability. You loop faster than they can: observe, reorient assumptions, decide a focused counter, act, loop again.",
          "tradeoff": "Reorienting means abandoning a roadmap you sold the board on; you pay in credibility for staying alive as reality moves."
        },
        {
          "persona": "privileged",
          "scenario": "Your family fund's blue-chip thesis breaks when a regulation shifts in 2 weeks. Wealth tempts you to wait it out; instead you loop fast: read the shift, reorient the portfolio, act, re-check as rules settle.",
          "tradeoff": "Moving early risks acting on an incomplete picture and real losses; you trade the comfort of patience for not being last to adjust."
        }
      ],
      "featured": 3,
      "personalPrompt": "In the fast-changing situation you're in, is your plan updating as fast as reality, or are you acting on last week's orientation?",
      "pitfalls": [
        "Orientation is the crux and the easiest step to skip — acting on stale assumptions just loops you faster into the wrong place.",
        "Speed without direction is thrashing; loop fast, but make sure each Orient step actually incorporates new information."
      ],
      "steps": [
        "Observe — take in what's actually happening now.",
        "Orient — update your mental model with the new information.",
        "Decide — choose a response from your updated picture.",
        "Act — commit, then loop back to observe the result."
      ]
    },
    {
      "id": "10-10-10",
      "name": "10/10/10",
      "category": "mental-models",
      "trigger": "\"Emotions running the decision\"",
      "essence": "How will I feel in 10 minutes / 10 months / 10 years?",
      "visualType": "timeline",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A rude customer just insulted your cooking and you're about to snap back. 10/10/10: in 10 minutes you'd feel vindicated; in 10 months a viral bad review haunts you; in 10 years the stall's name still carries it. You stay calm and refund.",
          "tradeoff": "Swallowing the retort costs you the satisfaction of being right tonight; you pay in pride to protect a reputation that outlasts one rude man."
        },
        {
          "persona": "student",
          "scenario": "Your group partner ghosted the project and you want to blast them in the class chat. 10/10/10: 10 minutes of triumph, 10 months of a toxic reputation, 10 years it fades but the pattern sticks. You raise it privately with the tutor.",
          "tradeoff": "The private route denies you a public win; you trade a moment of justice for not becoming the person who torches group chats."
        },
        {
          "persona": "relationship",
          "scenario": "Mid-argument, your partner leaves you a perfect cruel line to fire back. 10/10/10: 10 minutes even, 10 months a scar, 10 years a fault line. You breathe and don't say it.",
          "tradeoff": "Holding the cruel line back feels like losing the fight; you trade winning the argument for keeping the marriage."
        },
        {
          "persona": "high-achiever",
          "scenario": "A junior publicly questioned your call and your ego wants to crush them in the meeting. 10/10/10: 10 minutes of dominance, 10 months of a team that stops speaking up, 10 years a reputation as a bully. You thank them for the challenge.",
          "tradeoff": "Not asserting dominance now costs a flash of status; you sacrifice ego for a team that keeps telling you the truth."
        },
        {
          "persona": "privileged",
          "scenario": "A rival at the gala slighted you and one word to the right person could bury them. 10/10/10: 10 minutes sweet, 10 months a feud, 10 years a name known for vendettas. You let it pass.",
          "tradeoff": "Declining to retaliate leaves the slight unanswered; you trade the pleasure of revenge for a reputation revenge would stain."
        }
      ],
      "featured": 2,
      "personalPrompt": "For the emotionally charged choice in front of you, how will you feel about it in ten minutes, ten months, and ten years?",
      "pitfalls": [
        "The tool defuses heat-of-the-moment reactions but can also over-rationalise a decision that genuinely needs feeling — use judgement.",
        "Guessing the ten-year horizon is speculative; weight the nearer horizons you can actually foresee."
      ]
    },
    {
      "id": "circle-of-competence",
      "name": "Circle of Competence",
      "category": "mental-models",
      "trigger": "\"Am I qualified to judge this?\"",
      "essence": "Know the boundary of what you truly understand; act inside it, get help outside it",
      "visualType": "concentric",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A cousin pitches you a ₹3-lakh crypto 'sure thing.' You map your circle honestly: you know your electrician's trade cold, crypto not at all. You're outside the circle, so you pass rather than pretend.",
          "tradeoff": "Passing means watching from the sidelines if it moons; you trade a possible windfall for not betting rent money on something you can't judge."
        },
        {
          "persona": "student",
          "scenario": "Everyone's picking the AI elective for the hype. You know you understand systems design, not statistics, and the course is 70% stats. You pick the systems track over the fashionable one.",
          "tradeoff": "You give up the buzzword on your CV; you trade a trendy label for a grade you can actually earn."
        },
        {
          "persona": "relationship",
          "scenario": "Your friend, mid-divorce, wants your legal advice. You know friendship, not family law. Instead of confidently guessing and risking her case, you help her find a real lawyer.",
          "tradeoff": "Saying 'I don't know' feels less helpful than a confident opinion; you trade looking wise for not steering her wrong on something that shapes her life."
        },
        {
          "persona": "high-achiever",
          "scenario": "A brilliant surgeon, you're sure that intelligence transfers to stocks and nearly bet ₹50 lakh on your own analysis. The circle reminds you competence is domain-specific. You hire an advisor instead.",
          "tradeoff": "Deferring to an advisor dents the self-image that your mind wins everywhere; you pay in ego to protect a fortune your gut can't manage."
        },
        {
          "persona": "privileged",
          "scenario": "You could fund a biotech venture on instinct, and money makes everyone agree with you. You map the circle: you understand real estate, not molecular biology. You bring in a scientist partner before writing the cheque.",
          "tradeoff": "Sharing control dilutes your say and your returns; you trade autonomy for a bet judged by someone who actually knows the field."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the call you're about to make, are you inside the circle of what you truly understand — and if not, whose competence will you borrow?",
      "pitfalls": [
        "The dangerous zone is the edge, where you know just enough to feel confident and not enough to be right.",
        "Circles can grow with real study — 'outside my circle' is a reason to learn or get help, not always to quit."
      ]
    },
    {
      "id": "sunk-cost-fallacy",
      "name": "Sunk Cost Fallacy",
      "category": "cognitive-biases",
      "trigger": "\"…but I've already put so much in\" ← that sentence is the alarm",
      "essence": "Past investment is gone either way; judge only future costs vs future benefits",
      "visualType": "anchor",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You've paid ₹15,000 into a 6-month course you now hate and tell yourself you can't waste it. The money's gone either way; the only question is whether the next 3 months are worth your evenings. They aren't, so you quit.",
          "tradeoff": "Quitting makes the ₹15,000 feel wasted and family may call it flaky; you trade the sting of admitting a loss for 3 months of your life back."
        },
        {
          "persona": "student",
          "scenario": "You've spent 2 years on a degree you've realized you don't want. 'I can't switch now' is the sunk cost talking. The 2 years are spent regardless; the real question is the next 30 years. You switch.",
          "tradeoff": "Switching costs you a graduation date and a year's fees; you pay a visible price now to not spend a career in the wrong field."
        },
        {
          "persona": "relationship",
          "scenario": "You've dated someone 4 years and stay partly because 'we've invested so much.' The years are gone; staying another decade out of accounting isn't love. You have the honest talk.",
          "tradeoff": "Leaving means walking away from a shared history and mutual friends; you trade the comfort of the familiar for a chance at the right person."
        },
        {
          "persona": "high-achiever",
          "scenario": "You've poured 8 months and your reputation into a product no one's buying, and pride says push harder. The 8 months are sunk; competence has curdled into stubbornness. You kill it and redeploy the team.",
          "tradeoff": "Killing your own high-profile bet publicly admits it failed; you sacrifice ego for the runway the next idea needs."
        },
        {
          "persona": "privileged",
          "scenario": "Your family has propped up a loss-making heritage hotel for a decade out of sentiment, sinking millions. The past money is gone; each year adds fresh loss. You finally sell.",
          "tradeoff": "Selling severs a family legacy and draws relatives' anger; you trade heritage sentiment for stopping a bleed the money masked."
        }
      ],
      "featured": 2,
      "personalPrompt": "Where are you continuing something mainly because of what you've already spent, when the future costs no longer justify it?",
      "pitfalls": [
        "The past investment feels like a reason to continue precisely because walking away makes it feel wasted — but it's already gone.",
        "The opposite error exists too: quitting the moment things get hard and calling it 'avoiding sunk cost'. Judge future value honestly, both ways."
      ]
    },
    {
      "id": "confirmation-bias",
      "name": "Confirmation Bias",
      "category": "cognitive-biases",
      "trigger": "You feel satisfied by evidence",
      "essence": "You seek what agrees with you. Cue: actively hunt one disconfirming fact before deciding",
      "visualType": "funnel",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Sure your ₹50,000 second-hand car is a great deal, you only read the glowing reviews and feel pleased. That pleasure is the cue. You deliberately search '[model] common problems' and find a gearbox fault worth ₹40,000.",
          "tradeoff": "Hunting the bad news risks killing a purchase you were excited about; you trade the thrill of the buy for not inheriting a ₹40,000 repair."
        },
        {
          "persona": "student",
          "scenario": "Convinced your essay argument is airtight, you only cite sources that agree. The comfort is the warning. You go find the 3 strongest papers against you, and engaging them lifts your grade a whole band.",
          "tradeoff": "Seeking the counter-argument means rewriting a section you loved; you pay in ego and effort for an argument that actually holds."
        },
        {
          "persona": "relationship",
          "scenario": "Certain your partner is distant because they've lost interest, you notice only the cold moments. You go looking for the disconfirming fact and learn they're quietly frightened about a parent's illness.",
          "tradeoff": "Testing your story risks learning you misjudged them; you trade the certainty of your grievance for the truth that changes everything."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your data confirms your pet strategy and you feel smart scanning the dashboard you chose. That satisfaction is the tell. You force yourself to the one cohort you skipped — the 8% who churned in week 2 — and it tells a harder, truer story.",
          "tradeoff": "Chasing the disconfirming metric may dethrone the strategy you're known for; you sacrifice a flattering narrative for a real one."
        },
        {
          "persona": "privileged",
          "scenario": "Advisors who agree with you are easy to hear, and money buys endless agreement. Suspicious of the echo, you pay a contrarian for 3 months specifically to attack your thesis, and they find the flaw the yes-men missed.",
          "tradeoff": "Inviting attack on your judgement is uncomfortable and slows the decision; you trade the ease of applause for a decision that survives scrutiny."
        }
      ],
      "featured": 2,
      "personalPrompt": "On the belief you're most comfortable with, what's one disconfirming fact you could actively go looking for before you decide?",
      "pitfalls": [
        "The feeling of being confirmed is pleasant, which is exactly why the bias is hard to notice from inside.",
        "Hunting for disconfirmation half-heartedly doesn't count; you have to genuinely try to prove yourself wrong."
      ]
    },
    {
      "id": "loss-aversion",
      "name": "Loss Aversion",
      "category": "cognitive-biases",
      "trigger": "Fear of losing outweighs identical gain",
      "essence": "Losses hurt ~2x more than equal gains feel good; reframe as gains forgone",
      "visualType": "tension",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You cling to a ₹12,000 stall spot that barely breaks even because leaving feels like losing your corner. Reframed: keeping it forfeits the better ₹20,000 pitch you keep eyeing. The loss you fear is the smaller one.",
          "tradeoff": "Moving risks the new pitch underperforming and losing a known quantity; you trade a familiar break-even for a bet on more."
        },
        {
          "persona": "student",
          "scenario": "You keep a ₹5,000 scholarship-tied elective you hate because dropping it feels like losing the money. Reframed, staying forfeits the elective that would actually get you hired. The bigger loss is invisible.",
          "tradeoff": "Switching may cost the scholarship and a term's progress; you pay a countable loss to stop an uncountable one."
        },
        {
          "persona": "relationship",
          "scenario": "You stay in a lukewarm 3-year relationship because ending it feels like a loss, while the equal gain — freedom to find better — barely registers. Naming that losses feel double, you see staying is the real loss.",
          "tradeoff": "Leaving means grieving something not terrible and facing being alone; you trade the safety of 'fine' for the possibility of good."
        },
        {
          "persona": "high-achiever",
          "scenario": "You refuse to cut a feature the team built because scrapping it feels like losing 3 months of work, though shipping it drags the whole product down. Loss aversion, not logic, is steering. You cut it.",
          "tradeoff": "Cutting forfeits visible effort and a teammate's pride; you sacrifice a sunk feeling for a product that's actually better."
        },
        {
          "persona": "privileged",
          "scenario": "You hold a sentimental but sinking ₹5-crore stake because selling crystallizes a 'loss,' while the equal gain of redeploying it goes unfelt. Reframed, holding is the loss. You sell.",
          "tradeoff": "Selling locks in a paper loss and admits a bad call; you trade a bruised ego for capital that can finally work."
        }
      ],
      "featured": 2,
      "personalPrompt": "Where is the fear of a loss looming twice as large as an equal gain — and what does the choice look like if you reframe it as gains forgone?",
      "pitfalls": [
        "Reframing gains and losses can be gamed by whoever sets the frame — including you talking yourself into a bad call.",
        "Loss aversion sometimes protects you (real losses hurt); the goal is proportion, not ignoring downside entirely."
      ]
    },
    {
      "id": "planning-fallacy",
      "name": "Planning Fallacy",
      "category": "cognitive-biases",
      "trigger": "\"This time will be different\"",
      "essence": "We underestimate time/cost/risk (Kahneman & Tversky). Cue: use your own track record or ask an outside observer — observers overestimate, you underestimate; meet in the middle",
      "visualType": "gantt",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You budget 1 weekend to repaint the flat because 'it's just one room.' Your last 3 paint jobs each took 3 weekends. You use the record, block 3 weekends, and for once finish on time.",
          "tradeoff": "Booking 3 weekends means declining other plans you'd have kept; you trade optimism's freedom for a deadline you actually hit."
        },
        {
          "persona": "student",
          "scenario": "You plan to write your 5,000-word report in 2 days before the deadline, as always. Your history says it takes a week. You start a week out and skip the all-nighter.",
          "tradeoff": "Starting early eats days you'd rather spend free; you pay in leisure now to avoid the 3am panic later."
        },
        {
          "persona": "relationship",
          "scenario": "You promise your spouse the kitchen renovation will take 'a month, tops.' Every past project of yours ran double. You quote 2 months instead, and the marriage survives the delay you didn't over-promise.",
          "tradeoff": "The honest longer estimate disappoints them today; you trade a happy promise now for not breaking one in month two."
        },
        {
          "persona": "high-achiever",
          "scenario": "Confident and fast, you tell the board the migration ships in 4 weeks. Your own last three shipped in 10+. Your competence fuels the optimism that keeps burning you. You quote 10 and add a buffer.",
          "tradeoff": "The realistic number looks less impressive to the board; you sacrifice a bold promise for a delivery date you'll actually meet."
        },
        {
          "persona": "privileged",
          "scenario": "You fund a '6-month' building of your foundation's new wing, trusting instinct over the record of such projects running years. You plan for 18 months and staff accordingly.",
          "tradeoff": "Budgeting 18 months ties up capital and patience longer; you trade a fast fantasy for a plan reality won't wreck."
        }
      ],
      "featured": 3,
      "personalPrompt": "For your current estimate, what does your own track record on similar work say, and what would an outside observer guess?",
      "pitfalls": [
        "'This time is different' is the fallacy's signature line — your reasons for optimism are usually the same ones that failed last time.",
        "Outside observers over-correct pessimistically; the honest number is often between your guess and theirs, not either extreme."
      ]
    },
    {
      "id": "anchoring",
      "name": "Anchoring",
      "category": "cognitive-biases",
      "trigger": "First number sticks",
      "essence": "Whatever you heard first is dragging your estimate. Cue: estimate before you look",
      "visualType": "spectrum",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "A used-bike seller opens at ₹80,000 and ₹65,000 suddenly feels cheap. You catch the anchor and recall your own pre-quote budget of ₹50,000. You negotiate from your number, not his.",
          "tradeoff": "Holding to ₹50,000 risks losing the bike to a faster buyer; you trade the sure purchase for not overpaying ₹15,000 on a dragged anchor."
        },
        {
          "persona": "student",
          "scenario": "A 'recommended' ₹8,000 tutoring package makes the ₹6,000 one feel like a steal. You realize you'd budgeted ₹3,000 before seeing either. You buy only the sessions you planned.",
          "tradeoff": "The smaller package means fewer sessions and a nagging 'what if'; you pay in reassurance for not being priced by their anchor."
        },
        {
          "persona": "relationship",
          "scenario": "In a fight, your partner's extreme opening demand makes their 'compromise' feel reasonable, though it's still far past fair. You anchor to what you'd have called fair before the row, and negotiate from there.",
          "tradeoff": "Refusing their frame prolongs the argument tonight; you trade a quick truce for an agreement that isn't rigged by their first number."
        },
        {
          "persona": "high-achiever",
          "scenario": "A vendor opens at $50k and your trained mind starts optimizing around it, even naming $35k a 'win.' You recall your own pre-call estimate of $20k and negotiate from your anchor, not theirs.",
          "tradeoff": "Anchoring low risks the vendor walking; you trade a smooth deal for not overpaying $15k because they spoke first."
        },
        {
          "persona": "privileged",
          "scenario": "An art dealer opens at ₹2 crore and ₹1.5 feels like a bargain your wealth can absorb. You recall the ₹80 lakh you'd have valued it at cold, and bid your number.",
          "tradeoff": "Bidding low may lose the piece to another collector; you trade the trophy for not letting a dealer's anchor set your fortune's price."
        }
      ],
      "featured": 3,
      "personalPrompt": "What first number are you unconsciously negotiating around, and what would you have estimated before you ever heard it?",
      "pitfalls": [
        "Anchors work even when you know about them — awareness helps a little, but forming your own estimate first helps far more.",
        "You can anchor yourself with your own first guess; hold early estimates loosely as new information arrives."
      ]
    },
    {
      "id": "hindsight-bias",
      "name": "Hindsight Bias",
      "category": "cognitive-biases",
      "trigger": "\"I knew it all along\"",
      "essence": "Outcomes edit memory. Cue: decision journal — write reasoning down BEFORE the outcome",
      "visualType": "timeline",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your ₹1-lakh investment tanks and your brother says he 'knew it was dodgy.' So did you, supposedly — but your note from 3 months ago says you were thrilled. The record stops you learning a fake lesson.",
          "tradeoff": "Keeping a written prediction means facing proof you were wrong; you trade a flattering memory for a real lesson."
        },
        {
          "persona": "student",
          "scenario": "You fail an exam and within an hour feel you 'always knew' that topic would come up. Your pre-exam study plan, written 2 weeks earlier, shows you skipped it as unlikely. The note teaches the true gap, not a comforting story.",
          "tradeoff": "Confronting your own written misjudgement stings; you pay in ego to fix the actual weakness."
        },
        {
          "persona": "relationship",
          "scenario": "A friendship blows up and everyone says the signs were 'obvious.' Your messages from last month show you were genuinely surprised. The record keeps you from mislabeling a good friend as an obvious villain.",
          "tradeoff": "Admitting you didn't see it coming feels naive; you trade the comfort of 'I knew' for fairness to them and yourself."
        },
        {
          "persona": "high-achiever",
          "scenario": "Your bet pays off and you rewrite the memory as brilliant foresight, not the coin-flip it was. Your decision note shows you were only 55% sure. It keeps you from over-trusting a gut that got lucky.",
          "tradeoff": "Crediting luck over genius punctures your winning self-image; you sacrifice a flattering story to not bet the next one recklessly."
        },
        {
          "persona": "privileged",
          "scenario": "Your funded venture succeeds and the myth grows that your judgement is golden. Your written 60% confidence says otherwise. The record keeps the wealth-built legend from replacing real calibration.",
          "tradeoff": "Deflating your own legend costs the aura that opens doors; you trade mystique for judgement you can actually trust."
        }
      ],
      "featured": 3,
      "personalPrompt": "Before your next outcome lands, where will you write down your actual reasoning so hindsight can't rewrite it?",
      "pitfalls": [
        "The edited memory feels completely genuine — you truly believe you knew, which is why only a written record can correct it.",
        "Hindsight bias also makes others' failures look obvious and blameworthy; extend the same doubt to their foresight as to your own."
      ]
    },
    {
      "id": "implementation-intentions",
      "name": "Implementation Intentions",
      "category": "attention",
      "trigger": "\"I intend to, but never do\"",
      "essence": "If [specific cue], then [one concrete action]. Delegates initiation to the cue, not willpower",
      "visualType": "flow",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You keep meaning to walk but never do. You set: 'If I finish dinner, then I lace up and walk to the end of the street.' Within a week the after-dinner cue starts the walk, not your willpower.",
          "tradeoff": "Committing the cue means giving up the couch you'd rather sink into; you trade evening comfort for the habit that finally sticks."
        },
        {
          "persona": "student",
          "scenario": "You never start revising. You set: 'If the 2pm lecture ends, then I go straight to the library for one page of notes.' The cue does the starting your motivation never did.",
          "tradeoff": "The fixed rule costs you the spontaneous free afternoon; you pay in flexibility for a habit that runs without daily debate."
        },
        {
          "persona": "relationship",
          "scenario": "You keep meaning to call your aging mother but forget for weeks. You set: 'If it's Sunday 6pm, then I call Mum before dinner.' The cue turns good intentions into a call she can count on.",
          "tradeoff": "A scheduled call risks feeling less spontaneous; you trade the romance of 'whenever' for a call that actually happens weekly."
        },
        {
          "persona": "high-achiever",
          "scenario": "You keep 'planning to think strategically' and never do amid the busywork you're good at. You set: 'If it's 8am Monday, then I close the laptop and write next quarter's one priority.' The cue beats your own productivity trap.",
          "tradeoff": "The protected block forfeits an hour of reactive work that feels productive; you sacrifice visible busyness for the thinking that matters."
        },
        {
          "persona": "privileged",
          "scenario": "You mean to mentor your successor but your packed calendar always wins. You set: 'If it's the first Friday, then I spend the morning walking a grantee visit with my heir.' The cue makes succession real, not aspirational.",
          "tradeoff": "Blocking that morning costs a slot others compete for; you trade present demands for an heir who's actually ready."
        }
      ],
      "featured": 2,
      "personalPrompt": "For the intention you keep failing to act on, what's the specific if-this-then-that that would hand the starting over to a cue?",
      "pitfalls": [
        "Vague triggers ('when I have time') don't fire — the cue has to be concrete and unavoidable, tied to something that already happens.",
        "One built-in escape hatch ('unless I'm tired') quietly cancels the whole plan; keep the then-action tiny and non-negotiable."
      ],
      "steps": [
        "Name the cue — a specific, already-recurring moment.",
        "Name one concrete action — small enough to do immediately.",
        "Wire them: 'If [cue], then [action].'"
      ]
    },
    {
      "id": "deep-work",
      "name": "Deep Work",
      "category": "attention",
      "trigger": "\"Shallow busywork all day\"",
      "essence": "Focus without distraction on a cognitively demanding task; valuable BECAUSE rare (Newport). Time-block it",
      "visualType": "gantt",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your evenings dissolve into TV and phone, and the small-business plan you dream of never gets written. You block 90 minutes each Sunday, phone in another room, for exactly that. Two focused hours beat a scattered month.",
          "tradeoff": "The block costs you your one guaranteed slot of switch-off time; you trade some rest for the project that never happened otherwise."
        },
        {
          "persona": "student",
          "scenario": "Your study 'hours' are really Instagram with a book open, so nothing sticks. You block two phone-free hours each morning for the hardest subject. Rare real focus outlearns a distracted all-day.",
          "tradeoff": "Going phone-free means missing the group chat and some FOMO; you pay in connection for the grades scattered study can't deliver."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner are always 'together' but half-present on screens, drifting. You block a weekly 2-hour, device-free dinner. Undistracted attention rebuilds what background time couldn't.",
          "tradeoff": "Protecting that block means saying no to other invitations; you trade some social breadth for depth with the person who matters most."
        },
        {
          "persona": "high-achiever",
          "scenario": "You clear 40 emails a day and feel productive while the hard architecture problem, the actual lever, slips for months. You block 2 protected morning hours for it, notifications off.",
          "tradeoff": "Ignoring the inbox for two hours means slower replies and a mild reputation ding; you sacrifice responsiveness for the work that compounds."
        },
        {
          "persona": "privileged",
          "scenario": "You could buy any tool but your scarce asset is uninterrupted thought, drowned by 30 daily 'urgent' asks. You block one protected half-day a week for the strategy only you can set.",
          "tradeoff": "The blocked half-day disappoints people used to instant access; you trade present availability for the thinking your role needs."
        }
      ],
      "featured": 3,
      "personalPrompt": "What one demanding thing — a work problem, a hard conversation to prepare, a creative project — deserves a protected, distraction-free block this week, and when will you schedule it?",
      "pitfalls": [
        "Deep work is valuable because it's rare — the whole world is engineered to interrupt it, so the block has to be defended deliberately.",
        "Not all work is deep work; trying to make everything a focus block ignores the shallow tasks that also genuinely need doing."
      ]
    },
    {
      "id": "environment-design",
      "name": "Environment Design",
      "category": "attention",
      "trigger": "\"Willpower keeps losing\"",
      "essence": "Change the room, not the resolve: add friction to distractions, remove friction from the goal",
      "visualType": "sliders",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Willpower keeps losing to late-night snacking. Instead of resolving harder, you move the biscuits to a high shelf and put fruit at eye level. By 11pm the easy choice is the good one.",
          "tradeoff": "The rearrangement costs you the instant comfort of a midnight biscuit; you trade a small pleasure for a habit that runs itself."
        },
        {
          "persona": "student",
          "scenario": "You mean to study but the phone wins every night. Starting Monday you charge it in the kitchen and leave the textbook open on your desk. The setup starts the study session your discipline couldn't.",
          "tradeoff": "Banishing the phone means missing instant messages; you pay in connectivity for a room that pulls you toward the book."
        },
        {
          "persona": "relationship",
          "scenario": "You keep scrolling in bed instead of talking to your partner. You put a charging dock in the hallway so phones don't enter the bedroom. The friction hands the evening back to each other.",
          "tradeoff": "No phone in the bedroom means no late-night browsing you enjoy; you trade a private habit for shared attention."
        },
        {
          "persona": "high-achiever",
          "scenario": "You resolve daily to stop context-switching and fail by 10am. Instead of more willpower, you close Slack by default and use a single-task screen. The environment does what discipline couldn't.",
          "tradeoff": "Closing Slack means colleagues wait longer for you; you sacrifice some responsiveness for the deep output the switching killed."
        },
        {
          "persona": "privileged",
          "scenario": "Endless access to everything scatters you. You design a phone-free study, a locked calendar, an assistant who batches requests into two windows a day. Your surroundings, not your restraint, protect your focus.",
          "tradeoff": "The barriers make you less reachable and some people bristle; you trade open access for the attention your work demands."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the habit you keep losing to, what one piece of friction could you add to the distraction or remove from the goal?",
      "pitfalls": [
        "Designing the environment once isn't enough — distractions creep back in, so the setup needs occasional maintenance.",
        "You can over-engineer your surroundings into a fragile system; a couple of high-leverage friction changes beat twenty fiddly ones."
      ]
    },
    {
      "id": "ulysses-pact",
      "name": "Ulysses Pact",
      "category": "attention",
      "trigger": "\"I'll cave in the moment\"",
      "essence": "Bind your future self while you're rational: blockers, stakes, third-party locks. Match the constraint to the specific temptation; include a sane emergency exit",
      "visualType": "constraint",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "You know payday means you'll splurge and save nothing. While calm, you set an auto-transfer of ₹5,000 to a locked savings the morning salary lands. Your future self can't touch it easily.",
          "tradeoff": "The auto-lock means less cash for the month's temptations; you trade spending freedom for savings your weaker self can't raid."
        },
        {
          "persona": "student",
          "scenario": "You know you'll doom-scroll during exam week. While clear-headed you install a blocker until 6pm with a password your roommate holds. The pact binds the self that would cave.",
          "tradeoff": "The lock stops legitimate quick breaks too; you pay in flexibility for focus your in-the-moment self would surrender."
        },
        {
          "persona": "relationship",
          "scenario": "You know you cave and text your ex when lonely at midnight. While sober-minded you delete the thread and hand a friend the block-list password until you're steadier.",
          "tradeoff": "Cutting the line off risks feeling isolated some nights; you trade an easy comfort for not reopening a wound weekly."
        },
        {
          "persona": "high-achiever",
          "scenario": "You know you'll rationalize skipping the gym once work heats up. You pre-pay a trainer ₹2,000 a session with a steep cancellation fee. The cost binds the future self who'd bargain.",
          "tradeoff": "The commitment means paying even on genuinely brutal days; you sacrifice some slack for a habit your excuses can't erode."
        },
        {
          "persona": "privileged",
          "scenario": "You know you'll meddle after handing the company to your successor. You sign a binding agreement removing your operational vote for 2 years, with a lawyer enforcing it.",
          "tradeoff": "Surrendering the vote means watching choices you'd make differently; you trade control for a successor who can actually lead."
        }
      ],
      "featured": 2,
      "personalPrompt": "For the moment you know you'll cave, what binding could you set now, while you're clear-headed, that your weaker future self can't easily undo?",
      "pitfalls": [
        "A generic constraint misses the specific temptation — match the lock to the exact thing you'll want to do.",
        "Absolute rigidity backfires when life genuinely changes; build in a deliberate, costly-but-possible emergency exit."
      ]
    },
    {
      "id": "daily-highlight",
      "name": "Daily Highlight / Buffett list",
      "category": "attention",
      "trigger": "\"Busy but nothing done\"",
      "essence": "One task at the top; touch nothing else until it's finished",
      "visualType": "spotlight",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your days end busy but empty, the one thing that mattered untouched. Each morning you name a single highlight — 'fix the leaking tap' — and refuse everything else until it's done. One real thing finishes daily.",
          "tradeoff": "Guarding the highlight means fifty small tasks slip; you trade a tidy to-do list for one thing that actually matters getting done."
        },
        {
          "persona": "student",
          "scenario": "You end study days having 'revised everything' and remembered nothing. You pick one highlight — 'master integration by parts' — and protect it first. Depth on one beats a shallow sweep.",
          "tradeoff": "Focusing on one topic leaves others for tomorrow; you pay in breadth for actually learning the one that counts."
        },
        {
          "persona": "relationship",
          "scenario": "Your evenings with family blur into logistics and screens. Your daily highlight becomes 'read with my daughter for 20 minutes,' protected before chores. One real moment of connection lands each day.",
          "tradeoff": "The protected 20 minutes means the dishes wait; you trade a spotless kitchen for a memory your daughter keeps."
        },
        {
          "persona": "high-achiever",
          "scenario": "You juggle 50 tasks and finish 50 half-things. Naming one highlight — 'ship the pricing fix' — forces one complete, meaningful win a day instead of scattered motion.",
          "tradeoff": "The single focus means visible multitasking drops; you sacrifice the appearance of busy for one thing truly done."
        },
        {
          "persona": "privileged",
          "scenario": "With staff handling everything, your days lack any personal accomplishment. You set a daily highlight — 'write 500 words of the memoir' — that only you can do. Meaning, not activity, anchors the day.",
          "tradeoff": "The writing time forgoes a meeting you could take; you trade one more obligation for something that's actually yours."
        }
      ],
      "featured": 2,
      "personalPrompt": "If today allowed only one thing to be truly finished, what would your single highlight be?",
      "pitfalls": [
        "Picking a highlight that's too big can't be finished in a day, so nothing gets the closure that makes the method work — size it right.",
        "Real emergencies will sometimes trump the highlight; the discipline is protecting it by default, not pretending nothing else exists."
      ]
    },
    {
      "id": "wrap",
      "name": "WRAP (Heath, Decisive)",
      "category": "decision-processes",
      "trigger": "\"Big decision, narrow frame\"",
      "essence": "Widen options → Reality-test assumptions → Attain distance → Prepare to be wrong",
      "visualType": "flow",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Stuck on 'should I take the night-shift job or not?', you run WRAP: Widen to other income options, Reality-test by asking a current night-worker, Attain distance with the 10-year view, Prepare to be wrong with a 3-month check-in. The yes/no becomes a real decision.",
          "tradeoff": "Widening the frame delays the quick answer your boss wants; you trade speed for a decision you won't regret in a year."
        },
        {
          "persona": "student",
          "scenario": "Torn over 'this university or not?', you WRAP it: widen to a gap year and other courses, reality-test by talking to graduates who left, distance yourself with the long view, prepare a transfer tripwire. The narrow choice opens up.",
          "tradeoff": "Exploring options risks decision fatigue and a missed deadline; you pay in effort for not locking into a wrong 4-year path."
        },
        {
          "persona": "relationship",
          "scenario": "Facing 'should we break up or not?', you WRAP instead of spiraling: widen to counseling or a break, reality-test with an honest friend, gain distance, prepare to be wrong with a real timeline. The binary softens into clarity.",
          "tradeoff": "Widening past yes/no means sitting in uncertainty longer; you trade the relief of a snap decision for one you can stand behind."
        },
        {
          "persona": "high-achiever",
          "scenario": "Sure the answer is 'acquire or not,' your confidence skips the process. WRAP forces the reality-test you'd dodge: you spend a week talking to 3 founders who sold to you, and one call reshapes the whole deal.",
          "tradeoff": "Running the full process slows a deal you wanted to close fast; you sacrifice momentum for not betting big on a narrow frame."
        },
        {
          "persona": "privileged",
          "scenario": "Weighing 'fund this foundation or not,' your wealth makes yes easy and lazy. WRAP widens it: 3 other structures, a reality-test with peers who tried, a 6-month distance rule, a review tripwire. The reflexive yes becomes considered.",
          "tradeoff": "The deliberate process delays a gift you could make today; you trade fast generosity for philanthropy that actually works."
        }
      ],
      "featured": 0,
      "personalPrompt": "For your current big decision, which of the four — widening, reality-testing, distance, or preparing to be wrong — have you skipped entirely?",
      "pitfalls": [
        "A whether-or-not framing ('should I do X?') is the warning sign of a too-narrow frame — widen before you evaluate.",
        "It's tempting to reality-test by asking people who'll agree with you; seek the disconfirming evidence instead."
      ],
      "steps": [
        "Widen your options — escape a yes/no frame; ask what else you could do.",
        "Reality-test your assumptions — seek disconfirming evidence, run a small trial.",
        "Attain distance before deciding — use the 10/10/10 or advise-a-friend view.",
        "Prepare to be wrong — set tripwires and bookend expectations."
      ]
    },
    {
      "id": "decision-journal",
      "name": "Decision Journal",
      "category": "decision-processes",
      "trigger": "\"Was that a good call or good luck?\"",
      "essence": "Record situation, options rejected, expected outcome + confidence, and your physical/mental state BEFORE the outcome; review later. Beats hindsight editing",
      "visualType": "journal",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Before a ₹2-lakh car purchase you write it down: options rejected, expected upkeep, 70% confident, state of mind (rushed, excited). Months later the journal tells you if it was a good call or just luck.",
          "tradeoff": "Writing it down takes 20 minutes and risks proving you wrong later; you trade a little effort and comfort for a lesson memory can't give."
        },
        {
          "persona": "student",
          "scenario": "Before choosing your dissertation topic you journal the alternatives, your expected grade, confidence, and mood. A year on you learn whether your judgement or chance drove the outcome.",
          "tradeoff": "Recording your reasoning means you can't later pretend you 'always knew'; you pay in honesty for actually improving your judgement."
        },
        {
          "persona": "relationship",
          "scenario": "Before a big relationship decision — moving cities for your partner — you record why, what you expect, your 60% confidence, and that you feel pressured. Later you review it honestly, not through rewritten memory.",
          "tradeoff": "Naming your doubts on paper feels disloyal; you trade a comfortable certainty for a decision you can actually learn from."
        },
        {
          "persona": "high-achiever",
          "scenario": "Before a major hire you journal the rejected candidates, expected outcome, confidence (80%), and that you're impatient. Months later it separates your skill from your luck, which your ego blurs.",
          "tradeoff": "The record can expose that a 'great instinct' was a coin flip; you sacrifice a flattering self-story for real calibration."
        },
        {
          "persona": "privileged",
          "scenario": "Before a ₹20-crore allocation you record the thesis, rejected options, confidence, and mood. The journal is the one thing that tells you if your judgement is real or just well-funded.",
          "tradeoff": "Committing predictions to paper risks puncturing the myth around your judgement; you trade the legend for the truth."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the decision you're about to make, what will you record now — options rejected, expected outcome, confidence, your state of mind — so you can review it honestly later?",
      "pitfalls": [
        "A journal only pays off if you actually revisit entries after the outcome; without the review, it's just writing.",
        "Recording your emotional state feels awkward but it's often the most useful field — don't skip it to look composed."
      ]
    },
    {
      "id": "weighted-scoring",
      "name": "Weighted Scoring",
      "category": "decision-processes",
      "trigger": "\"Comparing apples to oranges\"",
      "essence": "List criteria, weight them, score options, multiply — but sanity-check the winner against your gut",
      "visualType": "grid",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Choosing between 3 flats, you list criteria — rent, commute, light — weight them, and score each. The spreadsheet picks one; your gut flags that you under-weighted the 90-minute commute. You adjust and decide clear-eyed.",
          "tradeoff": "The exercise takes an evening and can feel over-engineered; you trade spontaneity for a choice you won't second-guess for years."
        },
        {
          "persona": "student",
          "scenario": "Torn between 4 job offers, you weight salary, learning, location, and culture, then score. The winner surprises you; a gut check says you low-balled 'learning.' You re-weight and choose with eyes open.",
          "tradeoff": "Reducing a life choice to numbers risks missing the intangibles; you pay in messiness for a decision your feelings alone kept looping."
        },
        {
          "persona": "relationship",
          "scenario": "You and your partner are choosing where to settle, at an impasse. You jointly weight criteria — family nearness, jobs, cost — and score options together. The shared grid turns a fight into a decision.",
          "tradeoff": "Quantifying a home together can feel cold and clinical; you trade some warmth for a way past a stalemate that was hurting you both."
        },
        {
          "persona": "high-achiever",
          "scenario": "Choosing a tech stack, you're sure of the answer. The weighted grid forces honesty: you'd under-weighted hiring difficulty at 5% because you personally know the niche language, when the market has maybe 40 engineers who do. You adjust and avoid a hiring trap.",
          "tradeoff": "The model can contradict the expert instinct you're paid for; you sacrifice a little ego for a call the whole team can live with."
        },
        {
          "persona": "privileged",
          "scenario": "Selecting among 5 investments, easy money tempts a gut yes. You weight risk, alignment, and impact, then score. The grid and a gut check together catch a flashy option that fails on your values.",
          "tradeoff": "The rigor slows a deal you could wave through; you trade speed for allocations that survive scrutiny."
        }
      ],
      "featured": 0,
      "personalPrompt": "For the options you're comparing, what are the real criteria, how would you weight them honestly, and does the winner survive a gut check?",
      "pitfalls": [
        "Weights and scores can be quietly tuned until the answer you already wanted 'wins' — set the weights before you score.",
        "A tidy number can override a valid gut signal; the model informs the decision, it doesn't replace judgement."
      ]
    },
    {
      "id": "cynefin",
      "name": "Cynefin",
      "category": "decision-processes",
      "trigger": "\"What KIND of problem is this?\"",
      "essence": "Classify first: obvious→best practice, complicated→experts, complex→probe-sense-respond, chaotic→act first",
      "visualType": "triage",
      "examples": [
        {
          "persona": "everyday",
          "scenario": "Your shop's sales suddenly drop for 3 weeks and you reach for last year's discount playbook. First you classify: this is complex, not obvious — the cause is unknown. So you probe with small tests, sense results, respond.",
          "tradeoff": "Probing instead of acting decisively feels slow and uncertain; you trade the comfort of a confident fix for one that fits an unknown cause."
        },
        {
          "persona": "student",
          "scenario": "Your grades slip and you assume the 'obvious' fix: study more hours. Classifying honestly, it's complicated — maybe method, sleep, or the subject. You diagnose before grinding harder.",
          "tradeoff": "Stopping to diagnose costs study time you feel you can't spare; you pay in delay for not brute-forcing the wrong solution."
        },
        {
          "persona": "relationship",
          "scenario": "Your partner grows distant and you reach for the obvious 'just talk it out.' Naming the domain, it's complex — no single cause or script. You probe gently, sense, and respond instead of applying a formula.",
          "tradeoff": "Abandoning the tidy fix means tolerating ambiguity and slow progress; you trade a quick script for an approach that fits a real person."
        },
        {
          "persona": "high-achiever",
          "scenario": "At 2am a production incident hits and you grab the usual runbook. You classify first: complex, not merely complicated — no expert knows this yet. You probe with a small safe change instead of best-practice.",
          "tradeoff": "Probing forgoes the decisive command move your reputation rests on; you sacrifice looking in control for the method the domain requires."
        },
        {
          "persona": "privileged",
          "scenario": "A portfolio company falters 3 weeks before payroll and money tempts a big decisive intervention. You classify: chaotic — act first to stabilize, then sense. You steady cash flow before diagnosing, resisting the grand fix.",
          "tradeoff": "Acting to stabilize before understanding risks treating a symptom; you trade a perfect diagnosis for stopping the bleeding now."
        }
      ],
      "featured": 3,
      "personalPrompt": "What KIND of problem are you actually facing — obvious, complicated, complex, or chaotic — and are you using the method that domain calls for?",
      "pitfalls": [
        "Misclassifying a complex problem as merely complicated makes you apply best-practice where none exists — and it fails.",
        "The most dangerous move is assuming the obvious domain; complacency there is how ordered problems slide into chaos."
      ],
      "steps": [
        "Obvious — the cause is clear; apply the known best practice.",
        "Complicated — experts and analysis can find the good answer.",
        "Complex — no answer exists yet; probe, sense, then respond.",
        "Chaotic — act first to stabilise, then sense and respond."
      ]
    }
  ],
  "categories": [
    {
      "id": "improve-yourself",
      "label": "Improve Yourself",
      "group": "quadrant"
    },
    {
      "id": "understand-yourself",
      "label": "Understand Yourself",
      "group": "quadrant"
    },
    {
      "id": "understand-others",
      "label": "Understand Others",
      "group": "quadrant"
    },
    {
      "id": "improve-others",
      "label": "Improve Others",
      "group": "quadrant"
    },
    {
      "id": "mental-models",
      "label": "Mental Models",
      "group": "extension"
    },
    {
      "id": "cognitive-biases",
      "label": "Cognitive Biases",
      "group": "extension"
    },
    {
      "id": "attention",
      "label": "Attention & Focus",
      "group": "extension"
    },
    {
      "id": "decision-processes",
      "label": "Decision Processes",
      "group": "extension"
    }
  ],
  "VISUAL_TYPES": [
    "matrix-2x2",
    "scatter-plot",
    "timeline",
    "flow",
    "tension",
    "curve",
    "grid",
    "nine-dot",
    "tree",
    "split",
    "spectrum",
    "bubble-map",
    "radar",
    "venn",
    "distortion-lens",
    "crossroads",
    "layers",
    "pyramid",
    "nested-loops",
    "spiral",
    "spike",
    "black-box",
    "role-wheel",
    "triangle",
    "stage-curve",
    "gap-bars",
    "triage",
    "concentric",
    "mirror",
    "cycle",
    "anchor",
    "funnel",
    "gantt",
    "sliders",
    "constraint",
    "spotlight",
    "journal"
  ],
  "VISUAL_LABELS": {
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
  }
};
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

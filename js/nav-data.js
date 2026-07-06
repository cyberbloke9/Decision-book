/* ==========================================================================
   Pocket Decision Book — situation navigation data (Sprint 004)  [AUTHORED]
   The situation picker's curated clusters (spec R3 / B8 / B9).

   Each situation is a first-person, trigger-style prompt whose label + blurb
   are ORIGINAL Generator authoring — grounded in the per-framework triggers
   already in js/data.js, never lifted from the book. Every frameworkId must
   resolve via PDB_DATA.byId, and every situation maps to >= 2 frameworks.

   Static and deterministic: same options, same order, every load. No Math.random,
   no Date. Plain script; attaches PDB_NAV to window (no bundler, no fetch).
   ========================================================================== */
(function (root) {
  "use strict";

  var SITUATIONS = [
    {
      id: "cant-choose",
      label: "I can't choose between options",
      blurb: "Options are stacking up and every one of them looks defensible.",
      frameworkIds: [
        "choice-overload",
        "rubber-band-model",
        "hard-choice-model",
        "weighted-scoring",
        "regret-minimization",
        "crossroads-model"
      ]
    },
    {
      id: "keep-getting-distracted",
      label: "I keep getting distracted",
      blurb: "The day fills with pings and shallow tasks; the real work never starts.",
      frameworkIds: [
        "deep-work",
        "environment-design",
        "daily-highlight",
        "implementation-intentions",
        "eisenhower-matrix"
      ]
    },
    {
      id: "decision-scares-me",
      label: "This decision scares me",
      blurb: "It feels big, maybe irreversible, and the stakes are shouting.",
      frameworkIds: [
        "regret-minimization",
        "10-10-10",
        "unconscious-thinking-theory",
        "pre-mortem",
        "wrap",
        "consequences-model"
      ]
    },
    {
      id: "am-i-fooling-myself",
      label: "Am I fooling myself?",
      blurb: "You suspect your reasoning is quietly bending toward what you already want.",
      frameworkIds: [
        "cognitive-bias",
        "confirmation-bias",
        "sunk-cost-fallacy",
        "cognitive-dissonance",
        "hindsight-bias",
        "anchoring",
        "circle-of-competence"
      ]
    },
    {
      id: "keep-delaying",
      label: "I keep putting it off",
      blurb: "You've decided in principle but keep re-opening or postponing the call.",
      frameworkIds: [
        "stop-rule",
        "yes-no-rule",
        "ulysses-pact",
        "implementation-intentions",
        "unconscious-thinking-theory"
      ]
    },
    {
      id: "too-much-at-once",
      label: "I'm juggling too much at once",
      blurb: "Everything feels urgent and attention is spread thin across projects.",
      frameworkIds: [
        "eisenhower-matrix",
        "project-portfolio-matrix",
        "bcg-box",
        "pareto-principle",
        "daily-highlight"
      ]
    },
    {
      id: "conflict-with-someone",
      label: "I'm in conflict with someone",
      blurb: "A disagreement is stuck, and goodwill is draining on both sides.",
      frameworkIds: [
        "conflict-resolution-model",
        "prisoners-dilemma",
        "expectations-model",
        "feedback-box"
      ]
    },
    {
      id: "why-did-this-fail",
      label: "Why did this go wrong?",
      blurb: "Something broke and you want the real cause, not a scapegoat.",
      frameworkIds: [
        "swiss-cheese-model",
        "double-loop-learning",
        "black-swan-model",
        "pre-mortem",
        "decision-journal",
        "rumsfeld-matrix"
      ]
    },
    {
      id: "is-this-still-right",
      label: "Is this still right for me?",
      blurb: "The work or path that once fit is starting to chafe.",
      frameworkIds: [
        "uffe-elbaek-model",
        "personal-performance-model",
        "energy-model",
        "flow-model",
        "making-of-model",
        "personal-potential-trap"
      ]
    },
    {
      id: "stuck-in-the-obvious",
      label: "I'm stuck on the obvious answer",
      blurb: "The first idea won't let go and nothing fresher is arriving.",
      frameworkIds: [
        "thinking-outside-the-box",
        "morphological-box-scamper",
        "inversion",
        "second-order-thinking",
        "gap-in-the-market-model"
      ]
    }
  ];

  function situationById(id) {
    for (var i = 0; i < SITUATIONS.length; i++) {
      if (SITUATIONS[i].id === id) return SITUATIONS[i];
    }
    return null;
  }

  root.PDB_NAV = {
    SITUATIONS: SITUATIONS,
    situationById: situationById
  };
})(typeof window !== "undefined" ? window : this);

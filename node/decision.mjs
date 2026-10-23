// Typed decisions with Jev (TypeSafe): booleans, choices and scores with confidence.
// Jev does not use the chat format. You send a `state` (the text to judge) plus named
// `questions`, and every answer comes back typed instead of as free text.
// Usage: node decision.mjs "Help! My payouts have been failing for 3 days."
const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const baseURL = (process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1").replace(/\/+$/, "");
const state = process.argv.slice(2).join(" ") || "Help! My payouts have been failing for 3 days.";

const response = await fetch(`${baseURL}/decisions`, {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "jev-latest",
    state,
    questions: {
      is_urgent: {
        type: "noul",
        instructions: "Does this message convey urgency?",
        criteria: { true: "Explicitly time-sensitive", false: "No urgency expressed" },
      },
      department: {
        type: "choice",
        instructions: "Which team should handle this?",
        criteria: {
          billing: "Payments, invoicing, refunds",
          technical: "Bugs, outages, integrations",
          sales: "Pricing, upgrades, new accounts",
        },
      },
      frustration: {
        type: "score",
        instructions: "How frustrated is the customer?",
        criteria: ["Calm", "Frustrated", "Very angry"],
      },
    },
  }),
});
if (!response.ok) {
  console.error(`HTTP ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const { answers } = await response.json();
for (const [name, answer] of Object.entries(answers)) {
  if (answer.type === "noul") {
    console.log(`${name}: P(true) = ${answer.noul.toFixed(2)}`);
  } else if (answer.type === "choice") {
    console.log(`${name}: ${answer.choice} (confidence ${answer.confidence.toFixed(2)}) ${JSON.stringify(answer.probabilities)}`);
  } else if (answer.type === "score") {
    console.log(`${name}: ${answer.score.toFixed(2)} on ${JSON.stringify(answer.legend)} (confidence ${answer.confidence.toFixed(2)})`);
  }
}

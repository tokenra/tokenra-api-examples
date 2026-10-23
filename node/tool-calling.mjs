// Function calling: the model asks for a tool, we run it, the model answers.
// The weather lookup is a local stub so the example runs without another API.
// Usage: node tool-calling.mjs "What's the weather in Tokyo and Paris?"
import OpenAI from "openai";

const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL: process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1" });
const model = process.env.TOKENRA_MODEL || "deepseek-v4.1-flash";
const prompt = process.argv.slice(2).join(" ") || "What's the weather in Tokyo and Paris right now?";

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather for a city.",
      parameters: {
        type: "object",
        properties: { city: { type: "string", description: "City name, for example Tokyo" } },
        required: ["city"],
      },
    },
  },
];

// Stub data. Replace with a real weather API in your application.
const fakeWeather = { tokyo: [21, "clear"], paris: [14, "light rain"] };
function getWeather({ city }) {
  const [temperature_c, condition] = fakeWeather[city.toLowerCase()] ?? [18, "cloudy"];
  return { city, temperature_c, condition };
}

const messages = [{ role: "user", content: prompt }];

for (let round = 0; round < 5; round++) {
  const completion = await client.chat.completions.create({ model, messages, tools });
  const message = completion.choices[0].message;
  if (!message.tool_calls?.length) {
    console.log(message.content);
    process.exit(0);
  }

  // Keep the assistant turn as returned (tool calls and any reasoning fields)
  // so the model sees its own request when it reads the tool results.
  messages.push(message);
  for (const call of message.tool_calls) {
    const args = JSON.parse(call.function.arguments || "{}");
    const result = getWeather(args);
    console.log(`-> ${call.function.name}(${JSON.stringify(args)}) = ${JSON.stringify(result)}`);
    messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
  }
}

console.error("The model kept calling tools; stopping after 5 rounds.");
process.exit(1);

// Minimal chat completion through TokenRa's OpenAI-compatible API.
// Usage: node chat.mjs "Your question"
import OpenAI from "openai";

const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL: process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1" });
const model = process.env.TOKENRA_MODEL || "deepseek-v4.1-flash";
const prompt = process.argv.slice(2).join(" ") || "Explain what an API gateway does in two sentences.";

const completion = await client.chat.completions.create({
  model,
  messages: [
    { role: "system", content: "You are a concise technical assistant." },
    { role: "user", content: prompt },
  ],
});

console.log(completion.choices[0].message.content);
const { usage } = completion;
if (usage) {
  console.log(`\n[${model}] prompt_tokens=${usage.prompt_tokens} completion_tokens=${usage.completion_tokens}`);
}

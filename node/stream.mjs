// Stream a chat completion token by token (Server-Sent Events).
// Usage: node stream.mjs "Your question"
import OpenAI from "openai";

const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL: process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1" });
const model = process.env.TOKENRA_MODEL || "deepseek-v4.1-flash";
const prompt = process.argv.slice(2).join(" ") || "Write a four-line poem about shipping code on Friday.";

const stream = await client.chat.completions.create({
  model,
  messages: [{ role: "user", content: prompt }],
  stream: true,
  stream_options: { include_usage: true },
});

// Reasoning models stream their thinking first in delta.reasoning_content,
// so the answer below can take a few seconds to start.
let usage;
for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
  if (chunk.usage) usage = chunk.usage;
}
process.stdout.write("\n");

if (usage) {
  console.log(`\n[${model}] prompt_tokens=${usage.prompt_tokens} completion_tokens=${usage.completion_tokens}`);
}

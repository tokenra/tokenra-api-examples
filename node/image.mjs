// Generate an image with GPT Image 2.5 and save it under ./output.
// Usage: node image.mjs "A watercolor fox reading a book under a lamp"
import { mkdirSync, writeFileSync } from "node:fs";
import OpenAI from "openai";

const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL: process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1" });
const model = process.env.TOKENRA_IMAGE_MODEL || "gpt-image-2.5-flare";
const prompt = process.argv.slice(2).join(" ") || "A clean editorial illustration of a sunrise over a city skyline";

const result = await client.images.generate({ model, prompt });
const image = result.data[0];

mkdirSync("output", { recursive: true });
const out = `output/image-${Date.now()}.png`;
if (image.b64_json) {
  writeFileSync(out, Buffer.from(image.b64_json, "base64"));
} else {
  // The image host is not TokenRa, so download without the Authorization header.
  console.log(`URL: ${image.url}`);
  const response = await fetch(image.url);
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
  writeFileSync(out, Buffer.from(await response.arrayBuffer()));
}
console.log(`Saved ${out}`);

// Ask a multimodal model about an image, from a URL or a local file.
// Usage:
//   node vision.mjs                                  (uses a sample image)
//   node vision.mjs https://example.com/photo.jpg
//   node vision.mjs ./screenshot.png "What error is shown here?"
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";
import OpenAI from "openai";

const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL: process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1" });
const model = process.env.TOKENRA_MODEL || "deepseek-v4.1-flash";
let image = process.argv[2] || "https://tokenra.io/models/glm-5-3-flashx-card.jpg";
const question = process.argv.slice(3).join(" ") || "Describe this image in two sentences.";

// Local files are sent inline as a base64 data URL. Use one when the model
// provider cannot download your URL ("Timeout while downloading").
if (existsSync(image)) {
  const mime = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" }[extname(image).toLowerCase()] ?? "image/png";
  image = `data:${mime};base64,${readFileSync(image).toString("base64")}`;
}

const completion = await client.chat.completions.create({
  model,
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: question },
        { type: "image_url", image_url: { url: image } },
      ],
    },
  ],
});
console.log(completion.choices[0].message.content);

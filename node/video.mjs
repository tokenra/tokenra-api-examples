// Generate a video with Seedance through TokenRa's asynchronous task API.
//   1. POST /v1/video/generations creates a task and returns its task_id.
//   2. GET /v1/video/generations/{task_id} reports the status until SUCCESS or FAILURE.
// Usage: node video.mjs "A paper boat drifting down a rainy neon street"
const apiKey = process.env.TOKENRA_API_KEY;
if (!apiKey) {
  console.error("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register");
  process.exit(1);
}

const baseURL = (process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1").replace(/\/+$/, "");
const model = process.env.TOKENRA_VIDEO_MODEL || "seedance-2-0-mini";
const prompt = process.argv.slice(2).join(" ") || "A paper boat drifting down a rainy neon street at night, cinematic close-up";
const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };

const created = await fetch(`${baseURL}/video/generations`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    model,
    prompt,
    resolution: "720p",
    ratio: "16:9",
    duration: 5,
    // Image-to-video: images: ["https://.../first-frame.png"],
  }),
});
if (!created.ok) {
  console.error(`Create failed: HTTP ${created.status} ${await created.text()}`);
  process.exit(1);
}
const { task_id: taskId } = await created.json();
console.log(`Task ${taskId} created. Polling every 10 seconds...`);

// Polling is safe to retry; creating is not, because every created task is billed.
const deadline = Date.now() + 15 * 60 * 1000;
while (Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 10_000));
  let polled;
  try {
    polled = await fetch(`${baseURL}/video/generations/${taskId}`, { headers });
  } catch (error) {
    console.log(`  network error, retrying: ${error.message}`);
    continue;
  }
  if (polled.status >= 500) {
    console.log(`  HTTP ${polled.status}, retrying`);
    continue;
  }
  if (!polled.ok) {
    console.error(`Status check failed: HTTP ${polled.status} ${await polled.text()}`);
    process.exit(1);
  }
  const { data: task } = await polled.json();
  console.log(`  ${task.status} ${task.progress ?? ""}`);
  if (task.status === "SUCCESS") {
    console.log(`Video URL: ${task.result_url}`);
    process.exit(0);
  }
  if (task.status === "FAILURE") {
    console.error(`Task failed: ${task.fail_reason}`);
    process.exit(1);
  }
}

console.error(`Still running after 15 minutes. Check again later: GET ${baseURL}/video/generations/${taskId}`);
process.exit(1);

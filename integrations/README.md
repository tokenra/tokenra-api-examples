# Use TokenRa with frameworks and coding tools

TokenRa speaks the OpenAI Chat Completions protocol, so most tools need only three settings:

| Setting | Value |
| --- | --- |
| Base URL | `https://tokenra.io/v1` |
| API key | Your TokenRa key ([create one](https://tokenra.io/register)) |
| Model | A TokenRa model ID, for example `deepseek-v4.1-flash` ([all models](https://tokenra.io/models.html)) |

If a client asks for an API host instead of a base URL, enter `https://tokenra.io`; such clients add `/v1` themselves.

## LangChain (Python)

```bash
pip install langchain-openai
```

```python
import os

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="deepseek-v4.1-flash",
    base_url="https://tokenra.io/v1",
    api_key=os.environ["TOKENRA_API_KEY"],
)
print(llm.invoke("Give me three names for a developer tool.").content)
```

## Vercel AI SDK (JavaScript / TypeScript)

```bash
npm install ai @ai-sdk/openai-compatible
```

```js
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

const tokenra = createOpenAICompatible({
  name: "tokenra",
  baseURL: "https://tokenra.io/v1",
  apiKey: process.env.TOKENRA_API_KEY,
});

const { text } = await generateText({
  model: tokenra("deepseek-v4.1-flash"),
  prompt: "Give me three names for a developer tool.",
});
console.log(text);
```

## Claude Code

TokenRa also serves the Anthropic Messages API at `https://tokenra.io/v1/messages`, so Claude Code can run on TokenRa models. Set these variables before you start `claude`:

```bash
export ANTHROPIC_BASE_URL="https://tokenra.io"
export ANTHROPIC_AUTH_TOKEN="$TOKENRA_API_KEY"
export ANTHROPIC_MODEL="deepseek-v4.1-flash"
# Claude Code also calls its Sonnet, Opus and Haiku slots; point them at TokenRa models too.
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4.1-flash"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4.1-flash"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4.1-flash"
claude
```

Claude Code warns that it does not know the model's context window and assumes 200K tokens. To let it use more, set `CLAUDE_CODE_MAX_CONTEXT_TOKENS` to the window listed in the [model guide](https://tokenra.io/models.html).

## OpenCode

Add TokenRa as a custom provider in `opencode.json` (in your project, or globally in `~/.config/opencode/opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "tokenra": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "TokenRa",
      "options": {
        "baseURL": "https://tokenra.io/v1",
        "apiKey": "{env:TOKENRA_API_KEY}"
      },
      "models": {
        "deepseek-v4.1-flash": { "name": "DeepSeek V4.1 Flash" },
        "glm-5.3-flash": { "name": "GLM-5.3-Flash" },
        "kimi-k3": { "name": "Kimi K3" },
        "minimax-m3.1-flash": { "name": "MiniMax M3.1 Flash" }
      }
    }
  }
}
```

Export `TOKENRA_API_KEY`, start `opencode`, and pick a model with `/models`. Models appear as `tokenra/<model-id>`.

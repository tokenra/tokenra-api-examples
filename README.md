<p align="center">
  <a href="https://tokenra.io"><img src="assets/tokenra-mark.svg" width="88" alt="TokenRa logo"></a>
</p>

<h1 align="center">TokenRa API Examples</h1>

<p align="center">
  <b>One API key for DeepSeek, GLM, Kimi, Qwen, MiniMax, GPT Image, Seedance and Jev.</b><br>
  Runnable examples for TokenRa's OpenAI-compatible API in cURL, Python, Node.js and Go.
</p>

<p align="center">
  <a href="https://tokenra.io">Website</a> ·
  <a href="https://tokenra.io/register">Get an API key</a> ·
  <a href="https://tokenra.io/models.html">Models &amp; pricing</a> ·
  <a href="https://tokenra.io/docs.html">Docs</a> ·
  <a href="#中文">中文</a>
</p>

---

## Quickstart

1. Create an API key at [tokenra.io/register](https://tokenra.io/register).
2. Export it: `export TOKENRA_API_KEY="sk-..."`
3. Send a request:

```bash
curl https://tokenra.io/v1/chat/completions \
  -H "Authorization: Bearer $TOKENRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4.1-flash",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Already using an OpenAI SDK? Change the base URL and the key. The rest of your code stays the same:

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_TOKENRA_KEY", base_url="https://tokenra.io/v1")
reply = client.chat.completions.create(
    model="deepseek-v4.1-flash",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(reply.choices[0].message.content)
```

## Examples

| Task | Endpoint | cURL | Python | Node.js | Go |
| --- | --- | --- | --- | --- | --- |
| Chat completion | `POST /v1/chat/completions` | [chat.sh](curl/chat.sh) | [chat.py](python/chat.py) | [chat.mjs](node/chat.mjs) | [chat](go/chat/main.go) |
| Streaming | same, with `stream: true` | [stream.sh](curl/stream.sh) | [stream.py](python/stream.py) | [stream.mjs](node/stream.mjs) | [stream](go/stream/main.go) |
| Tool calling | same, with `tools` | | [tool_calling.py](python/tool_calling.py) | [tool-calling.mjs](node/tool-calling.mjs) | |
| Image input (vision) | same, with `image_url` | | [vision.py](python/vision.py) | [vision.mjs](node/vision.mjs) | |
| Image generation | `POST /v1/images/generations` | [image.sh](curl/image.sh) | [image_generation.py](python/image_generation.py) | [image.mjs](node/image.mjs) | |
| Video generation (async) | `POST /v1/video/generations` | [create](curl/video-create.sh) · [status](curl/video-status.sh) | [video_generation.py](python/video_generation.py) | [video.mjs](node/video.mjs) | |
| Typed decisions (Jev) | `POST /v1/decisions` | [decision.sh](curl/decision.sh) | [jev_decision.py](python/jev_decision.py) | [decision.mjs](node/decision.mjs) | |
| List your models | `GET /v1/models` | [models.sh](curl/models.sh) | | | |

<p align="center">
  <img src="assets/example-watercolor-fox.jpg" width="320" alt="A watercolor fox reading a book under a desk lamp, generated with GPT Image 2.5 through TokenRa"><br>
  <sub>Output of <code>python image_generation.py "A watercolor fox reading a book under a desk lamp"</code> with <code>gpt-image-2.5-flare</code></sub>
</p>

Frameworks and coding tools (LangChain, Vercel AI SDK, Claude Code, OpenCode): see [integrations/](integrations/README.md).

## Run the examples

Every example reads its settings from environment variables:

| Variable | Default | Used by |
| --- | --- | --- |
| `TOKENRA_API_KEY` | (required) | all examples |
| `TOKENRA_BASE_URL` | `https://tokenra.io/v1` | all examples |
| `TOKENRA_MODEL` | `deepseek-v4.1-flash` | chat, streaming, tool calling, vision |
| `TOKENRA_IMAGE_MODEL` | `gpt-image-2.5-flare` | image generation |
| `TOKENRA_VIDEO_MODEL` | `seedance-2-0-mini` | video generation |

### Python (3.10+)

```bash
cd python
pip install -r requirements.txt
python chat.py "What is a vector database?"
python stream.py
python tool_calling.py
python vision.py ./screenshot.png "What does this screen show?"
python image_generation.py "A watercolor fox reading under a lamp"
python video_generation.py "A paper boat drifting down a rainy neon street"
python jev_decision.py "Help! My payouts have been failing for 3 days."
```

### Node.js (22+)

```bash
cd node
npm install
npm run chat -- "What is a vector database?"
npm run stream
npm run tools
npm run vision -- ./screenshot.png "What does this screen show?"
npm run image
npm run video
npm run decision
```

### Go (1.22+, standard library only)

```bash
cd go
go run ./chat "What is a vector database?"
go run ./stream
```

### cURL

```bash
bash curl/chat.sh
bash curl/stream.sh
bash curl/image.sh
bash curl/video-create.sh            # prints a task_id
bash curl/video-status.sh <task_id>  # repeat until SUCCESS
bash curl/decision.sh
bash curl/models.sh
```

On Windows, run the shell scripts from Git Bash or WSL.

## Models

The examples use these IDs. Availability and rates change, so check the live [model catalog](https://tokenra.io/models.html) or call `GET /v1/models` with your key.

| Model | Model ID | Developer | Good for |
| --- | --- | --- | --- |
| [DeepSeek V4.1 Flash](https://tokenra.io/models/deepseek-v4.1-flash-api.html) | `deepseek-v4.1-flash` | DeepSeek | Chat, coding, reasoning, image and video input |
| [DeepSeek V4.1 Flash 1017](https://tokenra.io/models/deepseek-v4.1-flash-1017.html) | `deepseek-v4.1-flash-1017` | DeepSeek | Coding and agent workflows |
| [GLM-5.3-Flash](https://tokenra.io/models/glm-5-3-flash.html) | `glm-5.3-flash` | Z.ai | Coding, tools, structured output |
| [GLM-5.3-FlashX](https://tokenra.io/models/glm-5-3-flashx.html) | `glm-5.3-flashx` | Z.ai | The fastest GLM-5.3 model |
| [Kimi K3](https://tokenra.io/models/kimi-k3-api.html) | `kimi-k3` | Moonshot AI | Long-context agents, coding, image and video input |
| [Qwen3.8-Omni-Flash](https://tokenra.io/models/qwen-3.8-omni-flash.html) | `qwen3.8-omni-flash` | Alibaba Qwen | Text, image, audio and video input |
| [MiniMax M3.1 Flash](https://tokenra.io/models/minimax-m3.1-flash-api.html) | `minimax-m3.1-flash` | MiniMax | Agents and tool calling, 1M-token context |
| [GPT Image 2.5](https://tokenra.io/models/gpt-image-2-5.html) | `gpt-image-2.5-flare` | OpenAI | Image generation and editing |
| [Seedance 2.0 Mini](https://tokenra.io/models/seedance-2-0-mini.html) / [Pro](https://tokenra.io/models/seedance-2-0-api.html) | `seedance-2-0-mini`, `seedance-2-0-pro` | ByteDance | Text-to-video, image-to-video |
| [Seedance 2.5](https://tokenra.io/models/seedance-2-5-api.html) | `artsdance-2-5-pro-260801` | ByteDance | Text-to-video, image-to-video |
| [Jev](https://tokenra.io/models/jev-api.html) | `jev-latest` | TypeSafe | Typed decisions: boolean, choice, score |

## Video tasks

Video generation is asynchronous:

1. `POST /v1/video/generations` returns a `task_id` right away.
2. Poll `GET /v1/video/generations/{task_id}` every few seconds. `data.status` moves from `SUBMITTED` or `QUEUED` to `IN_PROGRESS`, then to `SUCCESS` or `FAILURE`.
3. On `SUCCESS`, download the video from `data.result_url`. On `FAILURE`, `data.fail_reason` explains why.

Seedance accepts `prompt`, `images` (one image is the first frame; two are the first and last frames), `videos`, `audios`, `resolution` (`720p`, `1080p`), `ratio` (`16:9`, `9:16`, `4:3`, `3:4`, `1:1`), `duration` in seconds, `generate_audio`, `camera_fixed` and `seed`. Full reference: [Seedance 2.0 API guide](https://tokenra.io/zh/docs/seedance-2-0-api).

## Production notes

- Keep API keys on the server. Never ship them in browser or mobile code, and never commit them.
- Use a separate key per environment, set timeouts, and retry `429` and `5xx` responses with backoff.
- Validate model output and tool arguments before running anything with side effects.
- How TokenRa handles request content: [Zero Data Retention](https://tokenra.io/zero-data-retention.html).

---

## 中文

**一个 API Key，调用 DeepSeek、GLM、Kimi、Qwen、MiniMax、GPT Image、Seedance 和 Jev。**

TokenRa 是兼容 OpenAI 协议的 AI API 网关。本仓库提供 cURL、Python、Node.js、Go 的可运行示例，覆盖对话、流式输出、工具调用、识图、生图、视频生成和 Jev 结构化判断。

[官网](https://tokenra.io/zh/) · [获取 API Key](https://tokenra.io/register) · [模型与价格](https://tokenra.io/zh/models.html) · [开发文档](https://tokenra.io/zh/docs.html)

### 快速开始

1. 在 [tokenra.io/register](https://tokenra.io/register) 注册并创建 API Key。
2. 设置环境变量：`export TOKENRA_API_KEY="sk-..."`
3. 发送请求：

```bash
curl https://tokenra.io/v1/chat/completions \
  -H "Authorization: Bearer $TOKENRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4.1-flash",
    "messages": [{"role": "user", "content": "你好！"}]
  }'
```

已经在用 OpenAI SDK？把 `base_url` 换成 `https://tokenra.io/v1`，Key 换成 TokenRa 的 Key，其余代码不用改。

### 示例目录

| 功能 | 接口 | 示例 |
| --- | --- | --- |
| 对话 | `POST /v1/chat/completions` | [cURL](curl/chat.sh) · [Python](python/chat.py) · [Node.js](node/chat.mjs) · [Go](go/chat/main.go) |
| 流式输出 | 同上，`stream: true` | [cURL](curl/stream.sh) · [Python](python/stream.py) · [Node.js](node/stream.mjs) · [Go](go/stream/main.go) |
| 工具调用 | 同上，传 `tools` | [Python](python/tool_calling.py) · [Node.js](node/tool-calling.mjs) |
| 识图 | 同上，传 `image_url` | [Python](python/vision.py) · [Node.js](node/vision.mjs) |
| 生图 | `POST /v1/images/generations` | [cURL](curl/image.sh) · [Python](python/image_generation.py) · [Node.js](node/image.mjs) |
| 视频生成（异步） | `POST /v1/video/generations` | [cURL 提交](curl/video-create.sh) · [cURL 查询](curl/video-status.sh) · [Python](python/video_generation.py) · [Node.js](node/video.mjs) |
| Jev 结构化判断 | `POST /v1/decisions` | [cURL](curl/decision.sh) · [Python](python/jev_decision.py) · [Node.js](node/decision.mjs) |
| 查询可用模型 | `GET /v1/models` | [cURL](curl/models.sh) |

LangChain、Vercel AI SDK、Claude Code、OpenCode 的接入方式见 [integrations/](integrations/README.md)。

### 运行方式

所有示例都从环境变量读取配置：

| 变量 | 默认值 | 用于 |
| --- | --- | --- |
| `TOKENRA_API_KEY` | 必填 | 全部示例 |
| `TOKENRA_BASE_URL` | `https://tokenra.io/v1` | 全部示例 |
| `TOKENRA_MODEL` | `deepseek-v4.1-flash` | 对话、流式、工具调用、识图 |
| `TOKENRA_IMAGE_MODEL` | `gpt-image-2.5-flare` | 生图 |
| `TOKENRA_VIDEO_MODEL` | `seedance-2-0-mini` | 视频生成 |

各语言的运行命令见上方英文部分 [Run the examples](#run-the-examples)。

### 视频任务说明

视频生成是异步的：提交后立即返回 `task_id`，之后每隔几秒查询一次 `GET /v1/video/generations/{task_id}`。`data.status` 会从 `SUBMITTED` 或 `QUEUED` 变为 `IN_PROGRESS`，最后变成 `SUCCESS` 或 `FAILURE`。成功后视频地址在 `data.result_url`，失败原因在 `data.fail_reason`。Seedance 完整参数见 [Seedance 2.0 API 文档](https://tokenra.io/zh/docs/seedance-2-0-api)。

### 注意事项

- API Key 只放在服务端，不要写进网页前端或 App，也不要提交到代码仓库。
- 不同环境用不同的 Key；请求要设超时，遇到 `429` 和 `5xx` 做退避重试。
- 模型 ID、可用性和价格会变化，以[模型目录](https://tokenra.io/zh/models.html)和 `GET /v1/models` 为准。
- TokenRa 如何处理请求内容：[零数据留存说明](https://tokenra.io/zh/zero-data-retention.html)。

## License

[MIT](LICENSE)

"""Stream a chat completion token by token (Server-Sent Events).

Usage:
    python stream.py "Your question"
"""

import os
import sys

from openai import OpenAI

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

client = OpenAI(api_key=api_key, base_url=os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1"))
model = os.getenv("TOKENRA_MODEL", "deepseek-v4.1-flash")
prompt = " ".join(sys.argv[1:]) or "Write a four-line poem about shipping code on Friday."

stream = client.chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": prompt}],
    stream=True,
    stream_options={"include_usage": True},
)

# Reasoning models stream their thinking first in delta.reasoning_content,
# so the answer below can take a few seconds to start.
usage = None
for chunk in stream:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
    if chunk.usage:
        usage = chunk.usage
print()

if usage:
    print(f"\n[{model}] prompt_tokens={usage.prompt_tokens} completion_tokens={usage.completion_tokens}")

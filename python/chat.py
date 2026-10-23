"""Minimal chat completion through TokenRa's OpenAI-compatible API.

Usage:
    python chat.py "Your question"
"""

import os
import sys

from openai import OpenAI

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

client = OpenAI(api_key=api_key, base_url=os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1"))
model = os.getenv("TOKENRA_MODEL", "deepseek-v4.1-flash")
prompt = " ".join(sys.argv[1:]) or "Explain what an API gateway does in two sentences."

response = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "system", "content": "You are a concise technical assistant."},
        {"role": "user", "content": prompt},
    ],
)

print(response.choices[0].message.content)
usage = response.usage
if usage:
    print(f"\n[{model}] prompt_tokens={usage.prompt_tokens} completion_tokens={usage.completion_tokens}")

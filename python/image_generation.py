"""Generate an image with GPT Image 2.5 and save it under ./output.

Usage:
    python image_generation.py "A watercolor fox reading a book under a lamp"
"""

import base64
import os
import sys
import time
from pathlib import Path

import httpx
from openai import OpenAI

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

client = OpenAI(api_key=api_key, base_url=os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1"))
model = os.getenv("TOKENRA_IMAGE_MODEL", "gpt-image-2.5-flare")
prompt = " ".join(sys.argv[1:]) or "A clean editorial illustration of a sunrise over a city skyline"

result = client.images.generate(model=model, prompt=prompt)
image = result.data[0]

out = Path("output") / f"image-{int(time.time())}.png"
out.parent.mkdir(exist_ok=True)
if image.b64_json:
    out.write_bytes(base64.b64decode(image.b64_json))
else:
    # The image host is not TokenRa, so download without the Authorization header.
    print(f"URL: {image.url}")
    out.write_bytes(httpx.get(image.url, timeout=120, follow_redirects=True).raise_for_status().content)
print(f"Saved {out}")

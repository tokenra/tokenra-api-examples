"""Ask a multimodal model about an image, from a URL or a local file.

Usage:
    python vision.py                       # uses a sample image
    python vision.py https://example.com/photo.jpg
    python vision.py ./screenshot.png "What error is shown here?"
"""

import base64
import mimetypes
import os
import sys
from pathlib import Path

from openai import OpenAI

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

client = OpenAI(api_key=api_key, base_url=os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1"))
model = os.getenv("TOKENRA_MODEL", "deepseek-v4.1-flash")
image = sys.argv[1] if len(sys.argv) > 1 else "https://tokenra.io/models/glm-5-3-flashx-card.jpg"
question = " ".join(sys.argv[2:]) or "Describe this image in two sentences."

# Local files are sent inline as a base64 data URL. Use one when the model
# provider cannot download your URL ("Timeout while downloading").
if Path(image).is_file():
    mime = mimetypes.guess_type(image)[0] or "image/png"
    image = f"data:{mime};base64,{base64.b64encode(Path(image).read_bytes()).decode()}"

response = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": question},
                {"type": "image_url", "image_url": {"url": image}},
            ],
        }
    ],
)
print(response.choices[0].message.content)

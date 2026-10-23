"""Function calling: the model asks for a tool, we run it, the model answers.

The weather lookup is a local stub so the example runs without another API.

Usage:
    python tool_calling.py "What's the weather in Tokyo and Paris?"
"""

import json
import os
import sys

from openai import OpenAI

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

client = OpenAI(api_key=api_key, base_url=os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1"))
model = os.getenv("TOKENRA_MODEL", "deepseek-v4.1-flash")
prompt = " ".join(sys.argv[1:]) or "What's the weather in Tokyo and Paris right now?"

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a city.",
            "parameters": {
                "type": "object",
                "properties": {"city": {"type": "string", "description": "City name, for example Tokyo"}},
                "required": ["city"],
            },
        },
    }
]

# Stub data. Replace with a real weather API in your application.
FAKE_WEATHER = {"tokyo": (21, "clear"), "paris": (14, "light rain")}


def get_weather(city: str) -> dict:
    temperature, condition = FAKE_WEATHER.get(city.lower(), (18, "cloudy"))
    return {"city": city, "temperature_c": temperature, "condition": condition}


messages = [{"role": "user", "content": prompt}]

for _ in range(5):
    response = client.chat.completions.create(model=model, messages=messages, tools=tools)
    message = response.choices[0].message
    if not message.tool_calls:
        print(message.content)
        break

    # Keep the assistant turn as returned (tool calls and any reasoning fields)
    # so the model sees its own request when it reads the tool results.
    messages.append(message.model_dump(exclude_none=True))
    for call in message.tool_calls:
        arguments = json.loads(call.function.arguments or "{}")
        result = get_weather(**arguments)
        print(f"-> {call.function.name}({arguments}) = {result}")
        messages.append({"role": "tool", "tool_call_id": call.id, "content": json.dumps(result)})
else:
    sys.exit("The model kept calling tools; stopping after 5 rounds.")

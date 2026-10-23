"""Typed decisions with Jev (TypeSafe): booleans, choices and scores with confidence.

Jev does not use the chat format. You send a `state` (the text to judge) plus named
`questions`, and every answer comes back typed instead of as free text.

Usage:
    python jev_decision.py "Help! My payouts have been failing for 3 days."
"""

import os
import sys

import httpx

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

base_url = os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1").rstrip("/")
state = " ".join(sys.argv[1:]) or "Help! My payouts have been failing for 3 days."

payload = {
    "model": "jev-latest",
    "state": state,
    "questions": {
        "is_urgent": {
            "type": "noul",
            "instructions": "Does this message convey urgency?",
            "criteria": {"true": "Explicitly time-sensitive", "false": "No urgency expressed"},
        },
        "department": {
            "type": "choice",
            "instructions": "Which team should handle this?",
            "criteria": {
                "billing": "Payments, invoicing, refunds",
                "technical": "Bugs, outages, integrations",
                "sales": "Pricing, upgrades, new accounts",
            },
        },
        "frustration": {
            "type": "score",
            "instructions": "How frustrated is the customer?",
            "criteria": ["Calm", "Frustrated", "Very angry"],
        },
    },
}

response = httpx.post(
    f"{base_url}/decisions",
    json=payload,
    headers={"Authorization": f"Bearer {api_key}"},
    timeout=60,
)
if response.is_error:
    sys.exit(f"HTTP {response.status_code}: {response.text}")

for name, answer in response.json()["answers"].items():
    if answer["type"] == "noul":
        print(f"{name}: P(true) = {answer['noul']:.2f}")
    elif answer["type"] == "choice":
        print(f"{name}: {answer['choice']} (confidence {answer['confidence']:.2f}) {answer['probabilities']}")
    elif answer["type"] == "score":
        print(f"{name}: {answer['score']:.2f} on {answer['legend']} (confidence {answer['confidence']:.2f})")

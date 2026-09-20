"""
translation_service.py
Task 2: Translation Prompt
Converts raw OCR text from AWS Textract into plain, patient-friendly language
using OpenRouter (free LLM gateway) with Google Gemini as the model.

OpenRouter works with a standard Bearer key (sk-or-...) — no Google auth issues.
Get a free key at: https://openrouter.ai (sign up with Google, free credits included)
"""
import os
import json
import re
import requests
from pathlib import Path
from dotenv import load_dotenv

# Always load from backend/.env regardless of where the script is run from
_ENV_PATH = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

# -- OpenRouter Setup ----------------------------------------------------------
# OpenRouter is a free LLM gateway. Sign up at https://openrouter.ai
# After signing up, go to https://openrouter.ai/keys to create your API key (starts with sk-or-)
# Add it to backend/.env as: OPENROUTER_API_KEY=sk-or-your-key-here
#
# Free models available include: google/gemini-2.5-flash-preview, meta-llama/llama-3.1-8b-instruct
_OR_KEY = os.getenv("OPENROUTER_API_KEY", "")
_GEMINI_AVAILABLE = bool(_OR_KEY and _OR_KEY not in ("your_openrouter_api_key_here", ""))

if not _GEMINI_AVAILABLE:
    print("WARNING: OPENROUTER_API_KEY not set in backend/.env -- translation will use offline fallback.")
    print("         Sign up free at https://openrouter.ai then add your sk-or-... key to backend/.env")

_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
_MODEL = "google/gemini-3.6-flash"  # Valid OpenRouter Gemini model ID


def _call_llm(prompt: str) -> str:
    """Calls OpenRouter API and returns the model's text response."""
    resp = requests.post(
        _OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {_OR_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://mediscan.app",  # Optional but good practice
            "X-Title": "MediScan Prescription Translator",
        },
        json={
            "model": _MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.4,
            "max_tokens": 2000,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]



# -- The Prompt ----------------------------------------------------------------
TRANSLATION_PROMPT_TEMPLATE = """
You are a warm, friendly pharmacist assistant helping a patient understand their prescription.
The patient has just scanned their prescription using MediScan, and they need you to explain it
in simple, everyday language - NO medical jargon, NO Latin abbreviations.

Here is the raw prescription text extracted from their document:

---
{raw_text}
---

Your task:
1. Write a plain-language summary (2-3 sentences, max 80 words).
2. Extract 3-5 key takeaways the patient must remember.
3. List each medication with a simple explanation of what it does and how to take it.
4. List 2-3 practical safety tips specific to THESE medications.
5. Suggest 2 smart questions the patient should ask their doctor at follow-up.

IMPORTANT RULES:
- Replace medical terms: e.g. "BID" means "twice a day", "PRN" means "as needed", "PO" means "by mouth"
- If you detect two drugs that are commonly known to interact dangerously (e.g. Warfarin + Ibuprofen),
  make the first key takeaway a clear warning starting with "WARNING:"
- Be reassuring but honest. If there are no issues, say so clearly.
- Keep the tone warm and human - like a trusted friend who happens to be a pharmacist.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "plain_language_summary": "string",
  "key_takeaways": ["string", "string", "string"],
  "medications": [
    {
      "name": "Medicine name",
      "what_it_does": "One simple sentence about its purpose",
      "how_to_take": "Simple dosage instructions",
      "important_note": "Critical warning or food/timing note, or empty string"
    }
  ],
  "safety_tips": ["string", "string"],
  "doctor_questions": ["string", "string"]
}
"""


# -- Main Function -------------------------------------------------------------

def translate_prescription(raw_text: str) -> dict:
    """
    Takes OCR-extracted prescription text and returns a plain-language
    translation using Google Gemini 2.0 Flash.

    Args:
        raw_text: The raw string from AWS Textract (or the mock fallback).

    Returns:
        A dict with keys:
          - plain_language_summary (str)
          - key_takeaways (list[str])
          - medications (list[dict])
          - safety_tips (list[str])
          - doctor_questions (list[str])
          - source (str) -- "gemini" or "fallback"
    """
    if not raw_text or not raw_text.strip():
        return _offline_fallback("No prescription text was provided.")

    # Try Gemini REST API
    if _GEMINI_AVAILABLE:
        try:
            prompt = TRANSLATION_PROMPT_TEMPLATE.replace("{raw_text}", raw_text.strip())
            raw_response = _call_llm(prompt)

            # Strip markdown code fences if Gemini wraps the JSON
            cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_response, flags=re.MULTILINE).strip()

            result = json.loads(cleaned)

            # Validate expected keys exist
            required_keys = {"plain_language_summary", "key_takeaways", "safety_tips", "doctor_questions"}
            if not required_keys.issubset(result.keys()):
                raise ValueError(f"Gemini response missing expected keys. Got: {list(result.keys())}")

            # Ensure medications key exists
            if "medications" not in result:
                result["medications"] = []

            result["source"] = "gemini"
            print(f"Gemini translation successful ({len(raw_response)} chars)")
            return result

        except requests.HTTPError as e:
            print(f"ERROR - Gemini HTTP error: {e.response.status_code} {e.response.text[:200]}")
            return _offline_fallback(raw_text)

        except json.JSONDecodeError as e:
            print(f"ERROR - Gemini returned invalid JSON: {e}")
            return _offline_fallback(raw_text)

        except Exception as e:
            print(f"ERROR - Gemini API call failed: {type(e).__name__}: {e}")
            return _offline_fallback(raw_text)

    # Offline Fallback
    return _offline_fallback(raw_text)



def _offline_fallback(raw_text: str = "") -> dict:
    """
    A rule-based fallback when Gemini is unavailable.
    Detects drugs by keyword and flags known dangerous combos.
    Mirrors the fallback pattern in textract_service.py.
    """
    text_lower = raw_text.lower()

    detected_drugs = []
    drug_map = {
        "amoxicillin":    "Amoxicillin (an antibiotic)",
        "ibuprofen":      "Ibuprofen (a pain reliever)",
        "warfarin":       "Warfarin (a blood thinner)",
        "aspirin":        "Aspirin (a blood thinner / pain reliever)",
        "paracetamol":    "Paracetamol (a pain reliever)",
        "metformin":      "Metformin (a diabetes medication)",
        "lisinopril":     "Lisinopril (a blood pressure medication)",
        "pantoprazole":   "Pantoprazole (a stomach acid reducer)",
        "levocetirizine": "Levocetirizine (an antihistamine for allergies)",
    }
    for drug, label in drug_map.items():
        if drug in text_lower:
            detected_drugs.append(label)

    warnings = []
    if "warfarin" in text_lower and "ibuprofen" in text_lower:
        warnings.append(
            "WARNING: Warfarin and Ibuprofen together greatly increases your risk "
            "of serious bleeding. Talk to your doctor before taking both."
        )
    if "warfarin" in text_lower and "aspirin" in text_lower:
        warnings.append(
            "WARNING: Taking Warfarin with Aspirin can increase your risk of bleeding. "
            "Follow your doctor's instructions carefully."
        )

    drug_list_str = ", ".join(detected_drugs) if detected_drugs else "the medications listed"
    summary = (
        f"Your prescription includes {drug_list_str}. "
        "Follow the dosage instructions carefully and complete the full course as directed. "
        "Contact your doctor if you notice any unusual side effects."
    )

    key_takeaways = warnings + [
        "Take each medication at the same time every day for best results.",
        "Do not stop taking any medication early without consulting your doctor.",
        "Keep all medicines stored away from heat, moisture, and direct sunlight.",
    ]

    return {
        "plain_language_summary": summary,
        "key_takeaways": key_takeaways[:5],
        "medications": [],
        "safety_tips": [
            "Drink a full glass of water with each oral tablet.",
            "If you experience dizziness, nausea, or an allergic reaction, stop and call your doctor immediately.",
        ],
        "doctor_questions": [
            "Are there any foods or drinks I should avoid while taking these medications?",
            "What should I do if I accidentally miss a dose?",
        ],
        "source": "fallback",
    }


# -- Manual Test Runner --------------------------------------------------------
# Run directly to test the translation on 3 example prescriptions:
#   cd c:\Users\DELL\Desktop\AWS\mediscan
#   python -m backend.services.translation_service
if __name__ == "__main__":
    SEP = "-" * 65

    test_cases = [
        (
            "Test 1: Amoxicillin + Ibuprofen (Routine)",
            """
            Dr. Sarah Jenkins - General Practice
            Patient: Jane Doe, DOB: 1985-04-12
            1. Amoxicillin 500mg - Take 1 tablet 3x daily for 7 days.
            2. Ibuprofen 400mg - Take 1 tablet every 6 hours as needed for pain.
            Notes: Follow up in 2 weeks if symptoms do not improve.
            """
        ),
        (
            "Test 2: Warfarin + Ibuprofen + Aspirin (DANGEROUS COMBO)",
            """
            Dr. R.K. Sharma, MD - Cardiology
            Patient: Pragya Verma, 42F
            1. Warfarin Sodium 5mg - Once daily at 7PM. For: Blood clot prevention.
            2. Ibuprofen 400mg - Twice daily after food. For: Joint pain relief.
            3. Aspirin 75mg - Once daily after lunch. For: Heart protection.
            4. Pantoprazole 40mg - Before breakfast. For: Stomach protection.
            """
        ),
        (
            "Test 3: ENT Prescription (Safe, Clean)",
            """
            Dr. Ananya Patel, MS (ENT)
            Patient: Aarav Mehta, 28M
            1. Amoxicillin + Clavulanic Acid (Augmentin 625) - Twice daily for 7 days.
            2. Levocetirizine 5mg - Once daily at bedtime.
            3. Lactobacillus Spores (Sporlac DS) 1 capsule - Once daily at lunch.
            """
        ),
    ]

    print("=" * 65)
    print("  MediScan Translation Service - Manual Test")
    print(f"  Gemini Available: {_GEMINI_AVAILABLE}")
    print("=" * 65)

    for label, text in test_cases:
        print(f"\n{SEP}")
        print(f"  {label}")
        print(SEP)
        result = translate_prescription(text)
        print(f"  [Source]  {result.get('source', 'unknown')}")
        print(f"  [Summary] {result['plain_language_summary']}")
        print("  [Takeaways]")
        for t in result['key_takeaways']:
            print(f"    * {t}")
        if result.get('medications'):
            print("  [Medications]")
            for m in result['medications']:
                print(f"    - {m['name']}: {m['what_it_does']}")
                if m.get('important_note'):
                    print(f"      NOTE: {m['important_note']}")
        print()

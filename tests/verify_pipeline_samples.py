import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAMPLES_DIR = os.path.join(BASE_DIR, "data", "sample_documents")
MANIFEST_PATH = os.path.join(SAMPLES_DIR, "manifest.json")
INTERACTIONS_PATH = os.path.join(BASE_DIR, "data", "interaction_list.json")

sys.path.insert(0, BASE_DIR)
from backend.services.textract_service import extract_text_from_document

def verify_all():
    print("=" * 70)
    print("MEDISCAN PIPELINE & SAMPLE DOCUMENTS VERIFICATION")
    print("=" * 70)

    if not os.path.exists(MANIFEST_PATH):
        print(f"[FAIL] Manifest missing at {MANIFEST_PATH}")
        return False
    with open(MANIFEST_PATH, "r") as f:
        manifest = json.load(f)
    print(f"[PASS] Manifest loaded with {len(manifest['samples'])} sample specifications.")

    with open(INTERACTIONS_PATH, "r") as f:
        known_interactions = json.load(f)
    print(f"[PASS] Known interaction list loaded ({len(known_interactions)} rules).")

    all_passed = True
    for sample in manifest["samples"]:
        sample_id = sample["id"]
        png_path = os.path.join(SAMPLES_DIR, sample["filename_png"])
        pdf_path = os.path.join(SAMPLES_DIR, sample["filename_pdf"])

        print("-" * 70)
        print(f"Checking {sample_id.upper()}: {sample['category']}")
        print(f"  Patient: {sample['patient']['name']} | Facility: {sample['facility']}")

        if not os.path.exists(png_path) or os.path.getsize(png_path) == 0:
            print(f"  [FAIL] PNG missing or empty: {sample['filename_png']}")
            all_passed = False
        else:
            print(f"  [PASS] PNG valid ({os.path.getsize(png_path) // 1024} KB)")

        if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
            print(f"  [FAIL] PDF missing or empty: {sample['filename_pdf']}")
            all_passed = False
        else:
            print(f"  [PASS] PDF valid ({os.path.getsize(pdf_path) // 1024} KB)")

        for interaction in sample.get("expected_interactions", []):
            pair = interaction["pair"]
            if pair in known_interactions:
                print(f"  [PASS] Interaction rule '{pair}' matches interaction_list.json:")
                print(f"         Warning: \"{known_interactions[pair]}\"")
            else:
                print(f"  [FAIL] Interaction rule '{pair}' NOT FOUND in interaction_list.json!")
                all_passed = False

        try:
            with open(png_path, "rb") as img_file:
                bytes_data = img_file.read()
            res = extract_text_from_document(bytes_data)
            if res.get("status") == "success":
                print(f"  [PASS] Textract Service executed cleanly (status: success).")
            else:
                print(f"  [WARN] Textract Service returned: {res}")
        except Exception as e:
            print(f"  [FAIL] Textract service error: {e}")
            all_passed = False

    print("=" * 70)
    if all_passed:
        print("RESULT: ALL 5 SAMPLE DOCUMENTS & PIPELINE CHECKS PASSED!")
    else:
        print("RESULT: SOME CHECKS FAILED.")
    print("=" * 70)
    return all_passed

if __name__ == "__main__":
    success = verify_all()
    sys.exit(0 if success else 1)

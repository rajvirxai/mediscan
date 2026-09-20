"""
interaction_service.py
Task 3: Interaction Checker
Loads the known dangerous drug interactions from interaction_list.json
and checks extracted medications against it.
"""
import json
import uuid
from pathlib import Path
from typing import List, Dict, Any

_INTERACTION_FILE = Path(__file__).parent.parent.parent / "data" / "interaction_list.json"

def check_interactions(medications: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Scans a list of medication dictionaries for dangerous interactions.
    
    Args:
        medications: List of dicts, e.g. [{"name": "Amoxicillin", ...}, {"name": "Ibuprofen", ...}]
        
    Returns:
        A list of interaction warning dicts formatted for the frontend InteractionBanner.
    """
    if not _INTERACTION_FILE.exists():
        print(f"[InteractionService] Warning: Interaction list not found at {_INTERACTION_FILE}")
        return []

    try:
        with open(_INTERACTION_FILE, "r", encoding="utf-8") as f:
            interaction_db = json.load(f)
    except Exception as e:
        print(f"[InteractionService] Error loading interaction list: {e}")
        return []

    # Extract lowercase names for matching
    med_names = [m.get("name", "").lower() for m in medications if m.get("name")]
    warnings = []

    # Check every pair in the DB against our extracted meds
    # The DB has keys like "warfarin + ibuprofen"
    for pair_key, explanation in interaction_db.items():
        # Split "drug1 + drug2"
        drugs = [d.strip() for d in pair_key.split("+")]
        if len(drugs) == 2:
            drug1, drug2 = drugs
            
            # Check if BOTH drugs from this pair are in the patient's medication list
            # We use simple substring matching to handle things like "Warfarin Sodium"
            has_drug1 = any(drug1 in mn for mn in med_names)
            has_drug2 = any(drug2 in mn for mn in med_names)
            
            if has_drug1 and has_drug2:
                # Found an interaction!
                warnings.append({
                    "id": str(uuid.uuid4()),
                    "drug1": drug1.title(),
                    "drug2": drug2.title(),
                    "severity": "high",  # We treat all hardcoded DB pairs as high severity for MVP
                    "clinicalExplanation": explanation,
                    "recommendation": f"Consult your doctor before taking {drug1.title()} and {drug2.title()} together."
                })

    return warnings

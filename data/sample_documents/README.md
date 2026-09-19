# MediScan Sample Documents Collection (Ground Truth Dataset)

This directory contains **5 realistic printed clinical prescriptions and laboratory diagnostic reports** prepared for **AWS Textract OCR testing**, **plain-language translation**, **drug-drug interaction verification**, and the **final demo video**.

Each document is available in both **300 DPI high-resolution PNG** and **standard PDF** format.

---

## 📂 Document Catalog & Roles

| File | Document Type | Key Elements / Focus | MediScan Demo Role |
|---|---|---|---|
| `sample_01_prescription_interaction_hero.png` / `.pdf` | Cardiology / GP Prescription | **Warfarin 5mg** + **Ibuprofen 400mg** + Pantoprazole 40mg | **⭐ Hero Demo Video Document**: Triggers the critical `warfarin + ibuprofen` severe bleeding warning banner and shows scheduled dose timing (8:00 AM / 8:00 PM). |
| `sample_02_prescription_chronic_routine.png` / `.pdf` | Endocrinology Prescription | **Metformin 500mg ER** + **Amlodipine 5mg** + **Atorvastatin 20mg** | **Clean Negative Control**: Routine chronic maintenance regimen. No adverse interaction flags; ideal for testing plain-language translation and setting up multiple daily reminder alarms. |
| `sample_03_lab_report_comprehensive_metabolic.png` / `.pdf` | Diagnostic Pathology Lab Report | Fasting Glucose (148 mg/dL - High), HbA1c (7.8% - High), Lipid Panel (High LDL, Low HDL) | **Lab Report Translation**: Demonstrates Textract tabular/key-value extraction on clinical lab panels and tests LLM explanation of abnormal values in calm, understandable language. |
| `sample_04_prescription_pediatric_antibiotic.png` / `.pdf` | Pediatric Prescription | **Amoxicillin 250mg/5mL** (10-day strict course) + Paracetamol + Electrolytes | **Adherence & Caregiver Clarity**: Tests interval timing (every 8 hours) and important instructions ("Complete full course even if fever subsides"). |
| `sample_05_prescription_cardio_clopidogrel.png` / `.pdf` | Post-PCI Cardiac Discharge | **Clopidogrel 75mg** + **Omeprazole 20mg** + Aspirin 81mg | **Alternative Interaction Trigger**: Triggers `clopidogrel + omeprazole` warning ("Decreased effectiveness of clopidogrel, increasing heart attack risk"). Proves interaction engine is dynamic. |

---

## 🚀 How Each Teammate Uses These Samples

### 1. Rajvir (Textract + Core Backend)
- **OCR Testing**: Run your Textract standalone test script against all 5 files to confirm OCR detection on varied layouts (clinic headers, bulleted items, tabular rows):
  ```bash
  # Test with sample 1
  python backend/services/textract_service.py data/sample_documents/sample_01_prescription_interaction_hero.png
  ```
- **File Upload Testing**: POST any of these PNG or PDF files to `http://localhost:8000/upload`.

### 2. Mrinmoy (Translation + Drug Interaction + Reminders)
- **Interaction Engine**: Test your interaction checker with `sample_01` (must return `"warfarin + ibuprofen"`) and `sample_05` (must return `"clopidogrel + omeprazole"`), while ensuring `sample_02` returns zero flags.
- **Plain Language Translation**: Feed the raw OCR text into your Claude/Bedrock prompt to verify it explains dosages, timings, and warnings in layman's terms.
- **Reminder Timings**: Extract timings like `"8:00 AM"`, `"8:00 PM"` from `sample_01` and `sample_02` for `/schedule-reminder`.

### 3. Pragya (Frontend + Demo Video)
- **Upload UI Testing**: Drag and drop these files onto the Next.js dropzone to test image preview and responsiveness.
- **Demo Video Recording**: Use **`sample_01_prescription_interaction_hero.png`** as the hero document for the 3-minute video:
  - 0:20 - 0:40: Upload `sample_01`
  - 0:40 - 1:10: Show AWS Textract extraction
  - 1:10 - 1:40: Show plain-language translation
  - 1:40 - 2:00: Highlight red warning banner ("Warfarin + Ibuprofen: Increased risk of severe bleeding")
  - 2:00 - 2:30: Show the in-app alarm and WhatsApp reminder for the 8:00 PM dose!

---

## 🛠 Regenerating Samples

If you ever need to adjust font sizes, doctor details, or add more test cases, edit and run the generator script:
```bash
python data/generate_sample_documents.py
```
This will automatically re-render all PNG and PDF files at 300 DPI.

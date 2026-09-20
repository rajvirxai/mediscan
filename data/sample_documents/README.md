# MediScan Standard Clinical Sample Documents (Ground Truth Evaluation Dataset)

This repository contains **4 standardized printed clinical test documents** prepared for **AWS Textract OCR benchmarking**, **plain-language translation**, **drug?drug interaction detection**, and the **final demo video**.

Every document is formatted at **300 DPI high-resolution** in both **PNG** and **PDF** format, featuring realistic clinical layouts, simulated hospital headers, doctor credentials, and fully de-identified synthetic patient data.

---

## ?? Evaluation Manifest Table

| File Name | Target Pipeline Feature | Key Content / Active Ingredients | Expected Ground Truth Output / Flags |
|---|---|---|---|
| `sample_01_flagged_rx.png` / `.pdf` | **Drug?Drug Interaction Detection** & Daily Medication Scheduling | ? **Warfarin Sodium 5 mg** (once daily at 8:00 PM)<br>? **Aspirin 81 mg** (once daily at 8:00 AM with food)<br>? Omeprazole 20 mg (once daily before breakfast 7:30 AM) | ?? **Severe Interaction Flagged**:<br>`"Warfarin + Aspirin: Significantly increased risk of gastrointestinal bleeding."`<br>? **Reminder Triggers**: 7:30 AM, 8:00 AM, 8:00 PM |
| `sample_02_standard_rx.png` / `.pdf` | **Clean Negative Control** & Plain-Language Translation & Adherence | ? **Amoxicillin 500 mg** (every 8 hours: 8:00 AM, 4:00 PM, 12:00 AM; 7 days)<br>? **Paracetamol (Acetaminophen) 650 mg** (every 6h PRN)<br>? **Cetirizine HCl 10 mg** (bedtime 10:00 PM) | ? **Zero Interaction Flags** (Negative Control).<br>? **Plain Language**: Clear antibiotic course explanation ("Take for full 7 days even if feeling better").<br>? **Reminders**: 8:00 AM, 4:00 PM, 10:00 PM, 12:00 AM |
| `sample_03_cbc_lab_report.png` / `.pdf` | **Tabular Data Extraction (AWS Textract TABLES)** & Diagnostic Interpretation | ? **Complete Blood Count (CBC)** panel with 8 parameters:<br>  - WBC: 13.8 10^3/uL (High)<br>  - RBC: 4.65 10^6/uL (Normal)<br>  - Hgb: 11.4 g/dL (Low)<br>  - Hct: 35.2% (Low)<br>  - MCV: 88.5 fL (Normal)<br>  - Platelets: 245 10^3/uL (Normal)<br>  - Neutrophils: 78.0% (High)<br>  - Lymphocytes: 16.5% (Low) | ?? **Tabular Extraction**: Correct table cells for `Test Name`, `Result`, `Reference Range`, `Units`, and `Flag`.<br>? **Clinical Translation**: "Mild anemia with elevated white blood cells and neutrophils, indicating potential bacterial infection." |
| `sample_04_noisy_rx.png` / `.pdf` | **Robust OCR Under Realistic Scan Artifacts** (Noise, Skew, Watermark & Stamp) | ? **Metformin HCl 500 mg ER** (twice daily: 8:30 AM, 6:30 PM)<br>? **Lisinopril 10 mg** (once daily: 8:00 AM)<br>? **Atorvastatin Calcium 20 mg** (bedtime: 9:30 PM)<br>? **Scan Artifacts**: -1.2? skew angle, repeated background watermark, red clinic stamp, blue cursive doctor signature | ?? **Robustness Benchmark**: Textract must extract medications and dosages despite -1.2? feeder rotation and watermark interference.<br>? **Zero Interaction Flags**.<br>? **Reminders**: 8:00 AM, 8:30 AM, 6:30 PM, 9:30 PM |

---

## ?? Clinical Pipeline Integration Guide

### 1. Rajvir (AWS Textract OCR & Document Ingestion)
- **Table Extraction Verification**:
  - Run Textract `AnalyzeDocument` with `FeatureTypes=["TABLES", "FORMS"]` against `sample_03_cbc_lab_report.png` to verify table boundary detection and cell relationship extraction.
- **Noise & Skew Resilience**:
  - Process `sample_04_noisy_rx.png` to verify orientation correction and text extraction accuracy with visual artifacts (stamp overlay, cursive signature, watermark).
- **Endpoint Test**:
  ```bash
  curl -X POST "http://localhost:8000/upload" -F "file=@data/sample_documents/sample_01_flagged_rx.png"
  ```

### 2. Mrinmoy (LLM Translation, Interaction Detection & WhatsApp Reminders)
- **Deterministic Interaction Trigger**:
  - Feed `sample_01_flagged_rx` into the interaction engine. It must return:
    ```json
    {
      "has_interaction": true,
      "severity": "high",
      "pair": ["warfarin", "aspirin"],
      "warning": "Significantly increased risk of gastrointestinal bleeding."
    }
    ```
- **Negative Control Validation**:
  - Feed `sample_02_standard_rx` and `sample_04_noisy_rx` into the interaction engine; both must return zero interaction warnings.
- **Reminder Time Parsers**:
  - Parse multi-dose daily intervals:
    - `sample_01`: `07:30`, `08:00`, `20:00`
    - `sample_02`: `08:00`, `16:00`, `22:00`, `00:00`
    - `sample_04`: `08:00`, `08:30`, `18:30`, `21:30`

### 3. Pragya (Next.js Frontend & Demo Walkthrough)
- **Demo Video Hero Document**:
  - Use **`sample_01_flagged_rx.png`** during live screen recording:
    1. **Upload**: Drag & drop prescription into the dropzone.
    2. **OCR Display**: Display extracted Warfarin 5mg, Aspirin 81mg, Omeprazole 20mg.
    3. **Critical Alert**: Show prominent red interaction banner warning against gastrointestinal bleeding risk.
    4. **Reminders & Schedule**: Display scheduled alarm cards and WhatsApp reminder integration.
- **Public Mirror**:
  - All 4 documents are mirrored under `frontend/public/samples/` for direct access and testing in the browser.

---

## ?? Regenerating Files
To re-render all 300 DPI PNGs and PDFs:
```bash
python data/generate_sample_documents.py
```

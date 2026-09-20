# ??? MediScan ? Intelligent Clinical Prescription & Safety Radar

> **Turn dense, confusing medical prescriptions into clear, plain-language guidance, life-saving drug interaction alerts, and automated dosage reminders.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AWS Textract](https://img.shields.io/badge/AWS-Amazon%20Textract-FF9900?style=flat&logo=amazonaws)](https://aws.amazon.com/textract/)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?style=flat&logo=sqlite)](https://sqlite.org/)
[![WhatsApp Cloud API](https://img.shields.io/badge/Reminders-WhatsApp%20Cloud%20API-25D366?style=flat&logo=whatsapp)](https://developers.facebook.com/docs/whatsapp/cloud-api)

---

## ?? Problem Statement

Every year, millions of preventable emergency room visits and hospital admissions are caused by **adverse drug events (ADEs)** and **poor medication adherence**:
- **Unintelligible Jargon**: Rushed, printed, or semi-handwritten prescriptions with cryptic Latin abbreviations (`Sig: 1 tab PO QHS`) leave patients and caregivers confused about what to take and when.
- **Silent Drug?Drug Interactions**: Patients visiting multiple specialists frequently receive interacting medications (e.g., Blood Thinners + NSAIDs) that go unnoticed until severe complications arise.
- **Dosing Non-Adherence**: Studies show that nearly **50%** of chronic disease patients fail to take medications as directed, leading to preventable disease progression and readmissions.

**MediScan** bridges this healthcare literacy and safety gap with an automated, end-to-end pipeline that ingests any prescription or lab report, extracts clinical entities with **Amazon Textract**, checks for dangerous interactions, translates instructions into everyday language, and schedules in-app and WhatsApp dose reminders.

---

## ?? Core Features (V1 MVP)

- **?? Universal Document Ingestion**: Upload prescription photos, scanned clinic notes, or lab test PDFs directly via drag-and-drop or camera snap.
- **? AWS Textract OCR & Key-Value Extraction**: High-precision layout and tabular data parsing powered by Amazon Textract to capture medication names, strengths, frequencies, and lab parameters without manual entry.
- **?? Plain-Language Medical Translation**: LLM-powered reasoning layer that translates dense clinical instructions into clear, friendly guidance (with multilingual support for English, Hindi, and regional languages).
- **?? Drug?Drug Interaction Radar**: Instant deterministic screening against curated clinical interaction rules (e.g., `Warfarin + Aspirin` / `Warfarin + Ibuprofen`) with prominent high-visibility warning banners.
- **? In-App Sound Alarm & Live Alert**: Web Audio API-powered chime and on-screen notification that rings while the app tab is open at the exact scheduled dose time.
- **?? Automated WhatsApp Reminders**: Direct integration with WhatsApp Cloud API to deliver scheduled push messages straight to the patient's phone ? no extra app install required.

---

## ??? System Architecture

```
[ User Browser / Mobile Web ]
             |
             v  (Upload Image / PDF)
     [ Next.js Frontend ]
             |
             v  POST /upload
     [ FastAPI Backend ]
             |
    +--------+--------------------------+-----------------------+
    |                                   |                       |
    v                                   v                       v
[ Amazon Textract ]          [ Interaction Checker ]    [ SQLite Database ]
(Extract text, tables,       (Deterministic match       (Store report,
 key-values, and dosage)      against curated list)      reminder schedule)
    |                                   |                       |
    v                                   |                       v
[ Text LLM Reasoning ]                  |             [ APScheduler Engine ]
(Plain-language summary                 |                       |
 & dosage breakdown)                    |                       v
    |                                   |             [ WhatsApp Cloud API ]
    +-----------------+-----------------+             (Automated dose alerts)
                      |
                      v
             [ Results Payload ]
                      |
                      +--------------------------------> [ In-App Sound Alarm ]
                      v                                  (Fires while tab open)
         [ Frontend Results Dashboard ]
```

---

## ?? Where AWS Fits

**Amazon Textract** is the core computer vision & document understanding foundation of MediScan:
- **Layout & Form Extraction**: Textract accurately detects document structures across diverse clinic formats, separating patient demographics, clinical impressions, and distinct Rx line items.
- **Tabular Data Understanding**: For complex Complete Blood Count (CBC) and metabolic lab panels, Textract's `TABLES` analysis extracts test names, numerical values, units, and reference ranges into structured key-value representations.
- **Noise & Skew Resilience**: Textract reliably reads skewed feeds (e.g. tilted scanner inputs), stamps, watermarks, and multi-column clinical notes where standard optical OCR fails.

---

## ?? Repository Structure

```
mediscan/
??? backend/                       # FastAPI REST API & Core Services
?   ??? main.py                    # App entrypoint, CORS, route mounting
?   ??? routes/
?   ?   ??? upload.py              # POST /upload document ingestion
?   ?   ??? results.py             # GET /results/{report_id} query
?   ?   ??? reminder.py            # POST /schedule-reminder endpoint
?   ??? services/
?   ?   ??? textract_service.py    # AWS Textract integration & fallback
?   ?   ??? translation_service.py # Plain-language LLM translation
?   ?   ??? interaction_service.py # Drug interaction detection engine
?   ?   ??? whatsapp_service.py    # WhatsApp Cloud API client
?   ??? db/
?   ?   ??? models.py              # Reports & Reminders SQLite schema
?   ?   ??? database.py            # Async engine & session factory
?   ??? requirements.txt
?
??? frontend/                      # Next.js 15 Tailwind Pastel Bento UI
?   ??? app/
?   ?   ??? page.tsx               # Home / upload screen with Quick Picker
?   ?   ??? results/page.tsx       # Results dashboard & safety radar
?   ?   ??? history/page.tsx       # Past scanned reports
?   ?   ??? profile/page.tsx       # Regional & notification settings
?   ??? components/
?   ?   ??? UploadDropzone.tsx     # Drag & drop upload area
?   ?   ??? SamplePicker.tsx       # 4-sample one-tap demo loader
?   ?   ??? InteractionBanner.tsx  # Red pulsing safety alert banner
?   ?   ??? MedicationGrid.tsx     # Pill schedule cards & dosage tags
?   ?   ??? AlarmNotifier.jsx      # Web audio in-app alarm chime
?   ?   ??? WhatsAppOptIn.jsx      # WhatsApp phone reminder widget
?   ??? services/
?   ?   ??? analyzerService.ts     # Frontend API adapter & live bridge
?   ??? package.json
?
??? data/                          # Shared Clinical Benchmark Data
?   ??? interaction_list.json      # Curated drug-drug interaction rules
?   ??? generate_sample_documents.py # 300 DPI PNG/PDF test generator
?   ??? sample_documents/          # 4 Standardized ground truth documents
?       ??? README.md              # Document catalog & test manifest
?       ??? manifest.json          # Structured evaluation metadata
?       ??? sample_01_flagged_rx.* # Hero Warfarin + Aspirin test document
?       ??? sample_02_standard_rx.*# Clean negative control document
?       ??? sample_03_cbc_lab_report.* # Tabular hematology CBC report
?       ??? sample_04_noisy_rx.*   # Skewed & stamped robustness scan
?
??? tests/
?   ??? verify_pipeline_samples.py # Automated end-to-end evaluation suite
??? README.md
```

---

## ?? Ground Truth Sample Documents

The repository includes **4 standardized 300 DPI test documents** in `data/sample_documents/` (mirrored to `frontend/public/samples/`):

| File Name | Category | Active Ingredients | Expected Pipeline Behavior |
|---|---|---|---|
| `sample_01_flagged_rx` | **Cardiology Rx** | Warfarin 5mg + Aspirin 81mg + Omeprazole 20mg | ?? **Severe Interaction Alert**: *"Significantly increased risk of gastrointestinal bleeding."* Schedules 07:30, 08:00, 20:00 doses. |
| `sample_02_standard_rx` | **Family Medicine Rx** | Amoxicillin 500mg + Paracetamol 650mg + Cetirizine 10mg | ? **Clean Negative Control**: Zero interaction flags. Translates 7-day antibiotic course adherence. |
| `sample_03_cbc_lab_report` | **Pathology Lab Report** | Complete Blood Count (WBC, RBC, Hgb, Hct, Platelets) | ?? **Tabular Extraction**: Correct table cells for Test, Value, Units, and High/Low flags. Explains mild anemia & leukocytosis. |
| `sample_04_noisy_rx` | **Scanned Chronic Rx** | Metformin 500mg + Lisinopril 10mg + Atorvastatin 20mg | ?? **OCR Robustness**: Handles -1.2? skew angle, red verification stamp, cursive doctor signature, and faint watermark. |

---

## ?? Getting Started & Local Setup

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**
- **AWS Account** with Amazon Textract permissions (optional for offline fallback mode)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables (optional for live AWS / WhatsApp)
# cp .env.example .env

# Start the FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
The backend will be live at `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Pipeline Verification Tests
```bash
# Verify all sample documents against Textract and interaction rules
python tests/verify_pipeline_samples.py
```

---

## ?? Team & Task Division

| Team Member | Core Focus & Ownership |
|---|---|
| **Rajvir** | **Backend Lead & AWS Integration**: Amazon Textract OCR pipeline, `/upload` & `/results` endpoints, SQLite database architecture, and final submission. |
| **Mrinmoy** | **AI Safety & Adherence Engine**: Plain-language translation layer, drug-drug interaction detection logic, and WhatsApp Cloud API `/schedule-reminder` service. |
| **Pragya** | **Frontend Lead & Video Producer**: Next.js mobile-first pastel bento UI, live API wiring, responsive state management, and 3-minute final demo video. |
| **Subhajit** | **Data Specialist & Client Features**: Clinical interaction dataset curation, sample document generation, in-app audio alarm notifier, and technical writeup. |

---

## ??? Roadmap (V2 & Future Scope)

- [ ] **Native PWA Background Notifications**: Service Worker-based alarms when the browser tab is closed.
- [ ] **Nearby Clinic & Lab Finder**: Geo-location mapping for prescribed diagnostic blood panels with estimated cost comparisons.
- [ ] **Medicine Price Comparison**: Instant price indexing across generic vs. branded drug distributors.
- [ ] **Cursive Handwriting AI**: Specialized fine-tuned OCR models for complex doctor handwritings.
- [ ] **ABDM Integration (India)**: Ayushman Bharat Digital Mission health locker sync for longitudinal medical records.

---

## ?? License
This project is licensed under the MIT License ? see the [LICENSE](LICENSE) file for details.

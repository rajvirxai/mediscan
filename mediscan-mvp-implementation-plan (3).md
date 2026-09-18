# MediScan — MVP Implementation Plan (Final)

*Hackathon context: no live demo or judge call — submission is a public repo, a ≤3-minute video (uploaded to YouTube, public/unlisted, must open in a signed-out browser), and a short writeup covering the problem, the build, and where AWS fits. A feature that only exists in the writeup does not count — it has to be shown on screen in the video.*

---

## 1. Core Features to Build

**Must-have (V1 MVP — this is what gets shown in the video):**
1. Upload a photo/PDF of a prescription or lab report
2. OCR/text extraction from that document (via Amazon Textract)
3. Plain-language translation of medical terms and dosage instructions
4. Hardcoded drug-interaction flagging (against a small curated list)
5. WhatsApp reminder scheduling based on extracted dosage/timing
6. In-app alarm/notification — sound + on-screen alert that fires while the app tab is open, at the scheduled dose time

**Leave for later (V2/roadmap — mention in writeup, don't build now):**
- Push notifications that work with the browser closed (PWA)
- Nearby labs/clinics for a prescribed test + estimated price ranges
- Medicine price comparison across platforms
- Handwriting-OCR robustness beyond pre-tested printed samples
- Multi-language output, user accounts/login, report history

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js/React | Fast to scaffold an upload → results flow; the team already knows it |
| Backend | FastAPI (Python) | Quick to build REST endpoints, easy to call APIs from, good async support |
| OCR + extraction | **Amazon Textract** | Satisfies the hackathon's AWS requirement with a genuine fit — Textract is purpose-built for exactly this task (reading text from an uploaded image/PDF), not AWS bolted on artificially |
| Translation + reasoning | Text LLM API (Claude/GPT), prompted separately from extraction | Keeps extraction and translation as two clean, debuggable stages |
| Interaction check | Hardcoded Python dict/list, no external API | Avoids a real drug-database dependency the team doesn't have time to integrate or validate |
| Reminders | WhatsApp Cloud API (sandbox) | Free, no app install for the "patient," visually strong on camera |
| In-app alarm | Browser Audio + Notification API, plain JS timer | No backend or AWS dependency — works purely in the frontend |
| Database | SQLite | Zero setup time; sufficient for a hackathon MVP |
| Reminder scheduling | Python `APScheduler` (simple background job) | Lightweight, no need for a full task queue at this scale |

**Note on AWS scope:** only Textract is used, and used deliberately where it fits — the rest of the stack stays as originally planned. This is intentional: the rule requires AWS to be genuinely used and visibly shown, not used everywhere.

---

## 3. System Architecture

```
[User Browser]
      |
      v
[Next.js Frontend] --(upload image/PDF)--> [FastAPI Backend]
                                                  |
                            +---------------------+----------------------+
                            |                     |                      |
                            v                     v                      v
                  [Amazon Textract]      [Interaction Checker]   [SQLite Database]
                  (extract text)         (match drug names       (store report,
                            |             against hardcoded       reminder schedule)
                            v             list)                         |
                   [Text LLM API]                                       v
                   (plain-language                              [Reminder Scheduler]
                    translation)                                        |
                            |                                           v
                            +---------> [Results returned to Frontend]  |
                                              |                          v
                                              v                  [WhatsApp Cloud API]
                                    [In-app Alarm/Notification]   (sends dose reminders)
                                    (fires while tab is open)
```

**Flow in words:** Frontend sends the uploaded file to the backend → backend calls Amazon Textract to extract raw text → backend calls the text LLM to translate that into plain language → backend checks extracted drug names against the hardcoded interaction list → results are stored in SQLite and returned to the frontend → the frontend triggers the in-app alarm at the scheduled time (tab open) and the backend schedules a WhatsApp message via the Cloud API in parallel.

**Must be done before moving forward:** the Textract extraction call must be tested against real sample documents and return consistently structured output before anyone builds the translation or interaction-check logic on top of it.

---

## 4. Repo Structure

Single monorepo (frontend + backend together) — repo created at `https://github.com/rajvirxai/mediscan`.

```
mediscan/
├── README.md
├── .gitignore
├── .env.example
│
├── frontend/                     ← Pragya's + Subhajit's UI work
│   ├── app/ (or pages/)
│   │   ├── upload/
│   │   └── results/
│   ├── components/
│   │   ├── UploadForm.jsx
│   │   ├── ResultsView.jsx
│   │   ├── InteractionWarning.jsx
│   │   ├── AlarmNotifier.jsx      ← Subhajit's in-app alarm
│   │   └── WhatsAppOptIn.jsx      ← Subhajit's opt-in form
│   ├── package.json
│   └── ...
│
├── backend/                       ← Rajvir's + Mrinmoy's work
│   ├── main.py                    ← FastAPI app entrypoint
│   ├── routes/
│   │   ├── upload.py               (Rajvir)
│   │   ├── results.py              (Rajvir)
│   │   └── reminder.py             (Mrinmoy)
│   ├── services/
│   │   ├── textract_service.py     (Rajvir)
│   │   ├── translation_service.py  (Mrinmoy)
│   │   ├── interaction_service.py  (Mrinmoy)
│   │   └── whatsapp_service.py     (Mrinmoy)
│   ├── db/
│   │   ├── models.py                (Rajvir)
│   │   └── database.py              (Rajvir) — SQLite setup
│   └── requirements.txt
│
├── data/
│   ├── interaction_list.json       ← Subhajit's hardcoded list
│   └── sample_documents/           ← Subhajit's test prescriptions/reports
│
└── docs/
    └── writeup.md                  ← final writeup (problem, build, AWS fit) — owner: Subhajit
```

**Why this shape:** `frontend/` and `backend/` as top-level folders keep each person's work in a clear lane with fewer merge conflicts; `services/` separates each backend integration into its own file matching ownership; `data/sample_documents/` gives everyone one shared source of test files; `docs/writeup.md` keeps the final writeup version-controlled alongside the code.

**Git workflow:** each person works on their own short-lived branch (`rajvir-textract`, `mrinmoy-whatsapp`, `pragya-frontend`, `subhajit-alarm`) and merges into `main` once their piece works standalone, rather than everyone pushing directly to `main` simultaneously.

---

## 5. Frontend Tasks

| Task | Owner | Depends on |
|---|---|---|
| Upload page (file input, preview, submit button) | Pragya | Nothing — start immediately with mocked data |
| Results page: plain-language summary display | Pragya | Backend returning translated text in an agreed JSON shape |
| Interaction warning banner | Pragya | Backend returning an `interactions` field |
| WhatsApp opt-in form (phone number input) | Subhajit | Backend reminder-scheduling endpoint |
| In-app alarm — JS timer + Audio/Notification API | Subhajit | Backend returning dosage/timing data (can build against dummy times first) |
| Wiring real endpoints in, replacing mocked data | Pragya | Backend endpoints live |
| Basic styling/cleanup | Pragya + Subhajit | Everything else functionally working — do this last |

---

## 6. Backend Tasks

| Task | Owner | Depends on |
|---|---|---|
| `/upload` endpoint — accepts image/PDF, returns extraction ID | Rajvir | Nothing — build first |
| Amazon Textract integration — extract raw text from document | Rajvir | `/upload` endpoint working; AWS credentials/IAM set up |
| Database setup — `reports` and `reminders` tables (`db/models.py`, `db/database.py`) | Rajvir | Nothing — build alongside `/upload` |
| `/translate` logic — LLM call converting extracted fields to plain language | Mrinmoy | Textract returning consistent structured output |
| Interaction-checking function — match extracted drug names against hardcoded list | Mrinmoy | Textract returning clean drug names |
| `/results` endpoint — returns translation + interaction flags to frontend | Rajvir | Translation + interaction check both working |
| `/schedule-reminder` endpoint — takes phone number + dosage timing, schedules messages | Mrinmoy | Textract returning timing info; WhatsApp sandbox access confirmed; uses Rajvir's `reminders` table model |
| WhatsApp Cloud API integration | Mrinmoy | Sandbox access set up early |

---

## 7. Database / API / AI Tasks

**Database (SQLite) — minimal schema — owner: Rajvir:**
- `reports` table: id, uploaded_file_ref, raw_extracted_text, translated_text, interaction_flags, created_at
- `reminders` table: id, report_id, phone_number, medicine_name, scheduled_time, sent_status

**AI/AWS tasks:**
- Set up AWS account/IAM credentials and get one Textract call working end-to-end on a sample document, in isolation, before wiring it into the rest of the pipeline — **owner: Rajvir**, treated as its own milestone
- Design and hand-check the translation prompt against the sample document set — **owner: Mrinmoy**
- Build the hardcoded interaction list (15-20 known dangerous combinations) — **owner: Subhajit**, doesn't depend on anyone else, can start at hour zero

**External API tasks:**
- Set up WhatsApp Cloud API sandbox access early — **owner: Mrinmoy**, start immediately since approval can take time

---

## 8. Step-by-Step Development Order

1. **Lock scope** — everyone aligns on what's in/out (already done above)
2. **Rajvir:** set up AWS credentials, get a standalone Textract call working on real sample documents
3. **Mrinmoy (parallel with step 2):** set up WhatsApp Cloud API sandbox access
4. **Subhajit (parallel with steps 2-3):** build the hardcoded interaction list; collect and prepare 3-5 real sample documents
5. **Rajvir:** build `/upload` endpoint + database setup, and wire in the confirmed Textract call
6. **Mrinmoy:** build translation layer + interaction-check logic on top of confirmed Textract output
7. **Rajvir:** build `/results` endpoint
8. **Pragya (can start much earlier in parallel, using mocked data):** build the frontend upload → results flow
9. **Mrinmoy:** build `/schedule-reminder` endpoint and wire in WhatsApp sending
10. **Subhajit:** build the in-app alarm (can start with dummy times in parallel with step 9)
11. **Pragya:** swap mocked data for real endpoints once they're live
12. **Everyone:** full end-to-end integration testing with real sample documents
13. **Pragya:** script, record, and edit the ≤3-minute demo video
14. **Subhajit (owner):** write the short writeup (problem, build, where AWS fits), everyone reviews/adds a line on their own piece
15. **Everyone:** run the submission checklist (Section 11); **Rajvir** does the final submit on the hackathon's own form

**Gate at each step:** don't start step 6 until step 5's Textract output format is confirmed stable — don't start step 13 (video) until step 12's full end-to-end run is working — nothing goes in the video that hasn't been tested working at least twice.

---

## 9. Team Task Division

| Person | Owns |
|---|---|
| **Rajvir** | Amazon Textract integration, `/upload` and `/results` backend endpoints, database setup (`reports` + `reminders` tables), final hackathon form submission |
| **Mrinmoy** | Translation layer, interaction-check logic, WhatsApp Cloud API integration and `/schedule-reminder` endpoint |
| **Pragya** | Full frontend build (upload page, results page, wiring real endpoints), and owns scripting/recording/editing the final demo video |
| **Subhajit** | Hardcoded interaction list, sample document collection/prep, WhatsApp opt-in UI, in-app alarm feature, owns final writeup |

**Unblocking rule:** Rajvir shares a fixed, agreed JSON shape for Textract output (even with placeholder values) within the first hour or two, so Mrinmoy and Pragya aren't blocked waiting on the real integration to finish.

---

## 10. Testing and Integration

- Test Textract against **every** sample document planned for the video, not just one — layouts vary.
- Hand-verify every plain-language translation output for accuracy before trusting it.
- Test the WhatsApp reminder end-to-end with a real phone number well before recording.
- Test the in-app alarm firing correctly with a short (1-minute) scheduled delay, since this is the moment used live in the video.
- Run a full end-to-end pass (upload → extraction → translation → interaction flag → reminder scheduled → alarm fires) at least twice before recording.
- **Must be done before recording the video:** every piece working individually AND at least one full successful end-to-end run.

---

## 11. Demo Video — Script / Shot List (≤3 minutes)

Since there is no live demo and judges only score what's shown on screen, this video *is* the submission — plan it as a build task, not an afterthought.

| Time | Shot | What it must show |
|---|---|---|
| 0:00-0:20 | Problem framing | A quick, spoken/on-screen explanation of the confusing-prescription problem (use a short version of the caregiver/patient scenario) |
| 0:20-0:40 | Upload | Upload a real, pre-tested sample prescription/lab report |
| 0:40-1:10 | **AWS moment (required)** | Show the Textract extraction step clearly and unambiguously — e.g., a visible response/log confirming Textract was used, not just a result that could have come from anywhere |
| 1:10-1:40 | Plain-language translation | Show the confusing report turning into a clear, simple explanation |
| 1:40-2:00 | Interaction flag | Use a sample with a known flagged combination, show the warning appearing |
| 2:00-2:30 | Reminder mechanism | Show the in-app alarm firing (set a short delay live) — this is more reliable to film than waiting on WhatsApp delivery timing; a quick WhatsApp screenshot can be shown alongside it if time allows |
| 2:30-3:00 | Close | Before/after framing in one sentence, brief mention of roadmap (PWA push notifications, nearby labs, price comparison) |

**Owner: Pragya.** Do not attempt this until step 12 (full integration test) is confirmed working — re-recording after a late-discovered bug costs far more time than testing first.

---

## 12. Submission Checklist

- [ ] GitHub repository is set to **public**
- [ ] Demo video is uploaded to **YouTube**, set to **public or unlisted**
- [ ] Video link tested in a **signed-out browser** — confirm it actually opens
- [ ] Video is **under 3 minutes**
- [ ] Video visibly shows the AWS (Textract) step — not just mentioned in the writeup
- [ ] Writeup covers: the problem, what was built, and specifically where AWS fits
- [ ] Writeup lists any AI coding tools used during the build
- [ ] Writeup credits/licenses any open-source libraries, templates, or public APIs used
- [ ] Submitted once, on the hackathon's own submission form, **before the deadline** — deadlines are strict, the form closes and nothing can be entered after it (owner: Rajvir)

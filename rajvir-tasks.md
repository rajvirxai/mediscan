# Rajvir — Textract + Core Backend

## Task 1: Set up AWS account/credentials and get a standalone Textract call working

**What:** Create an AWS account (or use an existing one), set up IAM credentials with Textract permissions, and write a small standalone Python script that sends one of your sample prescription/lab images to Textract and prints the raw response.

**Why:** This is your highest-risk piece — if Textract doesn't work reliably, nothing downstream (translation, interaction check, frontend) has real data to work with. Testing it in isolation, before wiring it into the app, means a failure here doesn't block or confuse anyone else's work.

**How to start:** Go to the AWS console → IAM → create a user with `AmazonTextractFullAccess` → generate access keys → install boto3 (`pip install boto3`) → use `boto3.client('textract').detect_document_text()` on one sample image. Get this printing readable text before doing anything else.

---

## Task 2: Design a fixed JSON output shape and share it with the team

**What:** Once Textract is returning raw text, decide on a simple structured format your backend will pass downstream — e.g., `{"raw_text": "...", "drugs": [...], "tests": [...]}`. You can fill this with placeholder/fake values initially.

**Why:** Mrinmoy and Pragya are both blocked until they know what shape of data to expect. Sharing this early, even before it's real, lets everyone build in parallel instead of waiting on you.

**How to start:** Write it as a comment or a `sample_response.json` file in the repo and message it to the team.

---

## Task 3: Build the `/upload` endpoint

**What:** A FastAPI route that accepts an image/PDF upload and returns an ID.

**Why:** This is the entry point of the whole app — everything the frontend does starts here.

**How to start:** `pip install fastapi uvicorn python-multipart`, then a basic `@app.post("/upload")` route using `UploadFile`.

---

## Task 4: Wire Textract into `/upload` and build `/results`

**What:** Connect your working Textract script from Task 1 into the actual `/upload` flow, and add a `/results` endpoint that returns the extraction (and later, translation + interaction data).

**Why:** This turns your isolated test into the real pipeline.

**How to start:** Only begin this once Task 1 is confirmed working on at least 2–3 different sample documents.

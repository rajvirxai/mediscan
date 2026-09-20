# MediScan - Hackathon Submission

## 🚨 The Problem
Patients frequently receive complex, jargon-heavy, or poorly formatted printed prescriptions and lab reports from their healthcare providers. They struggle to understand the specific clinical purpose of each medication, and more importantly, they are often unaware of dangerous drug interactions—especially when receiving prescriptions from multiple specialists who don't share the same records. 

## 💡 What We Built
MediScan is a full-stack web application designed to be a patient's personal AI pharmacist. 

Users simply upload a photo or PDF of their prescription. The application:
1. **Extracts** the raw, unstructured medical text from the document.
2. **Translates** the complex medical jargon into a warm, plain-language summary so the patient understands exactly what they are taking and why.
3. **Cross-references** all detected medications against a contraindication database to instantly flag high-risk drug-drug interactions (e.g., Warfarin + Ibuprofen).
4. Provides an interactive UI with an **in-app medication alarm** and a WhatsApp reminder opt-in to improve medication adherence.

## ☁️ How We Used AWS (Amazon Textract)
**Amazon Textract** serves as the core OCR (Optical Character Recognition) engine of our application. 

When a user uploads a medical document to our FastAPI backend, the image bytes are immediately routed to the AWS Textract API via `boto3`. We utilized Textract's advanced machine learning capabilities to pull unstructured, messy clinical annotations and tabular data directly off the page with incredibly high accuracy. This raw, extracted string is then passed seamlessly into our LLM Translation Layer. Without AWS Textract reliably digitizing the physical documents, our downstream AI analysis would not be possible.

## 🛠️ Tech Stack & Open Source Libraries
- **Frontend:** Next.js (React), TailwindCSS, TypeScript
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Cloud Infrastructure:** AWS Textract (`boto3`)
- **AI Translation Layer:** OpenRouter API (utilizing `google/gemini-2.5-flash`)

## 🤖 AI Coding Tools Used
To rapidly prototype and build this MVP within the hackathon time constraints, our team utilized:
- **Google Antigravity**: Used as our primary agentic AI coding assistant to architect the FastAPI backend, integrate the AWS `boto3` Textract service, engineer the LLM prompts for the translation layer, and build React components.

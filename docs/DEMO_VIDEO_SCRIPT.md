# MediScan: 3-Minute Final Presentation & Demo Video Script

**Target Duration**: 03:00 (180 seconds)  
**Primary Test Document**: `data/sample_documents/sample_01_flagged_rx.png`  
**Live Frontend**: `http://localhost:3000`  
**Live Backend**: `http://127.0.0.1:8000`  

---

## Pre-Recording Checklist (2 Minutes Before Recording)
1. **Server Health Check**:
   - Backend running on `http://127.0.0.1:8000` (FastAPI).
   - Frontend running on `http://localhost:3000` (Next.js).
2. **Display Setup**:
   - Browser: Chrome in Fullscreen / Clean window (1920x1080).
   - Zoom level: **110%** for maximum legibility on projector and laptop screens.
   - Close all unrelated tabs and notifications (DND enabled).
3. **Hero Document Ready**:
   - Keep `sample_01_flagged_rx.png` easily accessible on desktop for drag-and-drop.
4. **Microphone**:
   - Clear tone, steady speaking pace (~130-140 words per minute).

---

## Video Timeline Overview

```
0:00 --- 0:25  | The Hook & Problem Statement (India-specific)
0:25 --- 0:55  | Live Upload & AWS Textract OCR Extraction
0:55 --- 1:30  | Plain-Language Translation & Multilingual (Hindi / Tamil / Bengali)
1:30 --- 2:05  | Hero Moment: Drug-Drug Interaction Detection (Warfarin + Aspirin)
2:05 --- 2:40  | Patient Adherence: In-App Alarm & WhatsApp Reminders
2:40 --- 3:00  | Full-Stack Architecture & Closing Impact
```

---

## Section-by-Section Script

---

### Segment 1: The Problem & Solution Hook (0:00 - 0:25)
- **Time**: 25 seconds
- **Visual**: Camera on speaker OR clean MediScan Landing Page (`http://localhost:3000`). Slow cursor hover over the pastel headline: *"Understand Your Prescription in Plain English"*.
- **Tone**: Empathetic, compelling, problem-focused.

**Voiceover Script:**

> "India is the world's largest consumer of prescription medicines.
> Yet, according to a 2019 JAMA study, over 5.2 million Indians suffer
> from adverse drug events every single year -- many of them preventable.
>
> Walk into any neighbourhood clinic from Dwarka to Dharavi, and
> patients walk out clutching a handwritten or printed prescription
> they simply cannot understand. Complex medical jargon, confusing
> dosing schedules, and hidden drug-drug interactions that no one
> explains to them.
>
> Meet MediScan -- an intelligent, full-stack clinical assistant that
> transforms dense medical prescriptions into clear, actionable,
> life-saving guidance in seconds -- in Hindi, Tamil, Bengali, or
> any language the patient speaks."

---

### Segment 2: Document Upload & AWS Textract OCR (0:25 - 0:55)
- **Time**: 30 seconds
- **Visual**: Drag `sample_01_flagged_rx.png` from file manager into the MediScan upload dropzone. Show the upload progress animation and transition into the Results dashboard. Point cursor to the extracted medication items and the **Live Data (API Connected)** badge.
- **Tone**: Technical confidence, showing speed and seamless pipeline.

**Voiceover Script:**

> "Here, our patient Eleanor has just been discharged from the
> cardiology OPD with this printed prescription. Let's upload it
> to MediScan.
>
> (Action: Drag and drop sample_01_flagged_rx.png)
>
> Under the hood, our FastAPI backend dispatches the document to
> AWS Textract. Textract instantly runs OCR layout analysis and
> key-value pair extraction -- recognizing the clinic header,
> patient demographics, and every single prescribed medication.
>
> Drug names, tablet strengths, daily frequencies, and even refill
> counts -- all extracted with high accuracy, without any manual
> data entry. This is critical in India where over 80 crore
> prescriptions are dispensed every year, and most patients have
> no way to digitize or verify what they've been given."

---

### Segment 3: Plain-Language Translation & Regional Accessibility (0:55 - 1:30)
- **Time**: 35 seconds
- **Visual**: Scroll down through the medication cards on the Results page. Hover over each pill card, the purpose badges ("Blood Thinner", "Heart Health", "Stomach Protection"), and click the language selector to switch between English, Hindi, and other regional languages.
- **Tone**: Informative, empowering, inclusive.

**Voiceover Script:**

> "Instead of leaving the patient guessing what medical abbreviations
> like 'Sig: 1 tab PO QHS' mean, MediScan's LLM engine -- powered by
> Claude on AWS Bedrock -- translates every instruction into everyday
> language.
>
> Notice how each medication is explained with unmistakable clarity:
>
> Warfarin 5 mg -- Take 1 tablet every evening at 8:00 PM.
> Aspirin 81 mg -- Take 1 tablet each morning at 8:00 AM with food.
> Omeprazole 20 mg -- Take 30 minutes before breakfast to protect
> the stomach lining.
>
> Now here is where it becomes truly powerful for India. With our
> multilingual toggle, a patient in Varanasi can read this in Hindi,
> a grandmother in Chennai can read it in Tamil, and a caregiver in
> Kolkata can read it in Bengali.
>
> In a country with 22 official languages, this is not a feature --
> it is a necessity."

---

### Segment 4: Hero Moment -- Drug-Drug Interaction Flag (1:30 - 2:05)
- **Time**: 35 seconds
- **Visual**: Scroll up to the top of the Results screen. Hover directly over the bold red pulsing Interaction Warning Banner. Keep the banner on screen for at least 8 seconds.
- **Tone**: Heightened urgency, serious clinical importance, then relief.

**Voiceover Script:**

> "Now, here is the most critical safety feature of MediScan.
>
> (Action: Highlight the Red Alert Banner)
>
> Our downstream interaction detection engine cross-references all
> extracted medications against a curated clinical interaction
> database. Immediately, MediScan flags a Severe Clinical Warning!
>
> Warfarin -- a potent blood thinner prescribed for heart conditions --
> combined with daily Aspirin, drastically increases the risk of severe
> gastrointestinal bleeding.
>
> In India, where the average OPD consultation lasts under 2 minutes,
> and polypharmacy is rampant -- patients often collect prescriptions
> from multiple specialists who may not see each other's prescriptions.
>
> MediScan catches what the system misses. This single proactive alert
> can prevent an emergency ICU admission at a cost the patient's family
> may never be able to afford."

---

### Segment 5: Patient Adherence -- Alarms & WhatsApp Reminders (2:05 - 2:40)
- **Time**: 35 seconds
- **Visual**: Scroll down to the Scheduled Reminders and Alarms section. Click the Set Daily Alarm button (briefly play/show the alarm trigger). Then highlight the WhatsApp Reminder card, showing automated scheduled push notifications for 8:00 AM and 8:00 PM.
- **Tone**: Engaging, practical, demonstrating full patient care loop.

**Voiceover Script:**

> "Prescription clarity is only half the battle -- daily adherence
> is the other half. The WHO estimates that only 50 percent of
> patients in developing countries take their medicines correctly.
>
> MediScan automatically parses the exact dosing schedule from the
> prescription. For Eleanor, that's her morning dose at 8:00 AM
> and her evening Warfarin at 8:00 PM.
>
> With one tap, patients can set an in-app alarm with sound
> notifications...
>
> (Action: Click the alarm bell icon)
>
> ...or, more importantly for India -- opt into automated daily
> WhatsApp reminders. With over 50 crore active WhatsApp users
> in India, this is the single most effective channel to reach
> patients -- from a tech-savvy professional in Bengaluru to an
> elderly patient in a Tier 3 town.
>
> A simple WhatsApp message at 8 PM: 'Time for your Warfarin.
> Take 1 tablet with water.' No app download needed."

---

### Segment 6: Architecture Recap & Closing Impact (2:40 - 3:00)
- **Time**: 20 seconds
- **Visual**: Zoom out to show the full responsive UI. Return to the clean home screen or show a quick architecture diagram. Display team credits.
- **Tone**: Inspiring, polished, proud closing.

**Voiceover Script:**

> "MediScan brings together AWS Textract for state-of-the-art
> medical OCR, Claude LLM on Bedrock for drug interaction
> reasoning and multilingual translation, and an intuitive
> Next.js pastel interface built for mobile-first India.
>
> Built collaboratively by Rajvir on backend OCR and Textract
> integration, Mrinmoy on interaction safety engines and
> WhatsApp reminders, and Pragya on frontend UX and live API
> integration.
>
> MediScan: Making every prescription understood, every
> interaction caught, and every dose remembered.
>
> Dhanyavaad. Thank you."

---

## Rehearsal Tips for Maximum Marks

1. **Hold on the Red Banner (1:30-1:45)**: Keep the red interaction warning banner on-screen for at least 8 seconds so the evaluator can comfortably read the Warfarin + Aspirin alert text.

2. **Smooth Mouse Movement**: Move cursor directly to each UI element you mention, pause for 1 second, then move to the next. Avoid random circling.

3. **Show the Live Badge**: When the Results screen loads, briefly point to the green "Live Data (API Connected)" badge to prove you are not running a hardcoded mockup.

4. **Nail the India Stats**: The 5.2 million adverse drug events, 80 crore prescriptions, 50 crore WhatsApp users, and 2-minute OPD consultation statistics are real and verifiable -- they demonstrate deep domain understanding.

5. **End with Dhanyavaad**: Closing in Hindi adds a memorable cultural touch and reinforces the multilingual accessibility theme of the entire product.

6. **Pacing Check**: If you finish any section early, take a natural breath before transitioning. Never rush the Hero Moment (Segment 4).

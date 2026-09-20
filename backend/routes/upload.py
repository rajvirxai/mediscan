import json
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Report
from backend.services.textract_service import extract_text_from_document
from backend.services.translation_service import translate_prescription

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts an uploaded image or PDF, sends it to AWS Textract for OCR,
    runs the Gemini translation layer, and saves everything to the database.
    Returns the report ID, raw extraction, and plain-language translation.
    """
    try:
        # Step 1: Read file bytes
        file_bytes = await file.read()
        
        # Step 2: Call Textract Service (OCR)
        extraction_result = extract_text_from_document(file_bytes)
        
        if extraction_result["status"] == "error":
            raise HTTPException(status_code=500, detail=extraction_result.get("error_message", "Textract failed"))
        
        raw_text = extraction_result["extraction"]["raw_text"]

        # Step 3: Translate raw OCR text → plain language (Task 2)
        translation = translate_prescription(raw_text)
        translated_text_str = translation.get("plain_language_summary", "")

        # Step 3.5: Check for dangerous drug interactions (Task 3)
        meds = translation.get("medications", [])
        from backend.services.interaction_service import check_interactions
        interaction_warnings = check_interactions(meds)
        
        # Inject the warnings into the translation dict so it gets saved to the DB
        translation["interactionWarnings"] = interaction_warnings
        translation["hasInteractions"] = len(interaction_warnings) > 0

        # Step 4: Save to SQLite Database
        new_report = Report(
            uploaded_file_ref=file.filename,
            raw_extracted_text=raw_text,
            translated_text=json.dumps(translation),
            interaction_flags=json.dumps(interaction_warnings)
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # Step 5: Return combined response with report_id + full translation
        extraction_result["report_id"] = new_report.id
        extraction_result["translation"] = translation  # Full translation object for frontend
        
        return extraction_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


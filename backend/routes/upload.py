import json
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Report
from backend.services.textract_service import extract_text_from_document

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts an uploaded image or PDF, sends it to AWS Textract for OCR,
    and saves the raw extraction to the database. Returns the report ID and extraction structure.
    """
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # Call Textract Service
        extraction_result = extract_text_from_document(file_bytes)
        
        if extraction_result["status"] == "error":
            raise HTTPException(status_code=500, detail=extraction_result.get("error_message", "Textract failed"))
        
        # Save to SQLite Database
        new_report = Report(
            uploaded_file_ref=file.filename,
            raw_extracted_text=extraction_result["extraction"]["raw_text"]
            # translated_text and interaction_flags will be updated later by Mrinmoy's tasks
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # Include report_id in the result
        extraction_result["report_id"] = new_report.id
        
        return extraction_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Report

router = APIRouter()

@router.get("/results/{report_id}")
async def get_results(report_id: int, db: Session = Depends(get_db)):
    """
    Retrieves the extracted and (eventually) translated data for a given report ID.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    # Return the structure expected by the frontend and Mrinmoy's translation layer
    return {
        "status": "success",
        "report_id": report.id,
        "extraction": {
            "raw_text": report.raw_extracted_text or "",
            "drugs": [],  # Will be parsed from translated_text when available
            "tests": []   # Will be parsed from translated_text when available
        },
        "translated_text": report.translated_text,
        "interactions": json.loads(report.interaction_flags) if report.interaction_flags else []
    }

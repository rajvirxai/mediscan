from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.db.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    uploaded_file_ref = Column(String, index=True)  # Store filename or S3 URL (if added later)
    raw_extracted_text = Column(Text, nullable=True) # Output from Textract
    translated_text = Column(Text, nullable=True)    # Mrinmoy will populate this
    interaction_flags = Column(Text, nullable=True)  # JSON-stringified flags
    created_at = Column(DateTime, default=datetime.utcnow)

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, index=True)
    phone_number = Column(String, index=True)
    medicine_name = Column(String)
    scheduled_time = Column(DateTime)
    sent_status = Column(String, default="pending")

import os
import shutil
from PIL import Image, ImageDraw, ImageFont

DATA_SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "sample_documents")
FRONTEND_SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "samples"))

os.makedirs(DATA_SAMPLE_DIR, exist_ok=True)
os.makedirs(FRONTEND_SAMPLE_DIR, exist_ok=True)

def load_font(path, size, fallback="arial.ttf"):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        try:
            return ImageFont.truetype(f"C:/Windows/Fonts/{fallback}", size)
        except Exception:
            return ImageFont.load_default()

fonts = {
    "header": load_font("C:/Windows/Fonts/arialbd.ttf", 28),
    "header_sub": load_font("C:/Windows/Fonts/arial.ttf", 18),
    "title": load_font("C:/Windows/Fonts/arialbd.ttf", 24),
    "bold": load_font("C:/Windows/Fonts/arialbd.ttf", 20),
    "med_bold": load_font("C:/Windows/Fonts/arialbd.ttf", 22),
    "regular": load_font("C:/Windows/Fonts/arial.ttf", 19),
    "small": load_font("C:/Windows/Fonts/arial.ttf", 16),
    "meta": load_font("C:/Windows/Fonts/arial.ttf", 14),
    "rx": load_font("C:/Windows/Fonts/georgiab.ttf", 46, fallback="arialbd.ttf"),
    "script": load_font("C:/Windows/Fonts/georgiai.ttf", 30, fallback="ariali.ttf"),
    "stamp": load_font("C:/Windows/Fonts/arialbd.ttf", 16),
    "table_head": load_font("C:/Windows/Fonts/arialbd.ttf", 17),
    "table_cell": load_font("C:/Windows/Fonts/arial.ttf", 17),
    "table_flag": load_font("C:/Windows/Fonts/arialbd.ttf", 16),
}

def draw_medical_cross(draw, x, y, size, color):
    arm = size // 3
    draw.rectangle([(x + arm, y), (x + 2 * arm, y + size)], fill=color)
    draw.rectangle([(x, y + arm), (x + size, y + 2 * arm)], fill=color)

def draw_header(draw, title, subtitle, address, reg_no, primary_color=(27, 54, 93)):
    draw.rectangle([(0, 0), (1240, 16)], fill=primary_color)
    draw_medical_cross(draw, 60, 42, 42, primary_color)
    draw.text((118, 42), title, fill=primary_color, font=fonts["header"])
    draw.text((118, 86), subtitle, fill=(70, 75, 85), font=fonts["header_sub"])
    draw.text((118, 120), address, fill=(100, 105, 115), font=fonts["small"])
    draw.text((910, 45), f"REG NO: {reg_no}", fill=(60, 65, 75), font=fonts["meta"])
    draw.text((910, 72), "PHONE: (555) 018-9240", fill=(60, 65, 75), font=fonts["meta"])
    draw.text((910, 99), "PORTAL: www.healthportal.org", fill=(60, 65, 75), font=fonts["meta"])
    draw.line([(60, 165), (1180, 165)], fill=primary_color, width=3)

def draw_patient_box(draw, patient_info, y_start=188):
    draw.rectangle([(60, y_start), (1180, y_start + 128)], outline=(190, 205, 220), width=2, fill=(248, 250, 253))
    c1, c2, c3 = 85, 450, 780
    draw.text((c1, y_start + 16), f"Patient Name: {patient_info['name']}", fill=(15, 25, 35), font=fonts["bold"])
    draw.text((c2, y_start + 16), f"Age / Sex: {patient_info['age_gender']}", fill=(35, 35, 35), font=fonts["regular"])
    draw.text((c3, y_start + 16), f"Date: {patient_info['date']}", fill=(20, 20, 20), font=fonts["bold"])
    draw.text((c1, y_start + 70), f"Patient ID: {patient_info['id']}", fill=(60, 60, 60), font=fonts["regular"])
    draw.text((c2, y_start + 70), f"Vitals: {patient_info['vitals']}", fill=(60, 60, 60), font=fonts["regular"])
    draw.text((c3, y_start + 70), f"Physician: {patient_info['doctor']}", fill=(30, 30, 30), font=fonts["regular"])

def draw_standard_footer(draw, doc_name, license_str, y_sig=1500, y_foot=1675):
    draw.line([(780, y_sig), (1160, y_sig)], fill=(60, 60, 60), width=2)
    draw.text((820, y_sig - 42), doc_name.split(",")[0], fill=(20, 50, 120), font=fonts["script"])
    draw.text((780, y_sig + 12), doc_name, fill=(20, 20, 20), font=fonts["bold"])
    draw.text((780, y_sig + 42), license_str, fill=(80, 80, 80), font=fonts["small"])
    draw.rectangle([(0, y_foot), (1240, 1754)], fill=(244, 246, 249))
    draw.line([(0, y_foot), (1240, y_foot)], fill=(210, 215, 222), width=1)
    disclaimer = "For Testing Purposes Only - De-identified | MediScan Automated Clinical Pipeline Evaluation Dataset"
    draw.text((70, y_foot + 26), disclaimer, fill=(100, 100, 100), font=fonts["bold"])

def save_document(img, base_name):
    for target_dir in [DATA_SAMPLE_DIR, FRONTEND_SAMPLE_DIR]:
        png_path = os.path.join(target_dir, f"{base_name}.png")
        pdf_path = os.path.join(target_dir, f"{base_name}.pdf")
        img.save(png_path, "PNG", dpi=(300, 300))
        rgb_img = img.convert("RGB")
        rgb_img.save(pdf_path, "PDF", resolution=300.0)
    print(f"Generated & mirrored: {base_name}.png and {base_name}.pdf")

def generate_sample_01_flagged_rx():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    primary_color = (27, 54, 93)
    
    draw_header(draw, 
                title="METROPOLITAN CARDIOVASCULAR & INTERNAL CLINIC", 
                subtitle="Cardiology, Anticoagulation Management & General Medicine", 
                address="742 Evergreen Medical Park, Suite 310, Chicago, IL 60601", 
                reg_no="IL-MED-88391", 
                primary_color=primary_color)
    
    patient = {
        "name": "Eleanor Vance", 
        "age_gender": "64 Yrs / Female", 
        "date": "2026-10-14", 
        "id": "PT-88204", 
        "vitals": "BP 132/82 mmHg | Pulse 74 bpm | 68 kg", 
        "doctor": "Dr. Marcus Thorne, MD, FACC"
    }
    draw_patient_box(draw, patient, y_start=188)
    
    draw.text((70, 332), "Clinical Diagnosis / Reason for Consultation:", fill=(70, 75, 85), font=fonts["small"])
    draw.text((70, 360), "Non-valvular Atrial Fibrillation (AFib), Mild Knee Osteoarthritis, Dyspepsia", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 402), (1180, 402)], fill=(215, 222, 230), width=1)
    
    draw.text((70, 420), "Rx", fill=primary_color, font=fonts["rx"])
    draw.text((145, 432), "PRESCRIPTION MEDICATION ORDER", fill=primary_color, font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Warfarin Sodium 5 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily in the evening at 8:00 PM.", 
            "duration": "Duration: 30 Days | Quantity: 30 Tablets | Refills: 1", 
            "alert": "Target INR: 2.0 - 3.0. Take at the exact same hour each evening."
        },
        {
            "num": "2.", 
            "name": "Aspirin 81 mg Gastro-Resistant Enteric-Coated Tablet", 
            "dosage": "Take 1 tablet orally once daily with breakfast at 8:00 AM.", 
            "duration": "Duration: 30 Days | Quantity: 30 Tablets | Refills: 2", 
            "alert": "Take with morning meal and a full glass of water. Do not crush."
        },
        {
            "num": "3.", 
            "name": "Omeprazole 20 mg Delayed-Release Capsule", 
            "dosage": "Take 1 capsule orally once daily 30 minutes before breakfast (7:30 AM).", 
            "duration": "Duration: 30 Days | Quantity: 30 Capsules | Refills: 1", 
            "alert": "Gastroprotective agent. Swallow capsule whole with water."
        }
    ]
    
    y = 495
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 195)], radius=10, outline=(210, 225, 240), width=2, fill=(251, 253, 255))
        draw.text((90, y + 18), item["num"], fill=primary_color, font=fonts["med_bold"])
        draw.text((130, y + 18), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 64), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 106), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 146), "Clinical Note:  " + item["alert"], fill=(160, 40, 20) if "Target INR" in item["alert"] else (50, 80, 110), font=fonts["small"])
        y += 220

    draw.text((70, 1175), "Special Patient & Caregiver Instructions:", fill=primary_color, font=fonts["bold"])
    advices = [
        "- Routine INR blood check scheduled every 2 weeks at MetroCare diagnostic lab.",
        "- Promptly report signs of bleeding: easy bruising, dark tarry stools, or nosebleeds.",
        "- Avoid unverified over-the-counter NSAIDs (e.g. Ibuprofen, Naproxen) or herbal supplements."
    ]
    adv_y = 1215
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 36

    draw.rounded_rectangle([(65, 1345), (1175, 1435)], radius=8, outline=(230, 180, 180), width=2, fill=(255, 248, 248))
    draw.text((90, 1360), "[CLINICAL PHARMACY ALERT] Interacting Drug Combination Present:", fill=(180, 30, 30), font=fonts["bold"])
    draw.text((90, 1395), "Warfarin + Aspirin: Concurrent anticoagulation & antiplatelet therapy. Monitor closely for bleeding risk.", fill=(120, 20, 20), font=fonts["regular"])

    draw_standard_footer(draw, "Dr. Marcus Thorne, MD, FACC", "Board Certified Cardiologist | Lic. # IL-MED-88391 | DEA: MT9284012")
    save_document(img, "sample_01_flagged_rx")

def generate_sample_02_standard_rx():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    primary_color = (18, 90, 80)
    
    draw_header(draw, 
                title="BEACON FAMILY HEALTH & URGENT CARE", 
                subtitle="Primary Care, Acute Infections & Wellness Practice", 
                address="1050 Maplewood Avenue, Suite 102, Austin, TX 78701", 
                reg_no="TX-CLIN-44910", 
                primary_color=primary_color)
    
    patient = {
        "name": "David K. Miller", 
        "age_gender": "36 Yrs / Male", 
        "date": "2026-10-15", 
        "id": "PT-44109", 
        "vitals": "Temp 101.4 F | BP 118/76 mmHg | Pulse 82 bpm", 
        "doctor": "Dr. Sarah Jenkins, MD"
    }
    draw_patient_box(draw, patient, y_start=188)
    
    draw.text((70, 332), "Clinical Diagnosis / Reason for Consultation:", fill=(70, 75, 85), font=fonts["small"])
    draw.text((70, 360), "Acute Bacterial Pharyngitis / Sinusitis, Allergic Rhinitis", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 402), (1180, 402)], fill=(215, 222, 230), width=1)
    
    draw.text((70, 420), "Rx", fill=primary_color, font=fonts["rx"])
    draw.text((145, 432), "PRESCRIPTION MEDICATION ORDER", fill=primary_color, font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Amoxicillin 500 mg Oral Capsule", 
            "dosage": "Take 1 capsule orally every 8 hours (8:00 AM, 4:00 PM, 12:00 AM) with water.", 
            "duration": "Duration: 7 Days | Quantity: 21 Capsules | Refills: 0", 
            "alert": "Complete entire 7-day course even if fever and sore throat subside."
        },
        {
            "num": "2.", 
            "name": "Paracetamol (Acetaminophen) 650 mg Tablet", 
            "dosage": "Take 1 tablet orally every 6 hours as needed for pain or fever.", 
            "duration": "Duration: 5 Days | Quantity: 20 Tablets | Refills: 0", 
            "alert": "Do not exceed 4,000 mg (4 grams) in any 24-hour period."
        },
        {
            "num": "3.", 
            "name": "Cetirizine Hydrochloride 10 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily at bedtime (10:00 PM).", 
            "duration": "Duration: 10 Days | Quantity: 10 Tablets | Refills: 1", 
            "alert": "Antihistamine for allergic symptoms. May cause mild drowsiness."
        }
    ]
    
    y = 495
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 195)], radius=10, outline=(210, 235, 230), width=2, fill=(250, 254, 253))
        draw.text((90, y + 18), item["num"], fill=primary_color, font=fonts["med_bold"])
        draw.text((130, y + 18), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 64), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 106), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 146), "Instructions:  " + item["alert"], fill=(40, 80, 70), font=fonts["small"])
        y += 220

    draw.text((70, 1180), "Physician Advice & General Wellness Guidelines:", fill=primary_color, font=fonts["bold"])
    advices = [
        "- Drink plenty of warm water, broths, and fluids to assist with airway hydration.",
        "- Rest thoroughly and monitor temperature twice daily.",
        "- Return to clinic if fever persists beyond 72 hours of starting antibiotics."
    ]
    adv_y = 1222
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 36

    draw_standard_footer(draw, "Dr. Sarah Jenkins, MD", "Family Medicine Physician | Lic. # TX-44910 | DEA: SJ4419203")
    save_document(img, "sample_02_standard_rx")

def generate_sample_03_cbc_lab_report():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    primary_color = (25, 75, 130)
    
    draw_header(draw, 
                title="APEX DIAGNOSTICS & PATHOLOGY LABORATORIES", 
                subtitle="Accredited Clinical Pathology & Hematology Services | CLIA # 99D0876543", 
                address="500 Science Drive, Medical District, Boston, MA 02115", 
                reg_no="CLIA-99D0876", 
                primary_color=primary_color)
    
    patient = {
        "name": "James R. Thornton", 
        "age_gender": "52 Yrs / Male", 
        "date": "2026-10-16", 
        "id": "PT-61094", 
        "vitals": "Specimen: Whole Blood (EDTA)", 
        "doctor": "Dr. Rachel Adams, MD"
    }
    draw_patient_box(draw, patient, y_start=188)
    
    draw.rectangle([(60, 330), (1180, 385)], fill=(240, 245, 250), outline=(210, 225, 240), width=1)
    draw.text((75, 346), "Ordered Panel: Complete Blood Count (CBC) with Automated Differential", fill=primary_color, font=fonts["bold"])
    draw.text((800, 346), "Collected: 2026-10-16 07:45 AM", fill=(60, 60, 60), font=fonts["small"])
    
    table_top = 410
    col_x = [60, 420, 580, 840, 1020, 1180]
    
    draw.rectangle([(col_x[0], table_top), (col_x[-1], table_top + 45)], fill=primary_color)
    headers = ["Test Name", "Result", "Reference Range", "Units", "Flag"]
    for i in range(5):
        draw.text((col_x[i] + 16, table_top + 12), headers[i], fill=(255, 255, 255), font=fonts["table_head"])
        
    cbc_rows = [
        {"name": "White Blood Cells (WBC)", "result": "13.8", "ref": "4.5 - 11.0", "units": "10^3 / uL", "flag": "HIGH"},
        {"name": "Red Blood Cells (RBC)", "result": "4.65", "ref": "4.30 - 5.90", "units": "10^6 / uL", "flag": "NORMAL"},
        {"name": "Hemoglobin (Hgb)", "result": "11.4", "ref": "13.5 - 17.5", "units": "g / dL", "flag": "LOW"},
        {"name": "Hematocrit (Hct)", "result": "35.2", "ref": "41.0 - 50.0", "units": "%", "flag": "LOW"},
        {"name": "Mean Corpuscular Volume (MCV)", "result": "88.5", "ref": "80.0 - 100.0", "units": "fL", "flag": "NORMAL"},
        {"name": "Platelet Count", "result": "245", "ref": "150 - 450", "units": "10^3 / uL", "flag": "NORMAL"},
        {"name": "Neutrophils (Relative)", "result": "78.0", "ref": "40.0 - 70.0", "units": "%", "flag": "HIGH"},
        {"name": "Lymphocytes (Relative)", "result": "16.5", "ref": "20.0 - 45.0", "units": "%", "flag": "LOW"}
    ]
    
    row_y = table_top + 45
    for idx, row in enumerate(cbc_rows):
        bg_fill = (255, 255, 255) if idx % 2 == 0 else (248, 250, 253)
        row_height = 54
        draw.rectangle([(col_x[0], row_y), (col_x[-1], row_y + row_height)], fill=bg_fill, outline=(225, 230, 238), width=1)
        draw.text((col_x[0] + 16, row_y + 16), row["name"], fill=(20, 20, 20), font=fonts["table_cell"])
        res_color = (190, 25, 25) if row["flag"] in ["HIGH", "LOW"] else (20, 20, 20)
        draw.text((col_x[1] + 16, row_y + 16), row["result"], fill=res_color, font=fonts["bold"] if row["flag"] != "NORMAL" else fonts["table_cell"])
        draw.text((col_x[2] + 16, row_y + 16), row["ref"], fill=(60, 60, 60), font=fonts["table_cell"])
        draw.text((col_x[3] + 16, row_y + 16), row["units"], fill=(80, 80, 80), font=fonts["table_cell"])
        
        flag_box_x = col_x[4] + 14
        flag_box_y = row_y + 10
        if row["flag"] == "HIGH":
            draw.rounded_rectangle([(flag_box_x, flag_box_y), (flag_box_x + 95, flag_box_y + 32)], radius=6, fill=(254, 237, 237), outline=(230, 80, 80), width=1)
            draw.text((flag_box_x + 14, flag_box_y + 6), "H (HIGH)", fill=(185, 20, 20), font=fonts["table_flag"])
        elif row["flag"] == "LOW":
            draw.rounded_rectangle([(flag_box_x, flag_box_y), (flag_box_x + 90, flag_box_y + 32)], radius=6, fill=(237, 244, 255), outline=(70, 120, 210), width=1)
            draw.text((flag_box_x + 14, flag_box_y + 6), "L (LOW)", fill=(20, 70, 180), font=fonts["table_flag"])
        else:
            draw.rounded_rectangle([(flag_box_x, flag_box_y), (flag_box_x + 90, flag_box_y + 32)], radius=6, fill=(240, 248, 240), outline=(130, 180, 130), width=1)
            draw.text((flag_box_x + 12, flag_box_y + 6), "NORMAL", fill=(30, 110, 40), font=fonts["table_flag"])
            
        row_y += row_height
        
    draw.rectangle([(60, 920), (1180, 1070)], outline=(210, 225, 240), width=1, fill=(251, 253, 255))
    draw.text((80, 935), "Pathology Interpretive Remarks:", fill=primary_color, font=fonts["bold"])
    remarks = [
        "1. Mild normocytic anemia noted with decreased Hemoglobin (11.4 g/dL) and Hematocrit (35.2%).",
        "2. Leukocytosis with relative neutrophilia (78.0%) suggestive of an acute bacterial infection or active inflammatory state.",
        "3. Platelet morphology and counts remain within normal biological parameters."
    ]
    rem_y = 970
    for rem in remarks:
        draw.text((80, rem_y), rem, fill=(45, 45, 45), font=fonts["small"])
        rem_y += 28

    draw.text((70, 1120), "Laboratory Testing Specifications:", fill=primary_color, font=fonts["bold"])
    specs = [
        "- Instrument: Sysmex XN-9000 Automated Hematology System",
        "- Calibration Status: Verified 2026-10-16 06:00 AM (Within +/- 1 SD)",
        "- Validated by: Dr. Gregory Ross, MD, FCAP (Laboratory Director)"
    ]
    spec_y = 1155
    for sp in specs:
        draw.text((90, spec_y), sp, fill=(70, 70, 70), font=fonts["regular"])
        spec_y += 34

    draw_standard_footer(draw, "Dr. Gregory Ross, MD, FCAP", "Laboratory Medical Director | CLIA Director Lic. # 99D0876543", y_sig=1500)
    save_document(img, "sample_03_cbc_lab_report")

def draw_circular_stamp(draw, center_x, center_y, radius, stamp_color=(195, 35, 35)):
    draw.ellipse([(center_x - radius, center_y - radius), (center_x + radius, center_y + radius)], outline=stamp_color, width=4)
    draw.ellipse([(center_x - radius + 10, center_y - radius + 10), (center_x + radius - 10, center_y + radius - 10)], outline=stamp_color, width=2)
    draw.text((center_x - 72, center_y - 45), "OAKRIDGE CLINIC", fill=stamp_color, font=fonts["stamp"])
    draw.text((center_x - 65, center_y - 12), "* VERIFIED *", fill=stamp_color, font=fonts["bold"])
    draw.text((center_x - 60, center_y + 20), "DISPENSED", fill=stamp_color, font=fonts["stamp"])
    draw.text((center_x - 52, center_y + 45), "2026-10-17", fill=stamp_color, font=fonts["meta"])

def generate_sample_04_noisy_rx():
    img = Image.new("RGB", (1240, 1754), color=(253, 252, 250))
    draw = ImageDraw.Draw(img)
    primary_color = (60, 60, 60)
    
    watermark_text = "CONFIDENTIAL MEDICAL RECORD - DE-IDENTIFIED"
    for wy in range(150, 1700, 220):
        for wx in range(-100, 1300, 480):
            draw.text((wx, wy), watermark_text, fill=(238, 238, 238), font=fonts["bold"])

    draw_header(draw, 
                title="OAKRIDGE COMMUNITY HEALTH CLINIC", 
                subtitle="Comprehensive Internal Medicine & Chronic Care Practice", 
                address="312 Highlands Pkwy, Building B, Seattle, WA 98101", 
                reg_no="WA-MED-99412", 
                primary_color=primary_color)
    
    patient = {
        "name": "Patricia Higgins", 
        "age_gender": "61 Yrs / Female", 
        "date": "2026-10-17", 
        "id": "PT-32890", 
        "vitals": "BP 130/84 mmHg | HbA1c 7.1% | Wt 72 kg", 
        "doctor": "Dr. Evelyn Reed, MD"
    }
    draw_patient_box(draw, patient, y_start=188)
    
    draw.text((70, 332), "Clinical Diagnosis / Reason for Consultation:", fill=(80, 80, 80), font=fonts["small"])
    draw.text((70, 360), "Type 2 Diabetes Mellitus, Essential Hypertension, Hyperlipidemia", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 402), (1180, 402)], fill=(200, 200, 200), width=1)
    
    draw.text((70, 420), "Rx", fill=primary_color, font=fonts["rx"])
    draw.text((145, 432), "PRESCRIPTION MEDICATION ORDER", fill=primary_color, font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Metformin HCl 500 mg Extended-Release Tablet", 
            "dosage": "Take 1 tablet orally twice daily with meals (breakfast 8:30 AM, dinner 6:30 PM).", 
            "duration": "Duration: 90 Days | Quantity: 180 Tablets | Refills: 3", 
            "alert": "Take with meals to minimize gastrointestinal discomfort."
        },
        {
            "num": "2.", 
            "name": "Lisinopril 10 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily in the morning at 8:00 AM.", 
            "duration": "Duration: 90 Days | Quantity: 90 Tablets | Refills: 3", 
            "alert": "Monitor blood pressure regularly. Avoid salt substitutes with potassium."
        },
        {
            "num": "3.", 
            "name": "Atorvastatin Calcium 20 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily at bedtime (9:30 PM).", 
            "duration": "Duration: 90 Days | Quantity: 90 Tablets | Refills: 3", 
            "alert": "Report unexplained muscle soreness or weakness immediately."
        }
    ]
    
    y = 495
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 195)], radius=8, outline=(200, 200, 200), width=2, fill=(255, 255, 255))
        draw.text((90, y + 18), item["num"], fill=primary_color, font=fonts["med_bold"])
        draw.text((130, y + 18), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 64), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 106), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 146), "Instructions:  " + item["alert"], fill=(60, 60, 60), font=fonts["small"])
        y += 220

    draw.text((70, 1180), "Physician Notes & Monitoring Requirements:", fill=primary_color, font=fonts["bold"])
    advices = [
        "- Fasting blood sugar log to be maintained daily for the first 30 days.",
        "- Repeat renal function panel (eGFR, serum creatinine) in 3 months.",
        "- Adhere strictly to low sodium and carbohydrate-controlled diabetic diet."
    ]
    adv_y = 1222
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 36

    draw_circular_stamp(draw, center_x=320, center_y=1460, radius=90, stamp_color=(195, 35, 35))

    draw.line([(780, 1500), (1160, 1500)], fill=(60, 60, 60), width=2)
    draw.text((810, 1450), "Dr. Evelyn Reed, MD", fill=(15, 40, 140), font=fonts["script"])
    draw.text((780, 1512), "Dr. Evelyn Reed, MD", fill=(20, 20, 20), font=fonts["bold"])
    draw.text((780, 1542), "Internal Medicine Specialist | Lic. # WA-99412 | DEA: ER4819022", fill=(80, 80, 80), font=fonts["small"])

    draw.rectangle([(0, 1675), (1240, 1754)], fill=(244, 244, 244))
    draw.line([(0, 1675), (1240, 1675)], fill=(210, 210, 210), width=1)
    disclaimer = "For Testing Purposes Only - De-identified | MediScan Automated Clinical Pipeline Evaluation Dataset"
    draw.text((70, 1701), disclaimer, fill=(100, 100, 100), font=fonts["bold"])

    skewed_img = img.rotate(-1.2, resample=Image.BICUBIC, expand=False, fillcolor=(255, 255, 255))
    save_document(skewed_img, "sample_04_noisy_rx")

if __name__ == "__main__":
    print("Generating MediScan 4 Clinical Evaluation Sample Documents...")
    generate_sample_01_flagged_rx()
    generate_sample_02_standard_rx()
    generate_sample_03_cbc_lab_report()
    generate_sample_04_noisy_rx()
    print("All 4 sample documents generated successfully at 300 DPI!")

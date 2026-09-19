import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "sample_documents")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_font(path, size, fallback="arial.ttf"):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        try:
            return ImageFont.truetype(f"C:/Windows/Fonts/{fallback}", size)
        except Exception:
            return ImageFont.load_default()

fonts = {
    "header": load_font("C:/Windows/Fonts/arialbd.ttf", 29),
    "sub": load_font("C:/Windows/Fonts/arial.ttf", 19),
    "bold": load_font("C:/Windows/Fonts/arialbd.ttf", 21),
    "med_bold": load_font("C:/Windows/Fonts/arialbd.ttf", 23),
    "regular": load_font("C:/Windows/Fonts/arial.ttf", 20),
    "small": load_font("C:/Windows/Fonts/arial.ttf", 16),
    "meta": load_font("C:/Windows/Fonts/arial.ttf", 15),
    "title": load_font("C:/Windows/Fonts/arialbd.ttf", 25),
    "rx": load_font("C:/Windows/Fonts/georgiab.ttf", 44, fallback="arialbd.ttf"),
    "script": load_font("C:/Windows/Fonts/georgiai.ttf", 28, fallback="ariali.ttf")
}

def draw_medical_cross(draw, x, y, size, color):
    arm = size // 3
    draw.rectangle([(x + arm, y), (x + 2 * arm, y + size)], fill=color)
    draw.rectangle([(x, y + arm), (x + size, y + 2 * arm)], fill=color)

def draw_header(draw, title, subtitle, address, reg_no, primary_color=(24, 76, 120)):
    draw.rectangle([(0, 0), (1240, 16)], fill=primary_color)
    draw_medical_cross(draw, 60, 42, 42, primary_color)
    
    draw.text((118, 42), title, fill=primary_color, font=fonts["header"])
    draw.text((118, 86), subtitle, fill=(70, 70, 70), font=fonts["sub"])
    draw.text((118, 120), address, fill=(100, 100, 100), font=fonts["small"])
    
    draw.text((910, 45), "REG NO: " + reg_no, fill=(60, 60, 60), font=fonts["meta"])
    draw.text((910, 72), "PHONE: (555) 019-2834", fill=(60, 60, 60), font=fonts["meta"])
    draw.text((910, 99), "PORTAL: www.healthportal.org", fill=(60, 60, 60), font=fonts["meta"])
    draw.line([(60, 165), (1180, 165)], fill=primary_color, width=3)

def draw_patient_box(draw, patient_info, y_start=190):
    draw.rectangle([(60, y_start), (1180, y_start + 125)], outline=(180, 195, 210), width=2, fill=(247, 250, 253))
    col1_x = 85
    col2_x = 440
    col3_x = 760
    
    draw.text((col1_x, y_start + 18), f"Patient Name: {patient_info['name']}", fill=(15, 25, 35), font=fonts["bold"])
    draw.text((col2_x, y_start + 18), f"Age / Sex: {patient_info['age_gender']}", fill=(35, 35, 35), font=fonts["regular"])
    draw.text((col3_x, y_start + 18), f"Date: {patient_info['date']}", fill=(20, 20, 20), font=fonts["bold"])
    
    draw.text((col1_x, y_start + 68), f"Patient ID: {patient_info['id']}", fill=(55, 55, 55), font=fonts["regular"])
    draw.text((col2_x, y_start + 68), f"Vitals: {patient_info['vitals']}", fill=(55, 55, 55), font=fonts["regular"])
    draw.text((col3_x, y_start + 68), f"Physician: {patient_info['doctor']}", fill=(30, 30, 30), font=fonts["regular"])

def draw_footer(draw, doc_name, license_str, y_sig=1490, y_footer=1670):
    draw.line([(800, y_sig), (1160, y_sig)], fill=(60, 60, 60), width=2)
    draw.text((830, y_sig - 40), doc_name.split(",")[0], fill=(20, 50, 120), font=fonts["script"])
    draw.text((800, y_sig + 12), doc_name, fill=(20, 20, 20), font=fonts["bold"])
    draw.text((800, y_sig + 44), license_str, fill=(80, 80, 80), font=fonts["small"])
    
    draw.rectangle([(0, y_footer), (1240, 1754)], fill=(245, 247, 250))
    draw.line([(0, y_footer), (1240, y_footer)], fill=(210, 215, 220), width=1)
    disclaimer = "NOTICE: Please bring this prescription / laboratory record on your next visit. For urgent assistance call (555) 019-2834."
    draw.text((80, y_footer + 30), disclaimer, fill=(90, 90, 90), font=fonts["small"])

def save_document(img, base_name):
    png_path = os.path.join(OUTPUT_DIR, f"{base_name}.png")
    pdf_path = os.path.join(OUTPUT_DIR, f"{base_name}.pdf")
    img.save(png_path, "PNG", dpi=(300, 300))
    rgb_img = img.convert("RGB")
    rgb_img.save(pdf_path, "PDF", resolution=300.0)
    print(f"Generated: {base_name}.png and {base_name}.pdf")

def generate_sample_1():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw_header(draw, title="CITYCARE CARDIOLOGY & INTERNAL CLINIC", subtitle="Cardiovascular Care & General Practice", address="Suite 400, 142 Medical Center Blvd, Metro City", reg_no="MED-NY-84920")
    
    patient = {"name": "Robert Miller", "age_gender": "58 Yrs / Male", "date": "2026-10-18", "id": "PT-904812", "vitals": "79 kg | BP 138/84 mmHg", "doctor": "Dr. Arthur Vance, MD"}
    draw_patient_box(draw, patient, y_start=190)
    
    draw.text((70, 335), "Clinical Diagnosis / Reason for Consultation:", fill=(70, 70, 70), font=fonts["small"])
    draw.text((70, 365), "Chronic Atrial Fibrillation, Acute Knee Joint Inflammation", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 410), (1180, 410)], fill=(215, 222, 230), width=1)
    
    draw.text((70, 428), "Rx", fill=(24, 76, 120), font=fonts["rx"])
    draw.text((145, 440), "PRESCRIPTION MEDICATION ORDER", fill=(24, 76, 120), font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Warfarin Sodium 5 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily at 8:00 PM in the evening.", 
            "duration": "Duration: 30 Days | Quantity: 30 Tablets | Refills: 1", 
            "instructions": "Maintain consistent vitamin K intake. Routine INR monitoring required."
        },
        {
            "num": "2.", 
            "name": "Ibuprofen 400 mg Tablet", 
            "dosage": "Take 1 tablet orally twice daily with meals (8:00 AM, 8:00 PM) for joint pain.", 
            "duration": "Duration: 10 Days | Quantity: 20 Tablets | Refills: 0", 
            "instructions": "Take immediately after eating to prevent stomach discomfort."
        },
        {
            "num": "3.", 
            "name": "Pantoprazole 40 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily in the morning at 7:30 AM (before breakfast).", 
            "duration": "Duration: 30 Days | Quantity: 30 Tablets | Refills: 2", 
            "instructions": "Swallow whole with a full glass of water. Do not crush or chew."
        }
    ]
    
    y = 505
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 200)], radius=10, outline=(215, 225, 235), width=2, fill=(252, 254, 255))
        draw.text((90, y + 20), item["num"], fill=(24, 76, 120), font=fonts["med_bold"])
        draw.text((130, y + 20), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 68), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 112), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 152), "Clinical Note:  " + item["instructions"], fill=(130, 70, 20), font=fonts["small"])
        y += 230

    draw.text((70, 1225), "Physician's Advice & Discharge Instructions:", fill=(24, 76, 120), font=fonts["bold"])
    advices = [
        "- Avoid high-impact athletic activities until knee pain and swelling subside.",
        "- Promptly report any abnormal bruising, epistaxis (nosebleeds), or dark stools.",
        "- Return in 3 weeks for scheduled INR blood coagulation evaluation."
    ]
    adv_y = 1270
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 38

    draw_footer(draw, "Dr. Arthur Vance, MD, FACC", "Board Certified Cardiologist | Lic. # MD-CARD-938210")
    save_document(img, "sample_01_prescription_interaction_hero")

def generate_sample_2():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw_header(draw, title="ST. JUDE ENDOCRINOLOGY CLINIC", subtitle="Comprehensive Diabetes & Metabolic Wellness Center", address="722 Highland Ave, Suite 210, Riverside", reg_no="CLINIC-EN-44810", primary_color=(20, 115, 85))
    
    patient = {"name": "Eleanor Davies", "age_gender": "64 Yrs / Female", "date": "2026-10-19", "id": "PT-330198", "vitals": "68 kg | BP 132/82 mmHg", "doctor": "Dr. Elena Rostova, MD"}
    draw_patient_box(draw, patient, y_start=190)
    
    draw.text((70, 335), "Clinical Diagnosis / Reason for Consultation:", fill=(70, 70, 70), font=fonts["small"])
    draw.text((70, 365), "Type 2 Diabetes Mellitus, Essential Hypertension, Dyslipidemia", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 410), (1180, 410)], fill=(215, 222, 230), width=1)
    
    draw.text((70, 428), "Rx", fill=(20, 115, 85), font=fonts["rx"])
    draw.text((145, 440), "MAINTENANCE PRESCRIPTION ORDER", fill=(20, 115, 85), font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Metformin HCl 500 mg Extended-Release Tablet", 
            "dosage": "Take 1 tablet orally twice daily with meals (Breakfast 8:30 AM, Dinner 8:30 PM).", 
            "duration": "Duration: 90 Days | Dispense: 180 Tablets | Refills: 3", 
            "instructions": "Do not crush or chew extended-release formulation. Avoid excess alcohol."
        },
        {
            "num": "2.", 
            "name": "Amlodipine Besylate 5 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily every morning at 8:00 AM.", 
            "duration": "Duration: 90 Days | Dispense: 90 Tablets | Refills: 3", 
            "instructions": "Take at the same time every morning with or without food."
        },
        {
            "num": "3.", 
            "name": "Atorvastatin Calcium 20 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily at bedtime (10:00 PM).", 
            "duration": "Duration: 90 Days | Dispense: 90 Tablets | Refills: 3", 
            "instructions": "Avoid excessive intake of grapefruit or grapefruit juice."
        }
    ]
    
    y = 505
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 200)], radius=10, outline=(210, 230, 220), width=2, fill=(252, 255, 253))
        draw.text((90, y + 20), item["num"], fill=(20, 115, 85), font=fonts["med_bold"])
        draw.text((130, y + 20), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 68), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 112), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 152), "Clinical Note:  " + item["instructions"], fill=(100, 75, 25), font=fonts["small"])
        y += 230

    draw.text((70, 1225), "Lifestyle Recommendations & Monitoring:", fill=(20, 115, 85), font=fonts["bold"])
    advices = [
        "- Continue low-glycemic dietary regimen with balanced carbohydrate distribution.",
        "- Daily self-monitoring of blood pressure; log values prior to morning medication.",
        "- Routine follow-up lab panel (HbA1c, Lipids, eGFR) scheduled in 90 days."
    ]
    adv_y = 1270
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 38

    draw_footer(draw, "Dr. Elena Rostova, MD, FACE", "Board Certified Endocrinologist | Lic. # ENDO-77291")
    save_document(img, "sample_02_prescription_chronic_routine")

def generate_sample_3():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw_header(draw, title="APEX DIAGNOSTIC PATHOLOGY LAB", subtitle="Accredited Clinical Biochemistry & Diagnostic Testing", address="Building 3, Metro Life Sciences Park, East Wing", reg_no="CAP-ISO-15189", primary_color=(135, 35, 50))
    
    patient = {"name": "Sarah Jenkins", "age_gender": "47 Yrs / Female", "date": "2026-10-20", "id": "LAB-881903", "vitals": "Fasting: 12 Hours", "doctor": "Dr. Arthur Vance, MD"}
    draw_patient_box(draw, patient, y_start=190)
    
    draw.text((70, 335), "TEST REQUISITION / PANEL:", fill=(70, 70, 70), font=fonts["small"])
    draw.text((70, 365), "Comprehensive Metabolic Chemistry & Fasting Lipid Panel", fill=(135, 35, 50), font=fonts["bold"])
    draw.line([(60, 410), (1180, 410)], fill=(215, 222, 230), width=1)

    draw.rectangle([(60, 430), (1180, 490)], fill=(245, 238, 240))
    draw.text((80, 450), "INVESTIGATION / TEST NAME", fill=(70, 20, 30), font=fonts["bold"])
    draw.text((490, 450), "RESULT", fill=(70, 20, 30), font=fonts["bold"])
    draw.text((650, 450), "UNIT", fill=(70, 20, 30), font=fonts["bold"])
    draw.text((780, 450), "REFERENCE RANGE", fill=(70, 20, 30), font=fonts["bold"])
    draw.text((1045, 450), "STATUS", fill=(70, 20, 30), font=fonts["bold"])

    tests = [
        {"name": "Fasting Blood Glucose", "val": "148", "unit": "mg/dL", "ref": "70 - 99", "flag": "HIGH"},
        {"name": "Glycated Hemoglobin (HbA1c)", "val": "7.8", "unit": "%", "ref": "4.0 - 5.6", "flag": "HIGH"},
        {"name": "Total Serum Cholesterol", "val": "245", "unit": "mg/dL", "ref": "< 200", "flag": "HIGH"},
        {"name": "Triglycerides", "val": "215", "unit": "mg/dL", "ref": "< 150", "flag": "HIGH"},
        {"name": "HDL Cholesterol (Good)", "val": "38", "unit": "mg/dL", "ref": "> 40", "flag": "LOW"},
        {"name": "LDL Cholesterol (Bad)", "val": "164", "unit": "mg/dL", "ref": "< 100", "flag": "HIGH"},
        {"name": "Serum Creatinine", "val": "0.92", "unit": "mg/dL", "ref": "0.60 - 1.20", "flag": "NORMAL"},
        {"name": "Blood Urea Nitrogen (BUN)", "val": "14.2", "unit": "mg/dL", "ref": "7.0 - 20.0", "flag": "NORMAL"},
        {"name": "Serum Potassium", "val": "4.3", "unit": "mEq/L", "ref": "3.5 - 5.1", "flag": "NORMAL"},
        {"name": "Total Bilirubin", "val": "0.80", "unit": "mg/dL", "ref": "0.20 - 1.20", "flag": "NORMAL"}
    ]
    y = 502
    for i, t in enumerate(tests):
        row_bg = (255, 255, 255) if i % 2 == 0 else (252, 248, 250)
        draw.rectangle([(60, y), (1180, y + 66)], fill=row_bg)
        draw.line([(60, y + 66), (1180, y + 66)], fill=(230, 230, 235), width=1)
        draw.text((80, y + 18), t["name"], fill=(20, 20, 20), font=fonts["regular"])
        draw.text((490, y + 18), t["val"], fill=(15, 15, 15), font=fonts["bold"])
        draw.text((650, y + 18), t["unit"], fill=(60, 60, 60), font=fonts["regular"])
        draw.text((780, y + 18), t["ref"], fill=(70, 70, 70), font=fonts["regular"])
        if t["flag"] == "HIGH":
            draw.rectangle([(1035, y + 12), (1155, y + 54)], fill=(255, 230, 230), outline=(220, 40, 40), width=1)
            draw.text((1058, y + 18), "HIGH", fill=(185, 20, 20), font=fonts["bold"])
        elif t["flag"] == "LOW":
            draw.rectangle([(1035, y + 12), (1155, y + 54)], fill=(255, 245, 220), outline=(210, 150, 20), width=1)
            draw.text((1062, y + 18), "LOW", fill=(170, 95, 10), font=fonts["bold"])
        else:
            draw.text((1045, y + 18), "NORMAL", fill=(35, 135, 55), font=fonts["bold"])
        y += 74

    draw.rounded_rectangle([(65, 1265), (1175, 1445)], radius=8, outline=(210, 210, 220), width=1, fill=(249, 250, 252))
    draw.text((85, 1283), "Clinical Pathologist Remarks & Interpretation:", fill=(135, 35, 50), font=fonts["bold"])
    notes = [
        "1. Markedly elevated Fasting Blood Glucose (148 mg/dL) and HbA1c (7.8%) indicate uncontrolled glycemic levels.",
        "2. Atherogenic dyslipidemia profile confirmed by high LDL (164 mg/dL) and low cardioprotective HDL (38 mg/dL).",
        "3. Renal indices (Serum Creatinine & BUN) and electrolytes are within normal physiological reference ranges."
    ]
    ny = 1323
    for note in notes:
        draw.text((85, ny), note, fill=(40, 40, 40), font=fonts["small"])
        ny += 34
    draw_footer(draw, "Dr. Ramesh Patel, MD (Pathology)", "Chief Clinical Pathologist | Lab Reg # PATH-89104")
    save_document(img, "sample_03_lab_report_comprehensive_metabolic")

def generate_sample_4():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw_header(draw, title="SUNRISE PEDIATRICS & URGENT CARE", subtitle="Pediatric Ambulatory & Acute Children's Care", address="104 Elmwood Park Road, Children's Health Center", reg_no="PED-CARE-2093", primary_color=(25, 95, 150))
    
    patient = {"name": "Lucas Martin", "age_gender": "8 Yrs / Male", "date": "2026-10-21", "id": "PED-551029", "vitals": "27 kg | Temp: 101.8 F", "doctor": "Dr. Michael Chen, MD, FAAP"}
    draw_patient_box(draw, patient, y_start=190)
    
    draw.text((70, 335), "Clinical Diagnosis / Presenting Concern:", fill=(70, 70, 70), font=fonts["small"])
    draw.text((70, 365), "Acute Streptococcal Pharyngotonsillitis (Rapid Strep Confirmed)", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 410), (1180, 410)], fill=(215, 222, 230), width=1)
    
    draw.text((70, 428), "Rx", fill=(25, 95, 150), font=fonts["rx"])
    draw.text((145, 440), "PEDIATRIC PRESCRIPTION ORDER", fill=(25, 95, 150), font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Amoxicillin Oral Suspension 250 mg / 5 mL", 
            "dosage": "Give 10 mL (500 mg) orally every 8 hours (8:00 AM, 4:00 PM, 12:00 AM) for 10 days.", 
            "duration": "Total Duration: 10 Days | Bottle: 150 mL | Refills: 0", 
            "instructions": "Shake vigorously before each dose. Finish full 10-day course even after symptoms clear."
        },
        {
            "num": "2.", 
            "name": "Paracetamol Pediatric Suspension 160 mg / 5 mL", 
            "dosage": "Give 12 mL (384 mg) orally every 6 hours as needed for fever > 101 F or throat discomfort.", 
            "duration": "As Needed (PRN) | Maximum 4 doses per 24 hours | Bottle: 120 mL", 
            "instructions": "Use supplied oral measuring syringe. Do not co-administer other acetaminophen products."
        },
        {
            "num": "3.", 
            "name": "Oral Electrolyte Rehydration Solution (Pedialyte)", 
            "dosage": "Administer 150-250 mL frequently throughout the day to support hydration.", 
            "duration": "Duration: 5 Days | Dispense: 2 Liters | Refills: 0", 
            "instructions": "Serve chilled. Do not dilute with additional plain water or fruit juices."
        }
    ]
    
    y = 505
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 200)], radius=10, outline=(210, 230, 245), width=2, fill=(250, 253, 255))
        draw.text((90, y + 20), item["num"], fill=(25, 95, 150), font=fonts["med_bold"])
        draw.text((130, y + 20), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 68), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 112), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 152), "Safety Alert:  " + item["instructions"], fill=(160, 50, 20), font=fonts["small"])
        y += 230

    draw.text((70, 1225), "Caregiver Home Care Instructions:", fill=(25, 95, 150), font=fonts["bold"])
    advices = [
        "- Keep child well hydrated with warm liquids, broths, and electrolyte popsicles.",
        "- Isolate child from school until after 24 hours of starting antibiotics and completely fever-free.",
        "- Seek immediate medical attention if breathing difficulty, neck stiffness, or inability to swallow occurs."
    ]
    adv_y = 1270
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 38

    draw_footer(draw, "Dr. Michael Chen, MD, FAAP", "Board Certified Pediatrician | Lic. # PED-NY-76120")
    save_document(img, "sample_04_prescription_pediatric_antibiotic")

def generate_sample_5():
    img = Image.new("RGB", (1240, 1754), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw_header(draw, title="METRO HEART & VASCULAR INSTITUTE", subtitle="Interventional Cardiology & Post-Procedure Recovery", address="900 University Medical Center Plaza, 6th Floor", reg_no="CARD-INST-5912", primary_color=(150, 40, 30))
    
    patient = {"name": "Harold Evans", "age_gender": "67 Yrs / Male", "date": "2026-10-22", "id": "CARD-77301", "vitals": "82 kg | BP 126/78 mmHg", "doctor": "Dr. David Goldberg, MD, FACC"}
    draw_patient_box(draw, patient, y_start=190)
    
    draw.text((70, 335), "Primary Diagnosis & Procedure:", fill=(70, 70, 70), font=fonts["small"])
    draw.text((70, 365), "Coronary Artery Disease, Status Post Percutaneous Coronary Intervention (PCI)", fill=(20, 20, 20), font=fonts["bold"])
    draw.line([(60, 410), (1180, 410)], fill=(215, 222, 230), width=1)
    
    draw.text((70, 428), "Rx", fill=(150, 40, 30), font=fonts["rx"])
    draw.text((145, 440), "POST-OPERATIVE DISCHARGE PRESCRIPTION", fill=(150, 40, 30), font=fonts["title"])

    items = [
        {
            "num": "1.", 
            "name": "Clopidogrel 75 mg Tablet", 
            "dosage": "Take 1 tablet orally once daily every morning at 9:00 AM with food.", 
            "duration": "Duration: 180 Days | Dispense: 180 Tablets | Refills: 1", 
            "instructions": "Antiplatelet therapy for coronary stent patency. Never discontinue without cardiologist consent."
        },
        {
            "num": "2.", 
            "name": "Omeprazole 20 mg Delayed-Release Capsule", 
            "dosage": "Take 1 capsule orally once daily 30 minutes before breakfast (8:30 AM).", 
            "duration": "Duration: 30 Days | Dispense: 30 Capsules | Refills: 0", 
            "instructions": "Gastric mucosal protection. Swallow capsule whole with water."
        },
        {
            "num": "3.", 
            "name": "Aspirin 81 mg Enteric-Coated Tablet", 
            "dosage": "Take 1 tablet orally once daily with morning meal (9:00 AM).", 
            "duration": "Duration: 180 Days | Dispense: 180 Tablets | Refills: 2", 
            "instructions": "Dual antiplatelet regimen. Do not skip scheduled doses."
        }
    ]
    
    y = 505
    for item in items:
        draw.rounded_rectangle([(65, y), (1175, y + 200)], radius=10, outline=(240, 220, 220), width=2, fill=(255, 252, 252))
        draw.text((90, y + 20), item["num"], fill=(150, 40, 30), font=fonts["med_bold"])
        draw.text((130, y + 20), item["name"], fill=(15, 25, 35), font=fonts["med_bold"])
        draw.text((130, y + 68), "Dosage & Timing:  " + item["dosage"], fill=(30, 30, 30), font=fonts["regular"])
        draw.text((130, y + 112), item["duration"], fill=(65, 65, 65), font=fonts["small"])
        draw.text((130, y + 152), "Clinical Alert:  " + item["instructions"], fill=(150, 50, 20), font=fonts["small"])
        y += 230

    draw.text((70, 1225), "Discharge & Warning Precautions:", fill=(150, 40, 30), font=fonts["bold"])
    advices = [
        "- Stent adherence: Strict daily adherence to Clopidogrel and Aspirin is mandatory to prevent stent thrombosis.",
        "- Monitor for unusual signs of bleeding: persistent epistaxis, bleeding gums, or hematuria.",
        "- Emergency warning: Acute substernal chest discomfort radiating to left arm/jaw requires immediate 911 dispatch."
    ]
    adv_y = 1270
    for adv in advices:
        draw.text((90, adv_y), adv, fill=(45, 45, 45), font=fonts["regular"])
        adv_y += 38

    draw_footer(draw, "Dr. David Goldberg, MD, FACC", "Director of Interventional Cardiology | Lic. # CARD-80419")
    save_document(img, "sample_05_prescription_cardio_clopidogrel")

if __name__ == "__main__":
    generate_sample_1()
    generate_sample_2()
    generate_sample_3()
    generate_sample_4()
    generate_sample_5()

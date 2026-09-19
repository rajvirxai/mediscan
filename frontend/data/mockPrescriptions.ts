import { AnalysisResponse } from '../types/analysis';

export const MOCK_FLAGGED_PRESCRIPTION: AnalysisResponse = {
  id: 'rx-analysis-8942-flagged',
  timestamp: new Date().toISOString(),
  fileName: 'Dr_Sharma_Prescription_Cardiology.png',
  fileType: 'image',
  fileSize: '1.4 MB',
  patientName: 'Pragya Verma (42y / F)',
  prescriber: 'Dr. R. K. Sharma, MD (Cardiology & Internal Medicine)',
  summary: {
    plainLanguage:
      'This prescription combines a blood-thinning medicine (Warfarin) with a standard pain reliever (Ibuprofen) and high-dose Aspirin. While prescribed for heart protection and joint pain relief, taking these medications together significantly increases the danger of stomach irritation and internal bleeding.',
    keyTakeaways: [
      'CRITICAL: Do NOT start Ibuprofen alongside Warfarin without explicit cardiologist clearance.',
      'Take Warfarin at the exact same time every evening with water.',
      'Monitor for unusual bruising, bleeding gums, or dark stools.',
      'Schedule your INR blood checkup within 5 days of starting this regimen.'
    ]
  },
  hasInteractions: true,
  interactionWarnings: [
    {
      id: 'warn-1',
      severity: 'high',
      title: 'High Risk: Major Bleeding & Anticoagulant Potentiation',
      description:
        'Concurrent use of Warfarin with NSAIDs (Ibuprofen) and Aspirin inhibits platelet aggregation and damages gastrointestinal mucosa, tripling the risk of severe upper GI hemorrhage.',
      interactingEntities: ['Warfarin (Coumadin 5mg)', 'Ibuprofen (Advil 400mg)', 'Aspirin (Ecosprin 75mg)'],
      clinicalRisk: 'Severe gastrointestinal ulceration and uncontrolled internal bleeding.',
      recommendation:
        'Immediate Action: Request your doctor for a safer pain alternative such as Paracetamol (Acetaminophen) for analgesia, avoiding non-steroidal anti-inflammatory drugs.',
      source: 'Clinical Pharmacology & FDA Contraindication Database'
    },
    {
      id: 'warn-2',
      severity: 'moderate',
      title: 'Dietary Interaction: High Vitamin K Foods',
      description:
        'Large fluctuations in dietary Vitamin K intake (spinach, kale, green tea, broccoli) will directly diminish the anticoagulant effectiveness of Warfarin.',
      interactingEntities: ['Warfarin (5mg)', 'Dietary Vitamin K / Leafy Greens'],
      clinicalRisk: 'Fluctuating INR levels leading to reduced stroke prevention.',
      recommendation:
        'Maintain a steady, consistent daily portion of green vegetables rather than sudden drastic dietary changes.',
      source: 'AHA Clinical Guidelines'
    }
  ],
  medications: [
    {
      name: 'Warfarin Sodium',
      genericName: 'Coumadin',
      dosage: '5 mg',
      frequency: 'Once daily (Evening)',
      duration: 'Ongoing / 90 days',
      purpose: 'Blood thinner to prevent clot formation and stroke',
      instructions: 'Take precisely at 7:00 PM with water. Do not skip doses.',
      timing: ['evening'],
      takeWithFood: false
    },
    {
      name: 'Ibuprofen',
      genericName: 'Advil / Brufen',
      dosage: '400 mg',
      frequency: 'Twice daily after food (SOS)',
      duration: '5 days as needed',
      purpose: 'Pain relief and anti-inflammatory for joint discomfort',
      instructions: 'TAKE ONLY WITH FOOD. *HOLD pending doctor confirmation due to interaction*',
      timing: ['morning', 'evening'],
      takeWithFood: true
    },
    {
      name: 'Aspirin',
      genericName: 'Ecosprin',
      dosage: '75 mg',
      frequency: 'Once daily after lunch',
      duration: '30 days',
      purpose: 'Cardiovascular antiplatelet protection',
      instructions: 'Swallow whole with a full glass of water.',
      timing: ['noon'],
      takeWithFood: true
    },
    {
      name: 'Pantoprazole',
      genericName: 'Pan-40',
      dosage: '40 mg',
      frequency: 'Once daily before breakfast',
      duration: '14 days',
      purpose: 'Gastric acid protection and stomach lining shield',
      instructions: 'Take 30 minutes before your morning meal on an empty stomach.',
      timing: ['morning'],
      takeWithFood: false
    }
  ],
  safetyAndDietaryTips: [
    'Avoid alcohol consumption as it interferes with liver breakdown of Warfarin.',
    'Do not take over-the-counter cold/cough syrups containing NSAIDs without checking.',
    'Use a soft-bristle toothbrush to prevent gum bleeding.',
    'Wear medical alert identification stating you are on anticoagulant therapy.'
  ],
  doctorQuestions: [
    'Can we substitute Ibuprofen with a non-NSAID pain reliever like Paracetamol?',
    'When should my next PT/INR blood test be scheduled?',
    'Should the Aspirin dose be adjusted given the concurrent Warfarin therapy?'
  ],
  awsMetadata: {
    s3Bucket: 'rx-clarify-prescriptions-prod-us-east-1',
    s3Key: 'uploads/2026/09/18/dr_sharma_rx_scan.png',
    region: 'us-east-1',
    inferenceLatencyMs: 640,
    modelPipeline: 'AWS Lambda + SageMaker Strands Medical Agent v2.4',
    confidenceScore: 98.6
  }
};

export const MOCK_CLEAN_PRESCRIPTION: AnalysisResponse = {
  id: 'rx-analysis-3104-clean',
  timestamp: new Date().toISOString(),
  fileName: 'Dr_Patel_Pediatric_ENT_Prescription.pdf',
  fileType: 'pdf',
  fileSize: '820 KB',
  patientName: 'Aarav Mehta (28y / M)',
  prescriber: 'Dr. Ananya Patel, MS (ENT Specialist)',
  summary: {
    plainLanguage:
      'This prescription is a targeted 7-day antibacterial and anti-allergy course for an acute upper respiratory infection. All prescribed medicines have been cross-checked and are completely safe to take together with zero drug-drug conflicts.',
    keyTakeaways: [
      'SAFE: No hazardous drug-drug interactions detected.',
      'Crucial: Complete the full 7-day course of Amoxicillin even if symptoms improve early.',
      'Take probiotics 2 hours apart from your antibiotic dose to maintain gut balance.',
      'Drink plenty of warm fluids throughout the treatment.'
    ]
  },
  hasInteractions: false,
  interactionWarnings: [],
  medications: [
    {
      name: 'Amoxicillin + Clavulanic Acid',
      genericName: 'Augmentin 625 Duo',
      dosage: '625 mg',
      frequency: 'Twice daily (Every 12 hours)',
      duration: '7 days',
      purpose: 'Antibiotic for bacterial respiratory infection',
      instructions: 'Take immediately at the start of a meal to prevent stomach upset.',
      timing: ['morning', 'evening'],
      takeWithFood: true
    },
    {
      name: 'Levocetirizine',
      genericName: 'Xyzal',
      dosage: '5 mg',
      frequency: 'Once daily at bedtime',
      duration: '5 days',
      purpose: 'Antihistamine for congestion, sneezing, and throat irritation',
      instructions: 'May cause mild drowsiness; take right before sleeping.',
      timing: ['bedtime'],
      takeWithFood: false
    },
    {
      name: 'Lactobacillus Spores (Probiotic)',
      genericName: 'Sporlac DS',
      dosage: '1 Capsule',
      frequency: 'Once daily at lunch',
      duration: '10 days',
      purpose: 'Restores beneficial gut flora during antibiotic therapy',
      instructions: 'Take 2 hours after your morning antibiotic dose.',
      timing: ['noon'],
      takeWithFood: true
    }
  ],
  safetyAndDietaryTips: [
    'Stay well hydrated with warm water, herbal teas, or broths.',
    'Avoid ice-cold beverages and dairy excess if throat congestion persists.',
    'Complete the antibiotic course to avoid bacterial resistance.'
  ],
  doctorQuestions: [
    'What should I do if a dose is missed by more than 4 hours?',
    'Is a follow-up consultation required if congestion clears within 4 days?'
  ],
  awsMetadata: {
    s3Bucket: 'rx-clarify-prescriptions-prod-us-east-1',
    s3Key: 'uploads/2026/09/18/dr_patel_ent_rx.pdf',
    region: 'us-east-1',
    inferenceLatencyMs: 480,
    modelPipeline: 'AWS Lambda + SageMaker Strands Medical Agent v2.4',
    confidenceScore: 99.4
  }
};

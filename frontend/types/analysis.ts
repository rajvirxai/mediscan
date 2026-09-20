export type SeverityLevel = 'high' | 'moderate' | 'low';

export interface MedicationItem {
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration?: string;
  purpose: string;
  instructions: string;
  timing: ('morning' | 'noon' | 'evening' | 'bedtime')[];
  takeWithFood: boolean;
}

export interface InteractionWarning {
  id: string;
  severity: SeverityLevel;
  drug1: string;
  drug2: string;
  clinicalExplanation: string;
  recommendation: string;
}

export interface AnalysisResponse {
  id: string;
  timestamp: string;
  fileName: string;
  fileType: 'image' | 'pdf';
  fileSize?: string;
  patientName?: string;
  prescriber?: string;
  summary: {
    plainLanguage: string;
    keyTakeaways: string[];
  };
  hasInteractions: boolean;
  interactionWarnings: InteractionWarning[];
  medications: MedicationItem[];
  safetyAndDietaryTips: string[];
  doctorQuestions: string[];
  awsMetadata: {
    s3Bucket: string;
    s3Key: string;
    region: string;
    inferenceLatencyMs: number;
    modelPipeline: string;
    confidenceScore: number;
  };
}

export type ProcessingStep = 
  | 'idle'
  | 'uploading_s3'
  | 'ocr_extraction'
  | 'checking_interactions'
  | 'synthesizing_summary'
  | 'completed'
  | 'error';

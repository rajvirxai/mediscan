import { AnalysisResponse, ProcessingStep } from '../types/analysis';
import { MOCK_FLAGGED_PRESCRIPTION, MOCK_CLEAN_PRESCRIPTION } from '../data/mockPrescriptions';

export type ProgressCallback = (step: ProcessingStep, percent: number, message: string) => void;

export interface AnalyzeOptions {
  forcePreset?: 'flagged' | 'clean' | 'auto';
  onProgress?: ProgressCallback;
}

export async function analyzePrescriptionDocument(
  file: File | { name: string; type: string; size: number },
  options: AnalyzeOptions = {}
): Promise<AnalysisResponse> {
  const { forcePreset = 'auto', onProgress } = options;

  const notify = (step: ProcessingStep, percent: number, message: string) => {
    if (onProgress) {
      onProgress(step, percent, message);
    }
  };

  // Step 1: Upload to S3 Bucket
  notify('uploading_s3', 20, 'Encrypting & uploading document to AWS S3 bucket (AES-256)...');
  await delay(600);

  // Step 2: OCR & Text Extraction (AWS SageMaker / Textract / Strands Agent)
  notify('ocr_extraction', 45, 'Extracting handwritten clinical annotations via AWS SageMaker Vision AI...');
  await delay(700);

  // Step 3: Drug Interaction Knowledge Graph Check
  notify('checking_interactions', 75, 'Cross-referencing RxNorm, FDA blackbox warnings & drug-drug contraindications...');
  await delay(800);

  // Step 4: Plain-Language Synthesis
  notify('synthesizing_summary', 90, 'Synthesizing plain-language patient summary & dosage schedule...');
  await delay(500);

  // Determine preset response
  let result: AnalysisResponse;

  if (forcePreset === 'clean') {
    result = JSON.parse(JSON.stringify(MOCK_CLEAN_PRESCRIPTION));
  } else if (forcePreset === 'flagged') {
    result = JSON.parse(JSON.stringify(MOCK_FLAGGED_PRESCRIPTION));
  } else {
    // If file name contains clean or pdf, return clean, otherwise flagged
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes('clean') || lowerName.includes('patel') || lowerName.includes('ent')) {
      result = JSON.parse(JSON.stringify(MOCK_CLEAN_PRESCRIPTION));
    } else {
      result = JSON.parse(JSON.stringify(MOCK_FLAGGED_PRESCRIPTION));
    }
  }

  // Update dynamic file metadata
  result.fileName = file.name;
  result.fileType = file.type.includes('pdf') || file.name.endsWith('.pdf') ? 'pdf' : 'image';
  if ('size' in file && file.size) {
    result.fileSize = formatBytes(file.size);
  }
  result.timestamp = new Date().toISOString();

  notify('completed', 100, 'Analysis completed successfully.');
  return result;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

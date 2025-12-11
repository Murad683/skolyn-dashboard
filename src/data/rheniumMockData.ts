// Rhenium OS Extended Mock Data

export interface Finding {
  finding_id: string;
  type: 'lesion' | 'nodule' | 'effusion' | 'consolidation' | 'mass';
  location: string;
  measurements: {
    volume_mm3?: number;
    diameter_mm?: number;
    longest_axis_mm?: number;
    shortest_axis_mm?: number;
  };
  confidence: number;
  uncertainty_score: number;
  evidence_dossier: {
    visual_url: string;
    saliency_url: string;
    attention_url: string;
    narrative: string;
    radiomics: {
      heterogeneity_index: number;
      texture_entropy: number;
      sphericity: number;
    };
  };
}

export interface DiseaseAssessment {
  primary_hypothesis: {
    disease: string;
    probability: number;
  };
  differential: Array<{
    disease: string;
    probability: number;
  }>;
  safety_flags: Array<{
    level: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  model_version: string;
  input_hash: string;
  details?: string;
  isOverride?: boolean;
}

export interface ModelCard {
  id: string;
  name: string;
  version: string;
  description: string;
  intendedUse: string;
  limitations: string[];
  trainingDataDistribution: {
    category: string;
    percentage: number;
  }[];
  lastUpdated: string;
  license: string;
  accuracy: number;
}

export interface FairnessMetric {
  demographic: string;
  category: string;
  accuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  sampleSize: number;
}

export interface PipelineNode {
  id: string;
  type: 'ingest' | 'reconstruct' | 'segment' | 'reason' | 'report';
  label: string;
  config?: Record<string, unknown>;
}

export interface ReconstructionJob {
  id: string;
  inputType: 'k-space' | 'sinogram' | 'rf-data';
  modality: 'MRI' | 'CT' | 'Ultrasound';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  psnr?: number;
  ssim?: number;
  accelerationFactor?: string;
  doseReduction?: string;
  createdAt: string;
}

// Mock Findings with Evidence Dossiers
export const mockFindings: Finding[] = [
  {
    finding_id: 'f_001',
    type: 'consolidation',
    location: 'Right Lower Lobe',
    measurements: {
      volume_mm3: 4520.5,
      diameter_mm: 28.4,
      longest_axis_mm: 32.1,
      shortest_axis_mm: 24.8,
    },
    confidence: 0.92,
    uncertainty_score: 0.05,
    evidence_dossier: {
      visual_url: '/evidence/f_001_visual.png',
      saliency_url: '/evidence/f_001_saliency.png',
      attention_url: '/evidence/f_001_attention.png',
      narrative: 'Dense consolidation in the right lower lobe with air bronchograms visible. The opacity demonstrates a lobar distribution pattern consistent with bacterial pneumonia. High signal intensity on T2-weighted sequences corresponds with inflammatory edema. The lesion shows rim enhancement post-contrast, typical of infectious etiology.',
      radiomics: {
        heterogeneity_index: 0.78,
        texture_entropy: 5.42,
        sphericity: 0.65,
      },
    },
  },
  {
    finding_id: 'f_002',
    type: 'effusion',
    location: 'Right Pleural Space',
    measurements: {
      volume_mm3: 125.3,
    },
    confidence: 0.78,
    uncertainty_score: 0.12,
    evidence_dossier: {
      visual_url: '/evidence/f_002_visual.png',
      saliency_url: '/evidence/f_002_saliency.png',
      attention_url: '/evidence/f_002_attention.png',
      narrative: 'Small right-sided pleural effusion noted. Meniscus sign present at the costophrenic angle. Estimated volume approximately 125mL. No loculation or septation identified. May be parapneumonic given adjacent consolidation.',
      radiomics: {
        heterogeneity_index: 0.12,
        texture_entropy: 1.8,
        sphericity: 0.2,
      },
    },
  },
];

// Mock Disease Assessment
export const mockDiseaseAssessment: DiseaseAssessment = {
  primary_hypothesis: {
    disease: 'Bacterial Pneumonia',
    probability: 0.88,
  },
  differential: [
    { disease: 'Viral Pneumonia', probability: 0.08 },
    { disease: 'Aspiration Pneumonitis', probability: 0.03 },
    { disease: 'Pulmonary Edema', probability: 0.01 },
  ],
  safety_flags: [
    {
      level: 'CRITICAL',
      message: 'Consolidation with possible sepsis markers - recommend urgent clinical correlation',
    },
    {
      level: 'WARNING',
      message: 'Pleural effusion may indicate complicated pneumonia',
    },
  ],
};

// Mock Audit Logs
export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log_001',
    timestamp: '2024-12-06T09:15:32Z',
    user: 'Dr. Sarah Chen',
    action: 'Accepted AI Finding',
    model_version: 'MedGemma-27B-v2.1',
    input_hash: 'sha256:a8f9c2d1e4b7...',
    details: 'Accepted pneumonia diagnosis with confidence 92%',
  },
  {
    id: 'log_002',
    timestamp: '2024-12-06T09:14:18Z',
    user: 'Dr. Sarah Chen',
    action: 'Modified Segmentation Mask',
    model_version: 'nnU-Net-Lung-v3.0',
    input_hash: 'sha256:b7c8d3e2f1a0...',
    details: 'Adjusted consolidation boundary in RLL',
    isOverride: true,
  },
  {
    id: 'log_003',
    timestamp: '2024-12-06T09:12:45Z',
    user: 'System',
    action: 'AI Analysis Complete',
    model_version: 'Rhenium-PINN-v1.2',
    input_hash: 'sha256:c9d0e1f2a3b4...',
    details: 'Reconstruction completed with PSNR 42.3dB',
  },
  {
    id: 'log_004',
    timestamp: '2024-12-06T08:58:12Z',
    user: 'Dr. Michael Torres',
    action: 'Rejected AI Finding',
    model_version: 'MedGemma-27B-v2.1',
    input_hash: 'sha256:d1e2f3a4b5c6...',
    details: 'Disagreed with cardiomegaly diagnosis - clinically insignificant',
    isOverride: true,
  },
  {
    id: 'log_005',
    timestamp: '2024-12-06T08:45:00Z',
    user: 'Dr. Emily Watson',
    action: 'Generated Report',
    model_version: 'MedGemma-27B-v2.1',
    input_hash: 'sha256:e2f3a4b5c6d7...',
  },
];

// Mock Model Cards
export const mockModelCards: ModelCard[] = [
  {
    id: 'medgemma-27b',
    name: 'MedGemma 27B',
    version: 'v2.1.0',
    description: 'Large language model fine-tuned for medical reasoning, report generation, and clinical decision support.',
    intendedUse: 'Clinical decision support, report drafting, differential diagnosis ranking, and natural language explanation of radiological findings.',
    limitations: [
      'Not intended for standalone diagnosis without physician review',
      'May underperform on rare diseases with limited training data',
      'Requires high-quality input images for optimal performance',
      'Not validated for pediatric populations under 12 years',
    ],
    trainingDataDistribution: [
      { category: 'Chest X-Ray', percentage: 35 },
      { category: 'CT Chest', percentage: 28 },
      { category: 'CT Abdomen', percentage: 18 },
      { category: 'MRI Brain', percentage: 12 },
      { category: 'Other', percentage: 7 },
    ],
    lastUpdated: '2024-11-15',
    license: 'Medical Device (Class IIa)',
    accuracy: 94.2,
  },
  {
    id: 'nnunet-lung',
    name: 'nnU-Net Lung Segmentation',
    version: 'v3.0.0',
    description: 'Self-configuring deep learning framework for lung and lesion segmentation.',
    intendedUse: 'Automated segmentation of lung parenchyma, nodules, consolidations, and pleural effusions.',
    limitations: [
      'Performance degrades with severe motion artifacts',
      'May miss sub-5mm nodules',
      'Requires standardized windowing for optimal results',
    ],
    trainingDataDistribution: [
      { category: 'Normal', percentage: 40 },
      { category: 'Pneumonia', percentage: 25 },
      { category: 'Nodules', percentage: 20 },
      { category: 'Effusion', percentage: 15 },
    ],
    lastUpdated: '2024-10-28',
    license: 'Medical Device (Class IIb)',
    accuracy: 96.8,
  },
  {
    id: 'rhenium-pinn',
    name: 'Rhenium PINN Reconstructor',
    version: 'v1.2.0',
    description: 'Physics-Informed Neural Network for accelerated MRI/CT reconstruction from raw k-space/sinogram data.',
    intendedUse: 'Accelerated image reconstruction maintaining diagnostic quality at 4-8x acceleration factors.',
    limitations: [
      'Optimal performance at 4x acceleration; quality degrades at >8x',
      'Requires calibration for each scanner manufacturer',
      'Not validated for cardiac imaging protocols',
    ],
    trainingDataDistribution: [
      { category: 'Siemens', percentage: 38 },
      { category: 'GE Healthcare', percentage: 32 },
      { category: 'Philips', percentage: 22 },
      { category: 'Canon', percentage: 8 },
    ],
    lastUpdated: '2024-12-01',
    license: 'Research Use Only',
    accuracy: 98.5,
  },
];

// Mock Fairness Metrics
export const mockFairnessMetrics: FairnessMetric[] = [
  // Age groups
  { demographic: 'Age', category: '18-30', accuracy: 95.2, falsePositiveRate: 0.03, falseNegativeRate: 0.02, sampleSize: 1250 },
  { demographic: 'Age', category: '31-50', accuracy: 94.8, falsePositiveRate: 0.04, falseNegativeRate: 0.02, sampleSize: 3420 },
  { demographic: 'Age', category: '51-70', accuracy: 93.1, falsePositiveRate: 0.05, falseNegativeRate: 0.03, sampleSize: 4180 },
  { demographic: 'Age', category: '71+', accuracy: 89.4, falsePositiveRate: 0.08, falseNegativeRate: 0.04, sampleSize: 2890 },
  // Gender
  { demographic: 'Gender', category: 'Male', accuracy: 93.8, falsePositiveRate: 0.05, falseNegativeRate: 0.02, sampleSize: 5840 },
  { demographic: 'Gender', category: 'Female', accuracy: 94.2, falsePositiveRate: 0.04, falseNegativeRate: 0.02, sampleSize: 5900 },
  // Scanner Manufacturer
  { demographic: 'Scanner', category: 'Siemens', accuracy: 95.1, falsePositiveRate: 0.03, falseNegativeRate: 0.02, sampleSize: 4520 },
  { demographic: 'Scanner', category: 'GE Healthcare', accuracy: 94.3, falsePositiveRate: 0.04, falseNegativeRate: 0.02, sampleSize: 3890 },
  { demographic: 'Scanner', category: 'Philips', accuracy: 93.8, falsePositiveRate: 0.04, falseNegativeRate: 0.03, sampleSize: 2340 },
  { demographic: 'Scanner', category: 'Canon', accuracy: 88.2, falsePositiveRate: 0.09, falseNegativeRate: 0.05, sampleSize: 990 },
];

// Mock Reconstruction Jobs
export const mockReconstructionJobs: ReconstructionJob[] = [
  {
    id: 'recon_001',
    inputType: 'k-space',
    modality: 'MRI',
    status: 'completed',
    progress: 100,
    psnr: 42.3,
    ssim: 0.987,
    accelerationFactor: '4x',
    createdAt: '2024-12-06T08:30:00Z',
  },
  {
    id: 'recon_002',
    inputType: 'sinogram',
    modality: 'CT',
    status: 'processing',
    progress: 67,
    doseReduction: '50%',
    createdAt: '2024-12-06T09:00:00Z',
  },
  {
    id: 'recon_003',
    inputType: 'rf-data',
    modality: 'Ultrasound',
    status: 'queued',
    progress: 0,
    createdAt: '2024-12-06T09:15:00Z',
  },
];

// Disease Trajectory Mock Data
export const mockDiseaseTrajectory = [
  { date: '2024-05-15', tumorVolume: 120, probability: 0.25 },
  { date: '2024-07-20', tumorVolume: 145, probability: 0.38 },
  { date: '2024-09-10', tumorVolume: 210, probability: 0.52 },
  { date: '2024-11-05', tumorVolume: 285, probability: 0.68 },
  { date: '2024-12-06', tumorVolume: 340, probability: 0.78 },
];

// Throughput Metrics
export const mockThroughputMetrics = {
  scanTimeSaved: 4.2,
  aiFindings: 12,
  urgentCases: 3,
  reconstructionsToday: 28,
  avgReconTime: 12.4, // seconds
  gpuUtilization: 78,
};

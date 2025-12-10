export interface Study {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F';
  modality: 'X-ray' | 'CT' | 'MRI';
  bodyRegion: string;
  dateTime: string;
  priority: 'Routine' | 'Urgent';
  status: 'New' | 'AI Analyzing' | 'AI Analyzed' | 'In Review' | 'Finalized';
  imageQuality: 'Good' | 'Moderate' | 'Poor';
  referralReason: string;
  clinicalNotes: string;
  aiFindings?: AIFindings;
  previousDiagnoses?: string[];
}

export interface AffectedZone {
  zone: string;
  severity: 'High' | 'Moderate' | 'Normal';
}

export interface AIFindings {
  primaryDisease: string;
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  secondaryFindings: { name: string; probability: number }[];
  explanations: string[];
  contributingFeatures: string[];
  affectedZones: AffectedZone[];
}

export interface PastScan {
  id: string;
  date: string;
  modality: string;
  aiScore: number;
  disease: string;
  severity: 'Low' | 'Medium' | 'High';
}

export const mockStudies: Study[] = [];

export const mockPastScans: PastScan[] = [];

export const mockAnalytics = {
  totalScans: 1247,
  aiUsageRate: 94.2,
  agreementRate: 87.5,
  topDisease: 'Pneumonia',
  scansChange: 12.5,
  aiUsageChange: 3.2,
  agreementChange: -1.8,
  accuracyOverTime: [
    { month: 'Jul', accuracy: 82 },
    { month: 'Aug', accuracy: 84 },
    { month: 'Sep', accuracy: 85 },
    { month: 'Oct', accuracy: 87 },
    { month: 'Nov', accuracy: 89 },
    { month: 'Dec', accuracy: 91 },
  ],
  diseaseDistribution: [
    { name: 'Pneumonia', value: 320, color: '#030F4F' },
    { name: 'Normal', value: 450, color: '#00A99D' },
    { name: 'Cardiomegaly', value: 180, color: '#6366F1' },
    { name: 'Pleural Effusion', value: 145, color: '#8B5CF6' },
    { name: 'Tuberculosis', value: 85, color: '#EC4899' },
    { name: 'Other', value: 67, color: '#94A3B8' },
  ],
  agreementTrend: [
    { month: 'Jul', totalScans: 210, agreeCount: 172, disagreeCount: 38 },
    { month: 'Aug', totalScans: 240, agreeCount: 198, disagreeCount: 42 },
    { month: 'Sep', totalScans: 225, agreeCount: 189, disagreeCount: 36 },
    { month: 'Oct', totalScans: 260, agreeCount: 229, disagreeCount: 31 },
    { month: 'Nov', totalScans: 250, agreeCount: 218, disagreeCount: 32 },
    { month: 'Dec', totalScans: 270, agreeCount: 242, disagreeCount: 28 },
  ],
};

export const diseaseModules = [
  { id: 'pneumonia', name: 'Pneumonia', icon: 'lungs' },
  { id: 'tuberculosis', name: 'Tuberculosis', icon: 'bug' },
  { id: 'covid19', name: 'COVID-19', icon: 'virus' },
  { id: 'pleural-effusion', name: 'Pleural Effusion', icon: 'droplet' },
  { id: 'lung-nodules', name: 'Lung Nodules', icon: 'circle-dot' },
  { id: 'cardiomegaly', name: 'Cardiomegaly', icon: 'heart' },
];

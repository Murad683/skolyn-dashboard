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
  status: 'New' | 'AI Analyzed' | 'In Review' | 'Finalized';
  imageQuality: 'Good' | 'Moderate' | 'Poor';
  referralReason: string;
  clinicalNotes: string;
  aiFindings?: AIFindings;
  previousDiagnoses?: string[];
}

export interface AIFindings {
  primaryDisease: string;
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  secondaryFindings: { name: string; probability: number }[];
  explanations: string[];
  contributingFeatures: string[];
  affectedZones: string[];
}

export interface PastScan {
  id: string;
  date: string;
  modality: string;
  aiScore: number;
  disease: string;
  severity: 'Low' | 'Medium' | 'High';
}

export const mockStudies: Study[] = [
  {
    id: 'STU-001',
    patientId: 'P-2024-0891',
    patientName: 'John D.',
    age: 67,
    gender: 'M',
    modality: 'X-ray',
    bodyRegion: 'Chest',
    dateTime: '2024-12-06T09:15:00',
    priority: 'Urgent',
    status: 'AI Analyzed',
    imageQuality: 'Good',
    referralReason: 'Persistent cough, fever for 5 days',
    clinicalNotes: 'Patient presents with productive cough, temperature 38.5°C. History of smoking (20 pack-years). No known allergies.',
    previousDiagnoses: ['COPD', 'Hypertension'],
    aiFindings: {
      primaryDisease: 'Pneumonia',
      probability: 92,
      severity: 'High',
      confidence: 88,
      secondaryFindings: [
        { name: 'Pleural Effusion', probability: 35 },
        { name: 'Atelectasis', probability: 18 },
        { name: 'Cardiomegaly', probability: 12 },
      ],
      explanations: [
        'Abnormal opacity detected in right lower lobe consistent with consolidation',
        'High activation in right lower zone heatmap indicates inflammatory process',
        'Texture pattern analysis suggests bacterial pneumonia signature',
        'Air bronchograms visible within the consolidated area',
      ],
      contributingFeatures: ['Consolidation opacity', 'Air bronchograms', 'Silhouette sign', 'Increased density'],
      affectedZones: ['Right Lower', 'Right Middle'],
    },
  },
  {
    id: 'STU-002',
    patientId: 'P-2024-0756',
    patientName: 'Sarah M.',
    age: 45,
    gender: 'F',
    modality: 'CT',
    bodyRegion: 'Chest',
    dateTime: '2024-12-06T08:45:00',
    priority: 'Routine',
    status: 'New',
    imageQuality: 'Good',
    referralReason: 'Follow-up lung nodule evaluation',
    clinicalNotes: 'Annual follow-up for previously detected 6mm lung nodule. Non-smoker. No symptoms.',
    previousDiagnoses: ['Lung Nodule (6mm)'],
  },
  {
    id: 'STU-003',
    patientId: 'P-2024-0923',
    patientName: 'Robert K.',
    age: 72,
    gender: 'M',
    modality: 'X-ray',
    bodyRegion: 'Chest',
    dateTime: '2024-12-06T07:30:00',
    priority: 'Routine',
    status: 'AI Analyzed',
    imageQuality: 'Moderate',
    referralReason: 'Pre-operative assessment',
    clinicalNotes: 'Scheduled for hip replacement surgery. Cardiac history: stable angina. On aspirin and beta-blockers.',
    previousDiagnoses: ['Coronary Artery Disease', 'Osteoarthritis'],
    aiFindings: {
      primaryDisease: 'Cardiomegaly',
      probability: 78,
      severity: 'Medium',
      confidence: 82,
      secondaryFindings: [
        { name: 'Aortic Calcification', probability: 65 },
        { name: 'Pulmonary Congestion', probability: 22 },
      ],
      explanations: [
        'Cardiothoracic ratio exceeds 0.5, indicating cardiac enlargement',
        'Left ventricular prominence noted',
        'Mild pulmonary vascular redistribution suggests early congestion',
      ],
      contributingFeatures: ['Enlarged cardiac silhouette', 'CTR > 0.5', 'Vascular redistribution'],
      affectedZones: ['Cardiac', 'Left Lower'],
    },
  },
  {
    id: 'STU-004',
    patientId: 'P-2024-0834',
    patientName: 'Emily W.',
    age: 34,
    gender: 'F',
    modality: 'X-ray',
    bodyRegion: 'Chest',
    dateTime: '2024-12-06T10:00:00',
    priority: 'Routine',
    status: 'In Review',
    imageQuality: 'Good',
    referralReason: 'Shortness of breath on exertion',
    clinicalNotes: 'Young female with 2-week history of dyspnea. No fever. Recent long-haul flight.',
    previousDiagnoses: [],
    aiFindings: {
      primaryDisease: 'Pleural Effusion',
      probability: 45,
      severity: 'Low',
      confidence: 72,
      secondaryFindings: [
        { name: 'Normal', probability: 40 },
      ],
      explanations: [
        'Small opacity at right costophrenic angle',
        'Could represent minimal pleural fluid or positioning artifact',
        'Recommend correlation with clinical findings',
      ],
      contributingFeatures: ['Costophrenic angle blunting', 'Meniscus sign'],
      affectedZones: ['Right Lower'],
    },
  },
  {
    id: 'STU-005',
    patientId: 'P-2024-0901',
    patientName: 'Michael T.',
    age: 58,
    gender: 'M',
    modality: 'CT',
    bodyRegion: 'Chest',
    dateTime: '2024-12-05T16:20:00',
    priority: 'Urgent',
    status: 'Finalized',
    imageQuality: 'Good',
    referralReason: 'Suspected tuberculosis',
    clinicalNotes: 'Night sweats, weight loss, chronic cough. Recent travel to endemic area.',
    previousDiagnoses: ['Diabetes Type 2'],
    aiFindings: {
      primaryDisease: 'Tuberculosis',
      probability: 85,
      severity: 'High',
      confidence: 90,
      secondaryFindings: [
        { name: 'Cavitary Lesion', probability: 78 },
        { name: 'Lymphadenopathy', probability: 55 },
      ],
      explanations: [
        'Upper lobe fibronodular opacities with cavitation',
        'Tree-in-bud pattern visible in right upper lobe',
        'Mediastinal lymphadenopathy present',
      ],
      contributingFeatures: ['Cavitation', 'Tree-in-bud', 'Upper lobe predominance', 'Lymphadenopathy'],
      affectedZones: ['Right Upper', 'Left Upper'],
    },
  },
  {
    id: 'STU-006',
    patientId: 'P-2024-0867',
    patientName: 'Linda H.',
    age: 62,
    gender: 'F',
    modality: 'X-ray',
    bodyRegion: 'Chest',
    dateTime: '2024-12-05T14:45:00',
    priority: 'Routine',
    status: 'AI Analyzed',
    imageQuality: 'Good',
    referralReason: 'Routine screening',
    clinicalNotes: 'Annual check-up. Former smoker (quit 10 years ago). No current symptoms.',
    previousDiagnoses: [],
    aiFindings: {
      primaryDisease: 'Normal',
      probability: 95,
      severity: 'Low',
      confidence: 94,
      secondaryFindings: [],
      explanations: [
        'Clear lung fields bilaterally',
        'Normal cardiac silhouette',
        'No pleural abnormalities detected',
      ],
      contributingFeatures: ['Clear lungs', 'Normal CTR', 'Normal hila'],
      affectedZones: [],
    },
  },
];

export const mockPastScans: PastScan[] = [
  { id: 'PS-001', date: '2024-11-15', modality: 'X-ray', aiScore: 88, disease: 'Pneumonia', severity: 'High' },
  { id: 'PS-002', date: '2024-10-20', modality: 'X-ray', aiScore: 72, disease: 'Pneumonia', severity: 'Medium' },
  { id: 'PS-003', date: '2024-09-05', modality: 'CT', aiScore: 45, disease: 'Pneumonia', severity: 'Low' },
  { id: 'PS-004', date: '2024-07-12', modality: 'X-ray', aiScore: 25, disease: 'Normal', severity: 'Low' },
  { id: 'PS-005', date: '2024-05-28', modality: 'X-ray', aiScore: 15, disease: 'Normal', severity: 'Low' },
];

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
    { month: 'Jul', agree: 82, disagree: 18 },
    { month: 'Aug', agree: 85, disagree: 15 },
    { month: 'Sep', agree: 84, disagree: 16 },
    { month: 'Oct', agree: 88, disagree: 12 },
    { month: 'Nov', agree: 87, disagree: 13 },
    { month: 'Dec', agree: 89, disagree: 11 },
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

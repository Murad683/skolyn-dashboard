import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudies } from '@/context/StudiesContext';
import { Study, AIFindings } from '@/data/mockData';

type AnalysisStep = 'idle' | 'uploading' | 'analyzing' | 'complete';

const generateAIFindings = (modality: string): AIFindings => {
  const diseases = ['Pneumonia', 'Tuberculosis', 'Pleural Effusion', 'Cardiomegaly', 'Normal'];
  const primaryDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const probability = Math.floor(Math.random() * 30) + 65;

  return {
    primaryDisease,
    probability,
    severity: probability > 85 ? 'High' : probability > 70 ? 'Medium' : 'Low',
    confidence: Math.floor(Math.random() * 15) + 80,
    secondaryFindings: [
      { name: 'Atelectasis', probability: Math.floor(Math.random() * 25) + 10 },
      { name: 'Pleural Thickening', probability: Math.floor(Math.random() * 20) + 5 },
    ],
    explanations: [
      `AI-detected abnormality consistent with ${primaryDisease.toLowerCase()} pattern`,
      'High activation regions identified in relevant anatomical zones',
      'Texture and density analysis supports the primary finding',
      'Pattern recognition indicates confidence in diagnosis',
    ],
    contributingFeatures: ['Opacity pattern', 'Density variation', 'Anatomical landmarks'],
    affectedZones: probability > 70 ? ['Right Lower', 'Right Middle'] : ['Left Lower'],
  };
};

const Analyze = () => {
  const navigate = useNavigate();
  const { studies, addStudy, updateStudyStatus } = useStudies();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('idle');
  
  // Form fields
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [modality, setModality] = useState<'X-ray' | 'CT' | 'MRI' | ''>('');
  const [bodyRegion, setBodyRegion] = useState('Chest');
  const [priority, setPriority] = useState<'Routine' | 'Urgent'>('Routine');

  // Auto-fill patient data when Patient ID changes
  const handlePatientIdChange = (newPatientId: string) => {
    setPatientId(newPatientId);
    
    if (!newPatientId.trim()) return;
    
    // Find the most recent study with this patient ID
    const existingStudy = studies
      .filter(s => s.patientId.toLowerCase() === newPatientId.toLowerCase())
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0];
    
    if (existingStudy) {
      // Auto-fill patient demographics
      setPatientName(existingStudy.patientName);
      setAge(existingStudy.age.toString());
      setGender(existingStudy.gender as 'M' | 'F');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleChangeFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dcm,.nii,.h5,.png,.jpg,.jpeg';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    };
    input.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleStartAnalysis = async () => {
    if (!file || !modality) return;

    const studyId = `STU-${Date.now().toString(36).toUpperCase()}`;
    
    // Create new study with user-selected modality
    const newStudy: Study = {
      id: studyId,
      patientId: patientId || `P-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      patientName: patientName || 'Anonymous Patient',
      age: parseInt(age) || Math.floor(Math.random() * 50) + 25,
      gender: gender || 'M',
      modality: modality,
      bodyRegion,
      dateTime: new Date().toISOString(),
      priority,
      status: 'New',
      imageQuality: 'Good',
      referralReason: 'Uploaded for AI analysis',
      clinicalNotes: `Study uploaded via Skolyn Analyze portal. File: ${file.name}`,
      previousDiagnoses: [],
    };

    addStudy(newStudy);

    // Step 1: Uploading
    setAnalysisStep('uploading');
    await new Promise(resolve => setTimeout(resolve, 800));

    // Step 2: Analyzing
    setAnalysisStep('analyzing');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Complete - Generate AI findings
    const aiFindings = generateAIFindings(modality);
    updateStudyStatus(studyId, 'AI Analyzed', aiFindings);
    
    setAnalysisStep('complete');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Navigate to viewer
    navigate(`/viewer/${studyId}`);
  };

  const isFormValid = file !== null && modality !== '';

  return (
    <DashboardLayout pageTitle="Analyze" breadcrumb="Upload new study">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Upload Card */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-secondary" />
              New Analysis
            </CardTitle>
            <CardDescription>
              Upload a medical image file for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Zone */}
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center",
                  isDragOver 
                    ? "border-secondary bg-secondary/5" 
                    : "border-border hover:border-secondary/50 hover:bg-muted/50",
                  analysisStep !== 'idle' && "pointer-events-none opacity-60"
                )}
              >
                <input
                  type="file"
                  accept=".dcm,.nii,.h5,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={analysisStep !== 'idle'}
                />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                    <Upload className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported: DICOM, NIfTI, .h5, PNG, JPG
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn(
                "border rounded-xl p-4 bg-secondary/5 border-secondary/30",
                analysisStep !== 'idle' && "pointer-events-none opacity-60"
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <FileImage className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <button
                      onClick={handleChangeFile}
                      disabled={analysisStep !== 'idle'}
                      className="text-secondary hover:underline font-medium"
                    >
                      Change file
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      disabled={analysisStep !== 'idle'}
                      className="text-muted-foreground hover:text-destructive font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="e.g. P-2024-0607"
                  value={patientId}
                  onChange={(e) => handlePatientIdChange(e.target.value)}
                  disabled={analysisStep !== 'idle'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="John D."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  disabled={analysisStep !== 'idle'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 67"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={analysisStep !== 'idle'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={gender} 
                  onValueChange={(v) => setGender(v as 'M' | 'F')} 
                  disabled={analysisStep !== 'idle'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modality">
                  Modality <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={modality} 
                  onValueChange={(v) => setModality(v as 'X-ray' | 'CT' | 'MRI')} 
                  disabled={analysisStep !== 'idle'}
                >
                  <SelectTrigger className={cn(!modality && "text-muted-foreground")}>
                    <SelectValue placeholder="Select modality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="X-ray">X-ray</SelectItem>
                    <SelectItem value="CT">CT</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyRegion">Body Region</Label>
                <Select value={bodyRegion} onValueChange={setBodyRegion} disabled={analysisStep !== 'idle'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chest">Chest</SelectItem>
                    <SelectItem value="Abdomen">Abdomen</SelectItem>
                    <SelectItem value="Head">Head</SelectItem>
                    <SelectItem value="Spine">Spine</SelectItem>
                    <SelectItem value="Extremity">Extremity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!modality && file && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Please select a modality to enable analysis.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Analysis Progress or Start Button */}
        {analysisStep === 'idle' ? (
          <Button
            size="lg"
            className="w-full gap-2"
            disabled={!isFormValid}
            onClick={handleStartAnalysis}
          >
            <Sparkles className="w-4 h-4" />
            Start Analysis
          </Button>
        ) : (
          <Card className="border-secondary/30 bg-secondary/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                {analysisStep === 'complete' ? (
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {analysisStep === 'uploading' && 'Uploading file...'}
                    {analysisStep === 'analyzing' && 'Running AI analysis...'}
                    {analysisStep === 'complete' && 'Analysis complete!'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analysisStep === 'uploading' && 'Preparing your study for analysis'}
                    {analysisStep === 'analyzing' && 'Analyzing across 127 clinical indicators'}
                    {analysisStep === 'complete' && 'Redirecting to results...'}
                  </p>
                </div>
              </div>
              
              {analysisStep === 'analyzing' && (
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analyze;

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStudies } from '@/context/StudiesContext';
import { Study, AIFindings } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2, FileImage } from 'lucide-react';
import { toast } from 'sonner';

const allowedTypes = [
  '.dcm',
  '.nii',
  '.h5',
  '.png',
  '.jpg',
  '.jpeg',
];

const randomChoice = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const generateFindings = (modality: Study['modality']): AIFindings => {
  const diseases = ['Pneumonia', 'Tuberculosis', 'Pleural Effusion', 'Cardiomegaly'];
  const primaryDisease = randomChoice(diseases);
  const probability = Math.floor(Math.random() * 25) + 70;
  const severity = probability > 85 ? 'High' : probability > 75 ? 'Medium' : 'Low';

  return {
    primaryDisease,
    probability,
    severity,
    confidence: Math.min(95, probability + 5),
    secondaryFindings: [
      { name: 'Atelectasis', probability: Math.floor(Math.random() * 25) + 10 },
    ],
    explanations: [
      'Pattern analysis indicates focal opacity in the lower lobe',
      'Heatmap shows strong activation along the posterior segment',
      'Texture distribution aligns with typical inflammatory changes',
      'Minor secondary opacities present without effusion',
    ],
    contributingFeatures: ['Opacity pattern', 'Density variation', 'Posterior predominance'],
    affectedZones: [
      { zone: 'Right Lower', severity: 'High' },
      { zone: 'Right Middle', severity: 'Moderate' },
      { zone: 'Right Upper', severity: 'Normal' },
      { zone: 'Left Upper', severity: 'Normal' },
      { zone: 'Left Middle', severity: 'Normal' },
      { zone: 'Left Lower', severity: 'Normal' },
    ],
  };
};

const Analyze = () => {
  const { addStudy, updateStudy, studies } = useStudies();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState('');
  const [fileChosen, setFileChosen] = useState<File | null>(null);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'analyzing'>('idle');

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileChosen(file);
    setFileName(file.name);
  };

  useEffect(() => {
    const trimmedId = patientId.trim();
    if (!trimmedId) return;

    const timeout = setTimeout(() => {
      const matches = studies
        .filter((s) => s.patientId === trimmedId)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

      if (matches.length > 0) {
        const latest = matches[0];
        setPatientName(latest.patientName);
        setAge(latest.age);
        setGender(latest.gender);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [patientId, studies]);

  const handleSubmit = () => {
    if (!fileChosen) return;

    const studyId = `STU-${Date.now()}`;
    const now = new Date().toISOString();
    const newStudy: Study = {
      id: studyId,
      patientId: patientId || `P-${Date.now()}`,
      patientName: patientName || 'Unknown Patient',
      age: typeof age === 'number' && !Number.isNaN(age) ? age : 55,
      gender,
      modality: 'X-ray',
      bodyRegion: 'Chest',
      dateTime: now,
      priority: 'Routine',
      status: 'AI Analyzing',
      imageQuality: 'Good',
      referralReason: 'Submitted via Analyze workflow',
      clinicalNotes: 'Auto-generated via Analyze workflow.',
      previousDiagnoses: [],
    };

    addStudy(newStudy);
    setPhase('uploading');

    setTimeout(() => {
      setPhase('analyzing');
    }, 800);

    setTimeout(() => {
      updateStudy(studyId, (study) => ({
        ...study,
        status: 'AI Analyzed',
        aiFindings: generateFindings('X-ray'),
      }));
      toast.success('Analysis complete', {
        description: `${newStudy.patientName} • ${newStudy.modality} ${newStudy.bodyRegion}`,
      });
      setPhase('idle');
      navigate(`/viewer/${studyId}`);
    }, 2300);
  };

  return (
    <DashboardLayout pageTitle="Analyze" breadcrumb="New Analysis">
      <div className="space-y-6">

        <Card className="shadow-soft border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">Upload A New Study</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="border border-dashed border-secondary/50 rounded-lg p-6 bg-secondary/5 flex flex-col items-center justify-center gap-3 text-center"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <UploadCloud className="w-10 h-10 text-secondary" />
              <div>
                <p className="font-semibold text-foreground">Drop your study file here</p>
                <p className="text-sm text-muted-foreground">
                  Supported: DICOM (.dcm), NIfTI (.nii), .h5, .png, .jpg
                </p>
              </div>
              <div className="relative inline-flex">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={allowedTypes.join(',')}
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  Choose file
                </Button>
              </div>
              {fileName && (
                <div className="flex flex-col md:flex-row md:items-center md:gap-2 text-sm text-foreground bg-card border border-border/40 rounded-md px-3 py-2 w-full">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-secondary" />
                    <span className="break-all">{fileName}</span>
                    <span className="text-muted-foreground text-xs">
                      (~{Math.max(1, Math.round((fileChosen?.size || 0) / 1024))} KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 md:mt-0 md:ml-auto">
                    <button
                      className="text-xs text-secondary hover:underline"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change file
                    </button>
                    <button
                      className="text-xs text-destructive hover:underline"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileChosen(null);
                        setFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="P-2024-0607"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="Jane Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 67"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value === 'M' ? 'M' : 'F')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={handleSubmit}
                className="gap-2"
                disabled={!fileChosen || phase !== 'idle'}
              >
                {phase === 'idle' ? (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Start Analysis
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analyze;

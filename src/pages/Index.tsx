import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorklistFilters } from '@/components/worklist/WorklistFilters';
import { WorklistTable } from '@/components/worklist/WorklistTable';
import { mockStudies, Study, AIFindings } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const generateTestStudy = (index: number): Study => {
  const names = ['Alex R.', 'Maria S.', 'James L.', 'Chen W.', 'Priya K.', 'Omar H.'];
  const modalities: ('X-ray' | 'CT' | 'MRI')[] = ['X-ray', 'CT', 'MRI'];
  const priorities: ('Routine' | 'Urgent')[] = ['Routine', 'Urgent'];
  const diseases = ['Pneumonia', 'Tuberculosis', 'Pleural Effusion', 'Cardiomegaly', 'Normal'];
  
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const probability = Math.floor(Math.random() * 40) + 60;
  
  const aiFindings: AIFindings = {
    primaryDisease: randomDisease,
    probability,
    severity: probability > 80 ? 'High' : probability > 60 ? 'Medium' : 'Low',
    confidence: Math.floor(Math.random() * 20) + 75,
    secondaryFindings: [
      { name: 'Atelectasis', probability: Math.floor(Math.random() * 30) + 10 },
    ],
    explanations: [
      'AI-detected abnormality in lung field',
      'Pattern analysis indicates potential pathology',
    ],
    contributingFeatures: ['Opacity pattern', 'Density variation'],
    affectedZones: ['Right Lower'],
  };

  return {
    id: `STU-NEW-${index}`,
    patientId: `P-2024-${String(1000 + index).padStart(4, '0')}`,
    patientName: names[Math.floor(Math.random() * names.length)],
    age: Math.floor(Math.random() * 50) + 25,
    gender: Math.random() > 0.5 ? 'M' : 'F',
    modality: modalities[Math.floor(Math.random() * modalities.length)],
    bodyRegion: 'Chest',
    dateTime: new Date().toISOString(),
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: 'New',
    imageQuality: 'Good',
    referralReason: 'Test study for demonstration',
    clinicalNotes: 'This is a simulated test study added for demonstration purposes.',
    previousDiagnoses: [],
    aiFindings,
  };
};

const Index = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<Study[]>(mockStudies);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const [testStudyCounter, setTestStudyCounter] = useState(1);

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      if (statusFilter !== 'All' && study.status !== statusFilter) return false;
      if (priorityFilter === 'Urgent' && study.priority !== 'Urgent') return false;
      if (modalityFilter !== 'All' && study.modality !== modalityFilter) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !study.patientId.toLowerCase().includes(query) &&
          !study.patientName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      return true;
    });
  }, [studies, statusFilter, priorityFilter, modalityFilter, searchQuery]);

  const handleAddTestStudy = () => {
    const newStudy = generateTestStudy(testStudyCounter);
    setStudies(prev => [newStudy, ...prev]);
    setTestStudyCounter(prev => prev + 1);
    
    toast.success('Test study added to worklist', {
      description: `Patient: ${newStudy.patientName} • ${newStudy.modality} ${newStudy.bodyRegion}`,
      action: {
        label: 'Open',
        onClick: () => navigate(`/viewer/${newStudy.id}`),
      },
    });
  };

  const urgentCount = studies.filter(s => s.priority === 'Urgent').length;
  const newCount = studies.filter(s => s.status === 'New').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Today's Worklist</h2>
            <p className="text-muted-foreground mt-1">
              {filteredStudies.length} studies • {urgentCount} urgent • {newCount} new
            </p>
          </div>
          <Button onClick={handleAddTestStudy} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Test Study
          </Button>
        </div>

        {/* Filters */}
        <WorklistFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          modalityFilter={modalityFilter}
          setModalityFilter={setModalityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Table */}
        <WorklistTable
          studies={filteredStudies}
          selectedStudy={selectedStudy}
          onSelectStudy={setSelectedStudy}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;

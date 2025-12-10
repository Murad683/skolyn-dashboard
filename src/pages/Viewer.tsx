import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientInfoPanel } from '@/components/viewer/PatientInfoPanel';
import { ImageViewer } from '@/components/viewer/ImageViewer';
import { AIDiagnosisPanel } from '@/components/viewer/AIDiagnosisPanel';
import { FeedbackCard } from '@/components/viewer/FeedbackCard';
import { UrgentBanner } from '@/components/viewer/UrgentBanner';
import { ReportModal } from '@/components/viewer/ReportModal';
import { useStudies } from '@/context/StudiesContext';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const Viewer = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { studies } = useStudies();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [feedbackChoice, setFeedbackChoice] = useState<'agree' | 'disagree' | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const study = studies.find((s) => s.id === studyId) || studies[0];

  // Simulate analysis on first load or if study is marked as analyzing
  useEffect(() => {
    if (!study) return;
    if (study.status === 'New' || study.status === 'AI Analyzing') {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsAnalyzing(false);
  }, [studyId, study?.status, study]);

  useEffect(() => {
    setFeedbackChoice(null);
    setFeedbackNote('');
    setReportModalOpen(false);
  }, [studyId]);

  const isUrgent = study?.priority === 'Urgent' && study.aiFindings?.severity === 'High';

  const handleGenerateReport = () => {
    if (!feedbackChoice) {
      toast.error('Please record feedback before generating the report.');
      return;
    }

    if (feedbackChoice === 'agree') {
      setReportModalOpen(true);
      return;
    }

    navigate(`/report/${study.id}`, { state: { feedbackNote } });
  };

  if (!study) {
    return (
      <DashboardLayout pageTitle="Viewer">
        <div className="bg-card border border-border/30 rounded-xl p-6 shadow-soft">
          <p className="text-foreground font-semibold mb-2">No study selected</p>
          <p className="text-muted-foreground mb-4">Please open a study from Recent Analyses or start a new analysis.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/recent-analyses')}>Recent Analyses</Button>
            <Button onClick={() => navigate('/')}>New Analysis</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      pageTitle={`Viewer – ${study.modality} ${study.bodyRegion}`}
      breadcrumb={`Study ${study.id}`}
    >
      <div className="space-y-4">
        {/* Urgent Banner */}
        {isUrgent && study.aiFindings && (
          <UrgentBanner 
            disease={study.aiFindings.primaryDisease} 
            severity={study.aiFindings.severity} 
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Column - Patient Info & Image Viewer */}
          <div className="xl:col-span-2 space-y-4">
            <PatientInfoPanel study={study} />
            <ImageViewer hasAiFindings={!!study.aiFindings} />
          </div>

          {/* Right Column - AI Panels */}
          <div className="space-y-4">
            <AIDiagnosisPanel 
              findings={study.aiFindings} 
              isAnalyzing={isAnalyzing}
            />
            {study.aiFindings && (
              <>
                <FeedbackCard
                  selection={feedbackChoice}
                  note={feedbackNote}
                  onSelectionChange={setFeedbackChoice}
                  onNoteChange={setFeedbackNote}
                />
                <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Ready to finalize?</p>
                      <p className="text-xs text-muted-foreground">
                        Generate the report after recording your agreement or disagreement.
                      </p>
                    </div>
                    <Button 
                      onClick={handleGenerateReport}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal 
        open={reportModalOpen} 
        onOpenChange={setReportModalOpen}
        study={study}
      />
    </DashboardLayout>
  );
};

export default Viewer;

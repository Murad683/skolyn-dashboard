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

const Viewer = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { studies } = useStudies();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const study = studies.find((s) => s.id === studyId) || studies[0];

  // Simulate analysis on first load
  useEffect(() => {
    if (study?.status === 'New') {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [studyId, study?.status]);

  if (!study) {
    return (
      <DashboardLayout pageTitle="Viewer">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Study not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const isUrgent = study.priority === 'Urgent' && study.aiFindings?.severity === 'High';

  const handleGenerateReport = (feedbackType: 'agree' | 'disagree' | null) => {
    if (feedbackType === 'agree') {
      // Open AI-prefilled report modal
      setReportModalOpen(true);
    } else if (feedbackType === 'disagree') {
      // Navigate to manual report entry page
      navigate(`/report/${study.id}`);
    }
  };

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
              <FeedbackCard onGenerateReport={handleGenerateReport} />
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

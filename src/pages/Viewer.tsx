import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientInfoPanel } from '@/components/viewer/PatientInfoPanel';
import { ImageViewer } from '@/components/viewer/ImageViewer';
import { AIDiagnosisPanel } from '@/components/viewer/AIDiagnosisPanel';
import { XAIInsightsPanel } from '@/components/viewer/XAIInsightsPanel';
import { FeedbackCard } from '@/components/viewer/FeedbackCard';
import { UrgentBanner } from '@/components/viewer/UrgentBanner';
import { ReportModal } from '@/components/viewer/ReportModal';
import { mockStudies } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Viewer = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const study = mockStudies.find((s) => s.id === studyId) || mockStudies[0];
  const studyIndex = mockStudies.findIndex((s) => s.id === study.id);

  // Simulate analysis on first load
  useEffect(() => {
    if (study.status === 'New') {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [studyId, study.status]);

  const isUrgent = study.priority === 'Urgent' && study.aiFindings?.severity === 'High';

  const handleFinalize = () => {
    toast.success('Study marked as Finalized', {
      description: 'Report is ready for distribution.',
    });
  };

  const navigateStudy = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? studyIndex - 1 : studyIndex + 1;
    if (newIndex >= 0 && newIndex < mockStudies.length) {
      navigate(`/viewer/${mockStudies[newIndex].id}`);
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

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-card rounded-xl shadow-soft border border-border/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateStudy('prev')}
                disabled={studyIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {studyIndex + 1} of {mockStudies.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateStudy('next')}
                disabled={studyIndex === mockStudies.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant={study.status === 'Finalized' ? 'finalized' : 'analyzed'}>
              {study.status}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setReportModalOpen(true)}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
            <Button 
              onClick={handleFinalize}
              disabled={study.status === 'Finalized'}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Finalize Study
            </Button>
          </div>
        </div>

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
                <XAIInsightsPanel findings={study.aiFindings} />
                <FeedbackCard />
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

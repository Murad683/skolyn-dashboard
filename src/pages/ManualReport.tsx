import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockStudies } from '@/data/mockData';
import { ArrowLeft, Download, Send, Database, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ManualReport = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const study = mockStudies.find((s) => s.id === studyId) || mockStudies[0];

  const [indication, setIndication] = useState(study.referralReason || '');
  const [technique, setTechnique] = useState(`${study.modality} of the ${study.bodyRegion.toLowerCase()} was performed.`);
  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');

  const handleExport = (type: string) => {
    if (!findings.trim() || !impression.trim()) {
      toast.error('Please complete all required fields');
      return;
    }
    toast.success(`Report ${type}`, {
      description: 'This is a demo action.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout 
      pageTitle="Manual Report Entry"
      breadcrumb={`Study ${study.id}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/viewer/${study.id}`)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Viewer
        </Button>

        {/* Header Card */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Radiology Report</h2>
              <p className="text-sm text-muted-foreground">Manual entry – Radiologist disagrees with AI assessment</p>
            </div>
          </div>

          {/* Patient Info Summary */}
          <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Patient ID:</span>
              <span className="ml-2 font-medium">{study.patientId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="ml-2 font-medium">{study.patientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Age/Gender:</span>
              <span className="ml-2 font-medium">{study.age}y / {study.gender === 'M' ? 'Male' : 'Female'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>
              <span className="ml-2 font-medium">{formatDate(study.dateTime)}</span>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-6 space-y-6">
          {/* Indication / Clinical History */}
          <div>
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Indication / Clinical History
            </label>
            <Textarea
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              placeholder="Enter clinical indication and relevant history..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Technique */}
          <div>
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Technique
            </label>
            <Textarea
              value={technique}
              onChange={(e) => setTechnique(e.target.value)}
              placeholder="Describe imaging technique and parameters..."
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* Findings */}
          <div>
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Findings <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              placeholder="Describe your observations and findings in detail..."
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Impression */}
          <div>
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Impression <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              placeholder="Summarize your diagnostic impression and recommendations..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground italic">
            This report reflects the radiologist's independent interpretation. The AI assessment was reviewed but the radiologist's clinical judgment supersedes the AI findings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 pb-6">
          <Button variant="ghost" onClick={() => navigate(`/viewer/${study.id}`)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleExport('sent to EHR')} className="gap-2">
            <Database className="w-4 h-4" />
            Send to EHR
          </Button>
          <Button variant="secondary" onClick={() => handleExport('sent to PACS')} className="gap-2">
            <Send className="w-4 h-4" />
            Send to PACS
          </Button>
          <Button onClick={() => handleExport('exported as PDF')} className="gap-2">
            <Download className="w-4 h-4" />
            Export as PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManualReport;

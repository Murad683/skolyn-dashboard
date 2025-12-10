import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStudies } from '@/context/StudiesContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, FileText } from 'lucide-react';

const defaultTechnique = 'PA and lateral chest radiograph performed with standard exposure parameters.';

const ReportEntry = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { studies } = useStudies();
  const feedbackNote = (location.state as { feedbackNote?: string } | undefined)?.feedbackNote || '';
  const study = studies.find((s) => s.id === studyId);

  const [indication, setIndication] = useState(study?.referralReason || '');
  const [technique, setTechnique] = useState(defaultTechnique);
  const [findings, setFindings] = useState(feedbackNote || study?.clinicalNotes || '');
  const [impression, setImpression] = useState('');

  useEffect(() => {
    setIndication(study?.referralReason || '');
    setTechnique(defaultTechnique);
    setFindings(feedbackNote || study?.clinicalNotes || '');
    setImpression('');
  }, [study?.id, study?.referralReason, study?.clinicalNotes, feedbackNote]);

  if (!study) {
    return (
      <DashboardLayout pageTitle="Report">
        <div className="bg-card border border-border/30 rounded-xl p-6 shadow-soft">
          <p className="text-foreground font-semibold mb-2">Study not found</p>
          <p className="text-muted-foreground mb-4">Return to Recent Analyses to select a valid study.</p>
          <Button onClick={() => navigate('/')}>Back to Recent Analyses</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = () => {
    toast.success('Manual report drafted', {
      description: `Report for ${study.id} saved for finalization.`,
    });
    navigate(`/viewer/${study.id}`);
  };

  return (
    <DashboardLayout pageTitle="Manual Report" breadcrumb={`Study ${study.id}`}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Manual Report Entry</h2>
              <p className="text-muted-foreground">
                You disagreed with the AI assessment. Complete the standard sections before finalizing.
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/viewer/${study.id}`)}>
              <ArrowLeft className="w-4 h-4" />
              Back to Viewer
            </Button>
          </div>
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
            <p className="text-sm text-foreground font-semibold">Workflow reminder</p>
            <p className="text-sm text-muted-foreground">
              This report will replace the AI draft. Ensure Indication, Technique, Findings, and Impression are filled.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="shadow-soft border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Report Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="indication">Indication / Clinical History</Label>
                <Textarea
                  id="indication"
                  value={indication}
                  onChange={(e) => setIndication(e.target.value)}
                  className="min-h-[90px]"
                  placeholder="Reason for exam, relevant history, presenting symptoms."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technique">Technique</Label>
                <Textarea
                  id="technique"
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Acquisition details, sequences or views obtained."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="findings">Findings</Label>
                <Textarea
                  id="findings"
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="min-h-[140px]"
                  placeholder="Describe pertinent positives and negatives."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impression">Impression</Label>
                <Textarea
                  id="impression"
                  value={impression}
                  onChange={(e) => setImpression(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Concise conclusion, severity, recommendations."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => navigate(`/viewer/${study.id}`)}>
                  Cancel
                </Button>
                <Button className="gap-2" onClick={handleSubmit}>
                  <FileText className="w-4 h-4" />
                  Save Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-soft border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Patient & Study</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-semibold text-foreground">{study.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient ID</p>
                    <p className="font-semibold text-foreground">{study.patientId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Modality</p>
                    <p className="font-semibold text-foreground">{study.modality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Body Region</p>
                    <p className="font-semibold text-foreground">{study.bodyRegion}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
                    <p className="font-semibold text-foreground">{study.priority}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Study Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(study.dateTime).toLocaleString()}
                    </p>
                  </div>
                </div>

                {study.aiFindings && (
                  <div className="border-t border-border pt-3 space-y-2">
                    <p className="text-sm font-semibold text-foreground">AI Assessment for reference</p>
                    <p className="text-sm text-muted-foreground">
                      {study.aiFindings.primaryDisease} • {study.aiFindings.severity} severity •{' '}
                      {study.aiFindings.probability}% probability
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Use only as reference; final report reflects your manual findings.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-soft border-secondary/30 bg-secondary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notes from Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feedbackNote || 'No additional notes were provided when leaving the viewer.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportEntry;

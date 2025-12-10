import { Study } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Download, Send, Database } from 'lucide-react';
import { toast } from 'sonner';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  study: Study;
}

export function ReportModal({ open, onOpenChange, study }: ReportModalProps) {
  const handleExport = (type: string) => {
    toast.success(`Report ${type} initiated`, {
      description: 'This is a demo action.',
    });
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            <DialogTitle>Report Preview</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient & Study Details */}
          <section>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Patient & Study Information
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
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
                <span className="text-muted-foreground">Study Date:</span>
                <span className="ml-2 font-medium">{formatDate(study.dateTime)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Modality:</span>
                <span className="ml-2 font-medium">{study.modality}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Body Region:</span>
                <span className="ml-2 font-medium">{study.bodyRegion}</span>
              </div>
            </div>
          </section>

          {/* AI Findings */}
          {study.aiFindings && (
            <section>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                AI Findings Summary
              </h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{study.aiFindings.primaryDisease}</span>
                  <span className="text-secondary font-bold">{study.aiFindings.probability}% probability</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>
                  <span className="ml-2 font-medium">{study.aiFindings.severity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-medium">{study.aiFindings.confidence}%</span>
                </div>
                {study.aiFindings.secondaryFindings.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Secondary findings:</span>
                    <ul className="mt-1 ml-4 list-disc text-muted-foreground">
                      {study.aiFindings.secondaryFindings.map((finding, index) => (
                        <li key={index}>{finding.name} ({finding.probability}%)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Clinical Notes */}
          <section>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Clinical Notes
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p><strong>Referral Reason:</strong> {study.referralReason}</p>
              <p className="mt-2">{study.clinicalNotes}</p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground italic">
              This report was generated with AI assistance. All findings should be verified by a qualified radiologist. 
              AI predictions are provided for decision support purposes only and do not constitute a diagnosis.
            </p>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
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
      </DialogContent>
    </Dialog>
  );
}

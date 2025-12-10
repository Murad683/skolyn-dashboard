import { Study } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Scan, FileText, AlertCircle, ChevronRight } from 'lucide-react';

interface PatientInfoPanelProps {
  study: Study;
}

export function PatientInfoPanel({ study }: PatientInfoPanelProps) {
  const getQualityVariant = (quality: Study['imageQuality']) => {
    switch (quality) {
      case 'Good': return 'good';
      case 'Moderate': return 'moderate';
      case 'Poor': return 'poor';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Patient & Study Information
        </h3>
        <Badge variant={getQualityVariant(study.imageQuality)}>
          {study.imageQuality} Quality
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Patient Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Patient ID</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{study.patientId}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Name</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{study.patientName}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Demographics</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {study.age} years, {study.gender === 'M' ? 'Male' : 'Female'}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Scan Date</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{formatDate(study.dateTime)}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Scan className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Modality</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{study.modality}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Scan className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Body Region</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{study.bodyRegion}</p>
        </div>

        <div className="col-span-2 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Referral Reason</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{study.referralReason}</p>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Clinical Notes</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-secondary h-6 px-2">
            View full notes <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{study.clinicalNotes}</p>
      </div>

      {/* Previous Diagnoses */}
      {study.previousDiagnoses && study.previousDiagnoses.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <span className="text-xs font-medium text-muted-foreground">Previous Diagnoses:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {study.previousDiagnoses.map((diagnosis, index) => (
              <Badge key={index} variant="neutral">
                {diagnosis}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

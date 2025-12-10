import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UrgentBannerProps {
  disease: string;
  severity: string;
}

export function UrgentBanner({ disease, severity }: UrgentBannerProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Urgent case detected</p>
          <p className="text-sm text-muted-foreground">
            {severity} severity {disease} suspected – requires immediate review
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          View in Worklist
        </Button>
        <Button variant="destructive" size="sm" className="gap-1.5">
          View details <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';

interface UrgentBannerProps {
  disease: string;
  severity: string;
}

export function UrgentBanner({ disease, severity }: UrgentBannerProps) {
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
    </div>
  );
}

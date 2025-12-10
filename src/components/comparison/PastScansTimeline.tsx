import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Activity } from 'lucide-react';

export interface ComparisonScan {
  id: string;
  date: string;
  modality: string;
  bodyRegion: string;
  aiScore?: number;
  disease: string;
}

interface PastScansTimelineProps {
  scans: ComparisonScan[];
  selectedScan: string | null;
  onSelectScan: (id: string) => void;
}

export function PastScansTimeline({ scans, selectedScan, onSelectScan }: PastScansTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const orderedScans = [...scans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 h-full animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-secondary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Scan History
        </h3>
      </div>

      <div className="space-y-2">
        {orderedScans.map((scan, index) => (
          <div
            key={scan.id}
            onClick={() => onSelectScan(scan.id)}
            className={cn(
              "relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
              selectedScan === scan.id
                ? "border-secondary bg-secondary/5"
                : "border-transparent bg-muted/50 hover:bg-muted"
            )}
          >
            {/* Timeline connector */}
            {index < orderedScans.length - 1 && (
              <div className="absolute left-6 top-full w-0.5 h-2 bg-border" />
            )}

            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
                  selectedScan === scan.id ? "bg-secondary" : "bg-muted-foreground/30"
                )} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(scan.date)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {scan.modality} • {scan.bodyRegion}
                  </p>
                </div>
              </div>
              <Badge variant="info" className="text-xs">
                {scan.disease}
              </Badge>
            </div>

            <div className="ml-6 mt-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              {typeof scan.aiScore === 'number' ? (
                <>
                  <span className="text-xs font-semibold text-secondary">
                    {scan.aiScore}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    AI probability
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Not measured</span>
              )}
            </div>

            {/* Score change indicator */}
            {index < orderedScans.length - 1 ? (
              <div className="ml-6 mt-1 text-xs text-muted-foreground">
                {typeof scan.aiScore === 'number' && typeof orderedScans[index + 1].aiScore === 'number'
                  ? `${scan.aiScore >= orderedScans[index + 1].aiScore ? '↑' : '↓'} ${Math.abs(scan.aiScore - orderedScans[index + 1].aiScore)}% from previous`
                  : 'No previous comparison'}
              </div>
            ) : (
              <div className="ml-6 mt-1 text-xs text-muted-foreground">Baseline scan</div>
            )}
          </div>
        ))}
      </div>

      {scans.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No past scans available</p>
        </div>
      )}
    </div>
  );
}

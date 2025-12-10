import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, Contrast } from 'lucide-react';

interface DualViewerProps {
  currentDate: string;
  pastDate?: string;
}

export function DualViewer({ currentDate, pastDate }: DualViewerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderViewer = (label: string, showPathology: boolean = false) => (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden">
      {/* Label */}
      <div className="absolute top-3 left-3 z-10 bg-slate-800/90 px-3 py-1 rounded text-xs text-slate-300">
        {label}
      </div>

      {/* Image */}
      <div className="aspect-[4/5] flex items-center justify-center p-4">
        <svg viewBox="0 0 300 400" className="w-full h-full max-w-[280px]">
          <rect width="300" height="400" fill="#1a1a2e" />
          <ellipse cx="150" cy="180" rx="120" ry="150" fill="none" stroke="#3a3a5e" strokeWidth="2" />
          
          {/* Left lung */}
          <path
            d="M60 100 Q40 200 60 300 Q100 320 130 280 Q140 200 130 120 Q100 80 60 100"
            fill="#2a2a4e"
            stroke="#4a4a6e"
            strokeWidth="1"
          />
          
          {/* Right lung */}
          <path
            d="M240 100 Q260 200 240 300 Q200 320 170 280 Q160 200 170 120 Q200 80 240 100"
            fill="#2a2a4e"
            stroke="#4a4a6e"
            strokeWidth="1"
          />
          
          {/* Heart */}
          <ellipse cx="140" cy="250" rx="45" ry="55" fill="#1a1a3e" stroke="#3a3a5e" strokeWidth="1" />
          
          {/* Spine */}
          <rect x="145" y="80" width="10" height="240" fill="#3a3a5e" rx="5" />
          
          {/* Ribs */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path
              key={i}
              d={`M70 ${110 + i * 25} Q150 ${100 + i * 25} 230 ${110 + i * 25}`}
              fill="none"
              stroke="#3a3a5e"
              strokeWidth="2"
            />
          ))}

          {/* Pathology indicator */}
          {showPathology && (
            <ellipse
              cx="200"
              cy="240"
              rx="35"
              ry="45"
              fill="rgba(255, 100, 0, 0.2)"
              stroke="rgba(255, 100, 0, 0.6)"
              strokeWidth="2"
              strokeDasharray="4,2"
            />
          )}
        </svg>
      </div>

      {/* Mini toolbar */}
      <div className="absolute bottom-3 right-3 flex gap-1 glass-toolbar rounded-lg p-1">
        <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-white hover:bg-white/10">
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-white hover:bg-white/10">
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-white hover:bg-white/10">
          <Move className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-white hover:bg-white/10">
          <Contrast className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Scan */}
        {renderViewer(`Current – ${formatDate(currentDate)}`, true)}

        {/* Past Scan */}
        {pastDate ? (
          renderViewer(`Past – ${formatDate(pastDate)}`, false)
        ) : (
          <div className="bg-muted/50 rounded-lg aspect-[4/5] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a past scan to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}

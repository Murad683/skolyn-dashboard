import { AIFindings } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lightbulb, Eye, Grid3X3, MapPin } from 'lucide-react';

interface XAIInsightsPanelProps {
  findings?: AIFindings;
}

export function XAIInsightsPanel({ findings }: XAIInsightsPanelProps) {
  if (!findings) {
    return null;
  }

  const lungZones = [
    { id: 'right-upper', label: 'RU', name: 'Right Upper' },
    { id: 'left-upper', label: 'LU', name: 'Left Upper' },
    { id: 'right-middle', label: 'RM', name: 'Right Middle' },
    { id: 'left-middle', label: 'LM', name: 'Left Middle' },
    { id: 'right-lower', label: 'RL', name: 'Right Lower' },
    { id: 'left-lower', label: 'LL', name: 'Left Lower' },
  ];

  const isZoneAffected = (zoneName: string) => {
    return findings.affectedZones.some(zone => 
      zoneName.toLowerCase().includes(zone.toLowerCase().replace(' ', '-')) ||
      zone.toLowerCase().includes(zoneName.toLowerCase().split(' ')[0])
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-secondary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          XAI Insights
        </h3>
      </div>

      {/* Contributing Features */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Top Contributing Features
        </p>
        <div className="flex flex-wrap gap-2">
          {findings.contributingFeatures.map((feature, index) => (
            <Badge key={index} variant="info" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      {/* Visualization Thumbnails */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Attention Visualizations
        </p>
        <div className="grid grid-cols-3 gap-2">
          {['Activation Map', 'Saliency Map', 'Attention Map'].map((mapType, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-border/50 transition-all group-hover:border-secondary">
                {/* Simulated visualization thumbnail */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#1a1a2e" />
                  {index === 0 && (
                    <>
                      <circle cx="65" cy="60" r="25" fill="rgba(255,100,0,0.5)" />
                      <circle cx="65" cy="60" r="15" fill="rgba(255,0,0,0.6)" />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <ellipse cx="60" cy="55" rx="30" ry="35" fill="rgba(0,169,157,0.3)" />
                      <ellipse cx="65" cy="60" rx="15" ry="20" fill="rgba(0,169,157,0.6)" />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <circle 
                          key={i} 
                          cx={55 + Math.random() * 30} 
                          cy={50 + Math.random() * 30} 
                          r={3 + Math.random() * 5}
                          fill={`rgba(255,${150 - i * 30},0,${0.4 + i * 0.1})`}
                        />
                      ))}
                    </>
                  )}
                </svg>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1.5">{mapType}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lung Zones Schematic */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Affected Lung Zones
        </p>
        <div className="flex justify-center">
          <div className="relative w-48 h-40">
            {/* Simplified lung diagram */}
            <svg viewBox="0 0 200 160" className="w-full h-full">
              {/* Right lung (viewer's left) */}
              <g transform="translate(20, 10)">
                {/* Upper */}
                <path
                  d="M60 0 Q0 20 10 50 L60 50 Z"
                  className={cn(
                    "transition-all duration-300",
                    isZoneAffected('Right Upper') 
                      ? "fill-secondary/40 stroke-secondary" 
                      : "fill-muted/30 stroke-border"
                  )}
                  strokeWidth="2"
                />
                {/* Middle */}
                <path
                  d="M10 50 Q0 70 10 90 L60 90 L60 50 Z"
                  className={cn(
                    "transition-all duration-300",
                    isZoneAffected('Right Middle') 
                      ? "fill-secondary/40 stroke-secondary" 
                      : "fill-muted/30 stroke-border"
                  )}
                  strokeWidth="2"
                />
                {/* Lower */}
                <path
                  d="M10 90 Q0 120 30 140 Q60 140 60 90 Z"
                  className={cn(
                    "transition-all duration-300",
                    isZoneAffected('Right Lower') 
                      ? "fill-destructive/40 stroke-destructive" 
                      : "fill-muted/30 stroke-border"
                  )}
                  strokeWidth="2"
                />
              </g>

              {/* Left lung (viewer's right) */}
              <g transform="translate(110, 10)">
                {/* Upper */}
                <path
                  d="M10 0 Q70 20 60 50 L10 50 Z"
                  className={cn(
                    "transition-all duration-300",
                    isZoneAffected('Left Upper') 
                      ? "fill-secondary/40 stroke-secondary" 
                      : "fill-muted/30 stroke-border"
                  )}
                  strokeWidth="2"
                />
                {/* Middle */}
                <path
                  d="M60 50 Q70 70 60 90 L10 90 L10 50 Z"
                  className={cn(
                    "transition-all duration-300",
                    isZoneAffected('Left Middle') 
                      ? "fill-secondary/40 stroke-secondary" 
                      : "fill-muted/30 stroke-border"
                  )}
                  strokeWidth="2"
                />
                {/* Lower */}
                <path
                  d="M60 90 Q70 120 40 140 Q10 140 10 90 Z"
                  className={cn(
                    "transition-all duration-300",
                    isZoneAffected('Left Lower') 
                      ? "fill-secondary/40 stroke-secondary" 
                      : "fill-muted/30 stroke-border"
                  )}
                  strokeWidth="2"
                />
              </g>

              {/* Labels */}
              <text x="50" y="35" className="fill-muted-foreground text-[8px] font-medium">RU</text>
              <text x="50" y="75" className="fill-muted-foreground text-[8px] font-medium">RM</text>
              <text x="50" y="120" className={cn("text-[8px] font-medium", isZoneAffected('Right Lower') ? "fill-destructive" : "fill-muted-foreground")}>RL</text>
              <text x="140" y="35" className="fill-muted-foreground text-[8px] font-medium">LU</text>
              <text x="140" y="75" className="fill-muted-foreground text-[8px] font-medium">LM</text>
              <text x="140" y="120" className="fill-muted-foreground text-[8px] font-medium">LL</text>
            </svg>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive/40 border border-destructive" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-secondary/40 border border-secondary" />
            <span className="text-xs text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted/30 border border-border" />
            <span className="text-xs text-muted-foreground">Normal</span>
          </div>
        </div>
      </div>

      {/* Text Explanation */}
      <div className="border-t border-border pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Why the AI thinks this is {findings.primaryDisease}
        </p>
        <ul className="space-y-2">
          {findings.explanations.map((explanation, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-secondary flex-shrink-0" />
              <span>{explanation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

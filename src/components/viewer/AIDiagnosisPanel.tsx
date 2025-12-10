import { useState, useEffect } from 'react';
import { AIFindings } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Brain, AlertTriangle, Info, Sparkles } from 'lucide-react';

interface AIDiagnosisPanelProps {
  findings?: AIFindings;
  isAnalyzing?: boolean;
}

export function AIDiagnosisPanel({ findings, isAnalyzing = false }: AIDiagnosisPanelProps) {
  const [showContent, setShowContent] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      setShowContent(false);
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowContent(true);
            return 100;
          }
          return prev + 3;
        });
      }, 50);
      return () => clearInterval(interval);
    } else if (findings) {
      setShowContent(true);
    }
  }, [isAnalyzing, findings]);

  const getSeverityVariant = (severity?: string) => {
    switch (severity) {
      case 'Low': return 'low';
      case 'Medium': return 'medium';
      case 'High': return 'high';
      default: return 'neutral';
    }
  };

  if (isAnalyzing && analysisProgress < 100) {
    return (
      <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-secondary animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            AI Assessment
          </h3>
        </div>

        <div className="py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mb-4">
            Analyzing image across 127 indicators...
          </p>
          
          <div className="max-w-xs mx-auto">
            <Progress value={analysisProgress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground mt-2">
              {analysisProgress}% complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!findings || !showContent) {
    return (
      <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            AI Assessment
          </h3>
        </div>
        <div className="py-8 text-center">
          <Info className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No AI analysis available for this study
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-slide-in-right">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-secondary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          AI Assessment
        </h3>
      </div>

      {/* Primary Disease */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Primary Finding</p>
            <h4 className="text-xl font-bold text-foreground">{findings.primaryDisease}</h4>
          </div>
          <Badge variant={getSeverityVariant(findings.severity)} className="text-xs">
            {findings.severity} Severity
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Probability</span>
              <span className="text-2xl font-bold text-secondary">{findings.probability}%</span>
            </div>
            <Progress value={findings.probability} className="h-3" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                  style={{ width: `${findings.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{findings.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Findings */}
      {findings.secondaryFindings.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Secondary Findings
          </p>
          <div className="space-y-2">
            {findings.secondaryFindings.map((finding, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{finding.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary/60 rounded-full"
                      style={{ width: `${finding.probability}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {finding.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Summary */}
      <div className="border-t border-border pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Model Explanation (Summary)
        </p>
        <ul className="space-y-2">
          {findings.explanations.slice(0, 3).map((explanation, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
              <span>{explanation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

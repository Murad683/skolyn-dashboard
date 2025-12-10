import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  className?: string;
}

export function KPICard({ title, value, change, changeLabel = 'vs last period', icon, className }: KPICardProps) {
  const getTrendIcon = () => {
    if (!change || change === 0) return <Minus className="w-3.5 h-3.5" />;
    return change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (!change || change === 0) return 'text-muted-foreground';
    return change > 0 ? 'text-success' : 'text-destructive';
  };

  return (
    <div className={cn("bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        
        {change !== undefined && (
          <div className={cn("flex items-center gap-1", getTrendColor())}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      
      {changeLabel && change !== undefined && (
        <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>
      )}
    </div>
  );
}

import { PastScan } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressionChartProps {
  scans: PastScan[];
  currentScore: number;
}

export function ProgressionChart({ scans, currentScore }: ProgressionChartProps) {
  // Prepare data for chart (reverse to show oldest first)
  const chartData = [...scans].reverse().map(scan => ({
    date: new Date(scan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: scan.aiScore,
  }));

  // Add current
  chartData.push({
    date: 'Current',
    score: currentScore,
  });

  // Calculate trend
  const firstScore = scans[scans.length - 1]?.aiScore || currentScore;
  const trend = currentScore - firstScore;
  const trendLabel = trend < -10 ? 'Improving' : trend > 10 ? 'Worsening' : 'Stable';

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Disease Progression
        </h3>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
          trendLabel === 'Improving' && "bg-success/10 text-success",
          trendLabel === 'Worsening' && "bg-destructive/10 text-destructive",
          trendLabel === 'Stable' && "bg-muted text-muted-foreground"
        )}>
          {trendLabel === 'Improving' && <TrendingDown className="w-4 h-4" />}
          {trendLabel === 'Worsening' && <TrendingUp className="w-4 h-4" />}
          {trendLabel === 'Stable' && <Minus className="w-4 h-4" />}
          <span>Trend: {trendLabel}</span>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-medium p-3">
                      <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                      <p className="text-sm font-semibold text-secondary">
                        AI Score: {payload[0].value}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#00A99D"
              strokeWidth={2}
              dot={{ fill: '#00A99D', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#00A99D', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          {trendLabel === 'Improving' && 'AI scores show consistent improvement over the monitoring period.'}
          {trendLabel === 'Worsening' && 'AI scores indicate potential disease progression. Consider clinical correlation.'}
          {trendLabel === 'Stable' && 'AI scores remain relatively stable across scans.'}
        </p>
      </div>
    </div>
  );
}

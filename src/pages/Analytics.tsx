import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/analytics/KPICard';
import { useStudies } from '@/context/StudiesContext';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, TooltipProps 
} from 'recharts';
import { Activity, Users, CheckCircle, TrendingUp, BarChart3, Upload, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays, subMonths, isAfter, startOfMonth, endOfMonth } from 'date-fns';

type DateRange = '30d' | '6m' | '12m';

interface MonthlyData {
  month: string;
  monthKey: string;
  total: number;
  agree: number;
  disagree: number;
  agreePercent: number;
  disagreePercent: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as MonthlyData;
    return (
      <div className="bg-card border border-border rounded-lg shadow-medium p-3 min-w-[180px]">
        <p className="text-sm font-semibold text-foreground mb-2">{data.month}</p>
        <p className="text-xs text-muted-foreground">Total Scans (N): {data.total}</p>
        <div className="mt-1 space-y-1">
          <p className="text-xs">
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: '#00A99D' }} />
            Agree: {data.agree} ({data.agreePercent.toFixed(1)}%)
          </p>
          <p className="text-xs">
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: '#030F4F' }} />
            Disagree: {data.disagree} ({data.disagreePercent.toFixed(1)}%)
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const navigate = useNavigate();
  const { studies } = useStudies();
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  // Filter studies by date range
  const filteredStudies = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (dateRange) {
      case '30d':
        cutoffDate = subDays(now, 30);
        break;
      case '6m':
        cutoffDate = subMonths(now, 6);
        break;
      case '12m':
        cutoffDate = subMonths(now, 12);
        break;
      default:
        cutoffDate = subDays(now, 30);
    }
    
    return studies.filter(s => isAfter(new Date(s.dateTime), cutoffDate));
  }, [studies, dateRange]);

  // Calculate analytics from filtered studies
  const analyzedStudies = filteredStudies.filter(s => s.aiFindings);
  const totalScans = filteredStudies.length;
  const aiUsageRate = totalScans > 0 ? Math.round((analyzedStudies.length / totalScans) * 100) : 0;
  const urgentCount = filteredStudies.filter(s => s.priority === 'Urgent').length;

  // Calculate disease distribution
  const diseaseMap = new Map<string, number>();
  analyzedStudies.forEach(s => {
    if (s.aiFindings?.primaryDisease) {
      const disease = s.aiFindings.primaryDisease;
      diseaseMap.set(disease, (diseaseMap.get(disease) || 0) + 1);
    }
  });
  
  const diseaseColors: Record<string, string> = {
    'Pneumonia': '#030F4F',
    'Normal': '#00A99D',
    'Cardiomegaly': '#6366F1',
    'Pleural Effusion': '#8B5CF6',
    'Tuberculosis': '#EC4899',
    'Other': '#94A3B8',
  };
  
  const diseaseDistribution = Array.from(diseaseMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: diseaseColors[name] || diseaseColors['Other'],
  }));

  const topDisease = diseaseDistribution.length > 0 
    ? [...diseaseDistribution].sort((a, b) => b.value - a.value)[0].name 
    : 'N/A';

  // Calculate monthly agreement trend data
  const agreementTrendData = useMemo(() => {
    if (filteredStudies.length === 0) return [];

    const monthlyMap = new Map<string, { total: number; agree: number; disagree: number }>();
    
    filteredStudies.forEach(study => {
      const date = new Date(study.dateTime);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM yyyy');
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { total: 0, agree: 0, disagree: 0 });
      }
      
      const data = monthlyMap.get(monthKey)!;
      data.total++;
      
      // For this mock, we consider "analyzed" as "agree" and "not analyzed" as "disagree"
      // In a real app, this would be based on radiologist feedback
      if (study.aiFindings) {
        data.agree++;
      } else {
        data.disagree++;
      }
    });

    // Convert to array and sort by date
    const result: MonthlyData[] = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const agreePercent = data.total > 0 ? (data.agree / data.total) * 100 : 0;
        const disagreePercent = data.total > 0 ? (data.disagree / data.total) * 100 : 0;
        
        return {
          month: format(new Date(monthKey + '-01'), 'MMM'),
          monthKey,
          total: data.total,
          agree: data.agree,
          disagree: data.disagree,
          agreePercent: Math.min(agreePercent, 100), // Cap at 100
          disagreePercent: Math.min(disagreePercent, 100), // Cap at 100
        };
      })
      .filter(d => d.total > 0); // Only include months with data

    return result;
  }, [filteredStudies]);

  // Empty state
  if (studies.length === 0) {
    return (
      <DashboardLayout pageTitle="Analytics">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No data yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Analytics will populate as you analyze medical images. Start by uploading your first study.
          </p>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Upload className="w-4 h-4" />
            Start New Analysis
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const dateRangeLabel = {
    '30d': 'Last 30 days',
    '6m': 'Last 6 months',
    '12m': 'Last 12 months',
  };

  return (
    <DashboardLayout pageTitle="Analytics">
      <div className="space-y-6">
        {/* Date Range Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Showing data for:</span>
          </div>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Scans"
            value={totalScans.toLocaleString()}
            icon={<Activity className="w-5 h-5" />}
          />
          <KPICard
            title="AI Analyzed"
            value={analyzedStudies.length.toString()}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            title="Urgent Cases"
            value={urgentCount.toString()}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <KPICard
            title="Top Disease"
            value={topDisease}
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disease Distribution */}
          {diseaseDistribution.length > 0 && (
            <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Disease Distribution
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {diseaseDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Modality Distribution */}
          <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Modality Distribution
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'X-ray', count: filteredStudies.filter(s => s.modality === 'X-ray').length },
                  { name: 'CT', count: filteredStudies.filter(s => s.modality === 'CT').length },
                  { name: 'MRI', count: filteredStudies.filter(s => s.modality === 'MRI').length },
                ].filter(d => d.count > 0)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Count" fill="#00A99D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Agreement Trend - Stacked Percentage Bar */}
        {agreementTrendData.length > 0 && (
          <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Radiologist–AI Agreement Trend
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={agreementTrendData} 
                  margin={{ top: 25, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(v) => `${v}%`}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                  <Bar 
                    dataKey="agreePercent" 
                    name="Agree" 
                    stackId="agreement" 
                    fill="#00A99D" 
                    radius={[0, 0, 0, 0]}
                    label={({ x, y, width, index }) => {
                      const data = agreementTrendData[index as number];
                      if (!data || x === undefined || y === undefined || width === undefined) return null;
                      return (
                        <text 
                          x={(x as number) + (width as number) / 2} 
                          y={(y as number) - 8} 
                          fill="#64748b" 
                          textAnchor="middle" 
                          fontSize={11}
                        >
                          N = {data.total}
                        </text>
                      );
                    }}
                  />
                  <Bar 
                    dataKey="disagreePercent" 
                    name="Disagree" 
                    stackId="agreement" 
                    fill="#030F4F" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Stacked bars show the percentage of radiologist agreement vs. disagreement per month
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;

import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/analytics/KPICard';
import { useStudies } from '@/context/StudiesContext';
import { Study } from '@/data/mockData';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { Activity, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

type RangeOption = '30d' | '6m' | '12m';

const Analytics = () => {
  const { studies } = useStudies();
  const [range, setRange] = useState<RangeOption>('30d');

  const rangeLabel = useMemo(() => {
    if (range === '30d') return 'last 30 days';
    if (range === '6m') return 'last 6 months';
    return 'last 12 months';
  }, [range]);

  const filteredStudies = useMemo(() => {
    const now = new Date();
    return studies.filter((study) => {
      const studyDate = new Date(study.dateTime);
      if (range === '30d') {
        const diff = (now.getTime() - studyDate.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      }
      const monthsDiff = (now.getFullYear() - studyDate.getFullYear()) * 12 + (now.getMonth() - studyDate.getMonth());
      return monthsDiff < (range === '6m' ? 6 : 12);
    });
  }, [studies, range]);

  const monthlyGroups = useMemo(() => {
    const groups: Record<string, { date: Date; scans: Study[] }> = {};
    filteredStudies.forEach((study) => {
      const monthKey = format(new Date(study.dateTime), 'yyyy-MM-01');
      if (!groups[monthKey]) {
        groups[monthKey] = { date: new Date(monthKey), scans: [] };
      }
      groups[monthKey].scans.push(study);
    });
    return Object.values(groups).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredStudies]);

  const agreementData = useMemo(() => {
    return monthlyGroups
      .map(({ date, scans }) => {
        const totalScans = scans.length;
        if (totalScans === 0) return null;
        let agreeCount = 0;
        let disagreeCount = 0;

        scans.forEach((s) => {
          const ai = s.aiFindings;
          if (ai && ai.probability >= 70) {
            agreeCount += 1;
          } else {
            disagreeCount += 1;
          }
        });

        const totalForPct = Math.max(agreeCount + disagreeCount, totalScans);
        const agreePct = totalForPct ? Math.min(100, (agreeCount / totalForPct) * 100) : 0;
        const disagreePct = totalForPct ? Math.max(0, 100 - agreePct) : 0;

        return {
          month: format(date, 'MMM'),
          totalScans,
          agreeCount,
          disagreeCount,
          agreePct,
          disagreePct,
        };
      })
      .filter(Boolean) as {
        month: string;
        totalScans: number;
        agreeCount: number;
        disagreeCount: number;
        agreePct: number;
        disagreePct: number;
      }[];
  }, [monthlyGroups]);

  const totalScans = filteredStudies.length;
  const aiUsedCount = filteredStudies.filter((s) => s.aiFindings).length;
  const agreeCount = agreementData.reduce((sum, m) => sum + m.agreeCount, 0);
  const disagreeCount = agreementData.reduce((sum, m) => sum + m.disagreeCount, 0);
  const aiUsageRate = totalScans ? Math.round((aiUsedCount / totalScans) * 1000) / 10 : 0;
  const agreementRate = agreeCount + disagreeCount ? Math.round((agreeCount / (agreeCount + disagreeCount)) * 1000) / 10 : 0;

  const topDisease = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudies.forEach((s) => {
      const disease = s.aiFindings?.primaryDisease || 'Normal';
      counts[disease] = (counts[disease] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'N/A';
  }, [filteredStudies]);

  const accuracyOverTime = useMemo(() => {
    return monthlyGroups.map(({ date, scans }) => {
      const withAI = scans.filter((s) => s.aiFindings);
      const average = withAI.length
        ? withAI.reduce((sum, s) => sum + (s.aiFindings?.confidence || 0), 0) / withAI.length
        : 0;
      return {
        month: format(date, 'MMM'),
        accuracy: Math.round(average * 10) / 10,
      };
    });
  }, [monthlyGroups]);

  const diseaseDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudies.forEach((s) => {
      const disease = s.aiFindings?.primaryDisease || 'Normal';
      counts[disease] = (counts[disease] || 0) + 1;
    });
    const palette = ['#030F4F', '#00A99D', '#6366F1', '#8B5CF6', '#EC4899', '#94A3B8'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: palette[idx % palette.length],
    }));
  }, [filteredStudies]);

  return (
    <DashboardLayout pageTitle="Analytics">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Select value={range} onValueChange={(val: RangeOption) => setRange(val)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select range" />
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
            title="Total Scans Analyzed"
            value={totalScans.toLocaleString()}
            change={0}
            changeLabel={`vs ${rangeLabel}`}
            icon={<Activity className="w-5 h-5" />}
          />
          <KPICard
            title="AI Usage Rate"
            value={`${aiUsageRate}%`}
            change={0}
            changeLabel={`vs ${rangeLabel}`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            title="Agreement Rate"
            value={`${agreementRate || 0}%`}
            change={0}
            changeLabel={`vs ${rangeLabel}`}
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
          {/* Accuracy Over Time */}
          <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Model Accuracy Over Time
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyOverTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#00A99D" strokeWidth={2} dot={{ fill: '#00A99D' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disease Distribution */}
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
        </div>

        {/* Agreement Trend */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Radiologist–AI Agreement Trend
          </h3>
          <div className="h-[250px]">
            {agreementData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data for the selected period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agreementData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const agreePctLabel = data.totalScans ? ((data.agreeCount / data.totalScans) * 100).toFixed(1) : '0';
                        const disagreePctLabel = data.totalScans ? ((data.disagreeCount / data.totalScans) * 100).toFixed(1) : '0';
                        return (
                          <div className="bg-card border border-border rounded-lg shadow-medium p-3">
                            <p className="text-xs text-muted-foreground">Month: {data.month}</p>
                            <p className="text-sm text-foreground">Total scans: {data.totalScans}</p>
                            <p className="text-sm text-secondary">
                              Agree: {data.agreeCount} ({agreePctLabel}%)
                            </p>
                            <p className="text-sm text-primary">
                              Disagree: {data.disagreeCount} ({disagreePctLabel}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="agreePct" name="Agree" stackId="a" fill="#00A99D" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="totalScans"
                      position="top"
                      formatter={(value: number) => `N = ${value}`}
                      className="text-xs fill-muted-foreground"
                    />
                  </Bar>
                  <Bar dataKey="disagreePct" name="Disagree" stackId="a" fill="#030F4F" radius={[0, 0, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;

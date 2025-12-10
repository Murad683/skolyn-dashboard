import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/analytics/KPICard';
import { mockAnalytics } from '@/data/mockData';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Users, CheckCircle, TrendingUp } from 'lucide-react';

const Analytics = () => {
  return (
    <DashboardLayout pageTitle="Analytics">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Scans Analyzed"
            value={mockAnalytics.totalScans.toLocaleString()}
            change={mockAnalytics.scansChange}
            changeLabel="vs last 30 days"
            icon={<Activity className="w-5 h-5" />}
          />
          <KPICard
            title="AI Usage Rate"
            value={`${mockAnalytics.aiUsageRate}%`}
            change={mockAnalytics.aiUsageChange}
            changeLabel="vs last 30 days"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            title="Agreement Rate"
            value={`${mockAnalytics.agreementRate}%`}
            change={mockAnalytics.agreementChange}
            changeLabel="vs last 30 days"
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <KPICard
            title="Top Disease"
            value={mockAnalytics.topDisease}
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
                <LineChart data={mockAnalytics.accuracyOverTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
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
                    data={mockAnalytics.diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mockAnalytics.diseaseDistribution.map((entry, index) => (
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.agreementTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="agree" name="Agree" fill="#00A99D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disagree" name="Disagree" fill="#030F4F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;

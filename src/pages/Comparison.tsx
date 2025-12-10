import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PastScansTimeline } from '@/components/comparison/PastScansTimeline';
import { DualViewer } from '@/components/comparison/DualViewer';
import { ProgressionChart } from '@/components/comparison/ProgressionChart';
import { mockPastScans, mockStudies } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';

const Comparison = () => {
  const [selectedScan, setSelectedScan] = useState<string | null>(mockPastScans[0]?.id || null);
  
  // Use the first study with AI findings as the "current" study
  const currentStudy = mockStudies.find(s => s.aiFindings) || mockStudies[0];
  const selectedPastScan = mockPastScans.find(s => s.id === selectedScan);

  return (
    <DashboardLayout pageTitle="Comparison">
      <div className="space-y-6">
        {/* Patient Context Header */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Patient:</span>
              <span className="text-sm font-semibold text-foreground">{currentStudy.patientName}</span>
              <Badge variant="neutral">{currentStudy.patientId}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {mockPastScans.length + 1} scans on record
              </span>
            </div>
            {currentStudy.aiFindings && (
              <Badge variant="info">
                Current: {currentStudy.aiFindings.primaryDisease} ({currentStudy.aiFindings.probability}%)
              </Badge>
            )}
          </div>
        </div>

        {/* Main Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Past Scans Timeline */}
          <div className="lg:col-span-1">
            <PastScansTimeline
              scans={mockPastScans}
              selectedScan={selectedScan}
              onSelectScan={setSelectedScan}
            />
          </div>

          {/* Dual Viewer & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <DualViewer
              currentDate={currentStudy.dateTime}
              pastDate={selectedPastScan?.date}
            />
            <ProgressionChart
              scans={mockPastScans}
              currentScore={currentStudy.aiFindings?.probability || 0}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Comparison;

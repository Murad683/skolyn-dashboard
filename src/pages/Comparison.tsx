import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PastScansTimeline, ComparisonScan } from '@/components/comparison/PastScansTimeline';
import { DualViewer } from '@/components/comparison/DualViewer';
import { ProgressionChart } from '@/components/comparison/ProgressionChart';
import { useStudies } from '@/context/StudiesContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User, Calendar, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Comparison = () => {
  const { studies } = useStudies();
  const [searchTerm, setSearchTerm] = useState('');
  const patients = useMemo(() => {
    const seen: Record<string, { name: string; id: string }> = {};
    studies.forEach((s) => {
      if (!seen[s.patientId]) {
        seen[s.patientId] = { name: s.patientName, id: s.patientId };
      }
    });
    return Object.values(seen);
  }, [studies]);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(filteredPatients[0]?.id || patients[0]?.id || null);

  const firstAvailable = filteredPatients[0]?.id || patients[0]?.id || null;

  useEffect(() => {
    if (!selectedPatientId && firstAvailable) {
      setSelectedPatientId(firstAvailable);
    }
  }, [firstAvailable, selectedPatientId]);

  const patientStudies = useMemo(() => {
    if (!selectedPatientId) return [];
    return studies
      .filter((s) => s.patientId === selectedPatientId)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [studies, selectedPatientId]);

  const examType = patientStudies[patientStudies.length - 1]
    ? {
        modality: patientStudies[patientStudies.length - 1].modality,
        bodyRegion: patientStudies[patientStudies.length - 1].bodyRegion,
      }
    : null;

  const getDiseaseScore = (studyId: string, disease: string | null) => {
    if (!disease) return undefined;
    const study = studies.find((s) => s.id === studyId);
    if (!study?.aiFindings) return undefined;
    if (study.aiFindings.primaryDisease === disease) return study.aiFindings.probability;
    const secondary = study.aiFindings.secondaryFindings.find((sf) => sf.name === disease);
    return secondary?.probability;
  };

  const availableDiseases = useMemo(() => {
    if (!examType) return [];
    const set = new Set<string>();
    patientStudies
      .filter((s) => s.modality === examType.modality && s.bodyRegion === examType.bodyRegion)
      .forEach((s) => {
        if (s.aiFindings?.primaryDisease && s.aiFindings.probability !== undefined && s.aiFindings.probability !== null) {
          set.add(s.aiFindings.primaryDisease);
        }
        s.aiFindings?.secondaryFindings.forEach((sf) => {
          if (sf.probability !== undefined && sf.probability !== null) {
            set.add(sf.name);
          }
        });
      });
    return Array.from(set).sort();
  }, [patientStudies, examType]);

  const defaultDisease = useMemo(() => {
    const latest = patientStudies[patientStudies.length - 1];
    if (latest?.aiFindings?.primaryDisease) return latest.aiFindings.primaryDisease;
    return availableDiseases[0] || null;
  }, [patientStudies, availableDiseases]);

  const [selectedDisease, setSelectedDisease] = useState<string | null>(defaultDisease);

  useEffect(() => {
    if (defaultDisease) setSelectedDisease(defaultDisease);
    else setSelectedDisease(null);
  }, [defaultDisease, selectedPatientId, availableDiseases.length]);

  useEffect(() => {
    if (selectedDisease && !availableDiseases.includes(selectedDisease)) {
      setSelectedDisease(availableDiseases[0] || null);
    }
  }, [availableDiseases, selectedDisease]);

  const comparisonScans: ComparisonScan[] = useMemo(() => {
    if (!examType || !selectedDisease) return [];
    return patientStudies
      .filter(
        (s) =>
          s.modality === examType.modality &&
          s.bodyRegion === examType.bodyRegion
      )
      .map((s) => {
        const score = getDiseaseScore(s.id, selectedDisease);
        return {
          id: s.id,
          date: s.dateTime,
          modality: s.modality,
          bodyRegion: s.bodyRegion,
          aiScore: score,
          disease: selectedDisease,
        };
      })
      .filter((scan) => typeof scan.aiScore === 'number')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [examType, patientStudies, selectedDisease]);

  const latestScan = comparisonScans[comparisonScans.length - 1];
  const defaultPrevious = comparisonScans.length >= 2 ? comparisonScans[comparisonScans.length - 2] : undefined;

  const [selectedPastScanId, setSelectedPastScanId] = useState<string | null>(latestScan?.id || null);
  const selectedPast = comparisonScans.find((scan) => scan.id === selectedPastScanId && scan.id !== latestScan?.id);
  const previousScan = selectedPast || defaultPrevious;

  useEffect(() => {
    setSelectedPastScanId(latestScan?.id || null);
  }, [selectedPatientId, comparisonScans.length, latestScan?.id, selectedDisease]);

  const currentStudy = studies.find((s) => s.id === latestScan?.id) || patientStudies[patientStudies.length - 1];
  const latestScoreDisplay = typeof latestScan?.aiScore === 'number' ? `${latestScan.aiScore}%` : '—';

  if (!patientStudies.length || !examType || availableDiseases.length === 0) {
    return (
      <DashboardLayout pageTitle="Comparison">
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-6 text-center text-muted-foreground">
          <p>No analyses available yet. Upload a study on the Analyze page to start using Comparison.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Comparison">
      <div className="space-y-6">
        {/* Patient Context Header */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4">
          <div className="flex flex-col gap-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              {searchTerm.length >= 2 && filteredPatients.length > 0 && (
                <div className="absolute mt-1 w-full bg-card border border-border/60 rounded-lg shadow-lg z-10">
                  {filteredPatients.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setSearchTerm(`${p.name} (${p.id})`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                    >
                      {p.name} • {p.id}
                    </button>
                  ))}
                </div>
              )}
            </div>

              <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Patient:</span>
                <span className="text-sm font-semibold text-foreground">
                  {currentStudy?.patientName || 'Select a patient'}
                </span>
                {currentStudy && <Badge variant="neutral">{currentStudy.patientId}</Badge>}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {comparisonScans.length} scans on record
                </span>
              </div>
              {availableDiseases.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Disease focus:</span>
                  <Select
                    value={selectedDisease || undefined}
                    onValueChange={(val) => setSelectedDisease(val)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select disease" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDiseases.map((disease) => (
                        <SelectItem key={disease} value={disease}>
                          {disease}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {currentStudy?.aiFindings && (
                <Badge variant="info">
                  Current: {selectedDisease} ({latestScoreDisplay})
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Past Scans Timeline */}
          <div className="lg:col-span-1">
            <PastScansTimeline
              scans={comparisonScans}
              selectedScan={selectedPastScanId}
              onSelectScan={(id) => setSelectedPastScanId(id)}
            />
          </div>

          {/* Dual Viewer & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {latestScan ? (
              <DualViewer
                currentDate={latestScan.date}
                pastDate={previousScan?.date}
                diseaseName={selectedDisease}
                currentScore={latestScan.aiScore}
                pastScore={previousScan?.aiScore}
                showSingleNote={!previousScan}
              />
            ) : (
              <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4 text-muted-foreground">
                Select a patient with available scans to view comparison.
              </div>
            )}
            <ProgressionChart
              scans={comparisonScans}
              diseaseName={selectedDisease}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Comparison;

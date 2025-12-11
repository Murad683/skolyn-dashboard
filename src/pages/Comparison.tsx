import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DualViewer } from '@/components/comparison/DualViewer';
import { ProgressionChart } from '@/components/comparison/ProgressionChart';
import { useStudies } from '@/context/StudiesContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Upload, GitCompare, Activity, Search } from 'lucide-react';
import { PastScan } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Helper to extract disease score from a study's aiFindings
const getDiseaseScore = (study: { aiFindings?: { primaryDisease?: string; probability?: number; secondaryFindings?: Array<{ name: string; probability: number }> } }, disease: string): number | null => {
  if (!study.aiFindings) return null;
  
  // Check primary disease
  if (study.aiFindings.primaryDisease === disease) {
    return study.aiFindings.probability;
  }
  
  // Check secondary findings
  const secondary = study.aiFindings.secondaryFindings?.find(
    f => f.name.toLowerCase() === disease.toLowerCase()
  );
  if (secondary) {
    return secondary.probability;
  }
  
  return null;
};

const Comparison = () => {
  const navigate = useNavigate();
  const { studies } = useStudies();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string>('');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  // Get all analyzed studies sorted by date (newest first)
  const analyzedStudies = useMemo(() => {
    return studies
      .filter(s => s.aiFindings)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [studies]);

  // Get unique patients from analyzed studies
  const uniquePatients = useMemo(() => {
    const patientsMap = new Map<string, { patientId: string; patientName: string; latestDate: string }>();
    analyzedStudies.forEach(s => {
      if (!patientsMap.has(s.patientId)) {
        patientsMap.set(s.patientId, {
          patientId: s.patientId,
          patientName: s.patientName,
          latestDate: s.dateTime,
        });
      }
    });
    return Array.from(patientsMap.values());
  }, [analyzedStudies]);

  // Filter patients by search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return uniquePatients;
    const query = searchQuery.toLowerCase();
    return uniquePatients.filter(
      p => p.patientName.toLowerCase().includes(query) || p.patientId.toLowerCase().includes(query)
    );
  }, [uniquePatients, searchQuery]);

  // Default to patient with most recent analysis
  useEffect(() => {
    if (uniquePatients.length > 0 && !selectedPatientId) {
      // Find patient with the most recent study
      const latestPatient = uniquePatients.reduce((latest, current) => 
        new Date(current.latestDate) > new Date(latest.latestDate) ? current : latest
      );
      setSelectedPatientId(latestPatient.patientId);
    }
  }, [uniquePatients, selectedPatientId]);

  // Get studies for the selected patient
  const patientStudies = useMemo(() => {
    if (!selectedPatientId) return [];
    return analyzedStudies.filter(s => s.patientId === selectedPatientId);
  }, [analyzedStudies, selectedPatientId]);

  // Get unique diseases for the selected patient
  const availableDiseases = useMemo(() => {
    const diseases = new Set<string>();
    patientStudies.forEach(s => {
      if (s.aiFindings?.primaryDisease) {
        diseases.add(s.aiFindings.primaryDisease);
      }
      s.aiFindings?.secondaryFindings?.forEach(f => {
        if (f.probability > 0) {
          diseases.add(f.name);
        }
      });
    });
    return Array.from(diseases).sort();
  }, [patientStudies]);

  // Reset disease selection when patient changes
  useEffect(() => {
    if (patientStudies.length > 0) {
      const latestDisease = patientStudies[0]?.aiFindings?.primaryDisease;
      if (latestDisease) {
        setSelectedDisease(latestDisease);
      } else if (availableDiseases.length > 0) {
        setSelectedDisease(availableDiseases[0]);
      }
    }
  }, [selectedPatientId, patientStudies, availableDiseases]);

  // Filter studies that have a score for the selected disease
  const filteredStudies = useMemo(() => {
    if (!selectedDisease) return patientStudies;
    return patientStudies.filter(s => {
      const score = getDiseaseScore(s, selectedDisease);
      return score !== null && score > 0;
    });
  }, [patientStudies, selectedDisease]);

  // Convert filtered studies to scan history format with disease-specific scores
  const scanHistory: PastScan[] = useMemo(() => {
    return filteredStudies.map(s => {
      const score = getDiseaseScore(s, selectedDisease) || 0;
      const severity: 'Low' | 'Medium' | 'High' = score > 85 ? 'High' : score > 70 ? 'Medium' : 'Low';
      
      return {
        id: s.id,
        date: s.dateTime.split('T')[0],
        modality: s.modality,
        aiScore: score,
        disease: selectedDisease || s.aiFindings?.primaryDisease || 'Unknown',
        severity,
      };
    });
  }, [filteredStudies, selectedDisease]);

  // Default to latest scan
  useEffect(() => {
    if (scanHistory.length > 0 && !selectedScanId) {
      setSelectedScanId(scanHistory[0].id);
    } else if (scanHistory.length > 0 && !scanHistory.find(s => s.id === selectedScanId)) {
      setSelectedScanId(scanHistory[0].id);
    }
  }, [scanHistory, selectedScanId]);

  const currentStudy = filteredStudies[0];
  const currentScore = scanHistory[0]?.aiScore || 0;
  const selectedScan = scanHistory.find(s => s.id === selectedScanId);
  const selectedPatient = uniquePatients.find(p => p.patientId === selectedPatientId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSeverityVariant = (severity: PastScan['severity']) => {
    switch (severity) {
      case 'Low': return 'low';
      case 'Medium': return 'medium';
      case 'High': return 'high';
      default: return 'neutral';
    }
  };

  // Empty state - no studies at all
  if (studies.length === 0) {
    return (
      <DashboardLayout pageTitle="Comparison">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <GitCompare className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No studies to compare</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Upload your first medical image to enable comparison features between scans.
          </p>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Upload className="w-4 h-4" />
            Start New Analysis
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // No analyzed studies
  if (analyzedStudies.length === 0) {
    return (
      <DashboardLayout pageTitle="Comparison">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <GitCompare className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No analyzed studies</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Complete an AI analysis first to enable comparison features.
          </p>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Upload className="w-4 h-4" />
            Start New Analysis
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Comparison">
      <div className="space-y-6">
        {/* Patient Search & Selection */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Patient Name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {searchQuery && filteredPatients.length > 0 && (
                <div className="absolute z-50 mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {filteredPatients.slice(0, 5).map(patient => (
                    <button
                      key={patient.patientId}
                      onClick={() => {
                        setSelectedPatientId(patient.patientId);
                        setSearchQuery('');
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between",
                        selectedPatientId === patient.patientId && "bg-secondary/10"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{patient.patientName}</p>
                        <p className="text-xs text-muted-foreground">{patient.patientId}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(patient.latestDate)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && filteredPatients.length === 0 && (
                <div className="absolute z-50 mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No patients match "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Context Header */}
        {selectedPatient && (
          <div className="bg-card rounded-xl shadow-soft border border-border/30 p-4">
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Patient:</span>
                <span className="text-sm font-semibold text-foreground">{selectedPatient.patientName}</span>
                <Badge variant="neutral">{selectedPatient.patientId}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {patientStudies.length} total scan{patientStudies.length !== 1 ? 's' : ''} • {scanHistory.length} for selected disease
                </span>
              </div>
              
              {/* Disease Focus Dropdown */}
              {availableDiseases.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground">Disease Focus:</span>
                  <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select disease" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDiseases.map(disease => (
                        <SelectItem key={disease} value={disease}>
                          {disease}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentStudy && selectedDisease && (
                <Badge variant="info">
                  Current: {selectedDisease} ({currentScore}%)
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Main Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan History (formerly Past Scans) */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 h-full animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-secondary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Scan History
                </h3>
              </div>

              <div className="space-y-2">
                {scanHistory.map((scan, index) => {
                  const isBaseline = index === scanHistory.length - 1;
                  const previousScan = scanHistory[index + 1];
                  const delta = previousScan ? scan.aiScore - previousScan.aiScore : 0;
                  
                  return (
                    <div
                      key={scan.id}
                      onClick={() => setSelectedScanId(scan.id)}
                      className={cn(
                        "relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                        selectedScanId === scan.id
                          ? "border-secondary bg-secondary/5"
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {/* Timeline connector */}
                      {index < scanHistory.length - 1 && (
                        <div className="absolute left-6 top-full w-0.5 h-2 bg-border" />
                      )}

                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
                            selectedScanId === scan.id ? "bg-secondary" : "bg-muted-foreground/30"
                          )} />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {formatDate(scan.date)}
                              {index === 0 && (
                                <span className="ml-2 text-xs text-secondary font-normal">(Latest)</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {scan.modality}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getSeverityVariant(scan.severity)} className="text-xs">
                          {scan.severity}
                        </Badge>
                      </div>

                      <div className="ml-6 mt-2 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {scan.disease}
                        </span>
                        <span className="text-xs font-semibold text-secondary">
                          {scan.aiScore}%
                        </span>
                      </div>

                      {/* Score change indicator - only show if not baseline */}
                      {!isBaseline && previousScan && (
                        <div className="ml-6 mt-1">
                          <span className={cn(
                            "text-xs font-medium",
                            delta < 0 ? "text-success" : delta > 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {delta < 0 ? '↓' : delta > 0 ? '↑' : '→'} 
                            {' '}{Math.abs(delta)}% from previous
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {scanHistory.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No scans found for "{selectedDisease}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dual Viewer & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <DualViewer
              currentDate={currentStudy?.dateTime || ''}
              pastDate={selectedScan?.date}
            />
            <ProgressionChart
              scans={scanHistory}
              currentScore={currentStudy?.aiFindings?.probability || 0}
              disease={selectedDisease}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Comparison;

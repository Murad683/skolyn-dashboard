import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Cpu, 
  Zap, 
  Activity, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Gauge,
  SplitSquareVertical,
  Settings2,
  FileUp
} from 'lucide-react';
import { mockReconstructionJobs, mockThroughputMetrics } from '@/data/rheniumMockData';
import { cn } from '@/lib/utils';

const ReconstructionLab = () => {
  const [selectedModality, setSelectedModality] = useState<string>('MRI');
  const [accelerationFactor, setAccelerationFactor] = useState<number[]>([4]);
  const [doseReduction, setDoseReduction] = useState<number[]>([50]);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleStartReconstruction = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'processing': return <Activity className="w-4 h-4 text-secondary animate-pulse" />;
      case 'queued': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout pageTitle="Reconstruction Lab">
      <div className="space-y-6">
        {/* Throughput Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground">Scan Time Saved</span>
            </div>
            <p className="text-2xl font-bold text-primary">{mockThroughputMetrics.scanTimeSaved}x</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground">Reconstructions</span>
            </div>
            <p className="text-2xl font-bold text-secondary">{mockThroughputMetrics.reconstructionsToday}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Avg Time</span>
            </div>
            <p className="text-2xl font-bold">{mockThroughputMetrics.avgReconTime}s</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">GPU Usage</span>
            </div>
            <p className="text-2xl font-bold">{mockThroughputMetrics.gpuUtilization}%</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">AI Findings</span>
            </div>
            <p className="text-2xl font-bold">{mockThroughputMetrics.aiFindings}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-destructive/5 to-transparent border-destructive/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Urgent Cases</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{mockThroughputMetrics.urgentCases}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Upload & Configuration */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-secondary" />
                Raw Data Input
              </h3>
              
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  selectedFile ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
                )}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden"
                  accept=".h5,.nii,.dcm,.raw,.dat"
                  onChange={handleFileSelect}
                />
                <FileUp className={cn("w-10 h-10 mx-auto mb-3", selectedFile ? "text-secondary" : "text-muted-foreground")} />
                {selectedFile ? (
                  <>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground">Drop raw data file here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      K-Space (.h5), Sinogram (.raw), RF Data (.dat)
                    </p>
                  </>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Input Type</Label>
                  <Select defaultValue="k-space">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="k-space">K-Space (MRI)</SelectItem>
                      <SelectItem value="sinogram">Sinogram (CT)</SelectItem>
                      <SelectItem value="rf-data">RF Data (Ultrasound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Physics Configuration */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-secondary" />
                Physics Configuration
              </h3>

              <Tabs defaultValue="mri" onValueChange={setSelectedModality}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="MRI">MRI</TabsTrigger>
                  <TabsTrigger value="CT">CT</TabsTrigger>
                  <TabsTrigger value="US">Ultrasound</TabsTrigger>
                </TabsList>

                <TabsContent value="MRI" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Acceleration Factor</Label>
                      <span className="text-sm font-medium">{accelerationFactor[0]}x</span>
                    </div>
                    <Slider 
                      value={accelerationFactor}
                      onValueChange={setAccelerationFactor}
                      min={2}
                      max={8}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>2x (Safer)</span>
                      <span>8x (Faster)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">T1 Relaxation (ms)</Label>
                      <Input type="number" defaultValue="1000" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">T2 Relaxation (ms)</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="CT" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Dose Reduction Target</Label>
                      <span className="text-sm font-medium">{doseReduction[0]}%</span>
                    </div>
                    <Slider 
                      value={doseReduction}
                      onValueChange={setDoseReduction}
                      min={25}
                      max={75}
                      step={5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>25% (Quality)</span>
                      <span>75% (Low Dose)</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="US" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Frame Rate Enhancement</Label>
                    <Select defaultValue="2x">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2x">2x (Temporal)</SelectItem>
                        <SelectItem value="4x">4x (Interpolated)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full mt-4" 
                disabled={!selectedFile || isProcessing}
                onClick={handleStartReconstruction}
              >
                {isProcessing ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start PINN Reconstruction
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Center - Comparison Viewer */}
          <div className="xl:col-span-2">
            <Card className="p-5 h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-secondary" />
                Reconstruction Comparison
              </h3>

              {/* Comparison Slider */}
              <div className="relative bg-muted/30 rounded-lg aspect-[4/3] overflow-hidden">
                {/* Standard Reconstruction (Left) */}
                <div 
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - comparisonPosition}% 0 0)` }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                        <span className="text-6xl opacity-30">📊</span>
                      </div>
                      <p className="font-medium">Standard FFT/FBP</p>
                      <p className="text-sm text-muted-foreground mt-1">Traditional Reconstruction</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">PSNR</p>
                    <p className="text-lg font-bold">28.4 dB</p>
                  </div>
                </div>

                {/* PINN Reconstruction (Right) */}
                <div 
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 0 0 ${comparisonPosition}%)` }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-secondary/20 rounded-lg flex items-center justify-center border border-secondary/30">
                        <span className="text-6xl">🧠</span>
                      </div>
                      <p className="font-medium text-secondary">Rhenium PINN</p>
                      <p className="text-sm text-muted-foreground mt-1">AI-Enhanced Reconstruction</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">PSNR</p>
                    <p className="text-lg font-bold text-secondary">42.3 dB</p>
                  </div>
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute inset-y-0 w-1 bg-secondary cursor-ew-resize"
                  style={{ left: `${comparisonPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                    <SplitSquareVertical className="w-4 h-4 text-secondary-foreground" />
                  </div>
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={comparisonPosition}
                  onChange={(e) => setComparisonPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">SSIM</p>
                  <p className="text-lg font-bold text-secondary">0.987</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">PSNR Gain</p>
                  <p className="text-lg font-bold text-green-500">+13.9 dB</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Acceleration</p>
                  <p className="text-lg font-bold">{accelerationFactor[0]}x</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Time Saved</p>
                  <p className="text-lg font-bold text-secondary">72%</p>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Recent Reconstructions</h4>
                <div className="space-y-2">
                  {mockReconstructionJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="text-sm font-medium">{job.modality} - {job.inputType}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.accelerationFactor || job.doseReduction || 'Processing'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {job.status === 'processing' && (
                          <div className="w-24">
                            <Progress value={job.progress} className="h-1.5" />
                          </div>
                        )}
                        {job.psnr && (
                          <Badge variant="outline" className="text-secondary border-secondary">
                            {job.psnr} dB
                          </Badge>
                        )}
                        <Badge variant={
                          job.status === 'completed' ? 'default' :
                          job.status === 'processing' ? 'secondary' :
                          job.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReconstructionLab;

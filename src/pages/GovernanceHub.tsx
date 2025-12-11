import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Activity,
  BarChart3,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { 
  mockAuditLogs, 
  mockModelCards, 
  mockFairnessMetrics 
} from '@/data/rheniumMockData';
import { cn } from '@/lib/utils';

const GovernanceHub = () => {
  const [selectedModel, setSelectedModel] = useState(mockModelCards[0]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 93) return 'bg-green-500';
    if (accuracy >= 88) return 'bg-amber-500';
    return 'bg-destructive';
  };

  const getAccuracyTextColor = (accuracy: number) => {
    if (accuracy >= 93) return 'text-green-500';
    if (accuracy >= 88) return 'text-amber-500';
    return 'text-destructive';
  };

  const demographicGroups = ['Age', 'Gender', 'Scanner'];
  const [activeDemographic, setActiveDemographic] = useState('Age');
  
  const filteredMetrics = mockFairnessMetrics.filter(m => m.demographic === activeDemographic);
  const hasDisparity = filteredMetrics.some(m => m.accuracy < 90);

  return (
    <DashboardLayout pageTitle="Governance & Compliance">
      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start">
          <TabsTrigger value="audit" className="gap-2 whitespace-nowrap flex-shrink-0">
            <Activity className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2 whitespace-nowrap flex-shrink-0">
            <FileText className="w-4 h-4" />
            Model Cards
          </TabsTrigger>
          <TabsTrigger value="fairness" className="gap-2 whitespace-nowrap flex-shrink-0">
            <BarChart3 className="w-4 h-4" />
            Fairness Dashboard
          </TabsTrigger>
        </TabsList>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <Card className="p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  Immutable Audit Log
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete record of all AI interactions • EU AI Act Compliant
                </p>
              </div>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="p-4 overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Timestamp</th>
                      <th className="pb-3 text-xs font-medium text-muted-foreground whitespace-nowrap">User</th>
                      <th className="pb-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Action</th>
                      <th className="pb-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Model Version</th>
                      <th className="pb-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Input Hash</th>
                      <th className="pb-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAuditLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        className={cn(
                          "border-b last:border-0",
                          log.isOverride && "bg-amber-500/5"
                        )}
                      >
                        <td className="py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-muted-foreground" />
                            {log.user}
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge 
                            variant={log.isOverride ? 'outline' : 'secondary'}
                            className={cn(
                              "text-xs",
                              log.isOverride && "border-amber-500 text-amber-500"
                            )}
                          >
                            {log.isOverride && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm font-mono text-muted-foreground">
                          {log.model_version}
                        </td>
                        <td className="py-3 text-sm font-mono text-muted-foreground text-xs">
                          {log.input_hash}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground max-w-xs truncate">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Model Cards Tab */}
        <TabsContent value="models">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Model List */}
            <Card className="p-0">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Active Models</h3>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="p-2">
                  {mockModelCards.map((model) => (
                    <button
                      key={model.id}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-colors mb-1",
                        selectedModel.id === model.id 
                          ? "bg-secondary/10 border border-secondary" 
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedModel(model)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{model.name}</h4>
                          <p className="text-xs text-muted-foreground">{model.version}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Model Card Detail */}
            <Card className="xl:col-span-2 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedModel.name}</h2>
                  <p className="text-sm text-muted-foreground">Version {selectedModel.version}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedModel.license}</Badge>
                  <Badge className="bg-secondary text-secondary-foreground">
                    {selectedModel.accuracy}% Accuracy
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Description
                  </h4>
                  <p className="text-sm">{selectedModel.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Intended Use
                  </h4>
                  <p className="text-sm">{selectedModel.intendedUse}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Limitations
                  </h4>
                  <ul className="space-y-1">
                    {selectedModel.limitations.map((limitation, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Training Data Distribution
                  </h4>
                  <div className="space-y-2">
                    {selectedModel.trainingDataDistribution.map((item) => (
                      <div key={item.category} className="flex items-center gap-3">
                        <span className="text-sm w-24">{item.category}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t text-sm text-muted-foreground">
                  Last updated: {selectedModel.lastUpdated}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Fairness Dashboard Tab */}
        <TabsContent value="fairness">
          <div className="space-y-6">
            {/* Bias Alert */}
            {hasDisparity && (
              <Card className="p-4 border-amber-500 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-500">Bias Alert Detected</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Model accuracy disparity detected across demographic groups. Review the metrics below and consider retraining or applying fairness constraints.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Demographic Selector */}
            <div className="flex items-center gap-2">
              {demographicGroups.map((group) => (
                <Button
                  key={group}
                  variant={activeDemographic === group ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveDemographic(group)}
                >
                  {group}
                </Button>
              ))}
            </div>

            {/* Fairness Metrics Grid */}
            <Card className="p-0">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-secondary" />
                  Accuracy by {activeDemographic}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Model performance stratified by demographic group
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredMetrics.map((metric) => (
                    <Card 
                      key={metric.category} 
                      className={cn(
                        "p-4",
                        metric.accuracy < 90 && "border-amber-500 bg-amber-500/5"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{metric.category}</h4>
                        {metric.accuracy < 90 && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Accuracy</span>
                            <span className={cn(
                              "text-lg font-bold",
                              getAccuracyTextColor(metric.accuracy)
                            )}>
                              {metric.accuracy}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", getAccuracyColor(metric.accuracy))}
                              style={{ width: `${metric.accuracy}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">FPR</p>
                            <p className="text-sm font-medium">{(metric.falsePositiveRate * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">FNR</p>
                            <p className="text-sm font-medium">{(metric.falseNegativeRate * 100).toFixed(1)}%</p>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          n = {metric.sampleSize.toLocaleString()}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>

            {/* Compliance Status */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Regulatory Compliance Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">EU AI Act</p>
                    <p className="text-xs text-muted-foreground">High-risk AI compliant</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">MDR 2017/745</p>
                    <p className="text-xs text-muted-foreground">Class IIa certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">HIPAA</p>
                    <p className="text-xs text-muted-foreground">PHI protection verified</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GovernanceHub;

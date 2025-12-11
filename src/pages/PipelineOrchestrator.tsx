import { useCallback, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Upload, 
  Cpu, 
  Brain, 
  FileText, 
  Scissors, 
  Play, 
  Search,
  Clock,
  Check,
  Shield
} from 'lucide-react';
import { mockModelCards } from '@/data/rheniumMockData';
import { cn } from '@/lib/utils';

// Custom Node Components
const nodeIcons: Record<string, typeof Upload> = {
  ingest: Upload,
  reconstruct: Cpu,
  segment: Scissors,
  reason: Brain,
  report: FileText,
};

const nodeColors: Record<string, string> = {
  ingest: 'border-blue-500 bg-blue-500/10',
  reconstruct: 'border-purple-500 bg-purple-500/10',
  segment: 'border-amber-500 bg-amber-500/10',
  reason: 'border-secondary bg-secondary/10',
  report: 'border-green-500 bg-green-500/10',
};

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  status?: 'idle' | 'running' | 'completed';
}

function CustomNode({ data }: { data: CustomNodeData }) {
  const Icon = nodeIcons[data.type] || Upload;
  const colorClass = nodeColors[data.type] || 'border-border bg-muted/10';

  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 min-w-[140px] bg-background shadow-lg",
      colorClass
    )}>
      <Handle type="target" position={Position.Left} className="!bg-secondary !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      {data.status === 'running' && (
        <div className="mt-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-secondary animate-pulse w-2/3" />
          </div>
        </div>
      )}
      {data.status === 'completed' && (
        <div className="absolute -top-1 -right-1">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-secondary !w-3 !h-3" />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 50, y: 150 },
    data: { label: 'Ingest', type: 'ingest', status: 'completed' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: { label: 'Reconstruct (PINN)', type: 'reconstruct', status: 'completed' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: { label: 'Denoise', type: 'reconstruct', status: 'running' },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 480, y: 150 },
    data: { label: 'Segment (nnU-Net)', type: 'segment', status: 'idle' },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 700, y: 150 },
    data: { label: 'Reason (MedGemma)', type: 'reason', status: 'idle' },
  },
  {
    id: '6',
    type: 'custom',
    position: { x: 920, y: 150 },
    data: { label: 'Generate Report', type: 'report', status: 'idle' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00A99D' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#00A99D' } },
  { id: 'e2-4', source: '2', target: '4', style: { stroke: '#64748b' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: '#64748b' } },
  { id: 'e4-5', source: '4', target: '5', style: { stroke: '#64748b' } },
  { id: 'e5-6', source: '5', target: '6', style: { stroke: '#64748b' } },
];

const PipelineOrchestrator = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [searchQuery, setSearchQuery] = useState('');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, style: { stroke: '#00A99D' } }, eds)),
    []
  );

  const filteredModels = mockModelCards.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Pipeline Orchestrator">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
        {/* Pipeline Canvas */}
        <Card className="xl:col-span-3 p-0 overflow-hidden">
          <div className="h-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b">
              <div className="space-y-1">
                <h3 className="font-semibold">Diagnostic Pipeline</h3>
                <p className="text-sm text-muted-foreground">Drag nodes to reconfigure • Click edges to delete</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  Est. 12.4s
                </Badge>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run Pipeline
                </Button>
              </div>
            </div>
            <div className="h-[calc(100%-65px)] min-h-[350px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-muted/20"
              >
                <Background color="#64748b" gap={20} size={1} />
                <Controls />
                <MiniMap 
                  nodeColor={(n) => {
                    const status = (n.data as Record<string, unknown>)?.status as string | undefined;
                    if (status === 'completed') return '#22c55e';
                    if (status === 'running') return '#00A99D';
                    return '#64748b';
                  }}
                  className="!bg-background !border-border"
                />
              </ReactFlow>
            </div>
          </div>
        </Card>

        {/* Model Registry */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Model Registry</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search models..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100%-85px)]">
            <div className="p-4 space-y-3">
              {filteredModels.map((model) => (
                <div 
                  key={model.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-grab"
                  draggable
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{model.name}</h4>
                      <p className="text-xs text-muted-foreground">{model.version}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {model.accuracy}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {model.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Shield className="w-3 h-3" />
                      {model.license}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated {model.lastUpdated}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PipelineOrchestrator;

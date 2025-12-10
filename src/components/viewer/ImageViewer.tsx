import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Contrast,
  Ruler,
  Pen,
  Layers,
} from 'lucide-react';

interface ImageViewerProps {
  hasAiFindings: boolean;
}

type ViewMode = 'original' | 'heatmap' | 'side-by-side';
type ActiveTool = 'zoom' | 'pan' | 'rotate' | 'measure' | 'annotate' | null;

export function ImageViewer({ hasAiFindings }: ImageViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [heatmapOpacity, setHeatmapOpacity] = useState([50]);
  const [activeTool, setActiveTool] = useState<ActiveTool>('pan');
  const [zoom, setZoom] = useState(100);

  const tools = [
    { id: 'zoom' as ActiveTool, icon: ZoomIn, label: 'Zoom' },
    { id: 'pan' as ActiveTool, icon: Move, label: 'Pan' },
    { id: 'rotate' as ActiveTool, icon: RotateCw, label: 'Rotate' },
    { id: 'measure' as ActiveTool, icon: Ruler, label: 'Measure' },
    { id: 'annotate' as ActiveTool, icon: Pen, label: 'Annotate' },
  ];

  const renderImage = (showHeatmap: boolean = false) => (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Simulated X-ray Image */}
      <div 
        className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-lg overflow-hidden"
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          aspectRatio: '3/4',
          transform: `scale(${zoom / 100})`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Simulated lung fields */}
        <svg viewBox="0 0 300 400" className="w-full h-full">
          {/* Background */}
          <rect width="300" height="400" fill="#1a1a2e" />
          
          {/* Simulated chest outline */}
          <ellipse cx="150" cy="180" rx="120" ry="150" fill="none" stroke="#3a3a5e" strokeWidth="2" />
          
          {/* Left lung */}
          <path
            d="M60 100 Q40 200 60 300 Q100 320 130 280 Q140 200 130 120 Q100 80 60 100"
            fill="#2a2a4e"
            stroke="#4a4a6e"
            strokeWidth="1"
          />
          
          {/* Right lung */}
          <path
            d="M240 100 Q260 200 240 300 Q200 320 170 280 Q160 200 170 120 Q200 80 240 100"
            fill="#2a2a4e"
            stroke="#4a4a6e"
            strokeWidth="1"
          />
          
          {/* Heart silhouette */}
          <ellipse cx="140" cy="250" rx="45" ry="55" fill="#1a1a3e" stroke="#3a3a5e" strokeWidth="1" />
          
          {/* Spine */}
          <rect x="145" y="80" width="10" height="240" fill="#3a3a5e" rx="5" />
          
          {/* Ribs simulation */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <path
                d={`M70 ${110 + i * 25} Q150 ${100 + i * 25} 230 ${110 + i * 25}`}
                fill="none"
                stroke="#3a3a5e"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Heatmap overlay */}
          {showHeatmap && (
            <g style={{ opacity: heatmapOpacity[0] / 100 }}>
              {/* Primary finding area - right lower lobe */}
              <ellipse
                cx="200"
                cy="240"
                rx="40"
                ry="50"
                fill="url(#heatmapGradient)"
              />
              {/* Secondary finding */}
              <ellipse
                cx="100"
                cy="260"
                rx="20"
                ry="25"
                fill="url(#heatmapGradientSecondary)"
              />
              
              <defs>
                <radialGradient id="heatmapGradient">
                  <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#ff6600" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#ffcc00" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatmapGradientSecondary">
                  <stop offset="0%" stopColor="#ff6600" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ffcc00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
                </radialGradient>
              </defs>
            </g>
          )}
        </svg>

        {/* Image labels */}
        <div className="absolute top-3 left-3 text-xs text-slate-400 font-mono">
          <p>L</p>
        </div>
        <div className="absolute top-3 right-3 text-xs text-slate-400 font-mono">
          <p>R</p>
        </div>
        <div className="absolute bottom-3 left-3 text-xs text-slate-400 font-mono">
          <p>PA VIEW</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 overflow-hidden animate-fade-in">
      {/* View Mode Tabs */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex bg-muted rounded-lg p-0.5">
          {(['original', 'heatmap', 'side-by-side'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              disabled={mode !== 'original' && !hasAiFindings}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                viewMode === mode
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
                mode !== 'original' && !hasAiFindings && "opacity-50 cursor-not-allowed"
              )}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Heatmap Opacity Slider */}
        {viewMode !== 'original' && hasAiFindings && (
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Opacity</span>
            <Slider
              value={heatmapOpacity}
              onValueChange={setHeatmapOpacity}
              max={100}
              step={1}
              className="w-32"
            />
            <span className="text-sm font-medium text-foreground w-10">{heatmapOpacity}%</span>
          </div>
        )}
      </div>

      {/* Image Area */}
      <div className="relative bg-slate-900 min-h-[400px] lg:min-h-[500px]">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="relative p-4">
              <span className="absolute top-2 left-4 text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
                Original
              </span>
              {renderImage(false)}
            </div>
            <div className="relative p-4 border-l border-slate-700">
              <span className="absolute top-2 left-4 text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
                Heatmap
              </span>
              {renderImage(true)}
            </div>
          </div>
        ) : (
          <div className="p-4 h-full">
            {renderImage(viewMode === 'heatmap' && hasAiFindings)}
          </div>
        )}

        {/* Toolbar Overlay */}
        <div className="absolute top-4 left-4 glass-toolbar rounded-lg p-1 flex flex-col gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon-sm"
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "text-slate-300 hover:text-white hover:bg-white/10",
                activeTool === tool.id && "bg-secondary/30 text-secondary"
              )}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
          <div className="h-px bg-slate-600 my-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-slate-300 hover:text-white hover:bg-white/10"
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-slate-300 hover:text-white hover:bg-white/10"
            title="Flip Vertical"
          >
            <FlipVertical className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-slate-300 hover:text-white hover:bg-white/10"
            title="Contrast/Windowing"
          >
            <Contrast className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 glass-toolbar rounded-lg p-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setZoom(Math.max(50, zoom - 25))}
            className="text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-slate-300 font-medium px-2 min-w-[50px] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

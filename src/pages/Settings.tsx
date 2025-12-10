import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Monitor, Brain, User, Save, Sun, Moon } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState([50]);
  const [defaultViewerMode, setDefaultViewerMode] = useState<'overlay' | 'side-by-side'>('overlay');
  const [selectedModel, setSelectedModel] = useState('v1.3');
  const [role, setRole] = useState<'Radiologist' | 'Admin' | 'Researcher'>('Radiologist');

  useEffect(() => {
    setMounted(true);
  }, []);

  const models = [
    { id: 'v1.3', name: 'Model v1.3 – Chest X-ray', description: 'Latest stable release with improved pneumonia detection' },
    { id: 'v1.2', name: 'Model v1.2 – Chest X-ray', description: 'Previous stable version' },
    { id: 'v1.1-beta', name: 'Model v1.1-beta – Multi-modal', description: 'Experimental multi-modal support' },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const currentTheme = mounted ? resolvedTheme : 'light';

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="max-w-4xl space-y-6">
        {/* Display & Viewer */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">Display & Viewer</h3>
          </div>

          <div className="space-y-6">
            {/* Heatmap Opacity */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Default Heatmap Opacity
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={heatmapOpacity}
                  onValueChange={setHeatmapOpacity}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-foreground w-12">{heatmapOpacity}%</span>
              </div>
            </div>

            {/* Default Viewer Mode */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Default Viewer Mode
              </label>
              <div className="flex bg-muted rounded-lg p-1 w-fit">
                {(['overlay', 'side-by-side'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDefaultViewerMode(mode)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                      defaultViewerMode === mode
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {mode.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Theme
              </label>
              <div className="flex bg-muted rounded-lg p-1 w-fit">
                {(['light', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                      currentTheme === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your preference is saved automatically.
              </p>
            </div>
          </div>
        </div>

        {/* AI Model */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">AI Model</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Current Model Version
              </label>
              <div className="space-y-2">
                {models.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      selectedModel === model.id
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-border/80"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{model.name}</span>
                      {selectedModel === model.id && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Release Notes
              </label>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">v1.3 Release Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Improved pneumonia detection accuracy by 8%</li>
                  <li>Reduced false positive rate for pleural effusion</li>
                  <li>Enhanced heatmap resolution and coverage</li>
                  <li>New support for lateral chest X-ray views</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Account & Roles */}
        <div className="bg-card rounded-xl shadow-soft border border-border/30 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">Account & Roles</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Current Role
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Radiologist', 'Admin', 'Researcher'] as const).map((r) => (
                  <Badge
                    key={r}
                    variant={role === r ? 'secondary' : 'outline'}
                    className={cn("cursor-pointer px-4 py-2", role === r && "shadow-glow")}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Changing roles is for demo purposes only.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Permissions:</strong>{' '}
                {role === 'Radiologist' && 'View studies, provide feedback, generate reports.'}
                {role === 'Admin' && 'Full access including analytics, user management, and system settings.'}
                {role === 'Researcher' && 'View anonymized data, access analytics, export datasets.'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

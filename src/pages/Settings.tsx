import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Monitor, Brain, User, Save, LogOut } from 'lucide-react';

const Settings = () => {
  const [heatmapOpacity, setHeatmapOpacity] = useState([50]);
  const [defaultViewerMode, setDefaultViewerMode] = useState<'overlay' | 'side-by-side'>('overlay');
  const [role, setRole] = useState<'Radiologist' | 'Admin' | 'Researcher'>('Radiologist');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleSignOut = () => {
    toast.success('Signed out (demo)', {
      description: 'Session ended for demo purposes.',
    });
  };

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
              <p className="text-sm font-medium text-muted-foreground mb-1">Current model</p>
              <p className="text-lg font-semibold text-foreground">Skolyn Sko-16</p>
              <p className="text-sm text-muted-foreground mt-1">
                Chest imaging classifier with explainable outputs and calibrated probabilities.
              </p>
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

        {/* Actions */}
        <div className="flex justify-end gap-3 flex-wrap">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

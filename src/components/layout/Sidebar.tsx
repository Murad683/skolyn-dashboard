import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ClipboardList,
  GitCompare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Upload,
  Cpu,
  Workflow,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import skolynLogo from '@/assets/skolyn-logo.svg';
import skolynSmallLogo from '@/assets/skolyn-small-logo.png';

const mainNavItems = [
  { path: '/', label: 'Analyze', icon: Upload },
  { path: '/recent', label: 'Recent Analyses', icon: ClipboardList },
  { path: '/comparison', label: 'Comparison', icon: GitCompare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const rheniumModules = [
  { path: '/reconstruction', label: 'Reconstruction Lab', icon: Cpu },
  { path: '/pipeline', label: 'Pipeline Orchestrator', icon: Workflow },
  { path: '/governance', label: 'Governance Hub', icon: Shield },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
    onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="relative flex items-center h-16 px-4 border-b border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "absolute inset-0 justify-center" : "flex-1 justify-start"
          )}
        >
          {!collapsed && (
            <img 
              src={skolynLogo} 
              alt="Skolyn" 
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            />
          )}
          {collapsed && (
            <img
              src={skolynSmallLogo}
              alt="Skolyn"
              className="h-9 w-9 object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-secondary text-secondary-foreground shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "animate-pulse-glow rounded")} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Divider */}
        <div className={cn("my-4", collapsed ? "mx-2" : "mx-3")}>
          <div className="h-px bg-sidebar-border" />
        </div>

        {/* Rhenium OS Modules */}
        {!collapsed && (
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Rhenium OS
            </span>
          </div>
        )}
        
        <div className="space-y-1">
          {rheniumModules.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-secondary/20 text-secondary border border-secondary/30"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/40">
            <p>Rhenium OS</p>
            <p className="mt-1">© 2024 Skolyn AI</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar z-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-sidebar transition-all duration-300 flex-shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

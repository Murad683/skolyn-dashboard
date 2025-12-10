import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ClipboardList,
  GitCompare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Bug,
  Activity,
  Droplet,
  CircleDot,
  Heart,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import skolynLogo from '@/assets/skolyn-logo.svg';
import skolynSmallLogo from '@/assets/skolyn-small-logo.png';
import { Link } from 'react-router-dom';

const mainNavItems = [
  { path: '/', label: 'Analyze', icon: Upload },
  { path: '/recent-analyses', label: 'Recent Analyses', icon: ClipboardList },
  { path: '/comparison', label: 'Comparison', icon: GitCompare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link to="/" className="flex items-center gap-2">
          {!collapsed && (
            <img 
              src={skolynLogo} 
              alt="Skolyn" 
              className="h-8 w-auto"
            />
          )}
          {collapsed && (
            <img
              src={skolynSmallLogo}
              alt="Skolyn"
              className="h-8 w-8"
            />
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isAnalyzeActive = location.pathname === '/' ;
          const isRecentActive = location.pathname === '/recent-analyses';

          const isActive =
            (item.path === '/' && isAnalyzeActive) ||
            (item.path === '/recent-analyses' && isRecentActive) ||
            (item.path !== '/' &&
              item.path !== '/recent-analyses' &&
              (location.pathname === item.path ||
                (item.path === '/viewer' && location.pathname.startsWith('/viewer'))));
          
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
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/40">
            <p>Model v1.3 – Chest X-ray</p>
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

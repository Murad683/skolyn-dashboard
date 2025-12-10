import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
  breadcrumb?: string;
}

type UserRole = 'Radiologist' | 'Admin' | 'Researcher';

export function Topbar({ onMenuClick, pageTitle, breadcrumb }: TopbarProps) {
  const location = useLocation();
  const [activeRole, setActiveRole] = useState<UserRole>('Radiologist');
  const urgentCount = 3;

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const path = location.pathname;
    if (path === '/') return 'Worklist';
    if (path.startsWith('/viewer')) return 'Viewer';
    if (path === '/comparison') return 'Comparison';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  };

  const roles: UserRole[] = ['Radiologist', 'Admin', 'Researcher'];

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {getPageTitle()}
          </h1>
          {breadcrumb && (
            <p className="text-sm text-muted-foreground">{breadcrumb}</p>
          )}
        </div>
      </div>

      {/* Center Section - Role Toggle */}
      <div className="hidden md:flex items-center">
        <div className="flex bg-muted rounded-lg p-1">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                activeRole === role
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Urgent Cases Indicator */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {urgentCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {urgentCount}
            </span>
          )}
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">Dr. Smith</p>
            <p className="text-xs text-muted-foreground">{activeRole}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

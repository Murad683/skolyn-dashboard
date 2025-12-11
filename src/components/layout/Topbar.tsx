import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Bell, Menu, User, ChevronDown, Settings, Sun, Moon, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
  breadcrumb?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'AI Analysis Complete',
    description: 'Study STU-001 has been analyzed with high confidence findings.',
    time: '2 min ago',
    read: false,
    link: '/viewer/STU-001',
  },
  {
    id: '2',
    title: 'Urgent Case Flagged',
    description: 'Critical finding detected in patient P-2024-0891.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    title: 'Model Update Available',
    description: 'Rhenium OS v1.4 is now available for deployment.',
    time: '1 hour ago',
    read: true,
  },
];

export function Topbar({ onMenuClick, pageTitle, breadcrumb }: TopbarProps) {
  const location = useLocation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentTheme = mounted ? resolvedTheme : 'light';

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const path = location.pathname;
    if (path === '/') return 'Cockpit';
    if (path.startsWith('/viewer')) return 'Viewer';
    if (path === '/comparison') return 'Comparison';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    if (path === '/analyze') return 'Analyze';
    if (path === '/reconstruction') return 'Reconstruction Lab';
    if (path === '/pipeline') return 'Pipeline Orchestrator';
    if (path === '/governance') return 'Governance Hub';
    return 'Dashboard';
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

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
          <h1 className="text-lg md:text-2xl font-semibold text-foreground leading-tight">
            {getPageTitle()}
          </h1>
          {breadcrumb && (
            <p className="text-sm text-muted-foreground">{breadcrumb}</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative"
          title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mounted && (
            currentTheme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )
          )}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover z-50">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-secondary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 cursor-pointer",
                      !notification.read && "bg-secondary/5"
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                    asChild={!!notification.link}
                  >
                    {notification.link ? (
                      <Link to={notification.link}>
                        <div className="flex items-start justify-between w-full">
                          <span className={cn(
                            "font-medium text-sm",
                            !notification.read && "text-foreground"
                          )}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                        <span className="text-xs text-muted-foreground/70">
                          {notification.time}
                        </span>
                      </Link>
                    ) : (
                      <div className="w-full">
                        <div className="flex items-start justify-between w-full">
                          <span className={cn(
                            "font-medium text-sm",
                            !notification.read && "text-foreground"
                          )}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                        <span className="text-xs text-muted-foreground/70">
                          {notification.time}
                        </span>
                      </div>
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-3 border-l border-border hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">Dr. Smith</p>
                <p className="text-xs text-muted-foreground">Radiologist</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
            <div className="px-3 py-2 border-b border-border">
              <p className="font-medium text-sm">Dr. Smith</p>
              <p className="text-xs text-muted-foreground">dr.smith@hospital.org</p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Help
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs text-destructive hover:text-destructive">
                  Sign Out
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

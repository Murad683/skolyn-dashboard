import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'next-themes';

interface TopbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
  breadcrumb?: string;
}

export function Topbar({ onMenuClick, pageTitle, breadcrumb }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme : 'light';

  const latestNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 7),
    [notifications]
  );

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) navigate(link);
  };

  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(next || 'light');
  };

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const path = location.pathname;
    if (path === '/') return 'Analyze';
    if (path === '/recent-analyses') return 'Recent Analyses';
    if (path.startsWith('/viewer')) return 'Viewer';
    if (path === '/comparison') return 'Comparison';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
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
          <h1 className="text-lg font-semibold text-foreground">
            {getPageTitle()}
          </h1>
          {breadcrumb && (
            <p className="text-sm text-muted-foreground">{breadcrumb}</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {currentTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-5 px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="px-0 py-0">Notifications</DropdownMenuLabel>
              <button
                className="text-xs text-secondary hover:underline"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>
            <DropdownMenuSeparator />
            {latestNotifications.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">No notifications</div>
            ) : (
              latestNotifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className={cn(
                    "flex flex-col items-start gap-1 py-3 cursor-pointer",
                    !notif.isRead && "bg-secondary/10"
                  )}
                  onClick={() => handleNotificationClick(notif.id, notif.link)}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {notif.description && (
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-3 border-l border-border focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground hidden sm:block">Dr. Smith</p>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className={cn("cursor-pointer", location.pathname === '/settings' && "text-secondary font-semibold")}
              onClick={() => navigate('/settings')}
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

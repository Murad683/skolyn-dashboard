import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type NotificationType = 'urgent_case' | 'analysis_ready' | 'system_info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
}

interface NotificationsContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'urgent_case',
    title: 'Urgent case flagged: STU-001',
    description: 'High severity pneumonia detected. Review immediately.',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isRead: false,
    link: '/viewer/STU-001',
  },
  {
    id: 'notif-2',
    type: 'analysis_ready',
    title: 'Analysis ready for STU-004',
    description: 'AI findings prepared, awaiting review.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isRead: false,
    link: '/viewer/STU-004',
  },
  {
    id: 'notif-3',
    type: 'system_info',
    title: 'Model update deployed',
    description: 'v1.3 improves pneumonia precision by 8%.',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

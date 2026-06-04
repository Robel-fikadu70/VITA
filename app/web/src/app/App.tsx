import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Referrals } from './pages/Referrals';
import { WellnessInsightsPage } from './pages/WellnessInsights';
import { CampaignsPage } from './pages/Campaigns';
import { BookingsPage } from './pages/Bookings';
import { NotificationsPage } from './pages/Notifications';
import { SettingsPage } from './pages/Settings';
import { Login } from './pages/Login';
import { notificationService } from '../services/notificationService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = 'VITAL-ETHIO Partner Portal';

    // Check if user is already logged in (from localStorage)
    const authStatus = localStorage.getItem('vital-ethio-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotificationCount();
    }
  }, [isAuthenticated]);

  const loadNotificationCount = async () => {
    try {
      const notifications = await notificationService.getAll();
      const unreadCount = notifications.filter((n) => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('vital-ethio-auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vital-ethio-auth');
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string, options?: any) => {
    setCurrentPage(page);
    setShowNotifications(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setCurrentPage('referrals');
    }
  };

  const handleNotificationClick = () => {
    setCurrentPage('notifications');
    setNotificationCount(0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'referrals':
        return <Referrals />;
      case 'insights':
        return <WellnessInsightsPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={handleSearch}
          notificationCount={notificationCount}
          onNotificationClick={handleNotificationClick}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

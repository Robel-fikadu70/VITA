import { useEffect, useState } from 'react';
import { Users, Target, TrendingUp, DollarSign, CheckCircle, Megaphone } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell } from 'recharts';
import { KPICard } from '../components/KPICard';
import { analyticsService, Analytics } from '../../services/analyticsService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';

interface DashboardProps {
  onNavigate: (page: string, filter?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getAnalytics();
      setAnalytics(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const FUNNEL_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor your partner performance and referral metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="New Referrals Today"
          value={analytics.kpis.newReferralsToday.value}
          change={analytics.kpis.newReferralsToday.change}
          trend={analytics.kpis.newReferralsToday.trend}
          icon={Users}
          onClick={() => onNavigate('referrals', { filterToday: true })}
        />
        <KPICard
          title="Active Referrals"
          value={analytics.kpis.activeReferrals.value}
          change={analytics.kpis.activeReferrals.change}
          trend={analytics.kpis.activeReferrals.trend}
          icon={Target}
          onClick={() => onNavigate('referrals', { filterActive: true })}
        />
        <KPICard
          title="Conversion Rate"
          value={`${analytics.kpis.conversionRate.value}%`}
          change={analytics.kpis.conversionRate.change}
          trend={analytics.kpis.conversionRate.trend}
          icon={TrendingUp}
        />
        <KPICard
          title="Revenue Generated"
          value={formatCurrency(analytics.kpis.revenueGenerated.value)}
          change={analytics.kpis.revenueGenerated.change}
          trend={analytics.kpis.revenueGenerated.trend}
          icon={DollarSign}
        />
        <KPICard
          title="Completed Visits"
          value={analytics.kpis.completedVisits.value}
          change={analytics.kpis.completedVisits.change}
          trend={analytics.kpis.completedVisits.trend}
          icon={CheckCircle}
        />
        <KPICard
          title="Campaign Reach"
          value={analytics.kpis.campaignReach.value.toLocaleString()}
          change={analytics.kpis.campaignReach.change}
          trend={analytics.kpis.campaignReach.trend}
          icon={Megaphone}
        />
      </div>

      

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => {
                  if (activity.referralId) onNavigate('referrals');
                  if (activity.campaignId) onNavigate('campaigns');
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
}

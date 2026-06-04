import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: LucideIcon;
  onClick?: () => void;
}

export function KPICard({ title, value, change, trend, icon: Icon, onClick }: KPICardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm transition-all',
        onClick && 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            trend === 'up'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          )}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </button>
  );
}

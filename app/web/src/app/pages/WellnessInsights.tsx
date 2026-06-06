import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { insightsService, WellnessInsights } from '../../services/insightsService';

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

export function WellnessInsightsPage() {
  const [insights, setInsights] = useState<WellnessInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await insightsService.getInsights();
      setInsights(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
const insightColors = {
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  blue:    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  purple:  'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  yellow:  'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  red:     'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
};


  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wellness Insights</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Anonymous wellness demand intelligence from VITAL-ETHIO
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {insights.demandTrends.map((trend) => (
          <div
            key={trend.category}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{trend.category}</h3>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend.trend === 'up'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {trend.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(trend.changePercentage)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {trend.currentMonth}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              vs {trend.previousMonth} last month
            </p>
          </div>
        ))}
      </div>

      

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Key Insights
  </h2>
  <div className="space-y-3">
    {insights.keyInsights.map(insight => (
      <div
        key={insight.id}
        className={`p-4 rounded-lg border ${insightColors[insight.color]}`}
      >
        <p className="text-sm text-gray-900 dark:text-white">
          {insight.message}
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}

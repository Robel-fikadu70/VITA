import { useEffect, useState,useMemo } from 'react';
import { Search, Filter, X, Download } from 'lucide-react';
import { referralService, Referral, ReferralStatus } from '../../services/referralService';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate, formatDateTime } from '../../lib/utils';
import { toast } from 'sonner';

export function Referrals() {
 const [referrals, setReferrals] = useState<Referral[]>([]);
// ← no filteredReferrals state
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<string>('all');
const [categoryFilter, setCategoryFilter] = useState<string>('all');
const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
const [showFilters, setShowFilters] = useState(false);

useEffect(() => { loadReferrals(); }, []);

 
const loadReferrals = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await referralService.getAll();
    setReferrals(data);
  } catch {
    setError('Failed to load referrals. Please try again.');
  } finally {
    setLoading(false);
  }
};

 // Remove filteredReferrals state + filterReferrals useEffect
// Replace with:
const filteredReferrals = useMemo(() => {
  let filtered = [...referrals];
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(r =>
      r.customerName.toLowerCase().includes(query) ||
      r.recommendedService.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query)
    );
  }
  if (statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
  if (categoryFilter !== 'all') filtered = filtered.filter(r => r.wellnessCategory === categoryFilter);
  return filtered;
}, [referrals, searchQuery, statusFilter, categoryFilter]);

const handleStatusUpdate = async (id: string, newStatus: ReferralStatus) => {
  const previous = referrals; // snapshot
  // optimistic update
  setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  try {
    await referralService.updateStatus(id, newStatus);
    toast.success('Status updated');
  } catch {
    setReferrals(previous); // rollback
    toast.error('Failed to update status');
  }
};

  const handleExport = () => {
  if (filteredReferrals.length === 0) {
    toast.error('No referrals to export');
    return;
  }

  try {
    const escape = (val: string | undefined) => {
      if (!val) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      'Referral ID', 'Customer Name', 'Email', 'Phone',
      'Wellness Goal', 'Category', 'Recommended Service',
      'Referral Date', 'Status', 'Notes',
    ];

    const rows = filteredReferrals.map((r) => [
      escape(r.id), escape(r.customerName),
      escape(r.contactInfo.email), escape(r.contactInfo.phone),
      escape(r.wellnessGoal), escape(r.wellnessCategory),
      escape(r.recommendedService),
      escape(new Date(r.referralDate).toLocaleDateString()),
      escape(r.status), escape(r.notes),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `vital-ethio-referrals-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);

  } catch {
    toast.error('Failed to generate CSV. Please try again.');
  }
};

if (loading) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
    </div>
  );
}

if (error) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-red-500">{error}</p>
    </div>
  );
}



  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-6 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Referrals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customers referred through VITAL-ETHIO
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, service, or ID..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4 dark:text-gray-300" />
            <span className="text-sm dark:text-gray-300">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Booked">Booked</option>
              <option value="Visited">Visited</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Stress">Stress</option>
              <option value="Sleep">Sleep</option>
              <option value="Recovery">Recovery</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Fitness">Fitness</option>
            </select>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="ml-auto text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Wellness Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No referrals found matching your criteria
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((referral) => (
                  <tr
                    key={referral.id}
                    onClick={() => setSelectedReferral(referral)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {referral.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{referral.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{referral.wellnessGoal}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{referral.wellnessCategory}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {referral.recommendedService}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(referral.referralDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={referral.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReferral && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setSelectedReferral(null)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Referral Details
              </h2>
              <button
                onClick={() => setSelectedReferral(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 dark:text-gray-300" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer Name
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedReferral.customerName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Referral ID
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedReferral.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Wellness Goal
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedReferral.wellnessGoal}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Recommended Service
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedReferral.recommendedService}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedReferral.wellnessCategory}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Referral Date
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {formatDateTime(selectedReferral.referralDate)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Information
                </label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReferral.contactInfo.email}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReferral.contactInfo.phone}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Current Status
                </label>
                <div className="mt-2">
                  <StatusBadge status={selectedReferral.status} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {selectedReferral.notes}
                </p>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-3">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Booked', 'Visited', 'Cancelled'] as ReferralStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedReferral.id, status)}
                        disabled={selectedReferral.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedReferral.status === status
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        Mark as {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

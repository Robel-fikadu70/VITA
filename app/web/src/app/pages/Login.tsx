import { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { partnerService, Partner } from '../../services/partnerService';

interface LoginProps {
  onLogin: (partnerId?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [fetchingPartners, setFetchingPartners] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setFetchingPartners(true);
    try {
      const data = await partnerService.getPartners();
      setPartners(data);
    } catch (error) {
      console.error('Failed to load partners for demo', error);
    } finally {
      setFetchingPartners(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password.length >= 6) {
        toast.success('Welcome to VITAL-ETHIO Partner Portal!');
        onLogin();
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (partnerId: string) => {
    toast.success('Logging in as demo partner...');
    onLogin(partnerId);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-white">VE</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">VITAL-ETHIO</h1>
              <p className="text-emerald-100 text-sm">Partner Intelligence Portal</p>
            </div>
          </div>

          <div className="space-y-6 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-2">
                Welcome, Wellness Partners
              </h3>
              <p className="text-emerald-100 text-sm">
                Access real-time referral analytics and customer insights from the VITAL-ETHIO ecosystem
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-emerald-100 text-sm">Monthly Referrals</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">68%</div>
                <div className="text-emerald-100 text-sm">Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-emerald-100 text-sm">
            Empowering wellness centers across Ethiopia with data-driven insights
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">VE</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">VITA</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Partner Portal</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border dark:border-gray-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Partner Login
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to access your wellness partner dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@wellness-center.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <UserCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Continue as Demo Partner
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {fetchingPartners ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  partners.map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => handleDemoLogin(partner.id)}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-gray-600 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{partner.emoji}</span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {partner.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {partner.type}
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <LogIn className="w-4 h-4 text-emerald-600" />
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-4 italic">
                Using real-time data from seeded VITAL-ETHIO partners
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact{' '}
            <a href="mailto:support@vital-ethio.com" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium">
              support@vital-ethio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

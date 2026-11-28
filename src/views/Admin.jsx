import { useState, useEffect } from 'react';
import { Link } from '../lib/router-compat';
import {
  ShieldCheck, ShoppingBag, Users, Layers, TrendingUp,
  Search, CheckCircle2, Clock, XCircle, ArrowUpRight,
  Filter, RefreshCw, Eye, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templatesData from '../data/templates';
import SEO from '../components/SEO';

export default function Admin() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'users' | 'templates'
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 24980,
    totalOrders: 18,
    totalUsers: 42,
    activeInvitations: 35,
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Templates state
  const [templates, setTemplates] = useState(templatesData);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Fetch Orders
        const { data: dbOrders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
          const revenue = dbOrders
            .filter((o) => o.status === 'paid')
            .reduce((acc, o) => acc + (o.amount || 0), 0);
          setStats((prev) => ({
            ...prev,
            totalOrders: dbOrders.length,
            totalRevenue: revenue,
          }));
        } else {
          // Provide sample mock orders for demonstration
          setOrders(getMockOrders());
        }

        // Fetch Users / Profiles
        const { data: dbProfiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbProfiles && dbProfiles.length > 0) {
          setUsersList(dbProfiles);
          setStats((prev) => ({ ...prev, totalUsers: dbProfiles.length }));
        } else {
          setUsersList(getMockUsers());
        }
      } else {
        setOrders(getMockOrders());
        setUsersList(getMockUsers());
      }
    } catch (err) {
      console.warn('Admin fetch notice:', err);
      setOrders(getMockOrders());
      setUsersList(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  function getMockOrders() {
    return [
      {
        id: 'ord_1',
        order_id: 'order_Nx8aB39eL10',
        payment_id: 'pay_Nx8aZ91kL02',
        amount: 1499,
        currency: 'INR',
        package_id: 'signature',
        status: 'paid',
        customer_email: 'vikram.singh@gmail.com',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'ord_2',
        order_id: 'order_Nx7bC21kM99',
        payment_id: 'pay_Nx7bM44jP11',
        amount: 1999,
        currency: 'INR',
        package_id: 'luxury',
        status: 'paid',
        customer_email: 'priya.sharma@gmail.com',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'ord_3',
        order_id: 'order_Nx6cK82pQ12',
        payment_id: null,
        amount: 999,
        currency: 'INR',
        package_id: 'starter',
        status: 'created',
        customer_email: 'rohit.verma@outlook.com',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
  }

  function getMockUsers() {
    return [
      {
        id: 'usr_1',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@gmail.com',
        is_admin: true,
        created_at: '2026-11-20T10:00:00Z',
      },
      {
        id: 'usr_2',
        name: 'Vikram Singh',
        email: 'vikram.singh@gmail.com',
        is_admin: false,
        created_at: '2026-11-21T14:30:00Z',
      },
      {
        id: 'usr_3',
        name: 'Priya Rathore',
        email: 'priya.rathore@outlook.com',
        is_admin: false,
        created_at: '2026-11-22T09:15:00Z',
      },
    ];
  }

  const filteredOrders = orders.filter((o) =>
    (o.order_id || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.customer_email || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.package_id || '').toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredUsers = usersList.filter((u) =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory/40">
      <SEO
        title="Admin Dashboard | Aahvaaan by Vow & Vision"
        description="Platform administration, template management, orders, and user insights."
      />
      <div className="container-custom mx-auto px-4 sm:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wine/10 text-wine text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={13} className="text-gold" />
              <span>Platform Administration</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-charcoal">
              Admin Control Center
            </h1>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-champagne bg-white text-xs font-semibold text-charcoal hover:border-wine transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
            <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <span className="font-heading text-2xl font-bold text-wine">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
            <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider block mb-1">
              Paid Orders
            </span>
            <span className="font-heading text-2xl font-bold text-wine">
              {stats.totalOrders}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
            <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider block mb-1">
              Registered Users
            </span>
            <span className="font-heading text-2xl font-bold text-wine">
              {stats.totalUsers}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
            <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider block mb-1">
              Active Collections
            </span>
            <span className="font-heading text-2xl font-bold text-gold">
              4 Signature
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-champagne/60 pb-3 mb-6 font-body text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal/70 hover:bg-white'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Orders & Payments ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal/70 hover:bg-white'
            }`}
          >
            <Users size={14} />
            <span>Users & Hosts ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal/70 hover:bg-white'
            }`}
          >
            <Layers size={14} />
            <span>Manage Templates ({templates.length})</span>
          </button>
        </div>

        {/* ─── TAB 1: ORDERS ─── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="font-heading text-lg font-bold text-charcoal">
                Customer Orders & Razorpay Transactions
              </h2>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search order ID or email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b border-champagne/60 text-charcoal/50 text-[10px] uppercase font-semibold">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Package</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne/30">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-ivory/30">
                        <td className="py-3 font-mono font-medium text-wine">
                          {ord.order_id || ord.id.slice(0, 12)}
                        </td>
                        <td className="py-3 text-charcoal/80">
                          {ord.customer_email || 'Host Account'}
                        </td>
                        <td className="py-3 capitalize font-semibold text-charcoal">
                          {ord.package_id || ord.package || 'signature'}
                        </td>
                        <td className="py-3 font-bold text-charcoal">
                          ₹{(ord.amount || 1499).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status === 'paid' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                            <span>{ord.status || 'paid'}</span>
                          </span>
                        </td>
                        <td className="py-3 text-charcoal/60">
                          {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-charcoal/50">
                        No orders match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 2: USERS ─── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="font-heading text-lg font-bold text-charcoal">
                Registered Host Accounts
              </h2>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b border-champagne/60 text-charcoal/50 text-[10px] uppercase font-semibold">
                    <th className="pb-3 font-semibold">Host Name</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne/30">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-ivory/30">
                        <td className="py-3 font-semibold text-charcoal">
                          {u.name || 'Registered Host'}
                        </td>
                        <td className="py-3 text-charcoal/70">{u.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.is_admin
                                ? 'bg-wine/10 text-wine border border-wine/20'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {u.is_admin ? 'Admin' : 'Host'}
                          </span>
                        </td>
                        <td className="py-3 text-charcoal/60">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-charcoal/50">
                        No users match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: TEMPLATES ─── */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
            <h2 className="font-heading text-lg font-bold text-charcoal mb-6">
              Signature Wedding Collections
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-champagne/70 p-5 flex items-start gap-4 bg-ivory/30"
                >
                  <div className="w-20 aspect-[16/10] rounded-xl overflow-hidden bg-champagne/40 shrink-0">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold">
                        {t.collection}
                      </span>
                      <span className="text-xs font-bold text-wine">
                        ₹{(t.startingPrice || 1499).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-wine mt-0.5">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-charcoal/70 line-clamp-2 mt-1">
                      {t.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-champagne/40">
                      <Link
                        to={`/templates/${t.id}`}
                        className="text-[11px] font-semibold text-wine hover:text-gold flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

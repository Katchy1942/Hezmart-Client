import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import SalesChart from './SalesChart';
import RecentTransactions from './RecentTransactions';
import TopProducts from './TopProducts';
import { FiDollarSign, FiUsers, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const Dashboard = ({ isAdmin = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('api/v1/dashboard/stats');  
      setStats(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data');
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const icons = [FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp];

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">No data available</div>;
  }

  // Format stats data for cards
  const statsData = [
    { 
      title: 'Total Revenue', 
      value: `₦${parseFloat(stats.totalRevenue).toLocaleString()}`, 
      secondaryValue: `${stats.totalOrders} orders` 
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      secondaryValue: `₦${parseFloat(stats.totalRevenue).toLocaleString()}` 
    },
    { 
      title: isAdmin ? 'New Users' : 'New Customers', 
      value: stats.newUsers, 
      secondaryValue: `${stats.activeUsers} active` 
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers, 
      secondaryValue: `${stats.newUsers} new` 
    }
  ];

  // Format chart data from daily sales
  const chartData = {
    categories: stats.dailySales.map(item => item.date),
    series: stats.dailySales.map(item => parseFloat(item.amount))
  };

  // Format recent transactions
  const formattedTransactions = stats.recentOrders.map(order => ({
    name: order.name,
    date: order.date,
    amount: `₦${parseFloat(order.amount).toLocaleString()}`,
    status: order.status.replace('_', ' ')
  }));

  // Format top products
  const formattedTopProducts = stats.topProducts.map(product => ({
    name: product.name,
    price: `₦${parseFloat(product.price).toLocaleString()}`,
    unitsSold: product.unitsSold,
    revenue: `₦${(parseFloat(product.price) * parseInt(product.unitsSold)).toLocaleString()}`,
    coverImage:product.coverImage
  }));

  

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const IconComponent = icons[index];
          return (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              secondaryValue={stat.secondaryValue}
              icon={IconComponent ? <IconComponent className="h-6 w-6" /> : null}
            />
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SalesChart data={chartData} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Sales Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Total Items Sold</p>
                <p className="text-2xl font-bold">
                  {stats.topProducts.reduce((sum, product) => sum + parseInt(product.unitsSold), 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₦{parseFloat(stats.totalRevenue).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">{stats.totalOrders} Orders</p>
                {stats.recentOrders.length > 0 && (
                  <p className="text-sm">
                    {new Date(stats.recentOrders[0].date).toLocaleDateString()} -{' '}
                    {new Date(stats.recentOrders[stats.recentOrders.length - 1].date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={formattedTransactions} />
        <TopProducts products={formattedTopProducts} />
      </div>
    </div>
  );
};

export default Dashboard;
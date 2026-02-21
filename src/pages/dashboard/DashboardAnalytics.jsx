import { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, MousePointer, ExternalLink, Calendar, Download, Users, Clock, Star, ArrowRight } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

const DashboardAnalytics = () => {
  const { deliveryProviders } = useAppData();
  const [dateRange, setDateRange] = useState('30d');

  // Mock analytics data
  const overviewStats = {
    profileViews: { value: 3456, change: 18.5, trend: 'up' },
    deliveryClicks: { value: 892, change: 12.3, trend: 'up' },
    searchAppearances: { value: 5678, change: 8.7, trend: 'up' },
    avgTimeOnPage: { value: '2:34', change: -5.2, trend: 'down' },
  };

  const deliveryStats = [
    { provider: 'Bento', clicks: 423, percentage: 47.4, color: '#ff6b35' },
    { provider: "Let's Eat", clicks: 312, percentage: 35.0, color: '#22c55e' },
    { provider: 'Cayman Delivery', clicks: 157, percentage: 17.6, color: '#3b82f6' },
  ];

  const weeklyViews = [
    { day: 'Mon', views: 145 },
    { day: 'Tue', views: 198 },
    { day: 'Wed', views: 234 },
    { day: 'Thu', views: 312 },
    { day: 'Fri', views: 478 },
    { day: 'Sat', views: 523 },
    { day: 'Sun', views: 421 },
  ];

  const peakHours = [
    { hour: '11AM', views: 89 },
    { hour: '12PM', views: 156 },
    { hour: '1PM', views: 134 },
    { hour: '5PM', views: 98 },
    { hour: '6PM', views: 178 },
    { hour: '7PM', views: 234 },
    { hour: '8PM', views: 198 },
    { hour: '9PM', views: 123 },
  ];

  const trafficSources = [
    { source: 'CayEats Homepage', percentage: 35, visits: 1210 },
    { source: 'Search Results', percentage: 28, visits: 968 },
    { source: 'Cuisine Category', percentage: 22, visits: 760 },
    { source: 'Direct Link', percentage: 15, visits: 518 },
  ];

  const maxWeeklyViews = Math.max(...weeklyViews.map(d => d.views));
  const maxPeakHours = Math.max(...peakHours.map(d => d.views));

  const StatCard = ({ title, value, change, trend, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{Math.abs(change)}% from last period</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your restaurant's performance on CayEats</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Profile Views" value={overviewStats.profileViews.value} change={overviewStats.profileViews.change} trend={overviewStats.profileViews.trend} icon={Eye} />
        <StatCard title="Delivery Clicks" value={overviewStats.deliveryClicks.value} change={overviewStats.deliveryClicks.change} trend={overviewStats.deliveryClicks.trend} icon={ExternalLink} />
        <StatCard title="Search Appearances" value={overviewStats.searchAppearances.value} change={overviewStats.searchAppearances.change} trend={overviewStats.searchAppearances.trend} icon={Users} />
        <StatCard title="Avg. Time on Page" value={overviewStats.avgTimeOnPage.value} change={overviewStats.avgTimeOnPage.change} trend={overviewStats.avgTimeOnPage.trend} icon={Clock} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Views Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Views by Day of Week</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyViews.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-900 mb-2">{day.views}</span>
                  <div 
                    className="w-full max-w-10 bg-linear-to-t from-primary to-primary/60 rounded-t-lg transition-all"
                    style={{ height: `${(day.views / maxWeeklyViews) * 140}px` }}
                  />
                </div>
                <span className="text-sm text-gray-500 mt-2">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Peak day: <span className="font-semibold text-gray-900">Saturday</span> with <span className="font-semibold text-primary">523 views</span>
            </p>
          </div>
        </div>

        {/* Delivery Provider Clicks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Delivery Provider Clicks</h3>
          <div className="space-y-4">
            {deliveryStats.map((provider) => (
              <div key={provider.provider}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: provider.color }}
                    />
                    <span className="font-medium text-gray-900">{provider.provider}</span>
                  </div>
                  <span className="text-sm text-gray-600">{provider.clicks} clicks ({provider.percentage}%)</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all shadow-md border border-white"
                    style={{ width: `${provider.percentage}%`, background: `linear-gradient(90deg, ${provider.color} 80%, #fff 100%)` }}
                  >
                    <span className="pl-2 text-xs font-semibold text-white drop-shadow" style={{ color: '#fff', textShadow: '0 1px 2px #0008' }}>
                      {provider.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Total clicks to delivery providers: <span className="font-semibold text-gray-900">{deliveryStats.reduce((sum, p) => sum + p.clicks, 0)}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              These clicks redirect customers to order from your preferred delivery services
            </p>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Peak Viewing Hours</h3>
          <div className="space-y-3">
            {peakHours.map((hour) => (
              <div key={hour.hour} className="flex items-center gap-4">
                <span className="w-12 text-sm text-gray-600">{hour.hour}</span>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full flex items-center justify-end pr-2 shadow-md border border-white"
                    style={{ width: `${(hour.views / maxPeakHours) * 100}%` }}
                  >
                    <span className="text-xs font-semibold text-white drop-shadow" style={{ color: '#fff', textShadow: '0 1px 2px #0008' }}>{hour.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Most active: <span className="font-semibold text-gray-900">7PM</span> - Dinner planning time!
            </p>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">How Customers Find You</h3>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center gap-4">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{source.source}</span>
                    <span className="text-sm text-gray-600">{source.visits.toLocaleString()} visits</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full shadow-md border border-white"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Performance Insights</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Your profile views increased by 18.5% this month - great visibility!</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Consider promoting during 6-8 PM when customer activity peaks</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Weekend traffic is 40% higher - perfect time for specials!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;

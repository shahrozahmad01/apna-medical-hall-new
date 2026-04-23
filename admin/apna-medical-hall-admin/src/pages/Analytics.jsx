import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    revenue: [],
    orders: [],
    products: [],
    customers: [],
    topProducts: [],
    categorySales: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/admin/analytics?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const revenueChartData = {
    labels: analytics.revenue.map(item => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: analytics.revenue.map(item => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const ordersChartData = {
    labels: analytics.orders.map(item => item.date),
    datasets: [
      {
        label: 'Orders',
        data: analytics.orders.map(item => item.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  }

  const categoryChartData = {
    labels: analytics.categorySales.map(item => item.category),
    datasets: [
      {
        data: analytics.categorySales.map(item => item.sales),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(6, 182, 212, 0.8)',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3>₹{analytics.totalRevenue?.toLocaleString() || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-600 ml-2">vs last period</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3>{analytics.totalOrders || 0}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+8.2%</span>
            <span className="text-gray-600 ml-2">vs last period</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3>{analytics.totalProducts || 0}</h3>
              <p>Products Sold</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            <span className="text-red-600">-2.1%</span>
            <span className="text-gray-600 ml-2">vs last period</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3>{analytics.totalCustomers || 0}</h3>
              <p>New Customers</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+15.3%</span>
            <span className="text-gray-600 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <Line data={revenueChartData} options={chartOptions} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
          <Bar data={ordersChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <Doughnut data={categoryChartData} options={doughnutOptions} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {analytics.topProducts?.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.sales} units sold</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">₹{product.revenue}</span>
              </div>
            )) || (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
          <div className="text-3xl font-bold text-primary-600">
            ₹{analytics.averageOrderValue ? analytics.averageOrderValue.toFixed(2) : '0.00'}
          </div>
          <p className="text-sm text-gray-600 mt-2">Per order average</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
          <div className="text-3xl font-bold text-green-600">
            {analytics.conversionRate ? analytics.conversionRate.toFixed(1) : '0.0'}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Visitors to customers</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Retention</h3>
          <div className="text-3xl font-bold text-blue-600">
            {analytics.retentionRate ? analytics.retentionRate.toFixed(1) : '0.0'}%
          </div>
          <p className="text-sm text-gray-600 mt-2">Repeat customers</p>
        </div>
      </div>
    </div>
  )
}
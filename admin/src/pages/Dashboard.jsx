import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
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
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    dailyRevenue: 0,
    dailyOrders: 0
  })
  const [revenueData, setRevenueData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, revenueRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/revenue-chart'),
        api.get('/admin/orders-chart')
      ])

      setStats(statsRes.data)
      setRevenueData(revenueRes.data)
      setOrdersData(ordersRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const revenueChartData = {
    labels: revenueData.map(item => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(item => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const ordersChartData = {
    labels: ordersData.map(item => item.date),
    datasets: [
      {
        label: 'Orders',
        data: ordersData.map(item => item.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+8.2%</span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Active products in inventory
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3>{stats.totalCustomers}</h3>
              <p>Total Customers</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+15.3%</span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stats-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Revenue</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            ₹{stats.dailyRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Revenue generated today</p>
        </div>

        <div className="stats-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Orders</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.dailyOrders}
          </div>
          <p className="text-sm text-gray-600">Orders placed today</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h3>
          <Line data={revenueChartData} options={chartOptions} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend (Last 30 Days)</h3>
          <Bar data={ordersChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">New order received</p>
              <p className="text-sm text-gray-600">Order #12345 - ₹299</p>
            </div>
            <span className="text-sm text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Product stock updated</p>
              <p className="text-sm text-gray-600">Paracetamol - Stock: 150</p>
            </div>
            <span className="text-sm text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">New customer registered</p>
              <p className="text-sm text-gray-600">John Doe - john@example.com</p>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Prescriptions from './pages/Prescriptions'
import Customers from './pages/Customers'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'
import { api } from './utils/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.user.role === 'Admin') {
        setIsAuthenticated(true)
        setUser(response.data.user)
      } else {
        localStorage.removeItem('adminToken')
        toast.error('Access denied. Admin privileges required.')
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token, userData) => {
    localStorage.setItem('adminToken', token)
    setIsAuthenticated(true)
    setUser(userData)
    toast.success('Welcome back, Admin!')
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setUser(null)
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={login} />
          )
        }
      />

      {isAuthenticated ? (
        <Route path="/" element={<Layout user={user} onLogout={logout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

export default App
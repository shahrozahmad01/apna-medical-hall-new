import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react'

const statusConfig = {
  Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  Packed: { color: 'bg-blue-100 text-blue-800', icon: Package },
  'Out for delivery': { color: 'bg-orange-100 text-orange-800', icon: Truck },
  Delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  )

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'Delivered')
      .reduce((total, order) => total + order.totalAmount, 0)
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
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="text-sm text-gray-600">
          Total Revenue: <span className="font-semibold text-green-600">₹{getTotalRevenue().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter(order => order.status === status).length
          const Icon = config.icon
          return (
            <div key={status} className="stats-card">
              <div className="flex items-center">
                <Icon className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <h3>{count}</h3>
                  <p>{status}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Packed">Packed</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = statusConfig[order.status]
          const StatusIcon = statusInfo.icon

          return (
            <div key={order._id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.customer?.name} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {order.status}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                  <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.product?.name} (x{item.quantity})
                    </span>
                  ))}
                  {order.items?.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>

                <div className="flex space-x-2">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Packed')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Mark as Packed
                    </button>
                  )}
                  {order.status === 'Packed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Out for delivery')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'Out for delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Delivered')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus === 'all' ? 'No orders have been placed yet.' : `No orders with status "${filterStatus}".`}
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedOrder(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Order Details - #{selectedOrder._id.slice(-8)}
                    </h3>

                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {selectedOrder.customer?.name}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {selectedOrder.customer?.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress?.phone}
                          </div>
                          <div>
                            <span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {selectedOrder.items?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-3">
                                {item.product?.image && (
                                  <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${item.product.image}`}
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{item.product?.name}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>₹{selectedOrder.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Status */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedOrder.status].color}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
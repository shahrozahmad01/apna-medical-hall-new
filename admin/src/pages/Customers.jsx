import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Users, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers')
      setCustomers(response.data)
    } catch (error) {
      toast.error('Failed to fetch customers')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <div className="text-sm text-gray-600">
          Total Customers: <span className="font-semibold">{customers.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search customers by name or email..."
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer._id} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShoppingBag className="h-4 w-4 mr-2" />
                {customer.orderCount || 0} orders
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium text-green-600 mr-2">
                  ₹{customer.totalSpent || 0}
                </span>
                total spent
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Joined {new Date(customer.createdAt).toLocaleDateString()}
            </div>

            <button
              onClick={() => setSelectedCustomer(customer)}
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No customers have registered yet.'}
          </p>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedCustomer(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                      Customer Details - {selectedCustomer.name}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Name</p>
                                <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-xs font-bold bg-gray-200 rounded">
                                ID
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Customer ID</p>
                                <p className="text-sm text-gray-600">#{selectedCustomer._id.slice(-8)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-xs">
                                📅
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Joined</p>
                                <p className="text-sm text-gray-600">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary-600">{selectedCustomer.orderCount || 0}</p>
                              <p className="text-sm text-gray-600">Total Orders</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">₹{selectedCustomer.totalSpent || 0}</p>
                              <p className="text-sm text-gray-600">Total Spent</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order History */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Recent Orders</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                            selectedCustomer.orders.slice(0, 10).map((order) => (
                              <div key={order._id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    Order #{order._id.slice(-8)}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Out for delivery' ? 'bg-orange-100 text-orange-800' :
                                    order.status === 'Packed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className="font-medium text-gray-900">₹{order.totalAmount}</span>
                                </div>
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600">
                                    {order.items?.length || 0} items
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <ShoppingBag className="mx-auto h-8 w-8 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500">No orders yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
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
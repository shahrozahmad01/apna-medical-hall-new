import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, CheckCircle, XCircle, FileText } from 'lucide-react'

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/admin/prescriptions')
      setPrescriptions(response.data)
    } catch (error) {
      toast.error('Failed to fetch prescriptions')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePrescriptionStatus = async (prescriptionId, status) => {
    try {
      await api.put(`/admin/prescriptions/${prescriptionId}/status`, { status })
      toast.success(`Prescription ${status.toLowerCase()} successfully`)
      fetchPrescriptions()
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} prescription`)
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Prescription Management</h1>
        <div className="text-sm text-gray-600">
          Total Prescriptions: <span className="font-semibold">{prescriptions.length}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats-card">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3>{prescriptions.filter(p => p.status === 'pending').length}</h3>
              <p>Pending Review</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3>{prescriptions.filter(p => p.status === 'approved').length}</h3>
              <p>Approved</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <h3>{prescriptions.filter(p => p.status === 'rejected').length}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Prescription #{prescription._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {prescription.customer?.name} • {new Date(prescription.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  prescription.status === 'approved' ? 'bg-green-100 text-green-800' :
                  prescription.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPrescription(prescription)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </button>
                {prescription.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updatePrescriptionStatus(prescription._id, 'approved')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => updatePrescriptionStatus(prescription._id, 'rejected')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            {prescription.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Notes:</span> {prescription.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {prescriptions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No prescriptions have been uploaded yet.
          </p>
        </div>
      )}

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedPrescription(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Prescription Details - #{selectedPrescription._id.slice(-8)}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Prescription Info */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Name:</span> {selectedPrescription.customer?.name}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {selectedPrescription.customer?.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {selectedPrescription.customer?.phone}
                            </div>
                            <div>
                              <span className="font-medium">Upload Date:</span> {new Date(selectedPrescription.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedPrescription.status === 'approved' ? 'bg-green-100 text-green-800' :
                            selectedPrescription.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                          </div>
                        </div>

                        {selectedPrescription.notes && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                            <p className="text-sm text-gray-700">{selectedPrescription.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Prescription Image */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Prescription Image</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {selectedPrescription.image ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${selectedPrescription.image}`}
                              alt="Prescription"
                              className="w-full max-h-96 object-contain rounded-lg"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                              <FileText className="h-12 w-12 text-gray-400" />
                              <span className="ml-2 text-gray-500">No image available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedPrescription.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updatePrescriptionStatus(selectedPrescription._id, 'approved')
                        setSelectedPrescription(null)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 sm:ml-3"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        updatePrescriptionStatus(selectedPrescription._id, 'rejected')
                        setSelectedPrescription(null)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 sm:ml-3"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPrescription(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
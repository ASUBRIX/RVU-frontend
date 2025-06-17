import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, Spinner, Modal, Button } from 'react-bootstrap'
import * as yup from 'yup'
import { FaMapMarkerAlt, FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa'
import TextFormInput from '@/components/form/TextFormInput'
import SelectFormInput from '@/components/form/SelectFormInput'
import { useNotificationContext } from '@/context/useNotificationContext'
// import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/helpers/studentApi'

const schema = yup.object({
  type: yup.string().required('Select address type'),
  street: yup.string().required('Enter street address'),
  city: yup.string().required('Enter city'),
  state: yup.string().required('Enter state'),
  zipCode: yup
    .string()
    .required('Enter ZIP code')
    .matches(/^\d{5}(-\d{4})?$/, 'Enter valid ZIP code'),
  country: yup.string().required('Select country'),
})

const ADDRESS_TYPES = [
  { value: 'permanent', label: 'Permanent Address' },
  { value: 'mailing', label: 'Mailing Address' },
  { value: 'emergency', label: 'Emergency Contact Address' },
]

const COUNTRIES = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Other', label: 'Other' },
]

const StudentAddress = () => {
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { showNotification } = useNotificationContext()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  })

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAddresses = [
        {
          id: 1,
          type: 'permanent',
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'United States',
          isDefault: true,
        },
        {
          id: 2,
          type: 'mailing',
          street: '456 College Ave',
          city: 'University City',
          state: 'MO',
          zipCode: '63130',
          country: 'United States',
          isDefault: false,
        },
      ]
      setAddresses(mockAddresses)
      setLoading(false)
    }, 1000)
  }, [])

  const handleAddNew = () => {
    setEditingAddress(null)
    reset({
      type: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    })
    setShowModal(true)
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    reset({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    })
    setShowModal(true)
  }

  const onSubmit = async (formData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingAddress) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id ? { ...addr, ...formData } : addr
          )
        )
        showNotification({
          title: 'Success',
          message: 'Address updated successfully!',
          variant: 'success',
          delay: 3000,
        })
      } else {
        // Create new address
        const newAddress = {
          ...formData,
          id: Date.now(),
          isDefault: addresses.length === 0,
        }
        setAddresses((prev) => [...prev, newAddress])
        showNotification({
          title: 'Success',
          message: 'Address added successfully!',
          variant: 'success',
          delay: 3000,
        })
      }

      setShowModal(false)
      setEditingAddress(null)
    } catch (err) {
      console.error('Operation failed:', err)
      showNotification({
        title: 'Error',
        message: 'Failed to save address. Please try again.',
        variant: 'danger',
        delay: 3000,
      })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setAddresses((prev) => prev.filter((addr) => addr.id !== id))
        showNotification({
          title: 'Success',
          message: 'Address deleted successfully!',
          variant: 'success',
          delay: 3000,
        })
      } catch (err) {
        console.error('Delete failed:', err)
        showNotification({
          title: 'Error',
          message: 'Failed to delete address. Please try again.',
          variant: 'danger',
          delay: 3000,
        })
      }
    }
  }

  const handleSetDefault = async (id) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      )
      showNotification({
        title: 'Success',
        message: 'Default address updated successfully!',
        variant: 'success',
        delay: 3000,
      })
    } catch (err) {
      console.error('Set default failed:', err)
      showNotification({
        title: 'Error',
        message: 'Failed to set default address. Please try again.',
        variant: 'danger',
        delay: 3000,
      })
    }
  }

  const getAddressTypeLabel = (type) => {
    return ADDRESS_TYPES.find((t) => t.value === type)?.label || type
  }

  const getAddressTypeBadgeClass = (type) => {
    switch (type) {
      case 'permanent':
        return 'bg-primary'
      case 'mailing':
        return 'bg-info'
      case 'emergency':
        return 'bg-warning'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <Card className="px-4 py-3" style={{ maxWidth: '100%', width: '100%' }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">
              <FaMapMarkerAlt className="me-2" />
              Address Information
            </h5>
            <Button variant="primary" size="sm" onClick={handleAddNew}>
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-5">
              <FaMapMarkerAlt size={48} className="text-muted mb-3" />
              <h6 className="text-muted">No addresses saved yet</h6>
              <p className="text-muted mb-3">Add your first address to get started</p>
              <Button variant="primary" onClick={handleAddNew}>
                Add Address
              </Button>
            </div>
          ) : (
            <div className="row gx-3">
              {addresses.map((address) => (
                <div key={address.id} className="col-12 col-lg-6 mb-3">
                  <Card className="h-100 border-0" style={{ backgroundColor: '#f8fafc' }}>
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex gap-2">
                          <span className={`badge ${getAddressTypeBadgeClass(address.type)} text-white`}>
                            {getAddressTypeLabel(address.type)}
                          </span>
                          {address.isDefault && (
                            <span className="badge bg-success text-white">
                              <FaStar className="me-1" size={10} />
                              Default
                            </span>
                          )}
                        </div>
                        <div className="d-flex gap-1">
                          {!address.isDefault && (
                            <button
                              className="btn btn-link btn-sm p-1 text-warning"
                              onClick={() => handleSetDefault(address.id)}
                              title="Set as default"
                            >
                              <FaRegStar />
                            </button>
                          )}
                          <button
                            className="btn btn-link btn-sm p-1 text-primary"
                            onClick={() => handleEdit(address)}
                            title="Edit address"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-link btn-sm p-1 text-danger"
                            onClick={() => handleDelete(address.id)}
                            title="Delete address"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-dark">
                        <p className="fw-medium mb-1">{address.street}</p>
                        <p className="mb-1">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="mb-0 text-muted small">{address.country}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gx-2">
                  <div className="col-md-6 mb-3">
                    <SelectFormInput
                      name="type"
                      label="Address Type"
                      control={control}
                      options={ADDRESS_TYPES}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <SelectFormInput
                      name="country"
                      label="Country"
                      control={control}
                      options={COUNTRIES}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <TextFormInput name="street" label="Street Address" control={control} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextFormInput name="city" label="City" control={control} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextFormInput name="state" label="State" control={control} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextFormInput name="zipCode" label="ZIP Code" control={control} />
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  editingAddress ? 'Update Address' : 'Add Address'
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Card>
  )
}

export default StudentAddress
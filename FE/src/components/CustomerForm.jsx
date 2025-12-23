import { useState, useEffect } from 'react'
import '../styles/CustomerForm.css'
import axios from 'axios'
import api, { BASE_URL } from '../assets/js/axiosConfig';

export default function CustomerForm({ initialData, onSubmit, onCancel, isEditMode = false }) {
 
  const [formData, setFormData] = useState({
    upiDeviceSerialNumber: '',
    uniqueIdentifier: '',
    customerCode: '',
    customerName: '',
    company: '',
    devicetype: '',
    cLicenseURL: '',
    versionDetails: ''
  })

  const [availableSerials, setAvailableSerials] = useState([])
  const [loading, setLoading] = useState(false)

  // FETCH AVAILABLE SERIAL NUMBERS
  useEffect(() => {
    const fetchAvailableSerials = async () => {
      try {
        const response = await api.get(`${BASE_URL}/get_serial_numbers/`)
        
        if (response.data && response.data.data) {
          // Filter: approved (1) and not allocated (0 or not 2)
          const available = response.data.data.filter(item => 
            item.isapproved === 1 && item.isallocated == 0
          )
          setAvailableSerials(available)
        }
      } catch (err) {
        console.error("Error fetching serial numbers:", err)
        window.alert("Failed to fetch available serial numbers")
      }
    }

    // Only fetch serials if we're adding new (not editing)
    if (!isEditMode) {
      fetchAvailableSerials()
    }
  }, [isEditMode])


  useEffect(() => {
    if (initialData) {
      setFormData({
        upiDeviceSerialNumber: initialData.upiDeviceSerialNumber || '',
        uniqueIdentifier: initialData.uniqueIdentifier || '',
        customerCode: initialData.customerCode || '',
        customerName: initialData.customerName || '',
        company: initialData.company || '',
        devicetype: initialData.devicetype || '',
        cLicenseURL: initialData.cLicenseURL || '',
        versionDetails: initialData.versionDetails || ''
      })
    }
  }, [initialData])


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSerialChange = (e) => {
    const serial = e.target.value
    
    // Auto-detect device type from serial format: YYYYMM{AMP|API}XXXXXXB
    let detectedType = ''
    if (serial.includes('AMP')) {
      detectedType = 'AMP'
    } else if (serial.includes('API')) {
      detectedType = 'API'
    }
    
    setFormData(prev => ({
      ...prev,
      upiDeviceSerialNumber: serial,
      devicetype: detectedType
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {

        const response = await api.post(
          `${BASE_URL}/update_customer_mapping/`, 
          {
            serialnumber: formData.upiDeviceSerialNumber,
            uniqueIdentifier: formData.uniqueIdentifier,
            customerCode: parseInt(formData.customerCode),
            customerName: formData.customerName,
            company: formData.company,
            devicetype: formData.devicetype,
            cLicenseURL: formData.cLicenseURL,
            versionDetails: formData.versionDetails
          }
        )

        // HANDLE RESPONSE FROM UPDATE PROCEDURE
        const { status: responseStatus, message } = response.data

        if (responseStatus === 'success') {
          window.alert("Device-customer mapping updated successfully!")
          onSubmit(formData) // Notify parent to refresh list
        } else if (responseStatus === 'not_found') {
          window.alert(message || "Serial number not found")
        } else if (responseStatus === 'error') {
          window.alert(message || "Failed to update mapping")
        }

      } else {

        const response = await api.post(
          `${BASE_URL}/create_customer_mapping/`,
          {
            serialnumber: formData.upiDeviceSerialNumber,
            uniqueIdentifier: formData.uniqueIdentifier,
            customerCode: parseInt(formData.customerCode),
            customerName: formData.customerName,
            company: formData.company,
            devicetype: formData.devicetype,
            licenseUrl: formData.cLicenseURL,
            versionDetails: formData.versionDetails
          }
        )

        // HANDLE RESPONSE FROM INSERT PROCEDURE
        const { status: responseStatus, message } = response.data

        if (responseStatus === 'success') {
          window.alert("Device-customer mapping created successfully!")
          onSubmit(formData) // Notify parent to refresh list
        } else if (responseStatus === 'duplicate') {
          window.alert(message || "This serial number is already mapped to a customer")
        } else if (responseStatus === 'error') {
          window.alert(message || "Failed to create mapping")
        }
      }

    } catch (err) {
      console.error("Error submitting form:", err)
      
      // Handle different error scenarios
      if (!err.response) {
        window.alert("Network error! Please check your connection.")
      } else {
        const errorMessage = err.response.data?.message || "An error occurred. Please try again."
        window.alert(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      
      <div className="customer-form__field">
        <label htmlFor="upiDeviceSerialNumber" className="customer-form__label">
          Device Serial Number *
        </label>
        {isEditMode ? (
          <input 
            type="text" 
            id="upiDeviceSerialNumber" 
            name="upiDeviceSerialNumber" 
            className="customer-form__input" 
            value={formData.upiDeviceSerialNumber}
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        ) : (
          <select
            id="upiDeviceSerialNumber"
            name="upiDeviceSerialNumber"
            className="customer-form__input"
            value={formData.upiDeviceSerialNumber}
            onChange={handleSerialChange}
            required
          >
            <option value="">Select Serial Number</option>
            {availableSerials.map(serial => (
              <option key={serial.serialnumber} value={serial.serialnumber}>
                {serial.serialnumber}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Device Type - Auto-populated */}
      <div className="customer-form__field">
        <label htmlFor="devicetype" className="customer-form__label">
          Device Type
        </label>
        <input 
          type="text" 
          id="devicetype" 
          name="devicetype" 
          className="customer-form__input" 
          value={formData.devicetype}
          readOnly
          placeholder="Auto-detected from serial"
          style={{ backgroundColor: '#f5f5f5' }}
        />
      </div>

      {/* Unique Identifier */}
      <div className="customer-form__field">
        <label htmlFor="uniqueIdentifier" className="customer-form__label">
          Unique Identifier (UID) *
        </label>
        <input 
          type="text" 
          id="uniqueIdentifier" 
          name="uniqueIdentifier" 
          className="customer-form__input" 
          value={formData.uniqueIdentifier} 
          onChange={handleChange} 
          placeholder="e.g. UID-12345678" 
          required 
        />
      </div>


      {/* Customer Code */}
      <div className="customer-form__field">
        <label htmlFor="customerCode" className="customer-form__label">
          Customer Code *
        </label>
        <input
          type="number"
          id="customerCode"
          name="customerCode"
          className="customer-form__input"
          value={formData.customerCode}
          onChange={handleChange}
          placeholder="e.g. 1001"
          required
        />
      </div>

      {/* Customer Name */}
      <div className="customer-form__field">
        <label htmlFor="customerName" className="customer-form__label">
          Customer Name *
        </label>
        <input 
          type="text" 
          id="customerName" 
          name="customerName" 
          className="customer-form__input" 
          value={formData.customerName} 
          onChange={handleChange} 
          placeholder="e.g. John Doe" 
          required 
        />
      </div>

      {/* Company */}
      <div className="customer-form__field">
        <label htmlFor="company" className="customer-form__label">
          Company/Organization *
        </label>
        <input 
          type="text" 
          id="company" 
          name="company" 
          className="customer-form__input" 
          value={formData.company} 
          onChange={handleChange} 
          placeholder="e.g. Acme Corp" 
          required 
        />
      </div>


      {/* License URL */}
      <div className="customer-form__field">
        <label htmlFor="cLicenseURL" className="customer-form__label">
          License URL *
        </label>
        <input 
          type="url" 
          id="cLicenseURL" 
          name="cLicenseURL" 
          className="customer-form__input" 
          value={formData.cLicenseURL} 
          onChange={handleChange} 
          placeholder="https://licenses.example.com/..." 
          required 
        />
      </div>

      {/* Version */}
      <div className="customer-form__field">
        <label htmlFor="versionDetails" className="customer-form__label">
          Software Version *
        </label>
        <input 
          type="text" 
          id="versionDetails" 
          name="versionDetails" 
          className="customer-form__input" 
          value={formData.versionDetails} 
          onChange={handleChange} 
          placeholder="e.g. 1.0.5" 
          required 
        />
      </div>

      {/* Form Actions */}
      <div className="customer-form__actions">
        <button 
          type="button" 
          className="customer-form__btn customer-form__btn--cancel" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="customer-form__btn customer-form__btn--submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : (isEditMode ? 'Update Mapping' : 'Create Mapping')}
        </button>
      </div>
    </form>
  )
}
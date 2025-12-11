import { useState, useEffect } from 'react'
import '../styles/CustomerForm.css'

export default function CustomerForm({ initialData, onSubmit, onCancel, isEditMode = false }) {

  const [formData, setFormData] = useState({
    customercode: '',
    serialnumber: '',
    customername: '',
    phonenumber: '',
    licenseurl: '',
    version: '',
    uniqueidentifier: ''
  })

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        customercode: initialData.customercode || '',
        serialnumber: initialData.serialnumber || '',
        customername: initialData.customername || '',
        phonenumber: initialData.phonenumber || '',
        licenseurl: initialData.licenseurl || '',
        version: initialData.version || '',
        uniqueidentifier: initialData.uniqueidentifier || ''
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      
      {/* Customer Code */}
      <div className="customer-form__field">
        <label htmlFor="customercode" className="customer-form__label">
          Customer Code
        </label>
        <input
          type="text"
          id="customercode"
          name="customercode"
          className="customer-form__input"
          value={formData.customercode}
          onChange={handleChange}
          placeholder="e.g. CUST-001"
          required
        />
      </div>

      {/* Customer Name */}
      <div className="customer-form__field">
        <label htmlFor="customername" className="customer-form__label">
          Customer Name
        </label>
        <input 
          type="text" 
          id="customername" 
          name="customername" 
          className="customer-form__input" 
          value={formData.customername} 
          onChange={handleChange} 
          placeholder="e.g. Acme Corp" 
          required 
        />
      </div>

      {/* Serial Number */}
      <div className="customer-form__field">
        <label htmlFor="serialnumber" className="customer-form__label">
          Serial Number
        </label>
        <input 
          type="text" 
          id="serialnumber" 
          name="serialnumber" 
          className="customer-form__input" 
          value={formData.serialnumber}
          onChange={handleChange} 
          placeholder="e.g. SN-998877" 
          required 
        />
      </div>

      {/* Phone Number */}
      <div className="customer-form__field">
        <label htmlFor="phonenumber" className="customer-form__label">
          Phone Number
        </label>
        <input 
          type="tel" 
          id="phonenumber" 
          name="phonenumber" 
          className="customer-form__input" 
          value={formData.phonenumber} 
          onChange={handleChange} 
          placeholder="Phone Number" 
          required 
        />
      </div>

      {/* License URL */}
      <div className="customer-form__field">
        <label htmlFor="licenseurl" className="customer-form__label">
          License URL
        </label>
        <input 
          type="url" 
          id="licenseurl" 
          name="licenseurl" 
          className="customer-form__input" 
          value={formData.licenseurl} 
          onChange={handleChange} 
          placeholder="https://..." 
          required 
        />
      </div>

      {/* Version */}
      <div className="customer-form__field">
        <label htmlFor="version" className="customer-form__label">
          Version
        </label>
        <input 
          type="text" 
          id="version" 
          name="version" 
          className="customer-form__input" 
          value={formData.version} 
          onChange={handleChange} 
          placeholder="e.g. 1.0.5" 
          required 
        />
      </div>

      {/* Unique ID */}
      <div className="customer-form__field">
        <label htmlFor="uniqueidentifier" className="customer-form__label">
          Unique ID (UID)
        </label>
        <input 
          type="text" 
          id="uniqueidentifier" 
          name="uniqueidentifier" 
          className="customer-form__input" 
          value={formData.uniqueidentifier} 
          onChange={handleChange} 
          placeholder="Enter Unique ID manually" 
          required 
        />
      </div>

      {/* Form Actions */}
      <div className="customer-form__actions">
        <button 
          type="button" 
          className="customer-form__btn customer-form__btn--cancel" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="customer-form__btn customer-form__btn--submit"
        >
          {isEditMode ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
import { useState, useEffect } from 'react'
import Modal from '../components/Modal.jsx'
import CustomerForm from '../components/CustomerForm.jsx'
import '../styles/ListingPage.css'
import axios from 'axios'
import api, { BASE_URL } from '../assets/js/axiosConfig';

export default function ListingPage() {

  // Store list of device-customer mappings
  const [mappings, setMappings] = useState([])
  
  // Track which modal is open ('add', 'edit', or null)
  const [modalType, setModalType] = useState(null)
  
  // Track which mapping is being edited
  const [selectedMapping, setSelectedMapping] = useState(null)
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  // FILTER STATE
  const [filters, setFilters] = useState({
    serialNumber: '',
    customerCode: '',
    customerName: '',
    company: '',
    deviceType: '',
    fromDate: '',
    toDate: '',
    approvedStatus: '-1', // -1 means all
    searchText: ''
  })
  
  // SORTING STATE (updated column indices)
  const [sortConfig, setSortConfig] = useState({
    columnIndex: 6, // Default: sort by created date
    direction: 1 // 1 = DESC, 0 = ASC
  })

  // FILTER PANEL TOGGLE (for mobile)
  const [showFilters, setShowFilters] = useState(false)

  // TRIGGER for re-fetching when filters applied/reset
  const [filterTrigger, setFilterTrigger] = useState(0)

  // FETCH MAPPINGS FROM DATABASE
  useEffect(() => {
    fetchMappings(true)
  }, [currentPage, pageSize, sortConfig, filterTrigger]) // Re-fetch when these change

  const fetchMappings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      // Build query parameters
      const params = {
        serialNumber: filters.serialNumber.trim() || null,
        customerCode: filters.customerCode.trim() || null,
        customerName: filters.customerName.trim() || null,
        company: filters.company.trim() || null,
        deviceType: filters.deviceType || null,
        fromDate: filters.fromDate || '2020-01-01', // Default old date
        toDate: filters.toDate || new Date().toISOString().split('T')[0], // Today
        approvedStatus: filters.approvedStatus === '-1' ? -1 : parseInt(filters.approvedStatus),
        searchText: filters.searchText.trim() || '',
        pageNumber: (currentPage - 1) * pageSize, // Convert to offset
        pageSize: pageSize,
        sortingOrderIndex: sortConfig.columnIndex,
        sortingOrderDirection: sortConfig.direction
      }

      const response = await api.get(`${BASE_URL}/get_customer_mappings/`, {
        params: params
      })

      if (response.data && response.data.data) {
        // Format data to match our component structure
        const formattedData = response.data.data.map(item => ({
          id: item.id || item.upiDeviceSerialNumber,
          upiDeviceSerialNumber: item.upiDeviceSerialNumber,
          uniqueIdentifier: item.uniqueIdentifier,
          customerCode: item.customerCode,
          customerName: item.customerName,
          company: item.company,
          devicetype: item.devicetype,
          cLicenseURL: item.cLicenseURL,
          versionDetails: item.versionDetails,
          isApproved: item.isApproved,
          createdOn: item.createdOn,
          modifiedOn: item.modifiedOn
        }))
        setMappings(formattedData)
        
        // Set total count for pagination
        setTotalCount(response.data.totalCount || 0)
      }
    } catch (err) {
      console.error("Error fetching mappings:", err)
      setError(err)
      window.alert("Failed to fetch device-customer mappings")
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // HANDLE FILTER CHANGE
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // APPLY FILTERS (reset to page 1 and fetch)
  const applyFilters = () => {
    setCurrentPage(1) // Reset to first page
    setFilterTrigger(prev => prev + 1) // Trigger re-fetch
  }

  // RESET FILTERS
  const resetFilters = () => {
    setFilters({
      serialNumber: '',
      customerCode: '',
      customerName: '',
      company: '',
      deviceType: '',
      fromDate: '',
      toDate: '',
      approvedStatus: '-1',
      searchText: ''
    })
    setCurrentPage(1)
    setFilterTrigger(prev => prev + 1) // Trigger re-fetch
  }

  // HANDLE SORT
  const handleSort = (columnIndex) => {
    setSortConfig(prev => ({
      columnIndex: columnIndex,
      direction: prev.columnIndex === columnIndex && prev.direction === 0 ? 1 : 0
    }))
  }

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(totalCount / pageSize)
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Open Add modal
  const openAddModal = () => {
    setModalType('add')
    setSelectedMapping(null)
  }

  // Open Edit modal with selected mapping
  const openEditModal = (mapping) => {
    setModalType('edit')
    setSelectedMapping(mapping)
  }

  // Close modal
  const closeModal = () => {
    setModalType(null)
    setSelectedMapping(null)
  }

  // HANDLE ADD MAPPING
  const handleAddMapping = async (formData) => {
    await fetchMappings(false)
    closeModal()
  }

  // HANDLE EDIT MAPPING
  const handleEditMapping = async (formData) => {
    await fetchMappings(false)
    closeModal()
  }

  // HANDLE DELETE MAPPING
  const handleDelete = async (serialNumber) => {
    if (!window.confirm(`Are you sure you want to delete the mapping for serial: ${serialNumber}?`)) {
      return
    }

    try {
      const response = await api.delete(
        `${BASE_URL}/delete_customer_mapping/${serialNumber}/`
      )
      
      if (response.data.status === 'success') {
        window.alert("Device-customer mapping deleted successfully!")
        await fetchMappings(false)
      } else {
        window.alert("Failed to delete mapping")
      }
    } catch (err) {
      console.error("Error deleting mapping:", err)
      window.alert("Error deleting mapping")
    }
  }

  // FORMAT DATE FOR DISPLAY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // GET SORT ICON
  const getSortIcon = (columnIndex) => {
    if (sortConfig.columnIndex !== columnIndex) return '⇅'
    return sortConfig.direction === 0 ? '↑' : '↓'
  }

  // LOADING STATE
  if (loading && currentPage === 1) {
    return (
      <div className="listing-page">
        <div className="loading">Loading device-customer mappings...</div>
      </div>
    )
  }

  // MAIN RENDER
  return (
    <>
      <div className="listing-page">
        <div className="listing-page__container">

          {/* HEADER with Add New button */}
          <div className="listing-page__header">
            <h1 className="listing-page__title">Device-Customer Mapping</h1>
            <button 
              className="listing-page__add-btn" 
              onClick={openAddModal}
            >
              + Map New Device
            </button>
          </div>

          {/* FILTER SECTION */}
          <div className="listing-page__filters">
            <div className="filters__header">
              <h3 className="filters__title">Filters & Search</h3>
              <button 
                className="filters__toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? '▲ Hide' : '▼ Show'}
              </button>
            </div>

            {showFilters && (
              <div className="filters__body">
                {/* SEARCH BAR */}
                <div className="filters__row filters__row--search">
                  <div className="filters__field filters__field--full">
                    <label className="filters__label">Search</label>
                    <input
                      type="text"
                      name="searchText"
                      className="filters__input"
                      placeholder="Search serial, customer, company, device type..."
                      value={filters.searchText}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                {/* FILTER INPUTS - Row 1 */}
                <div className="filters__row">
                  <div className="filters__field">
                    <label className="filters__label">Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      className="filters__input"
                      placeholder="e.g. 202401AMP001"
                      value={filters.serialNumber}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filters__field">
                    <label className="filters__label">Device Type</label>
                    <select
                      name="deviceType"
                      className="filters__input"
                      value={filters.deviceType}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Types</option>
                      <option value="AMP">AMP</option>
                      <option value="API">API</option>
                    </select>
                  </div>

                  <div className="filters__field">
                    <label className="filters__label">Customer Code</label>
                    <input
                      type="text"
                      name="customerCode"
                      className="filters__input"
                      placeholder="e.g. 1001"
                      value={filters.customerCode}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                {/* FILTER INPUTS - Row 2 */}
                <div className="filters__row">
                  <div className="filters__field">
                    <label className="filters__label">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      className="filters__input"
                      placeholder="e.g. John Doe"
                      value={filters.customerName}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filters__field">
                    <label className="filters__label">Company</label>
                    <input
                      type="text"
                      name="company"
                      className="filters__input"
                      placeholder="e.g. Acme Corp"
                      value={filters.company}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filters__field">
                    <label className="filters__label">Approval Status</label>
                    <select
                      name="approvedStatus"
                      className="filters__input"
                      value={filters.approvedStatus}
                      onChange={handleFilterChange}
                    >
                      <option value="-1">All</option>
                      <option value="0">Pending</option>
                      <option value="1">Approved</option>
                      <option value="2">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* FILTER INPUTS - Row 3 (Date Range) */}
                <div className="filters__row">
                  <div className="filters__field">
                    <label className="filters__label">From Date</label>
                    <input
                      type="date"
                      name="fromDate"
                      className="filters__input"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filters__field">
                    <label className="filters__label">To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      className="filters__input"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filters__field">
                    {/* Empty space for alignment */}
                  </div>
                </div>

                {/* FILTER ACTIONS */}
                <div className="filters__actions">
                  <button 
                    className="filters__btn filters__btn--reset"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                  <button 
                    className="filters__btn filters__btn--apply"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TABLE - Wrapped for mobile scroll */}
          <div className="listing-page__table-wrapper">
            <table className="product-table">
              <thead className="product-table__head">
                <tr className="product-table__row">
                  <th className="product-table__header">#</th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(0)}
                  >
                    Serial Number {getSortIcon(0)}
                  </th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(4)}
                  >
                    Device Type {getSortIcon(4)}
                  </th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(1)}
                  >
                    Customer Code {getSortIcon(1)}
                  </th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(2)}
                  >
                    Customer Name {getSortIcon(2)}
                  </th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(3)}
                  >
                    Company {getSortIcon(3)}
                  </th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(5)}
                  >
                    Status {getSortIcon(5)}
                  </th>
                  <th 
                    className="product-table__header product-table__header--sortable"
                    onClick={() => handleSort(6)}
                  >
                    Created On {getSortIcon(6)}
                  </th>
                  <th className="product-table__header">Actions</th>
                </tr>
              </thead>
              <tbody className="product-table__body">
                {loading ? (
                  <tr className="product-table__row">
                    <td colSpan="9" className="product-table__cell" style={{ textAlign: 'center' }}>
                      Loading...
                    </td>
                  </tr>
                ) : mappings.length === 0 ? (
                  <tr className="product-table__row product-table__row--empty">
                    <td colSpan="9" className="product-table__cell">
                      No device-customer mappings found. Try adjusting your filters or click "Map New Device" to add one.
                    </td>
                  </tr>
                ) : (
                  mappings.map((mapping, index) => (
                    <tr key={mapping.id} className="product-table__row">
                      <td className="product-table__cell" data-label="#">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="product-table__cell" data-label="Serial Number">
                        {mapping.upiDeviceSerialNumber}
                      </td>
                      <td className="product-table__cell" data-label="Device Type">
                        <span className={`device-type-badge device-type-badge--${mapping.devicetype?.toLowerCase()}`}>
                          {mapping.devicetype || 'N/A'}
                        </span>
                      </td>
                      <td className="product-table__cell" data-label="Customer Code">
                        {mapping.customerCode}
                      </td>
                      <td className="product-table__cell" data-label="Customer Name">
                        {mapping.customerName}
                      </td>
                      <td className="product-table__cell" data-label="Company">
                        {mapping.company || 'N/A'}
                      </td>
                      <td className="product-table__cell" data-label="Status">
                        <span className={`status-badge status-badge--${mapping.isApproved}`}>
                          {mapping.isApproved === 0 ? 'Pending' : mapping.isApproved === 1 ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                      <td className="product-table__cell" data-label="Created On">
                        {formatDate(mapping.createdOn)}
                      </td>
                      <td className="product-table__cell" data-label="Actions">
                        <div className="product-table__actions">
                          <button
                            className="product-table__btn product-table__btn--edit"
                            onClick={() => openEditModal(mapping)}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            className="product-table__btn product-table__btn--delete"
                            onClick={() => handleDelete(mapping.upiDeviceSerialNumber)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION SECTION */}
          <div className="listing-page__pagination">
            <div className="pagination__info">
              <span className="pagination__text">
                Showing {mappings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
                {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
              </span>
              
              <select 
                className="pagination__select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>

            <div className="pagination__controls">
              <button
                className="pagination__btn"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className="pagination__btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span className="pagination__pages">
                Page {currentPage} of {totalPages || 1}
              </span>
              
              <button
                className="pagination__btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
              <button
                className="pagination__btn"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
     
      {/* ADD MODAL */}
      {modalType === 'add' && (
        <Modal onClose={closeModal} title="Map Device to Customer">
          <CustomerForm
            onSubmit={handleAddMapping}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {modalType === 'edit' && (
        <Modal onClose={closeModal} title="Edit Device-Customer Mapping">
          <CustomerForm
            initialData={selectedMapping}
            onSubmit={handleEditMapping}
            onCancel={closeModal}
            isEditMode={true}
          />
        </Modal>
      )}
    </>
  )
}
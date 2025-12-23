import React, { useState, useEffect } from "react";
import '../styles/AddSerialNum.css';
import api, { BASE_URL } from '../assets/js/axiosConfig';

export default function AddSerialNum() {
  
  const [Slno, setSlno] = useState("");
  const [serialList, setSerialList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FILTER & SEARCH STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all"); // all, approved, unapproved
  const [allocationFilter, setAllocationFilter] = useState("all"); // all, 0, 1, 2, 3

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const re = /^[0-9]{4}[0-9]{2}(AMP|API)[0-9]{6}B$/;

  useEffect(() => {
    fetchSerialNumbers(true);
  }, []);

  // Apply filters whenever serialList, search, or filters change
  useEffect(() => {
    applyFilters();
  }, [serialList, searchTerm, approvalFilter, allocationFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, approvalFilter, allocationFilter]);

  const fetchSerialNumbers = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await api.get(`${BASE_URL}/get_serial_numbers/`);

      if (response.data && response.data.data) {
        const formattedData = response.data.data.map(item => ({
          serialnumber: item.serialnumber,
          isapproved: item.isapproved || 0,
          isallocated: item.isallocated ? Number(item.isallocated) : 0,
          IMSI: item.imsi || null,           
          IMEI: item.imei || null,           
          deviceId: item.deviceid || null    
        }));
        setSerialList(formattedData);
      }
    } catch (err) {
      console.error("Error fetching serial numbers:", err);
      setError(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // APPLY FILTERS
  const applyFilters = () => {
    let filtered = [...serialList];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        item.serialnumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Approval filter
    if (approvalFilter !== "all") {
      const isApproved = approvalFilter === "approved" ? 1 : 0;
      filtered = filtered.filter(item => item.isapproved === isApproved);
    }

    // Allocation filter
    if (allocationFilter !== "all") {
      const allocStatus = parseInt(allocationFilter);
      filtered = filtered.filter(item => item.isallocated === allocStatus);
    }

    setFilteredList(filtered);
  };

  // RESET FILTERS
  const resetFilters = () => {
    setSearchTerm("");
    setApprovalFilter("all");
    setAllocationFilter("all");
    setCurrentPage(1);
  };

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- HANDLERS ---

  const handleAdd = async (e) => {
    e.preventDefault();
    
    try {
      if (!Slno.trim()) {
        window.alert("Please fill out the field");
        setSlno("");
        return;
      }

      if (!re.test(Slno.trim())) {
        window.alert("Serial number must follow pattern: YYYYMM{AMP|API}XXXXXXB (e.g., 202505AMP123456B)");
        return;
      }

      if (serialList.some(item => item.serialnumber === Slno.trim())) {
        window.alert("Serial number already exists in the list!");
        return;
      }

      const data = { serialnumber: Slno.trim() };
      const response = await api.post(`${BASE_URL}/add_serial_number/`, data);
      
      if (response.data.status === "success") {
        setSlno("");
        window.alert("Serial number added successfully!");
        await fetchSerialNumbers(false);
      } else {
        window.alert(response.data.message || "Unknown error occurred");
      }

    } catch (err) {
      console.error("Error adding serial number:", err);
      
      if (!err.response) {
        window.alert("Network error! Please check your connection.");
        return;
      }
      
      const status = err.response.status;
      const msg = err.response.data.message || "An error occurred";
      
      if (status === 400) {
        window.alert(msg);
      } else if (status === 409) {
        window.alert("Serial number already exists");
      } else {
        window.alert(`Error: ${msg}`);
      }
      
      setSlno("");
    }
  };

  const handleApprove = async (serialnumber) => {
    try {
      const response = await api.patch(`${BASE_URL}/approve_serial_number/`, { serialnumber });
      
      if (response.data.status === "success") {
        window.alert("Serial number approved successfully!");
        await fetchSerialNumbers(false);
      } else {
        window.alert("Failed to approve serial number");
      }
    } catch (err) {
      console.error("Error approving serial number:", err);
      window.alert("Error approving serial number");
    }
  };

  const handleAllocate = async (serialnumber) => {
    try {
      const response = await api.post(`${BASE_URL}/allocate_serial_number/`, { serialnumber });
      
      if (response.data.status === "success") {
        window.alert("Serial number allocated successfully!");
        await fetchSerialNumbers(false);
      } else {
        window.alert("Failed to allocate serial number");
      }
    } catch (err) {
      console.error("Error allocating serial number:", err);
      window.alert("Error allocating serial number");
    }
  };

  const handleDeactivate = async (serialnumber) => {
    if (!window.confirm(`Are you sure you want to deactivate device ${serialnumber}?`)) {
      return;
    }

    try {
      const response = await api.post(`${BASE_URL}/deactivate_serial_number/`, { serialnumber });
      
      if (response.data.status === "success") {
        window.alert(response.data.message || "Deactivated successfully");
        await fetchSerialNumbers(false);
      } else {
        window.alert(response.data.message || "Failed to deactivate");
      }
    } catch (err) {
      console.error("Error deactivating serial number:", err);
      
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 403) {
          window.alert(`Action Denied: ${data.message}`);
        } else if (status === 404) {
          window.alert("Serial number not found in database.");
        } else {
          window.alert(`Error: ${data.message || "Failed to deactivate"}`);
        }
      } else {
        window.alert("Network error while deactivating.");
      }
    }
  };

  if (loading) {
    return (
      <div className="serial-page">
        <div className="loading">Loading serial numbers...</div>
      </div>
    );
  }

  return (
    <div className="serial-page">
      <header className="serial-page__header">
        <h1 className="serial-page__title">Add Serial Number</h1>
      </header>

      <section className="serial-panel">
        <div className="serial-panel__header">
          <h3 className="serial-panel__title">New Serial</h3>
        </div>

        <div className="serial-panel__body">
          {/* Add Serial Form */}
          <form className="serial-form" onSubmit={handleAdd}>
            <div className="serial-form__field">
              <input 
                type="text" 
                className="serial-form__input" 
                required 
                value={Slno} 
                placeholder="Enter Sl.no (e.g., 202505AMP123456B)" 
                onChange={(e) => setSlno(e.target.value)} 
                aria-label="Serial number"
              />
            </div>
            <div className="serial-form__actions">
              <button type="submit" className="serial-form__submit">
                Add Serial Number
              </button>
            </div>
          </form>

          {/* FILTERS & SEARCH SECTION */}
          <div className="serial-filters">
            <div className="serial-filters__row">
              {/* Search */}
              <div className="serial-filters__field">
                <label className="serial-filters__label">Search Serial Number</label>
                <input 
                  type="text"
                  className="serial-filters__input"
                  placeholder="Search by serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Approval Filter */}
              <div className="serial-filters__field">
                <label className="serial-filters__label">Approval Status</label>
                <select
                  className="serial-filters__select"
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="unapproved">Unapproved</option>
                </select>
              </div>

              {/* Allocation Filter */}
              <div className="serial-filters__field">
                <label className="serial-filters__label">Allocation Status</label>
                <select
                  className="serial-filters__select"
                  value={allocationFilter}
                  onChange={(e) => setAllocationFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="0">Unallocated (0)</option>
                  <option value="1">Fetched (1)</option>
                  <option value="2">Allocated (2)</option>
                  <option value="3">Deactivated (3)</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="serial-filters__field">
                <button 
                  type="button"
                  className="serial-filters__reset"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="serial-filters__info">
              <span>Showing {currentItems.length} of {filteredList.length} results</span>
              {(searchTerm || approvalFilter !== "all" || allocationFilter !== "all") && (
                <span className="serial-filters__active">(Filters Active)</span>
              )}
            </div>
          </div>

          {/* Serial Numbers Table */}
          <div className="serial-table-wrapper">
            <table className="serial-table">
              <thead className="serial-table__head">
                <tr className="serial-table__row">
                  <th className="serial-table__header">#</th>
                  <th className="serial-table__header">Serial Number</th>
                  <th className="serial-table__header">IMSI</th>
                  <th className="serial-table__header">IMEI</th>
                  <th className="serial-table__header">Device ID</th>
                  <th className="serial-table__header">Actions</th>
                </tr>
              </thead>
              <tbody className="serial-table__body">
                {currentItems.length === 0 ? (
                  <tr className="serial-table__row serial-table__row--empty">
                    <td colSpan="6" className="serial-table__cell">
                      {searchTerm || approvalFilter !== "all" || allocationFilter !== "all" 
                        ? "No serial numbers match your filters." 
                        : "No serial numbers added yet."}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => {
                    const canDeactivate = item.isapproved === 1 && item.isallocated === 0;
                    const globalIndex = indexOfFirstItem + index + 1;

                    return (
                      <tr key={item.serialnumber} className="serial-table__row">
                        <td className="serial-table__cell" data-label="#">
                          {globalIndex}
                        </td>
                        <td className="serial-table__cell serial-table__cell--serial" data-label="Serial Number">
                          {item.serialnumber}
                        </td>
                        <td className="serial-table__cell serial-table__cell--data" data-label="IMSI">
                          {item.IMSI || '—'}
                        </td>
                        <td className="serial-table__cell serial-table__cell--data" data-label="IMEI">
                          {item.IMEI || '—'}
                        </td>
                        <td className="serial-table__cell serial-table__cell--data" data-label="Device ID">
                          {item.deviceId || '—'}
                        </td>
                        
                        <td className="serial-table__cell" data-label="Actions">
                          <div className="serial-table__actions">
                            
                            {/* APPROVE BUTTON */}
                            <button 
                              type="button" 
                              className={`serial-table__btn serial-table__btn--approve ${item.isapproved === 1 ? 'serial-table__btn--approved' : ''}`} 
                              onClick={() => handleApprove(item.serialnumber)} 
                              disabled={item.isapproved === 1}
                              aria-label={`Approve serial ${item.serialnumber}`}
                            >
                              <i className="fas fa-check" /> {item.isapproved === 1 ? 'Approved' : 'Approve'}
                            </button>

                            {/* ALLOCATE BUTTON */}
                            {item.isapproved === 1 && (
                              <button 
                                type="button" 
                                className={`serial-table__btn serial-table__btn--allocate ${item.isallocated === 2 ? 'serial-table__btn--allocated' : ''}`} 
                                onClick={() => handleAllocate(item.serialnumber)}
                                disabled={item.isallocated !== 0}
                                aria-label={`Allocate serial ${item.serialnumber}`}
                              >
                                <i className="fas fa-box" /> 
                                {item.isallocated === 2 ? 'Allocated' : (item.isallocated === 3 ? 'Deactivated' : 'Allocate')}
                              </button>
                            )}

                            {/* DEACTIVATE BUTTON */}
                            <button 
                              type="button" 
                              className={`serial-table__btn ${canDeactivate ? 'serial-table__btn--delete' : 'serial-table__btn--disabled'}`} 
                              onClick={() => handleDeactivate(item.serialnumber)} 
                              disabled={!canDeactivate} 
                              title={!canDeactivate ? "Device must be Approved and Unallocated to deactivate" : "Deactivate Device"}
                              aria-label={`Deactivate serial ${item.serialnumber}`}
                            >
                              <i className="fas fa-ban" /> Deactivate
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION SECTION */}
          {filteredList.length > 0 && (
            <div className="serial-pagination">
              <div className="serial-pagination__info">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredList.length)} of {filteredList.length} entries
                </span>
                
                <select 
                  className="serial-pagination__select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>

              <div className="serial-pagination__controls">
                <button
                  className="serial-pagination__btn"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className="serial-pagination__btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <span className="serial-pagination__pages">
                  Page {currentPage} of {totalPages || 1}
                </span>
                
                <button
                  className="serial-pagination__btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
                <button
                  className="serial-pagination__btn"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="serial-panel__footer">
          <small className="serial-panel__count">
            Total: {serialList.length} record{serialList.length !== 1 ? 's' : ''} 
            {filteredList.length !== serialList.length && ` | Filtered: ${filteredList.length}`}
          </small>
        </div>
      </section>
    </div>
  );
}
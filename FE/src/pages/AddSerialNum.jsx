import React, { useState, useEffect } from "react";
import StatusButtons from "../components/StatusButtons";
import '../styles/AddSerialNum.css';
import axios from "axios";
import api, { BASE_URL } from '../assets/js/axiosConfig';

export default function AddSerialNum() {
  
  const [Slno, setSlno] = useState("");
  const [serialList, setSerialList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const re = /^[0-9]{4}[0-9]{2}(AMP|API)[0-9]{6}B$/;

  useEffect(() => {
    fetchSerialNumbers(true);
  }, []);


  const fetchSerialNumbers = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await api.get(`${BASE_URL}/get_serial_numbers/`);

      if (response.data && response.data.data) {

        const formattedData = response.data.data.map(item => ({
          serialnumber: item.serialnumber,
          isapproved: item.isapproved || 0,
          isallocated: item.isallocated || 0,
          IMSI: item.imsi || null,           
          IMEI: item.imei || null,           
          deviceId: item.deviceid || null    
        }));
        setSerialList(formattedData);
      }
    } catch (err) {
      console.error("Error fetching serial numbers:", err);
      setError(err);
      window.alert("Failed to fetch serial numbers");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // SECTION 2: FORM HANDLING
  // Handles adding new serial numbers
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
      const { status: responseStatus, message } = response.data;

      if (responseStatus === "success") {
        setSlno("");
        window.alert("Serial number added successfully!");
        await fetchSerialNumbers(false);
        return;
      }

      window.alert(message || "Unknown error occurred");
      setSlno("");

    } catch (err) {
      if (!err.response) {
        console.error("Network error:", err);
        window.alert("Network error! Please check your connection.");
        return;
      }

      switch (err.response.status) {
        case 400:
          const validationError = err.response.data.errors?.serialnumber?.[0];
          if (validationError) {
            window.alert(validationError);
          } else {
            window.alert(err.response.data.message || "Invalid serial number format");
          }
          break;
        case 409:
          window.alert("This serial number already exists in the database");
          break;
        case 500:
          console.error("Server error:", err.response.data);
          window.alert("Server error! Please try again later.");
          break;
        default:
          window.alert(err.response.data.message || "An error occurred. Please try again.");
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

  const handleDelete = async (serialnumber, isapproved, isallocated) => {
    if (isapproved === 1 || isallocated === 1) {
      return;
    }

    try {
      const response = await api.delete(`${BASE_URL}/delete_serial_number/${serialnumber}/`);
      
      if (response.data.status === "success") {
        window.alert("Serial number deleted successfully!");
        await fetchSerialNumbers(false);
      } else {
        window.alert("Failed to delete serial number");
      }
    } catch (err) {
      console.error("Error deleting serial number:", err);
      window.alert("Error deleting serial number");
    }
  };

  if (loading) {
    return <div className="serial-page"><div className="loading">Loading serial numbers...</div></div>;
  }

  // SECTION 4: UI RENDERING
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
          {/* Form for adding serial numbers */}
          <form className="serial-form" onSubmit={handleAdd}>
            <div className="serial-form__field">
              <input type="text" className="serial-form__input" required value={Slno} aria-label="Serial number" placeholder="Enter Sl.no (e.g., 202505AMP123456B)" onChange={(e) => setSlno(e.target.value)} />
            </div>
            <div className="serial-form__actions">
              <button type="submit" className="serial-form__submit">Add Serial Number</button>
            </div>
          </form>

          {/* Table displaying serial numbers with new columns */}
          <div className="serial-table-wrapper">
            <table className="serial-table">
              <thead className="serial-table__head">
                <tr className="serial-table__row">
                  <th className="serial-table__header serial-table__header--index">#</th>
                  <th className="serial-table__header">Serial Number</th>
                  {/* NEW: Three additional column headers */}
                  <th className="serial-table__header">IMSI</th>
                  <th className="serial-table__header">IMEI</th>
                  <th className="serial-table__header">Device ID</th>
                  <th className="serial-table__header">Actions</th>
                </tr>
              </thead>
              <tbody className="serial-table__body">
                {serialList.length === 0 ? (
                  <tr className="serial-table__row serial-table__row--empty">
                    <td colSpan="6" className="serial-table__cell">No serial numbers added yet.</td>
                  </tr>
                ) : (
                  serialList.map((item, index) => (
                    <tr key={item.serialnumber} className="serial-table__row">
                      <td className="serial-table__cell" data-label="#">{index + 1}</td>
                      <td className="serial-table__cell serial-table__cell--serial" data-label="Serial Number">{item.serialnumber}</td>
                      
                      {/* NEW: Display IMSI, IMEI, Device ID or show "—" if null */}
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
                          <button type="button" className={`serial-table__btn serial-table__btn--approve ${item.isapproved === 1 ? 'serial-table__btn--approved' : ''}`} onClick={() => handleApprove(item.serialnumber)} disabled={item.isapproved === 1} aria-label={`Approve serial ${item.serialnumber}`}>
                            <i className="fas fa-check" /> {item.isapproved === 1 ? 'Approved' : 'Approve'}
                          </button>

                          {item.isapproved === 1 && (
                            <button 
                              type="button" 
                              className={`serial-table__btn serial-table__btn--allocate ${item.isallocated === 2 ? 'serial-table__btn--allocated' : ''}`} 
                              onClick={() => handleAllocate(item.serialnumber)}
                              disabled>
                              <i className="fas fa-box" /> {item.isallocated === 2 ? 'Allocated' : 'Allocate'}
                            </button>
                          )}
                          <button type="button" className="serial-table__btn serial-table__btn--delete" onClick={() => handleDelete(item.serialnumber, item.isapproved, item.isallocated)} disabled={item.isapproved === 1 || item.isallocated === 1} aria-label={`Delete serial ${item.serialnumber}`}>
                            <i className="fas fa-trash" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="serial-panel__footer">
          <small className="serial-panel__count">{serialList.length} record{serialList.length !== 1 ? "s" : ""}</small>
        </div>
      </section>
    </div>
  );
}
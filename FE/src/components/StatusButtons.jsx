import React, { useState } from "react";
import "../styles/StatusButtons.css";

export default function StatusButtons({ serial }) {
  const [status, setStatus] = useState("pending");

  const approve = () => {
    setStatus("approved");
  };

  const allocate = () => {
    setStatus("allocated");
  };

  return (
    <div className="status-buttons">
      {/* Approve Button */}
      <button
        className={`status-buttons__btn status-buttons__btn--approve ${
          status === "approved" || status === "allocated" 
            ? "status-buttons__btn--active" 
            : ""
        }`}
        disabled={status === "approved" || status === "allocated"}
        onClick={approve}
      >
        {status === "approved" || status === "allocated"
          ? "Approved"
          : "Approve"}
      </button>

      {/* Allocate Button */}
      <button
        className={`status-buttons__btn status-buttons__btn--allocate ${
          status === "allocated" 
            ? "status-buttons__btn--active" 
            : ""
        }`}
        disabled={status !== "approved" && status !== "allocated"}
        onClick={allocate}
      >
        {status === "allocated" ? "Allocated" : "Allocate"}
      </button>
    </div>
  );
}
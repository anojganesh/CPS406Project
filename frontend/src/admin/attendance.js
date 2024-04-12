import React, { useState } from "react";

function AttendanceForm() {
  const [memberId, setMemberId] = useState("");

  const data = {
    date: new Date().toISOString().slice(0, 10),
    member_id: memberId,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert("Attendance recorded");
      window.location.reload();
    } else {
      const text = await response.text();
      alert(`Failed to record attendance: ${text}`);
    }
  };

  return (
    <div>
      <h3>Attendance</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Member ID:
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Record Attendance</button>
      </form>
    </div>
  );
}

export default AttendanceForm;

import React, { useState } from "react";

function AttendanceForm() {
  const [memberId, setMemberId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ member_id: memberId }),
    });
    if (response.ok) {
      alert("Attendance recorded");
    }
  };

  return (
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
  );
}

export default AttendanceForm;

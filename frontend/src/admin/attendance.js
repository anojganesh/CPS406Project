import React, { useState, useEffect } from "react";

function AttendanceForm() {
  const [memberId, setMemberId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const storedRecords = localStorage.getItem("attendanceRecords");
    if (storedRecords) {
      setAttendanceRecords(JSON.parse(storedRecords));
    }
  }, []);

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
      const newRecord = { date: data.date, memberId: data.member_id };
      const updatedRecords = [...attendanceRecords, newRecord];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
      setMemberId("");
      alert("Attendance recorded");
    } else {
      const text = await response.text();
      alert(`Failed to record attendance: ${text}`);
    }
  };

  return (
    <div className="background">
      <h3 className="title">Attendance</h3>
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
      {attendanceRecords.length > 0 && (
        <div>
          <h4>Attendance Records</h4>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Member ID</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.memberId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceForm;

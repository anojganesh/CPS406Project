import React from "react";
import MonthlyReceipt from "./income";
import AttendanceForm from "./attendance";

const MainPage = () => {
  return (
    <div>
      <h1>Club Finances Dashboard</h1>
      <MonthlyReceipt />
      <AttendanceForm></AttendanceForm>
    </div>
  );
};

export default MainPage;

import React from "react";
import IncomeStatement from "./income";
import AttendanceForm from "./attendance";

const MainPage = () => {
  return (
    <div>
      <h1>Club Finances Dashboard</h1>
      <IncomeStatement />
      <AttendanceForm></AttendanceForm>
    </div>
  );
};

export default MainPage;

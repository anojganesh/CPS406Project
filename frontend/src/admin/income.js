import React, { useState } from "react";
import axios from "axios";

const IncomeStatement = () => {
  const [revenue, setRevenue] = useState("");
  const [expense, setExpense] = useState("");
  const [incomeStatement, setIncomeStatement] = useState(null);

  const handleAddRevenue = async () => {
    await axios.post("http://localhost:5000/revenues", {
      date: new Date().toISOString().slice(0, 10), // current date
      source: "Membership fees",
      amount: parseFloat(revenue),
    });
    fetchIncomeStatement();
    setRevenue("");
  };

  const handleAddExpense = async () => {
    await axios.post("http://localhost:5000/expenses", {
      date: new Date().toISOString().slice(0, 10), // current date
      category: "Hall rent",
      amount: parseFloat(expense),
    });
    fetchIncomeStatement();
    setExpense("");
  };

  const fetchIncomeStatement = async () => {
    const result = await axios.get("http://localhost:5000/income_statement");
    setIncomeStatement(result.data);
  };

  return (
    <div>
      <h2>Add Revenue</h2>
      <input
        type="number"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
      />
      <button onClick={handleAddRevenue}>Add Revenue</button>

      <h2>Add Expense</h2>
      <input
        type="number"
        value={expense}
        onChange={(e) => setExpense(e.target.value)}
      />
      <button onClick={handleAddExpense}>Add Expense</button>

      {incomeStatement && (
        <div>
          <h3>Income Statement</h3>
          <p>Total Revenue: ${incomeStatement.total_revenue}</p>
          <p>Total Expenses: ${incomeStatement.total_expenses}</p>
          <p>Profit: ${incomeStatement.profit}</p>
        </div>
      )}
    </div>
  );
};

export default IncomeStatement;

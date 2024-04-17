import React, { useState, useEffect } from "react";
import "../styles/admin.css";

const MonthlyReceipt = () => {
  const [transactions, setTransactions] = useState([]);
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [type, setType] = useState("revenue");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const expenses = await fetchExpenses();
    const revenues = await fetchRevenues();

    let mergedData = [...expenses, ...revenues].sort((a, b) => b.date - a.date);

    mergedData = mergedData;

    setTransactions(mergedData);
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/getexpenses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      console.log(data);

      const mappedExpenses = data.map((entry) => ({
        date: new Date(entry.date),
        type: "Expense",
        source: entry.source,
        amount: entry.amount,
      }));

      return mappedExpenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
  };

  // const fetchRevenues = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/getallpayments", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch revenues");
  //     }

  //     const data = await response.json();
  //     console.log(data);

  //     const mappedRevenues = data.map((entry) => ({
  //       date: new Date(entry.date),
  //       type: "Revenue",
  //       source: "Payment - " + entry.fullname,
  //       amount: entry.amount,
  //     }));

  //     return mappedRevenues;
  //   } catch (error) {
  //     console.error("Error fetching revenues:", error);
  //     return [];
  //   }
  // };

  const fetchRevenues = async () => {
    try {
      // Fetch revenues data
      const revenuesResponse = await fetch("http://localhost:5000/getrevenue", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!revenuesResponse.ok) {
        throw new Error("Failed to fetch revenues");
      }
      const revenuesData = await revenuesResponse.json();

      // Fetch payments data
      const paymentsResponse = await fetch(
        "http://localhost:5000/getallpayments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!paymentsResponse.ok) {
        throw new Error("Failed to fetch payments");
      }
      const paymentsData = await paymentsResponse.json();

      const combinedData = [
        ...revenuesData.map((entry) => ({
          date: new Date(entry.date),
          type: "Revenue",
          source: entry.source,
          amount: entry.amount,
        })),
        ...paymentsData.map((entry) => ({
          date: new Date(entry.date),
          type: "Payment",
          source: "Payment - " + entry.fullname,
          amount: entry.amount,
        })),
      ];

      combinedData.sort((a, b) => b.date - a.date);

      return combinedData;
    } catch (error) {
      console.error("Error fetching financial data:", error);
      return [];
    }
  };

  const addTransaction = () => {
    const data = {
      date: new Date().toISOString().slice(0, 10),
      source: itemName,
      amount: parseFloat(cost),
      category: itemName,
    };

    const endpoint =
      type === "revenue"
        ? "http://localhost:5000/revenues"
        : "http://localhost:5000/expenses";
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Transaction added:", data);
        setItemName("");
        setCost("");
        setType("revenue");
        fetchData();
      })
      .catch((error) => console.error("Error adding transaction:", error));
  };

  const totalRevenue = transactions
    .filter(
      (transaction) =>
        transaction.type === "Revenue" || transaction.type === "Payment"
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const profit = totalRevenue - totalExpenses;

  return (
    <div className="receipt-container">
      <h1 className="title">Club Finances Admin Dashboard</h1>
      <h1>Monthly Transactions</h1>
      <div className="add-transaction-form">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item Name"
        />
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
        </select>
        <button onClick={addTransaction}>Add Transaction</button>
      </div>

      <div className="tabletrans">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Source/Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date.toLocaleDateString()}</td>
                <td>{transaction.type}</td>
                <td>{transaction.source}</td>
                <td>${transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="income-statement">
        <h3>Total Revenue: ${totalRevenue}</h3>
        <h3>Total Expenses: ${totalExpenses}</h3>
        <h3>Profit: ${profit}</h3>
      </div>
    </div>
  );
};

export default MonthlyReceipt;

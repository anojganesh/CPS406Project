import React, { useState, useEffect } from "react";
import "../styles/admin.css"; // Ensure CSS is properly linked

// Define the MonthlyReceipt component
const MonthlyReceipt = () => {
  const [transactions, setTransactions] = useState([]);
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [type, setType] = useState("revenue");
  const [incomeStatement, setIncomeStatement] = useState({
    total_revenue: 0,
    total_expenses: 0,
    profit: 0,
  });

  useEffect(() => {
    fetchIncomeStatement();
  }, []);

  const fetchIncomeStatement = () => {
    fetch("http://localhost:5000/income_statement")
      .then((response) => response.json())
      .then((data) => {
        setIncomeStatement(data);
        console.log(data);
      })
      .catch((error) =>
        console.error("Error fetching income statement:", error)
      );
  };

  const addTransaction = () => {
    const data = {
      date: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
      source: itemName, // Use itemName as source or category based on type
      amount: cost,
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
        fetchIncomeStatement(); // Refresh the income statement after adding a transaction
        setItemName("");
        setCost("");
        setType("revenue");
      })
      .catch((error) => console.error("Error adding transaction:", error));
  };

  return (
    <div className="receipt-container">
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
      <div className="income-statement">
        <p>Total Revenue: ${incomeStatement.total_revenue}</p>
        <p>Total Expenses: ${incomeStatement.total_expenses}</p>
        <p>Profit: ${incomeStatement.profit}</p>
      </div>
    </div>
  );
};

// Admin component including notifications
const Admin = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  const sendMessage = (type) => {
    const msg =
      message ||
      (type === "lesson"
        ? "Your lesson fee is unpaid."
        : "Your monthly fee is unpaid.");
    const notification = {
      userId: userId,
      message: msg,
    };

    // Assuming a backend API endpoint /send_message
    fetch("http://localhost:5000/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Message sent:", data);
        setNotifications((prev) => [...prev, notification]); // Optionally update UI with sent notification
        setUserId("");
        setMessage("");
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <MonthlyReceipt />
      <div className="messaging-section">
        <h2>Send Message to User</h2>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a custom message or use default"
        />
        <button onClick={() => sendMessage("lesson")}>
          Send Unpaid Lesson Fee Message
        </button>
        <button onClick={() => sendMessage("monthly")}>
          Send Unpaid Monthly Fee Message
        </button>
      </div>
      <div className="notifications-container">
        <h2>Notifications</h2>
        {notifications.map((notification, index) => (
          <div key={index} className="notification">
            User ID: {notification.userId} - Message: {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

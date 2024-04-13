import React, { useState, useEffect } from "react";
import "../styles/admin.css";

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
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchIncomeStatement();
    fetchTransactions();
    fetchMessages();
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

  const fetchMessages = () => {
    fetch("http://localhost:5000/api/messages/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched messages:", data);
        setNotifications(data); // Assuming the data format aligns with how notifications are displayed
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const fetchTransactions = () => {
    Promise.all([
      fetch("http://localhost:5000/api/revenues"),
      fetch("http://localhost:5000/api/expenses"),
    ])
      .then(([revenueResponse, expenseResponse]) =>
        Promise.all([revenueResponse.json(), expenseResponse.json()])
      )
      .then(([revenueData, expenseData]) => {
        const unifiedTransactions = [
          ...revenueData.map((item) => ({
            ...item,
            type: "Revenue",
            category: item.source,
          })),
          ...expenseData.map((item) => ({
            ...item,
            type: "Expense",
            category: item.category,
          })),
        ];
        setTransactions(unifiedTransactions);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
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
        fetchIncomeStatement();
        fetchTransactions();
        setItemName("");
        setCost("");
        setType("revenue");
      })
      .catch((error) => console.error("Error adding transaction:", error));
  };
  const sendMessage = (type) => {
    const msg =
      message ||
      (type === "lesson"
        ? "Your lesson fee is unpaid."
        : "Your monthly fee is unpaid.");
    const notification = {
      user_name: userId, // Changed from 'userId' to 'user_name' to align with the backend
      message: msg,
    };

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
        setNotifications((prev) => [
          ...prev,
          { ...notification, date: new Date().toISOString() },
        ]); // Assuming date handling on the frontend for immediate feedback
        setUserId("");
        setMessage("");
      })
      .catch((error) => console.error("Error sending message:", error));
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
                <td>{transaction.date}</td>
                <td>{transaction.type}</td>
                <td>{transaction.category}</td>
                <td>${transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="income-statement">
        <p>Total Revenue: ${incomeStatement.total_revenue}</p>
        <p>Total Expenses: ${incomeStatement.total_expenses}</p>
        <p>Profit: ${incomeStatement.profit}</p>
      </div>
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
      <div className="message-table-container">
        <h2>Message Log</h2>
        <table className="message-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index}>
                <td>{notification.user_name}</td>
                <td>{notification.message}</td>
                <td>{new Date(notification.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyReceipt;

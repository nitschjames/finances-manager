import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './App.css'; // optional styling

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: ''
  });

  useEffect(() => {
    // get transactions and balance from backend
    getTransactions();
    getBalance();
  }, []);

  const getBalance = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/balance');
      setBalance(res.data.balance);
    } catch (error) {
      console.error('Error geting balance', error);
    }
  };

  const getTransactions = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error('Error geting transactions', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/transaction', formData);
      getTransactions();
      getBalance();
      setFormData({
        date: '',
        description: '',
        amount: '',
        category: ''
      });
    } catch (error) {
      console.error('Error adding transaction', error);
    }
  };

  return (
    <div className="App">
      <h1>Finances Manager</h1>

      <h2>Total: ${balance}</h2>

      <form onSubmit={handleFormSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Amount"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
        />
        <button type="submit">Add Entry</button>
      </form>

      <h2>Entries</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.description} - {transaction.amount} - {transaction.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

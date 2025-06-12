import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { URL } from '../utils/url';
import '../styles/deposit.css';

const Lend = () => {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleLend = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('User not authenticated');
      return;
    }
  try{
    const response = await axios.post(`${URL}/user/deposit`, {
  amount,
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});


      toast.success(`Deposit successful! New balance: $${response.data.balance}`);
      setAmount('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Deposit failed');
      }
      console.error(error);
    }
  };

  return (
    <div className="lend-container">
      <form className="lend-box" onSubmit={handleLend}>
        <h1 className="lend-title">Deposit Amount</h1>

        <input
          type="number"
          placeholder="Amount to Deposit (In Dollars)"
          value={amount}
          name="amount"
          onChange={handleChange}
          className="lend-input"
          required
          min="1"
        />

        <div className="lend-buttons">
          <button type="submit" className="lend-button lend-button-lend">
            Deposit
          </button>
          <button type="button" className="lend-button lend-button-cancel">
            Cancel
          </button>
          <button type="button" className="lend-button lend-button-transactions">
            View Transactions
          </button>
        </div>
      </form>
    </div>
  );
};

export default Lend;

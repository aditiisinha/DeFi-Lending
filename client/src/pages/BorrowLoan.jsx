import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { URL } from '../utils/url';
import '../styles/borrowLoan.css';

const Borrow = () => {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleBorrow = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(`${URL}/user/borrow`, {
        amount,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      toast.success(`Borrowed successfully! Loan: $${response.data.loan}, Balance: $${response.data.balance}`);
      setAmount('');
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Borrowing failed');
      }
      console.error(error);
    }
  };

  return (
    <div className="borrow-container">
      <form className="borrow-box" onSubmit={handleBorrow}>
        <h1 className="borrow-title">Borrow Loan</h1>

        <input
          type="number"
          placeholder="Amount to Borrow"
          value={amount}
          name="amount"
          onChange={handleChange}
          className="borrow-input"
          required
          min="1"
        />

        <div className="borrow-buttons">
          <button type="submit" className="borrow-button borrow-button-borrow">
            Submit
          </button>
          <button type="button" className="borrow-button borrow-button-cancel">
            Cancel
          </button>
          <button type="button" className="borrow-button borrow-button-transactions">
            View Transactions
          </button>
        </div>
      </form>
    </div>
  );
};

export default Borrow;

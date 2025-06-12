import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { URL } from '../utils/url';
import '../styles/payLoan.css';

const Pay = () => {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePayLoan = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(`${URL}/user/payloan`, 
        { amount },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Payment successful! Remaining Loan: $${response.data.loan}, Balance: $${response.data.balance}`);
      setAmount('');
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Payment failed');
      }
      console.error(error);
    }
  };

  return (
    <div className="payloan-container">
      <form className="pay-box" onSubmit={handlePayLoan}>
        <h1 className="borrow-title">Pay Loan</h1>

        <input
          type="number"
          placeholder="Amount to Pay"
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

export default Pay;

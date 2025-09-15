import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { NFTContext } from '../contexts/NFTcontext';
import { URL } from '../utils/url';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${URL}/user/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserDetails(res.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    const fetchNfts = async () => {
      try {
        const res = await axios.get(`${URL}/nft/getnfts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setNfts(res.data);
      } catch (err) {
        console.error("Error loading NFTs:", err);
      }
    };

    const fetchInvestments = async () => {
      try {
        const res = await axios.get(`${URL}/user/invest`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setInvestments(res.data.investments.slice(0, 4));
      } catch (err) {
        console.error("Error loading investments:", err);
      }
    };

    fetchDashboard();
    fetchNfts();
    fetchInvestments();
  }, []);

  if (!userDetails) return <div className="text-center mt-10">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">User Portfolio</h3>

      {/* ✅ Everything in ONE box */}
      <div className="dashboard-info-box">
        {/* User Info */}
        <p className="dashboard-info-row">
          <span className="dashboard-info-label">Name:</span> {userDetails.userName}
        </p>
        <p className="dashboard-info-row">
          <span className="dashboard-info-label">Email:</span> {userDetails.email}
        </p>
        <p className="dashboard-info-row">
          <span className="dashboard-info-label">Wallet:</span> ${userDetails.wallet}
        </p>
        <p className="dashboard-info-row">
          <span className="dashboard-info-label">Loan Taken:</span> ${userDetails.loan}
        </p>

        <hr className="my-4 border-green-300" />

        {/* Investments */}
        <h3 className="text-xl font-semibold mb-2">Investments</h3>
        {investments.length === 0 ? (
          <div>
            <p>No investments made yet.</p>
            <Link to="/invest" className="dashboard-button mt-2 inline-block">Invest Now</Link>
          </div>
        ) : (
          <>
            <table className="table-auto w-full text-sm mt-2 mb-2">
              <thead>
                <tr>
                  <th className="text-left">Coin Name</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, i) => (
                  <tr key={i}>
                    <td>{inv.coinName}</td>
                    <td>${inv.amount}</td>
                    <td>{inv.duration} year</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/invested" className="dashboard-button inline-block mt-2">View All</Link>
          </>
        )}

        <hr className="my-4 border-green-300" />

        {/* NFTs */}
        <h3 className="text-xl font-semibold mb-2">NFTs Minted</h3>
        {nfts.length === 0 ? (
          <div>
            <p>No NFTs minted yet.</p>
            <Link to="/mint-nft" className="dashboard-button mt-2 inline-block">Mint Now</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-2 mb-2">
              {nfts.map((nft, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${nft.cid}`}
                    alt="NFT"
                    className="h-16 w-16 rounded"
                  />
                  <p className="text-sm">{nft.cid.slice(0, 20)}...</p>
                </div>
              ))}
            </div>
            <Link to="/nfts" className="dashboard-button inline-block mt-2">View All</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

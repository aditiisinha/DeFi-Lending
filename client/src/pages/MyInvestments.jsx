import React from 'react';
import '../styles/myInvestment.css';

const sampleInvestments = [
    {
        id: 1,
        coinName: 'Bitcoin',
        coinIcon: 'BTC',
        amount: '$5,000.00',
        duration: '6 months',
        status: 'active'
    },
    {
        id: 2,
        coinName: 'Ethereum',
        coinIcon: 'ETH',
        amount: '$3,500.00',
        duration: '3 months',
        status: 'pending'
    },
    {
        id: 3,
        coinName: 'Polygon',
        coinIcon: 'MATIC',
        amount: '$1,200.00',
        duration: '12 months',
        status: 'completed'
    },
    {
        id: 4,
        coinName: 'Solana',
        coinIcon: 'SOL',
        amount: '$2,800.00',
        duration: '9 months',
        status: 'active'
    }
];

const MyInvestments = () => {
    return (
        <div className="invest-container">
            <h1 className="invest-title">My Investments</h1>
            <div className="invest-table-container">
                <table className="invest-table">
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleInvestments.map((investment) => (
                            <tr key={investment.id}>
                                <td>
                                    <span className="coin-icon">{investment.coinIcon}</span>
                                    {investment.coinName}
                                </td>
                                <td className="amount-value">{investment.amount}</td>
                                <td className="duration-value">{investment.duration}</td>
                                <td className={`status-${investment.status}`}>
                                    {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyInvestments;

import React from 'react';
import '../styles/myNft.css';
import nft1 from '../assets/mynft1.jpg';
import nft2 from '../assets/mynft2.jpeg';

const demoNFTs = [
  {
    id: 1,
    image: nft1,
    name: 'Cyber Dragon #1234',
    tokenId: '0x1234567890',
    collection: 'Cyber Dragons',
    mintDate: '2025-06-01',
    status: 'Minted'
  },
  {
    id: 2,
    image: nft2,
    name: 'Galactic Warrior #8765',
    tokenId: '0x9876543210',
    collection: 'Galactic Warriors',
    mintDate: '2025-06-02',
    status: 'Minted'
  }
];

const MyNFT = () => {
  return (
    <div className="my-nft-container">
      <h1 className="nft-title">My NFT Collection</h1>
      <div className="nft-grid">
        {demoNFTs.map((nft) => (
          <div key={nft.id} className="nft-card">
            <div className="nft-image-container">
              <img src={nft.image} alt={nft.name} className="nft-image" />
            </div>
            <div className="nft-info">
              <h3 className="nft-name">{nft.name}</h3>
              <p className="nft-token-id">Token ID: {nft.tokenId}</p>
              <p className="nft-collection">Collection: {nft.collection}</p>
              <p className="nft-mint-date">Minted: {nft.mintDate}</p>
              <div className="nft-status">
                <span className="status-badge">{nft.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFT;

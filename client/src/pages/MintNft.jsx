import React, { useState } from 'react';
import '../styles/mintNft.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { URL } from '../utils/url';

const MintNft = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    supply: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsMinting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated');
        navigate('/signin');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('imageUrl', formData.imageUrl);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('supply', formData.supply);

      const response = await axios.post(`${URL}/api/nft/mint`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('NFT Minted Successfully!');
      navigate('/my-nft');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to mint NFT');
      }
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mint-nft-container">
      <div className="mint-nft-box">
        <h1 className="mint-title">Mint Your NFT</h1>
        
        <form onSubmit={handleSubmit} className="mint-form">
          <div className="form-group">
            <label htmlFor="name">NFT Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter NFT name"
              className="mint-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your NFT"
              className="mint-input mint-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">NFT Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="imageUrl"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="mint-input"
              />
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="NFT Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (in USD)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter price"
              className="mint-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="supply">Supply</label>
            <input
              type="number"
              id="supply"
              name="supply"
              value={formData.supply}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter supply"
              className="mint-input"
            />
          </div>

          <button
            type="submit"
            className="mint-button"
            disabled={isMinting}
          >
            {isMinting ? 'Minting...' : 'Mint NFT'}
          </button>
        </form>

        <div className="back-link">
          <button
            onClick={() => navigate('/my-nft')}
            className="back-button"
          >
            ← Back to My NFTs
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintNft;

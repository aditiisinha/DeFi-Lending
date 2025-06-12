import NFT from '../models/NFT.modal.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { __dirname } from '../utils/path.js';

// Pinata IPFS upload
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
const axios = require('axios');

const uploadToIPFS = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey,
                },
            }
        );

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
};

export const mintNFT = async (req, res) => {
    try {
        const { name, description, price, supply } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Upload image to IPFS
        const cid = await uploadToIPFS(file);

        // Create NFT object
        const nft = new NFT({
            userId: req.user._id,
            name,
            description,
            imageUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
            price: parseFloat(price),
            supply: parseInt(supply),
            cid
        });

        await nft.save();

        // Delete the temporary file
        fs.unlinkSync(file.path);

        res.status(201).json({
            message: 'NFT minted successfully',
            nft
        });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ message: error.message });
    }
};

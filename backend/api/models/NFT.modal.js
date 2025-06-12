import mongoose from 'mongoose';

const NFTSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    supply: {
        type: Number,
        required: true
    },
    cid: {
        type: String,
        required: true
    },
    transaction: {
        type: Boolean,
        default: false
    },
    sold: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const NFT = mongoose.model('NFT', NFTSchema);
export default NFT;
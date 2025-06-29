import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
        ref: 'User',
    },
    city: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;


















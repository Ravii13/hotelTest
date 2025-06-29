import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel: {
        type: String,
        required: true,
        ref: 'Hotel', // Reference to the Hotel model
    },
    roomType: {
        type: String,
        required: true,
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    amenities: {
        type: Array, 
        required: true,
    },    
    images: [
        {
            type: String,
            required: true,
        }
    ],
    isAvailable: {
        type: Boolean,
        default: true, // Default to available
    },
    
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Room = mongoose.model('Room', roomSchema);






export default Room;













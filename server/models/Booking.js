import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User', // Reference to User model
        required: true,
    },
    room: {
        type: String,
        ref: 'Room', // Reference to Room model
        required: true,
    },
    hotel: {
        type: String,
        ref: 'Hotel', // Reference to Hotel model
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'], // Booking status can be pending, confirmed, or cancelled
        default: 'pending', // Default status is pending
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Pay at Hotel', // Default payment method
    },
    isPaid: {
        type: Boolean,
        default: false, // Default is not paid
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Booking = mongoose.model('Booking', bookingSchema);






export default Booking;













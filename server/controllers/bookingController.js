import Booking from "../models/Booking.js"
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// Function to Check Availability


const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        // Find bookings 
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        });
        const isAvailable = bookings.length === 0
        return isAvailable;
    } catch (error) {
        console.error("Error checking availability:", error);
        throw new Error("Error checking availability");
    }
}

// Api to check availability
// @route POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.status(200).json({ isAvailable });
    } catch (error) {
        console.error("Error in checkAvailabilityAPI:", error);
        res.status(500).json({ message: "Error checking availability" });
    }
};

// Function to Create Booking

export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room, guests } = req.body;
        const user = req.user._id; // Get user ID from the authenticated user
        //Before creating a booking, check if the room is available
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });

        if (!isAvailable) {
            return res.status(400).json({ message: "Room is not available for the selected dates." });
        }

        // Get total price from the room details

        const roomData = await Room.findById(room)
            .populate('hotel'); // Populate hotel details
        let totalPrice = roomData.pricePerNight

        // Calculate total price based on the number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDifference = checkOut.getTime() - checkIn.getTime();
        const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
        totalPrice *= numberOfNights;

        // Create a new booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id, // Use the populated hotel ID
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error creating booking" });
    }
};

// API to get bookings by user
// GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id; // Get user ID from the authenticated user
        const bookings = await Booking.find({ user })
            .populate('room hotel') // Populate room and hotel details
            .sort({ createdAt: -1 }); // Sort by creation date, most recent first
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Error fetching user bookings" });
    }
};


export const getHotelBookings = async (req, res) => {
    try {

        const hotel = await Hotel.findOne({ owner: req.auth.UserId });

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate('room hotel user') // Populate room and user details
            .sort({ createdAt: -1 }); // Sort by creation date, most recent first

        // Return the bookings
        const totalBookings = bookings.length;

        // Calculate total revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.status(200).json({ dashboardData: bookings, totalBookings, totalRevenue });
    } catch (error) {
        console.error("Error fetching hotel bookings:", error);
        res.status(500).json({ message: "Error fetching hotel bookings" });
    }
}
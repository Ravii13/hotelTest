import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id; // Get the owner from the authenticated user

        // Check if the User already exists
        const hotel = await Hotel.findOne({owner });
        if (hotel) {
            return res.status(400).json({ message: "Hotel already registered by this user" });
        }

        await Hotel.create({
            name,
            address,
            contact,
            owner,
            city
        });

        await User.findByIdAndUpdate(owner, {
            role: 'hotelOwner'
        });

        res.status(201).json({
            message: "Hotel registered successfully"
        });
    } catch (error) {
        console.error("Error registering hotel:", error);
        res.status(500).json({
            message: "Error registering hotel",
            error: error.message
        });
    }
};

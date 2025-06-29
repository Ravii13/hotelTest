import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import { json } from "express";

// Api to create a new room

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found for this user" });
        }

        // upload images to Cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path)
            return response.secure_url;
        })

        // Check if any images failed to upload
        if (uploadImages.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        // Wait for all images to be uploaded
        const images = await Promise.all(uploadImages)

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: json.parse(amenities),
            images,
        });
        res.status(201).json({
            message: "Room created successfully",
        });

    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            message: "Error creating room",
            error: error.message
        });
    }
}

// Api to get all rooms 

export const getRoom = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true })
            .populate({
                path: 'hotel',
                populate: {
                    path: 'owner',
                    select: 'image'
                }
            }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Rooms fetched successfully",
            data: rooms
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            message: "Error fetching rooms",
            error: error.message
        });
    }
}

// Api to get all rooms for a specific hotel

export const getOwnerRoom = async (req, res) => {
    try {
        const hotelData = await Hotel({ owner: req.auth.userId });
        const rooms = await Room.find({ hotel: hotelData._id.toString() })
            .populate('hotel')
        res.status(200).json({
            message: "Rooms fetched successfully",
            data: rooms
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            message: "Error fetching rooms",
            error: error.message
        });
    }
}

// Api to toggle availabity of a room

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.status(200).json({
            message: "Room availability toggled successfully",
            data: roomData.isAvailable
        });
    } catch (error) {
        console.error("Error toggling room availability:", error);
        res.status(500).json({
            message: "Error toggling room availability",
            error: error.message
        });
    }
}



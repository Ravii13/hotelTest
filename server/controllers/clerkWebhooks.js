import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        // Ensure the webhook secret is set in environment variables
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Getting Header
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        }

        // Verifying the webhook
        await whook.verify(
            JSON.stringify(req.body),
            headers
        );

        // Extracting the data
        const { data, type } = req.body;

        console.log("Webhook received:", { type, data });

        const userData = {
            _id: data.id,
            username: data.first_name + " " + data.last_name,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
            role: "user",
            recentSearchedCities: [],
        }

        console.log("User data to save:", userData);

        //Switching based on the type of event
        switch (type) {
            case "user.created":{
                // Create a new user in the database
                const newUser = new User(userData);
                const savedUser = await newUser.save();
                console.log("User created successfully:", savedUser);
                break;
            }
            case "user.updated":{
                // Update the existing user in the database
                const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                console.log("User updated successfully:", updatedUser);
                break;
            }
            case "user.deleted":{
                // Delete the user from the database
                const deletedUser = await User.findByIdAndDelete(data.id);
                console.log("User deleted successfully:", deletedUser);
                break;
            }
            default:
                console.log(`Unhandled event type: ${type}`);
        }
        res.status(200).json({ success: true, message: "Webhook processed successfully" });

    } catch (error) {
        console.error("Error processing webhook:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }

}

export default clerkWebhooks;





















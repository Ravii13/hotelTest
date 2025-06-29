// Get /api/users

export const getUserData =  async (req, res) => {
    try {
        const role = req.user.role
        const recentSearchedCities = req.user.recentSearchedCities 
        res.status(200).json({
            message: "Users fetched successfully",
            data: {
                role,
                recentSearchedCities
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ 
            message: "Error fetching users",
            error: error.message
        });
    }
}; 



// Store recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = await req.user;

        if (user.recentSearchedCities.length >= 3) {
            user.recentSearchedCities.push(recentSearchedCity)
            return res.status(404).json({ message: "User not found" });
        }else {
            user.recentSearchedCities.shift()
            user.recentSearchedCities.push(recentSearchedCity);
        }
        await user.save();
        res.status(200).json({
            message: "Recent searched cities updated successfully",
            data: user.recentSearchedCities
        });
    } catch (error) {
        console.error("Error storing recent searched cities:", error);
        res.status(500).json({
            message: "Error storing recent searched cities",
            error: error.message
        });
    }   
};
        
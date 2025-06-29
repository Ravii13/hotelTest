import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

// Set the base URL for axios requests

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();
    const { user } = useUser();
    const getToken = useAuth().getToken;

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/users', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                }
            });
            if (data.success) {
                setIsOwner(data.role === 'hotelOwner');
                setSearchedCities(data.recentSearchedCities)
            } else {
                //Retry fetching user data if the first attempt fails
                setTimeout(() => {
                    fetchUser();
                }, 5000);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch user data');
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user])

    const value = {
        // Add any context values or functions here
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        showHotelReg,
        setShowHotelReg,
        axios, // Expose axios if needed
        searchedCities,
        setSearchedCities,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import url from './utils/url';
const AppContext = createContext();
axios.defaults.withCredentials = true;

const AppProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const saveUser = (user) => {
        setUser(user);
    }

    const removeUser = () => {
        setUser(null);
    }

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`${url}/api/v1/user/showMe`, { withCredentials: true });
            saveUser(data.user);
        } catch (error) {
            removeUser();
        }
        setIsLoading(false);
    }

    const logoutUser = async () => {
        try {
            await axios.delete(`${url}/api/v1/auth/logout`, { withCredentials: true });
            removeUser();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AppContext.Provider
            value={{
                isLoading,
                user,
                saveUser,
                logoutUser,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppProvider };
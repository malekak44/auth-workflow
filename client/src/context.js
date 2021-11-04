import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import url from './utils/url';
const AppContext = createContext();

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
            const { data } = await axios.get(`${url}/api/v1/auth/user`);
            saveUser(data.user);
        } catch (error) {
            removeUser();
        }
        setIsLoading(false);
    }

    const logoutUser = async () => {
        try {
            await axios.delete(`${url}/api/v1/auth/logout`);
            removeUser();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
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
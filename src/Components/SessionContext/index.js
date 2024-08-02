import React, { createContext, useState, useContext, useEffect } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(0);

    useEffect(() => {
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
            const sessionData = JSON.parse(storedSession);
            setSession(sessionData);
        }
        else {
            setSession(null);
        }
    }, []);

    const login = (userId) => {
        const sessionData = { userId };
        setSession(sessionData);
        localStorage.setItem('session', JSON.stringify(sessionData));
    }
    const logout = () => {
        setSession(null);
        localStorage.removeItem('session');
    }

    return (
        <SessionContext.Provider value={{ session, login, logout }}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => {
    return useContext(SessionContext);
}


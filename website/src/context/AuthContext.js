import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const saved = localStorage.getItem("auth_user");
        return saved ? JSON.parse(saved) : { username: null, role: null, id: null };
    });

    const getToken = useCallback(() => {
        return localStorage.getItem("token");
    }, []);

    const getStoredUser = useCallback(() => {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored) : null;
    }, []);

    const login = useCallback((token, username, role, id) => {
        const authData = { username, role, id };
        
        localStorage.setItem("auth_user", JSON.stringify(authData));
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        
        setAuth(authData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        
        setAuth({ username: null, role: null, id: null });
    }, []);

    const isAuthenticated = !!auth.id;

    return (
        <AuthContext.Provider value={{ 
            auth, 
            login, 
            logout, 
            isAuthenticated,
            getToken,
            getStoredUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
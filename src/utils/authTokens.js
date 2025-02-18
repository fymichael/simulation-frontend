// authUtils.js

import jwt_decode from "jwt-decode";

export const storeToken = (token) => {
    localStorage.setItem('access_token', token);
};

export const decodeToken = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
        try {
            const decoded = jwt_decode(token);
            return decoded;
        } catch (error) {
            console.error("Erreur lors du décodage du token:", error);
        }
    }
    return null;
};

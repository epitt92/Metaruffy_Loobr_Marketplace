import axios from "axios";
import jwt from "jsonwebtoken";

export const setAuthToken = (token: string | null) => {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common["Authorization"];
    }
};

export const decodeToken = (token: string) => {
    if (token) {
        var decoded = jwt.decode(token);
        return decoded;
    }
};

import { makeAPICall } from "."

class AuthService {
    isAuthenticated = () => {
        return localStorage.getItem("auth-token") ? true : false
    }

    setAuthToken = (token) => {
        localStorage.setItem('auth-token', token)
    }

    getAuthToken = () => {
        return localStorage.getItem('auth-token')
    }

    getUserData = async () => {
        const userInfo = await makeAPICall({ endpoint: 'getCurrentUser' });
        return userInfo;
    }

    handleLogout = (history) => {
        localStorage.removeItem('auth-token');
        history.push('/')
    }
}

export const authService = new AuthService();
// client/src/services/authService.js
import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'sloth_jwt_token';

const authService = {
    login(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },
    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        try {
            const { exp } = jwtDecode(token);
            if (exp * 1000 < Date.now()) {
                this.logout();
                return false;
            }
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    },
};

export default authService;

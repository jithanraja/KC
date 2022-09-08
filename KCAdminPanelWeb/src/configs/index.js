
const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProduction ? "http://122.165.242.201:3001" : "http://122.165.242.201:3001";
export const MAP_API_KEY = "AIzaSyBco_kq89erxSKFXh_D0Mtv3pPfKFUagbY";
export const DEFAULT_MAP_VALUES = {
    center: {
        lat: 10.99835602,
        lng: 77.01502627
    }
}
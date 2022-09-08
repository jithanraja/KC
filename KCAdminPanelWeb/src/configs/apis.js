import { API_BASE_URL } from "."

const ADMIN_BASE_URL = `${API_BASE_URL}/api/admin`
const CATEGORY_BASE_URL = `${API_BASE_URL}/api/categories`
const COUPON_BASE_URL = `${API_BASE_URL}/api/coupons`
const PRODUCT_BASE_URL = `${API_BASE_URL}/api/products`
const COMMON_BASE_URL = `${API_BASE_URL}/api/common`
const STORE_BASE_URL = `${API_BASE_URL}/api/stores`

const ADMIN_APIS = {
    adminLogin: {
        url: `${ADMIN_BASE_URL}/login`,
        method: 'post',
        noAuth: true
    },
    createUser: {
        url: `${ADMIN_BASE_URL}/createUser`,
        method: 'post'
    },
    updateUser: {
        url: `${ADMIN_BASE_URL}/updateUser`,
        method: 'put'
    },
    getAllUsers: {
        url: `${ADMIN_BASE_URL}/getAllUsers`,
        method: 'get'
    },
    getUserById: {
        url: `${ADMIN_BASE_URL}/getUserById`,
        method: 'get'
    },
    getCurrentUser: {
        url: `${ADMIN_BASE_URL}/getCurrentUser`,
        method: 'get'
    }
}

const CATEGORY_APIS = {

    createCategory: {
        url: `${CATEGORY_BASE_URL}/createCategory`,
        method: 'post'
    },
    updateCategory: {
        url: `${CATEGORY_BASE_URL}/updateCategory`,
        method: 'put'
    },
    getAllCategories: {
        url: `${CATEGORY_BASE_URL}/getAllCategories`,
        method: 'get'
    },
    getCategoryById: {
        url: `${CATEGORY_BASE_URL}/getCategoryById`,
        method: 'get'
    }
}


const PRODUCT_APIS = {

    createProduct: {
        url: `${PRODUCT_BASE_URL}/createProduct`,
        method: 'post'
    },
    updateProduct: {
        url: `${PRODUCT_BASE_URL}/updateProduct`,
        method: 'put'
    },
    getAllProducts: {
        url: `${PRODUCT_BASE_URL}/getAllProducts`,
        method: 'get'
    },
    getSearchProducts: {
        url: `${PRODUCT_BASE_URL}/search`,
        method: 'get'
    },
    getProductById: {
        url: `${PRODUCT_BASE_URL}/getProductById`,
        method: 'get'
    }
}


const STORES_APIS = {

    createStore: {
        url: `${STORE_BASE_URL}/createStore`,
        method: 'post'
    },
    updateStore: {
        url: `${STORE_BASE_URL}/updateStore`,
        method: 'put'
    },
    getStoreById: {
        url: `${STORE_BASE_URL}/getStoreById`,
        method: 'get'
    },
    getAllStores: {
        url: `${STORE_BASE_URL}/getAllStores`,
        method: 'get'
    }
}

const COMMON_APIS = {

    uploadFile: {
        url: `${COMMON_BASE_URL}/upload`,
        method: 'post'
    },
    productUploadFile: {
        url: `${COMMON_BASE_URL}/products/upload`,
        method: 'post'
    },
    categoryUploadFile: {
        url: `${COMMON_BASE_URL}/categories/upload`,
        method: 'post'
    }
}

const COUPON_APIS = {

    createCoupon: {
        url: `${COUPON_BASE_URL}/createCoupon`,
        method: 'post'
    },
    updateCoupon: {
        url: `${COUPON_BASE_URL}/updateCoupon`,
        method: 'put'
    },
    getAllCoupons: {
        url: `${COUPON_BASE_URL}/getAllCoupons`,
        method: 'get'
    },
    getCouponById: {
        url: `${COUPON_BASE_URL}/getCouponById`,
        method: 'get'
    }
}

export const APIs = {
    ...ADMIN_APIS,
    ...CATEGORY_APIS,
    ...COUPON_APIS,
    ...PRODUCT_APIS,
    ...COMMON_APIS,
    ...STORES_APIS,
}
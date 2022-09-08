import React from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
// import dashboard from './../../assets/images/dashboard.svg'
// import products from './../../assets/images/products.svg'
import dashboard from './../../assets/images/Inactive Dashboard.svg'
import products from './../../assets/images/Inactive products.svg'
import orders from './../../assets/images/orders.svg'
import users from './../../assets/images/users.svg'
import category from './../../assets/images/category.svg'
import store from './../../assets/images/store.svg'
import settings from './../../assets/images/settings.svg'
import community from './../../assets/images/community.svg'
import activeDashboard from './../../assets/images/Active Dashboard.svg'
import activeProducts from './../../assets/images/Active Products.svg'
// import activeDashboard from './../../assets/images/active-dashboard.svg'
// import activeProducts from './../../assets/images/active-products.svg'
import activeOrders from './../../assets/images/active-orders.svg'
import activeUsers from './../../assets/images/active-users.svg'
import activeCategory from './../../assets/images/active-category.svg'
import activeStore from './../../assets/images/active-store.svg'
import activeSettings from './../../assets/images/active-settings.svg'
import activeCommunity from './../../assets/images/active-community.svg'
import { useEffect, useState } from 'react'

const menuItems = [
    { path: '/dashboard', icon: dashboard, activeIcon: activeDashboard, name: 'Dashboard' },
    { path: '/products', icon: products, activeIcon: activeProducts, name: 'Products' },
    { path: '/orders', icon: orders, activeIcon: activeOrders, name: 'Orders' },
    { path: '/users', icon: users, activeIcon: activeUsers, name: 'Users' },
    { path: '/categories', icon: category, activeIcon: activeCategory, name: 'Category' },
    { path: '/stores', icon: store, activeIcon: activeStore, name: 'Store' },
    { path: '/settings', icon: settings, activeIcon: activeSettings, name: 'Settings' },
    { path: '/community', icon: community, activeIcon: activeCommunity, name: 'Community' },
    { path: '/coupons', icon: dashboard, activeIcon: activeDashboard, name: 'Coupons' },
]

function SideMenu() {

    const location = useLocation();
    const history = useHistory();
    const [currentPath, setCurrentPath] = useState('')

    useEffect(() => {
        setCurrentPath(location.pathname)
    }, [location])

    useEffect(() => {
        // console.log(currentPath);
        // This below code for redirect to dashboard page by default
        (currentPath === '/') && history.push('/dashboard')
    }, [currentPath, history])

    return (
        <div className="sidemenu-container">
            {menuItems.map((item, idx) => <React.Fragment key={`${idx}-sidemenu`}>
                <Link to={item.path} className="side-menu-link">
                    <img src={currentPath === item.path ? item.activeIcon : item.icon} alt={item.name} />
                    <span>{item.name}</span>
                </Link>
            </React.Fragment>)}
        </div>
    )
}

export default SideMenu

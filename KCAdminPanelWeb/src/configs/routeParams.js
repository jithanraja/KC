import { PageNotFound, Users, Categories, Stores, Community, Orders,Products,Coupons } from "../views/components";
import Login from "../views/components/Login/Login";
import Dashboard from "../views/components/Dashboard/Dashboard";
import CommonLayout from "../views/layout/CommonLayout";

export const routes = [
    {
        path: "/login",
        DynComponent: Login
    },
    {
        path: "/",
        DynComponent: CommonLayout,
        isExact: false,
        childRoutes: [
            {
                path: "/dashboard",
                DynComponent: Dashboard
            },
            {
                path: "/users",
                DynComponent: Users
            },  
            {
                path: "/categories",
                DynComponent: Categories
            },
            {
                path: "/stores",
                DynComponent: Stores
            },
            {
                path: "/community",
                DynComponent: Community
            },
            {
                path: "/orders",
                DynComponent: Orders
            }, 
            {
                path: "/products",
                DynComponent: Products
            }, 
            {
                path: "/coupons",
                DynComponent: Coupons
            }
        ]
    },
    {
        path: '*',
        isExact: false,
        DynComponent: PageNotFound
    }
];
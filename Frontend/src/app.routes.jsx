import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Navbar from "./components/Navbar";

// Layout component that wraps protected pages with a Navbar
const AppLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        element: <Protected><AppLayout /></Protected>,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/interview/:interviewId",
                element: <Interview />
            }
        ]
    }
])
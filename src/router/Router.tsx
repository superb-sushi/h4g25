import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";
import DashBoard from "../pages/DashBoard";


export const router = createBrowserRouter([
    { path:"/", element: <LoginPage /> },
    { path:"/signup", element: <SignUpPage />},
    { path:"/dashboard", element: <DashBoard />},
    { path:"/home", element: <HomePage />}
])
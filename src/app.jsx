import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles.css";

import { Home } from "./home/index";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

export function App() {
    return (
        <>
            <RouterProvider router={router} />
            <div className="small-screen">
                <h1>This device is unsupported. 📱🤏</h1>
                <p>This device is too small</p>
            </div>
        </>
    );
}

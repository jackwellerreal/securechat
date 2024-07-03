import React from "react";
import "./styles.css";

export function Home() {
    return (
        <>
            <div className="main">
                <h1>Home</h1>
            </div>
            <div className="small-screen">
                <h1>This device is unsupported. 📱🤏</h1>
                <p>This device is too small</p>
            </div>
        </>
    );
}

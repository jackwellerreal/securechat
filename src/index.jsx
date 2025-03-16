import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./styles.css";

import { Home } from "./home";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
        </Routes>
    </BrowserRouter>
);

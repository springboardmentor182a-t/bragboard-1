import React from "react";
import logo from "../assets/logo.png";

const BrandHeader = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <img
                src={logo}
                alt="BragBoard Logo"
                style={{ width: "42px", height: "42px", objectFit: "contain" }}
            />
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1a1a1a" }}>
                BragBoard
            </h2>
        </div>
    );
};

export default BrandHeader;

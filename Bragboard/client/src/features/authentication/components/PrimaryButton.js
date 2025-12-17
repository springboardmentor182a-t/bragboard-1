import React from "react";

export default function PrimaryButton({ children, type = "button", onClick, className = "" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={
                "w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 " +
                className
            }
        >
            {children}
        </button>
    );
}

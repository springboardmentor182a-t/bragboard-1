import React from "react";

export default function AuthInput({ label, name, type = "text", value, onChange, placeholder }) {
    return (
        <label className="block mb-4">
            {label && <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>}
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
        </label>
    );
}

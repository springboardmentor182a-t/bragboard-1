import React from "react";


export interface ModalProps {
isOpen: boolean;
onClose: () => void;
title?: string;
children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
if (!isOpen) return null;


return (
<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
<div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
{title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}


<div className="mb-4">{children}</div>


<button
onClick={onClose}
className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
>
Close
</button>
</div>
</div>
);
};


export default Modal;
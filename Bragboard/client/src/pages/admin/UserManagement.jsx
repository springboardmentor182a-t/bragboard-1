import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout.jsx';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Smith', email: 'john.smith@company.com', role: 'Employee', department: 'Marketing', status: 'Active' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@company.com', role: 'Admin', department: 'Software Engineering', status: 'Active' },
        { id: 3, name: 'Mike Chen', email: 'mike.chen@company.com', role: 'Employee', department: 'Software Engineering', status: 'On Leave' },
        { id: 4, name: 'Sarah Lee', email: 'sarah.lee@company.com', role: 'Employee', department: 'Product', status: 'Active' },
        { id: 5, name: 'Alex Johnson', email: 'alex.j@company.com', role: 'Employee', department: 'Sales', status: 'Inactive' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'On Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage system access and employee records</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 font-semibold">
                        <span>+</span> Add New User
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{users.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Users</h3>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                            {users.filter(u => u.status === 'Active').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Departments</h3>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                            {new Set(users.map(u => u.department)).size}
                        </p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="relative w-full md:w-96">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                                Filter
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {user.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors">Edit</button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination (Static) */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</span>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Previous</button>
                            <button disabled className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserManagement;

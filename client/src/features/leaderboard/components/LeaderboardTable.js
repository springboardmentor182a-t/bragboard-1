import React from 'react';
import RankBadge from './RankBadge';

const LeaderboardTable = ({ data, onUserClick }) => {
    const getRankColor = (rank) => {
        switch(rank) {
            case 1: return 'bg-yellow-100 border-yellow-300';
            case 2: return 'bg-gray-100 border-gray-300';
            case 3: return 'bg-orange-100 border-orange-300';
            default: return 'bg-white border-gray-200';
        }
    };

    return (
        <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <h2 className="text-2xl font-bold text-white">🏆 Top Performers</h2>
                <p className="text-blue-100">Employees with highest recognition scores</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shoutouts
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reactions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((user) => (
                            <tr 
                                key={user.user_id} 
                                className={`hover:bg-blue-50 cursor-pointer transition-colors ${getRankColor(user.rank)} border-l-4`}
                                onClick={() => onUserClick && onUserClick(user)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RankBadge rank={user.rank} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div 
                                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                                            style={{ backgroundColor: user.avatar_color }}
                                        >
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                #{user.user_id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {user.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-lg font-bold text-gray-900">
                                        {user.score}
                                        <span className="text-xs font-normal text-gray-500 ml-1">pts</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-green-600">
                                                ↑ {user.shoutouts_received}
                                            </span>
                                            <span className="text-blue-600">
                                                ↓ {user.shoutouts_sent}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex space-x-2">
                                        <span className="flex items-center">
                                            👍 {Math.floor(user.total_reactions * 0.4)}
                                        </span>
                                        <span className="flex items-center">
                                            👏 {Math.floor(user.total_reactions * 0.35)}
                                        </span>
                                        <span className="flex items-center">
                                            ⭐ {Math.floor(user.total_reactions * 0.25)}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardTable;

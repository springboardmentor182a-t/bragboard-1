
import React from 'react';

const LeaderboardFilters = ({ rangeType, onRangeChange }) => {
    const ranges = [
        { id: 'weekly', label: 'This Week', icon: '📅' },
        { id: 'monthly', label: 'This Month', icon: '📊' },
        { id: 'all_time', label: 'All Time', icon: '🏆' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Time Range</h3>
                    <p className="text-sm text-gray-500">Select period for leaderboard data</p>
                </div>
                
                <div className="flex space-x-2 mt-2 sm:mt-0">
                    {ranges.map((range) => (
                        <button
                            key={range.id}
                            onClick={() => onRangeChange(range.id)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                                rangeType === range.id
                                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span>{range.icon}</span>
                            <span className="font-medium">{range.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardFilters;

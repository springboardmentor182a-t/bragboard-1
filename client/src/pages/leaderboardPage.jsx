import React, { useState, useEffect } from 'react';
import LeaderboardTable from '../features/leaderboard/components/LeaderboardTable';
import DepartmentStats from '../features/leaderboard/components/DepartmentStats';
import RecentHighlights from '../features/leaderboard/components/RecentHighlights';
import LeaderboardFilters from '../features/leaderboard/components/LeaderboardFilters';
import axios from 'axios';

const LeaderboardPage = () => {
    const [rangeType, setRangeType] = useState('weekly');
    const [topPerformers, setTopPerformers] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [recentHighlights, setRecentHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, [rangeType]);

    const fetchLeaderboardData = async () => {
        setLoading(true);

        try {
            const [performersResponse, statsResponse, highlightsResponse] = await Promise.all([
                axios.get('http://localhost:8000/api/leaderboard/top-performers', {
                    params: { range_type: rangeType }
                }),
                axios.get('http://localhost:8000/api/leaderboard/department-stats'),
                axios.get('http://localhost:8000/api/leaderboard/recent-highlights')
            ]);

            setTopPerformers(performersResponse.data || []);
            setDepartmentStats(statsResponse.data || []);
            setRecentHighlights(highlightsResponse.data || []);
            setError(null);

        } catch (err) {
            console.error("API Error:", err.message);
            setError("Failed to connect to backend. Please make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        alert(`🏆 ${user.name}\nRank: #${user.rank}\nDepartment: ${user.department}\nScore: ${user.score}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading leaderboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                        <span className="text-4xl">🏆</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Employee Recognition Leaderboard
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Celebrate outstanding contributions and track team engagement in real-time.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-red-700">{error}</div>
                    </div>
                )}

                {/* Filters */}
                <LeaderboardFilters 
                    rangeType={rangeType} 
                    onRangeChange={setRangeType} 
                />

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl font-bold">
                            {topPerformers[0]?.score || 0}
                        </div>
                        <div>Top Score</div>
                        <div className="text-sm mt-1">{topPerformers[0]?.name || "N/A"}</div>
                    </div>

                    <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl font-bold">
                            {departmentStats.reduce((sum, d) => sum + d.total_shoutouts, 0)}
                        </div>
                        <div>Total Shoutouts</div>
                    </div>

                    <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl font-bold">{recentHighlights.length}</div>
                        <div>Recent Highlights</div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Leaderboard */}
                    <div className="lg:col-span-2">
                        <LeaderboardTable 
                            data={topPerformers} 
                            onUserClick={handleUserClick}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <DepartmentStats data={departmentStats} />
                        <RecentHighlights data={recentHighlights} />

                        {/* Refresh button */}
                        <div className="text-center">
                            <button
                                onClick={fetchLeaderboardData}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                            >
                                🔄 Refresh Data
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaderboardPage;
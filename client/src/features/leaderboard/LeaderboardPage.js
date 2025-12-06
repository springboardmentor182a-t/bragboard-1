import React, { useState, useEffect } from 'react';
import LeaderboardTable from './components/LeaderboardTable';
import DepartmentStats from './components/DepartmentStats';
import RecentHighlights from './components/RecentHighlights';
import LeaderboardFilters from './components/LeaderboardFilters';
import axios from 'axios';

const LeaderboardPage = () => {
    const [rangeType, setRangeType] = useState('weekly');
    const [topPerformers, setTopPerformers] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [recentHighlights, setRecentHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Demo data (will be used if API fails)
    const demoTopPerformers = [
        {
            user_id: 1,
            name: "Alex Johnson",
            department: "Engineering",
            score: 245,
            rank: 1,
            shoutouts_received: 15,
            shoutouts_sent: 12,
            total_reactions: 45,
            avatar_color: "#3B82F6"
        },
        {
            user_id: 2,
            name: "Sarah Miller",
            department: "Marketing",
            score: 198,
            rank: 2,
            shoutouts_received: 12,
            shoutouts_sent: 10,
            total_reactions: 38,
            avatar_color: "#10B981"
        },
        {
            user_id: 3,
            name: "David Chen",
            department: "Engineering",
            score: 187,
            rank: 3,
            shoutouts_received: 10,
            shoutouts_sent: 15,
            total_reactions: 32,
            avatar_color: "#8B5CF6"
        },
        {
            user_id: 4,
            name: "Emma Wilson",
            department: "Sales",
            score: 165,
            rank: 4,
            shoutouts_received: 8,
            shoutouts_sent: 12,
            total_reactions: 25,
            avatar_color: "#F59E0B"
        },
        {
            user_id: 5,
            name: "Michael Brown",
            department: "HR",
            score: 142,
            rank: 5,
            shoutouts_received: 7,
            shoutouts_sent: 9,
            total_reactions: 20,
            avatar_color: "#EF4444"
        },
        {
            user_id: 6,
            name: "Priya Sharma",
            department: "Engineering",
            score: 128,
            rank: 6,
            shoutouts_received: 6,
            shoutouts_sent: 8,
            total_reactions: 18,
            avatar_color: "#EC4899"
        },
        {
            user_id: 7,
            name: "James Taylor",
            department: "Marketing",
            score: 115,
            rank: 7,
            shoutouts_received: 5,
            shoutouts_sent: 7,
            total_reactions: 15,
            avatar_color: "#6366F1"
        },
        {
            user_id: 8,
            name: "Lisa Wang",
            department: "Finance",
            score: 98,
            rank: 8,
            shoutouts_received: 4,
            shoutouts_sent: 6,
            total_reactions: 12,
            avatar_color: "#14B8A6"
        },
        {
            user_id: 9,
            name: "Robert Garcia",
            department: "Sales",
            score: 85,
            rank: 9,
            shoutouts_received: 3,
            shoutouts_sent: 5,
            total_reactions: 10,
            avatar_color: "#F97316"
        },
        {
            user_id: 10,
            name: "Maria Gonzalez",
            department: "HR",
            score: 72,
            rank: 10,
            shoutouts_received: 2,
            shoutouts_sent: 4,
            total_reactions: 8,
            avatar_color: "#8B5CF6"
        }
    ];

    const demoDepartmentStats = [
        {
            department: "Engineering",
            total_shoutouts: 42,
            active_users: 4,
            avg_engagement: 3.2,
            most_active_user: "Alex Johnson"
        },
        {
            department: "Marketing",
            total_shoutouts: 28,
            active_users: 2,
            avg_engagement: 2.8,
            most_active_user: "Sarah Miller"
        },
        {
            department: "Sales",
            total_shoutouts: 22,
            active_users: 2,
            avg_engagement: 2.5,
            most_active_user: "Emma Wilson"
        },
        {
            department: "HR",
            total_shoutouts: 18,
            active_users: 2,
            avg_engagement: 2.2,
            most_active_user: "Michael Brown"
        },
        {
            department: "Finance",
            total_shoutouts: 12,
            active_users: 1,
            avg_engagement: 2.0,
            most_active_user: "Lisa Wang"
        }
    ];

    const demoHighlights = [
        {
            id: 1,
            from: "David Chen",
            to: "Alex Johnson",
            message: "Great work Alex for helping me debug that tricky API issue!",
            time_ago: "2 hours ago",
            reactions: { like: 8, clap: 5, star: 3 }
        },
        {
            id: 2,
            from: "Sarah Miller",
            to: "Emma Wilson",
            message: "Awesome presentation to clients yesterday!",
            time_ago: "1 day ago",
            reactions: { like: 12, clap: 7, star: 4 }
        },
        {
            id: 3,
            from: "Michael Brown",
            to: "Priya Sharma",
            message: "Excellent mentorship of new team members!",
            time_ago: "2 days ago",
            reactions: { like: 6, clap: 4, star: 2 }
        },
        {
            id: 4,
            from: "James Taylor",
            to: "David Chen",
            message: "Creative solution to our workflow problem!",
            time_ago: "3 days ago",
            reactions: { like: 9, clap: 3, star: 1 }
        }
    ];

    useEffect(() => {
        fetchLeaderboardData();
    }, [rangeType]);

    const fetchLeaderboardData = async () => {
        setLoading(true);
        try {
            // Try to fetch from API
            const [performersResponse, statsResponse, highlightsResponse] = await Promise.allSettled([
                axios.get('http://localhost:8000/api/leaderboard/top-performers', {
                    params: { range_type: rangeType }
                }),
                axios.get('http://localhost:8000/api/leaderboard/department-stats'),
                axios.get('http://localhost:8000/api/leaderboard/recent-highlights')
            ]);

            // Use API data if available, otherwise use demo data
            setTopPerformers(
                performersResponse.status === 'fulfilled' 
                    ? performersResponse.value.data 
                    : demoTopPerformers
            );
            
            setDepartmentStats(
                statsResponse.status === 'fulfilled' 
                    ? statsResponse.value.data 
                    : demoDepartmentStats
            );
            
            setRecentHighlights(
                highlightsResponse.status === 'fulfilled' 
                    ? highlightsResponse.value.data 
                    : demoHighlights
            );
            
            setError(null);
        } catch (err) {
            console.log('Using demo data:', err.message);
            // Use demo data if API fails
            setTopPerformers(demoTopPerformers);
            setDepartmentStats(demoDepartmentStats);
            setRecentHighlights(demoHighlights);
            setError('Connected to demo data. Backend not running.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        alert(`🏆 ${user.name}\nRank: #${user.rank}\nDepartment: ${user.department}\nScore: ${user.score} points\nShoutouts Received: ${user.shoutouts_received}\nShoutouts Sent: ${user.shoutouts_sent}`);
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
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <span className="text-yellow-600 mr-2">⚠️</span>
                            <span className="text-yellow-800">{error}</span>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <LeaderboardFilters 
                    rangeType={rangeType} 
                    onRangeChange={setRangeType} 
                />

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold mb-2">
                            {topPerformers[0]?.score || 0}
                        </div>
                        <div className="text-blue-100">Top Score</div>
                        <div className="text-sm mt-2 font-medium">
                            {topPerformers[0]?.name || 'Loading...'}
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold mb-2">
                            {departmentStats.reduce((sum, dept) => sum + dept.total_shoutouts, 0)}
                        </div>
                        <div className="text-green-100">Total Shoutouts</div>
                        <div className="text-sm mt-2 font-medium">
                            Across {departmentStats.length} departments
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold mb-2">
                            {recentHighlights.length}
                        </div>
                        <div className="text-purple-100">Recent Highlights</div>
                        <div className="text-sm mt-2 font-medium">
                            Latest recognitions
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Leaderboard Table */}
                    <div className="lg:col-span-2">
                        <LeaderboardTable 
                            data={topPerformers} 
                            onUserClick={handleUserClick}
                        />
                    </div>

                    {/* Right Column - Stats & Highlights */}
                    <div className="space-y-8">
                        <DepartmentStats data={departmentStats} />
                        <RecentHighlights data={recentHighlights} />
                        
                        {/* Refresh Button */}
                        <div className="text-center">
                            <button
                                onClick={fetchLeaderboardData}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center mx-auto"
                            >
                                <span className="mr-2">🔄</span> Refresh Data
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">How Scores are Calculated</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">10 points</div>
                            <div className="text-gray-700">Per shoutout received</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">5 points</div>
                            <div className="text-gray-700">Per shoutout sent</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">2 points</div>
                            <div className="text-gray-700">Per reaction received</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;

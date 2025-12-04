import { useState, useEffect } from 'react';
import leaderboardService from '../services/leaderboardService';

export const useLeaderboard = (rangeType = 'weekly') => {
    const [topPerformers, setTopPerformers] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [recentHighlights, setRecentHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, [rangeType]);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            
            const [performers, stats, highlights] = await Promise.all([
                leaderboardService.getTopPerformers(rangeType),
                leaderboardService.getDepartmentStats(),
                leaderboardService.getRecentHighlights()
            ]);
            
            setTopPerformers(performers);
            setDepartmentStats(stats);
            setRecentHighlights(highlights);
            setError(null);
        } catch (err) {
            setError('Failed to fetch leaderboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchLeaderboardData();
    };

    return {
        topPerformers,
        departmentStats,
        recentHighlights,
        loading,
        error,
        refreshData
    };
};
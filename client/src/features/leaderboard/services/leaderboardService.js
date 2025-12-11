import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

class LeaderboardService {
    async getTopPerformers(rangeType = 'weekly') {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaderboard/top-performers`, 
                { params: { range_type: rangeType } }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching top performers:', error);
            // Return empty array on error
            return [];
        }
    }

    async getDepartmentStats() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaderboard/department-stats`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching department stats:', error);
            return [];
        }
    }

    async getRecentHighlights() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaderboard/recent-highlights`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching highlights:', error);
            return [];
        }
    }
}

export default new LeaderboardService();

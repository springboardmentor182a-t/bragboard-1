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
            // Return demo data if API fails
            return this.getDemoLeaderboard();
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
            return this.getDemoDepartmentStats();
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
            return this.getDemoHighlights();
        }
    }

    // Demo data for development
    getDemoLeaderboard() {
        return [
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
            }
        ];
    }

    getDemoDepartmentStats() {
        return [
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
            }
        ];
    }

    getDemoHighlights() {
        return [
            {
                id: 1,
                from: "David Chen",
                to: "Alex Johnson",
                message: "Great work Alex! for helping me debug that tricky API issue",
                time_ago: "2 hours ago",
                reactions: { like: 8, clap: 5, star: 3 }
            },
            {
                id: 2,
                from: "Sarah Miller",
                to: "Emma Wilson",
                message: "Awesome job Emma! for the amazing presentation to clients",
                time_ago: "1 day ago",
                reactions: { like: 12, clap: 7, star: 4 }
            }
        ];
    }
}

export default new LeaderboardService();

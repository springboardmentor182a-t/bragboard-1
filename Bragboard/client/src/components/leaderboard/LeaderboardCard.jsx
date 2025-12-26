import "./LeaderboardCard.css";

const medal = ["🥇", "🥈", "🥉"];

const LeaderboardCard = ({ employee, index }) => {
  return (
    <div className="leaderboard-card">
      <div className="leaderboard-rank">
        {medal[index]}
      </div>

      <div className="leaderboard-name">
        {employee.name}
      </div>

      <div className="leaderboard-dept">
        {employee.department}
      </div>

      <div className="leaderboard-points">
        {employee.points} pts
      </div>
    </div>
  );
};

export default LeaderboardCard;

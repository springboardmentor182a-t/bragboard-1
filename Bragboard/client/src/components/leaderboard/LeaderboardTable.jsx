import LeaderboardRow from "./LeaderboardRow";

const LeaderboardTable = ({ leaderboard }) => (
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Department</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>
      {leaderboard.map(emp => (
        <LeaderboardRow key={emp.user_id} employee={emp} />
      ))}
    </tbody>
  </table>
);

export default LeaderboardTable;

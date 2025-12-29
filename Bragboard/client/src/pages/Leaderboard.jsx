import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/leaderboardApi";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  return (
    <div>
      <h2>Employee Leaderboard</h2>
      <LeaderboardTable leaderboard={leaderboard} />
    </div>
  );
};

export default Leaderboard;

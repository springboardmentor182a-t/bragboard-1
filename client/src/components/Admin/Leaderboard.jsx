function Leaderboard({ loading }) {
    if (loading) {
      return (
        <div className="animate-pulse bg-white p-4 rounded shadow">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
          ))}
        </div>
      );
    }
    return (
      <div className="bg-white p-4 rounded shadow">
        <div className="font-bold mb-2">Top Recognized Employees</div>
        <ol className="list-decimal ml-4">
          <li>Alice</li>
          <li>Bob</li>
          <li>Carlos</li>
        </ol>
      </div>
    );
  }
  export default Leaderboard;
  
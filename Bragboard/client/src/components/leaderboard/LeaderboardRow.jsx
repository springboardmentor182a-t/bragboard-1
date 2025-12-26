const LeaderboardRow = ({ employee }) => {
  return (
    <tr>
      <td>{employee.rank}</td>
      <td>{employee.name}</td>
      <td>{employee.department}</td>
      <td>{employee.points}</td>
    </tr>
  );
};

export default LeaderboardRow;

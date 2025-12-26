import Leaderboard from "./pages/Leaderboard";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🏆 Employee Leaderboard</h1>
        <p>Gamified recognition based on shout-outs & reactions</p>
      </header>

      <main className="app-content">
        <Leaderboard />
      </main>
    </div>
  );
}

export default App;

/**  LEADERBOARD.JSX – FINAL VERSION WITH XP BAR + CHART DESCRIPTIONS + TIME AGO  **/

import React, { useEffect, useMemo, useState } from "react";
import "./Leaderboard.css";

import LevelBadge from "../components/LevelBadge";
import XPBar from "../components/XPBar";

// Charts
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const API = "http://127.0.0.1:8000/leaderboard/";

/* ------------------------ TIME AGO FUNCTION ------------------------ */

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return `${years} years ago`;
}

/* ------------------------ SMALL HELPERS ------------------------ */

// Avatar initials
const Avatar = ({ name }) => {
  const initials = (name || "?")
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="avatar">
      <span>{initials || "?"}</span>
    </div>
  );
};

// Animated number
const AnimatedNumber = ({ value, duration = 600 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = display;
    const to = Number(value) || 0;

    const animate = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display}</span>;
};

const rankEmoji = (rank) =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";

/* ------------------------ FIXED CHART OPTIONS ------------------------ */
const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  layout: { padding: 0 },
  scales: {
    x: {
      ticks: { color: "var(--muted)" },
      grid: { display: false },
    },
    y: {
      ticks: { color: "var(--muted)" },
      beginAtZero: true,
      grid: { color: "rgba(0,0,0,0.05)" },
    },
  },
};

/* ------------------------ MAIN COMPONENT ------------------------ */

export default function Leaderboard() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("rank");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ------------------------ FETCH LEADERBOARD ------------------------ */

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error("Network error");
        return r.json();
      })
      .then((data) => {
        if (!alive) return;

        const enriched = (data || []).map((u, idx) => ({
          user_id: u.user_id ?? idx + 1,
          name: u.name ?? "Unknown",
          email: u.email ?? "",
          points: Number(u.points ?? 0),
          attempts: Number(u.attempts ?? 0),
          level: u.level ?? "Bronze",
          lastActive: u.lastActive ?? new Date().toISOString(),
          progress: typeof u.progress === "number" ? u.progress : Math.min(1, (u.points ?? 0) / 6),
        }));

        enriched.sort((a, b) => b.points - a.points);

        const withRank = enriched.map((u, i) => ({ ...u, rank: i + 1 }));

        setRows(withRank);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setErr("Failed to load leaderboard.");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  /* ------------------------ FILTER + SORT ------------------------ */

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = rows.slice();

    if (q) {
      list = list.filter((r) =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "points") return (a.points - b.points) * dir;
      return (a.rank - b.rank) * dir;
    });

    return list;
  }, [rows, search, sortKey, sortDir]);

  /* ------------------------ PAGINATION ------------------------ */

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, maxPage);
  const slice = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ------------------------ CHART DATA ------------------------ */

  const barData = {
    labels: rows.map((u) => u.name),
    datasets: [
      {
        label: "Points",
        data: rows.map((u) => u.points),
        backgroundColor: "#7c5cff",
      },
    ],
  };

  const pieData = {
    labels: rows.slice(0, 5).map((u) => u.name),
    datasets: [
      {
        data: rows.slice(0, 5).map((u) => u.points),
        backgroundColor: ["#7c5cff", "#5b4bff", "#18a6ff", "#00d4ff", "#a9b5d9"],
      },
    ],
  };

  return (
    <div className="lb-shell">
      {/* Sidebar */}
      <aside className="lb-sidebar glass">
        <div className="brand">🏆 BragBoard</div>

        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/leaderboard" className="nav-link active">Leaderboard</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/signup" className="nav-link">Signup</a>
          <a href="/settings" className="nav-link">Settings</a>
        </nav>

        <div className="spacer" />

        <button
          className="toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lb-main">
        <header className="lb-header">
          <h1>Leaderboard</h1>

          <div className="lb-actions">
            <input
              className="search"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </header>

        {/* TABLE */}
        <section className="glass table-wrap">
          {loading && <div className="state">Loading…</div>}
          {err && <div className="state error">{err}</div>}

          {!loading && slice.length > 0 && (
            <table className="lb-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Points</th>
                  <th>Level / XP</th>
                  <th>Attempts</th>
                  <th>Last Active</th>
                </tr>
              </thead>

              <tbody>
                {slice.map((u) => (
                  <tr key={`${u.user_id}-${u.rank}`}>
                    <td>
                      <span className="rank">
                        {u.rank} <span className="rank-emoji">{rankEmoji(u.rank)}</span>
                      </span>
                    </td>

                    <td>
                      <div className="usercell">
                        <Avatar name={u.name} />
                        <div className="u-meta">
                          <div className="u-name">{u.name}</div>
                          <div className="u-sub">ID: {u.user_id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="email">{u.email}</td>

                    <td>
                      <span className="points-badge">
                        <AnimatedNumber value={u.points} />
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <LevelBadge level={u.level} />
                        <div style={{ width: 160 }}>
                          <XPBar progress={u.progress} />
                        </div>
                      </div>
                    </td>

                    <td>{u.attempts}</td>

                    {/* 🔥 Updated Last Active → human-readable time */}
                    <td title={new Date(u.lastActive).toLocaleString()}>
                      {timeAgo(u.lastActive)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* CHARTS WITH DESCRIPTIONS */}
        <div className="charts">

          {/* BAR CHART */}
          <div className="glass chart-card">
            <h3>Points Comparison (Bar)</h3>
            <div className="chart-box">
              <Bar data={barData} options={chartOptions} />
            </div>
            <p className="chart-desc">
              This bar chart compares total points earned by each user.
            </p>
          </div>

          {/* PIE CHART */}
          <div className="glass chart-card">
            <h3>Top 5 Users (Pie)</h3>
            <div className="chart-box">
              <Pie data={pieData} options={chartOptions} />
            </div>
            <p className="chart-desc">
              This pie chart shows point distribution among the top five users.
            </p>
          </div>
        </div>

        {/* PAGINATION */}
        <footer className="pager">
          <button
            className="pill"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            ◀ Prev
          </button>

          <span className="page-indicator">
            Page <b>{currentPage}</b> of <b>{maxPage}</b>
          </span>

          <button
            className="pill"
            disabled={currentPage >= maxPage}
            onClick={() => setPage(currentPage + 1)}
          >
            Next ▶
          </button>
        </footer>
      </main>
    </div>
  );
}

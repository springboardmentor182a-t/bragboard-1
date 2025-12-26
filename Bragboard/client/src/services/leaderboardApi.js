const BASE_URL = "http://localhost:8000";

export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${BASE_URL}/leaderboard`);

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    return await response.json();
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return [];
  }
}

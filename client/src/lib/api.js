
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

async function parseResponse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function postJson(path, body, includeCredentials = true) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: includeCredentials ? "include" : "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseResponse(res);
  return { status: res.status, data };
}

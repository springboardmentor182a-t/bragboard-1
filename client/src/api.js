const API_BASE = 'http://127.0.0.1:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text}`);
  }
  return response.json();
}

export async function getJson(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse(response);
}

export async function postJson(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

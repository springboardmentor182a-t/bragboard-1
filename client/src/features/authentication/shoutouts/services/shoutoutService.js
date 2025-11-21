const API_URL = "http://127.0.0.1:8000/shoutouts";

export async function getAllShoutouts() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getShoutout(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function createShoutout(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function updateShoutout(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function deleteShoutout(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return await res.json();
}

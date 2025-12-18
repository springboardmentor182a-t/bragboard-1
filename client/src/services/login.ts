// client/src/services/login.ts

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// BACKEND URL (change depending on your setup)
const API_URL = "http://localhost:8000";

/**
 * Login to the backend (FastAPI)
 * Sends username + password and retrieves a JWT.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  const data = await response.json();
  return data as LoginResponse;
}

/**
 * Store JWT in localStorage
 */
export function storeToken(token: string) {
  localStorage.setItem("bragboard_token", token);
}

/**
 * Get stored JWT
 */
export function getToken(): string | null {
  return localStorage.getItem("bragboard_token");
}

/**
 * Remove JWT on logout
 */
export function logout() {
  localStorage.removeItem("bragboard_token");
}

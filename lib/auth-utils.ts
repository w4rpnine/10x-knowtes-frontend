// Create a utility file for authentication functions
export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-token")
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth-token")
  }
  return null
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-token", token)
  }
}

export function isAuthenticated() {
  return getAuthToken() !== null
}

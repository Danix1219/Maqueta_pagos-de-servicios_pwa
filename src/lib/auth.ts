export const DEMO_ACCOUNT = "SMM-001245"
export const DEFAULT_DEMO_PASSWORD = "Agua2026!"

const PASSWORD_KEY = "smm_demo_password"

export function normalizeServiceAccount(value: string) {
  return value.trim().toUpperCase()
}

export function isValidServiceAccount(value: string) {
  return /^SMM-\d{6}$/.test(normalizeServiceAccount(value))
}

export function getDemoPassword() {
  return localStorage.getItem(PASSWORD_KEY) ?? DEFAULT_DEMO_PASSWORD
}

export function saveDemoPassword(password: string) {
  localStorage.setItem(PASSWORD_KEY, password)
}

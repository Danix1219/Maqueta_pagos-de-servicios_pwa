export type StaffRole = "admin" | "cashier"

export type StaffSession = {
  role: StaffRole
  id: string
  name: string
  workstation?: string
  startedAt: string
}

const SESSION_KEY = "asm_staff_session"

export const DEMO_ADMIN = {
  id: "ADM-001",
  password: "Admin2026!",
  name: "Administrador Principal",
}

export const DEMO_CASHIER = {
  id: "CAJ-007",
  pin: "4826",
  name: "Ana Torres",
  workstation: "Caja 01",
}

export function saveStaffSession(session: StaffSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getStaffSession(): StaffSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as StaffSession) : null
  } catch {
    return null
  }
}

export function clearStaffSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

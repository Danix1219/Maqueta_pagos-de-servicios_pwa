export type FieldHomeStatus =
  | "pending"
  | "completed"
  | "incident"
  | "review"
  | "absent"

export type FieldHome = {
  id: string
  account: string
  owner: string
  address: string
  zone: string
  meter: string
  previousReading: number
  currentReading?: number
  consumption?: number
  amount?: number
  status: FieldHomeStatus
  accessNote?: string
  phoneMasked?: string
  incidentRef?: string
  outcomeLabel?: string
  location: {
    x: number
    y: number
    sequence: number
    etaMinutes: number
    distanceMeters: number
  }
}

export type SyncItem = {
  id: string
  type: "reading" | "incident" | "delivery" | "absence" | "review"
  label: string
  createdAt: string
  status: "pending" | "synced" | "error"
}

export type FieldState = {
  employee: {
    id: string
    name: string
    initials: string
  }
  route: {
    id: string
    name: string
    period: string
    total: number
    startedAt?: string
    closedAt?: string
  }
  online: boolean
  lastSyncAt?: string
  activeHomeId: string
  tracking: {
    enabled: boolean
    currentHomeId: string
    lastUpdatedAt?: string
  }
  homes: FieldHome[]
  syncQueue: SyncItem[]
}

const STORAGE_KEY = "asm_field_state_v2"

const initialState: FieldState = {
  employee: {
    id: "CAM-014",
    name: "Luis Martínez",
    initials: "LM",
  },
  route: {
    id: "RUTA-CEN-09",
    name: "Sector Centro",
    period: "Septiembre 2026",
    total: 6,
  },
  online: true,
  lastSyncAt: new Date().toISOString(),
  activeHomeId: "T-001245",
  tracking: {
    enabled: false,
    currentHomeId: "T-001245",
  },
  homes: [
    {
      id: "T-001245",
      account: "SMM-001245",
      owner: "María Hernández López",
      address: "Morelos 24, Centro",
      zone: "Centro",
      meter: "M-0245",
      previousReading: 1200,
      status: "pending",
      accessNote: "Medidor al frente, junto a la puerta principal.",
      phoneMasked: "•••• •• 4821",
      location: { x: 116, y: 288, sequence: 1, etaMinutes: 4, distanceMeters: 320 },
    },
    {
      id: "T-001246",
      account: "SMM-001246",
      owner: "José Pérez Ramírez",
      address: "Hidalgo 18, Centro",
      zone: "Centro",
      meter: "M-0246",
      previousReading: 844,
      status: "pending",
      accessNote: "Acceso por portón gris. Tocar timbre una vez.",
      phoneMasked: "•••• •• 1178",
      location: { x: 238, y: 226, sequence: 2, etaMinutes: 7, distanceMeters: 540 },
    },
    {
      id: "T-001247",
      account: "SMM-001247",
      owner: "Ana García Torres",
      address: "Juárez 5, Centro",
      zone: "Centro",
      meter: "M-0247",
      previousReading: 1550,
      status: "incident",
      incidentRef: "INC-2609-031",
      outcomeLabel: "Medidor sin acceso",
      accessNote: "Incidencia registrada en visita anterior.",
      phoneMasked: "•••• •• 3502",
      location: { x: 356, y: 302, sequence: 3, etaMinutes: 5, distanceMeters: 410 },
    },
    {
      id: "T-001248",
      account: "SMM-001248",
      owner: "Carlos López Vega",
      address: "Madero 112, Centro",
      zone: "Centro",
      meter: "M-0248",
      previousReading: 720,
      currentReading: 734,
      consumption: 14,
      amount: 140,
      status: "completed",
      outcomeLabel: "Recibo entregado",
      phoneMasked: "•••• •• 9914",
      location: { x: 466, y: 205, sequence: 4, etaMinutes: 8, distanceMeters: 680 },
    },
    {
      id: "T-001249",
      account: "SMM-001249",
      owner: "Laura Sánchez Díaz",
      address: "Guerrero 31, Centro",
      zone: "Centro",
      meter: "M-0249",
      previousReading: 998,
      status: "pending",
      accessNote: "Medidor dentro de nicho exterior.",
      phoneMasked: "•••• •• 7319",
      location: { x: 596, y: 258, sequence: 5, etaMinutes: 6, distanceMeters: 470 },
    },
    {
      id: "T-001250",
      account: "SMM-001250",
      owner: "Miguel Ortiz Cruz",
      address: "Allende 7, Centro",
      zone: "Centro",
      meter: "M-0250",
      previousReading: 2103,
      currentReading: 2172,
      consumption: 69,
      status: "review",
      outcomeLabel: "Consumo atípico en revisión",
      phoneMasked: "•••• •• 6640",
      location: { x: 650, y: 126, sequence: 6, etaMinutes: 9, distanceMeters: 760 },
    },
  ],
  syncQueue: [],
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage
}

export function getFieldState(): FieldState {
  if (!canUseStorage()) return initialState
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }
  try {
    const parsed = JSON.parse(raw) as Partial<FieldState>
    const normalized: FieldState = {
      ...initialState,
      ...parsed,
      employee: { ...initialState.employee, ...parsed.employee },
      route: { ...initialState.route, ...parsed.route },
      tracking: { ...initialState.tracking, ...parsed.tracking },
      homes: (parsed.homes ?? initialState.homes).map((home, index) => ({
        ...initialState.homes[index],
        ...home,
        location: home.location ?? initialState.homes[index]?.location ?? { x: 100 + index * 90, y: 240, sequence: index + 1, etaMinutes: 5, distanceMeters: 400 },
      })),
      syncQueue: parsed.syncQueue ?? initialState.syncQueue,
    }
    return normalized
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }
}

export function saveFieldState(next: FieldState) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent("asm-field-state-change", { detail: next }))
  }
  return next
}

export function resetFieldDemo() {
  return saveFieldState({
    ...initialState,
    lastSyncAt: new Date().toISOString(),
  })
}

export function updateFieldState(
  updater: (current: FieldState) => FieldState,
): FieldState {
  const current = getFieldState()
  return saveFieldState(updater(current))
}

export function setRouteStarted() {
  const now = new Date().toISOString()
  return updateFieldState((state) => ({
    ...state,
    route: {
      ...state.route,
      startedAt: state.route.startedAt ?? now,
      closedAt: undefined,
    },
    tracking: {
      enabled: true,
      currentHomeId: state.activeHomeId,
      lastUpdatedAt: now,
    },
  }))
}

export function setActiveHome(homeId: string) {
  return updateFieldState((state) => ({
    ...state,
    activeHomeId: homeId,
    tracking: {
      enabled: true,
      currentHomeId: homeId,
      lastUpdatedAt: new Date().toISOString(),
    },
  }))
}

export function refreshFieldPosition() {
  return updateFieldState((state) => ({
    ...state,
    tracking: {
      enabled: true,
      currentHomeId: state.activeHomeId,
      lastUpdatedAt: new Date().toISOString(),
    },
  }))
}

export function assignFieldRoute(input: {
  id: string
  period: string
  sector: string
  employeeId: string
  employeeName: string
  homeIds: string[]
}) {
  return updateFieldState((state) => {
    if (state.employee.id !== input.employeeId) return state
    const assignedHomes = state.homes
      .filter((home) => input.homeIds.includes(home.id))
      .sort((a, b) => a.location.sequence - b.location.sequence)
      .map((home, index) => ({
        ...home,
        status: "pending" as const,
        currentReading: undefined,
        consumption: undefined,
        amount: undefined,
        incidentRef: undefined,
        outcomeLabel: undefined,
        location: { ...home.location, sequence: index + 1 },
      }))
    const firstHome = assignedHomes[0]
    return {
      ...state,
      employee: {
        ...state.employee,
        name: input.employeeName,
        initials: input.employeeName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      },
      route: {
        id: input.id,
        name: `Sector ${input.sector}`,
        period: input.period,
        total: assignedHomes.length,
      },
      activeHomeId: firstHome?.id ?? state.activeHomeId,
      tracking: {
        enabled: false,
        currentHomeId: firstHome?.id ?? state.activeHomeId,
      },
      homes: assignedHomes,
      syncQueue: [],
    }
  })
}

export function getActiveHome(state = getFieldState()) {
  return state.homes.find((home) => home.id === state.activeHomeId) ?? state.homes[0]
}

export function updateActiveHome(patch: Partial<FieldHome>) {
  return updateFieldState((state) => ({
    ...state,
    homes: state.homes.map((home) =>
      home.id === state.activeHomeId ? { ...home, ...patch } : home,
    ),
  }))
}

export function updateHome(homeId: string, patch: Partial<FieldHome>) {
  return updateFieldState((state) => ({
    ...state,
    homes: state.homes.map((home) =>
      home.id === homeId ? { ...home, ...patch } : home,
    ),
  }))
}

export function addSyncItem(
  type: SyncItem["type"],
  label: string,
  status: SyncItem["status"] = "pending",
) {
  const item: SyncItem = {
    id: `SYNC-${Date.now()}`,
    type,
    label,
    createdAt: new Date().toISOString(),
    status,
  }
  return updateFieldState((state) => ({
    ...state,
    syncQueue: [item, ...state.syncQueue],
  }))
}

export function setConnectivity(online: boolean) {
  return updateFieldState((state) => ({ ...state, online }))
}

export function syncAllPending() {
  return updateFieldState((state) => ({
    ...state,
    lastSyncAt: new Date().toISOString(),
    syncQueue: state.syncQueue.map((item) => ({ ...item, status: "synced" })),
  }))
}

export function getRouteStats(state = getFieldState()) {
  const completed = state.homes.filter((home) => home.status === "completed").length
  const incidents = state.homes.filter((home) => home.status === "incident").length
  const reviews = state.homes.filter((home) => home.status === "review").length
  const absent = state.homes.filter((home) => home.status === "absent").length
  const pending = state.homes.filter((home) => home.status === "pending").length
  const resolved = completed + incidents + reviews + absent
  return {
    completed,
    incidents,
    reviews,
    absent,
    pending,
    resolved,
    progress: state.homes.length ? Math.round((resolved / state.homes.length) * 100) : 0,
  }
}

export function formatFieldTime(iso?: string) {
  if (!iso) return "Sin registro"
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

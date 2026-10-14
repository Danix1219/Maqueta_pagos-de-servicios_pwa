export type BillStatus = "pending" | "paid" | "review"
export type AccountStatus = "current" | "debt" | "review" | "inactive"
export type PaymentMethod = "cash" | "terminal" | "online"

export type AdminBill = {
  id: string
  period: string
  dueDate: string
  consumption: number
  amount: number
  status: BillStatus
  paidAt?: string
  paymentFolio?: string
  method?: PaymentMethod
}

export type AdminAccount = {
  id: string
  name: string
  address: string
  zone: string
  phone: string
  email: string
  takeId: string
  meterId: string
  status: AccountStatus
  activationCode: string
  createdAt: string
  bills: AdminBill[]
}

export type AdminPayment = {
  folio: string
  accountId: string
  holder: string
  billId: string
  period: string
  amount: number
  method: PaymentMethod
  received?: number
  change?: number
  terminalReference?: string
  cashier: string
  desk: string
  createdAt: string
}

export type RouteAssignment = {
  id: string
  period: string
  sector: string
  employeeId: string
  employeeName: string
  homes: number
  status: "draft" | "assigned" | "in_progress" | "closed"
  assignedAt?: string
}

export type AdminState = {
  accounts: AdminAccount[]
  payments: AdminPayment[]
  routes: RouteAssignment[]
}

const STORAGE_KEY = "asm_admin_state_v3"

const initialAccounts: AdminAccount[] = [
  {
    id: "SMM-001245",
    name: "María Hernández López",
    address: "Morelos 24, Centro",
    zone: "Centro",
    phone: "442 555 4821",
    email: "maria.hernandez@correo.mx",
    takeId: "T-001245",
    meterId: "M-0245",
    status: "debt",
    activationCode: "ASM-8264",
    createdAt: "2025-10-12T10:00:00.000Z",
    bills: [
      { id: "SEPT-001245", period: "Septiembre 2026", dueDate: "2026-09-30", consumption: 15, amount: 150, status: "pending" },
      { id: "AUG-001245", period: "Agosto 2026", dueDate: "2026-08-31", consumption: 13, amount: 130, status: "paid", paidAt: "2026-08-25T16:10:00.000Z", paymentFolio: "CAJA-2026-0063", method: "cash" },
    ],
  },
  {
    id: "SMM-001246",
    name: "José Pérez Ramírez",
    address: "Hidalgo 18, Centro",
    zone: "Centro",
    phone: "442 555 1178",
    email: "j.perez@correo.mx",
    takeId: "T-001246",
    meterId: "M-0246",
    status: "debt",
    activationCode: "ASM-4318",
    createdAt: "2025-11-03T12:00:00.000Z",
    bills: [
      { id: "SEPT-001246", period: "Septiembre 2026", dueDate: "2026-09-30", consumption: 17, amount: 170, status: "pending" },
      { id: "AUG-001246", period: "Agosto 2026", dueDate: "2026-08-31", consumption: 16, amount: 160, status: "pending" },
    ],
  },
  {
    id: "SMM-001247",
    name: "Ana García Torres",
    address: "Juárez 5, Centro",
    zone: "Centro",
    phone: "442 555 3502",
    email: "ana.garcia@correo.mx",
    takeId: "T-001247",
    meterId: "M-0247",
    status: "review",
    activationCode: "ASM-9201",
    createdAt: "2026-01-18T09:30:00.000Z",
    bills: [
      { id: "SEPT-001247", period: "Septiembre 2026", dueDate: "2026-09-30", consumption: 0, amount: 0, status: "review" },
    ],
  },
  {
    id: "SMM-001248",
    name: "Carlos López Vega",
    address: "Madero 112, Centro",
    zone: "Centro",
    phone: "442 555 9914",
    email: "carlos.lopez@correo.mx",
    takeId: "T-001248",
    meterId: "M-0248",
    status: "current",
    activationCode: "ASM-5540",
    createdAt: "2025-08-07T15:15:00.000Z",
    bills: [
      { id: "SEPT-001248", period: "Septiembre 2026", dueDate: "2026-09-30", consumption: 14, amount: 140, status: "paid", paidAt: "2026-09-14T15:00:00.000Z", paymentFolio: "CAJA-2026-0080", method: "cash" },
    ],
  },
  {
    id: "SMM-001249",
    name: "Laura Sánchez Díaz",
    address: "Guerrero 31, Centro",
    zone: "Centro",
    phone: "442 555 7319",
    email: "laura.sanchez@correo.mx",
    takeId: "T-001249",
    meterId: "M-0249",
    status: "debt",
    activationCode: "ASM-6137",
    createdAt: "2026-03-10T11:45:00.000Z",
    bills: [
      { id: "SEPT-001249", period: "Septiembre 2026", dueDate: "2026-09-30", consumption: 11, amount: 110, status: "pending" },
    ],
  },
  {
    id: "SMM-001250",
    name: "Miguel Ortiz Cruz",
    address: "Allende 7, Centro",
    zone: "Centro",
    phone: "442 555 6640",
    email: "miguel.ortiz@correo.mx",
    takeId: "T-001250",
    meterId: "M-0250",
    status: "review",
    activationCode: "ASM-7702",
    createdAt: "2025-12-16T10:20:00.000Z",
    bills: [
      { id: "SEPT-001250", period: "Septiembre 2026", dueDate: "2026-09-30", consumption: 69, amount: 0, status: "review" },
    ],
  },
]

const initialPayments: AdminPayment[] = [
  { folio: "CAJA-2026-0080", accountId: "SMM-001248", holder: "Carlos López Vega", billId: "SEPT-001248", period: "Septiembre 2026", amount: 140, method: "cash", received: 200, change: 60, cashier: "Ana Torres", desk: "Caja 01", createdAt: "2026-09-14T15:00:00.000Z" },
  { folio: "WEB-2026-1934", accountId: "SMM-001252", holder: "Lucía Mendoza", billId: "SEPT-001252", period: "Septiembre 2026", amount: 160, method: "online", cashier: "Pago en línea", desk: "Portal", createdAt: "2026-09-14T13:18:00.000Z" },
  { folio: "CAJA-2026-0079", accountId: "SMM-001251", holder: "Rosa Martínez", billId: "SEPT-001251", period: "Septiembre 2026", amount: 150, method: "terminal", terminalReference: "TERM-519208", cashier: "Miguel Romero", desk: "Caja 02", createdAt: "2026-09-14T12:42:00.000Z" },
]

const initialRoutes: RouteAssignment[] = [
  { id: "RUTA-CEN-09", period: "Septiembre 2026", sector: "Centro", employeeId: "CAM-014", employeeName: "Luis Martínez", homes: 6, status: "in_progress", assignedAt: "2026-09-20T13:00:00.000Z" },
  { id: "RUTA-NOR-09", period: "Septiembre 2026", sector: "Norte", employeeId: "CAM-009", employeeName: "Erika Torres", homes: 20, status: "assigned", assignedAt: "2026-09-20T13:05:00.000Z" },
]

const initialState: AdminState = { accounts: initialAccounts, payments: initialPayments, routes: initialRoutes }

function storageAvailable() {
  return typeof window !== "undefined" && !!window.localStorage
}

export function getAdminState(): AdminState {
  if (!storageAvailable()) return initialState
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }
  try {
    return JSON.parse(raw) as AdminState
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }
}

export function saveAdminState(state: AdminState) {
  if (storageAvailable()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return state
}

export function updateAdminState(updater: (state: AdminState) => AdminState) {
  return saveAdminState(updater(getAdminState()))
}

export function resetAdminDemo() {
  return saveAdminState(initialState)
}

export function findAccount(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return getAdminState().accounts.filter((account) =>
    [account.id, account.name, account.address, account.takeId, account.meterId]
      .some((value) => value.toLowerCase().includes(q)),
  )
}

export function getAccount(id: string) {
  return getAdminState().accounts.find((account) => account.id === id)
}

export function getPendingBills(accountId: string) {
  return getAccount(accountId)?.bills.filter((bill) => bill.status === "pending") ?? []
}

export function recordPayment(input: {
  accountId: string
  billId: string
  method: PaymentMethod
  received?: number
  terminalReference?: string
  cashier: string
  desk: string
}) {
  let payment: AdminPayment | null = null
  updateAdminState((state) => {
    const account = state.accounts.find((item) => item.id === input.accountId)
    const bill = account?.bills.find((item) => item.id === input.billId)
    if (!account || !bill || bill.status !== "pending") return state

    const now = new Date()
    const cashCount = state.payments.filter((item) => item.folio.startsWith("CAJA-")).length
    const folio = `CAJA-${now.getFullYear()}-${String(79 + cashCount).padStart(4, "0")}`
    const received = input.method === "cash" ? input.received ?? bill.amount : undefined
    const change = input.method === "cash" ? Math.max(0, (received ?? 0) - bill.amount) : undefined
    payment = {
      folio,
      accountId: account.id,
      holder: account.name,
      billId: bill.id,
      period: bill.period,
      amount: bill.amount,
      method: input.method,
      received,
      change,
      terminalReference: input.terminalReference,
      cashier: input.cashier,
      desk: input.desk,
      createdAt: now.toISOString(),
    }

    const accounts = state.accounts.map((item) => {
      if (item.id !== account.id) return item
      const bills = item.bills.map((candidate) =>
        candidate.id === bill.id
          ? { ...candidate, status: "paid" as const, paidAt: now.toISOString(), paymentFolio: folio, method: input.method }
          : candidate,
      )
      const hasPending = bills.some((candidate) => candidate.status === "pending")
      const hasReview = bills.some((candidate) => candidate.status === "review")
      return { ...item, bills, status: hasReview ? "review" as const : hasPending ? "debt" as const : "current" as const }
    })

    return { ...state, accounts, payments: [payment!, ...state.payments] }
  })
  return payment
}

export function createAccount(input: Omit<AdminAccount, "createdAt" | "bills" | "status">) {
  const current = getAdminState()
  const duplicate = current.accounts.find((account) =>
    account.id === input.id ||
    account.takeId.toUpperCase() === input.takeId.toUpperCase() ||
    account.meterId.toUpperCase() === input.meterId.toUpperCase() ||
    account.activationCode.toUpperCase() === input.activationCode.toUpperCase(),
  )
  if (duplicate) {
    const field: "account" | "take" | "meter" | "activation" = duplicate.id === input.id ? "account" : duplicate.takeId.toUpperCase() === input.takeId.toUpperCase() ? "take" : duplicate.meterId.toUpperCase() === input.meterId.toUpperCase() ? "meter" : "activation"
    return { ok: false as const, account: duplicate, field }
  }
  const account: AdminAccount = {
    ...input,
    status: "current",
    createdAt: new Date().toISOString(),
    bills: [],
  }
  updateAdminState((state) => ({ ...state, accounts: [account, ...state.accounts] }))
  return { ok: true as const, account, field: null }
}

export function addRouteAssignment(input: Omit<RouteAssignment, "id" | "status" | "assignedAt">) {
  const current = getAdminState()
  const duplicate = current.routes.find((route) => route.period === input.period && route.sector === input.sector && route.status !== "closed")
  if (duplicate) return { ok: false as const, route: duplicate }
  const route: RouteAssignment = {
    ...input,
    id: `RUTA-${input.sector.slice(0, 3).toUpperCase()}-${String(current.routes.length + 9).padStart(2, "0")}`,
    status: "assigned",
    assignedAt: new Date().toISOString(),
  }
  updateAdminState((state) => ({ ...state, routes: [route, ...state.routes] }))
  return { ok: true as const, route }
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value)
}

export function formatAdminDate(iso: string) {
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
}

export function statusLabel(status: AccountStatus) {
  if (status === "current") return "Al corriente"
  if (status === "debt") return "Con adeudo"
  if (status === "review") return "En revisión"
  return "Inactiva"
}

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown"
export type PaymentStatus = "draft" | "auth_required" | "processing" | "approved" | "pending" | "declined" | "unknown"
export type DemoResult = "approved" | "pending" | "declined" | "unknown"

export type PaymentCardForm = {
  cardholder: string
  cardNumber: string
  expiry: string
  cvv: string
  email: string
  postalCode: string
  acceptTerms: boolean
}

export type PaymentSession = {
  account: string
  holder: string
  receipt: string
  period: string
  amount: number
  currency: "MXN"
  status: PaymentStatus
  brand: CardBrand
  last4: string
  cardholder: string
  email: string
  postalCode: string
  attemptId: string
  transactionId?: string
  authorizationCode?: string
  createdAt: string
  paidAt?: string
  demoResult: DemoResult
}

export const CURRENT_BILL = {
  account: "SMM-001245",
  holder: "María Hernández López",
  receipt: "SEPT-001245",
  period: "Septiembre 2026",
  amount: 150,
  currency: "MXN" as const,
}

const STORAGE_KEY = "asm_online_payment_session"
const DEMO_RESULT_KEY = "asm_online_payment_demo_result"

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export function detectCardBrand(value: string): CardBrand {
  const digits = onlyDigits(value)
  if (/^4/.test(digits)) return "visa"
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard"
  if (/^3[47]/.test(digits)) return "amex"
  return "unknown"
}

export function cardBrandLabel(brand: CardBrand) {
  if (brand === "visa") return "Visa"
  if (brand === "mastercard") return "Mastercard"
  if (brand === "amex") return "American Express"
  return "Tarjeta"
}

export function formatCardNumber(value: string) {
  const digits = onlyDigits(value).slice(0, 19)
  const brand = detectCardBrand(digits)
  if (brand === "amex") {
    const parts = [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean)
    return parts.join(" ")
  }
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

export function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function luhnValid(value: string) {
  const digits = onlyDigits(value)
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let doubleDigit = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

export function expiryValid(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export function validateCardForm(form: PaymentCardForm) {
  const errors: Partial<Record<keyof PaymentCardForm, string>> = {}
  const brand = detectCardBrand(form.cardNumber)
  const digits = onlyDigits(form.cardNumber)
  const cardholderParts = form.cardholder.trim().split(/\s+/).filter(Boolean)

  if (cardholderParts.length < 2 || !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/.test(form.cardholder.trim())) {
    errors.cardholder = "Escribe el nombre y apellido tal como aparecen en la tarjeta."
  }

  if (!luhnValid(digits)) {
    errors.cardNumber = "Revisa el número de tarjeta."
  }

  if (!expiryValid(form.expiry)) {
    errors.expiry = "Ingresa una fecha vigente en formato MM/AA."
  }

  const cvvLength = brand === "amex" ? 4 : 3
  if (!new RegExp(`^\\d{${cvvLength}}$`).test(onlyDigits(form.cvv))) {
    errors.cvv = `Ingresa los ${cvvLength} dígitos de seguridad.`
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Ingresa un correo válido para recibir el comprobante."
  }

  if (!/^\d{5}$/.test(onlyDigits(form.postalCode))) {
    errors.postalCode = "El código postal debe tener 5 dígitos."
  }

  if (!form.acceptTerms) {
    errors.acceptTerms = "Debes aceptar la autorización del cargo para continuar."
  }

  return errors
}

export function getDemoResult(): DemoResult {
  const result = sessionStorage.getItem(DEMO_RESULT_KEY)
  if (result === "pending" || result === "declined" || result === "unknown") return result
  return "approved"
}

export function setDemoResult(result: DemoResult) {
  sessionStorage.setItem(DEMO_RESULT_KEY, result)
}

export function createPaymentSession(form: PaymentCardForm): PaymentSession {
  const digits = onlyDigits(form.cardNumber)
  const session: PaymentSession = {
    ...CURRENT_BILL,
    status: "auth_required",
    brand: detectCardBrand(digits),
    last4: digits.slice(-4),
    cardholder: form.cardholder.trim(),
    email: form.email.trim().toLowerCase(),
    postalCode: onlyDigits(form.postalCode),
    attemptId: `ATT-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    demoResult: getDemoResult(),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function getPaymentSession(): PaymentSession | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PaymentSession
  } catch {
    return null
  }
}

export function updatePaymentSession(patch: Partial<PaymentSession>) {
  const current = getPaymentSession()
  if (!current) return null
  const updated = { ...current, ...patch }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function completeApprovedPayment() {
  const now = new Date()
  const transactionId = `PAG-${now.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  const authorizationCode = String(Math.floor(Math.random() * 900000) + 100000)
  return updatePaymentSession({
    status: "approved",
    transactionId,
    authorizationCode,
    paidAt: now.toISOString(),
  })
}

export function clearPaymentSession() {
  sessionStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(DEMO_RESULT_KEY)
}

export function maskCard(session: Pick<PaymentSession, "brand" | "last4">) {
  return `${cardBrandLabel(session.brand)} •••• ${session.last4}`
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPaymentDate(iso?: string) {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

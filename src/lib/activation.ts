export type ActivationChannel = "sms" | "email"

export type ActivationState = {
  account: string
  activationCode: string
  accountValidated: boolean
  channel?: ActivationChannel
  otpSent?: boolean
  contactVerified?: boolean
  activated?: boolean
}

const ACTIVATION_KEY = "smm_activation_flow"
const ACTIVATED_KEY = "smm_demo_account_activated"

export const DEMO_ACTIVATION = {
  account: "SMM-001245",
  activationCode: "ASM-8264",
  otp: "246810",
  holder: "María Hernández López",
  address: "Calle Morelos 24, Centro",
  phone: "•••• •• 4821",
  email: "m••••@correo.mx",
}

export function getActivationState(): ActivationState | null {
  try {
    const raw = sessionStorage.getItem(ACTIVATION_KEY)
    return raw ? (JSON.parse(raw) as ActivationState) : null
  } catch {
    return null
  }
}

export function saveActivationState(state: ActivationState) {
  sessionStorage.setItem(ACTIVATION_KEY, JSON.stringify(state))
}

export function patchActivationState(patch: Partial<ActivationState>) {
  const current = getActivationState() ?? {
    account: "",
    activationCode: "",
    accountValidated: false,
  }
  const next = { ...current, ...patch }
  saveActivationState(next)
  return next
}

export function clearActivationState() {
  sessionStorage.removeItem(ACTIVATION_KEY)
}

export function markDemoAccountActivated() {
  localStorage.setItem(ACTIVATED_KEY, "true")
  patchActivationState({ activated: true })
}

export function isDemoAccountActivated() {
  return localStorage.getItem(ACTIVATED_KEY) === "true"
}

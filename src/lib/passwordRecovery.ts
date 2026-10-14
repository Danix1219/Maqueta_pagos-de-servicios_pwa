import { DEMO_ACCOUNT } from "./auth"

export type RecoveryChannel = "sms" | "email"

export type PasswordRecoveryState = {
  account: string
  accountValidated: boolean
  channel?: RecoveryChannel
  otpSent?: boolean
  otpSentAt?: number
  otpExpiresAt?: number
  otpVerified?: boolean
  failedAttempts: number
  resendCount: number
  resetCompleted?: boolean
}

const RECOVERY_KEY = "smm_password_recovery"

export const DEMO_RECOVERY = {
  account: DEMO_ACCOUNT,
  holder: "María Hernández López",
  phone: "•••• •• 4821",
  email: "m••••@correo.mx",
  otp: "731942",
}

export const OTP_EXPIRATION_MS = 5 * 60 * 1000
export const OTP_RESEND_COOLDOWN_SECONDS = 60
export const MAX_OTP_ATTEMPTS = 5
export const MAX_RESENDS = 3

export function getRecoveryState(): PasswordRecoveryState | null {
  try {
    const raw = sessionStorage.getItem(RECOVERY_KEY)
    return raw ? (JSON.parse(raw) as PasswordRecoveryState) : null
  } catch {
    return null
  }
}

export function saveRecoveryState(state: PasswordRecoveryState) {
  sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(state))
}

export function patchRecoveryState(patch: Partial<PasswordRecoveryState>) {
  const current = getRecoveryState() ?? {
    account: "",
    accountValidated: false,
    failedAttempts: 0,
    resendCount: 0,
  }
  const next = { ...current, ...patch }
  saveRecoveryState(next)
  return next
}

export function startOtpDelivery(channel: RecoveryChannel) {
  const now = Date.now()
  return patchRecoveryState({
    channel,
    otpSent: true,
    otpSentAt: now,
    otpExpiresAt: now + OTP_EXPIRATION_MS,
    failedAttempts: 0,
  })
}

export function clearRecoveryState() {
  sessionStorage.removeItem(RECOVERY_KEY)
}

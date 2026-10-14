import { FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Mail,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react"
import {
  DEMO_RECOVERY,
  getRecoveryState,
  MAX_OTP_ATTEMPTS,
  MAX_RESENDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  patchRecoveryState,
  startOtpDelivery,
  type RecoveryChannel,
} from "../lib/passwordRecovery"

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function RecoveryVerify() {
  const navigate = useNavigate()
  const recovery = useMemo(() => getRecoveryState(), [])
  const [channel, setChannel] = useState<RecoveryChannel>(recovery?.channel ?? "sms")
  const [sent, setSent] = useState(Boolean(recovery?.otpSent))
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [secondsToResend, setSecondsToResend] = useState(0)
  const [secondsToExpire, setSecondsToExpire] = useState(0)
  const [attempts, setAttempts] = useState(recovery?.failedAttempts ?? 0)
  const [resends, setResends] = useState(recovery?.resendCount ?? 0)

  useEffect(() => {
    if (!recovery?.accountValidated) navigate("/recover", { replace: true })
  }, [recovery, navigate])

  useEffect(() => {
    if (!sent) return

    const refreshTimers = () => {
      const current = getRecoveryState()
      const now = Date.now()
      const sentAt = current?.otpSentAt ?? now
      const expiresAt = current?.otpExpiresAt ?? now
      const resendLeft = Math.max(
        0,
        OTP_RESEND_COOLDOWN_SECONDS - Math.floor((now - sentAt) / 1000),
      )
      const expireLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000))
      setSecondsToResend(resendLeft)
      setSecondsToExpire(expireLeft)
    }

    refreshTimers()
    const timer = window.setInterval(refreshTimers, 1000)
    return () => window.clearInterval(timer)
  }, [sent])

  if (!recovery?.accountValidated) return null

  const destination = channel === "sms" ? DEMO_RECOVERY.phone : DEMO_RECOVERY.email

  const sendCode = (isResend = false) => {
    setError("")
    if (isResend && resends >= MAX_RESENDS) {
      setError("Alcanzaste el límite de reenvíos. Regresa al inicio e inténtalo más tarde.")
      return
    }

    const nextResends = isResend ? resends + 1 : resends
    startOtpDelivery(channel)
    patchRecoveryState({ resendCount: nextResends })
    setResends(nextResends)
    setAttempts(0)
    setOtp("")
    setSent(true)
    setSecondsToResend(OTP_RESEND_COOLDOWN_SECONDS)
    setSecondsToExpire(5 * 60)
  }

  const verify = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (attempts >= MAX_OTP_ATTEMPTS) {
      setError("Se alcanzó el límite de intentos. Solicita un código nuevo para continuar.")
      return
    }

    if (secondsToExpire <= 0) {
      setError("El código venció. Solicita uno nuevo para continuar.")
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Ingresa los 6 dígitos del código de verificación.")
      return
    }

    if (otp !== DEMO_RECOVERY.otp) {
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      patchRecoveryState({ failedAttempts: nextAttempts })
      const remaining = MAX_OTP_ATTEMPTS - nextAttempts
      setError(
        remaining > 0
          ? `El código no coincide. Te quedan ${remaining} intento${remaining === 1 ? "" : "s"}.`
          : "Se alcanzó el límite de intentos. Solicita un código nuevo.",
      )
      return
    }

    patchRecoveryState({ otpVerified: true, failedAttempts: attempts })
    navigate("/recover/password")
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto no-scrollbar">
      <div className="px-4 py-4 bg-white border-b border-border sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate("/recover")}
          className="w-11 h-11 rounded-full hover:bg-slate-50 flex items-center justify-center text-foreground"
          aria-label="Volver"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="ml-2">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.14em]">
            Recuperación · Paso 2 de 3
          </p>
          <h1 className="font-bold text-lg text-foreground">Verifica tu identidad</h1>
        </div>
      </div>

      <div className="p-5 pb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 mb-5">
          <CheckCircle2 size={21} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-emerald-900">Cuenta localizada</p>
            <p className="text-xs text-emerald-800 mt-1">
              {DEMO_RECOVERY.account}
            </p>
          </div>
        </div>

        {!sent ? (
          <div className="bg-white border border-border rounded-[28px] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <UserRound size={21} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">¿Dónde quieres recibir el código?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sólo usamos contactos previamente registrados.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setChannel("sms")}
                className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left transition-all ${
                  channel === "sms"
                    ? "border-primary bg-blue-50 ring-2 ring-primary/10"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0">
                  <Smartphone size={21} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">Mensaje SMS</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{DEMO_RECOVERY.phone}</p>
                </div>
                <span className={`w-5 h-5 rounded-full border-2 ${channel === "sms" ? "border-primary bg-primary shadow-[inset_0_0_0_4px_white]" : "border-slate-300"}`} />
              </button>

              <button
                type="button"
                onClick={() => setChannel("email")}
                className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left transition-all ${
                  channel === "email"
                    ? "border-primary bg-blue-50 ring-2 ring-primary/10"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0">
                  <Mail size={21} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">Correo electrónico</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{DEMO_RECOVERY.email}</p>
                </div>
                <span className={`w-5 h-5 rounded-full border-2 ${channel === "email" ? "border-primary bg-primary shadow-[inset_0_0_0_4px_white]" : "border-slate-300"}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => sendCode(false)}
              className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-all"
            >
              Enviar código de verificación
            </button>
          </div>
        ) : (
          <form onSubmit={verify} className="bg-white border border-border rounded-[28px] p-5 shadow-sm">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary mx-auto mb-3 flex items-center justify-center">
                {channel === "sms" ? <Smartphone size={27} /> : <Mail size={27} />}
              </div>
              <h2 className="text-xl font-bold text-foreground">Ingresa el código</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Enviamos 6 dígitos a <strong className="text-foreground">{destination}</strong>.
              </p>
            </div>

            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="w-full h-16 px-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center text-2xl tracking-[0.35em] font-bold text-foreground"
              placeholder="000000"
            />

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock3 size={16} />
                {secondsToExpire > 0 ? `Vence en ${formatCountdown(secondsToExpire)}` : "Código vencido"}
              </div>
              <button
                type="button"
                disabled={secondsToResend > 0 || resends >= MAX_RESENDS}
                onClick={() => sendCode(true)}
                className="text-xs font-bold text-primary disabled:text-slate-400 flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                {secondsToResend > 0 ? `Reenviar en ${secondsToResend}s` : "Reenviar"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-all"
            >
              Verificar código
            </button>

            <button
              type="button"
              onClick={() => {
                setSent(false)
                setOtp("")
                setError("")
                patchRecoveryState({ otpSent: false, channel: undefined })
              }}
              className="w-full h-11 mt-2 text-sm font-semibold text-primary"
            >
              Usar otro medio de contacto
            </button>
          </form>
        )}

        <div className="mt-4 bg-slate-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={19} className="text-slate-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Nunca te pediremos este código por llamada o mensaje. Si no reconoces los contactos, solicita su actualización en administración.
          </p>
        </div>

        {sent && (
          <details className="mt-4 bg-white border border-dashed border-slate-300 rounded-2xl p-4">
            <summary className="text-xs font-bold text-slate-500 cursor-pointer">
              Código para probar el prototipo
            </summary>
            <div className="mt-2 text-xs text-slate-600 space-y-1">
              <p><strong>OTP:</strong> {DEMO_RECOVERY.otp}</p>
              <p><strong>Reenvíos usados:</strong> {resends}/{MAX_RESENDS}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

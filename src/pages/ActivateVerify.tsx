import { FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react"
import {
  DEMO_ACTIVATION,
  getActivationState,
  patchActivationState,
  type ActivationChannel,
} from "../lib/activation"

export default function ActivateVerify() {
  const navigate = useNavigate()
  const activation = useMemo(() => getActivationState(), [])
  const [channel, setChannel] = useState<ActivationChannel>("sms")
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [seconds, setSeconds] = useState(60)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!activation?.accountValidated) navigate("/activate", { replace: true })
  }, [activation, navigate])

  useEffect(() => {
    if (!sent || seconds <= 0) return
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [sent, seconds])

  if (!activation?.accountValidated) return null

  const sendCode = () => {
    setSent(true)
    setSeconds(60)
    setOtp("")
    setError("")
    patchActivationState({ channel, otpSent: true })
  }

  const verify = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (!/^\d{6}$/.test(otp)) {
      setError("Ingresa el código de 6 dígitos que enviamos a tu contacto.")
      return
    }

    if (otp !== DEMO_ACTIVATION.otp) {
      setError("El código no coincide. Revisa el mensaje recibido o solicita uno nuevo.")
      return
    }

    patchActivationState({ channel, otpSent: true, contactVerified: true })
    navigate("/password")
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto no-scrollbar">
      <div className="px-4 py-4 bg-white border-b border-border sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate("/activate")}
          className="w-11 h-11 rounded-full hover:bg-slate-50 flex items-center justify-center text-foreground"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="ml-2">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.14em]">Paso 2 de 3</p>
          <h1 className="font-bold text-lg text-foreground">Confirma que eres tú</h1>
        </div>
      </div>

      <div className="p-5 pb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 mb-5">
          <CheckCircle2 size={21} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-emerald-900">Cuenta validada</p>
            <p className="text-xs text-emerald-800/80 mt-0.5">El código de activación corresponde a esta cuenta.</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[26px] p-5 shadow-sm mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Cuenta encontrada</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><UserRound size={19} /></div>
              <div><p className="text-xs text-muted-foreground">Titular</p><p className="text-sm font-bold text-foreground">{DEMO_ACTIVATION.holder}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><MapPin size={19} /></div>
              <div><p className="text-xs text-muted-foreground">Domicilio</p><p className="text-sm font-bold text-foreground">{DEMO_ACTIVATION.address}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[26px] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Verifica tu contacto</h2>
          <p className="text-sm text-muted-foreground mb-5">Enviaremos un código temporal al medio registrado en administración.</p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => { setChannel("sms"); setSent(false); setOtp("") }}
              className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${channel === "sms" ? "border-primary bg-blue-50/60" : "border-slate-200 bg-white"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${channel === "sms" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                <Smartphone size={20} />
              </div>
              <div className="flex-1"><p className="text-sm font-bold">Mensaje SMS</p><p className="text-xs text-muted-foreground">{DEMO_ACTIVATION.phone}</p></div>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${channel === "sms" ? "border-primary" : "border-slate-300"}`}>
                {channel === "sms" && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setChannel("email"); setSent(false); setOtp("") }}
              className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${channel === "email" ? "border-primary bg-blue-50/60" : "border-slate-200 bg-white"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${channel === "email" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                <Mail size={20} />
              </div>
              <div className="flex-1"><p className="text-sm font-bold">Correo electrónico</p><p className="text-xs text-muted-foreground">{DEMO_ACTIVATION.email}</p></div>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${channel === "email" ? "border-primary" : "border-slate-300"}`}>
                {channel === "email" && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
            </button>
          </div>

          {!sent ? (
            <button
              onClick={sendCode}
              className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-all"
            >
              Enviar código de verificación
            </button>
          ) : (
            <form onSubmit={verify} className="mt-5 pt-5 border-t border-slate-100">
              <label className="block text-sm font-semibold text-foreground mb-2">Código de 6 dígitos</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full h-16 text-center text-2xl tracking-[0.4em] font-bold bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="000000"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground">{seconds > 0 ? `Puedes reenviar en ${seconds}s` : "Ya puedes solicitar otro código"}</p>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={seconds > 0}
                  className="text-xs font-bold text-primary disabled:text-slate-400 flex items-center gap-1"
                >
                  <RotateCcw size={13} /> Reenviar
                </button>
              </div>

              {error && <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>}

              <button type="submit" className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-all">
                Verificar código
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 bg-slate-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={19} className="text-slate-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">Si no reconoces los datos mostrados, no continúes y solicita una actualización de contacto en administración.</p>
        </div>

        {sent && (
          <details className="mt-4 bg-white border border-dashed border-slate-300 rounded-2xl p-4">
            <summary className="text-xs font-bold text-slate-500 cursor-pointer">Código para probar el prototipo</summary>
            <p className="mt-2 text-xs text-slate-600"><strong>OTP:</strong> {DEMO_ACTIVATION.otp}</p>
          </details>
        )}
      </div>
    </div>
  )
}

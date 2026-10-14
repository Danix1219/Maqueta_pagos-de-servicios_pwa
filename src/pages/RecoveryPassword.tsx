import { FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"
import { getDemoPassword, saveDemoPassword } from "../lib/auth"
import { getRecoveryState, patchRecoveryState } from "../lib/passwordRecovery"

export default function RecoveryPassword() {
  const navigate = useNavigate()
  const recovery = useMemo(() => getRecoveryState(), [])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!recovery?.otpVerified) navigate("/recover", { replace: true })
  }, [recovery, navigate])

  if (!recovery?.otpVerified) return null

  const checks = [
    { label: "8 caracteres o más", ok: password.length >= 8 },
    { label: "Una letra mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Una letra minúscula", ok: /[a-z]/.test(password) },
    { label: "Un número", ok: /\d/.test(password) },
    { label: "Un carácter especial", ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const strong = checks.every((item) => item.ok)
  const matches = Boolean(confirmPassword) && password === confirmPassword
  const reused = Boolean(password) && password === getDemoPassword()

  const strength = checks.filter((item) => item.ok).length
  const strengthLabel = strength <= 2 ? "Débil" : strength <= 4 ? "Media" : "Fuerte"

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (!strong) {
      setError("La nueva contraseña todavía no cumple todos los requisitos de seguridad.")
      return
    }
    if (reused) {
      setError("La nueva contraseña debe ser diferente a la contraseña anterior.")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      saveDemoPassword(password)
      localStorage.removeItem("smm_demo_session")
      patchRecoveryState({ resetCompleted: true })
      navigate("/recover/success")
    }, 850)
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto no-scrollbar">
      <div className="px-4 py-4 bg-white border-b border-border sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate("/recover/verify")}
          className="w-11 h-11 rounded-full hover:bg-slate-50 flex items-center justify-center text-foreground"
          aria-label="Volver"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="ml-2">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.14em]">
            Recuperación · Paso 3 de 3
          </p>
          <h1 className="font-bold text-lg text-foreground">Crea una nueva contraseña</h1>
        </div>
      </div>

      <div className="p-5 pb-8">
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary mx-auto mb-4 flex items-center justify-center">
            <LockKeyhole size={30} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Protege de nuevo tu cuenta</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            La nueva contraseña reemplazará inmediatamente la anterior.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white border border-border rounded-[28px] p-5 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">Nueva contraseña</label>
            <div className="relative">
              <KeyRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full h-14 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Crea una contraseña segura"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 mb-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold text-slate-600">Seguridad</span>
              <span className={`text-xs font-bold ${strength === 5 ? "text-emerald-700" : strength >= 3 ? "text-amber-700" : "text-rose-700"}`}>
                {strengthLabel}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <span
                  key={item}
                  className={`h-1.5 rounded-full ${item <= strength ? (strength === 5 ? "bg-emerald-500" : strength >= 3 ? "bg-amber-500" : "bg-rose-500") : "bg-slate-200"}`}
                />
              ))}
            </div>
            <div className="space-y-2">
              {checks.map((item) => (
                <div key={item.label} className={`flex items-center gap-2 text-xs ${item.ok ? "text-emerald-700" : "text-slate-500"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${item.ok ? "bg-emerald-100" : "bg-slate-200"}`}>
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item.label}
                </div>
              ))}
              <div className={`flex items-center gap-2 text-xs ${password && !reused ? "text-emerald-700" : "text-slate-500"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${password && !reused ? "bg-emerald-100" : "bg-slate-200"}`}>
                  <Check size={12} strokeWidth={3} />
                </span>
                Diferente a tu contraseña anterior
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-foreground mb-2">Confirmar contraseña</label>
            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showConfirmation ? "text" : "password"}
                autoComplete="new-password"
                className={`w-full h-14 px-4 pr-12 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 ${confirmPassword ? (matches ? "border-emerald-300" : "border-rose-300") : "border-slate-200"}`}
                placeholder="Repite la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmation((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
                aria-label={showConfirmation ? "Ocultar confirmación" : "Mostrar confirmación"}
              >
                {showConfirmation ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {confirmPassword && (
              <p className={`text-xs mt-1.5 ml-1 ${matches ? "text-emerald-700" : "text-rose-700"}`}>
                {matches ? "Las contraseñas coinciden." : "Las contraseñas todavía no coinciden."}
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Actualizando…
              </>
            ) : (
              "Guardar nueva contraseña"
            )}
          </button>
        </form>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={19} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            En una implementación real, el servidor invalidaría los tokens de recuperación y podría cerrar otras sesiones activas después del cambio.
          </p>
        </div>
      </div>
    </div>
  )
}

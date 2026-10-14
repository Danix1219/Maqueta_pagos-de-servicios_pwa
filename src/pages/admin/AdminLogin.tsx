import { FormEvent, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, Eye, EyeOff, KeyRound, MonitorCog, ShieldCheck, UserRound } from "lucide-react"
import { DEMO_ADMIN, saveStaffSession } from "../../lib/staffAuth"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState(DEMO_ADMIN.id)
  const [password, setPassword] = useState(DEMO_ADMIN.password)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)

  const blocked = attempts >= 5
  const canSubmit = useMemo(
    () => userId.trim().length >= 4 && password.length >= 8 && !blocked && !loading,
    [userId, password, blocked, loading],
  )

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (blocked) {
      setError("Acceso temporalmente bloqueado. Solicita apoyo al responsable del sistema.")
      return
    }
    if (userId.trim().toUpperCase() !== DEMO_ADMIN.id || password !== DEMO_ADMIN.password) {
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      setError(nextAttempts >= 5 ? "Se alcanzó el límite de intentos permitidos. Solicita apoyo al responsable del sistema." : `Credenciales no válidas. Quedan ${5 - nextAttempts} intento${5 - nextAttempts === 1 ? "" : "s"}.`)
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      saveStaffSession({ role: "admin", id: DEMO_ADMIN.id, name: DEMO_ADMIN.name, startedAt: new Date().toISOString() })
      navigate("/admin/dashboard")
    }, 550)
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-sky-50 via-[#f7fafc] to-white">
      <header className="mx-auto flex w-full max-w-5xl items-center px-4 py-4 sm:px-6">
        <button type="button" onClick={() => navigate("/")} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="Volver a perfiles"><ArrowLeft size={20} /></button>
      </header>

      <main className="mx-auto flex w-full max-w-[480px] flex-col px-5 pb-10 pt-3 sm:pt-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-sky-900/15"><MonitorCog size={31} aria-hidden="true" /></div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Agua Santa María</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Acceso administrativo</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Ingresa para gestionar cuentas, recorridos de campo, incidencias y reportes.</p>
        </div>

        <form onSubmit={submit} noValidate className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/[0.06] sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-primary"><ShieldCheck size={21} aria-hidden="true" /></div>
            <div><p className="text-sm font-bold text-slate-900">Sesión protegida</p><p className="text-xs text-slate-500">Acceso exclusivo para personal autorizado</p></div>
          </div>

          <div>
            <label htmlFor="admin-user-id" className="mb-2 block text-sm font-bold text-slate-700">Usuario administrativo</label>
            <div className="relative"><UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" /><input id="admin-user-id" value={userId} onChange={(event) => setUserId(event.target.value.toUpperCase().replace(/\s/g, ""))} autoCapitalize="characters" autoComplete="username" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="Ej. ADM-001" aria-invalid={!!error} aria-describedby={error ? "admin-login-error" : undefined} required /></div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="admin-password" className="text-sm font-bold text-slate-700">Contraseña</label><button type="button" onClick={() => setError("Solicita el restablecimiento de acceso al responsable del sistema.")} className="text-xs font-bold text-primary hover:underline">¿Problemas de acceso?</button></div>
            <div className="relative"><KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" /><input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 font-semibold text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="Tu contraseña" aria-invalid={!!error} aria-describedby={error ? "admin-login-error" : undefined} required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
          </div>

          {error && <div id="admin-login-error" role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold leading-5 text-rose-700">{error}</div>}

          <button type="submit" disabled={!canSubmit} className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 font-bold text-white shadow-lg shadow-sky-900/10 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Validando credenciales…" : "Ingresar"}</button>
        </form>

        <details className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-bold text-slate-700">Credenciales de prueba</summary>
          <p className="mt-2">ADM-001 · Admin2026!</p>
        </details>
        <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">La sesión administrativa es independiente de Caja y Campo.</p>
      </main>
    </div>
  )
}

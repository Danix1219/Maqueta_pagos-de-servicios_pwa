import { FormEvent, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, BadgeDollarSign, Eye, EyeOff, IdCard, KeyRound, ShieldCheck } from "lucide-react"
import { DEMO_CASHIER, saveStaffSession } from "../../lib/staffAuth"

export default function CashierLogin() {
  const navigate = useNavigate()
  const [operatorId, setOperatorId] = useState(DEMO_CASHIER.id)
  const [pin, setPin] = useState(DEMO_CASHIER.pin)
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = useMemo(
    () => operatorId.trim().length >= 4 && pin.length === 4 && !loading,
    [operatorId, pin, loading],
  )

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (operatorId.trim().toUpperCase() !== DEMO_CASHIER.id || pin !== DEMO_CASHIER.pin) {
      setError("El ID de cajero o el PIN no son correctos. Revisa los datos e inténtalo nuevamente.")
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      saveStaffSession({
        role: "cashier",
        id: DEMO_CASHIER.id,
        name: DEMO_CASHIER.name,
        workstation: DEMO_CASHIER.workstation,
        startedAt: new Date().toISOString(),
      })
      navigate("/cashier/pos")
    }, 500)
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-emerald-50 via-[#f7faf9] to-white">
      <header className="mx-auto flex w-full max-w-5xl items-center px-4 py-4 sm:px-6">
        <button type="button" onClick={() => navigate("/")} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="Volver a perfiles"><ArrowLeft size={20} /></button>
      </header>

      <main className="mx-auto flex w-full max-w-[480px] flex-col px-5 pb-10 pt-3 sm:pt-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15"><BadgeDollarSign size={32} aria-hidden="true" /></div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Agua Santa María</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Acceso a Caja</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Identifícate para abrir tu turno y registrar cobros en la ventanilla asignada.</p>
        </div>

        <form onSubmit={submit} noValidate className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/[0.06] sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={21} aria-hidden="true" /></div>
            <div><p className="text-sm font-bold text-slate-900">{DEMO_CASHIER.workstation} · Oficina Centro</p><p className="text-xs text-slate-500">Cada operación quedará asociada a tu sesión</p></div>
          </div>

          <div>
            <label htmlFor="cashier-id" className="mb-2 block text-sm font-bold text-slate-700">ID de cajero</label>
            <div className="relative"><IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" /><input id="cashier-id" value={operatorId} onChange={(event) => setOperatorId(event.target.value.toUpperCase().replace(/\s/g, ""))} className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 font-semibold uppercase text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" placeholder="Ej. CAJ-007" autoCapitalize="characters" autoComplete="username" spellCheck={false} aria-invalid={!!error} aria-describedby={error ? "cashier-login-error" : undefined} required /></div>
          </div>

          <div className="mt-4">
            <label htmlFor="cashier-pin" className="mb-2 block text-sm font-bold text-slate-700">PIN de caja</label>
            <div className="relative"><KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" /><input id="cashier-pin" type={showPin ? "text" : "password"} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 font-semibold tracking-[0.3em] text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" placeholder="••••" autoComplete="current-password" aria-invalid={!!error} aria-describedby={error ? "cashier-login-error" : undefined} required /><button type="button" onClick={() => setShowPin((value) => !value)} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label={showPin ? "Ocultar PIN" : "Mostrar PIN"} aria-pressed={showPin}>{showPin ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
          </div>

          {error && <div id="cashier-login-error" role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold leading-5 text-rose-700">{error}</div>}

          <button type="submit" disabled={!canSubmit} className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 font-bold text-white shadow-lg shadow-emerald-900/10 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Abriendo turno…" : "Abrir turno de Caja"}</button>
        </form>

        <details className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-bold text-slate-700">Credenciales de prueba</summary>
          <p className="mt-2">CAJ-007 · PIN 4826</p>
        </details>
        <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">No compartas tu PIN. Cierra la sesión al terminar el turno.</p>
      </main>
    </div>
  )
}

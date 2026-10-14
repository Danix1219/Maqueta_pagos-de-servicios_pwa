import { FormEvent, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HardHat,
  IdCard,
  KeyRound,
  ShieldCheck,
  WifiOff,
} from "lucide-react"

export default function FieldLogin() {
  const navigate = useNavigate()
  const [employee, setEmployee] = useState("CAM-014")
  const [pin, setPin] = useState("2468")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(
    () => employee.trim().length >= 4 && pin.length === 4 && !loading,
    [employee, pin, loading],
  )

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (employee.trim().toUpperCase() !== "CAM-014" || pin !== "2468") {
      setError("El ID de empleado o el PIN no son correctos. Revisa los datos e inténtalo nuevamente.")
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      sessionStorage.setItem("asm_field_authenticated", "true")
      sessionStorage.setItem("asm_field_employee", employee.trim().toUpperCase())
      navigate("/field/route")
    }, 500)
  }

  return (
    <div className="flex min-h-full flex-col overflow-y-auto bg-gradient-to-b from-teal-50 via-background to-white no-scrollbar">
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition-transform active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={21} />
        </button>
        <div className="flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-3 py-2 text-xs font-semibold text-secondary shadow-sm">
          <ShieldCheck size={14} aria-hidden="true" />
          Acceso interno
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-7 pt-5">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-teal-900/15">
            <HardHat size={31} aria-hidden="true" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Agua Santa María</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground">Personal de campo</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Ingresa para consultar tu jornada y continuar con la ruta asignada.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <div>
            <label htmlFor="field-employee" className="mb-2 block text-sm font-bold text-slate-700">
              ID de empleado
            </label>
            <div className="relative">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" />
              <input
                id="field-employee"
                name="employee"
                value={employee}
                onChange={(event) => setEmployee(event.target.value.toUpperCase().replace(/\s/g, ""))}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 font-semibold uppercase text-foreground outline-none transition-[border-color,box-shadow,background-color] focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20"
                placeholder="Ej. CAM-014"
                autoCapitalize="characters"
                autoComplete="username"
                spellCheck={false}
                aria-invalid={!!error}
                aria-describedby={error ? "field-login-error" : undefined}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="field-pin" className="text-sm font-bold text-slate-700">PIN de acceso</label>
              <button
                type="button"
                onClick={() => setError("Solicita el restablecimiento de tu PIN al responsable de la ruta.")}
                className="text-xs font-semibold text-secondary"
              >
                ¿Olvidaste tu PIN?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" />
              <input
                id="field-pin"
                name="pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 font-semibold tracking-[0.28em] text-foreground outline-none transition-[border-color,box-shadow,background-color] focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20"
                placeholder="••••"
                autoComplete="current-password"
                aria-invalid={!!error}
                aria-describedby={error ? "field-login-error" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPin((value) => !value)}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                aria-label={showPin ? "Ocultar PIN" : "Mostrar PIN"}
                aria-pressed={showPin}
              >
                {showPin ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <div id="field-login-error" role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white shadow-lg shadow-teal-900/15 transition-[transform,opacity] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Validando acceso…</>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white/80 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-secondary">
            <WifiOff size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Puedes continuar sin señal</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">Los registros pendientes se enviarán al recuperar conexión.</p>
          </div>
        </div>

        <details className="mt-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-bold text-foreground">Credenciales de demostración</summary>
          <p className="mt-2 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-secondary" aria-hidden="true" /> CAM-014 · PIN 2468</p>
        </details>

        <p className="mt-auto flex items-center justify-center gap-1.5 pt-5 text-center text-[11px] text-muted-foreground">
          <ShieldCheck size={13} aria-hidden="true" /> Cada registro queda asociado a tu jornada.
        </p>
      </div>
    </div>
  )
}

import { FormEvent, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  HelpCircle,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { DEMO_ACCOUNT, isValidServiceAccount, normalizeServiceAccount } from "../lib/auth"
import { saveRecoveryState } from "../lib/passwordRecovery"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [account, setAccount] = useState(DEMO_ACCOUNT)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")
    const normalized = normalizeServiceAccount(account)

    if (!isValidServiceAccount(normalized)) {
      setError("Ingresa una cuenta válida con formato SMM-000000.")
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (normalized !== DEMO_ACCOUNT) {
        setError(
          "No fue posible iniciar la recuperación. Verifica la cuenta o solicita apoyo en administración.",
        )
        return
      }

      saveRecoveryState({
        account: normalized,
        accountValidated: true,
        failedAttempts: 0,
        resendCount: 0,
      })
      navigate("/recover/verify")
    }, 700)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-sky-50 via-background to-white overflow-y-auto no-scrollbar">
      <div className="px-4 pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/login")}
          className="w-11 h-11 rounded-full bg-white border border-border flex items-center justify-center text-foreground shadow-sm active:scale-95 transition-transform"
          aria-label="Volver"
        >
          <ArrowLeft size={21} />
        </button>
        <button
          onClick={() => navigate("/help")}
          className="w-11 h-11 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-sm active:scale-95 transition-transform"
          aria-label="Ayuda"
        >
          <HelpCircle size={21} />
        </button>
      </div>

      <div className="px-5 pt-6 pb-8 flex-1 flex flex-col">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20">
            <LockKeyhole size={31} />
          </div>
          <p className="text-xs font-bold tracking-[0.16em] text-secondary uppercase mb-2">
            Recuperación · Paso 1 de 3
          </p>
          <h1 className="text-[27px] leading-tight font-bold text-foreground tracking-tight mb-2">
            Recupera tu acceso
          </h1>
          <p className="text-sm text-muted-foreground max-w-[315px] mx-auto leading-relaxed">
            Primero confirma la cuenta de servicio asociada a tu acceso como habitante.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-xl shadow-slate-900/[0.06]"
        >
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <KeyRound size={21} />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Validación de cuenta</p>
              <p className="text-xs text-muted-foreground">No modificaremos nada todavía</p>
            </div>
          </div>

          <label className="block text-sm font-semibold text-foreground mb-2">
            Cuenta de servicio
          </label>
          <div className="relative">
            <UserRound
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={account}
              onChange={(event) => setAccount(event.target.value.toUpperCase())}
              autoComplete="username"
              maxLength={10}
              className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              placeholder="SMM-001245"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">
            La encuentras en tu recibo o contrato del servicio de agua.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Validando cuenta…
              </>
            ) : (
              "Continuar"
            )}
          </button>
        </form>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Después de validar la cuenta sólo mostraremos contactos parcialmente ocultos registrados previamente.
          </p>
        </div>

        <details className="mt-4 bg-white border border-dashed border-slate-300 rounded-2xl p-4">
          <summary className="text-xs font-bold text-slate-500 cursor-pointer">
            Datos para probar el prototipo
          </summary>
          <p className="mt-2 text-xs text-slate-600">
            <strong>Cuenta:</strong> {DEMO_ACCOUNT}
          </p>
        </details>
      </div>
    </div>
  )
}

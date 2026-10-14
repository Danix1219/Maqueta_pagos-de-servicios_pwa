import { FormEvent, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  BadgeCheck,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { DEMO_ACTIVATION, saveActivationState } from "../lib/activation"

export default function Activate() {
  const navigate = useNavigate()
  const [account, setAccount] = useState(DEMO_ACTIVATION.account)
  const [activationCode, setActivationCode] = useState(DEMO_ACTIVATION.activationCode)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    const normalizedAccount = account.trim().toUpperCase()
    const normalizedCode = activationCode.trim().toUpperCase()

    if (!/^SMM-\d{6}$/.test(normalizedAccount)) {
      setError("Ingresa una cuenta válida con formato SMM-000000.")
      return
    }

    if (!/^[A-Z]{3}-\d{4}$/.test(normalizedCode)) {
      setError("El código debe tener el formato indicado en tu carta de activación.")
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      if (
        normalizedAccount !== DEMO_ACTIVATION.account ||
        normalizedCode !== DEMO_ACTIVATION.activationCode
      ) {
        setLoading(false)
        setError("No pudimos validar la cuenta y el código. Revisa los datos e inténtalo de nuevo.")
        return
      }

      saveActivationState({
        account: normalizedAccount,
        activationCode: normalizedCode,
        accountValidated: true,
      })
      navigate("/activate/verify")
    }, 700)
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto no-scrollbar">
      <div className="bg-primary text-white px-4 pt-4 pb-7 rounded-b-[28px] shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate("/login")}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Volver"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            onClick={() => navigate("/help")}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Ayuda"
          >
            <HelpCircle size={21} />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
            <BadgeCheck size={27} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-[0.16em] mb-1">
              Activación · Paso 1 de 3
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Vincula tu cuenta</h1>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">
              Validaremos tu cuenta antes de mostrar datos del titular.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 -mt-2 flex-1">
        <div className="bg-white border border-border rounded-[28px] p-5 shadow-lg shadow-slate-900/[0.05]">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-foreground">Datos de activación</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Usa la cuenta de servicio y el código de un solo uso entregado por administración.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Cuenta de servicio
              </label>
              <div className="relative">
                <UserRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={account}
                  onChange={(e) => setAccount(e.target.value.toUpperCase())}
                  maxLength={10}
                  autoComplete="username"
                  className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="SMM-001245"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Código de activación
              </label>
              <div className="relative">
                <KeyRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold tracking-wide"
                  placeholder="ASM-8264"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">
                Este código se entrega al registrar o actualizar la cuenta.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Validando…
                </>
              ) : (
                "Validar cuenta"
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
          <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Por seguridad, no mostraremos nombre, domicilio ni contacto hasta comprobar que el código pertenece a la cuenta.
          </p>
        </div>

        <details className="mt-4 bg-white border border-dashed border-slate-300 rounded-2xl p-4">
          <summary className="text-xs font-bold text-slate-500 cursor-pointer">Datos para probar el prototipo</summary>
          <div className="mt-3 text-xs text-slate-600 space-y-1">
            <p><strong>Cuenta:</strong> {DEMO_ACTIVATION.account}</p>
            <p><strong>Código:</strong> {DEMO_ACTIVATION.activationCode}</p>
          </div>
        </details>
      </div>
    </div>
  )
}

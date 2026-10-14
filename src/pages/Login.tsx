import { FormEvent, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { DEMO_ACCOUNT, getDemoPassword, isValidServiceAccount, normalizeServiceAccount } from "../lib/auth"

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [account, setAccount] = useState(DEMO_ACCOUNT)
  const [password, setPassword] = useState(searchParams.get("recovered") === "1" ? "" : getDemoPassword())
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    const normalized = normalizeServiceAccount(account)
    if (!isValidServiceAccount(normalized)) {
      setError("Revisa tu número de cuenta. Usa el formato SMM-000000.")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe contener al menos 8 caracteres.")
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      if (normalized !== DEMO_ACCOUNT || password !== getDemoPassword()) {
        setLoading(false)
        setError("Cuenta o contraseña incorrectas. Revisa tus datos e inténtalo de nuevo.")
        return
      }
      if (remember) localStorage.setItem("smm_demo_session", "remember")
      navigate("/home")
    }, 650)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-sky-50 via-background to-white overflow-y-auto no-scrollbar">
      <div className="px-4 pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
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

      <div className="px-5 pt-5 pb-8 flex-1 flex flex-col">
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20">
            <Droplets size={32} />
          </div>
          <p className="text-xs font-bold tracking-[0.18em] text-secondary uppercase mb-2">
            Agua Santa María
          </p>
          <h1 className="text-[28px] leading-tight font-bold text-foreground tracking-tight mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-muted-foreground max-w-[310px] mx-auto leading-relaxed">
            Ingresa para consultar tu consumo, recibos y opciones de pago.
          </p>
        </div>

        {searchParams.get("recovered") === "1" && (
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-start gap-3">
            <CheckCircle2 size={19} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Contraseña actualizada</p>
              <p className="text-xs text-emerald-800 mt-0.5">Inicia sesión con tu nueva contraseña.</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-xl shadow-slate-900/[0.06]"
        >
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <ShieldCheck size={21} />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Acceso del habitante</p>
              <p className="text-xs text-muted-foreground">Tus datos viajan de forma segura</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
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
                  onChange={(e) => setAccount(e.target.value.toUpperCase())}
                  autoComplete="username"
                  inputMode="text"
                  maxLength={10}
                  className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                  placeholder="SMM-001245"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">
                La encuentras en tu recibo o contrato de servicio.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">Contraseña</label>
                <button
                  type="button"
                  onClick={() => navigate("/recover")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ¿La olvidaste?
                </button>
              </div>
              <div className="relative">
                <KeyRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full h-14 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                  placeholder="Tu contraseña"
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

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-primary"
              />
              <span className="text-sm text-slate-600">Mantener mi sesión en este dispositivo</span>
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
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
                Validando acceso…
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <div className="mt-4 bg-white/80 border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-secondary flex items-center justify-center shrink-0">
            <CheckCircle2 size={21} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">¿Es tu primera vez?</p>
            <p className="text-xs text-muted-foreground">Activa tu cuenta con el código de administración.</p>
          </div>
          <button
            onClick={() => navigate("/activate")}
            className="text-sm font-bold text-primary shrink-0"
          >
            Activar
          </button>
        </div>

        <div className="mt-auto pt-5 text-center">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} /> No compartas tu contraseña ni códigos de verificación.
          </p>
        </div>
      </div>
    </div>
  )
}

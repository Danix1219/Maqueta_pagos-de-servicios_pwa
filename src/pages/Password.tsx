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
import {
  getActivationState,
  markDemoAccountActivated,
} from "../lib/activation"
import { saveDemoPassword } from "../lib/auth"

export default function Password() {
  const navigate = useNavigate()
  const activation = useMemo(() => getActivationState(), [])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!activation?.contactVerified) navigate("/activate", { replace: true })
  }, [activation, navigate])

  if (!activation?.contactVerified) return null

  const checks = [
    { label: "8 caracteres o más", ok: password.length >= 8 },
    { label: "Una letra mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Una letra minúscula", ok: /[a-z]/.test(password) },
    { label: "Un número", ok: /\d/.test(password) },
    { label: "Un carácter especial", ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const strong = checks.every((item) => item.ok)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (!strong) {
      setError("Tu contraseña todavía no cumple todos los requisitos de seguridad.")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (!accepted) {
      setError("Debes aceptar el aviso de privacidad y las condiciones de uso.")
      return
    }

    saveDemoPassword(password)
    markDemoAccountActivated()
    navigate("/activate/success")
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto no-scrollbar">
      <div className="px-4 py-4 bg-white border-b border-border sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate("/activate/verify")}
          className="w-11 h-11 rounded-full hover:bg-slate-50 flex items-center justify-center text-foreground"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="ml-2">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.14em]">Paso 3 de 3</p>
          <h1 className="font-bold text-lg text-foreground">Protege tu cuenta</h1>
        </div>
      </div>

      <div className="p-5 pb-8">
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary mx-auto mb-4 flex items-center justify-center">
            <LockKeyhole size={30} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Crea tu contraseña</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Será la contraseña que usarás junto con tu cuenta de servicio para ingresar.</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-border rounded-[28px] p-5 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">Nueva contraseña</label>
            <div className="relative">
              <KeyRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full h-14 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Crea una contraseña segura"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-5 rounded-2xl bg-slate-50 p-4">
            {checks.map((item) => (
              <div key={item.label} className={`flex items-center gap-2 text-xs ${item.ok ? "text-emerald-700" : "text-slate-500"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${item.ok ? "bg-emerald-100" : "bg-slate-200"}`}>
                  <Check size={12} strokeWidth={3} />
                </span>
                {item.label}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">Confirmar contraseña</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Repite tu contraseña"
            />
          </div>

          <label className="flex items-start gap-3 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-primary"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Acepto el aviso de privacidad y las condiciones de uso del portal.
            </span>
          </label>

          {error && <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <button type="submit" className="w-full h-14 mt-5 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 active:scale-[0.98] transition-all">
            Activar mi cuenta
          </button>
        </form>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={19} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">En producción, la contraseña se enviaría cifrada y nunca se almacenaría en texto legible.</p>
        </div>
      </div>
    </div>
  )
}

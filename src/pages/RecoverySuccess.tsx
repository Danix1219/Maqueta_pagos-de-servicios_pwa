import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router"
import { CheckCircle2, LogIn, ShieldCheck } from "lucide-react"
import {
  clearRecoveryState,
  DEMO_RECOVERY,
  getRecoveryState,
} from "../lib/passwordRecovery"

export default function RecoverySuccess() {
  const navigate = useNavigate()
  const recovery = useMemo(() => getRecoveryState(), [])

  useEffect(() => {
    if (!recovery?.resetCompleted) navigate("/recover", { replace: true })
  }, [recovery, navigate])

  if (!recovery?.resetCompleted) return null

  const goToLogin = () => {
    clearRecoveryState()
    navigate("/login?recovered=1")
  }

  const changedAt = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date())

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-emerald-50 via-background to-white px-6 py-8 overflow-y-auto no-scrollbar">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 border-8 border-emerald-50 flex items-center justify-center text-emerald-600 mb-7 shadow-sm">
          <CheckCircle2 size={50} />
        </div>
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-emerald-700 mb-2">
          Recuperación completada
        </p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">
          Contraseña actualizada
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-7">
          Ya puedes ingresar nuevamente al portal con tu nueva contraseña.
        </p>

        <div className="w-full bg-white border border-border rounded-[26px] p-5 text-left shadow-sm mb-4">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-3">
            Cambio realizado
          </p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-foreground">{DEMO_RECOVERY.account}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{changedAt}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={21} />
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6">
          <p className="text-sm font-bold text-foreground mb-1">¿No realizaste este cambio?</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Solicita apoyo inmediatamente en administración para revisar la seguridad de tu cuenta y tus datos de contacto.
          </p>
        </div>

        <button
          onClick={goToLogin}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <LogIn size={19} /> Ir a iniciar sesión
        </button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-6">
        Nunca compartas tu contraseña ni códigos de verificación.
      </p>
    </div>
  )
}

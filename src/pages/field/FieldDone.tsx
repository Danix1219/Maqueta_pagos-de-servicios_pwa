import { useNavigate } from "react-router"
import { ArrowRight, CheckCircle2, Home, RefreshCw } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState, getRouteStats, setActiveHome } from "../../lib/fieldState"

export default function FieldDone() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const stats = getRouteStats(state)
  const next = state.homes.find((item) => item.status === "pending")

  const continueRoute = () => {
    if (next) setActiveHome(next.id)
    navigate(next ? "/field/meter" : "/field/summary")
  }

  return (
    <div className="min-h-full bg-background">
      <FieldHeader title="Visita completada" subtitle={home.id} online={state.online} />
      <main className="flex min-h-[720px] flex-col items-center justify-center p-6 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] bg-emerald-100 text-emerald-600"><CheckCircle2 size={40} /></div>
        <h2 className="text-2xl font-bold text-foreground">Registro guardado</h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">La visita de {home.address} quedó registrada como <strong>{home.outcomeLabel ?? "completada"}</strong>.</p>

        <div className="mt-6 w-full rounded-3xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><div className="text-left"><p className="text-xs text-slate-500">Avance de ruta</p><p className="mt-1 text-2xl font-bold">{stats.resolved}/{state.homes.length}</p></div><p className="text-3xl font-bold text-secondary">{stats.progress}%</p></div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-secondary" style={{ width: `${stats.progress}%` }} /></div>
          {!state.online && <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-left text-xs font-medium text-amber-800"><RefreshCw size={16} />Se sincronizará cuando vuelva la conexión.</div>}
        </div>

        <button onClick={continueRoute} className="mt-6 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white">{next ? <>Ir a siguiente domicilio <ArrowRight size={20} /></> : <>Ver resumen de jornada <ArrowRight size={20} /></>}</button>
        <button onClick={() => navigate("/field/homes")} className="mt-3 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white font-bold text-slate-700"><Home size={19} /> Ver domicilios</button>
      </main>
    </div>
  )
}

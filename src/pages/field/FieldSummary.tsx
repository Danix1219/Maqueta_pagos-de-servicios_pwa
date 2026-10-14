import { useState } from "react"
import { useNavigate } from "react-router"
import { AlertTriangle, CheckCircle2, Clock3, LogOut, RefreshCw, Route } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { formatFieldTime, getFieldState, getRouteStats, updateFieldState } from "../../lib/fieldState"

export default function FieldSummary() {
  const navigate = useNavigate()
  const [state, setState] = useState(() => getFieldState())
  const stats = getRouteStats(state)
  const pendingSync = state.syncQueue.filter((item) => item.status === "pending").length
  const canClose = stats.pending === 0 && pendingSync === 0

  const logout = () => {
    sessionStorage.removeItem("asm_field_authenticated")
    sessionStorage.removeItem("asm_field_employee")
    navigate("/field/login")
  }

  const closeShift = () => {
    if (!canClose) return
    const next = updateFieldState((current) => ({ ...current, route: { ...current.route, closedAt: new Date().toISOString() } }))
    setState(next)
  }

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Resumen de jornada" subtitle={state.route.name} back={() => navigate("/field/route")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-sm text-white/65">Ruta {state.route.id}</p><h2 className="mt-1 text-2xl font-bold">{state.route.closedAt ? "Jornada cerrada" : "Balance del día"}</h2></div><Route size={31} className="text-teal-300" /></div>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-white/60">Inicio</p><p className="mt-1 font-bold">{formatFieldTime(state.route.startedAt)}</p></div><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-white/60">Cierre</p><p className="mt-1 font-bold">{formatFieldTime(state.route.closedAt)}</p></div></div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Atendidas</p><p className="mt-1 text-2xl font-bold text-foreground">{stats.resolved}</p></div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Pendientes de visita</p><p className={`mt-1 text-2xl font-bold ${stats.pending ? "text-amber-700" : "text-emerald-600"}`}>{stats.pending}</p></div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Incidencias</p><p className="mt-1 text-2xl font-bold text-amber-700">{stats.incidents}</p></div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">En revisión</p><p className="mt-1 text-2xl font-bold text-violet-700">{stats.reviews}</p></div>
        </section>

        <section className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <h3 className="font-bold text-foreground">Validaciones para cerrar</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stats.pending === 0 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"}`}>{stats.pending === 0 ? <CheckCircle2 size={19} /> : <Clock3 size={19} />}</div><div><p className="text-sm font-bold">Domicilios procesados</p><p className="text-xs text-muted-foreground">{stats.pending === 0 ? "No quedan visitas pendientes" : `${stats.pending} visitas siguen pendientes`}</p></div></div>
            <div className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${pendingSync === 0 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{pendingSync === 0 ? <CheckCircle2 size={19} /> : <RefreshCw size={19} />}</div><div><p className="text-sm font-bold">Datos sincronizados</p><p className="text-xs text-muted-foreground">{pendingSync === 0 ? "Servidor al día" : `${pendingSync} registros aún no se han enviado`}</p></div></div>
          </div>
        </section>

        {!canClose && !state.route.closedAt && <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-800"><AlertTriangle size={20} className="mt-0.5 shrink-0" /><p>Para evitar inconsistencias, completa o clasifica las visitas pendientes y sincroniza los registros antes de cerrar la jornada.</p></div>}

        {state.route.closedAt ? (
          <button onClick={logout} className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 font-bold text-white"><LogOut size={20} /> Salir del módulo de campo</button>
        ) : (
          <button disabled={!canClose} onClick={closeShift} className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white disabled:opacity-40"><CheckCircle2 size={20} /> Cerrar jornada</button>
        )}
      </main>
    </div>
  )
}

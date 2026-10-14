import { useMemo, useState } from "react"
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  MapPin,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react"
import { getFieldState, updateHome } from "../../lib/fieldState"

export default function AdminIncidents() {
  const [version, setVersion] = useState(0)
  const [filter, setFilter] = useState<"all" | "incident" | "review" | "absent">("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState("")
  const state = getFieldState()
  const items = useMemo(() => state.homes.filter((home) => ["incident", "review", "absent"].includes(home.status) && (filter === "all" || home.status === filter)), [state.homes, filter, version])
  const selected = state.homes.find((home) => home.id === selectedId)

  function resolveReview() {
    if (!selected) return
    const consumption = selected.consumption ?? Math.max(0, (selected.currentReading ?? selected.previousReading) - selected.previousReading)
    updateHome(selected.id, { status: "completed", amount: consumption * 10, outcomeLabel: "Lectura validada por administración" })
    setNotice("Lectura validada. El recibo puede continuar a emisión.")
    setVersion((value) => value + 1)
    setSelectedId(null)
  }

  function scheduleRevisit() {
    if (!selected) return
    updateHome(selected.id, { status: "pending", outcomeLabel: "Revisita programada por administración" })
    setNotice("Revisita programada y devuelta a la cola de campo.")
    setVersion((value) => value + 1)
    setSelectedId(null)
  }

  function closeIncident() {
    if (!selected) return
    updateHome(selected.id, { status: "completed", outcomeLabel: "Incidencia cerrada administrativamente" })
    setNotice("Incidencia cerrada con trazabilidad administrativa.")
    setVersion((value) => value + 1)
    setSelectedId(null)
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <p className="text-sm font-bold text-primary mb-1">Control y seguimiento</p>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Incidencias de campo</h2>
        <p className="text-muted-foreground mt-1">Resuelve excepciones antes de generar adeudos o cerrar visitas.</p>
      </div>

      {notice && <div role="status" aria-live="polite" className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2"><CheckCircle2 size={17} /> {notice}</div>}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><AlertTriangle size={19} /></div><div><p className="text-2xl font-extrabold">{state.homes.filter((h) => h.status === "incident").length}</p><p className="text-xs text-muted-foreground">Incidencias</p></div></div></div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><ClipboardCheck size={19} /></div><div><p className="text-2xl font-extrabold">{state.homes.filter((h) => h.status === "review").length}</p><p className="text-xs text-muted-foreground">Lecturas en revisión</p></div></div></div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><CalendarClock size={19} /></div><div><p className="text-2xl font-extrabold">{state.homes.filter((h) => h.status === "absent").length}</p><p className="text-xs text-muted-foreground">Revisitas por ausencia</p></div></div></div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap gap-2 bg-slate-50/60">
          {(["all", "incident", "review", "absent"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${filter === item ? "bg-primary text-white border-primary" : "bg-white border-border text-slate-600"}`}>{item === "all" ? "Todas" : item === "incident" ? "Incidencias" : item === "review" ? "Lecturas atípicas" : "Ausencias"}</button>)}
        </div>
        <div className="divide-y divide-border">
          {items.map((home) => (
            <div key={home.id} className="p-5 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-slate-50/60">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${home.status === "incident" ? "bg-rose-50 text-rose-600" : home.status === "review" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-700"}`}>{home.status === "review" ? <ClipboardCheck size={21} /> : home.status === "absent" ? <CalendarClock size={21} /> : <AlertTriangle size={21} />}</div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><p className="font-extrabold">{home.owner}</p><span className="text-xs font-bold text-primary">{home.account}</span></div><p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={13} /> {home.address}</p><p className="text-xs text-slate-500 mt-1">{home.outcomeLabel ?? "Seguimiento requerido"}{home.incidentRef ? ` · ${home.incidentRef}` : ""}</p></div>
              <div className="lg:text-right"><p className="text-sm font-bold">{home.meter}</p><p className="text-xs text-muted-foreground">Lectura {home.currentReading ?? "sin confirmar"}</p></div>
              <button onClick={() => { setSelectedId(home.id); setNotice("") }} className="px-4 py-2.5 rounded-xl border border-border bg-white font-bold text-primary flex items-center justify-center gap-2"><Eye size={16} /> Revisar</button>
            </div>
          ))}
          {!items.length && <div className="py-16 text-center"><CheckCircle2 size={34} className="mx-auto text-emerald-500 mb-3" /><p className="font-bold">No hay casos pendientes en este filtro.</p></div>}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[130] bg-slate-950/55 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="incident-review-title" className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between"><div><p className="text-xs font-bold text-primary">{selected.incidentRef ?? selected.id}</p><h3 id="incident-review-title" className="text-xl font-extrabold">Revisión administrativa</h3></div><button onClick={() => setSelectedId(null)} className="p-2 rounded-xl hover:bg-slate-100" aria-label="Cerrar revisión"><X size={20} /></button></div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4"><div className="bg-slate-50 rounded-2xl p-4"><p className="text-xs text-muted-foreground">Titular</p><p className="font-extrabold mt-1">{selected.owner}</p><p className="text-sm text-slate-600 mt-1">{selected.account}</p></div><div className="bg-slate-50 rounded-2xl p-4"><p className="text-xs text-muted-foreground">Toma / medidor</p><p className="font-extrabold mt-1">{selected.id}</p><p className="text-sm text-slate-600 mt-1">{selected.meter}</p></div></div>
              <div className="border border-border rounded-2xl p-5"><h4 className="font-extrabold mb-4">Evidencia operativa</h4><div className="grid sm:grid-cols-3 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Lectura anterior</p><p className="font-bold text-lg">{selected.previousReading} m³</p></div><div><p className="text-xs text-muted-foreground">Lectura capturada</p><p className="font-bold text-lg">{selected.currentReading ?? "—"} {selected.currentReading ? "m³" : ""}</p></div><div><p className="text-xs text-muted-foreground">Consumo</p><p className="font-bold text-lg">{selected.consumption ?? "—"} {selected.consumption ? "m³" : ""}</p></div></div><div className="mt-4 bg-slate-50 rounded-xl p-3 text-sm text-slate-700">{selected.outcomeLabel ?? "Sin observaciones adicionales."}</div></div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">Mientras el caso permanezca <strong>en revisión</strong>, no se genera adeudo para el Habitante.</div>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                {selected.status === "review" && <button onClick={resolveReview} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"><CheckCircle2 size={17} /> Validar lectura</button>}
                <button onClick={scheduleRevisit} className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"><RefreshCw size={17} /> Programar revisita</button>
                {selected.status === "incident" && <button onClick={closeIncident} className="border border-border px-4 py-2.5 rounded-xl font-bold">Cerrar incidencia</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

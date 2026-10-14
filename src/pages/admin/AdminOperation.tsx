import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Navigation,
  Plus,
  Radio,
  Route,
  UserRound,
  Wifi,
  WifiOff,
  X,
} from "lucide-react"
import RouteMap from "../../components/route/RouteMap"
import { addRouteAssignment, getAdminState } from "../../lib/adminState"
import {
  assignFieldRoute,
  type FieldHome,
  getFieldState,
  getRouteStats,
} from "../../lib/fieldState"

const fieldStaff = [
  { id: "CAM-014", name: "Luis Martínez" },
  { id: "CAM-021", name: "Daniela Ruiz" },
  { id: "CAM-018", name: "Roberto Peña" },
]

function signalLabel(iso?: string) {
  if (!iso) return "Sin señal reciente"
  return `Última señal ${new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(iso))}`
}

export function AdminOperationView({ mode }: { mode: "planning" | "tracking" }) {
  const navigate = useNavigate()
  const [routePeriod, setRoutePeriod] = useState("Septiembre 2026")
  const [showAssign, setShowAssign] = useState(false)
  const [message, setMessage] = useState("")
  const [notice, setNotice] = useState("")
  const [field, setField] = useState(() => getFieldState())
  const [selectedHomeId, setSelectedHomeId] = useState("")
  const [selectedStops, setSelectedStops] = useState<string[]>(() => getFieldState().homes.map((home) => home.id))
  const [form, setForm] = useState({
    period: "Septiembre 2026",
    sector: "Sur",
    employeeId: "CAM-014",
    employeeName: "Luis Martínez",
    homes: 6,
  })

  const admin = getAdminState()
  const stats = useMemo(() => getRouteStats(field), [field])
  const pendingSync = field.syncQueue.filter((item) => item.status === "pending").length
  const routesForPeriod = admin.routes.filter((route) => route.period === routePeriod)
  const orderedHomes = useMemo(() => [...field.homes].sort((a, b) => a.location.sequence - b.location.sequence), [field.homes])
  const nextHome = orderedHomes.find((home) => home.status === "pending")
  const selectedHome = field.homes.find((home) => home.id === selectedHomeId) ?? nextHome ?? field.homes[0]
  const trackedHomeId = field.tracking.currentHomeId || nextHome?.id || field.activeHomeId

  useEffect(() => {
    const refresh = () => setField(getFieldState())
    const storageListener = (event: StorageEvent) => {
      if (!event.key || event.key === "asm_field_state_v2") refresh()
    }
    window.addEventListener("asm-field-state-change", refresh)
    window.addEventListener("storage", storageListener)
    const timer = window.setInterval(refresh, 4000)
    return () => {
      window.removeEventListener("asm-field-state-change", refresh)
      window.removeEventListener("storage", storageListener)
      window.clearInterval(timer)
    }
  }, [])

  const openAssignment = () => {
    const allStops = field.homes.map((home) => home.id)
    setMessage("")
    setNotice("")
    setSelectedStops(allStops)
    setForm((current) => ({ ...current, period: routePeriod, homes: allStops.length }))
    setShowAssign(true)
  }

  const toggleStop = (home: FieldHome) => {
    setSelectedStops((current) => {
      const next = current.includes(home.id) ? current.filter((id) => id !== home.id) : [...current, home.id]
      setForm((value) => ({ ...value, homes: next.length }))
      return next
    })
  }

  const assignRoute = () => {
    if (!selectedStops.length) {
      setMessage("Selecciona al menos una toma en el mapa para construir la ruta.")
      return
    }
    const result = addRouteAssignment({ ...form, homes: selectedStops.length })
    if (!result.ok) {
      setNotice("")
      setMessage(`${result.route.sector} ya tiene responsable para ${result.route.period}: ${result.route.employeeName}.`)
      return
    }
    assignFieldRoute({ ...result.route, homeIds: selectedStops })
    setField(getFieldState())
    setMessage("")
    setNotice(`${result.route.id} quedó asignada a ${result.route.employeeName} con ${selectedStops.length} paradas.`)
    setRoutePeriod(result.route.period)
    setShowAssign(false)
  }

  return (
    <div className="space-y-5 pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-sm font-bold text-primary">{mode === "planning" ? "Planeación operativa" : "Supervisión operativa"}</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{mode === "planning" ? "Operación de campo" : "Monitoreo en vivo"}</h2>
          <p className="mt-1 text-muted-foreground">{mode === "planning" ? "Construye recorridos, selecciona tomas y asigna responsables." : "Consulta ubicación, avance, próxima visita e incidencias del personal en ruta."}</p>
        </div>
        {mode === "planning" && <button type="button" onClick={openAssignment} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white shadow-sm"><Plus size={18} /> Asignar ruta</button>}
      </div>

      {mode === "planning" && notice && <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={18} /> {notice}</div>}

      {mode === "planning" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_380px]">
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="planning-map-title">
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Cobertura disponible</p><h3 id="planning-map-title" className="mt-1 font-extrabold">Mapa de tomas operativas</h3></div>
              <span className="self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{field.homes.length} puntos georreferenciados</span>
            </div>
            <RouteMap homes={field.homes} activeHomeId={trackedHomeId} selectedHomeId={selectedHome?.id} onSelectHome={(home) => setSelectedHomeId(home.id)} />
            {selectedHome && (
              <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0"><p className="text-xs font-bold text-muted-foreground">PARADA {selectedHome.location.sequence} · {selectedHome.id}</p><p className="mt-1 truncate font-bold">{selectedHome.address}</p><p className="mt-0.5 text-xs text-muted-foreground">{selectedHome.owner} · {selectedHome.location.distanceMeters} m desde el punto anterior</p></div>
                <span className="shrink-0 rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-secondary">{selectedHome.location.etaMinutes} min estimados</span>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="period-routes-title">
              <div className="border-b border-border p-4">
                <label htmlFor="admin-route-period" className="text-xs font-bold text-slate-500">Periodo de trabajo</label>
                <select id="admin-route-period" value={routePeriod} onChange={(event) => setRoutePeriod(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-bold"><option>Septiembre 2026</option><option>Octubre 2026</option></select>
              </div>
              <div className="flex items-center justify-between px-4 py-3"><h3 id="period-routes-title" className="font-extrabold">Rutas asignadas</h3><span className="text-xs font-bold text-primary">{routesForPeriod.length}</span></div>
              <div className="max-h-[390px] divide-y divide-border overflow-y-auto">
                {routesForPeriod.map((route) => (
                  <div key={route.id} className="p-4">
                    <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-secondary"><Route size={19} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{route.id}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${route.status === "in_progress" ? "bg-blue-50 text-blue-700" : route.status === "closed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{route.status === "in_progress" ? "En curso" : route.status === "closed" ? "Cerrada" : "Asignada"}</span></div><p className="mt-1 text-xs text-muted-foreground">Sector {route.sector} · {route.homes} tomas</p><p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700"><UserRound size={13} /> {route.employeeName}</p></div></div>
                  </div>
                ))}
                {!routesForPeriod.length && <div className="p-8 text-center text-sm text-muted-foreground">No hay rutas asignadas en este periodo.</div>}
              </div>
            </section>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900"><div className="flex gap-3"><CalendarDays size={19} className="mt-0.5 shrink-0 text-primary" /><div><p className="font-bold">Planeación visible para Campo</p><p className="mt-1 leading-5 text-sky-800">Las asignaciones del operador activo se reflejan en su dispositivo con el orden seleccionado.</p></div></div></div>
          </aside>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Atendidas", value: stats.resolved, meta: `${stats.progress}% de avance`, icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700" },
              { label: "Por visitar", value: stats.pending, meta: `${field.homes.length} paradas totales`, icon: Clock3, cls: "bg-amber-50 text-amber-700" },
              { label: "Requieren atención", value: stats.incidents + stats.reviews + stats.absent, meta: "Incidencias y revisión", icon: AlertTriangle, cls: "bg-rose-50 text-rose-700" },
              { label: "Por sincronizar", value: pendingSync, meta: field.online ? "Dispositivo conectado" : "Sin conexión", icon: field.online ? Wifi : WifiOff, cls: field.online ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700" },
            ].map(({ label, value, meta, icon: Icon, cls }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cls}`}><Icon size={20} /></div><div><p className="text-2xl font-extrabold">{value}</p><p className="text-xs font-bold text-slate-700">{label}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{meta}</p></div></div>)}
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px]">
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="live-map-title">
              <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700"><Radio size={13} /> Seguimiento compartido</p><h3 id="live-map-title" className="mt-1 font-extrabold">{field.route.id} · {field.route.name}</h3></div><span className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Actualización automática</span></div>
              <RouteMap homes={field.homes} activeHomeId={trackedHomeId} selectedHomeId={selectedHome?.id} onSelectHome={(home) => setSelectedHomeId(home.id)} />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Completada</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-700" /> Pendiente</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Incidencia</span><span className="ml-auto font-semibold">{signalLabel(field.tracking.lastUpdatedAt ?? field.lastSyncAt)}</span></div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 font-extrabold text-indigo-700">{field.employee.initials}</div><div><p className="font-extrabold">{field.employee.name}</p><p className="text-xs text-muted-foreground">{field.employee.id} · {field.route.id}</p></div></div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-600">Estado de jornada</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${field.tracking.enabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{field.tracking.enabled ? "En recorrido" : "Sin iniciar"}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-secondary" style={{ width: `${stats.progress}%` }} /></div></div>
              </section>

              {nextHome ? (
                <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary"><Navigation size={15} /> Próxima visita</div><p className="mt-3 font-extrabold text-slate-900">{nextHome.address}</p><p className="mt-1 text-sm text-slate-600">{nextHome.owner}</p><div className="mt-3 flex gap-2 text-xs font-bold text-teal-800"><span className="rounded-lg bg-white/80 px-2.5 py-1.5">Parada {nextHome.location.sequence}</span><span className="rounded-lg bg-white/80 px-2.5 py-1.5">{nextHome.location.etaMinutes} min</span></div>
                </section>
              ) : <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800"><CheckCircle2 size={20} /><p className="mt-2 font-bold">Recorrido atendido</p><p className="mt-1">No quedan visitas pendientes.</p></section>}

              <button type="button" onClick={() => navigate("/admin/incidents")} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm hover:border-rose-200"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><ClipboardCheck size={19} /></div><div><p className="font-bold">Bandeja de revisión</p><p className="mt-0.5 text-xs text-muted-foreground">Resolver casos detectados en ruta</p></div></button>
            </aside>
          </div>

          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="route-detail-title">
            <div className="border-b border-border px-5 py-4"><h3 id="route-detail-title" className="font-extrabold">Detalle del recorrido</h3><p className="mt-0.5 text-sm text-muted-foreground">Selecciona una parada para ubicarla en el mapa.</p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400"><tr><th className="p-4">Orden</th><th className="p-4">Toma / domicilio</th><th className="p-4">Resultado</th><th className="p-4">Tiempo estimado</th><th className="p-4">Estado</th></tr></thead><tbody className="divide-y divide-border">{orderedHomes.map((home) => <tr key={home.id} className={`cursor-pointer hover:bg-slate-50 ${selectedHome?.id === home.id ? "bg-sky-50/60" : ""}`} onClick={() => setSelectedHomeId(home.id)}><td className="p-4"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold">{home.location.sequence}</span></td><td className="p-4"><p className="font-bold">{home.id}</p><p className="text-xs text-muted-foreground">{home.address}</p></td><td className="p-4 text-slate-600">{home.outcomeLabel ?? "Visita pendiente"}</td><td className="p-4 text-slate-600">{home.location.etaMinutes} min · {home.location.distanceMeters} m</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${home.status === "completed" ? "bg-emerald-50 text-emerald-700" : home.status === "pending" ? "bg-teal-50 text-teal-700" : home.status === "review" ? "bg-violet-50 text-violet-700" : home.status === "incident" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{home.status === "completed" ? "Completada" : home.status === "pending" ? "Pendiente" : home.status === "review" ? "En revisión" : home.status === "incident" ? "Incidencia" : "Ausente"}</span></td></tr>)}</tbody></table></div>
          </section>
        </div>
      )}

      {showAssign && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-3 md:p-6">
          <div role="dialog" aria-modal="true" aria-labelledby="assign-route-title" className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-white px-5 py-4"><div><p className="text-xs font-bold text-primary">Planeación geográfica</p><h3 id="assign-route-title" className="text-xl font-extrabold">Asignar nueva ruta</h3></div><button type="button" onClick={() => setShowAssign(false)} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Cerrar formulario"><X size={20} /></button></div>
            <div className="grid lg:grid-cols-[minmax(0,1.45fr)_380px]">
              <div className="border-b border-border lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between gap-3 px-5 py-3"><div><p className="font-bold">Selecciona las tomas</p><p className="text-xs text-muted-foreground">Pulsa los marcadores para incluirlos o retirarlos.</p></div><span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">{selectedStops.length} seleccionadas</span></div>
                <RouteMap homes={field.homes} highlightedHomeIds={selectedStops} onSelectHome={toggleStop} showWorker={false} />
              </div>
              <div className="space-y-4 p-5">
                <label htmlFor="assignment-period" className="block"><span className="text-sm font-bold">Periodo</span><select id="assignment-period" value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} className="mt-1.5 w-full rounded-xl border border-border px-3 py-3"><option>Septiembre 2026</option><option>Octubre 2026</option></select></label>
                <label htmlFor="assignment-sector" className="block"><span className="text-sm font-bold">Sector</span><select id="assignment-sector" value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })} className="mt-1.5 w-full rounded-xl border border-border px-3 py-3"><option>Centro</option><option>Norte</option><option>Sur</option><option>Oriente</option></select></label>
                <label htmlFor="assignment-staff" className="block"><span className="text-sm font-bold">Personal de campo</span><select id="assignment-staff" value={form.employeeId} onChange={(event) => { const employee = fieldStaff.find((item) => item.id === event.target.value) ?? fieldStaff[0]; setForm({ ...form, employeeId: employee.id, employeeName: employee.name }) }} className="mt-1.5 w-full rounded-xl border border-border px-3 py-3">{fieldStaff.map((employee) => <option key={employee.id} value={employee.id}>{employee.id} · {employee.name}</option>)}</select></label>
                <div className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Paradas</span><strong>{selectedStops.length}</strong></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">Distancia estimada</span><strong>{Math.max(1, selectedStops.length * 0.7).toFixed(1)} km</strong></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">Duración estimada</span><strong>{selectedStops.reduce((total, id) => total + (field.homes.find((home) => home.id === id)?.location.etaMinutes ?? 0), 0)} min</strong></div></div>
                {form.employeeId === field.employee.id && <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs leading-5 text-teal-800"><strong>Dispositivo vinculado.</strong> Al confirmar, esta ruta aparecerá en la jornada de {field.employee.name}.</div>}
                {message && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{message}</div>}
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowAssign(false)} className="rounded-xl border border-border px-4 py-2.5 font-bold">Cancelar</button><button type="button" onClick={assignRoute} className="rounded-xl bg-primary px-5 py-2.5 font-bold text-white">Confirmar asignación</button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminOperation() {
  return <AdminOperationView mode="planning" />
}

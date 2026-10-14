import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  LogOut,
  MapPinned,
  Navigation,
  Radio,
  RefreshCw,
  Route,
  ShieldCheck,
} from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import RouteMap from "../../components/route/RouteMap"
import {
  formatFieldTime,
  getFieldState,
  getRouteStats,
  refreshFieldPosition,
  setActiveHome,
  setRouteStarted,
} from "../../lib/fieldState"

export default function FieldRoute() {
  const navigate = useNavigate()
  const [state, setState] = useState(() => getFieldState())
  const [selectedHomeId, setSelectedHomeId] = useState("")
  const stats = useMemo(() => getRouteStats(state), [state])
  const nextHome = [...state.homes].sort((a, b) => a.location.sequence - b.location.sequence).find((home) => home.status === "pending")
  const selectedHome = state.homes.find((home) => home.id === selectedHomeId) ?? nextHome
  const pendingSync = state.syncQueue.filter((item) => item.status === "pending").length
  const started = !!state.route.startedAt

  useEffect(() => {
    const refresh = () => setState(getFieldState())
    const storageListener = (event: StorageEvent) => {
      if (!event.key || event.key === "asm_field_state_v2") refresh()
    }
    window.addEventListener("asm-field-state-change", refresh)
    window.addEventListener("storage", storageListener)
    return () => {
      window.removeEventListener("asm-field-state-change", refresh)
      window.removeEventListener("storage", storageListener)
    }
  }, [])

  const begin = () => setState(setRouteStarted())
  const logout = () => {
    sessionStorage.removeItem("asm_field_authenticated")
    sessionStorage.removeItem("asm_field_employee")
    navigate("/field/login")
  }

  return (
    <div className="min-h-full bg-background pb-24">
      <FieldHeader
        title="Mi jornada"
        subtitle={`${state.route.name} · ${state.route.period}`}
        online={state.online}
        action={
          <button
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
            aria-label="Cerrar sesión"
          >
            <LogOut size={17} />
          </button>
        }
      />

      <main className="p-4">
        <section className="mb-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-800 to-teal-950 p-5 text-white shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-100">Buen día, {state.employee.name.split(" ")[0]}</p>
              <h2 className="mt-1 text-2xl font-bold">{started ? "Ruta en curso" : "Todo listo para salir"}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
              {state.employee.initials}
            </div>
          </div>

          {!started ? (
            <>
              <div className="mb-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 shrink-0 text-teal-200" size={21} />
                  <div>
                    <p className="font-semibold">Ruta {state.route.id}</p>
                    <p className="mt-1 text-sm leading-5 text-white/70">
                      {state.homes.length} domicilios asignados. Verifica que tengas batería suficiente y comienza la jornada.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={begin}
                className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-white font-bold text-teal-900 active:scale-[0.99]"
              >
                <Navigation size={20} />
                Iniciar jornada
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-xs text-white/65">Inicio</p>
                <p className="mt-1 font-bold">{formatFieldTime(state.route.startedAt)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-xs text-white/65">Avance</p>
                <p className="mt-1 font-bold">{stats.resolved} de {state.homes.length}</p>
              </div>
            </div>
          )}
        </section>

        {started && (
          <>
            <section className="mb-4 overflow-hidden rounded-[26px] border border-border bg-white shadow-sm" aria-labelledby="field-route-map-title">
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">Recorrido asignado</p>
                  <h3 id="field-route-map-title" className="mt-0.5 font-bold text-foreground">{state.route.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setState(refreshFieldPosition())}
                  className="flex items-center gap-1.5 rounded-xl border border-teal-100 bg-teal-50 px-2.5 py-2 text-[11px] font-bold text-secondary"
                  aria-label="Actualizar señal de ubicación"
                >
                  <Radio size={14} /> En seguimiento
                </button>
              </div>
              <RouteMap
                homes={state.homes}
                activeHomeId={nextHome?.id ?? state.activeHomeId}
                selectedHomeId={selectedHome?.id}
                onSelectHome={(home) => setSelectedHomeId(home.id)}
                compact
              />
              {selectedHome && (
                <div className="border-t border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Parada {selectedHome.location.sequence}</p>
                      <p className="mt-1 truncate font-bold text-foreground">{selectedHome.address}</p>
                      <p className="mt-1 text-xs text-muted-foreground">A {selectedHome.location.distanceMeters} m · {selectedHome.location.etaMinutes} min estimados</p>
                    </div>
                    {selectedHome.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveHome(selectedHome.id)
                          navigate("/field/meter")
                        }}
                        className="shrink-0 rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-white"
                      >
                        Abrir visita
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="mb-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary">Avance de ruta</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.progress}%</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{stats.resolved}/{state.homes.length} atendidas</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-secondary transition-[width] duration-300" style={{ width: `${stats.progress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-emerald-50 px-2 py-2.5">
                  <p className="text-lg font-bold text-emerald-700">{stats.completed}</p>
                  <p className="text-[10px] font-semibold text-emerald-700/75">Completadas</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-2 py-2.5">
                  <p className="text-lg font-bold text-amber-700">{stats.incidents}</p>
                  <p className="text-[10px] font-semibold text-amber-700/75">Incidencias</p>
                </div>
                <div className="rounded-xl bg-violet-50 px-2 py-2.5">
                  <p className="text-lg font-bold text-violet-700">{stats.reviews}</p>
                  <p className="text-[10px] font-semibold text-violet-700/75">En revisión</p>
                </div>
              </div>
            </section>

            {nextHome && (
              <section className="mb-4 rounded-[26px] border-2 border-secondary/30 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold text-secondary">SIGUIENTE VISITA</span>
                  <span className="text-xs text-muted-foreground">Parada {nextHome.location.sequence} · {nextHome.id}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{nextHome.address}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{nextHome.owner}</p>
                <div className="mt-3 flex gap-2 text-xs font-semibold text-slate-600"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{nextHome.location.etaMinutes} min</span><span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{nextHome.location.distanceMeters} m</span></div>
                <button
                  onClick={() => {
                    setActiveHome(nextHome.id)
                    navigate("/field/meter")
                  }}
                  className="mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white active:scale-[0.99]"
                >
                  <MapPinned size={20} />
                  Abrir siguiente visita
                </button>
              </section>
            )}

            <section className="space-y-3">
              <button
                onClick={() => navigate("/field/homes")}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-secondary"><Route size={21} /></div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">Ver todos los domicilios</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stats.pending} pendientes por atender</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/field/sync")}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><RefreshCw size={21} /></div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">Estado de sincronización</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{pendingSync ? `${pendingSync} registros esperando envío` : "Todo sincronizado"}</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/field/summary")}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Clock3 size={21} /></div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">Resumen y cierre de jornada</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Revisa pendientes antes de finalizar</p>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            </section>

            {!state.online && (
              <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertTriangle size={20} className="shrink-0" />
                <p>Estás trabajando sin conexión. Las capturas se guardarán en el dispositivo hasta recuperar red.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

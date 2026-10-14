import { useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle2, CloudOff, RefreshCw, Server, TriangleAlert, Wifi } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { formatFieldTime, getFieldState, setConnectivity, syncAllPending } from "../../lib/fieldState"

export default function FieldSync() {
  const navigate = useNavigate()
  const [state, setState] = useState(() => getFieldState())
  const [syncing, setSyncing] = useState(false)
  const pending = state.syncQueue.filter((item) => item.status === "pending")

  const toggle = () => setState(setConnectivity(!state.online))
  const sync = () => {
    if (!state.online || !pending.length) return
    setSyncing(true)
    window.setTimeout(() => {
      setState(syncAllPending())
      setSyncing(false)
    }, 900)
  }

  return (
    <div className="min-h-full bg-background pb-24">
      <FieldHeader title="Sincronización" subtitle="Datos guardados en el dispositivo" online={state.online} />
      <main className="p-4">
        <section className={`rounded-[28px] border p-5 shadow-sm ${state.online ? "border-emerald-200 bg-white" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${state.online ? "bg-emerald-50 text-emerald-600" : "bg-white text-amber-700"}`}>{state.online ? <Wifi size={24} /> : <CloudOff size={24} />}</div>
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estado de red</p><h2 className="mt-1 text-xl font-bold text-foreground">{state.online ? "Conexión disponible" : "Modo sin conexión"}</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">{state.online ? "Puedes enviar los registros locales al servidor." : "Puedes seguir capturando. Nada se perderá al cambiar de pantalla."}</p></div>
          </div>
          <button onClick={toggle} className="mt-4 min-h-[48px] w-full rounded-2xl border border-slate-300 bg-white text-sm font-bold text-slate-700">{state.online ? "Simular trabajo sin conexión" : "Restablecer conexión"}</button>
        </section>

        <section className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="font-bold text-foreground">Cola de sincronización</p><p className="mt-1 text-xs text-muted-foreground">Última sincronización: {formatFieldTime(state.lastSyncAt)}</p></div><div className="rounded-2xl bg-blue-50 px-3 py-2 text-center"><p className="text-xl font-bold text-blue-700">{pending.length}</p><p className="text-[9px] font-bold text-blue-600">PENDIENTES</p></div></div>

          <div className="mt-4 space-y-2">
            {state.syncQueue.length ? state.syncQueue.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.status === "synced" ? "bg-emerald-100 text-emerald-600" : item.status === "error" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"}`}>{item.status === "synced" ? <CheckCircle2 size={17} /> : item.status === "error" ? <TriangleAlert size={17} /> : <RefreshCw size={16} />}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-700">{item.label}</p><p className="mt-0.5 text-[11px] text-slate-400">{item.status === "synced" ? "Sincronizado" : item.status === "error" ? "Requiere atención" : "Esperando envío"}</p></div>
              </div>
            )) : <div className="rounded-2xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">No hay registros pendientes de sincronización.</div>}
          </div>

          <button disabled={!state.online || !pending.length || syncing} onClick={sync} className="mt-4 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white disabled:opacity-40"><RefreshCw size={19} className={syncing ? "animate-spin" : ""} /> {syncing ? "Sincronizando…" : "Sincronizar ahora"}</button>
        </section>

        <button onClick={() => navigate("/field/offline")} className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm"><Server className="text-secondary" size={22} /><div><p className="font-bold text-foreground">¿Cómo funciona el modo offline?</p><p className="mt-0.5 text-xs text-muted-foreground">Consulta qué datos se guardan localmente.</p></div></button>
      </main>
    </div>
  )
}

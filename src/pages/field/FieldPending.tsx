import { useMemo } from "react"
import { useNavigate } from "react-router"
import { AlertTriangle, Clock3, RefreshCw, SearchCheck } from "lucide-react"
import { FieldEmptyState, FieldHeader, FieldStatusPill } from "../../components/field/FieldUi"
import { getFieldState, setActiveHome } from "../../lib/fieldState"

export default function FieldPending() {
  const navigate = useNavigate()
  const state = getFieldState()
  const operational = useMemo(
    () => state.homes.filter((home) => ["review", "incident", "absent"].includes(home.status)),
    [state.homes],
  )
  const pendingSync = state.syncQueue.filter((item) => item.status === "pending")

  return (
    <div className="min-h-full bg-background pb-24">
      <FieldHeader title="Pendientes" subtitle="Seguimientos de la jornada" online={state.online} />
      <main className="p-4">
        <section className="mb-4 rounded-[26px] border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><RefreshCw size={21} /></div><div><p className="font-bold text-foreground">Sincronización</p><p className="text-xs text-muted-foreground">{pendingSync.length ? `${pendingSync.length} registros por enviar` : "No hay registros locales pendientes"}</p></div></div>
            <button onClick={() => navigate("/field/sync")} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Revisar</button>
          </div>
        </section>

        <h2 className="mb-3 px-1 text-sm font-bold text-foreground">Seguimiento operativo</h2>
        {operational.length ? (
          <div className="space-y-3">
            {operational.map((home) => (
              <button key={home.id} onClick={() => { setActiveHome(home.id); navigate("/field/meter") }} className="w-full rounded-[22px] border border-border bg-white p-4 text-left shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${home.status === "review" ? "bg-violet-50 text-violet-600" : home.status === "incident" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-600"}`}>
                    {home.status === "review" ? <Clock3 size={21} /> : <AlertTriangle size={21} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2"><div><p className="font-bold text-foreground">{home.address}</p><p className="mt-0.5 text-xs text-muted-foreground">{home.owner}</p></div><FieldStatusPill status={home.status} /></div>
                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">{home.outcomeLabel ?? "Requiere seguimiento"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <FieldEmptyState icon={<SearchCheck size={28} />} title="Sin seguimientos pendientes" description="Las visitas que requieran revisión, revisita o atención administrativa aparecerán aquí." />
        )}
      </main>
    </div>
  )
}

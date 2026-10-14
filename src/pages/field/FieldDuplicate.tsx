import { useNavigate } from "react-router"
import { AlertTriangle, CheckCircle2, GitCompareArrows, Trash2 } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState } from "../../lib/fieldState"

export default function FieldDuplicate() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Conflicto de sincronización" subtitle={home.id} back={() => navigate("/field/sync")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><GitCompareArrows size={24} /></div><div><h2 className="text-xl font-bold text-foreground">La toma ya fue actualizada</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">El servidor recibió otro registro para esta misma toma mientras el dispositivo estaba sin conexión.</p></div></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500">SERVIDOR</p><p className="mt-2 text-sm font-bold">Lectura 1215 m³</p><p className="mt-1 text-xs text-slate-500">09:42 · CAM-009</p></div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-bold text-amber-700">ESTE DISPOSITIVO</p><p className="mt-2 text-sm font-bold text-amber-900">Lectura {home.currentReading ?? 1216} m³</p><p className="mt-1 text-xs text-amber-700">10:03 · {state.employee.id}</p></div>
          </div>
          <div className="mt-4 flex gap-2 rounded-2xl bg-slate-50 p-4 text-sm leading-5 text-slate-700"><AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-600" />No se debe sobrescribir automáticamente. El registro local puede conservarse como evidencia para revisión.</div>
        </section>
        <button onClick={() => navigate("/field/sync")} className="mt-4 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><CheckCircle2 size={20} /> Conservar servidor y archivar evidencia</button>
        <button onClick={() => navigate("/field/sync")} className="mt-3 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-sm font-bold text-slate-700"><Trash2 size={18} /> Descartar registro local</button>
      </main>
    </div>
  )
}

import { useNavigate } from "react-router"
import { AlertTriangle, CheckCircle2, Home } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState } from "../../lib/fieldState"

export default function FieldIncidenceSuccess() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const ref = home.incidentRef ?? sessionStorage.getItem("asm_last_incident_ref") ?? "INC-PENDIENTE"
  return (
    <div className="min-h-full bg-background">
      <FieldHeader title="Incidencia registrada" subtitle={ref} online={state.online} />
      <main className="flex min-h-[720px] flex-col items-center justify-center p-6 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] bg-amber-100 text-amber-700"><CheckCircle2 size={39} /></div>
        <h2 className="text-2xl font-bold text-foreground">Reporte guardado</h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Administración podrá consultar la evidencia y dar seguimiento sin bloquear el resto de tu ruta.</p>
        <div className="mt-6 w-full rounded-3xl border border-amber-200 bg-white p-5 text-left shadow-sm"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={22} /><div><p className="text-xs text-slate-500">Referencia</p><p className="font-bold text-slate-900">{ref}</p><p className="mt-2 text-sm text-slate-600">{home.address}<br />{home.outcomeLabel}</p></div></div></div>
        {!state.online && <p className="mt-3 text-xs font-medium text-amber-700">Guardado localmente. Se enviará al recuperar conexión.</p>}
        <button onClick={() => navigate("/field/homes")} className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><Home size={20} /> Continuar ruta</button>
      </main>
    </div>
  )
}

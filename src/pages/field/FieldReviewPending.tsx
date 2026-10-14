import { useNavigate } from "react-router"
import { CheckCircle2, Clock3, Home, ShieldAlert } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState } from "../../lib/fieldState"

export default function FieldReviewPending() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  return (
    <div className="min-h-full bg-background">
      <FieldHeader title="Enviado a revisión" subtitle={home.id} online={state.online} />
      <main className="flex min-h-[720px] flex-col items-center justify-center p-6 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] bg-violet-100 text-violet-700"><Clock3 size={38} /></div>
        <h2 className="text-2xl font-bold text-foreground">Visita registrada correctamente</h2>
        <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">La lectura quedó pendiente de revisión administrativa. Por ahora no se genera un recibo ni un adeudo para el habitante.</p>
        <div className="mt-6 w-full rounded-3xl border border-violet-200 bg-white p-5 text-left shadow-sm">
          <div className="flex items-center gap-3"><ShieldAlert className="text-violet-600" size={22} /><div><p className="text-xs text-slate-500">Toma</p><p className="font-bold">{home.id} · {home.address}</p></div></div>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4"><CheckCircle2 className="text-emerald-600" size={22} /><p className="text-sm text-slate-600">Evidencia y lectura guardadas en la bitácora.</p></div>
        </div>
        <button onClick={() => navigate("/field/homes")} className="mt-7 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><Home size={20} /> Continuar ruta</button>
      </main>
    </div>
  )
}

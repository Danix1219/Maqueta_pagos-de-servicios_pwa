import { useNavigate } from "react-router"
import { AlertTriangle, Camera, RotateCcw, Wrench } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState } from "../../lib/fieldState"

export default function FieldInvalid() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Lectura inconsistente" subtitle={home.meter} back={() => navigate("/field/capture")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[28px] border border-rose-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={32} /></div>
          <h2 className="text-2xl font-bold text-foreground">La lectura es menor a la anterior</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Antes de guardar el registro, confirma que los dígitos fueron capturados correctamente o reporta una posible anomalía del medidor.</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Anterior</p><p className="mt-1 text-xl font-bold">{home.previousReading} m³</p></div>
            <div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs text-rose-600">Capturada</p><p className="mt-1 text-xl font-bold text-rose-700">{home.currentReading} m³</p></div>
          </div>
        </section>

        <div className="mt-4 space-y-3">
          <button onClick={() => navigate("/field/capture")} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><RotateCcw size={20} /> Volver a capturar</button>
          <button onClick={() => navigate("/field/incidence?type=medidor")} className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 font-bold text-amber-800"><Wrench size={20} /> Reportar anomalía del medidor</button>
          <button onClick={() => navigate("/field/incidence?type=evidencia")} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white font-bold text-slate-700"><Camera size={19} /> Registrar incidencia con evidencia</button>
        </div>
      </main>
    </div>
  )
}

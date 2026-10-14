import { useState } from "react"
import { useNavigate } from "react-router"
import { AlertTriangle, Camera, CheckCircle2, RotateCcw } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { addSyncItem, getActiveHome, getFieldState, updateActiveHome } from "../../lib/fieldState"

export default function FieldOutlier() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const [confirmed, setConfirmed] = useState(false)
  const [photo, setPhoto] = useState("")

  const sendReview = () => {
    updateActiveHome({ status: "review", outcomeLabel: "Consumo atípico enviado a revisión" })
    addSyncItem("review", `${home.id} · Consumo atípico ${home.consumption ?? 0} m³`, state.online ? "synced" : "pending")
    navigate("/field/review-pending")
  }

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Consumo atípico" subtitle={home.id} back={() => navigate("/field/capture")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[28px] border border-violet-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><AlertTriangle size={25} /></div>
            <div><h2 className="text-xl font-bold text-foreground">Requiere una segunda validación</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">El consumo supera el rango esperado. No se emitirá deuda hasta que administración revise el caso.</p></div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Anterior</p><p className="mt-1 font-bold">{home.previousReading}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Actual</p><p className="mt-1 font-bold">{home.currentReading}</p></div>
            <div className="rounded-xl bg-violet-50 p-3"><p className="text-[10px] text-violet-600">Consumo</p><p className="mt-1 font-bold text-violet-700">{home.consumption} m³</p></div>
          </div>
        </section>

        <section className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <p className="font-bold text-foreground">Verificación en sitio</p>
          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            <Camera size={20} /> {photo || "Agregar foto adicional del medidor"}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")} />
          </label>
          <label className="mt-4 flex items-start gap-3 rounded-2xl bg-violet-50 p-4 text-sm text-violet-900">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" />
            <span><strong>Confirmo que verifiqué físicamente la lectura.</strong><br />La cifra capturada coincide con el medidor.</span>
          </label>
        </section>

        <div className="mt-4 space-y-3">
          <button disabled={!confirmed} onClick={sendReview} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"><CheckCircle2 size={20} /> Enviar a revisión</button>
          <button onClick={() => navigate("/field/capture")} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white font-bold text-slate-700"><RotateCcw size={19} /> Corregir lectura</button>
        </div>
      </main>
    </div>
  )
}

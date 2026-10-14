import { useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle2, DoorClosed, MapPinOff, MessageSquareText } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { addSyncItem, getActiveHome, getFieldState, updateActiveHome } from "../../lib/fieldState"

const reasons = [
  "No se localizó a ninguna persona",
  "Domicilio cerrado",
  "No fue posible acceder al medidor",
  "Dirección no localizada",
]

export default function FieldAbsent() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const [reason, setReason] = useState(reasons[0])
  const [note, setNote] = useState("")
  const [notice, setNotice] = useState(true)

  const save = () => {
    updateActiveHome({ status: "absent", outcomeLabel: reason })
    addSyncItem("absence", `${home.id} · ${reason}`, state.online ? "synced" : "pending")
    navigate("/field/done")
  }

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Visita no completada" subtitle={home.address} back={() => navigate("/field/meter")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><DoorClosed size={22} /></div><div><h2 className="font-bold text-foreground">Registra el motivo</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Este resultado queda en la bitácora y puede generar una revisita según las reglas administrativas.</p></div></div>
          <div className="space-y-2">
            {reasons.map((item) => (
              <button key={item} onClick={() => setReason(item)} className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm ${reason === item ? "border-rose-300 bg-rose-50 font-bold text-rose-800" : "border-slate-200 bg-white text-slate-700"}`}>
                <MapPinOff size={18} className={reason === item ? "text-rose-600" : "text-slate-400"} />
                <span className="flex-1">{item}</span>
                <span className={`h-5 w-5 rounded-full border-2 ${reason === item ? "border-rose-500 bg-rose-500 shadow-[inset_0_0_0_4px_white]" : "border-slate-300"}`} />
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor="field-absence-note" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700"><MessageSquareText size={17} /> Observación opcional</label>
            <textarea id="field-absence-note" value={note} onChange={(e) => setNote(e.target.value.slice(0, 180))} rows={3} placeholder="Agrega contexto útil para una siguiente visita…" className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-teal-100" />
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><input type="checkbox" checked={notice} onChange={(e) => setNotice(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" /><span>Se dejó aviso de visita cuando fue posible.</span></label>
        </section>
        <button onClick={save} className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><CheckCircle2 size={20} /> Guardar resultado</button>
      </main>
    </div>
  )
}

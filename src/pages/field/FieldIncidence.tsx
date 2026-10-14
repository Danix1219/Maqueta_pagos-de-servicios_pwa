import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { AlertTriangle, Camera, CheckCircle2, Droplets, MapPinOff, ShieldAlert, Wrench } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { addSyncItem, getActiveHome, getFieldState, updateActiveHome } from "../../lib/fieldState"

const types = [
  { id: "medidor", label: "Medidor dañado o ilegible", icon: Wrench },
  { id: "acceso", label: "Sin acceso al medidor", icon: MapPinOff },
  { id: "fuga", label: "Posible fuga visible", icon: Droplets },
  { id: "seguridad", label: "Manipulación o riesgo", icon: ShieldAlert },
  { id: "otro", label: "Otra incidencia", icon: AlertTriangle },
]

export default function FieldIncidence() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const state = getFieldState()
  const home = getActiveHome(state)
  const defaultType = useMemo(() => {
    const queryType = params.get("type")
    return types.some((item) => item.id === queryType) ? queryType! : "medidor"
  }, [params])
  const [type, setType] = useState(defaultType)
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState("")
  const [error, setError] = useState("")

  const submit = () => {
    if (description.trim().length < 8) {
      setError("Describe brevemente lo observado para que administración pueda dar seguimiento.")
      return
    }
    const label = types.find((item) => item.id === type)?.label ?? "Incidencia"
    const ref = `INC-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`
    sessionStorage.setItem("asm_last_incident_ref", ref)
    updateActiveHome({ status: "incident", incidentRef: ref, outcomeLabel: label })
    addSyncItem("incident", `${home.id} · ${label}`, state.online ? "synced" : "pending")
    navigate("/field/incidence-success")
  }

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Reportar incidencia" subtitle={`${home.id} · ${home.address}`} back={() => navigate("/field/meter")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <h2 className="font-bold text-foreground">Tipo de incidencia</h2>
          <div className="mt-3 space-y-2">
            {types.map((item) => {
              const Icon = item.icon
              const selected = type === item.id
              return <button key={item.id} onClick={() => setType(item.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left ${selected ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"}`}><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${selected ? "bg-white text-amber-700" : "bg-slate-100 text-slate-500"}`}><Icon size={19} /></div><span className={`flex-1 text-sm ${selected ? "font-bold text-amber-900" : "font-medium text-slate-700"}`}>{item.label}</span></button>
            })}
          </div>

          <h3 className="mt-5 text-sm font-bold text-slate-700">Prioridad</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[{ id: "low", label: "Baja" }, { id: "medium", label: "Media" }, { id: "high", label: "Alta" }].map((item) => <button key={item.id} onClick={() => setSeverity(item.id as typeof severity)} className={`rounded-xl px-2 py-2.5 text-xs font-bold ${severity === item.id ? item.id === "high" ? "bg-rose-600 text-white" : item.id === "medium" ? "bg-amber-500 text-white" : "bg-secondary text-white" : "bg-slate-100 text-slate-600"}`}>{item.label}</button>)}
          </div>

          <label htmlFor="field-incidence-description" className="mt-5 block text-sm font-bold text-slate-700">Descripción</label>
          <textarea id="field-incidence-description" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 240))} rows={4} placeholder="Describe qué observaste y cualquier detalle relevante…" aria-invalid={!!error} aria-describedby={error ? "field-incidence-error" : undefined} className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-teal-100" />

          <label className="mt-4 flex min-h-[80px] cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-center text-sm font-semibold text-slate-600"><Camera size={20} /> {photo || "Agregar evidencia fotográfica"}<input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")} /></label>
        </section>
        {error && <div id="field-incidence-error" role="alert" className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</div>}
        <button onClick={submit} className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><CheckCircle2 size={20} /> Registrar incidencia</button>
      </main>
    </div>
  )
}

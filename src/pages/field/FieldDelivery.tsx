import { useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle2, Home, Mail, UserCheck } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { addSyncItem, getActiveHome, getFieldState, updateActiveHome } from "../../lib/fieldState"

type Delivery = "holder" | "adult" | "mailbox" | "digital"

export default function FieldDelivery() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const [method, setMethod] = useState<Delivery>("holder")
  const [recipient, setRecipient] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const finish = () => {
    const labels: Record<Delivery, string> = {
      holder: "Entregado al titular",
      adult: "Entregado a adulto responsable",
      mailbox: "Aviso dejado en domicilio",
      digital: "Recibo enviado por medio digital",
    }
    updateActiveHome({ status: "completed", outcomeLabel: labels[method] })
    addSyncItem("delivery", `${home.id} · ${labels[method]}`, state.online ? "synced" : "pending")
    navigate("/field/done")
  }

  const options = [
    { id: "holder" as const, title: "Titular", text: "Entrega directa al titular de la cuenta", icon: UserCheck },
    { id: "adult" as const, title: "Adulto responsable", text: "Recibe otra persona mayor de edad", icon: Home },
    { id: "mailbox" as const, title: "Aviso en domicilio", text: "Se deja aviso físico en un lugar seguro", icon: Home },
    { id: "digital" as const, title: "Medio digital", text: "Se confirma envío al contacto registrado", icon: Mail },
  ]

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Registrar entrega" subtitle={home.address} back={() => navigate("/field/issued")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">¿Cómo se entregó el recibo?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Selecciona el resultado real de la visita.</p>
          <div className="mt-4 space-y-3">
            {options.map((option) => {
              const Icon = option.icon
              const selected = method === option.id
              return (
                <button key={option.id} onClick={() => setMethod(option.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${selected ? "border-secondary bg-teal-50 ring-1 ring-secondary/10" : "border-slate-200 bg-white"}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? "bg-white text-secondary" : "bg-slate-100 text-slate-500"}`}><Icon size={20} /></div>
                  <div className="flex-1"><p className="font-bold text-foreground">{option.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{option.text}</p></div>
                  <div className={`h-5 w-5 rounded-full border-2 ${selected ? "border-secondary bg-secondary shadow-[inset_0_0_0_4px_white]" : "border-slate-300"}`} />
                </button>
              )
            })}
          </div>

          {method === "adult" && (
            <div className="mt-4"><label htmlFor="field-recipient" className="mb-1.5 block text-sm font-bold text-slate-700">Nombre de quien recibe</label><input id="field-recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-teal-100" /></div>
          )}

          <label className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" />
            <span>Confirmo que el resultado seleccionado corresponde a lo ocurrido en la visita.</span>
          </label>
        </section>

        <button disabled={!confirmed || (method === "adult" && recipient.trim().length < 3)} onClick={finish} className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white disabled:opacity-45"><CheckCircle2 size={20} /> Guardar y completar visita</button>
        <button onClick={() => navigate("/field/absent")} className="mt-3 min-h-[50px] w-full rounded-2xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-700">No fue posible entregar</button>
      </main>
    </div>
  )
}

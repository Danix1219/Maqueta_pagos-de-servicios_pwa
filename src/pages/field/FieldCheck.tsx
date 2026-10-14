import { useNavigate } from "react-router"
import { ArrowRight, CheckCircle2, Droplets, Edit3, ReceiptText } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState, updateActiveHome } from "../../lib/fieldState"

export default function FieldCheck() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const consumption = home.consumption ?? Math.max(0, (home.currentReading ?? home.previousReading) - home.previousReading)
  const amount = consumption * 10

  const issue = () => {
    updateActiveHome({ consumption, amount })
    navigate("/field/issued")
  }

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Revisar lectura" subtitle={`${home.id} · ${home.address}`} back={() => navigate("/field/capture")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={25} /></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Lectura válida</p><h2 className="text-xl font-bold text-foreground">Confirma antes de emitir</h2></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Anterior</p><p className="mt-1 text-2xl font-bold">{home.previousReading}</p><p className="text-xs text-slate-400">m³</p></div>
            <div className="rounded-2xl bg-teal-50 p-4"><p className="text-xs text-secondary">Actual</p><p className="mt-1 text-2xl font-bold text-secondary">{home.currentReading}</p><p className="text-xs text-secondary/70">m³</p></div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <div className="flex items-center gap-3"><Droplets className="text-blue-600" size={22} /><div><p className="text-xs text-slate-500">Consumo del periodo</p><p className="text-lg font-bold text-slate-900">{consumption} m³</p></div></div>
            <div className="text-right"><p className="text-xs text-slate-500">Importe</p><p className="text-xl font-bold text-slate-900">${amount.toFixed(2)}</p></div>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Cálculo aplicado con la tarifa vigente en el catálogo: $10.00 por m³.</p>
        </section>

        <section className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><ReceiptText className="text-secondary" size={22} /><div><p className="font-bold">Recibo del periodo</p><p className="text-xs text-muted-foreground">Se generará al confirmar esta lectura.</p></div></div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Cuenta</p><p className="mt-1 font-bold text-slate-700">{home.account}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Periodo</p><p className="mt-1 font-bold text-slate-700">Sept. 2026</p></div>
          </div>
        </section>

        <div className="mt-4 space-y-3">
          <button onClick={issue} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><span>Confirmar y emitir recibo</span><ArrowRight size={20} /></button>
          <button onClick={() => navigate("/field/capture")} className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white font-bold text-slate-700"><Edit3 size={18} /> Editar lectura</button>
        </div>
      </main>
    </div>
  )
}

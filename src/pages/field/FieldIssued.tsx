import { useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle2, FileText, Send, WalletCards } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState } from "../../lib/fieldState"

export default function FieldIssued() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const folio = `REC-${home.id.replace("T-", "")}-0926`
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Recibo emitido" subtitle={folio} online={state.online} />
      <main className="p-4">
        <section className="rounded-[30px] border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={26} /></div><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Generado correctamente</p><h2 className="text-xl font-bold">Recibo septiembre 2026</h2></div></div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex justify-between gap-3"><div><p className="text-xs text-slate-500">Titular</p><p className="mt-1 font-bold">{home.owner}</p><p className="mt-0.5 text-xs text-slate-500">{home.address}</p></div><div className="text-right"><p className="text-xs text-slate-500">Total</p><p className="mt-1 text-2xl font-bold">${(home.amount ?? 0).toFixed(2)}</p></div></div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 text-xs"><div><p className="text-slate-400">Consumo</p><p className="font-bold">{home.consumption} m³</p></div><div><p className="text-slate-400">Folio</p><p className="font-bold">{folio}</p></div></div>
          </div>
        </section>

        <section className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3"><WalletCards className="text-secondary" size={22} /><div><p className="font-bold">Entrega al habitante</p><p className="text-xs text-muted-foreground">Registra cómo se entregó o notificó el recibo.</p></div></div>
          <button onClick={() => navigate("/field/delivery")} className="mt-2 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white"><Send size={20} /> Continuar con entrega</button>
          <button
            type="button"
            onClick={() => setShowPreview((value) => !value)}
            aria-expanded={showPreview}
            aria-controls="field-receipt-preview"
            className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-sm font-bold text-slate-700"
          >
            <FileText size={18} /> {showPreview ? "Ocultar vista previa" : "Vista previa del recibo"}
          </button>
        </section>

        {showPreview && (
          <section id="field-receipt-preview" className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
            <div className="border-b border-dashed border-slate-300 pb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Agua Santa María</p>
              <h3 className="mt-1 text-lg font-bold text-foreground">Recibo de agua</h3>
              <p className="mt-1 text-xs text-muted-foreground">Septiembre 2026 · {folio}</p>
            </div>
            <dl className="space-y-3 py-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Cuenta</dt><dd className="font-bold text-foreground">{home.account}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Lectura</dt><dd className="font-bold text-foreground">{home.currentReading} m³</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Consumo</dt><dd className="font-bold text-foreground">{home.consumption} m³</dd></div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-3"><dt className="font-bold text-foreground">Total</dt><dd className="text-lg font-black text-foreground">${(home.amount ?? 0).toFixed(2)}</dd></div>
            </dl>
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-center text-[11px] leading-4 text-muted-foreground">Este recibo informa el importe del periodo. No acredita un pago.</p>
          </section>
        )}
      </main>
    </div>
  )
}

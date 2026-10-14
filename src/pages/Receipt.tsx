import { useNavigate } from "react-router"
import { ArrowLeft, CheckCircle2, QrCode, Download, ExternalLink } from "lucide-react"
import { formatCurrency, formatPaymentDate, getPaymentSession, maskCard, CURRENT_BILL } from "../lib/payment"

export default function Receipt() {
  const navigate = useNavigate()
  const payment = getPaymentSession()

  return (
    <div className="h-full flex flex-col bg-slate-100">
      <div className="px-4 py-4 flex items-center justify-between bg-primary text-primary-foreground">
        <div className="flex items-center">
          <button onClick={() => navigate("/history")} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"><ArrowLeft size={24} /></button>
          <h1 className="font-bold text-lg ml-2">Comprobante</h1>
        </div>
        <button onClick={() => window.print()} className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Imprimir comprobante"><Download size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="bg-white rounded-[32px] shadow-sm relative overflow-hidden">
          <div className="h-4 bg-green-500 w-full"></div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-green-600 font-bold mb-6"><CheckCircle2 size={24} /><span>Pago confirmado</span></div>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">{formatCurrency(CURRENT_BILL.amount)}</h2>
              <p className="text-sm font-semibold text-muted-foreground mt-2">{formatPaymentDate(payment?.paidAt)}</p>
            </div>

            <div className="space-y-4 text-sm border-t border-border border-dashed pt-6 mb-6">
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Folio</span><span className="font-bold text-foreground text-right">{payment?.transactionId ?? "PAG-2026-0081"}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Autorización</span><span className="font-bold text-foreground">{payment?.authorizationCode ?? "—"}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Método</span><span className="font-bold text-foreground text-right">{payment ? maskCard(payment) : "Pago en línea"}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Periodo</span><span className="font-bold text-foreground">{CURRENT_BILL.period}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Recibo</span><span className="font-bold text-foreground">{CURRENT_BILL.receipt}</span></div>
            </div>

            <div className="bg-background rounded-2xl p-4 mb-8">
              <p className="text-xs text-muted-foreground mb-1">Titular y cuenta</p>
              <p className="font-bold text-foreground">{CURRENT_BILL.holder}</p>
              <p className="font-semibold text-primary">{CURRENT_BILL.account}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-white border-2 border-border p-2 rounded-xl flex flex-col items-center justify-center text-muted-foreground mb-3 opacity-50 relative">
                <QrCode size={48} className="mb-2" />
                <span className="text-[10px] font-bold text-center absolute -rotate-45 uppercase tracking-widest text-slate-300">Demostración</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">En producción, este código permitiría validar el comprobante contra el backend.</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-8 flex justify-between px-[-16px]">
            <div className="w-8 h-8 rounded-full bg-slate-100 -ml-4 -mb-4"></div>
            <div className="flex-1 border-b-2 border-dashed border-slate-200 mb-4 mx-2"></div>
            <div className="w-8 h-8 rounded-full bg-slate-100 -mr-4 -mb-4"></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-border mt-auto">
        <button onClick={() => navigate("/public-validation")} className="w-full bg-background border border-border text-primary font-semibold py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform flex justify-center items-center gap-2 min-h-[56px]"><ExternalLink size={20} /> Validación pública</button>
      </div>
    </div>
  )
}

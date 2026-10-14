import { useNavigate } from "react-router"
import { CheckCircle2, Receipt, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react"
import { formatCurrency, formatPaymentDate, getPaymentSession, maskCard, CURRENT_BILL } from "../lib/payment"

export default function Success() {
  const navigate = useNavigate()
  const payment = getPaymentSession()

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center">
        <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground"><ArrowLeft size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 mx-auto"><CheckCircle2 size={48} /></div>
        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Pago confirmado</h1>
        <p className="text-muted-foreground text-base mb-7">El banco autorizó tu pago y el recibo quedó registrado.</p>

        <div className="bg-white border border-border rounded-3xl p-6 w-full max-w-sm mx-auto mb-5 shadow-sm text-left">
          <div className="text-center border-b border-dashed border-border pb-5 mb-5">
            <p className="text-xs text-muted-foreground mb-1">Importe pagado</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(CURRENT_BILL.amount)}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatPaymentDate(payment?.paidAt)}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Folio</span><span className="font-semibold text-right">{payment?.transactionId ?? "PAG-2026-0081"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Autorización</span><span className="font-semibold">{payment?.authorizationCode ?? "—"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Método</span><span className="font-semibold text-right">{payment ? maskCard(payment) : "Pago en línea"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Cuenta</span><span className="font-semibold">{CURRENT_BILL.account}</span></div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3 text-left">
          <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-xs text-green-800">Tu cuenta se actualizará como pagada y el comprobante estará disponible en el historial.</p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-border mt-auto space-y-3">
        <button onClick={() => navigate("/receipt")} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl text-lg shadow-sm active:scale-[0.98] transition-transform flex justify-center items-center gap-2 min-h-[56px]"><Receipt size={20} /> Ver comprobante</button>
        <button onClick={() => navigate("/home")} className="w-full bg-white border border-border text-foreground font-semibold py-3.5 rounded-2xl flex justify-center items-center gap-2 min-h-[50px]"><CreditCard size={18} /> Volver al inicio</button>
      </div>
    </div>
  )
}

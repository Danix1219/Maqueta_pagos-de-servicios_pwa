import { useNavigate } from "react-router"
import { AlertTriangle, ArrowLeft, Building2, CreditCard, ShieldAlert } from "lucide-react"
import { formatCurrency, getPaymentSession, maskCard, CURRENT_BILL } from "../lib/payment"

export default function PaymentDeclined() {
  const navigate = useNavigate()
  const session = getPaymentSession()

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border">
        <button onClick={() => navigate("/home")} className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><ArrowLeft size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-7"><ShieldAlert size={48} /></div>
        <h1 className="text-3xl font-bold mb-3">El banco no autorizó el pago</h1>
        <p className="text-muted-foreground text-base mb-6">No se realizó ningún cargo en Agua Santa María. Puedes intentar con otra tarjeta o usar el pago en oficina.</p>

        <div className="w-full bg-white border border-border rounded-3xl p-5 text-left shadow-sm mb-5">
          <div className="flex justify-between gap-4 mb-3"><span className="text-sm text-muted-foreground">Importe</span><span className="font-bold">{formatCurrency(CURRENT_BILL.amount)}</span></div>
          <div className="flex justify-between gap-4 mb-3"><span className="text-sm text-muted-foreground">Tarjeta</span><span className="font-bold">{session ? maskCard(session) : "—"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-sm text-muted-foreground">Estado</span><span className="font-bold text-rose-600">No autorizado</span></div>
        </div>

        <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 text-left">
          <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-800">Por seguridad, el banco no siempre informa el motivo exacto. Verifica fondos, límites de compra en línea o comunícate con tu banco si el rechazo continúa.</p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-border flex flex-col gap-3">
        <button onClick={() => navigate("/payment/card")} className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 min-h-[56px]"><CreditCard size={20} /> Intentar con otra tarjeta</button>
        <button onClick={() => navigate("/office-code")} className="w-full bg-white border border-border text-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 min-h-[56px]"><Building2 size={20} /> Pagar en oficina</button>
      </div>
    </div>
  )
}

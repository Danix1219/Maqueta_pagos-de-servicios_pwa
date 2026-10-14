import { useNavigate } from "react-router"
import { ArrowLeft, Clock, CheckCircle2, ChevronRight, FileText } from "lucide-react"
import { formatPaymentDate, getPaymentSession } from "../lib/payment"

export default function History() {
  const navigate = useNavigate()
  const payment = getPaymentSession()
  const septemberPaid = payment?.status === "approved"

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"><ArrowLeft size={24} /></button>
          <h1 className="font-bold text-lg ml-2">Recibos e historial</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        <p className="text-muted-foreground mb-6">Consulta los periodos de tu cuenta.</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate(septemberPaid ? "/receipt" : "/bill")}
            className={`w-full bg-white rounded-3xl p-5 text-left shadow-sm active:scale-[0.98] transition-transform relative overflow-hidden border ${septemberPaid ? "border-green-200" : "border-amber-200"}`}
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${septemberPaid ? "bg-green-500" : "bg-amber-400"}`}></div>
            <div className="flex justify-between items-start mb-2"><h2 className="font-bold text-foreground text-lg uppercase tracking-wide">Septiembre 2026</h2><span className="font-bold text-foreground text-lg">$150.00</span></div>
            <div className={`flex items-center gap-2 mb-3 ${septemberPaid ? "text-green-600" : "text-amber-700"}`}>
              {septemberPaid ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              <span className="text-sm font-semibold">{septemberPaid ? `Pagado · ${formatPaymentDate(payment?.paidAt)}` : "Pendiente de pago"}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1">{septemberPaid ? <><FileText size={14} /> {payment?.transactionId}</> : "Vence 30 sep"}</span>
              <span className="flex items-center gap-1 font-semibold text-primary">{septemberPaid ? "Comprobante" : "Ver detalle"} <ChevronRight size={16} /></span>
            </div>
          </button>

          <button onClick={() => navigate("/receipt")} className="w-full bg-white border border-border rounded-3xl p-5 text-left shadow-sm active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-2"><h2 className="font-bold text-foreground text-lg uppercase tracking-wide">Agosto 2026</h2><span className="font-bold text-foreground text-lg">$150.00</span></div>
            <div className="flex items-center gap-2 text-green-600 mb-3"><CheckCircle2 size={16} /><span className="text-sm font-semibold">Pagado el 15 ago</span></div>
            <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-3"><span className="flex items-center gap-1"><FileText size={14} /> PAG-2026-0042</span><span className="flex items-center gap-1 font-semibold text-foreground">Comprobante <ChevronRight size={16} /></span></div>
          </button>

          <button className="w-full bg-white border border-border rounded-3xl p-5 text-left shadow-sm active:scale-[0.98] transition-transform opacity-75">
            <div className="flex justify-between items-start mb-2"><h2 className="font-bold text-foreground text-lg uppercase tracking-wide">Julio 2026</h2><span className="font-bold text-foreground text-lg">$150.00</span></div>
            <div className="flex items-center gap-2 text-green-600 mb-3"><CheckCircle2 size={16} /><span className="text-sm font-semibold">Pagado el 12 jul</span></div>
            <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-3"><span className="flex items-center gap-1"><FileText size={14} /> PAG-2026-0010</span><span className="flex items-center gap-1 font-semibold text-foreground">Comprobante <ChevronRight size={16} /></span></div>
          </button>
        </div>
      </div>
    </div>
  )
}

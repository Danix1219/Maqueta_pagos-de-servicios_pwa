import { useNavigate } from "react-router"
import { ArrowLeft, CreditCard, ShieldCheck, Building2, ReceiptText, ChevronRight } from "lucide-react"

export default function Review() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg ml-2">Revisa tu pago</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Confirma tu recibo</h2>
          <p className="text-muted-foreground">Verifica la cuenta, el periodo y el importe antes de elegir cómo pagar.</p>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-foreground font-bold text-lg">MH</div>
            <div>
              <p className="font-bold text-foreground">María Hernández López</p>
              <p className="text-sm text-muted-foreground">Cuenta: SMM-001245</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Periodo</span><span className="font-semibold text-foreground">Septiembre 2026</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Recibo</span><span className="font-semibold text-foreground">SEPT-001245</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Consumo</span><span className="font-semibold text-foreground">15 m³</span></div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-border">
            <span className="font-bold text-foreground">Total a pagar</span>
            <span className="text-2xl font-bold text-primary tracking-tight">$150.00</span>
          </div>
        </div>

        <button onClick={() => navigate("/bill")} className="w-full bg-white border border-border rounded-2xl p-4 mb-6 flex items-center gap-3 text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-primary flex items-center justify-center"><ReceiptText size={20} /></div>
          <div className="flex-1"><p className="font-semibold">Ver detalle del recibo</p><p className="text-xs text-muted-foreground">Lectura, consumo y cálculo mostrado</p></div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </button>

        <h3 className="font-bold text-foreground mb-3">Selecciona una forma de pago</h3>

        <button onClick={() => navigate("/payment/card")} className="w-full bg-white border-2 border-primary/20 rounded-3xl p-5 mb-3 text-left shadow-sm active:scale-[0.99] transition-transform">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0"><CreditCard size={24} /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between"><p className="font-bold text-lg">Pago en línea</p><ChevronRight size={20} className="text-primary" /></div>
              <p className="text-sm text-muted-foreground mt-1">Paga con tarjeta de crédito o débito y recibe confirmación del banco.</p>
              <div className="flex items-center gap-1.5 text-xs text-green-700 mt-3"><ShieldCheck size={15} /> Verificación bancaria disponible</div>
            </div>
          </div>
        </button>

        <button onClick={() => navigate("/office-code")} className="w-full bg-white border border-border rounded-3xl p-5 text-left shadow-sm active:scale-[0.99] transition-transform">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-foreground flex items-center justify-center shrink-0"><Building2 size={24} /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between"><p className="font-bold text-lg">Pago en oficina</p><ChevronRight size={20} className="text-muted-foreground" /></div>
              <p className="text-sm text-muted-foreground mt-1">Genera tu código y preséntalo en caja para realizar el cobro.</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

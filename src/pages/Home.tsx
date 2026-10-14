import { useNavigate } from "react-router"
import {
  User,
  MapPin,
  Receipt,
  Droplet,
  ChevronRight,
  CreditCard,
  Building,
  CheckCircle2,
} from "lucide-react"
import { formatCurrency, getPaymentSession } from "../lib/payment"

export default function Home() {
  const navigate = useNavigate()
  const payment = getPaymentSession()
  const isPaid = payment?.status === "approved"

  return (
    <div className="h-full flex flex-col">
      <div className="bg-primary text-primary-foreground px-6 py-8 rounded-b-[32px] shadow-sm relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight">Hola, María</h1>
            <p className="text-primary-foreground/80 text-sm flex items-center gap-1.5">
              <User size={14} /> Cuenta SMM-001245
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="font-bold text-lg">MH</span>
          </div>
        </div>

        <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2 text-sm backdrop-blur-md border border-white/10">
          <MapPin size={16} className="text-secondary-foreground shrink-0" />
          <span className="truncate opacity-90">Calle Morelos 24, Centro</span>
        </div>
      </div>

      <div className="px-5 py-6 flex-1">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-foreground">Recibo actual</h2>
          <span className="text-xs font-semibold text-secondary px-2 py-1 bg-secondary/10 rounded-full">Septiembre 2026</span>
        </div>

        <div className={`bg-white rounded-3xl p-5 shadow-sm border mb-6 ${isPaid ? "border-green-200" : "border-border"}`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaid ? "bg-green-50 text-green-600" : "bg-blue-50 text-primary"}`}>
                {isPaid ? <CheckCircle2 size={20} /> : <Droplet size={20} />}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{isPaid ? "Estado del recibo" : "Consumo medido"}</p>
                <p className="font-bold text-foreground">{isPaid ? "Pagado" : "15 m³"}</p>
              </div>
            </div>
            {isPaid && <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full">Al corriente</span>}
          </div>

          <div className="border-t border-border border-dashed my-4"></div>

          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{isPaid ? "Importe pagado" : "Total a pagar"}</p>
              <p className="text-4xl font-bold text-foreground tracking-tight">$150<span className="text-lg text-muted-foreground font-semibold">.00</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground mb-1">{isPaid ? "Folio" : "Límite de pago"}</p>
              <p className="text-sm font-semibold text-foreground">{isPaid ? payment?.transactionId : "30 Sep 2026"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(isPaid ? "/receipt" : "/review")}
              className="bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform min-h-[44px]"
            >
              {isPaid ? <Receipt size={18} /> : <CreditCard size={18} />}
              {isPaid ? "Comprobante" : "Pagar"}
            </button>
            <button
              onClick={() => navigate("/bill")}
              className="bg-background text-primary border border-border font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform min-h-[44px]"
            >
              <Receipt size={18} /> Detalle
            </button>
          </div>
        </div>

        {!isPaid && (
          <>
            <h2 className="text-sm font-bold text-foreground mb-3 px-1">Formas de pago</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/review")}
                className="w-full bg-white p-4 rounded-2xl flex items-center border border-border shadow-sm active:scale-95 transition-transform min-h-[64px]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary mr-3"><CreditCard size={20} /></div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">Pagar en línea</p>
                  <p className="text-xs text-muted-foreground">Tarjeta de crédito o débito</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>

              <button
                onClick={() => navigate("/office-code")}
                className="w-full bg-white p-4 rounded-2xl flex items-center border border-border shadow-sm active:scale-95 transition-transform min-h-[64px]"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-foreground mr-3"><Building size={20} /></div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">Pagar en oficina</p>
                  <p className="text-xs text-muted-foreground">Genera código para caja</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            </div>
          </>
        )}

        {isPaid && (
          <button onClick={() => navigate("/history")} className="w-full bg-white p-4 rounded-2xl flex items-center border border-border shadow-sm min-h-[64px]">
            <div className="text-left flex-1">
              <p className="font-semibold">Ver recibos e historial</p>
              <p className="text-xs text-muted-foreground">Consulta pagos y comprobantes anteriores</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}

import { useNavigate } from "react-router"
import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck, User } from "lucide-react"
import { CURRENT_BILL, formatCurrency, getPaymentSession, maskCard } from "../lib/payment"

export default function PaymentConfirmation() {
  const navigate = useNavigate()
  const session = getPaymentSession()

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-background text-center">
        <div>
          <h1 className="text-xl font-bold mb-2">No hay un pago preparado</h1>
          <p className="text-muted-foreground mb-6">Captura los datos de la tarjeta para continuar.</p>
          <button onClick={() => navigate("/payment/card")} className="bg-primary text-white px-5 py-3 rounded-xl font-semibold">Ir al pago</button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate("/payment/card")} className="p-2 -ml-2 rounded-full hover:bg-slate-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2">
          <h1 className="font-bold text-lg">Confirma el cargo</h1>
          <p className="text-xs text-muted-foreground">Paso final antes de autorizar</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-foreground mb-2">Todo listo para pagar</h2>
          <p className="text-sm text-muted-foreground">Verifica el importe, la cuenta y la tarjeta antes de enviar la solicitud al banco.</p>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 shadow-sm mb-5">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-primary flex items-center justify-center"><User size={20} /></div>
            <div>
              <p className="font-bold">{CURRENT_BILL.holder}</p>
              <p className="text-xs text-muted-foreground">Cuenta {CURRENT_BILL.account}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Periodo</span><span className="font-semibold text-right">{CURRENT_BILL.period}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Recibo</span><span className="font-semibold">{CURRENT_BILL.receipt}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Correo</span><span className="font-semibold text-right truncate max-w-[200px]">{session.email}</span></div>
          </div>

          <div className="mt-5 bg-primary text-white rounded-2xl p-5">
            <p className="text-xs text-white/70 mb-1">Total del cargo</p>
            <p className="text-3xl font-bold">{formatCurrency(CURRENT_BILL.amount)}</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 shadow-sm mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-primary"><CreditCard size={22} /></div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Método de pago</p>
              <p className="font-bold">{maskCard(session)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Titular: {session.cardholder}</p>
            </div>
            <button onClick={() => navigate("/payment/card")} className="text-xs font-semibold text-primary">Cambiar</button>
          </div>
        </div>

        <div className="flex gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
          <ShieldCheck size={22} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Autorización segura</p>
            <p className="text-xs text-green-700 mt-1">Tu banco puede solicitar una verificación adicional 3‑D Secure antes de aprobar el cargo.</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-border">
        <button onClick={() => navigate("/payment/auth")} className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-lg shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[56px]">
          <LockKeyhole size={20} /> Pagar {formatCurrency(CURRENT_BILL.amount)}
        </button>
        <p className="text-[11px] text-center text-muted-foreground mt-2">No cierres la ventana durante la autorización.</p>
      </div>
    </div>
  )
}

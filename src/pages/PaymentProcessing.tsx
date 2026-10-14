import { useEffect } from "react"
import { useNavigate } from "react-router"
import { CreditCard, Loader2, ShieldCheck } from "lucide-react"
import { completeApprovedPayment, getPaymentSession, updatePaymentSession } from "../lib/payment"

export default function PaymentProcessing() {
  const navigate = useNavigate()

  useEffect(() => {
    const session = getPaymentSession()
    if (!session) {
      navigate("/payment/card", { replace: true })
      return
    }

    updatePaymentSession({ status: "processing" })

    const timer = window.setTimeout(() => {
      const current = getPaymentSession()
      if (!current) {
        navigate("/payment/card", { replace: true })
        return
      }

      switch (current.demoResult) {
        case "declined":
          updatePaymentSession({ status: "declined" })
          navigate("/payment/declined", { replace: true })
          break
        case "pending":
          updatePaymentSession({ status: "pending" })
          navigate("/pending", { replace: true })
          break
        case "unknown":
          updatePaymentSession({ status: "unknown" })
          navigate("/unknown", { replace: true })
          break
        default:
          completeApprovedPayment()
          navigate("/success", { replace: true })
      }
    }, 1900)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background p-8 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-primary">
          <CreditCard size={40} />
        </div>
        <div className="absolute -right-2 -bottom-2 w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-primary">
          <Loader2 size={22} className="animate-spin" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Procesando tu pago</h1>
      <p className="text-muted-foreground text-base max-w-xs">Estamos esperando la confirmación del banco. Este proceso puede tardar unos segundos.</p>
      <div className="mt-8 bg-white border border-border rounded-2xl p-4 flex items-center gap-3 text-left max-w-sm">
        <ShieldCheck size={22} className="text-green-600 shrink-0" />
        <p className="text-xs text-muted-foreground"><strong className="text-foreground">No cierres ni actualices esta pantalla.</strong> Evita iniciar otro pago mientras recibimos el resultado.</p>
      </div>
    </div>
  )
}

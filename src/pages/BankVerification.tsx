import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, Building2, LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react"
import { getPaymentSession, maskCard, onlyDigits, updatePaymentSession } from "../lib/payment"

export default function BankVerification() {
  const navigate = useNavigate()
  const session = getPaymentSession()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [seconds, setSeconds] = useState(45)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-background text-center">
        <button onClick={() => navigate("/payment/card")} className="bg-primary text-white px-5 py-3 rounded-xl font-semibold">Reiniciar pago</button>
      </div>
    )
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setError("Ingresa el código de 6 dígitos enviado por el banco.")
      return
    }
    updatePaymentSession({ status: "processing" })
    navigate("/payment/processing")
  }

  function resend() {
    setSeconds(45)
    setCode("")
    setError("")
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border">
        <button onClick={() => navigate("/payment/confirm")} className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2">
          <h1 className="font-bold text-lg">Verificación bancaria</h1>
          <p className="text-xs text-muted-foreground">3‑D Secure</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col justify-center">
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-5"><Building2 size={28} /></div>
          <h2 className="text-2xl font-bold mb-2">Confirma que eres tú</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            El banco emisor solicitó una autenticación adicional para {maskCard(session)}. Ingresa el código temporal enviado al medio registrado con tu banco.
          </p>

          <div className="bg-slate-50 border border-border rounded-2xl p-4 flex gap-3 mb-6">
            <MessageSquareText size={20} className="text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">En una integración real, esta pantalla pertenece al banco/proveedor. Agua Santa María no recibe ni almacena el código de autenticación bancaria.</p>
          </div>

          <form onSubmit={submit}>
            <label className="block text-sm font-semibold mb-2" htmlFor="otp">Código de verificación</label>
            <div className="relative">
              <LockKeyhole size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="otp"
                value={code}
                onChange={(e) => { setCode(onlyDigits(e.target.value).slice(0, 6)); setError("") }}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className={`w-full h-14 pl-12 pr-4 rounded-xl border bg-white text-center tracking-[0.35em] text-xl font-bold outline-none focus:ring-2 focus:ring-primary/20 ${error ? "border-rose-400" : "border-border focus:border-primary"}`}
              />
            </div>
            {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}

            <button type="button" disabled={seconds > 0} onClick={resend} className="w-full text-sm font-semibold text-primary disabled:text-muted-foreground py-3 mt-2">
              {seconds > 0 ? `Solicitar otro código en ${seconds}s` : "Solicitar otro código"}
            </button>

            <button type="submit" className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-lg shadow-sm active:scale-[0.98] transition-transform min-h-[56px] mt-2">
              Autorizar pago
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-5">
          <ShieldCheck size={16} /> Conexión de autenticación protegida
        </div>
      </div>
    </div>
  )
}

import { FormEvent, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  CreditCard,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Info,
} from "lucide-react"
import {
  cardBrandLabel,
  createPaymentSession,
  detectCardBrand,
  formatCardNumber,
  formatCurrency,
  formatExpiry,
  onlyDigits,
  setDemoResult,
  type DemoResult,
  type PaymentCardForm,
  validateCardForm,
  CURRENT_BILL,
} from "../lib/payment"

const emptyForm: PaymentCardForm = {
  cardholder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  email: "maria.hernandez@email.com",
  postalCode: "",
  acceptTerms: false,
}

export default function OnlinePayment() {
  const navigate = useNavigate()
  const [form, setForm] = useState<PaymentCardForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentCardForm, string>>>({})
  const [showPrototypeOptions, setShowPrototypeOptions] = useState(false)
  const [demoResult, setPrototypeResult] = useState<DemoResult>("approved")

  const brand = useMemo(() => detectCardBrand(form.cardNumber), [form.cardNumber])

  function updateField<K extends keyof PaymentCardForm>(key: K, value: PaymentCardForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateCardForm(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setDemoResult(demoResult)
    createPaymentSession(form)
    navigate("/payment/confirm")
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border sticky top-0 z-20">
        <button
          onClick={() => navigate("/review")}
          className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2">
          <h1 className="font-bold text-lg">Pago en línea</h1>
          <p className="text-xs text-muted-foreground">Datos de la tarjeta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-5 pb-8">
        <div className="bg-white border border-border rounded-3xl p-5 shadow-sm mb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recibo</p>
              <p className="font-bold text-foreground mt-1">{CURRENT_BILL.period}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{CURRENT_BILL.receipt}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(CURRENT_BILL.amount)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
          <ShieldCheck size={22} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Captura segura</p>
            <p className="text-xs text-muted-foreground mt-1">
              El prototipo valida los datos en el dispositivo y no conserva el número completo de tarjeta ni el CVV. En producción estos campos deben tokenizarse con un proveedor de pagos certificado.
            </p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="cardholder">
              Nombre del titular
            </label>
            <input
              id="cardholder"
              value={form.cardholder}
              onChange={(e) => updateField("cardholder", e.target.value)}
              autoComplete="cc-name"
              placeholder="MARÍA HERNÁNDEZ"
              className={`w-full h-12 px-4 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary/20 ${errors.cardholder ? "border-rose-400" : "border-border focus:border-primary"}`}
            />
            {errors.cardholder && <p className="text-xs text-rose-600 mt-1.5">{errors.cardholder}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-foreground" htmlFor="cardNumber">Número de tarjeta</label>
              <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-1 rounded-full">{cardBrandLabel(brand)}</span>
            </div>
            <div className="relative">
              <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="cardNumber"
                value={form.cardNumber}
                onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white outline-none tracking-wide focus:ring-2 focus:ring-primary/20 ${errors.cardNumber ? "border-rose-400" : "border-border focus:border-primary"}`}
              />
            </div>
            {errors.cardNumber && <p className="text-xs text-rose-600 mt-1.5">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="expiry">Vencimiento</label>
              <input
                id="expiry"
                value={form.expiry}
                onChange={(e) => updateField("expiry", formatExpiry(e.target.value))}
                autoComplete="cc-exp"
                inputMode="numeric"
                placeholder="MM/AA"
                className={`w-full h-12 px-4 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary/20 ${errors.expiry ? "border-rose-400" : "border-border focus:border-primary"}`}
              />
              {errors.expiry && <p className="text-xs text-rose-600 mt-1.5">{errors.expiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="cvv">CVV</label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="cvv"
                  value={form.cvv}
                  onChange={(e) => updateField("cvv", onlyDigits(e.target.value).slice(0, brand === "amex" ? 4 : 3))}
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  type="password"
                  placeholder={brand === "amex" ? "0000" : "000"}
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary/20 ${errors.cvv ? "border-rose-400" : "border-border focus:border-primary"}`}
                />
              </div>
              {errors.cvv && <p className="text-xs text-rose-600 mt-1.5">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="email">Correo para comprobante</label>
            <div className="relative">
              <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="correo@ejemplo.com"
                className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-rose-400" : "border-border focus:border-primary"}`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="postalCode">Código postal de facturación</label>
            <div className="relative">
              <MapPin size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", onlyDigits(e.target.value).slice(0, 5))}
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="00000"
                className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary/20 ${errors.postalCode ? "border-rose-400" : "border-border focus:border-primary"}`}
              />
            </div>
            {errors.postalCode && <p className="text-xs text-rose-600 mt-1.5">{errors.postalCode}</p>}
          </div>

          <label className="flex items-start gap-3 cursor-pointer bg-slate-50 rounded-2xl p-4 border border-border">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => updateField("acceptTerms", e.target.checked)}
              className="mt-1 w-4 h-4 accent-[var(--color-primary)]"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              Autorizo un cargo único por <strong className="text-foreground">{formatCurrency(CURRENT_BILL.amount)}</strong> para liquidar el recibo {CURRENT_BILL.receipt}. No se guardará el CVV ni el número completo de la tarjeta.
            </span>
          </label>
          {errors.acceptTerms && <p className="text-xs text-rose-600 -mt-3">{errors.acceptTerms}</p>}
        </div>

        <button
          type="button"
          onClick={() => setShowPrototypeOptions((value) => !value)}
          className="mt-4 w-full text-xs text-muted-foreground flex items-center justify-center gap-1.5 py-2"
        >
          <Info size={14} /> Opciones del prototipo
        </button>

        {showPrototypeOptions && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Resultado que devolvería el proveedor</p>
            <select
              value={demoResult}
              onChange={(e) => setPrototypeResult(e.target.value as DemoResult)}
              className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm"
            >
              <option value="approved">Aprobado</option>
              <option value="pending">Pendiente de confirmación</option>
              <option value="declined">Rechazado por el banco</option>
              <option value="unknown">Resultado no confirmado</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-2">Este selector sólo existe para demostrar escenarios. En producción el resultado llega del proveedor mediante API/webhook.</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl text-base shadow-sm active:scale-[0.98] transition-transform min-h-[56px] mt-3"
        >
          Revisar y continuar
        </button>
      </form>
    </div>
  )
}

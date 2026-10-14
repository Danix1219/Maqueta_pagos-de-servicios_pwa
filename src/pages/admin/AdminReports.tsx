import { useMemo, useState } from "react"
import { CheckCircle2, Download, FileSpreadsheet, Printer, ReceiptText, RotateCcw } from "lucide-react"
import { formatAdminDate, formatMoney, getAdminState, PaymentMethod } from "../../lib/adminState"

export default function AdminReports() {
  const admin = getAdminState()
  const [method, setMethod] = useState<"all" | PaymentMethod>("all")
  const [period, setPeriod] = useState("Septiembre 2026")
  const [exported, setExported] = useState(false)
  const payments = useMemo(() => admin.payments.filter((payment) => payment.period === period && (method === "all" || payment.method === method)), [admin.payments, method, period])
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const cash = payments.filter((p) => p.method === "cash").reduce((sum, p) => sum + p.amount, 0)
  const digital = total - cash
  const paymentMethodLabel: Record<PaymentMethod, string> = { cash: "Efectivo", terminal: "Terminal bancaria", online: "Pago en línea" }

  function exportCsv() {
    const rows = [
      ["Folio", "Cuenta", "Titular", "Periodo", "Método", "Importe", "Fecha", "Operador", "Punto de cobro"],
      ...payments.map((p) => [p.folio, p.accountId, p.holder, p.period, paymentMethodLabel[p.method], p.amount.toFixed(2), p.createdAt, p.cashier, p.desk]),
    ]
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n")
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `recaudacion-${period.toLowerCase().replace(/\s+/g, "-")}-${method}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    setExported(true)
    window.setTimeout(() => setExported(false), 3000)
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div><p className="text-sm font-bold text-primary mb-1">Analítica operativa</p><h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Reportes de recaudación</h2><p className="text-muted-foreground mt-1">Sólo pagos confirmados; operaciones pendientes no se contabilizan.</p></div>
        <div className="flex gap-2"><button onClick={() => window.print()} className="px-4 py-2.5 rounded-xl border border-border bg-white font-bold flex items-center gap-2"><Printer size={17} /> Imprimir</button><button onClick={exportCsv} disabled={!payments.length} className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2 disabled:opacity-50"><Download size={17} /> Exportar CSV</button></div>
      </div>

      {exported && <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={18} /> El reporte se descargó correctamente.</div>}

      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-end">
        <label className="flex-1"><span className="block text-xs font-bold text-slate-500 mb-1.5">Periodo</span><select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5"><option>Septiembre 2026</option><option>Agosto 2026</option></select></label>
        <label className="flex-1"><span className="block text-xs font-bold text-slate-500 mb-1.5">Método de pago</span><select value={method} onChange={(e) => setMethod(e.target.value as "all" | PaymentMethod)} className="w-full border border-border rounded-xl px-3 py-2.5"><option value="all">Todos los métodos</option><option value="cash">Efectivo</option><option value="terminal">Terminal bancaria</option><option value="online">Pago en línea</option></select></label>
        <button onClick={() => { setMethod("all"); setPeriod("Septiembre 2026") }} className="px-4 py-2.5 rounded-xl border border-border font-bold flex items-center gap-2"><RotateCcw size={16} /> Limpiar</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm"><p className="text-sm text-muted-foreground font-semibold">Total confirmado</p><p className="text-3xl font-extrabold mt-2 text-slate-900">{formatMoney(total)}</p><p className="text-xs text-muted-foreground mt-2">{payments.length} operaciones visibles</p></div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm"><p className="text-sm text-muted-foreground font-semibold">Efectivo</p><p className="text-3xl font-extrabold mt-2 text-secondary">{formatMoney(cash)}</p><p className="text-xs text-muted-foreground mt-2">Excluye pagos en línea</p></div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm"><p className="text-sm text-muted-foreground font-semibold">Digital / terminal</p><p className="text-3xl font-extrabold mt-2 text-primary">{formatMoney(digital)}</p><p className="text-xs text-muted-foreground mt-2">Terminal y portal del Habitante</p></div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between"><div><h3 className="font-extrabold">Detalle de operaciones</h3><p className="text-sm text-muted-foreground">{period} · {method === "all" ? "Todos los métodos" : method === "cash" ? "Efectivo" : method === "terminal" ? "Terminal" : "En línea"}</p></div><FileSpreadsheet size={22} className="text-primary" /></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-slate-50 border-b border-border text-xs uppercase tracking-wider text-slate-400"><tr><th className="p-4 text-left">Folio</th><th className="p-4 text-left">Cuenta / titular</th><th className="p-4 text-left">Método</th><th className="p-4 text-left">Fecha</th><th className="p-4 text-right">Importe</th></tr></thead><tbody className="divide-y divide-border">{payments.map((payment) => <tr key={payment.folio} className="hover:bg-slate-50"><td className="p-4 font-bold text-primary">{payment.folio}</td><td className="p-4"><p className="font-bold">{payment.accountId}</p><p className="text-xs text-muted-foreground">{payment.holder}</p></td><td className="p-4"><span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">{payment.method === "cash" ? "Efectivo" : payment.method === "terminal" ? "Terminal" : "En línea"}</span></td><td className="p-4 text-muted-foreground">{formatAdminDate(payment.createdAt)}</td><td className="p-4 text-right font-extrabold">{formatMoney(payment.amount)}</td></tr>)}</tbody></table></div>
        {!payments.length && <div className="py-16 text-center text-muted-foreground"><ReceiptText size={32} className="mx-auto mb-3 opacity-50" /><p className="font-bold">No hay operaciones para los filtros seleccionados.</p></div>}
      </div>
    </div>
  )
}

import { useMemo } from "react"
import { useNavigate } from "react-router"
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  FileSearch,
  Route,
  TrendingUp,
  Users,
  WifiOff,
} from "lucide-react"
import { formatAdminDate, formatMoney, getAdminState } from "../../lib/adminState"
import { getFieldState, getRouteStats } from "../../lib/fieldState"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const admin = getAdminState()
  const field = getFieldState()
  const fieldStats = getRouteStats(field)
  const period = "Septiembre 2026"

  const summary = useMemo(() => {
    const payments = admin.payments.filter((payment) => payment.period === period)
    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const pendingBills = admin.accounts.flatMap((account) => account.bills).filter((bill) => bill.period === period && bill.status === "pending")
    const outstanding = pendingBills.reduce((sum, bill) => sum + bill.amount, 0)
    const openCases = field.homes.filter((home) => ["incident", "review", "absent"].includes(home.status)).length
    const pendingSync = field.syncQueue.filter((item) => item.status === "pending").length
    const cash = payments.filter((payment) => payment.method === "cash").reduce((sum, payment) => sum + payment.amount, 0)
    const terminal = payments.filter((payment) => payment.method === "terminal").reduce((sum, payment) => sum + payment.amount, 0)
    const online = payments.filter((payment) => payment.method === "online").reduce((sum, payment) => sum + payment.amount, 0)
    return { payments, revenue, pendingBills, outstanding, openCases, pendingSync, cash, terminal, online }
  }, [admin.accounts, admin.payments, field.homes, field.syncQueue])

  const accountGroups = [
    { label: "Al corriente", value: admin.accounts.filter((account) => account.status === "current").length, color: "bg-emerald-500" },
    { label: "Con adeudo", value: admin.accounts.filter((account) => account.status === "debt").length, color: "bg-amber-500" },
    { label: "En revisión", value: admin.accounts.filter((account) => account.status === "review").length, color: "bg-rose-500" },
    { label: "Inactivas", value: admin.accounts.filter((account) => account.status === "inactive").length, color: "bg-slate-400" },
  ]

  const metrics = [
    {
      label: "Recaudado en el periodo",
      value: formatMoney(summary.revenue),
      helper: `${summary.payments.length} pagos confirmados`,
      icon: TrendingUp,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Cartera por cobrar",
      value: formatMoney(summary.outstanding),
      helper: `${summary.pendingBills.length} recibos pendientes`,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Atención requerida",
      value: String(summary.openCases),
      helper: "Incidencias, revisiones y ausencias",
      icon: AlertTriangle,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: "Avance de campo",
      value: `${fieldStats.progress}%`,
      helper: `${fieldStats.resolved} de ${field.homes.length} visitas atendidas`,
      icon: Route,
      tone: "bg-blue-50 text-blue-700",
    },
  ]

  const maxChannel = Math.max(summary.cash, summary.terminal, summary.online, 1)
  const channels = [
    { label: "Efectivo", value: summary.cash, icon: Banknote, color: "bg-emerald-500" },
    { label: "Terminal", value: summary.terminal, icon: CreditCard, color: "bg-sky-600" },
    { label: "Portal en línea", value: summary.online, icon: FileSearch, color: "bg-indigo-500" },
  ]

  return (
    <div className="space-y-6 pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-sm font-bold text-primary">Periodo activo · {period}</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Panorama operativo</h2>
          <p className="mt-1 text-muted-foreground">Estado de cuentas, recaudación y trabajo de campo.</p>
        </div>
        <button onClick={() => navigate("/admin/operation")} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white shadow-sm hover:bg-sky-800">
          <Route size={18} /> Gestionar operación
        </button>
      </div>

      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, helper, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 truncate text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{helper}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="admin-attention-title">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 id="admin-attention-title" className="font-extrabold text-slate-900">Pendientes de gestión</h3>
              <p className="text-sm text-muted-foreground">Situaciones que requieren una decisión administrativa.</p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{summary.openCases + (summary.pendingSync ? 1 : 0)} pendientes</span>
          </div>
          <div className="divide-y divide-border">
            <button onClick={() => navigate("/admin/incidents")} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><AlertTriangle size={19} /></div>
              <div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{summary.openCases} casos de campo abiertos</p><p className="mt-0.5 text-xs text-muted-foreground">Revisar antes de emitir adeudos o cerrar visitas.</p></div>
              <ArrowRight size={17} className="text-slate-400" />
            </button>
            <button onClick={() => navigate("/admin/operation")} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ClipboardList size={19} /></div>
              <div className="min-w-0 flex-1"><p className="font-bold text-slate-900">Ruta {field.route.id} · {fieldStats.progress}%</p><p className="mt-0.5 text-xs text-muted-foreground">{fieldStats.pending} domicilios todavía están pendientes.</p></div>
              <ArrowRight size={17} className="text-slate-400" />
            </button>
            {summary.pendingSync > 0 && (
              <button onClick={() => navigate("/admin/operation")} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><WifiOff size={19} /></div>
                <div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{summary.pendingSync} registros sin sincronizar</p><p className="mt-0.5 text-xs text-muted-foreground">El dispositivo de campo aún no confirma el envío.</p></div>
                <ArrowRight size={17} className="text-slate-400" />
              </button>
            )}
            {!summary.openCases && !summary.pendingSync && !fieldStats.pending && (
              <div className="flex items-center gap-3 p-5 text-sm text-emerald-700"><CheckCircle2 size={20} /> No hay acciones urgentes en este momento.</div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm" aria-labelledby="account-health-title">
          <div className="flex items-start justify-between gap-3">
            <div><h3 id="account-health-title" className="font-extrabold text-slate-900">Estado del padrón</h3><p className="text-sm text-muted-foreground">{admin.accounts.length} cuentas registradas</p></div>
            <Users size={21} className="text-primary" />
          </div>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {accountGroups.map((group) => <span key={group.label} className={group.color} style={{ width: `${admin.accounts.length ? (group.value / admin.accounts.length) * 100 : 0}%` }} />)}
          </div>
          <div className="mt-5 space-y-3">
            {accountGroups.map((group) => (
              <div key={group.label} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${group.color}`} />{group.label}</span><strong className="tabular-nums">{group.value}</strong></div>
            ))}
          </div>
          <button onClick={() => navigate("/admin/accounts")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-bold text-primary hover:bg-slate-50">Consultar cuentas <ArrowRight size={16} /></button>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm" aria-labelledby="channel-title">
          <div><h3 id="channel-title" className="font-extrabold text-slate-900">Recaudación por canal</h3><p className="text-sm text-muted-foreground">Pagos confirmados del periodo</p></div>
          <div className="mt-5 space-y-4">
            {channels.map(({ label, value, icon: Icon, color }) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 font-semibold text-slate-600"><Icon size={16} />{label}</span><strong className="tabular-nums">{formatMoney(value)}</strong></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${(value / maxChannel) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/admin/reports")} className="mt-5 text-sm font-bold text-primary">Abrir reporte detallado</button>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="recent-payments-title">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div><h3 id="recent-payments-title" className="font-extrabold text-slate-900">Actividad reciente</h3><p className="text-sm text-muted-foreground">Últimos pagos confirmados por Caja y portal.</p></div>
            <button onClick={() => navigate("/admin/reports")} className="text-sm font-bold text-primary">Ver todo</button>
          </div>
          <div className="divide-y divide-border">
            {admin.payments.slice(0, 5).map((payment) => (
              <div key={payment.folio} className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={19} /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{payment.holder}</p><p className="mt-0.5 text-xs text-muted-foreground">{payment.folio} · {formatAdminDate(payment.createdAt)}</p></div>
                <div className="text-right"><p className="font-extrabold tabular-nums">{formatMoney(payment.amount)}</p><p className="text-xs text-muted-foreground">{payment.method === "cash" ? "Efectivo" : payment.method === "terminal" ? "Terminal" : "Portal"}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

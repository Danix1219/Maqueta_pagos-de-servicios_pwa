import { useMemo, useState } from "react"
import {
  Check,
  Copy,
  Mail,
  MapPin,
  Plus,
  Receipt,
  Search,
  User,
  X,
  Gauge,
  KeyRound,
  Phone,
} from "lucide-react"
import {
  AdminAccount,
  createAccount,
  formatMoney,
  getAdminState,
  statusLabel,
} from "../../lib/adminState"

const statusStyle: Record<AdminAccount["status"], string> = {
  current: "bg-emerald-50 text-emerald-700 border-emerald-200",
  debt: "bg-amber-50 text-amber-700 border-amber-200",
  review: "bg-rose-50 text-rose-700 border-rose-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
}

export default function AdminAccounts() {
  const [version, setVersion] = useState(0)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | AdminAccount["status"]>("all")
  const [selected, setSelected] = useState<AdminAccount | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [created, setCreated] = useState<AdminAccount | null>(null)
  const [createError, setCreateError] = useState("")
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ id: "SMM-001348", name: "", address: "", zone: "Centro", phone: "", email: "", takeId: "T-001348", meterId: "M-0348", activationCode: "ASM-3482" })
  const state = getAdminState()

  const accounts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return state.accounts.filter((account) => {
      const matches = !q || [account.id, account.name, account.address, account.takeId, account.meterId].some((item) => item.toLowerCase().includes(q))
      return matches && (filter === "all" || account.status === filter)
    })
  }, [state.accounts, search, filter, version])

  const pendingTotal = (account: AdminAccount) => account.bills.filter((bill) => bill.status === "pending").reduce((sum, bill) => sum + bill.amount, 0)

  function handleCreate() {
    setCreateError("")
    if (!/^SMM-\d{6}$/.test(form.id.trim())) return setCreateError("Usa el formato SMM-000000 para la cuenta.")
    if (form.name.trim().split(/\s+/).length < 2) return setCreateError("Captura nombre y apellidos del titular.")
    if (!form.address.trim() || !form.phone.trim() || !form.email.includes("@")) return setCreateError("Completa domicilio, teléfono y correo válidos.")
    if (!/^T-\d{6}$/.test(form.takeId.trim().toUpperCase())) return setCreateError("Usa el formato T-000000 para el número de toma.")
    if (!/^M-\d{4}$/.test(form.meterId.trim().toUpperCase())) return setCreateError("Usa el formato M-0000 para el medidor.")
    if (!/^ASM-\d{4}$/.test(form.activationCode.trim().toUpperCase())) return setCreateError("Usa el formato ASM-0000 para el código de activación.")
    const result = createAccount({
      ...form,
      id: form.id.trim().toUpperCase(),
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      takeId: form.takeId.trim().toUpperCase(),
      meterId: form.meterId.trim().toUpperCase(),
      activationCode: form.activationCode.trim().toUpperCase(),
    })
    if (!result.ok) {
      const labels = { account: "La cuenta", take: "La toma", meter: "El medidor", activation: "El código de activación" }
      return setCreateError(`${labels[result.field]} ya está asociado a ${result.account.id} · ${result.account.name}.`)
    }
    setCreated(result.account)
    setVersion((value) => value + 1)
  }

  function closeCreate() {
    setShowCreate(false)
    setCreated(null)
    setCreateError("")
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary mb-1">Padrón de usuarios</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Cuentas del servicio</h2>
          <p className="text-muted-foreground mt-1">Consulta titular, toma, medidor, adeudos y activación.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-primary text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"><Plus size={18} /> Nueva cuenta</button>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between bg-slate-50/60">
          <div className="relative flex-1 max-w-xl">
            <label htmlFor="admin-account-search" className="sr-only">Buscar cuenta</label>
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input id="admin-account-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cuenta, titular, domicilio, toma o medidor..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "current", "debt", "review", "inactive"] as const).map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${filter === item ? "bg-primary text-white border-primary" : "bg-white border-border text-slate-600 hover:bg-slate-50"}`}>
                {item === "all" ? "Todas" : item === "current" ? "Al corriente" : item === "debt" ? "Con adeudo" : item === "review" ? "En revisión" : "Inactivas"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white border-b border-border text-left">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Cuenta</th><th className="px-5 py-3">Titular</th><th className="px-5 py-3">Servicio</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 text-right">Saldo</th><th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-bold text-primary">{account.id}</td>
                  <td className="px-5 py-4"><p className="font-bold text-slate-800">{account.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={12} /> {account.address}</p></td>
                  <td className="px-5 py-4"><p className="font-semibold">{account.takeId}</p><p className="text-xs text-muted-foreground">Medidor {account.meterId}</p></td>
                  <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-bold ${statusStyle[account.status]}`}>{statusLabel(account.status)}</span></td>
                  <td className="px-5 py-4 text-right font-extrabold">{formatMoney(pendingTotal(account))}</td>
                  <td className="px-5 py-4 text-right"><button onClick={() => setSelected(account)} className="text-primary font-bold hover:underline">Ver detalle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!accounts.length && <div className="py-16 text-center text-muted-foreground">No encontramos cuentas con esos criterios.</div>}
        </div>
        <div className="p-4 border-t border-border flex justify-between text-xs text-muted-foreground"><span>Mostrando {accounts.length} resultados</span><span>{state.accounts.length} cuentas registradas</span></div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <button className="absolute inset-0 bg-slate-950/45" onClick={() => setSelected(null)} aria-label="Cerrar detalle" />
          <aside role="dialog" aria-modal="true" aria-labelledby="account-detail-title" className="relative w-full max-w-[520px] h-full bg-[#f7f9fb] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-border p-5 flex items-center justify-between"><div><p className="text-xs font-bold text-primary">{selected.id}</p><h3 id="account-detail-title" className="text-xl font-extrabold">Detalle de cuenta</h3></div><button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100" aria-label="Cerrar detalle"><X size={20} /></button></div>
            <div className="p-5 space-y-4">
              <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center"><User size={22} /></div><div><h4 className="font-extrabold text-lg">{selected.name}</h4><p className="text-sm text-muted-foreground">{selected.address}</p></div></div>
                <div className="grid grid-cols-2 gap-3 mt-5 text-sm"><div className="bg-slate-50 p-3 rounded-xl"><span className="text-xs text-muted-foreground">Toma</span><p className="font-bold">{selected.takeId}</p></div><div className="bg-slate-50 p-3 rounded-xl"><span className="text-xs text-muted-foreground">Medidor</span><p className="font-bold">{selected.meterId}</p></div></div>
                <div className="mt-4 space-y-2 text-sm"><p className="flex items-center gap-2"><Phone size={15} className="text-slate-400" /> {selected.phone}</p><p className="flex items-center gap-2"><Mail size={15} className="text-slate-400" /> {selected.email}</p></div>
              </div>

              <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3"><div><p className="text-xs text-muted-foreground font-semibold">Código de activación</p><p className="font-mono text-xl font-extrabold tracking-widest mt-1">{selected.activationCode}</p></div><button onClick={() => { navigator.clipboard?.writeText(selected.activationCode); setCopied(true); setTimeout(() => setCopied(false), 1600) }} className="p-2.5 rounded-xl border border-border hover:bg-slate-50 text-primary" aria-label={copied ? "Código copiado" : "Copiar código de activación"}>{copied ? <Check size={18} /> : <Copy size={18} />}</button></div>
                <p className="text-xs text-muted-foreground">Se entrega al titular para vincular su cuenta desde la PWA.</p>
              </div>

              <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border"><h4 className="font-extrabold">Recibos y pagos</h4></div>
                <div className="divide-y divide-border">
                  {selected.bills.map((bill) => <div key={bill.id} className="p-4 flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><Receipt size={17} /></div><div className="flex-1"><p className="font-bold text-sm">{bill.period}</p><p className="text-xs text-muted-foreground">{bill.status === "paid" ? `Pagado · ${bill.paymentFolio}` : bill.status === "review" ? "En revisión · sin adeudo emitido" : `Vence ${bill.dueDate}`}</p></div><span className="font-extrabold">{bill.status === "review" ? "—" : formatMoney(bill.amount)}</span></div>)}
                  {!selected.bills.length && <div className="p-5 text-sm text-muted-foreground">La cuenta todavía no tiene recibos registrados.</div>}
                </div>
              </div>

              {selected.bills.some((bill) => bill.status === "pending") && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="font-bold">La cuenta tiene recibos pendientes</p>
                  <p className="mt-1 leading-5">El cobro se realiza exclusivamente desde la sesión de Caja. Administración conserva acceso de consulta y seguimiento.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-[130] bg-slate-950/55 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="new-account-title" className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10"><div><p className="text-xs font-bold text-primary">Alta de servicio</p><h3 id="new-account-title" className="text-xl font-extrabold">Nueva cuenta</h3></div><button onClick={closeCreate} className="p-2 rounded-xl hover:bg-slate-100" aria-label="Cerrar formulario"><X size={20} /></button></div>
            {created ? (
              <div className="p-8 text-center"><div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4"><Check size={30} /></div><h3 className="text-2xl font-extrabold">Cuenta creada</h3><p className="text-muted-foreground mt-2">{created.name} · {created.id}</p><div className="mt-6 bg-slate-50 border border-border rounded-2xl p-5 max-w-sm mx-auto"><p className="text-xs font-semibold text-muted-foreground">Código para activar la PWA</p><p className="font-mono font-extrabold text-2xl tracking-widest mt-2">{created.activationCode}</p></div><button onClick={closeCreate} className="mt-7 bg-primary text-white px-6 py-3 rounded-xl font-bold">Finalizar</button></div>
            ) : (
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[{ key: "id", label: "Número de cuenta" }, { key: "name", label: "Titular" }, { key: "address", label: "Domicilio" }, { key: "zone", label: "Sector" }, { key: "phone", label: "Teléfono" }, { key: "email", label: "Correo" }, { key: "takeId", label: "Número de toma" }, { key: "meterId", label: "Medidor" }, { key: "activationCode", label: "Código de activación" }].map(({ key, label }) => <label key={key} className={key === "address" ? "md:col-span-2" : ""}><span className="block text-sm font-bold mb-1.5">{label}</span><input value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3.5 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></label>)}
                </div>
                {createError && <div role="alert" className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-semibold">{createError}</div>}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex gap-3"><KeyRound size={18} className="shrink-0 mt-0.5" /><p>La cuenta se crea sin adeudos. El código de activación permite al titular vincularla desde la PWA; la toma y el medidor deben ser únicos.</p></div>
                <div className="flex justify-end gap-2 mt-6"><button onClick={closeCreate} className="px-4 py-2.5 rounded-xl border border-border font-bold">Cancelar</button><button onClick={handleCreate} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold">Crear cuenta</button></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

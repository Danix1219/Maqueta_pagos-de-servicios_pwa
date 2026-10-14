import { Navigate, Outlet, useLocation, useNavigate } from "react-router"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Droplets,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  RadioTower,
  Route,
  Users,
} from "lucide-react"
import { useState } from "react"
import { clearStaffSession, getStaffSession } from "../../lib/staffAuth"
import { getFieldState } from "../../lib/fieldState"

const adminNavGroups = [
  { label: "Resumen", items: [{ id: "dashboard", label: "Inicio", icon: LayoutDashboard, path: "/admin/dashboard" }] },
  { label: "Gestión", items: [
    { id: "accounts", label: "Cuentas", icon: Users, path: "/admin/accounts" },
    { id: "operation", label: "Operación de campo", icon: Route, path: "/admin/operation" },
    { id: "tracking", label: "Monitoreo en vivo", icon: RadioTower, path: "/admin/tracking" },
  ] },
  { label: "Control", items: [
    { id: "incidents", label: "Incidencias", icon: AlertTriangle, path: "/admin/incidents" },
    { id: "reports", label: "Reportes", icon: BarChart3, path: "/admin/reports" },
  ] },
]

const adminNavItems = adminNavGroups.flatMap((group) => group.items)

const cashierNavItems = [
  { id: "pos", label: "Cobros", icon: Receipt, path: "/cashier/pos" },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenu, setMobileMenu] = useState(false)
  const session = getStaffSession()
  const cashierArea = location.pathname.startsWith("/cashier")

  if (!session) {
    return <Navigate to={cashierArea ? "/cashier/login" : "/admin/login"} replace />
  }

  if (session.role === "cashier" && location.pathname !== "/cashier/pos") {
    return <Navigate to="/cashier/pos" replace />
  }

  if (session.role === "admin" && cashierArea) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const isCashier = session.role === "cashier"
  const navItems = isCashier ? cashierNavItems : adminNavItems
  const navGroups = isCashier ? [{ label: "Sesión de caja", items: cashierNavItems }] : adminNavGroups
  const current = navItems.find((item) => location.pathname.startsWith(item.path))
  const fieldState = getFieldState()
  const openIncidents = fieldState.homes.filter((home) => ["incident", "review", "absent"].includes(home.status)).length

  const logout = () => {
    clearStaffSession()
    navigate("/")
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? "w-[288px]" : "w-[248px]"} flex h-full shrink-0 flex-col border-r border-slate-200 bg-white`}>
      <div className="flex h-[72px] items-center border-b border-slate-200 px-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isCashier ? "bg-emerald-700" : "bg-primary"}`}>
          <Droplets className="text-white" size={24} />
        </div>
        <div className="ml-3 min-w-0">
          <p className="truncate font-extrabold tracking-tight text-primary">Agua Santa María</p>
          <p className="text-xs text-muted-foreground">{isCashier ? "Punto de cobro" : "Administración"}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label={isCashier ? "Navegación de caja" : "Navegación administrativa"}>
        {navGroups.map((group) => <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{group.label}</p>
          <div className="space-y-1">{group.items.map((item) => {
            const active = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                  setMobileMenu(false)
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active ? (isCashier ? "bg-emerald-50 font-bold text-emerald-800 ring-1 ring-emerald-100" : "bg-sky-50 font-bold text-primary ring-1 ring-sky-100") : "font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                aria-current={active ? "page" : undefined}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? (isCashier ? "bg-emerald-700 text-white" : "bg-primary text-white") : "bg-slate-100 text-slate-500"}`}><item.icon size={17} /></span>
                <span className="flex-1">{item.label}</span>
                {item.id === "incidents" && !isCashier && openIncidents > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">{openIncidents}</span>}
              </button>
            )
          })}</div>
        </div>)}
      </nav>

      <div className="border-t border-border bg-slate-50/60 p-4">
        <div className="mb-2 flex items-center gap-3 p-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${isCashier ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
            {session.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{session.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {isCashier ? `${session.workstation ?? "Caja"} · ${session.id}` : `${session.id} · Sesión administrativa`}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <div className="relative flex h-screen w-full overflow-hidden">
        <div className="hidden lg:block"><Sidebar /></div>

        {mobileMenu && (
          <div className="fixed inset-0 z-[100] flex lg:hidden">
            <button aria-label="Cerrar menú" className="absolute inset-0 bg-slate-950/55" onClick={() => setMobileMenu(false)} />
            <div className="relative h-full shadow-2xl"><Sidebar mobile /></div>
          </div>
        )}

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f8fb]">
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setMobileMenu(true)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" aria-label="Abrir menú">
                <Menu size={22} />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">{isCashier ? "Operación de caja" : "Administración"}</p>
                <h1 className="truncate text-lg font-extrabold text-slate-900">{current?.label ?? (isCashier ? "Punto de cobro" : "Inicio")}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {!isCashier && (
                <button onClick={() => navigate("/admin/incidents")} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-slate-600 hover:bg-slate-50" aria-label={`${openIncidents} casos requieren atención`}>
                  <Bell size={18} />
                  {openIncidents > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-5 text-white">{openIncidents}</span>}
                </button>
              )}
              <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">{isCashier ? `${session.workstation ?? "Caja"} activa` : "Sesión activa"}</span>
              </div>
            </div>
          </header>

          <main className="no-scrollbar flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto min-h-full max-w-[1440px]"><Outlet /></div>
          </main>
        </div>
      </div>
    </div>
  )
}

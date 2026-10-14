import { Navigate, Outlet, useLocation, useNavigate } from "react-router"
import { Map, MapPinned, ListChecks, RefreshCw } from "lucide-react"
import { getFieldState } from "../../lib/fieldState"

const primaryRoutes = [
  "/field/route",
  "/field/homes",
  "/field/pending",
  "/field/sync",
]

export default function FieldLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const authenticated = sessionStorage.getItem("asm_field_authenticated") === "true"

  if (!authenticated) {
    return <Navigate to="/field/login" replace />
  }

  const state = getFieldState()
  const pendingSync = state.syncQueue.filter((item) => item.status === "pending").length
  const showNav = primaryRoutes.includes(location.pathname)

  const items = [
    { label: "Jornada", icon: Map, path: "/field/route" },
    { label: "Domicilios", icon: MapPinned, path: "/field/homes" },
    { label: "Pendientes", icon: ListChecks, path: "/field/pending" },
    { label: "Sincronizar", icon: RefreshCw, path: "/field/sync", badge: pendingSync },
  ]

  return (
    <div className="min-h-full bg-background">
      <Outlet />

      {showNav && (
        <nav className="absolute bottom-0 left-0 right-0 z-50 h-[72px] border-t border-slate-200 bg-white/95 px-2 backdrop-blur-xl" aria-label="Navegación principal de campo">
          <div className="grid h-full grid-cols-4">
            {items.map((item) => {
              const active = location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                    active ? "text-secondary" : "text-slate-500"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <div className={`relative flex h-8 w-12 items-center justify-center rounded-full ${active ? "bg-teal-50" : ""}`}>
                    <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                    {!!item.badge && item.badge > 0 && (
                      <span className="absolute -right-0.5 -top-1 min-w-[18px] rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-white">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}

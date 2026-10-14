import { useNavigate } from "react-router"
import {
  BadgeDollarSign,
  ChevronRight,
  Droplets,
  HardHat,
  ShieldCheck,
} from "lucide-react"

export default function StartSelector() {
  const navigate = useNavigate()

  const roles = [
    {
      title: "Habitante",
      description: "Recibos, pagos y cuenta de servicio",
      icon: Droplets,
      path: "/login",
      iconClass: "bg-blue-50 text-primary",
      hoverClass: "hover:border-sky-300",
    },
    {
      title: "Personal de campo",
      description: "Jornada, lecturas e incidencias",
      icon: HardHat,
      path: "/field/login",
      iconClass: "bg-teal-50 text-secondary",
      hoverClass: "hover:border-teal-300",
    },
    {
      title: "Administración",
      description: "Cuentas, rutas, incidencias y reportes",
      icon: ShieldCheck,
      path: "/admin/login",
      iconClass: "bg-indigo-50 text-indigo-700",
      hoverClass: "hover:border-indigo-300",
    },
    {
      title: "Caja",
      description: "Cobros, códigos y comprobantes",
      icon: BadgeDollarSign,
      path: "/cashier/login",
      iconClass: "bg-emerald-50 text-emerald-700",
      hoverClass: "hover:border-emerald-300",
    },
  ]

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-background to-white px-5 py-7">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-primary to-secondary shadow-lg shadow-sky-900/10">
          <Droplets className="text-white" size={31} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-primary">Agua Santa María</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
          Selecciona el perfil con el que deseas recorrer el prototipo funcional.
        </p>
      </div>

      <div className="space-y-3">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <button
              key={role.title}
              onClick={() => navigate(role.path)}
              className={`group w-full rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition-all active:scale-[0.99] ${role.hoverClass}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${role.iconClass}`}>
                  <Icon size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-black text-foreground">{role.title}</h2>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{role.description}</p>
                </div>
                <ChevronRight className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" size={21} />
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-center text-xs leading-5 text-sky-800">
        Prototipo de alta fidelidad · Los datos y transacciones son demostrativos.
      </div>
    </div>
  )
}

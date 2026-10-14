import type { ReactNode } from "react"
import { ArrowLeft, Cloud, CloudOff, Wifi } from "lucide-react"
import type { FieldHomeStatus } from "../../lib/fieldState"

export function FieldHeader({
  title,
  subtitle,
  back,
  online = true,
  action,
}: {
  title: string
  subtitle?: string
  back?: () => void
  online?: boolean
  action?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-teal-800/20 bg-secondary px-4 pb-3 pt-4 text-white shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {back && (
            <button
              type="button"
              onClick={back}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Volver"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="truncate text-xs text-white/75">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold backdrop-blur-sm" aria-label={online ? "Dispositivo en línea" : "Dispositivo sin conexión"}>
            {online ? <Wifi size={13} /> : <CloudOff size={13} />}
            {online ? "En línea" : "Sin conexión"}
          </div>
        </div>
      </div>
    </header>
  )
}

export function FieldStatusPill({ status }: { status: FieldHomeStatus }) {
  const config: Record<FieldHomeStatus, { label: string; className: string }> = {
    pending: { label: "Pendiente", className: "bg-slate-100 text-slate-600" },
    completed: { label: "Completada", className: "bg-emerald-50 text-emerald-700" },
    incident: { label: "Incidencia", className: "bg-amber-50 text-amber-700" },
    review: { label: "En revisión", className: "bg-violet-50 text-violet-700" },
    absent: { label: "Ausente", className: "bg-rose-50 text-rose-700" },
  }
  const item = config[status]
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.className}`}>
      {item.label}
    </span>
  )
}

export function FieldEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-secondary">
        {icon ?? <Cloud size={30} />}
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
      <p className="mb-6 text-sm leading-6 text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}

import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react"
import { FieldHeader, FieldStatusPill } from "../../components/field/FieldUi"
import {
  getFieldState,
  setActiveHome,
  type FieldHomeStatus,
} from "../../lib/fieldState"

const filters: { label: string; value: "all" | FieldHomeStatus }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Completadas", value: "completed" },
  { label: "Incidencias", value: "incident" },
  { label: "Revisión", value: "review" },
]

export default function FieldHomes() {
  const navigate = useNavigate()
  const [state] = useState(() => getFieldState())
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all")

  const homes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.homes.filter((home) => {
      const matchesFilter = filter === "all" || home.status === filter
      const matchesQuery =
        !q ||
        home.address.toLowerCase().includes(q) ||
        home.owner.toLowerCase().includes(q) ||
        home.account.toLowerCase().includes(q) ||
        home.meter.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [state.homes, query, filter])

  const openHome = (id: string) => {
    setActiveHome(id)
    navigate("/field/meter")
  }

  return (
    <div className="min-h-full bg-background pb-24">
      <FieldHeader
        title="Domicilios"
        subtitle={`${state.route.name} · ${state.homes.length} asignados`}
        online={state.online}
      />

      <div className="sticky top-[73px] z-20 border-b border-border bg-white px-4 py-3 shadow-sm">
        <div className="relative">
          <label htmlFor="field-home-search" className="sr-only">Buscar domicilio</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          <input
            id="field-home-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar calle, titular, cuenta o medidor"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition ${
                filter === item.value
                  ? "bg-secondary text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-foreground">{homes.length} resultados</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <SlidersHorizontal size={14} /> Prioridad de ruta
          </div>
        </div>

        <div className="space-y-3">
          {homes.map((home, index) => {
            const interactive = home.status === "pending"
            return (
              <button
                key={home.id}
                type="button"
                onClick={() => openHome(home.id)}
                className={`w-full rounded-[22px] border bg-white p-4 text-left shadow-sm transition active:scale-[0.99] ${
                  interactive && index === 0
                    ? "border-secondary/50 ring-1 ring-secondary/10"
                    : "border-border"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      home.status === "pending"
                        ? "bg-teal-50 text-secondary"
                        : home.status === "completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : home.status === "incident"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    <MapPin size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-foreground">{home.address}</h3>
                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                          <UserRound size={13} /> {home.owner}
                        </p>
                      </div>
                      <FieldStatusPill status={home.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex gap-3 text-[11px] text-slate-500">
                        <span>{home.id}</span>
                        <span>Medidor {home.meter}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                    {home.outcomeLabel && (
                      <p className="mt-2 text-xs font-medium text-slate-500">{home.outcomeLabel}</p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {!homes.length && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-bold text-foreground">Sin coincidencias</p>
            <p className="mt-2 text-sm text-muted-foreground">Prueba otro término o cambia el filtro.</p>
          </div>
        )}
      </main>
    </div>
  )
}

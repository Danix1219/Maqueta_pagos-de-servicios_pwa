import { useMemo, useState } from "react"
import { LocateFixed, Minus, Plus } from "lucide-react"
import type { FieldHome, FieldHomeStatus } from "../../lib/fieldState"

type RouteMapProps = {
  homes: FieldHome[]
  activeHomeId?: string
  selectedHomeId?: string
  highlightedHomeIds?: string[]
  onSelectHome?: (home: FieldHome) => void
  showWorker?: boolean
  compact?: boolean
  className?: string
}

const stopColor: Record<FieldHomeStatus, string> = {
  pending: "#0f766e",
  completed: "#059669",
  incident: "#d97706",
  review: "#7c3aed",
  absent: "#e11d48",
}

const streets = [
  "M36 90 C170 55 290 115 420 78 S640 48 730 88",
  "M20 174 C160 198 255 132 382 172 S610 222 744 170",
  "M18 286 C180 250 264 336 418 286 S618 252 742 302",
  "M72 382 C210 326 330 386 468 350 S624 334 720 372",
  "M116 18 C86 132 148 215 116 402",
  "M260 12 C292 136 232 248 280 410",
  "M446 18 C410 124 484 244 440 408",
  "M620 10 C650 126 584 236 632 405",
]

export default function RouteMap({
  homes,
  activeHomeId,
  selectedHomeId,
  highlightedHomeIds = [],
  onSelectHome,
  showWorker = true,
  compact = false,
  className = "",
}: RouteMapProps) {
  const [zoom, setZoom] = useState(1)
  const ordered = useMemo(
    () => [...homes].sort((a, b) => a.location.sequence - b.location.sequence),
    [homes],
  )
  const routePoints = ordered.map((home) => `${home.location.x},${home.location.y}`).join(" ")
  const active = ordered.find((home) => home.id === activeHomeId) ?? ordered.find((home) => home.status === "pending")

  const activate = (home: FieldHome) => {
    onSelectHome?.(home)
  }

  return (
    <div className={`relative overflow-hidden bg-[#eef4f1] ${className}`}>
      <svg
        viewBox="0 0 760 420"
        className={`block w-full ${compact ? "h-[270px]" : "h-[360px] lg:h-[430px]"}`}
        role="img"
        aria-label={`Mapa de ruta con ${ordered.length} paradas`}
      >
        <defs>
          <pattern id="map-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#cbd9d5" />
          </pattern>
          <filter id="map-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="760" height="420" fill="#edf4f1" />
        <rect width="760" height="420" fill="url(#map-dots)" opacity="0.65" />
        <path d="M505 0 C540 72 516 116 555 170 S642 254 606 420" fill="none" stroke="#c8e8ef" strokeWidth="34" />
        <path d="M505 0 C540 72 516 116 555 170 S642 254 606 420" fill="none" stroke="#e8f7fa" strokeWidth="20" />
        <path d="M40 28 H208 V120 H40 Z" fill="#dbead8" opacity="0.9" />
        <text x="64" y="78" fill="#66806d" fontSize="13" fontWeight="700">Parque municipal</text>
        <g style={{ transformOrigin: "380px 210px", transform: `scale(${zoom})`, transition: "transform 180ms ease" }}>
          {streets.map((street, index) => (
            <g key={street}>
              <path d={street} fill="none" stroke="#d5ddda" strokeWidth={index < 4 ? 22 : 17} strokeLinecap="round" />
              <path d={street} fill="none" stroke="#ffffff" strokeWidth={index < 4 ? 16 : 12} strokeLinecap="round" />
            </g>
          ))}
          <text x="300" y="102" fill="#94a3a8" fontSize="11" fontWeight="700">AV. HIDALGO</text>
          <text x="474" y="278" fill="#94a3a8" fontSize="11" fontWeight="700">CALLE GUERRERO</text>
          <polyline points={routePoints} fill="none" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={routePoints} fill="none" stroke="#0f766e" strokeWidth="5" strokeDasharray="10 8" strokeLinejoin="round" strokeLinecap="round" />

          {ordered.map((home) => {
            const selected = selectedHomeId === home.id || highlightedHomeIds.includes(home.id)
            const fill = stopColor[home.status]
            return (
              <g
                key={home.id}
                role={onSelectHome ? "button" : undefined}
                tabIndex={onSelectHome ? 0 : undefined}
                aria-label={`Parada ${home.location.sequence}, ${home.address}, ${home.status}`}
                onClick={() => activate(home)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    activate(home)
                  }
                }}
                className={onSelectHome ? "cursor-pointer outline-none" : undefined}
                filter="url(#map-shadow)"
              >
                {selected && <circle cx={home.location.x} cy={home.location.y} r="24" fill="none" stroke="#075985" strokeWidth="4" opacity="0.3" />}
                <circle cx={home.location.x} cy={home.location.y} r={selected ? 17 : 15} fill={fill} stroke="#ffffff" strokeWidth="4" />
                <text x={home.location.x} y={home.location.y + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">{home.location.sequence}</text>
              </g>
            )
          })}

          {showWorker && active && (
            <g filter="url(#map-shadow)" aria-label={`Ubicación operativa en ${active.address}`}>
              <circle cx={active.location.x + 22} cy={active.location.y - 22} r="17" fill="#075985" stroke="#ffffff" strokeWidth="4" />
              <path d={`M${active.location.x + 17} ${active.location.y - 18} L${active.location.x + 22} ${active.location.y - 30} L${active.location.x + 27} ${active.location.y - 18} Z`} fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>

      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <button type="button" onClick={() => setZoom((value) => Math.min(1.35, value + 0.15))} className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-slate-700 hover:bg-slate-50" aria-label="Acercar mapa"><Plus size={17} /></button>
        <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.15))} className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-50" aria-label="Alejar mapa"><Minus size={17} /></button>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-bold text-slate-600 shadow-sm backdrop-blur">
        <LocateFixed size={14} className="text-primary" /> Ruta operativa
      </div>
    </div>
  )
}

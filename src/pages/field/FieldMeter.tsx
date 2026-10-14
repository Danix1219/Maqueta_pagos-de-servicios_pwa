import { useNavigate } from "react-router"
import {
  AlertTriangle,
  Camera,
  Gauge,
  MapPin,
  Phone,
  ScanLine,
  UserRound,
} from "lucide-react"
import { FieldHeader, FieldStatusPill } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState } from "../../lib/fieldState"

export default function FieldMeter() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)

  return (
    <div className="min-h-full bg-background pb-5">
      <FieldHeader
        title="Detalle de la toma"
        subtitle={home.id}
        back={() => navigate("/field/homes")}
        online={state.online}
      />

      <main className="p-4">
        <section className="mb-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Domicilio</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">{home.address}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserRound size={15} /> {home.owner}
              </p>
            </div>
            <FieldStatusPill status={home.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] font-semibold text-slate-500">Cuenta</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{home.account}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] font-semibold text-slate-500">Contacto</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-800"><Phone size={13} /> {home.phoneMasked}</p>
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Gauge size={22} /></div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Medidor asignado</p>
              <p className="text-lg font-bold text-foreground">{home.meter}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Lectura anterior</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{home.previousReading}</p>
              <p className="text-xs text-slate-400">m³</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Periodo</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Septiembre 2026</p>
              <p className="mt-1 text-xs text-slate-400">Lectura mensual</p>
            </div>
          </div>
        </section>

        {home.accessNote && (
          <div className="mb-4 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-5 text-sky-900">
            <MapPin size={20} className="mt-0.5 shrink-0" />
            <div><p className="font-bold">Nota de acceso</p><p className="mt-1">{home.accessNote}</p></div>
          </div>
        )}

        {home.status === "pending" ? (
          <div className="space-y-3">
            <button
              onClick={() => navigate("/field/capture")}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold text-white shadow-sm active:scale-[0.99]"
            >
              <Camera size={21} /> Capturar lectura
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/field/absent")}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700"
              >
                <MapPin size={18} /> No localizado
              </button>
              <button
                onClick={() => navigate("/field/incidence")}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3 text-sm font-bold text-amber-800"
              >
                <AlertTriangle size={18} /> Incidencia
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
            <ScanLine size={28} className="mx-auto text-secondary" />
            <p className="mt-3 font-bold text-foreground">Esta visita ya tiene un resultado</p>
            <p className="mt-1 text-sm text-muted-foreground">{home.outcomeLabel ?? "Consulta el estado desde domicilios."}</p>
            <button onClick={() => navigate("/field/homes")} className="mt-4 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700">Volver a domicilios</button>
          </div>
        )}
      </main>
    </div>
  )
}

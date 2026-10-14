import { useState } from "react"
import { useNavigate } from "react-router"
import { Camera, FileImage, Info, NotebookPen } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getActiveHome, getFieldState, updateActiveHome } from "../../lib/fieldState"

export default function FieldCapture() {
  const navigate = useNavigate()
  const state = getFieldState()
  const home = getActiveHome(state)
  const [reading, setReading] = useState(home.currentReading?.toString() ?? "")
  const [notes, setNotes] = useState("")
  const [photoName, setPhotoName] = useState("")
  const [error, setError] = useState("")

  const continueFlow = () => {
    const current = Number(reading)
    setError("")
    if (!reading || !Number.isFinite(current)) {
      setError("Captura una lectura numérica válida para continuar.")
      return
    }
    if (current < 0 || current > 999999) {
      setError("La lectura está fuera del rango permitido para este medidor.")
      return
    }

    const consumption = current - home.previousReading
    updateActiveHome({ currentReading: current, consumption: Math.max(0, consumption) })

    if (current < home.previousReading) {
      navigate("/field/invalid")
      return
    }
    if (consumption >= 50) {
      navigate("/field/outlier")
      return
    }
    navigate("/field/check")
  }

  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader
        title="Capturar lectura"
        subtitle={`${home.meter} · ${home.address}`}
        back={() => navigate("/field/meter")}
        online={state.online}
      />

      <main className="p-4">
        <section className="mb-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Lectura anterior</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{home.previousReading} <span className="text-sm font-semibold text-slate-400">m³</span></p>
            </div>
            <div className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-secondary">{home.id}</div>
          </div>

          <label htmlFor="field-current-reading" className="mb-2 block text-sm font-bold text-slate-700">Lectura actual</label>
          <div className="relative">
            <input
              id="field-current-reading"
              value={reading}
              onChange={(event) => setReading(event.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              placeholder="0000"
              aria-invalid={!!error}
              aria-describedby={error ? "field-reading-error" : "field-reading-help"}
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-4 pr-14 text-3xl font-bold tracking-wide text-slate-900 outline-none focus:border-secondary focus:ring-4 focus:ring-teal-50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">m³</span>
          </div>
          <p id="field-reading-help" className="mt-2 flex gap-2 text-xs leading-5 text-slate-500"><Info size={15} className="mt-0.5 shrink-0" />Ingresa exactamente los dígitos visibles. El sistema comparará la lectura con el periodo anterior.</p>
        </section>

        <section className="mb-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Camera size={20} /></div>
            <div><p className="font-bold text-foreground">Evidencia fotográfica</p><p className="text-xs text-muted-foreground">Recomendada para trazabilidad</p></div>
          </div>
          <label className="flex min-h-[94px] cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-600">
            <FileImage size={22} />
            <span>{photoName || "Tomar foto o seleccionar evidencia"}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")}
            />
          </label>
        </section>

        <section className="mb-4 rounded-[26px] border border-border bg-white p-5 shadow-sm">
          <label htmlFor="field-reading-notes" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><NotebookPen size={17} /> Observaciones</label>
          <textarea
            id="field-reading-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value.slice(0, 180))}
            rows={3}
            placeholder="Ej. Medidor legible, sin daños visibles…"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-teal-100"
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{notes.length}/180</p>
        </section>

        {error && <div id="field-reading-error" role="alert" className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</div>}

        <button onClick={continueFlow} className="min-h-[56px] w-full rounded-2xl bg-secondary px-4 font-bold text-white shadow-sm active:scale-[0.99]">
          Validar lectura
        </button>

        <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          <summary className="cursor-pointer font-bold text-slate-700">Valores de demostración</summary>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button onClick={() => setReading(String(home.previousReading + 15))} className="rounded-xl bg-emerald-50 px-2 py-2 font-bold text-emerald-700">Normal</button>
            <button onClick={() => setReading(String(home.previousReading - 3))} className="rounded-xl bg-rose-50 px-2 py-2 font-bold text-rose-700">Menor</button>
            <button onClick={() => setReading(String(home.previousReading + 70))} className="rounded-xl bg-violet-50 px-2 py-2 font-bold text-violet-700">Atípica</button>
          </div>
        </details>
      </main>
    </div>
  )
}

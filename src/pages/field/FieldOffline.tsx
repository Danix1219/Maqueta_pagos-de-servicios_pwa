import { useNavigate } from "react-router"
import { ArrowDownToLine, CloudOff, Database, LockKeyhole, RefreshCw } from "lucide-react"
import { FieldHeader } from "../../components/field/FieldUi"
import { getFieldState } from "../../lib/fieldState"

export default function FieldOffline() {
  const navigate = useNavigate()
  const state = getFieldState()
  const cards = [
    { icon: Database, title: "Trabajo local", text: "Lecturas, incidencias y resultados se guardan temporalmente en el dispositivo." },
    { icon: LockKeyhole, title: "Sin perder trazabilidad", text: "Cada registro conserva la toma, hora y empleado que realizó la captura." },
    { icon: RefreshCw, title: "Sincronización posterior", text: "Al recuperar conexión, los pendientes se envían y quedan marcados como sincronizados." },
  ]
  return (
    <div className="min-h-full bg-background pb-6">
      <FieldHeader title="Modo sin conexión" subtitle="Continuidad operativa" back={() => navigate("/field/sync")} online={state.online} />
      <main className="p-4">
        <section className="rounded-[28px] bg-slate-900 p-6 text-white shadow-sm"><CloudOff size={34} className="text-teal-300" /><h2 className="mt-4 text-2xl font-bold">La ruta no depende de la señal</h2><p className="mt-2 text-sm leading-6 text-white/70">La captura continúa sin conexión y la sincronización se reanuda cuando la red vuelve.</p></section>
        <div className="mt-4 space-y-3">{cards.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-secondary"><Icon size={21} /></div><div><p className="font-bold text-foreground">{title}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div></div>)}</div>
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><div className="flex gap-2"><ArrowDownToLine size={18} className="mt-0.5 shrink-0" /><p><strong>Antes de cerrar tu jornada:</strong> recupera la conexión y confirma que la cola esté completamente sincronizada.</p></div></div>
      </main>
    </div>
  )
}

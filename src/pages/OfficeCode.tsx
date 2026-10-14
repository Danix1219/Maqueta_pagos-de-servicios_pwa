import { useNavigate } from "react-router"
import { ArrowLeft, Building2, Info, ScanLine, ShieldCheck } from "lucide-react"
import Code39Barcode from "../components/admin/Code39Barcode"

export default function OfficeCode() {
  const navigate = useNavigate()
  const account = "SMM-001245"

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"><ArrowLeft size={24} /></button>
        <h1 className="font-bold text-lg ml-2">Pago en oficina</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><Building2 size={32} /></div>
          <h2 className="text-2xl font-bold text-foreground">Código para ventanilla</h2>
          <p className="text-muted-foreground text-sm mt-2">Muéstralo al personal de caja para localizar tu cuenta sin capturarla manualmente.</p>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-600"><ScanLine size={17} className="text-primary" /> Código de cuenta</div><span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">LISTO PARA ESCANEAR</span></div>
          <div className="border-2 border-slate-100 rounded-2xl p-5 bg-white"><Code39Barcode value={account} height={82} /></div>
          <p className="font-mono text-center text-lg font-extrabold tracking-[0.14em] text-foreground mt-4">{account}</p>
          <p className="text-xs text-muted-foreground text-center mt-1">María Hernández López</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-left mb-4"><ShieldCheck className="text-primary shrink-0 mt-0.5" size={20} /><div><h3 className="font-bold text-blue-950 text-sm">El personal confirmará tus datos</h3><p className="text-xs text-blue-900/75 leading-relaxed mt-1">Después de leer el código, Caja mostrará titular, domicilio y recibos pendientes antes de registrar cualquier pago.</p></div></div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-left"><Info className="text-amber-700 shrink-0 mt-0.5" size={20} /><div><h3 className="font-bold text-amber-900 text-sm">Este código no acredita un pago</h3><p className="text-xs text-amber-800/80 leading-relaxed mt-1">Sólo identifica tu cuenta. Conserva el comprobante que emita Caja después de pagar.</p></div></div>
      </div>
    </div>
  )
}

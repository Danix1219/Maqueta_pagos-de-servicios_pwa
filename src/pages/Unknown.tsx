import { useNavigate } from "react-router";
import { ArrowLeft, HelpCircle, Search, AlertCircle } from "lucide-react";

export default function Unknown() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-8">
          <HelpCircle size={48} />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Resultado sin confirmar</h1>
        <p className="text-muted-foreground text-lg mb-8">
          La conexión se interrumpió al regresar del proveedor de pago.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full flex gap-3 text-left mb-8 shadow-sm">
          <AlertCircle className="text-slate-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Verifica antes de reintentar</h3>
            <p className="text-xs text-slate-600">Tu operación podría haberse completado correctamente. Consulta el estado antes de iniciar otro pago.</p>
          </div>
        </div>

      </div>

      <div className="p-4 bg-white border-t border-border flex flex-col gap-3">
        <button 
          onClick={() => navigate('/history')}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl text-lg shadow-sm active:scale-[0.98] transition-transform flex justify-center items-center gap-2 min-h-[56px]"
        >
          <Search size={20} />
          Consultar estado
        </button>
        <button 
          onClick={() => navigate('/home')}
          className="w-full bg-white text-foreground font-semibold py-4 rounded-2xl shadow-sm border border-border active:scale-[0.98] transition-transform min-h-[56px]"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

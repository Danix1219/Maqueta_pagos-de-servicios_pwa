import { useNavigate } from "react-router";
import { ArrowLeft, ShieldCheck, QrCode } from "lucide-react";

export default function AccountUpToDate() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        
        <div className="w-24 h-24 bg-green-50 border-8 border-green-100 rounded-full flex items-center justify-center text-green-600 mb-8">
          <ShieldCheck size={48} />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Cuenta al corriente</h1>
        <p className="text-muted-foreground text-lg mb-8">
          No tienes recibos pendientes de pago. ¡Gracias por tu puntualidad!
        </p>

        <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-sm mb-8 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Tu cuenta</p>
          <p className="font-bold text-2xl tracking-wide text-foreground">SMM-001245</p>
        </div>

      </div>

      <div className="p-4 bg-white border-t border-border flex flex-col gap-3">
        <button 
          onClick={() => navigate('/office-code')}
          className="w-full bg-background border border-border text-foreground font-semibold py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform min-h-[56px] flex items-center justify-center gap-2"
        >
          <QrCode size={20} />
          Ver código de caja
        </button>
      </div>
    </div>
  );
}

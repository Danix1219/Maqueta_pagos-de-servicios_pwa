import { useNavigate } from "react-router";
import { ArrowLeft, Info, HelpCircle, Phone, Building2 } from "lucide-react";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 flex items-center bg-white border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg ml-2">¿Necesitas ayuda?</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        
        <div className="mb-8">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Preguntas frecuentes</h2>
          <p className="text-muted-foreground">Encuentra respuestas rápidas o contáctanos.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Sin código de activación</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Solicítalo directamente al personal administrativo en las oficinas. Es necesario para vincular tu cuenta por primera vez.
            </p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Sin teléfono inteligente</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              En caja pueden buscar tu cuenta por número de servicio, nombre del titular o domicilio. No es obligatorio usar la aplicación para pagar.
            </p>
          </div>
          
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Horario y Ubicación</h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-amber-600 bg-amber-50 p-2 rounded-lg inline-block border border-amber-100">
              (Pendientes de confirmar con el comité)
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              Pronto publicaremos los horarios oficiales de atención en las oficinas de Agua Santa María.
            </p>
          </div>
        </div>

      </div>

      <div className="p-4 bg-white border-t border-border grid grid-cols-2 gap-3">
        <button className="bg-background border border-border text-foreground font-semibold py-3 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
          <Building2 size={20} className="text-primary" />
          <span className="text-xs">Oficinas</span>
        </button>
        <button className="bg-background border border-border text-foreground font-semibold py-3 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
          <Phone size={20} className="text-primary" />
          <span className="text-xs">Llamar</span>
        </button>
      </div>
    </div>
  );
}

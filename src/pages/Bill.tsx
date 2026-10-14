import { useNavigate } from "react-router"
import { ArrowLeft, Download, Info } from "lucide-react"

export default function Bill() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-border bg-white sticky top-0 z-10">
        <button
          onClick={() => navigate("/home")}
          className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-foreground">Tu recibo de agua</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-50 text-primary min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Download size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {/* Banner de demostración */}
        <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-2xl flex gap-3 mb-8">
          <Info className="text-secondary shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-secondary-foreground text-secondary font-medium">
            Tarifa demostrativa. La tarifa real y las reglas de cálculo se
            validarán con el comité.
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-1">
            PERIODO FACTURADO
          </p>
          <h2 className="text-2xl font-bold text-primary">Septiembre 2026</h2>
        </div>

        {/* Detalles de lectura */}
        <div className="bg-background rounded-3xl p-5 border border-border mb-6">
          <h3 className="font-bold text-foreground mb-4">Cálculo de consumo</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Lectura actual
              </span>
              <span className="font-semibold text-foreground">1215 m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Lectura anterior
              </span>
              <span className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-muted-foreground/50">-</span> 1200 m³
              </span>
            </div>

            <div className="border-t border-border border-dashed pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">
                Consumo total
              </span>
              <span className="font-bold text-primary text-lg">15 m³</span>
            </div>
          </div>
        </div>

        {/* Desglose económico */}
        <div className="bg-background rounded-3xl p-5 border border-border mb-6">
          <h3 className="font-bold text-foreground mb-4">Desglose de cargos</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Servicio medido (15m³ x $10)
              </span>
              <span className="font-semibold text-foreground">$150.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Recargos</span>
              <span className="font-semibold text-foreground">$0.00</span>
            </div>

            <div className="border-t border-border border-dashed pt-4 flex justify-between items-end">
              <div>
                <span className="block text-sm font-bold text-foreground">
                  Total a pagar
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  Límite: 30 sep 2026
                </span>
              </div>
              <span className="font-bold text-foreground text-2xl tracking-tight">
                $150.00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Acción principal inferior */}
      <div className="p-4 bg-white border-t border-border">
        <button
          onClick={() => navigate("/review")}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl text-lg shadow-sm active:scale-[0.98] transition-transform min-h-[56px]"
        >
          Pagar recibo
        </button>
      </div>
    </div>
  )
}

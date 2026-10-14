import { Outlet, useLocation, useNavigate } from "react-router"
import { Home, ReceiptText, QrCode, HelpCircle } from "lucide-react"

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Bottom nav shouldn't show on start, login, activate, password, review, success, pending, unknown, receipt, public-validation, offline
  const showBottomNav = [
    "/home",
    "/history",
    "/office-code",
    "/up-to-date",
    "/help",
  ].includes(location.pathname)

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Mobile Frame Simulation */}
      <div
        className="bg-background w-full relative overflow-hidden shadow-2xl flex flex-col"
        style={{
          maxWidth: "412px",
          height: "915px",
          borderRadius: "40px",
          border: "8px solid #1e293b",
        }}
      >
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around px-2 z-50">
            <button
              onClick={() => navigate("/home")}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${
                location.pathname === "/home"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Home size={24} />
              <span className="text-[10px] font-medium">Inicio</span>
            </button>
            <button
              onClick={() => navigate("/history")}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${
                location.pathname === "/history"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <ReceiptText size={24} />
              <span className="text-[10px] font-medium">Recibos</span>
            </button>
            <button
              onClick={() => navigate("/up-to-date")}
              // Or /office-code depending on state, simplified to up-to-date here
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${
                ["/office-code", "/up-to-date"].includes(location.pathname)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <QrCode size={24} />
              <span className="text-[10px] font-medium">Mi código</span>
            </button>
            <button
              onClick={() => navigate("/help")}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${
                location.pathname === "/help"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <HelpCircle size={24} />
              <span className="text-[10px] font-medium">Ayuda</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

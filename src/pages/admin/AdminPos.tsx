import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Camera,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Loader2,
  MapPin,
  QrCode,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  VideoOff,
} from "lucide-react"
import {
  type AdminAccount,
  type AdminBill,
  type AdminPayment,
  findAccount,
  formatMoney,
  getAccount,
  getAdminState,
  getPendingBills,
  recordPayment,
} from "../../lib/adminState"
import { getStaffSession } from "../../lib/staffAuth"

type Stage = "search" | "scan" | "account" | "checkout" | "success" | "no-pending"
type CameraState = "idle" | "loading" | "ready" | "unsupported" | "denied"

const steps = ["Cuenta", "Recibo", "Pago", "Comprobante"]

export default function AdminPos() {
  const [params] = useSearchParams()
  const session = getStaffSession()
  const [stage, setStage] = useState<Stage>("search")
  const [query, setQuery] = useState("")
  const [matches, setMatches] = useState<AdminAccount[]>([])
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [account, setAccount] = useState<AdminAccount | null>(null)
  const [bill, setBill] = useState<AdminBill | null>(null)
  const [identityConfirmed, setIdentityConfirmed] = useState(false)
  const [method, setMethod] = useState<"cash" | "terminal">("cash")
  const [received, setReceived] = useState("")
  const [terminalApproved, setTerminalApproved] = useState(false)
  const [terminalRef, setTerminalRef] = useState("")
  const [terminalError, setTerminalError] = useState("")
  const [payment, setPayment] = useState<AdminPayment | null>(null)
  const [processing, setProcessing] = useState(false)
  const [scanError, setScanError] = useState("")
  const [cameraState, setCameraState] = useState<CameraState>("idle")
  const [fallbackCode, setFallbackCode] = useState("")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanTimerRef = useRef<number | null>(null)

  const total = bill?.amount ?? 0
  const receivedAmount = Number(received) || 0
  const change = Math.max(0, receivedAmount - total)
  const cashReady = method === "cash" && receivedAmount >= total
  const terminalReady = method === "terminal" && terminalApproved
  const canPay = (cashReady || terminalReady) && !processing
  const accountPending = useMemo(() => account ? getPendingBills(account.id) : [], [account, stage])
  const currentStep = stage === "success" ? 4 : stage === "checkout" ? 3 : stage === "account" || stage === "no-pending" ? 2 : 1

  const shiftPayments = getAdminState().payments.filter((item) => {
    if (!session || item.cashier !== session.name) return false
    return new Date(item.createdAt).getTime() >= new Date(session.startedAt).getTime()
  })
  const shiftTotal = shiftPayments.reduce((sum, item) => sum + item.amount, 0)
  const shiftCash = shiftPayments.filter((item) => item.method === "cash").reduce((sum, item) => sum + item.amount, 0)

  useEffect(() => {
    const accountFromQuery = params.get("account")
    if (accountFromQuery) selectAccountById(accountFromQuery)
  }, [])

  useEffect(() => {
    if (stage !== "scan") stopCamera()
    return () => stopCamera()
  }, [stage])

  function resetTransaction() {
    stopCamera()
    setStage("search")
    setQuery("")
    setMatches([])
    setSearchAttempted(false)
    setAccount(null)
    setBill(null)
    setIdentityConfirmed(false)
    setMethod("cash")
    setReceived("")
    setTerminalApproved(false)
    setTerminalRef("")
    setTerminalError("")
    setPayment(null)
    setProcessing(false)
    setScanError("")
    setFallbackCode("")
  }

  function selectAccount(candidate: AdminAccount) {
    setAccount(candidate)
    const pending = candidate.bills.filter((item) => item.status === "pending")
    setBill(pending[0] ?? null)
    setIdentityConfirmed(false)
    setStage(pending.length ? "account" : "no-pending")
    setScanError("")
  }

  function selectAccountById(id: string) {
    const candidate = getAccount(id.trim().toUpperCase())
    if (!candidate) {
      setScanError("El código no corresponde a una cuenta registrada.")
      return false
    }
    selectAccount(candidate)
    return true
  }

  function runSearch(event?: FormEvent) {
    event?.preventDefault()
    const results = findAccount(query)
    setMatches(results)
    setSearchAttempted(true)
  }

  function resolveScannedValue(value: string) {
    const normalized = value.toUpperCase().match(/SMM-\d{6}/)?.[0] ?? value.trim().toUpperCase()
    if (!selectAccountById(normalized)) {
      setScanError(`No pudimos relacionar “${value || "el código"}” con una cuenta válida.`)
      return
    }
    stopCamera()
  }

  function stopCamera() {
    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current)
      scanTimerRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraState((current) => current === "ready" || current === "loading" ? "idle" : current)
  }

  async function startCamera() {
    setScanError("")
    setCameraState("loading")
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraState("ready")
      beginBarcodeDetection()
    } catch {
      setCameraState("denied")
    }
  }

  async function beginBarcodeDetection() {
    const Detector = (window as unknown as { BarcodeDetector?: new (options?: { formats?: string[] }) => { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector
    if (!Detector || !videoRef.current) return
    const detector = new Detector({ formats: ["code_39", "code_128", "qr_code"] })
    const loop = async () => {
      if (!videoRef.current || !streamRef.current) return
      try {
        const codes = await detector.detect(videoRef.current)
        const raw = codes.find((code) => code.rawValue)?.rawValue
        if (raw) {
          resolveScannedValue(raw)
          return
        }
      } catch {
        // The next frame is attempted while the camera remains active.
      }
      scanTimerRef.current = window.setTimeout(loop, 450)
    }
    loop()
  }

  function chooseBill(selectedBill: AdminBill) {
    if (!identityConfirmed) return
    setBill(selectedBill)
    setStage("checkout")
    setReceived("")
    setMethod("cash")
    setTerminalApproved(false)
    setTerminalRef("")
    setTerminalError("")
  }

  function confirmTerminalApproval() {
    const reference = terminalRef.trim().toUpperCase()
    if (!/^[A-Z0-9-]{6,24}$/.test(reference)) {
      setTerminalApproved(false)
      setTerminalError("Captura una referencia válida de 6 a 24 caracteres.")
      return
    }
    setTerminalRef(reference)
    setTerminalError("")
    setTerminalApproved(true)
  }

  function registerPayment() {
    if (!account || !bill || !canPay) return
    setProcessing(true)
    const result = recordPayment({
      accountId: account.id,
      billId: bill.id,
      method,
      received: method === "cash" ? receivedAmount : undefined,
      terminalReference: method === "terminal" ? terminalRef : undefined,
      cashier: session?.name ?? "Operador de caja",
      desk: session?.workstation ?? "Caja",
    })
    setProcessing(false)
    if (!result) {
      setScanError("Este recibo ya no está disponible para cobro.")
      setStage("no-pending")
      return
    }
    setPayment(result)
    setStage("success")
  }

  return (
    <div className="space-y-5 pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-sm font-bold text-emerald-700">{session?.workstation ?? "Caja"} · Ventanilla</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Cobro de recibos</h2>
          <p className="mt-1 text-muted-foreground">Verifica la cuenta, selecciona el adeudo y registra el pago.</p>
        </div>
        {stage !== "search" && stage !== "success" && <button type="button" onClick={resetTransaction} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 font-bold"><RefreshCw size={16} /> Nueva búsqueda</button>}
      </div>

      <ol className="grid grid-cols-4 overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-label="Progreso del cobro">
        {steps.map((label, index) => {
          const number = index + 1
          const completed = currentStep > number
          const active = currentStep === number
          return <li key={label} className={`flex min-w-0 items-center gap-2 border-r border-border px-2 py-3 last:border-r-0 sm:px-4 ${active ? "bg-emerald-50" : ""}`} aria-current={active ? "step" : undefined}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${completed ? "bg-emerald-600 text-white" : active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}>{completed ? <CheckCircle2 size={16} /> : number}</span><span className={`truncate text-[10px] font-bold sm:text-xs ${active ? "text-emerald-800" : "text-slate-500"}`}>{label}</span></li>
        })}
      </ol>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div>
          {stage === "search" && (
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="cashier-search-title">
              <div className="border-b border-border px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">Paso 1</p><h3 id="cashier-search-title" className="mt-1 text-xl font-extrabold">Localizar cuenta</h3><p className="mt-1 text-sm text-muted-foreground">Busca por cuenta, titular, domicilio, toma o medidor.</p></div>
              <div className="p-5">
                <form onSubmit={runSearch}>
                  <label htmlFor="cashier-account-search" className="mb-2 block text-sm font-bold text-slate-700">Datos de la cuenta</label>
                  <div className="flex flex-col gap-2 sm:flex-row"><div className="relative min-w-0 flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input id="cashier-account-search" autoFocus type="search" value={query} onChange={(event) => { setQuery(event.target.value); setMatches([]); setSearchAttempted(false) }} placeholder="Ej. SMM-001245 o nombre del titular" className="h-14 w-full rounded-xl border border-border bg-slate-50 pl-11 pr-4 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div><button type="submit" disabled={!query.trim()} className="h-14 rounded-xl bg-emerald-700 px-6 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Buscar</button></div>
                </form>

                <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-semibold text-slate-400">o utiliza el código del Habitante</span><div className="h-px flex-1 bg-slate-200" /></div>
                <button type="button" onClick={() => setStage("scan")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3.5 font-bold text-emerald-800"><QrCode size={19} /> Escanear código</button>

                {!!matches.length && <div className="mt-5 space-y-2" aria-live="polite">{matches.map((candidate) => <button type="button" key={candidate.id} onClick={() => selectAccount(candidate)} className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left hover:border-emerald-300 hover:bg-emerald-50/40"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-emerald-700"><UserRound size={19} /></div><div className="min-w-0 flex-1"><p className="truncate font-bold">{candidate.name}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{candidate.id} · {candidate.address}</p></div><span className="text-xs font-bold text-emerald-700">Ver cuenta</span></button>)}</div>}
                {searchAttempted && !matches.length && <div role="status" className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center"><Search size={25} className="mx-auto text-slate-400" /><p className="mt-2 font-bold">No encontramos coincidencias</p><p className="mt-1 text-sm text-muted-foreground">Revisa los datos o intenta con el número de toma.</p></div>}
              </div>
            </section>
          )}

          {stage === "scan" && (
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="cashier-scan-title">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4"><button type="button" onClick={() => { stopCamera(); setStage("search") }} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Volver a búsqueda"><ArrowLeft size={20} /></button><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Localizar cuenta</p><h3 id="cashier-scan-title" className="font-extrabold">Escanear código</h3></div></div>
              <div className="p-5">
                <div className="relative flex aspect-[16/9] max-h-[390px] items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
                  <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />
                  {cameraState !== "ready" && <div className="relative z-10 p-6 text-center text-white"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">{cameraState === "loading" ? <Loader2 size={30} className="animate-spin" /> : cameraState === "denied" || cameraState === "unsupported" ? <VideoOff size={30} /> : <Camera size={30} />}</div><p className="font-bold">{cameraState === "loading" ? "Solicitando cámara…" : cameraState === "denied" ? "No pudimos usar la cámara" : cameraState === "unsupported" ? "Cámara no disponible" : "Lector listo"}</p><p className="mt-1 text-sm text-white/65">{cameraState === "denied" ? "Revisa el permiso o captura la cuenta manualmente." : "Mantén el código dentro del encuadre."}</p>{cameraState === "idle" && <button type="button" onClick={startCamera} className="mt-5 rounded-xl bg-white px-5 py-2.5 font-extrabold text-slate-900">Activar cámara</button>}</div>}
                  {cameraState === "ready" && <><div className="absolute inset-[15%] rounded-2xl border-2 border-emerald-300 shadow-[0_0_0_999px_rgba(2,6,23,.38)]" /><div className="absolute bottom-5 left-0 right-0 text-center text-sm font-semibold text-white">Buscando código…</div></>}
                </div>
                {scanError && <div role="alert" className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700"><AlertCircle size={17} className="shrink-0" /> {scanError}</div>}
                <div className="mt-5 border-t border-border pt-5"><label htmlFor="cashier-code-fallback" className="text-sm font-bold text-slate-700">Capturar número debajo del código</label><p className="mt-1 text-xs text-muted-foreground">Úsalo cuando la cámara no pueda completar la lectura.</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input id="cashier-code-fallback" value={fallbackCode} onChange={(event) => setFallbackCode(event.target.value.toUpperCase())} placeholder="SMM-001245" className="h-12 min-w-0 flex-1 rounded-xl border border-border px-3 uppercase" /><button type="button" onClick={() => resolveScannedValue(fallbackCode)} disabled={!fallbackCode.trim()} className="rounded-xl border border-emerald-700 px-4 font-bold text-emerald-800 disabled:opacity-50">Validar cuenta</button></div></div>
              </div>
            </section>
          )}

          {stage === "account" && account && (
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="cashier-account-title">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4"><button type="button" onClick={() => setStage("search")} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Volver a búsqueda"><ArrowLeft size={20} /></button><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Paso 2</p><h3 id="cashier-account-title" className="font-extrabold">Verificar cuenta y recibo</h3></div></div>
              <div className="space-y-5 p-5">
                <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><UserRound size={21} /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-emerald-700">{account.id}</p><h4 className="mt-1 text-lg font-extrabold">{account.name}</h4><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600"><MapPin size={14} /> {account.address}</p></div><ShieldCheck size={21} className="text-emerald-600" /></div>
                <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Toma</p><p className="mt-1 font-bold">{account.takeId}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Medidor</p><p className="mt-1 font-bold">{account.meterId}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Sector</p><p className="mt-1 font-bold">{account.zone}</p></div></div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4"><input type="checkbox" checked={identityConfirmed} onChange={(event) => setIdentityConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700" /><span><span className="block text-sm font-bold text-slate-800">Datos confirmados con la persona</span><span className="mt-0.5 block text-xs text-muted-foreground">Verifiqué titular y domicilio antes de continuar.</span></span></label>
                <div className="overflow-hidden rounded-2xl border border-border"><div className="border-b border-border bg-slate-50 px-4 py-3"><h4 className="font-extrabold">Recibos pendientes</h4></div>{accountPending.map((pendingBill) => <div key={pendingBill.id} className="flex flex-col gap-3 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-center"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><ReceiptText size={19} /></div><div className="flex-1"><p className="font-bold">{pendingBill.period}</p><p className="mt-0.5 text-xs text-muted-foreground">{pendingBill.consumption} m³ · vence {pendingBill.dueDate}</p></div><p className="text-xl font-extrabold">{formatMoney(pendingBill.amount)}</p><button type="button" onClick={() => chooseBill(pendingBill)} disabled={!identityConfirmed} className="rounded-xl bg-emerald-700 px-4 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Continuar</button></div>)}</div>
              </div>
            </section>
          )}

          {stage === "no-pending" && account && (
            <section className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={32} /></div><h3 className="mt-4 text-2xl font-extrabold">Cuenta sin adeudos pendientes</h3><p className="mt-2 text-muted-foreground">{account.name} · {account.id}</p>{scanError && <p role="alert" className="mx-auto mt-4 max-w-md rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{scanError}</p>}<p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">No se puede registrar un segundo cobro sobre un recibo pagado.</p><button type="button" onClick={resetTransaction} className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white">Buscar otra cuenta</button></section>
          )}

          {stage === "checkout" && account && bill && (
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="cashier-payment-title">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4"><button type="button" onClick={() => setStage("account")} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Volver a recibos"><ArrowLeft size={20} /></button><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Paso 3</p><h3 id="cashier-payment-title" className="font-extrabold">Registrar pago</h3></div></div>
              <div className="space-y-5 p-5">
                <div className="rounded-2xl bg-slate-950 p-5 text-white"><div className="flex justify-between gap-4 text-sm text-slate-300"><span>{account.id} · {bill.period}</span><span>{bill.consumption} m³</span></div><div className="my-4 border-t border-white/10" /><div className="flex items-end justify-between gap-4"><span className="font-bold">Total a cobrar</span><span className="text-4xl font-extrabold">{formatMoney(bill.amount)}</span></div></div>
                <fieldset><legend className="mb-3 text-sm font-extrabold">Forma de pago</legend><div className="grid gap-3 sm:grid-cols-2"><button type="button" aria-pressed={method === "cash"} onClick={() => { setMethod("cash"); setTerminalApproved(false); setTerminalError("") }} className={`rounded-xl border-2 p-4 text-left ${method === "cash" ? "border-emerald-600 bg-emerald-50" : "border-slate-200"}`}><Banknote size={21} className={method === "cash" ? "text-emerald-700" : "text-slate-500"} /><p className="mt-2 font-extrabold">Efectivo</p><p className="mt-1 text-xs text-muted-foreground">Calcula el cambio.</p></button><button type="button" aria-pressed={method === "terminal"} onClick={() => setMethod("terminal")} className={`rounded-xl border-2 p-4 text-left ${method === "terminal" ? "border-emerald-600 bg-emerald-50" : "border-slate-200"}`}><CreditCard size={21} className={method === "terminal" ? "text-emerald-700" : "text-slate-500"} /><p className="mt-2 font-extrabold">Terminal bancaria</p><p className="mt-1 text-xs text-muted-foreground">Requiere referencia.</p></button></div></fieldset>

                {method === "cash" ? <div className="rounded-2xl border border-border bg-slate-50 p-4"><label htmlFor="cash-received" className="text-sm font-bold">Efectivo recibido</label><div className="relative mt-2"><DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="cash-received" autoFocus type="number" min={0} step="0.01" value={received} onChange={(event) => setReceived(event.target.value)} aria-describedby={received && !cashReady ? "cash-error" : undefined} aria-invalid={!!received && !cashReady} placeholder="0.00" className="h-14 w-full rounded-xl border-2 border-border bg-white pl-10 pr-4 text-xl font-extrabold outline-none focus:border-emerald-600" /></div><div className="mt-3 flex items-center justify-between rounded-xl bg-white p-3"><span className="text-sm font-bold text-slate-500">Cambio</span><span className={`text-2xl font-extrabold ${cashReady ? "text-emerald-600" : "text-slate-400"}`}>{formatMoney(change)}</span></div>{received && !cashReady && <p id="cash-error" role="alert" className="mt-2 text-xs font-semibold text-rose-600">El efectivo recibido es menor al total.</p>}</div> : <div className="rounded-2xl border border-border bg-slate-50 p-4"><div className="flex items-center justify-between"><div><p className="font-extrabold">Autorización bancaria</p><p className="mt-1 text-sm text-muted-foreground">Captura la referencia mostrada por la terminal física.</p></div>{terminalApproved && <CheckCircle2 className="text-emerald-600" size={22} />}</div>{terminalApproved ? <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><span><strong>Autorizada</strong> · {terminalRef}</span><button type="button" onClick={() => setTerminalApproved(false)} className="font-bold underline">Editar</button></div> : <div className="mt-4"><label htmlFor="terminal-reference" className="text-xs font-bold text-slate-600">Referencia de autorización</label><div className="mt-1.5 flex flex-col gap-2 sm:flex-row"><input id="terminal-reference" value={terminalRef} onChange={(event) => { setTerminalRef(event.target.value); setTerminalError("") }} placeholder="Ej. 519208" aria-invalid={!!terminalError} aria-describedby={terminalError ? "terminal-error" : undefined} className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 uppercase" /><button type="button" onClick={confirmTerminalApproval} className="rounded-xl border border-emerald-700 px-4 font-bold text-emerald-800">Confirmar</button></div>{terminalError && <p id="terminal-error" role="alert" className="mt-2 text-xs font-semibold text-rose-600">{terminalError}</p>}</div>}</div>}

                <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertCircle size={17} className="mt-0.5 shrink-0" /><p>Registra el cobro sólo después de recibir el efectivo o confirmar la autorización bancaria.</p></div>
                <button type="button" disabled={!canPay} onClick={registerPayment} className="w-full rounded-xl bg-emerald-700 py-4 text-lg font-extrabold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">{processing ? "Registrando…" : `Registrar cobro por ${formatMoney(total)}`}</button>
              </div>
            </section>
          )}

          {stage === "success" && account && payment && (
            <section className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm sm:p-8" aria-labelledby="payment-success-title"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={34} /></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-emerald-700">Paso 4 completado</p><h3 id="payment-success-title" className="mt-1 text-2xl font-extrabold">Cobro registrado</h3><p className="mt-2 text-muted-foreground">Entrega el comprobante y el cambio, si corresponde.</p><dl className="mx-auto mt-6 max-w-lg divide-y divide-slate-200 rounded-2xl border border-border bg-slate-50 px-5 text-left text-sm"><div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Folio</dt><dd className="font-bold">{payment.folio}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Cuenta</dt><dd className="font-bold">{payment.accountId}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Método</dt><dd className="font-bold">{payment.method === "cash" ? "Efectivo" : "Terminal bancaria"}</dd></div>{payment.received !== undefined && <><div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Recibido</dt><dd className="font-bold">{formatMoney(payment.received)}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Cambio</dt><dd className="font-bold text-emerald-700">{formatMoney(payment.change ?? 0)}</dd></div></>}<div className="flex justify-between gap-4 py-4"><dt className="font-bold">Total pagado</dt><dd className="text-xl font-extrabold">{formatMoney(payment.amount)}</dd></div></dl><div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"><button type="button" onClick={() => window.print()} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 font-bold"><ReceiptText size={18} /> Imprimir</button><button type="button" onClick={resetTransaction} className="flex-1 rounded-xl bg-emerald-700 py-3 font-bold text-white">Siguiente cobro</button></div></section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm" aria-labelledby="shift-title">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 font-extrabold text-emerald-800">{session?.name.split(" ").map((part) => part[0]).join("").slice(0, 2) ?? "CJ"}</div><div><h3 id="shift-title" className="font-extrabold">Turno actual</h3><p className="text-xs text-muted-foreground">{session?.name ?? "Operador"} · {session?.id}</p></div></div>
            <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Operaciones</p><p className="mt-1 text-2xl font-extrabold">{shiftPayments.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Recaudado</p><p className="mt-1 text-lg font-extrabold">{formatMoney(shiftTotal)}</p></div></div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Efectivo</span><strong>{formatMoney(shiftCash)}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Terminal</span><strong>{formatMoney(shiftTotal - shiftCash)}</strong></div><div className="flex justify-between"><span className="flex items-center gap-1.5 text-muted-foreground"><Clock3 size={14} /> Inicio</span><strong>{session ? new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit" }).format(new Date(session.startedAt)) : "—"}</strong></div></div>
          </section>
          {shiftPayments[0] && <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Última operación</p><p className="mt-2 font-extrabold text-emerald-950">{shiftPayments[0].folio}</p><p className="mt-1 text-sm text-emerald-800">{shiftPayments[0].accountId} · {formatMoney(shiftPayments[0].amount)}</p></section>}
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-700" /><p>Cada pago genera un folio único y queda asociado a esta caja y operador.</p></div>
        </aside>
      </div>
    </div>
  )
}

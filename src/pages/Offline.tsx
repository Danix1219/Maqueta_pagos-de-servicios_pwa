import { useNavigate } from "react-router"
export default function Offline() {
  const navigate = useNavigate()
  return (
    <div className="p-6 h-full bg-white flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-4">Offline (WIP)</h1>
      <button
        onClick={() => navigate(-1)}
        className="mt-8 text-primary border border-primary px-4 py-2 rounded"
      >
        Volver
      </button>
    </div>
  )
}

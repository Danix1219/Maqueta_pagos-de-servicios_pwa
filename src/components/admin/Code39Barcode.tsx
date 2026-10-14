const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn",
  "4": "nnnwwnnnw", "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw",
  "8": "wnnwnnwnn", "9": "nnwwnnwnn", A: "wnnnnwnnw", B: "nnwnnwnnw",
  C: "wnwnnwnnn", D: "nnnnwwnnw", E: "wnnnwwnnn", F: "nnwnwwnnn",
  G: "nnnnnwwnw", H: "wnnnnwwnn", I: "nnwnnwwnn", J: "nnnnwwwnn",
  K: "wnnnnnnww", L: "nnwnnnnww", M: "wnwnnnnwn", N: "nnnnwnnww",
  O: "wnnnwnnwn", P: "nnwnwnnwn", Q: "nnnnnnwww", R: "wnnnnnwwn",
  S: "nnwnnnwwn", T: "nnnnwnwwn", U: "wwnnnnnnw", V: "nwwnnnnnw",
  W: "wwwnnnnnn", X: "nwnnwnnnw", Y: "wwnnwnnnn", Z: "nwwnwnnnn",
  "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "*": "nwnnwnwnn",
  "$": "nwnwnwnnn", "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn",
}

export default function Code39Barcode({ value, height = 70 }: { value: string; height?: number }) {
  const safe = value.toUpperCase().replace(/[^0-9A-Z. \-$/+%]/g, "")
  const chars = `*${safe}*`
  const narrow = 2
  const wide = 5
  const gap = 2
  let x = 8
  const bars: Array<{ x: number; width: number }> = []

  for (const char of chars) {
    const pattern = CODE39[char] ?? CODE39["-"]
    pattern.split("").forEach((part, index) => {
      const width = part === "w" ? wide : narrow
      if (index % 2 === 0) bars.push({ x, width })
      x += width
    })
    x += gap
  }

  return (
    <svg viewBox={`0 0 ${x + 8} ${height}`} className="w-full h-auto" role="img" aria-label={`Código de cuenta ${safe}`}>
      <rect width="100%" height="100%" fill="white" />
      {bars.map((bar, index) => <rect key={index} x={bar.x} y={4} width={bar.width} height={height - 8} fill="#0f172a" />)}
    </svg>
  )
}

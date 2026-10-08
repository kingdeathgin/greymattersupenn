import type { Mark } from "@/lib/bubble";

export function DrawingPreview({ marks, label }: { marks: Mark[]; label: string }) {
  return <svg viewBox="0 0 1200 720" role="img" aria-label={label} className="block h-full w-full">
    <rect width="1200" height="720" fill="white" />
    {marks.map((mark, index) => {
      if (mark.kind === "sticker") return <text key={index} x={mark.point.x} y={mark.point.y} textAnchor="middle" dominantBaseline="central" fontSize={mark.size * 0.85} fontFamily="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">{mark.emoji}</text>;
      if (mark.kind === "text") return <text key={index} x={mark.point.x} y={mark.point.y} fill={mark.color} fontFamily="Arial, sans-serif" fontSize="24">{mark.text}</text>;
      return mark.points.length === 1
        ? <circle key={index} cx={mark.points[0].x} cy={mark.points[0].y} r={mark.width / 2} fill={mark.color} />
        : <polyline key={index} points={mark.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={mark.color} strokeWidth={mark.width} strokeLinecap="round" strokeLinejoin="round" />;
    })}
  </svg>;
}

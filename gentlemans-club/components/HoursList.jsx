import { hoursRows } from "../data/hours";

export default function HoursList({ inverted = false }) {
  const rows = hoursRows();
  return (
    <dl className="space-y-2 text-sm">
      {rows.map((r) => (
        <div
          key={r.day}
          className={`flex justify-between gap-4 border-b pb-2 last:border-0 ${
            inverted ? "border-white/10" : "border-line"
          }`}
        >
          <dt className={inverted ? "text-slate-300" : "text-slate"}>{r.day}</dt>
          <dd
            className={`font-medium ${
              r.closed ? (inverted ? "text-blue-300" : "text-royal") : inverted ? "text-white" : "text-navy"
            }`}
          >
            {r.text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

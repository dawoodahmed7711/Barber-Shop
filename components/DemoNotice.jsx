import { Info } from "lucide-react";

export default function DemoNotice({ children }) {
  return (
    <div
      role="note"
      className="flex gap-3 rounded-xl border border-royal/20 bg-royal-light p-4 text-sm text-navy"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

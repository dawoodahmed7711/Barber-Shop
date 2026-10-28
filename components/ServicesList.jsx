"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { SERVICES, SERVICE_CATEGORIES } from "../data/services";

export default function ServicesList() {
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? SERVICES : SERVICES.filter((s) => s.category === category);

  return (
    <div>
      <div role="group" aria-label="Filter services by category" className="mb-8 flex flex-wrap gap-2">
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`min-h-[44px] rounded-full border px-5 text-sm font-medium transition ${
              category === c
                ? "border-royal bg-royal text-white"
                : "border-line bg-white text-navy hover:border-royal hover:text-royal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "service" : "services"}
      </p>

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <SearchX className="h-10 w-10 text-royal" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-bold">No services in this category</h3>
          <p className="mt-2 max-w-sm text-sm text-slate">
            Try a different category to see everything we offer.
          </p>
          <button type="button" className="btn-primary mt-5" onClick={() => setCategory("All")}>
            Show all services
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}

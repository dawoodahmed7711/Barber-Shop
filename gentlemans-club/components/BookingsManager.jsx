"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, CalendarX, AlertTriangle, Trash2, X } from "lucide-react";
import BookingSummary from "./BookingSummary";
import ConfirmDialog from "./ConfirmDialog";
import DemoNotice from "./DemoNotice";
import { useToast } from "./Toast";
import { readBookings, cancelBooking, subscribeToBookings } from "../lib/bookings";
import { isBookingPast, formatDateLong, formatTime12h } from "../lib/availability";
import { getServiceById } from "../data/services";

const FILTERS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "all", label: "All" },
];

export default function BookingsManager() {
  const toast = useToast();
  const [bookings, setBookings] = useState(null); // null = not loaded yet (avoids hydration mismatch)
  const [storageError, setStorageError] = useState(null);
  const [filter, setFilter] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [selectedRef, setSelectedRef] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null);

  useEffect(() => {
    const load = () => {
      const { bookings: list, error } = readBookings();
      setBookings(list);
      setStorageError(error);
    };
    load();
    return subscribeToBookings(load);
  }, []);

  const visible = useMemo(() => {
    if (!bookings) return [];
    const q = query.trim().toLowerCase();
    const now = new Date();
    return bookings
      .filter((b) => (filter === "all" ? true : filter === "past" ? isBookingPast(b, now) : !isBookingPast(b, now)))
      .filter((b) => (q ? b.reference.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        const ka = `${a.date}T${a.time}`;
        const kb = `${b.date}T${b.time}`;
        return filter === "past" ? kb.localeCompare(ka) : ka.localeCompare(kb);
      });
  }, [bookings, filter, query]);

  const selected = bookings?.find((b) => b.reference === selectedRef) || null;

  const confirmCancel = () => {
    const ref = pendingCancel;
    setPendingCancel(null);
    const result = cancelBooking(ref);
    if (result.ok) {
      if (selectedRef === ref) setSelectedRef(null);
      toast.show(`Booking ${ref} cancelled. That time slot is available again.`, "success");
    } else {
      toast.show(result.error, "error");
    }
  };

  if (bookings === null) {
    return <p className="text-sm text-slate" role="status">Loading your demo bookings…</p>;
  }

  return (
    <div className="space-y-6">
      <DemoNotice>
        Local demo: these appointments live only in this browser&apos;s storage. They are not
        synced, not secure customer records, and not shared with any business.
      </DemoNotice>

      {storageError && (
        <div role="alert" className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-navy">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p>{storageError}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <CalendarX className="h-10 w-10 text-royal" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold">No bookings yet</h2>
          <p className="mt-2 max-w-sm text-sm text-slate">
            When you save a demo appointment it will appear here.
          </p>
          <Link href="/booking" className="btn-primary mt-5">Book an Appointment</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div role="group" aria-label="Filter bookings" className="flex gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={`min-h-[44px] rounded-full border px-5 text-sm font-medium transition ${
                      filter === f.id
                        ? "border-royal bg-royal text-white"
                        : "border-line bg-white text-navy hover:border-royal hover:text-royal"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative sm:w-64">
                <label htmlFor="ref-search" className="sr-only">Search by booking reference</label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden="true" />
                <input
                  id="ref-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reference, e.g. GC-"
                  className="field pl-9"
                />
              </div>
            </div>

            <p className="sr-only" aria-live="polite">{visible.length} bookings shown</p>

            {visible.length === 0 ? (
              <div className="card px-6 py-10 text-center text-sm text-slate">
                No {filter === "all" ? "" : filter} bookings match{query ? ` “${query}”` : ""}.
              </div>
            ) : (
              <ul className="space-y-3">
                {visible.map((b) => {
                  const svc = getServiceById(b.serviceId);
                  const active = selectedRef === b.reference;
                  return (
                    <li key={b.reference}>
                      <button
                        type="button"
                        onClick={() => setSelectedRef(b.reference)}
                        aria-pressed={active}
                        className={`card w-full p-4 text-left transition hover:border-royal ${active ? "border-royal ring-1 ring-royal" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-sm font-bold text-royal">{b.reference}</p>
                            <p className="mt-1 font-semibold">{svc ? svc.name : b.serviceName}</p>
                            <p className="text-sm text-slate">
                              {formatDateLong(b.date)} · {formatTime12h(b.time)}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${isBookingPast(b) ? "bg-mist text-slate" : "bg-royal-light text-royal"}`}>
                            {isBookingPast(b) ? "Past" : "Upcoming"}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <aside aria-label="Appointment details" className="lg:sticky lg:top-28 lg:self-start">
            {selected ? (
              <div className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">Appointment details</h2>
                    <p className="mt-1 font-mono text-sm font-bold text-royal">{selected.reference}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedRef(null)} className="rounded p-1 text-slate hover:text-navy" aria-label="Close details">
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3">
                  <BookingSummary booking={selected} />
                </div>
                <p className="mt-2 text-sm text-slate">Name: {selected.name}</p>
                {selected.notes && <p className="mt-1 text-sm text-slate">Notes: {selected.notes}</p>}
                <button type="button" className="btn-danger mt-5 w-full" onClick={() => setPendingCancel(selected.reference)}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Cancel Booking
                </button>
              </div>
            ) : (
              <div className="card p-6 text-center text-sm text-slate">
                Select a booking to see its details.
              </div>
            )}
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title="Cancel this booking?"
        message={`Booking ${pendingCancel || ""} will be removed from this browser and its time slot will become available again.`}
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        onConfirm={confirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  );
}

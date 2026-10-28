// Browser-only persistence for DEMO bookings (localStorage).
// Never call these during server rendering — call from effects or event handlers.
import { resolveBarber, isValidDateString } from "./availability.js";

export const STORAGE_KEY = "gc-demo-bookings-v1";
export const CHANGE_EVENT = "gc-bookings-changed";

function isValidBooking(b) {
  return (
    b &&
    typeof b === "object" &&
    typeof b.reference === "string" &&
    typeof b.serviceId === "string" &&
    typeof b.barberId === "string" &&
    isValidDateString(b.date) &&
    typeof b.time === "string" &&
    /^\d{2}:\d{2}$/.test(b.time) &&
    Number.isFinite(b.duration) &&
    Number.isFinite(b.price) &&
    typeof b.name === "string"
  );
}

// Returns { bookings, error }. Malformed entries are dropped; unreadable storage returns error.
export function readBookings() {
  try {
    if (typeof window === "undefined") return { bookings: [], error: null };
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bookings: [], error: null };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { bookings: [], error: "Saved booking data was unreadable and has been ignored." };
    }
    const valid = parsed.filter(isValidBooking);
    const dropped = parsed.length - valid.length;
    return {
      bookings: valid,
      error: dropped > 0 ? `${dropped} damaged booking record(s) were ignored.` : null,
    };
  } catch {
    return {
      bookings: [],
      error: "Browser storage is unavailable or its data is corrupted. Bookings cannot be saved or loaded right now.",
    };
  }
}

function writeBookings(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save to browser storage (it may be full or blocked)." };
  }
}

export function generateReference(existing = []) {
  const taken = new Set(existing.map((b) => b.reference));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    const ref = `GC-${code}`;
    if (!taken.has(ref)) return ref;
  }
  return `GC-${Date.now().toString(36).toUpperCase()}`;
}

// Re-checks conflicts at save time, then stores. Returns { ok, booking? , error? }.
export function createBooking(input) {
  const { bookings, error: readError } = readBookings();
  if (readError && bookings.length === 0 && readError.startsWith("Browser storage")) {
    return { ok: false, error: readError };
  }
  const barberId = resolveBarber(bookings, {
    barberId: input.barberId,
    date: input.date,
    time: input.time,
    duration: input.duration,
  });
  if (!barberId) {
    return {
      ok: false,
      conflict: true,
      error: "Sorry, that time was just taken. Please choose another slot.",
    };
  }
  const booking = {
    ...input,
    barberId,
    reference: generateReference(bookings),
    createdAt: new Date().toISOString(),
  };
  const result = writeBookings([...bookings, booking]);
  if (!result.ok) return result;
  return { ok: true, booking };
}

export function cancelBooking(reference) {
  const { bookings } = readBookings();
  const next = bookings.filter((b) => b.reference !== reference);
  if (next.length === bookings.length) return { ok: false, error: "Booking not found." };
  return writeBookings(next);
}

export function subscribeToBookings(callback) {
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

// Pure scheduling logic (no browser APIs) so it can be unit tested.
// Dates are plain "YYYY-MM-DD" strings interpreted in the BUSINESS timezone,
// which avoids the classic new Date("YYYY-MM-DD") UTC date-shift bug.
import {
  OPENING_HOURS,
  SLOT_INTERVAL_MINUTES,
  MAX_BOOKING_DAYS_AHEAD,
} from "../data/hours.js";
import { SITE } from "../data/site.js";
import { BARBERS } from "../data/barbers.js";

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function isValidDateString(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Current date ("YYYY-MM-DD") and minutes-since-midnight in the business timezone.
export function nowInBusinessTz(now = new Date(), timeZone = SITE.timezone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function dayOfWeek(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isClosedDay(dateStr) {
  const h = OPENING_HOURS[dayOfWeek(dateStr)];
  return !h || !h.open;
}

export function minBookableDate(now = new Date()) {
  return nowInBusinessTz(now).date;
}

export function maxBookableDate(now = new Date()) {
  return addDays(nowInBusinessTz(now).date, MAX_BOOKING_DAYS_AHEAD);
}

export function isPastDate(dateStr, now = new Date()) {
  return dateStr < nowInBusinessTz(now).date;
}

export function formatDateLong(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatTime12h(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

// All start times for a date whose full duration fits before closing.
// Skips slots already in the past when the date is today.
export function generateSlots(dateStr, durationMin, now = new Date()) {
  if (!isValidDateString(dateStr) || !(durationMin > 0)) return [];
  const hours = OPENING_HOURS[dayOfWeek(dateStr)];
  if (!hours || !hours.open) return [];
  const { date: today, minutes: nowMin } = nowInBusinessTz(now);
  if (dateStr < today) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const slots = [];
  for (let t = open; t + durationMin <= close; t += SLOT_INTERVAL_MINUTES) {
    if (dateStr === today && t <= nowMin) continue;
    slots.push(fromMinutes(t));
  }
  return slots;
}

function overlaps(startA, durA, startB, durB) {
  return startA < startB + durB && startB < startA + durA;
}

// True when `barberId` already has a booking overlapping the requested window.
export function hasConflict(bookings, { barberId, date, time, duration }) {
  const start = toMinutes(time);
  return bookings.some(
    (b) =>
      b.barberId === barberId &&
      b.date === date &&
      overlaps(start, duration, toMinutes(b.time), b.duration)
  );
}

// Picks the barber for a booking. For "any", returns the first free barber or null.
export function resolveBarber(bookings, { barberId, date, time, duration }) {
  if (barberId && barberId !== "any") {
    return hasConflict(bookings, { barberId, date, time, duration }) ? null : barberId;
  }
  const free = BARBERS.find(
    (b) => !hasConflict(bookings, { barberId: b.id, date, time, duration })
  );
  return free ? free.id : null;
}

// Slots that are generated AND not taken for the chosen barber (or any barber).
export function getAvailableSlots({ date, duration, barberId, bookings, now = new Date() }) {
  if (!date || !duration || !barberId) return [];
  return generateSlots(date, duration, now).filter(
    (time) => resolveBarber(bookings, { barberId, date, time, duration }) !== null
  );
}

// Is a booking in the past (ended before now)?
export function isBookingPast(booking, now = new Date()) {
  const { date: today, minutes: nowMin } = nowInBusinessTz(now);
  if (booking.date < today) return true;
  if (booking.date > today) return false;
  return toMinutes(booking.time) + booking.duration <= nowMin;
}

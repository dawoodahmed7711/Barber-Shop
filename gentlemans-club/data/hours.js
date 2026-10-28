// Single source of truth for opening hours.
// day: 0 = Sunday ... 6 = Saturday. open/close are "HH:MM" 24h in the business timezone.
// A day with open: null is CLOSED.
export const OPENING_HOURS = {
  0: { open: null, close: null }, // Sunday — closed
  1: { open: "09:00", close: "19:00" },
  2: { open: "09:00", close: "19:00" },
  3: { open: "09:00", close: "19:00" },
  4: { open: "09:00", close: "20:00" },
  5: { open: "09:00", close: "20:00" },
  6: { open: "10:00", close: "17:00" },
};

export const SLOT_INTERVAL_MINUTES = 30;
export const MAX_BOOKING_DAYS_AHEAD = 60;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function to12h(t) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatTime12(t) {
  return to12h(t);
}

// Display rows for footer / hours sections (Mon first).
export function hoursRows() {
  return [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const h = OPENING_HOURS[d];
    return {
      day: DAY_NAMES[d],
      text: h.open ? `${to12h(h.open)} – ${to12h(h.close)}` : "Closed",
      closed: !h.open,
    };
  });
}

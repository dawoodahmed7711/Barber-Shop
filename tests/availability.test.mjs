import test from "node:test";
import assert from "node:assert/strict";
import {
  generateSlots,
  getAvailableSlots,
  hasConflict,
  resolveBarber,
  isClosedDay,
  isValidDateString,
  isBookingPast,
  nowInBusinessTz,
  addDays,
  dayOfWeek,
} from "../lib/availability.js";
import { validateEmail, validatePhone, validateName } from "../lib/validation.js";

// Fixed "now": Monday 2030-01-07 08:00 UTC = 03:00 in America/New_York (before opening).
const NOW = new Date("2030-01-07T08:00:00Z");
const MONDAY = "2030-01-14";
const SUNDAY = "2030-01-13";
const SATURDAY = "2030-01-12"; // 10:00–17:00

test("date helpers avoid timezone shift", () => {
  assert.equal(dayOfWeek(SUNDAY), 0);
  assert.equal(dayOfWeek(MONDAY), 1);
  assert.equal(addDays("2030-12-31", 1), "2031-01-01");
  assert.equal(isValidDateString("2030-02-30"), false);
  assert.equal(isValidDateString("2030-02-28"), true);
});

test("Sunday is closed and yields no slots", () => {
  assert.equal(isClosedDay(SUNDAY), true);
  assert.deepEqual(generateSlots(SUNDAY, 30, NOW), []);
});

test("30-minute intervals and duration must fit before closing", () => {
  const slots = generateSlots(MONDAY, 60, NOW); // open 09:00 close 19:00
  assert.equal(slots[0], "09:00");
  assert.equal(slots[1], "09:30");
  assert.equal(slots.at(-1), "18:00"); // 18:00 + 60 = 19:00 fits
  assert.ok(!slots.includes("18:30")); // would end 19:30
});

test("Saturday short day respects closing time with 50 min service", () => {
  const slots = generateSlots(SATURDAY, 50, NOW); // 10:00–17:00
  assert.equal(slots.at(-1), "16:00"); // ends 16:50
  assert.ok(!slots.includes("16:30")); // ends 17:20
});

test("past dates have no slots; today skips elapsed times", () => {
  assert.deepEqual(generateSlots("2030-01-01", 30, NOW), []);
  // 2030-01-14 12:10 New York = 17:10Z
  const midday = new Date("2030-01-14T17:10:00Z");
  assert.equal(nowInBusinessTz(midday).date, "2030-01-14");
  const slots = generateSlots(MONDAY, 30, midday);
  assert.equal(slots[0], "12:30");
});

test("conflicts are detected per barber with overlapping durations", () => {
  const bookings = [
    { barberId: "marcus-reed", date: MONDAY, time: "10:00", duration: 60 },
  ];
  const q = (barberId, time, duration = 30) => ({ barberId, date: MONDAY, time, duration });
  assert.equal(hasConflict(bookings, q("marcus-reed", "10:00")), true);
  assert.equal(hasConflict(bookings, q("marcus-reed", "10:30")), true);
  assert.equal(hasConflict(bookings, q("marcus-reed", "09:30", 40)), true); // 09:30–10:10 overlaps
  assert.equal(hasConflict(bookings, q("marcus-reed", "11:00")), false); // starts when other ends
  assert.equal(hasConflict(bookings, q("marcus-reed", "09:30")), false); // ends at 10:00
  assert.equal(hasConflict(bookings, q("daniel-cruz", "10:00")), false); // different barber
});

test("available slots exclude booked times and cancellation frees them", () => {
  const booked = [{ barberId: "marcus-reed", date: MONDAY, time: "10:00", duration: 30 }];
  const args = { date: MONDAY, duration: 30, barberId: "marcus-reed", now: NOW };
  assert.ok(!getAvailableSlots({ ...args, bookings: booked }).includes("10:00"));
  assert.ok(getAvailableSlots({ ...args, bookings: [] }).includes("10:00")); // after cancel
});

test("'any barber' stays available until every barber is booked", () => {
  const ids = ["marcus-reed", "daniel-cruz", "omar-hayes"];
  const mk = (n) => ids.slice(0, n).map((barberId) => ({ barberId, date: MONDAY, time: "10:00", duration: 30 }));
  const q = { barberId: "any", date: MONDAY, time: "10:00", duration: 30 };
  assert.equal(resolveBarber(mk(2), q), "omar-hayes");
  assert.equal(resolveBarber(mk(3), q), null);
});

test("booking past detection", () => {
  const b = { date: "2030-01-07", time: "10:00", duration: 30 };
  assert.equal(isBookingPast(b, new Date("2030-01-07T14:00:00Z")), false); // 09:00 NY
  assert.equal(isBookingPast(b, new Date("2030-01-07T16:00:00Z")), true); // 11:00 NY
});

test("validators", () => {
  assert.notEqual(validateEmail("nope"), "");
  assert.equal(validateEmail("a@b.co"), "");
  assert.notEqual(validatePhone("abc"), "");
  assert.notEqual(validatePhone("123"), "");
  assert.equal(validatePhone("+1 (555) 010-2040"), "");
  assert.notEqual(validateName(" "), "");
});

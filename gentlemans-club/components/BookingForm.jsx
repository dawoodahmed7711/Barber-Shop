"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import Field from "./Field";
import DemoNotice from "./DemoNotice";
import BookingConfirmation from "./BookingConfirmation";
import { useToast } from "./Toast";
import { SERVICES, getServiceById } from "../data/services";
import { BARBERS, ANY_BARBER } from "../data/barbers";
import { DAY_NAMES } from "../data/hours";
import {
  getAvailableSlots,
  generateSlots,
  isClosedDay,
  isValidDateString,
  isPastDate,
  dayOfWeek,
  formatTime12h,
  minBookableDate,
  maxBookableDate,
} from "../lib/availability";
import { readBookings, createBooking, subscribeToBookings } from "../lib/bookings";
import { validateName, validateEmail, validatePhone, validateRequired } from "../lib/validation";

const EMPTY = { name: "", email: "", phone: "", serviceId: "", barberId: "", date: "", time: "", notes: "" };

function validateAll(v, slots) {
  const errors = {};
  const set = (k, msg) => { if (msg) errors[k] = msg; };
  set("name", validateName(v.name));
  set("email", validateEmail(v.email));
  set("phone", validatePhone(v.phone));
  set("serviceId", validateRequired(v.serviceId, "Please choose a service."));
  set("barberId", validateRequired(v.barberId, "Please choose a barber."));

  if (!v.date) errors.date = "Please pick an appointment date.";
  else if (!isValidDateString(v.date)) errors.date = "Enter a valid date.";
  else if (isPastDate(v.date)) errors.date = "Past dates can't be booked.";
  else if (v.date > maxBookableDate()) errors.date = "That date is too far ahead. Pick an earlier one.";
  else if (isClosedDay(v.date)) errors.date = `We're closed on ${DAY_NAMES[dayOfWeek(v.date)]}s. Please pick another day.`;

  if (!v.time) errors.time = "Please choose an available time slot.";
  else if (!slots.includes(v.time)) errors.time = "That time is no longer available. Please choose another.";
  return errors;
}

export default function BookingForm() {
  const params = useSearchParams();
  const toast = useToast();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [bookings, setBookings] = useState([]);
  const [storageError, setStorageError] = useState(null);
  const [bounds, setBounds] = useState({ min: "", max: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const formRef = useRef(null);
  const submitTimer = useRef(null);

  // Browser-only init: preselect from the URL, load bookings, compute date bounds.
  useEffect(() => {
    const serviceParam = params.get("service");
    const barberParam = params.get("barber");
    setValues((v) => ({
      ...v,
      serviceId: serviceParam && getServiceById(serviceParam) ? serviceParam : v.serviceId,
      barberId:
        barberParam && (barberParam === "any" || BARBERS.some((b) => b.id === barberParam))
          ? barberParam
          : v.barberId,
    }));
    setBounds({ min: minBookableDate(), max: maxBookableDate() });
  }, [params]);

  useEffect(() => {
    const load = () => {
      const { bookings: list, error } = readBookings();
      setBookings(list);
      setStorageError(error);
    };
    load();
    return subscribeToBookings(load);
  }, []);

  useEffect(() => () => clearTimeout(submitTimer.current), []);

  const service = getServiceById(values.serviceId);

  // Slots refresh automatically when date, barber, service or stored bookings change.
  const slots = useMemo(() => {
    if (!service || !values.barberId || !values.date) return [];
    return getAvailableSlots({
      date: values.date,
      duration: service.duration,
      barberId: values.barberId,
      bookings,
    });
  }, [service, values.barberId, values.date, bookings]);

  const allSlotsCount = useMemo(
    () => (service && values.date ? generateSlots(values.date, service.duration).length : 0),
    [service, values.date]
  );

  // Drop a selected time that is no longer available.
  useEffect(() => {
    if (values.time && !slots.includes(values.time)) {
      setValues((v) => ({ ...v, time: "" }));
    }
  }, [slots, values.time]);

  const update = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
  };

  const blur = (key, fn) => () => {
    const msg = fn(values[key]);
    setErrors((er) => ({ ...er, [key]: msg }));
  };

  const dateClosed = values.date && isValidDateString(values.date) && isClosedDay(values.date);

  const onSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    const found = validateAll(values, slots);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      const el = formRef.current?.querySelector(`#${firstKey}, [data-field="${firstKey}"]`);
      el?.focus();
      toast.show("Please fix the highlighted fields.", "error");
      return;
    }
    setSubmitting(true);
    // Short delay simulates processing; there is no server involved.
    submitTimer.current = setTimeout(() => {
      const result = createBooking({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        serviceId: service.id,
        serviceName: service.name,
        barberId: values.barberId,
        date: values.date,
        time: values.time,
        duration: service.duration,
        price: service.price,
        notes: values.notes.trim(),
      });
      setSubmitting(false);
      if (!result.ok) {
        toast.show(result.error, "error");
        if (result.conflict) {
          const { bookings: list } = readBookings();
          setBookings(list);
          setValues((v) => ({ ...v, time: "" }));
        }
        return;
      }
      setConfirmed(result.booking);
      toast.show("Demo booking saved in this browser.", "success");
    }, 700);
  };

  const reset = () => {
    setConfirmed(null);
    setErrors({});
    setValues(EMPTY);
  };

  if (confirmed) return <BookingConfirmation booking={confirmed} onBookAnother={reset} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <form ref={formRef} onSubmit={onSubmit} noValidate className="card space-y-5 p-5 sm:p-8" aria-label="Appointment booking form">
        <DemoNotice>
          Portfolio demo: bookings are saved only in this browser and are never sent to a real business.
        </DemoNotice>

        {storageError && (
          <div role="alert" className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-navy">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p>{storageError}</p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Full name" required error={errors.name}>
            {(p) => <input {...p} type="text" autoComplete="name" value={values.name} onChange={update("name")} onBlur={blur("name", validateName)} placeholder="Your full name" />}
          </Field>
          <Field id="email" label="Email" required error={errors.email}>
            {(p) => <input {...p} type="email" autoComplete="email" value={values.email} onChange={update("email")} onBlur={blur("email", validateEmail)} placeholder="name@example.com" />}
          </Field>
        </div>

        <Field id="phone" label="Phone number" required error={errors.phone}>
          {(p) => <input {...p} type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={update("phone")} onBlur={blur("phone", validatePhone)} placeholder="+1 555 010 2040" />}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="serviceId" label="Service" required error={errors.serviceId}>
            {(p) => (
              <select {...p} value={values.serviceId} onChange={update("serviceId")}>
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — ${s.price} · {s.duration} min</option>
                ))}
              </select>
            )}
          </Field>
          <Field id="barberId" label="Preferred barber" required error={errors.barberId}>
            {(p) => (
              <select {...p} value={values.barberId} onChange={update("barberId")}>
                <option value="">Select a barber</option>
                <option value={ANY_BARBER.id}>{ANY_BARBER.name}</option>
                {BARBERS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field
          id="date"
          label="Appointment date"
          required
          error={errors.date}
          hint="Closed on Sundays. Past dates are disabled."
        >
          {(p) => (
            <input
              {...p}
              type="date"
              value={values.date}
              min={bounds.min || undefined}
              max={bounds.max || undefined}
              onChange={update("date")}
            />
          )}
        </Field>

        <fieldset aria-describedby={errors.time ? "time-error" : undefined}>
          <legend className="mb-1.5 text-sm font-medium text-navy">
            Available time slot<span className="text-royal" aria-hidden="true"> *</span>
          </legend>

          {!service || !values.barberId || !values.date ? (
            <p className="rounded-lg border border-dashed border-line bg-mist p-4 text-sm text-slate">
              Choose a service, barber and date to see available times.
            </p>
          ) : dateClosed ? (
            <p className="rounded-lg border border-line bg-mist p-4 text-sm text-slate">
              We&apos;re closed on that day. Please pick another date.
            </p>
          ) : slots.length === 0 ? (
            <p className="rounded-lg border border-line bg-mist p-4 text-sm text-slate">
              {allSlotsCount === 0
                ? "No times remain for that date. Try another day."
                : "All times are booked for this selection. Try another barber or date."}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((t, i) => (
                <label
                  key={t}
                  className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition focus-within:outline focus-within:outline-[3px] focus-within:outline-royal ${
                    values.time === t
                      ? "border-royal bg-royal text-white"
                      : "border-line bg-white text-navy hover:border-royal hover:text-royal"
                  }`}
                >
                  <input
                    type="radio"
                    name="time"
                    value={t}
                    data-field={i === 0 ? "time" : undefined}
                    checked={values.time === t}
                    onChange={update("time")}
                    className="sr-only"
                  />
                  {formatTime12h(t)}
                </label>
              ))}
            </div>
          )}
          {errors.time && (
            <p id="time-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.time}</p>
          )}
        </fieldset>

        <Field id="notes" label="Notes" hint="Anything your barber should know?">
          {(p) => <textarea {...p} rows={3} value={values.notes} onChange={update("notes")} maxLength={300} />}
        </Field>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving demo booking…
            </>
          ) : (
            "Confirm Demo Booking"
          )}
        </button>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Booking estimate">
        <div className="card p-5 sm:p-6">
          <h2 className="text-xl font-bold">Your estimate</h2>
          {service ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-slate">Service</dt><dd className="font-medium">{service.name}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate">Duration</dt><dd className="font-medium">{service.duration} minutes</dd></div>
              <div className="flex justify-between gap-3 border-t border-line pt-3"><dt className="text-slate">Estimated price</dt><dd className="text-xl font-bold text-royal">${service.price}</dd></div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate">Select a service to see the estimated price and duration.</p>
          )}
          <p className="mt-4 text-xs text-slate">Prices are fictional demo values. No payment is taken.</p>
        </div>
      </aside>
    </div>
  );
}

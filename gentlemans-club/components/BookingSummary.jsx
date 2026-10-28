import { CalendarDays, Clock, DollarSign, Scissors, User } from "lucide-react";
import { formatDateLong, formatTime12h } from "../lib/availability";
import { getServiceById } from "../data/services";
import { getBarberById } from "../data/barbers";

// Shared detail list used by the confirmation panel and the My Bookings detail view.
export default function BookingSummary({ booking }) {
  const service = getServiceById(booking.serviceId);
  const barber = getBarberById(booking.barberId);
  const rows = [
    { icon: Scissors, label: "Service", value: service ? service.name : booking.serviceName || booking.serviceId },
    { icon: User, label: "Barber", value: barber ? barber.name : booking.barberId },
    { icon: CalendarDays, label: "Date", value: formatDateLong(booking.date) },
    { icon: Clock, label: "Time", value: `${formatTime12h(booking.time)} (${booking.duration} min)` },
    { icon: DollarSign, label: "Price", value: `$${booking.price} (pay in shop — demo)` },
  ];
  return (
    <dl className="divide-y divide-line">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3 py-3">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />
          <dt className="w-20 shrink-0 text-sm text-slate">{label}</dt>
          <dd className="text-sm font-medium text-navy">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

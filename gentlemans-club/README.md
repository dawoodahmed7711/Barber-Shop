# The Gentleman's Club — Premium Barber Shop (Portfolio Demo)

Next.js 14 (App Router) · JavaScript/JSX · Tailwind CSS · Lucide React · LocalStorage.

> **Portfolio demo.** All business details, prices, barbers and testimonials are fictional.
> There is no backend: bookings are saved only in the current browser's LocalStorage and the
> contact form does not send messages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm test           # unit tests for slot generation, conflicts, validation
npm run build && npm start
```

## Where to edit things

| What | File |
| --- | --- |
| Business name, phone, email, address, timezone, socials, testimonials | `data/site.js` |
| Opening hours, closed days, slot interval | `data/hours.js` |
| Services and prices | `data/services.js` |
| Barber profiles | `data/barbers.js` |
| Gallery images | `data/gallery.js` |
| Colors | `tailwind.config.js` |

Images use Unsplash URLs (allowed in `next.config.mjs`). Replace them with your own photos in
`public/images/` and update the data files for a real client project. Every image has a
loading skeleton and an error fallback.

## Booking logic

- `lib/availability.js` — pure functions: slots, closing-time fit, overlap conflicts, "any barber".
- `lib/bookings.js` — LocalStorage read/write with malformed-data and storage-error handling.
- Dates are `YYYY-MM-DD` strings evaluated in the business timezone (no date-shift bugs).

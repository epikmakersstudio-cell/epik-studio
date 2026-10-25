# Epikmakers Backend & Admin Dashboard Brief

2026-09-26

## Overview

Epikmakers needs a backend API and a password-protected admin dashboard so the studio can run the website without code changes. The admin uploads service photos (each with an optional Instagram post link) and client reviews; clients sign up, sign in, book sessions and send messages. The React front end is already built and waits for this API through a single setting, `VITE_API_URL`.

## Where the site is today

The front end is a Vite + React + TypeScript + Tailwind app (shadcn/ui, React Router, TanStack Query), deployed on Vercel at epikmakers.vercel.app. Every piece below already exists and only needs a real API behind it.

| Area | Front-end file | Current behaviour |
| --- | --- | --- |
| API address | `src/lib/api.ts` | Reads `VITE_API_URL` (falls back to `VITE_AUTH_API_URL`). Unset = site runs without a backend |
| Sign in / sign up | `src/lib/auth.ts`, `src/pages/SignIn.tsx`, `src/pages/SignUp.tsx` | Calls `POST /auth/signin` and `POST /auth/signup`; expects `{ user, token }` |
| Session storage | `src/hooks/useAuth.tsx` | Keeps `{ user, token }` in localStorage |
| Site lock | `src/components/RequireAuth.tsx`, `LOGIN_REQUIRED` in `src/lib/auth.ts` | Every page except Sign In / Sign Up requires sign-in once the API URL is set |
| Portfolio gallery | `src/lib/gallery.ts`, `src/components/PortfolioGallery.tsx` | Calls `GET /portfolio/{service}/photos` with a Bearer token; only instagram.com links are shown |
| Reviews | `src/data/reviews.ts` (Reviews + Pricing pages) | Hard-coded sample reviews |
| Contact + booking | `src/pages/Contact.tsx`, `src/components/BookingCalendar.tsx` | One form, two tabs; submit only shows a toast, nothing is sent |
| Services | `src/data/services.ts` | Six fixed services (ids below) |

Service ids used everywhere: `fashion`, `wedding`, `baby-shower-maternity`, `pre-birthday-birthday`, `newborn`, `family-portraits`.

## Requirements

Build a backend API and an admin dashboard for the Epikmakers website, and connect the existing front end to them.

1. **Client accounts.** Clients can sign up and sign in. The whole public site stays locked until they do.
2. **Service photos.** The admin uploads photos for each of the six services. Each photo can carry an optional Instagram post link. The Portfolio gallery shows them, newest first, with a "View on Instagram" link.
3. **Reviews.** The admin adds, edits, hides and deletes client reviews (name, session type, date, rating 1–5, text). The Reviews page and the Pricing page's ratings section read them from the API.
4. **Contact messages.** The "Send a Message" form saves each message. The admin sees them in the dashboard and gets an email alert.
5. **Session bookings.** The "Book a Session" form saves a booking request (service, date, time slot, contact details, notes). The admin confirms, reschedules or declines it, and the client gets an email for each change.
6. **Admin dashboard.** A separate, admin-only area to manage all of the above.
7. **Remaining pieces.**
    - Booked time slots become unavailable in the booking calendar.
    - Signed-in clients can see their own bookings and their status.
    - Password reset by email.
    - Front-end wiring for everything above, replacing the sample data and fake submits.

## API contract

All endpoints return JSON. Errors return `{ "message": "..." }` with a 4xx/5xx status; the front end shows that message to the user. The first three rows are already called by the front end and must keep these exact paths and shapes.

| Method | Path | Who | Request | Response |
| --- | --- | --- | --- | --- |
| POST | `/auth/signup` | Public | `{ name, email, phone?, password }` | `{ user: { id, name, email }, token }` |
| POST | `/auth/signin` | Public | `{ email, password }` | `{ user, token }` |
| GET | `/portfolio/{serviceId}/photos` | Signed-in client | — | `[{ id, imageUrl, caption?, instagramUrl? }]`, newest first |
| POST | `/auth/forgot-password` | Public | `{ email }` | `204` (always, to avoid revealing accounts) |
| POST | `/auth/reset-password` | Public | `{ token, password }` | `204` |
| GET | `/auth/me` | Signed-in client | — | `{ user }` (lets the site check a stored token is still valid) |
| GET | `/reviews` | Signed-in client | — | `[{ id, name, role, date, rating, content }]`, published only, newest first |
| POST | `/contact` | Signed-in client | `{ name, email, phone?, serviceId?, message }` | `201 { id }` |
| GET | `/bookings/availability?date=YYYY-MM-DD` | Signed-in client | — | `{ date, slots: [{ time, available }] }` |
| POST | `/bookings` | Signed-in client | `{ serviceId?, date, time, name, email, phone?, notes? }` | `201 { id, status: "pending" }`; `409` if the slot was just taken |
| GET | `/bookings/mine` | Signed-in client | — | The client's bookings with status |
| POST | `/admin/auth/signin` | Public | `{ email, password }` | `{ admin, token }` |
| GET, POST | `/admin/photos` | Admin | multipart: `image`, `serviceId`, `caption?`, `instagramUrl?` | Photo list / created photo |
| PATCH, DELETE | `/admin/photos/{id}` | Admin | `{ caption?, instagramUrl?, serviceId?, sortOrder? }` | Updated photo / `204` |
| GET, POST | `/admin/reviews` | Admin | `{ name, role, date, rating, content, published }` | Review list / created review |
| PATCH, DELETE | `/admin/reviews/{id}` | Admin | Any review field | Updated review / `204` |
| GET | `/admin/messages` | Admin | `?status=new\|read\|archived` | Messages, newest first |
| PATCH | `/admin/messages/{id}` | Admin | `{ status }` | Updated message |
| GET | `/admin/bookings` | Admin | `?status=&from=&to=` | Bookings |
| PATCH | `/admin/bookings/{id}` | Admin | `{ status, date?, time?, adminNote? }` | Updated booking; emails the client |
| GET, PUT | `/admin/settings/slots` | Admin | Weekly opening hours and slot length | Current settings |

Front-end validation already applied (keep the same rules on the server): email format, name ≤ 100 characters, phone ≤ 20, message ≤ 1000, password ≥ 8 characters with a letter and a number. `instagramUrl` must be an `https://instagram.com/...` or `https://www.instagram.com/...` address.

## Admin dashboard

The dashboard lives at `/admin` inside this same React app, uses the site's existing look (pink brand colour, shadcn/ui components) and is reachable only with an admin sign-in, never a client one.

| Screen | What the admin does |
| --- | --- |
| Sign in | Email + password; separate from client accounts |
| Overview | Counts of new messages, pending bookings and upcoming sessions this week; quick links to each |
| Photos | Pick a service, drag-and-drop several photos at once, add a caption and Instagram post link to each, reorder by dragging, edit or delete; preview exactly as the Portfolio gallery shows it |
| Reviews | Add, edit, publish/unpublish and delete reviews; star rating picker; live preview of the average rating shown on Pricing |
| Messages | Inbox of contact messages; mark read or archived; reply opens the admin's email app pre-filled |
| Bookings | List and calendar views; filter by status and date; confirm, reschedule or decline with an optional note; each change emails the client |
| Availability | Weekly opening hours (today Mon–Fri 10am–8pm, Sat 10am–4pm), slot length, and blocked dates such as holidays |

Every list is paginated, works on a phone, and asks before deleting anything.

## Data model

Seven tables cover everything; services stay as the six fixed ids in `src/data/services.ts` rather than a table.

| Table | Fields |
| --- | --- |
| `users` | id, name, email (unique), phone, passwordHash, createdAt |
| `admins` | id, name, email (unique), passwordHash, createdAt |
| `photos` | id, serviceId, imageUrl, storageKey, caption, instagramUrl, sortOrder, createdAt |
| `reviews` | id, name, role (session type), date, rating (1–5), content, published, createdAt |
| `messages` | id, userId, name, email, phone, serviceId, message, status (new / read / archived), createdAt |
| `bookings` | id, userId, serviceId, date, time, name, email, phone, notes, status (pending / confirmed / rescheduled / declined / cancelled), adminNote, createdAt, updatedAt |
| `availability` | weekly hours per weekday, slotMinutes, blockedDates |

A unique rule on (date, time) for active bookings stops two clients from taking the same slot.

## Security, storage and deployment

- **Passwords** hashed with bcrypt or argon2; never returned or logged.
- **Tokens**: signed, expiring tokens (for example JWT, 7 days for clients, 12 hours for admins). Admin tokens are rejected on client endpoints and the reverse.
- **Admin accounts** are created by a one-off script or seed command, never through a public sign-up.
- **Rate limits** on sign-in, sign-up, password reset, contact and booking endpoints.
- **Validation** on every request, matching the front-end rules in the API contract.
- **Photo uploads**: JPEG, PNG or WebP only, 15 MB maximum, resized to a web size (about 2000px on the long edge) plus a thumbnail, and stripped of camera metadata. Stored in object storage (for example Cloudinary, S3 or Vercel Blob), never in the database or the repo.
- **CORS** allows only the site's own domains (epikmakers.vercel.app plus local development).
- **Email** for booking updates, new-message alerts and password resets goes through a transactional email service; the admin alert address is epiclittlenest@gmail.com.
- **Deployment**: the front end stays on Vercel. Setting `VITE_API_URL` there switches on sign-in, the site lock and the API gallery at once, so the API must be live before that variable is set.
- **Secrets** (database URL, token secret, storage and email keys) live in environment variables, with a `.env.example` listing their names only.

## Prompt for the AI coding assistant

Paste this into Claude Code (or a similar assistant) opened in the `epik-studio` repo. It is self-contained; the tables above are the reference it points to.

```markdown
You are working in the `epik-studio` repo: the Epikmakers Photography website (Vite + React + TypeScript + Tailwind + shadcn/ui, React Router, TanStack Query), deployed on Vercel. Build its backend API and an admin dashboard, then connect the existing front end to them.

## Goal
The studio admin must be able to run the site without code changes:
1. Upload photos for each of the six services, each with an optional Instagram post link, shown in the Portfolio gallery.
2. Add, edit, publish/unpublish and delete client reviews shown on the Reviews page and the Pricing page ratings section.
3. Receive contact messages from the Contact page "Send a Message" form.
4. Receive and manage session bookings from the Contact page "Book a Session" form (confirm, reschedule, decline; client is emailed each time).
Clients sign up and sign in; the whole site (except Sign In / Sign Up) is for signed-in clients only.

## What already exists (read these first, keep their contracts)
- `src/lib/api.ts`: API base URL from `VITE_API_URL` (fallback `VITE_AUTH_API_URL`). When unset, the site must keep working with no backend.
- `src/lib/auth.ts`: `POST /auth/signin` and `POST /auth/signup`, both return `{ user: { id, name, email }, token }`. `LOGIN_REQUIRED` turns the site lock on when the API URL is set.
- `src/hooks/useAuth.tsx`: stores `{ user, token }` in localStorage key `epikmakers.session`.
- `src/components/RequireAuth.tsx`, `src/App.tsx`: route guard around every page except `/signin` and `/signup`.
- `src/lib/gallery.ts`, `src/components/PortfolioGallery.tsx`: `GET /portfolio/{serviceId}/photos` with `Authorization: Bearer <token>`, expects `[{ id, imageUrl, caption?, instagramUrl? }]`; only https instagram.com links are rendered.
- `src/data/services.ts`: the six service ids: fashion, wedding, baby-shower-maternity, pre-birthday-birthday, newborn, family-portraits.
- `src/data/reviews.ts`: sample reviews used by `src/pages/Reviews.tsx` and `src/pages/Pricing.tsx`.
- `src/pages/Contact.tsx`, `src/components/BookingCalendar.tsx`: one form with Booking / Message tabs; submit currently only shows a toast.

## Backend
- Node.js + TypeScript in a new `server/` folder of this repo, with PostgreSQL via Prisma. If you think a different setup fits Vercel better (for example Vercel functions + Neon), propose it before building.
- Tables: users (name, email, phone, passwordHash); admins (name, email, passwordHash); photos (serviceId, imageUrl, storageKey, caption, instagramUrl, sortOrder); reviews (name, role, date, rating 1-5, content, published); messages (userId, name, email, phone, serviceId, message, status new/read/archived); bookings (userId, serviceId, date, time, name, email, phone, notes, status pending/confirmed/rescheduled/declined/cancelled, adminNote; unique active date+time); availability (weekly hours, slotMinutes, blockedDates). All with id and timestamps.
- Endpoints (JSON; errors return `{ "message" }` with a 4xx/5xx status):
  - Client: POST /auth/signup, POST /auth/signin, GET /auth/me, POST /auth/forgot-password, POST /auth/reset-password, GET /portfolio/{serviceId}/photos, GET /reviews, POST /contact, GET /bookings/availability?date=, POST /bookings (409 if slot taken), GET /bookings/mine.
  - Admin (separate admin token): POST /admin/auth/signin; CRUD /admin/photos (multipart upload), /admin/reviews; GET+PATCH /admin/messages; GET+PATCH /admin/bookings; GET+PUT /admin/settings/slots.
- Security: bcrypt/argon2 password hashes; expiring signed tokens; admin tokens never accepted on client routes and vice versa; admins created only by a seed script; rate limits on auth, contact and booking; server-side validation matching the front end (email, name ≤100, phone ≤20, message ≤1000, password ≥8 with a letter and a number, instagramUrl must be https instagram.com); CORS limited to epikmakers.vercel.app and localhost.
- Photos: JPEG/PNG/WebP, ≤15 MB, resized to ~2000px plus a thumbnail, metadata stripped, stored in object storage (Cloudinary, S3 or Vercel Blob), never in the DB or repo.
- Email: booking status changes to the client; new message and new booking alerts to epiclittlenest@gmail.com; password reset links.
- Secrets only in env vars; add `.env.example` with names only.

## Admin dashboard
At `/admin` in this React app, using the existing design (brand pink, shadcn/ui), admin sign-in only. Screens: Overview (new messages, pending bookings, this week's sessions), Photos (per service: multi-upload, caption + Instagram link per photo, drag to reorder, edit, delete, gallery preview), Reviews (CRUD, publish toggle, star picker), Messages (inbox, read/archive), Bookings (list + calendar, filters, confirm/reschedule/decline with note), Availability (weekly hours, slot length, blocked dates). Mobile-friendly, paginated, confirm before delete.

## Front-end wiring
- Reviews and Pricing read `/reviews` (fall back to `src/data/reviews.ts` when the API URL is unset).
- Contact "Send a Message" posts to `/contact`; "Book a Session" loads availability for the chosen date and posts to `/bookings`; replace the fake submits and show API errors.
- Add "My bookings" for signed-in clients and a forgot/reset password flow.
- Validate a stored token with `/auth/me` on load; sign out on 401.

## How to work
1. Read the files above and confirm the plan with me before writing code.
2. Build in this order, one reviewable step at a time: backend foundation + auth; photos (API + admin screen + gallery); reviews; contact; bookings + availability; admin overview; client extras.
3. Keep every existing front-end path and response shape; the site must still run with `VITE_API_URL` unset.
4. Add tests for the API (auth, permissions, validation, double-booking) and run type check, lint and tests after each step.
5. Never commit secrets; tell me which environment variables to set on Vercel and on the API host.
```

## Open decisions

- [ ] Where the API runs: a `server/` app on its own host (Render, Railway) or Vercel functions next to the site.
- [ ] Photo storage provider: Cloudinary, S3 or Vercel Blob.
- [ ] Email service for booking updates and alerts, and the sending address.
- [ ] Booking slot length and how far ahead clients can book.
- [ ] Whether bookings need a deposit or online payment now, or later.
- [ ] Whether the home page should stay public for search engines and Google Maps, instead of the whole site being locked.
- [ ] The real artist name and bio for the About page, and real reviews to replace the sample ones.

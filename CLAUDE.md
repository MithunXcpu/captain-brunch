# CLAUDE.md — Caption Brunch

## What This Is
A bill-splitting app with a retro diner theme, supporting Stripe payments, SMS invites via Twilio, and Clerk authentication.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (**NEVER** use custom `*` CSS reset or arbitrary bracket values like `bg-[#hex]`)
- Clerk (@clerk/nextjs, @clerk/themes) for authentication
- Stripe (@stripe/stripe-js, stripe) for payment processing
- Supabase (@supabase/supabase-js) for backend/storage
- Prisma for database ORM (schema in `prisma/schema.prisma`)
- Twilio for SMS invite notifications
- Playwright for end-to-end testing

## Key Architecture

### Routes (`src/app/`)
- `/` — Landing page
- `/demo` — Interactive demo
- `/split` — Create a new bill split (authenticated)
- `/split/success` — Payment success confirmation
- `/join/[code]` — Join a split via invite code
- `/contact` — Contact form (Formspree, needs form ID -- currently placeholder)
- `/sign-in` — Clerk sign-in (`[[...sign-in]]`)
- `/sign-up` — Clerk sign-up (`[[...sign-up]]`)

### API Routes (`src/app/api/`)
- `POST /api/splits` — Create a split
- `GET/PATCH /api/splits/[id]` — Get/update a split
- `POST /api/splits/[id]/pay` — Process Stripe payment for a split
- `POST /api/sms/invite` — Send SMS invite via Twilio
- `POST /api/webhooks/stripe` — Stripe webhook handler

### Lib (`src/lib/`)
- `db.ts` — Database client (Prisma)
- `stripe.ts` — Stripe client initialization
- `twilio.ts` — Twilio client initialization
- `validation.ts` — Input validation utilities

### Database
- `prisma/schema.prisma` — Prisma schema defining splits, participants, payments

### Tests (`tests/`)
- `home.spec.ts` — Home page e2e test
- `join.spec.ts` — Join flow e2e test

## Commands
```bash
npm run dev            # Start dev server
npm run build          # prisma generate && next build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run test           # Run Playwright tests
npm run test:ui        # Playwright tests with UI
npm run test:headed    # Playwright tests in headed browser
npm run db:generate    # Regenerate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Run Prisma migrations
npm run db:studio      # Open Prisma Studio
```

## Conventions
- Accent color: amber (`--color-primary`)
- Retro diner theme, dark throughout
- Formspree for /contact page (needs form ID -- currently `xplaceholder`)
- Clerk handles all auth flows
- Stripe handles payments with webhook confirmation
- SMS invites sent via Twilio when sharing a split

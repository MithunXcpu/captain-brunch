# AGENTS.md — Captain Brunch

## Project overview

Captain Brunch is a bill-splitting web application that eliminates awkward math at the dinner table. Users create splits, add participants, and generate shareable payment links. The app handles complex split calculations, accepts payments via Stripe, and sends SMS reminders via Twilio.

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 with custom design tokens (espresso/burgundy/mustard theme)
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Auth:** Clerk (OAuth-based)
- **Payments:** Stripe (payment processing & virtual cards)
- **SMS:** Twilio (invitations & reminders)
- **Testing:** Playwright (E2E)
- **Deployment:** Vercel

## Setup commands

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# E2E tests
npx playwright test
```

## Environment variables

```
DATABASE_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Code style

- Use TypeScript strict mode
- Prefer `const` over `let`, never use `var`
- Use async/await over raw promises
- Components in `/src/components`, pages in `/src/app`
- API routes in `/src/app/api`
- Database queries go through Prisma client in `/src/lib/prisma.ts`
- Form validation with Zod schemas

## Architecture

### Page flow
1. `/` — Landing page with hero, features, CTAs
2. `/split` — 4-step wizard (bill → people → review → share)
3. `/join/[code]` — Public payment page (no auth required)
4. `/dashboard` — User's split history

### Database models
- **User** — Clerk IDs, contact info, Stripe customer IDs
- **Split** — Bill info, amounts, share codes, status
- **SplitParticipant** — Individual payer details, payment status
- **PaymentMethod** — Saved Stripe payment methods
- **SmsLog** — SMS notification records

### API routes
- `GET/POST /api/splits` — List/create splits
- `GET /api/splits/[id]` — Get split details
- `POST /api/splits/[id]/pay` — Process payment
- `POST /api/sms/invite` — Send SMS invitations
- `POST /api/webhooks/stripe` — Stripe webhook handler

## Testing instructions

- Run `npm run dev` and test the 4-step split flow
- Verify Stripe test payments work
- Test SMS sending (use Twilio test credentials)
- Check mobile responsiveness at 375px, 768px, 1024px
- Verify Clerk auth flow (sign up, sign in, sign out)

## Do not

- Do NOT store raw card numbers — use Stripe tokens only
- Do NOT commit `.env` files
- Do NOT bypass Clerk authentication on protected routes
- Do NOT hardcode Twilio phone numbers
- Do NOT modify Prisma schema without running migrations

## Deployment

```bash
# Deploy to Vercel
npx vercel --prod

# Run Prisma migrations on production
npx prisma migrate deploy
```

## MCP servers (recommended)

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

## Prompt patterns

```markdown
## Task
[Specific. Include component names, API routes, expected behavior.]

## Background
[Relevant code snippets. Database schema if touching data.]

## Do not
[What should NOT be touched. List protected routes, payment logic, etc.]
```

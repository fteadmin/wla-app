

# World Lowrider Association (WLA) Platform — MVP Plan

## Overview
A premium, dark-themed membership platform for the World Lowrider Association. Members pay $20/year for access, earn BLVD tokens, and participate in the community. Built with React + Vite, Supabase (auth + database + realtime), and Stripe (payments).

---

## Phase 1: Foundation & Landing Page

### Branding & Design System
- Dark luxury UI with colors: black `#000000`, gold `#D9BA84`, accent gold `#c8b450`, silver `#a0a0b4`, white `#ffffff`
- Glass-morphism cards, gold glow buttons, smooth animated transitions (Framer Motion)
- Fully responsive across all devices

### Landing Page
- **Cinematic Hero** — Bold headline about the WLA mission, animated background, prominent "Join WLA" CTA button with gold glow
- **About WLA** — Mission and vision section
- **Membership Tiers** — 3 cards showing Basic ($20/yr, purchasable), Founding Member (info-only badge), Legacy Member (info-only badge)
- **Marketplace Preview** — Teaser of what members can access
- **Contest Preview** — Teaser of photo competitions
- **Footer** — Links, socials, branding

---

## Phase 2: Authentication & Roles

### Supabase Setup
- Connect Supabase to the project
- Email/password authentication with signup and login pages
- Password reset flow with dedicated reset page

### Role System
- `user_roles` table with enum: `admin`, `basic_member`, `founding_member`, `legacy_member`
- New signups default to no role (guest-level, unpaid)
- Admin auto-assigned to emails ending in `@futuretrendsent.info`
- Security definer helper function `has_role()` to prevent RLS recursion

### Access Control
- **Not logged in** → Can only see landing page
- **Logged in, unpaid** → Redirected to membership payment page
- **Active member** → Full dashboard access
- **Admin** → Full admin panel access

---

## Phase 3: Membership & Stripe Payments

### Stripe Integration
- Enable Stripe and connect API keys
- $20/year Basic Membership product created in Stripe
- Checkout flow: Signup → redirected to pay → Stripe webhook confirms payment

### Membership System
- `memberships` table: user_id, membership_id (WLA-XXXXX format), status, type, start/expiry dates
- On successful payment via webhook: generate unique WLA-XXXXX ID, activate membership, store in DB
- QR code generated from membership ID (encodes a public verification URL)
- QR scanning opens a **public verification page** showing member name, ID, and active status
- Admins can also scan/input membership IDs in the admin panel for full user details

---

## Phase 4: BLVD Token System

### Token Packs via Stripe
- 4 purchasable packs: 100/$1, 500/$5, 1000/$10, 5000/$50
- One-time Stripe payments, webhook updates token balance

### Database
- `tokens` table: user_id, balance
- `token_transactions` table: user_id, amount, type (purchase/admin_add/admin_remove), timestamp
- Realtime subscription on token balance for live dashboard updates

### Admin Token Controls
- Add, remove, or reset tokens for any user from the admin panel

---

## Phase 5: Member Dashboard

### Dashboard Page
- Membership status card with active/inactive badge
- QR code display (downloadable)
- Membership ID prominently shown
- BLVD token balance with realtime updates
- Notifications feed
- Active contests preview
- Quick links to marketplace and contests

---

## Phase 6: Admin Panel

### Admin Dashboard
- User management: view all users, memberships, roles
- Payment history from Stripe
- Token management: adjust balances per user
- Contest management: create, start, end contests
- QR scanner / Membership ID lookup to retrieve full user info
- Analytics overview: total members, tokens in circulation, active contests

---

## Future Phases (Post-MVP)
These features will be built after the core platform is solid:
- **Marketplace** — Members post and buy items
- **Contests** — Photo submission and voting
- **Realtime Messaging** — 1-to-1 member chat
- **Notifications System** — In-app notification center
- **Content Uploads** — Media submissions for competitions

---

## Technical Architecture Summary
- **Frontend:** React + Vite + React Router + Tailwind CSS + Framer Motion
- **Backend:** Supabase (Auth, Postgres, Realtime, RLS)
- **Payments:** Stripe (webhooks via Supabase Edge Functions)
- **Security:** Row-Level Security on all tables, role-based access via security definer functions, JWT validation in edge functions


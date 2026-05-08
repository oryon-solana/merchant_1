# Whitesinyo Coffee — Merchant Portal

> Specialty coffee experience with a blockchain-powered loyalty rewards system, built for the Orion Hackathon.

---

## Overview

**Whitesinyo Coffee** is a modern e-commerce and loyalty platform for a specialty coffee shop. Customers can browse the menu, place orders, and earn loyalty points — with Solana blockchain wallet integration for the next generation of rewards.

The merchant portal demonstrates how traditional F&B businesses can adopt Web3 infrastructure without sacrificing the familiar shopping experience their customers expect.

---

## Features

### Shopping Experience
- Browse full menu with category filtering (Espresso, Specialty, Cold, Pastries)
- Search products in real-time
- Add to cart with quantity controls and live total calculation
- Checkout flow with order summary

### Loyalty Points System
- Earn 1 point per Rp 10 spent automatically after each purchase
- View accumulated points balance on your account dashboard
- Full transaction history with timestamps and amounts
- Points estimate preview before checkout

### Authentication
- Email/password registration and login
- Google OAuth sign-in
- JWT-based sessions with refresh token rotation
- Email verification flow

### Blockchain Integration
- Connect a **Phantom Wallet** (Solana) to your account
- Wallet address stored and linked to user profile
- Foundation for future on-chain rewards and token distribution

### User Account
- Profile management (name, email, phone)
- Points balance and tier display
- Transaction history
- Wallet connection status and management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn/ui (Radix UI) |
| Animations | Framer Motion + Lenis |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jose) + bcrypt |
| Blockchain | Phantom Wallet (Solana) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- (Optional) Phantom Wallet browser extension for blockchain features

### Installation

```bash
git clone https://github.com/your-org/merchant_1.git
cd merchant_1
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
merchant_1/
├── app/
│   ├── (protected)/          # Auth-gated pages (account, points history)
│   ├── api/                  # Backend API routes
│   │   ├── auth/             # Login, register, OAuth, refresh
│   │   ├── cart/             # Cart management
│   │   ├── orders/           # Order processing
│   │   ├── points/           # Points balance and history
│   │   └── products/         # Product catalog
│   ├── cart/                 # Cart page
│   ├── checkout/             # Checkout page
│   ├── shop/                 # Product listing
│   ├── login/                # Login page
│   └── register/             # Registration page
│
├── components/               # React components
│   ├── ui/                   # Shadcn/ui primitives
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── CartSidebar.tsx
│   └── CheckoutDialog.tsx
│
└── lib/
    ├── contexts/             # AuthContext, CartContext, PointsContext
    ├── hooks/                # usePhantomWallet
    ├── supabase.ts
    ├── auth.ts
    └── types.ts
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | List all products |
| GET/POST | `/api/cart` | Get or update cart |
| POST | `/api/orders` | Place an order |
| GET | `/api/points` | Get points balance |
| GET | `/api/points/history` | Get transaction history |
| GET | `/api/points/wallet/:address` | Get points by wallet address |
| PATCH | `/api/account/wallet` | Link Phantom wallet |
| GET | `/api/health` | Health check |

---

## Hackathon Context

This project is built as part of the **Orion Hackathon**, exploring how loyalty programs in the F&B industry can be enhanced with blockchain technology. Key themes:

- **Real-world utility**: A working e-commerce storefront with genuine UX, not a toy demo
- **Web3 onboarding**: Phantom Wallet integration introduces blockchain to everyday coffee customers with zero friction
- **Points as on-chain assets**: The loyalty points system is architected to migrate on-chain, enabling interoperability between merchants in the Orion ecosystem

---

## License

MIT

# Novum Focus - AI-Powered Productivity SaaS

A complete productivity application with focus timer, task management, and Stripe billing integration.

## 🚀 Features

- **Focus Timer**: Pomodoro (25min) and Deep Work (90min) sessions
- **Task Management**: Create, complete, and delete tasks with priority levels
- **Stripe Billing**: £0.99 Pro and £2.99 Premium subscription plans
- **PostgreSQL Database**: Full data persistence for tasks and sessions
- **Mobile Responsive**: Mobile-first design with hamburger menu
- **Real-time Updates**: Live timer countdown with browser notifications

## 💰 Monetization

- **Free Plan**: 5 focus sessions/day, basic features
- **Pro Plan**: £0.99/month - Unlimited sessions, analytics, deep work timer
- **Premium Plan**: £2.99/month - Team features, AI insights, priority support

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe Checkout and Subscriptions
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/ArushaShkupit/musical-umbrella.git
cd musical-umbrella
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your database URL and Stripe keys:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/focus_flow_db"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
bun dev
```

## 🗄 Database Schema

- **Users**: Store user accounts and subscription info
- **Tasks**: Task management with priorities and completion status
- **FocusSession**: Track completed focus sessions for analytics

## 💳 Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Create products and prices for Pro (£0.99) and Premium (£2.99) plans
4. Set up webhooks for subscription events

## 🚀 Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📊 Revenue Potential

At £0.99 pricing:
- 1,000 users = £990/month (£11,880/year)
- 5,000 users = £4,950/month (£59,400/year)
- 10,000 users = £9,900/month (£118,800/year)

## 🎯 Target Market

- Remote workers and digital nomads
- Entrepreneurs and freelancers
- Students and productivity enthusiasts
- Teams looking for focus tracking

## 📱 Live Demo

Visit: https://focus-flow.lindy.site

## 📄 License

MIT License - feel free to use for commercial projects.

---

Built with ❤️ for productivity enthusiasts worldwide.

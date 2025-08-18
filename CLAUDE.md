# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Medusa 2.0 e-commerce monorepo consisting of:

- **Backend** (`/backend`): MedusaJS 2.0 commerce backend with PostgreSQL, Redis, MinIO file storage, and MeiliSearch
- **Storefront** (`/storefront`): Next.js 14 frontend application with TypeScript and Tailwind CSS

### Key Integrations
- **MinIO**: File storage replacing local storage, creates 'medusa-media' bucket automatically
- **Resend**: Email notifications with React Email templates  
- **Stripe**: Payment processing
- **MeiliSearch**: Product search functionality
- **PostgreSQL**: Primary database
- **Redis**: Workflow engine and caching

## Development Commands

### Backend (`cd backend/`)
- `pnpm dev` or `npm run dev` - Start backend in development mode (includes admin dashboard on localhost:9000/app)
- `pnpm build` or `npm run build` - Build backend
- `pnpm start` or `npm run start` - Run from compiled source (includes init-backend)
- `pnpm ib` or `npm run ib` - Initialize backend (migrations + seed database)
- `pnpm seed` or `npm run seed` - Seed database only
- `pnpm email:dev` or `npm run email:dev` - Preview email templates on port 3002

### Storefront (`cd storefront/`)
- `pnpm dev` or `npm run dev` - Start storefront in development mode (waits for backend)
- `pnpm build` or `npm run build` - Build storefront (waits for backend)  
- `pnpm start` or `npm run start` - Start production build
- `pnpm lint` or `npm run lint` - Run ESLint
- `pnpm test-e2e` or `npm run test-e2e` - Run Playwright e2e tests

## Architecture Notes

### Backend Structure
- **API routes**: Custom endpoints in `src/api/` for admin and store
- **Modules**: Custom functionality like email notifications, MinIO file handling
- **Workflows**: Custom business logic workflows  
- **Subscribers**: Event handlers for order placement, user invites
- **Jobs**: Background processing tasks

### Storefront Structure  
- **App Router**: Next.js 14 app directory structure with country-based routing `[countryCode]`
- **Module-based**: Components organized by feature (account, cart, checkout, products, etc.)
- **UI Components**: Radix UI primitives with Tailwind styling
- **Data Layer**: Medusa JS SDK integration for API calls

### Key Directories
- `backend/src/modules/` - Custom backend modules (email, file storage, etc.)
- `storefront/src/modules/` - Frontend feature modules with components and templates
- `storefront/src/lib/data/` - Data fetching utilities and API calls
- `storefront/e2e/` - End-to-end test suite with Playwright

## Environment Setup

### Backend Requirements
- PostgreSQL database
- Redis instance  
- MinIO storage (falls back to local)
- MeiliSearch instance
- Environment file: `.env` (copy from `.env.template`)

### Storefront Requirements
- Running backend on port 9000
- Environment file: `.env.local` (copy from `.env.local.template`)

## Testing

- E2E tests use Playwright framework in `storefront/e2e/`
- Test fixtures and utilities in `e2e/fixtures/` and `e2e/utils/`
- Backend uses Jest for unit testing

## Package Management

Both projects use pnpm as the preferred package manager (specified in package.json), but npm commands also work.
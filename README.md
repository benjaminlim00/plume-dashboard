# Plume DeFi Application

A **DeFi application** built on the Plume blockchain that integrates with Nest Finance vaults for real-time vault balance tracking and transaction history.

## Features

- **Wallet Integration**: MetaMask connector for secure blockchain interactions
- **Vault Tracking**: Real-time balance monitoring for nALPHA and nTBILL tokens
- **Transaction History**: Transfer event parsing across multiple vaults
- **Live Price Data**: USD value calculations from Nest Finance API

## Tech Stack

- **Framework**: Next.js 15.4.1 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Blockchain**: Plume Mainnet (Chain ID: 98866)
- **Web3**: Wagmi v2.16.0 + Viem v2.33.0
- **State Management**: TanStack React Query v5.83.0

## Getting Started

### Prerequisites

- MetaMask browser extension
- Plume network configuration in wallet
- Internet connection for blockchain RPC calls

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright E2E tests

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `views/` - React view components (HomeView, DashboardView)
- `lib/` - Blockchain utilities and custom hooks
- `components/` - Reusable React components
- `types/` - TypeScript type definitions
- `public/` - Static assets

### External Integrations

- **Nest Finance API**: `https://app.nest.credit/api/vaults`
- **Plume Blockchain**: `https://rpc.plume.org` (Chain ID: 98866)

## Development Notes

- Connects to **live Plume mainnet** (not local blockchain)
- Requires MetaMask with Plume network added for testing
- Real vault contract interactions during development
- Read-only contract interactions (no write operations)

For detailed architecture information, see [CLAUDE.md](./CLAUDE.md).

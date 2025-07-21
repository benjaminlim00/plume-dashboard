# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier (includes Tailwind class sorting)
- `npm run format:check` - Check if code is properly formatted

### Testing

- `npm run test` - Run Jest unit tests
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode with coverage
- `npm run test:e2e` - Run Playwright E2E tests for wallet connection

## Project Architecture

This is a **DeFi application** built on the Plume blockchain that integrates with Nest Finance vaults. It uses Next.js 15 with Web3 libraries for blockchain interactions.

### Tech Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Blockchain**: Plume Mainnet (Chain ID: 98866)
- **Web3 Libraries**:
  - Wagmi v2.16.0 (React hooks for Ethereum)
  - Viem v2.33.0 (TypeScript interface for Ethereum)
- **State Management**: TanStack React Query v5.83.0 (async state & caching)
- **Wallet Integration**: MetaMask connector
- **External APIs**: Nest Finance vault data (https://app.nest.credit/api/vaults)

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page that renders HomeView
  - `providers.tsx` - Wagmi and React Query providers
- `views/` - React view components (presentation layer)
  - `HomeView.tsx` - Wallet connection interface
  - `DashboardView.tsx` - Vault balances and transaction history
- `lib/` - Blockchain utilities and custom hooks
  - `wagmi.ts` - Plume blockchain configuration and Wagmi setup
  - `useVaults.ts` - Vault data fetching and balance calculations
  - `useTransactions.ts` - Blockchain transaction history parsing
- `components/` - Reusable React components (currently empty)
- `types/` - TypeScript type definitions (currently empty)
- `public/` - Static assets including logo.png

### Architecture Pattern

The application follows a **custom hooks + view-based architecture**:

#### Data Layer (`lib/`)

- **Wagmi Configuration**: Custom Plume chain setup with MetaMask connector
- **Vault Integration**: Real-time balance tracking for nALPHA and nTBILL tokens
- **Blockchain Reads**: ERC-20 contract interactions (`balanceOf`, `decimals`)
- **Transaction History**: Transfer event log parsing from vault contracts

#### Presentation Layer (`views/`)

- **HomeView**: Wallet connection interface with MetaMask integration
- **DashboardView**: Live vault balances and transaction history display

#### Provider Layer

- **Wagmi Provider**: Blockchain state management
- **React Query Provider**: Async data caching and background refetching

#### Key Data Flow:

1. **Wallet Connection**: MetaMask → Wagmi → Account state
2. **Vault Data**: External API → React Query → Real-time balance calculations
3. **Blockchain Reads**: Vault contracts → Viem → ERC-20 balance/decimals
4. **Transaction History**: Blockchain logs → Event parsing → UI display

### Core DeFi Features

#### Vault Integration

- **Nest Alpha Vault**: Real-time nALPHA token balance tracking
- **Nest Treasury Vault**: Real-time nTBILL token balance tracking
- **Live Price Data**: USD value calculations from external API
- **Combined Portfolio**: Aggregated balance across multiple vaults

#### Blockchain Interactions

- **ERC-20 Contract Reads**: `balanceOf`, `decimals` function calls to vault contracts
- **Event Log Parsing**: Transfer event filtering for transaction history
- **Multi-vault Support**: Parallel contract interactions
- **Real-time Updates**: 5-second vault data refresh, 1-minute transaction refresh

#### Transaction History

- **Transfer Event Monitoring**: Both incoming and outgoing transfers
- **Cross-vault Tracking**: Unified history across Alpha and Treasury vaults
- **Block Explorer Integration**: Transaction hash and address formatting
- **Deduplication**: Handles self-transfers to prevent duplicate entries

### External Integrations

#### Nest Finance API

- **Endpoint**: `https://app.nest.credit/api/vaults`
- **Purpose**: Live vault data (TVL, APY, prices, contract addresses)
- **Refresh Rate**: 5 seconds (always considered stale for real-time data)
- **Critical for**: Balance calculations and vault contract addresses

#### Plume Blockchain Network

- **RPC Endpoint**: `https://rpc.plume.org`
- **WebSocket**: `wss://rpc.plume.org`
- **Chain ID**: 98866
- **Native Currency**: ETH

### Development Notes

#### Blockchain Development

- Connects to **live Plume mainnet** (not local blockchain)
- Requires MetaMask with Plume network added for testing
- Real vault contract interactions during development
- Internet connection required for blockchain RPC calls

#### Environment Requirements

- MetaMask browser extension required
- Plume network configuration in wallet
- External API access to app.nest.credit required

#### Performance Considerations

- React Query caching prevents unnecessary API calls
- Efficient event log filtering with `fromBlock: "earliest"`
- Parallel vault data fetching for better UX
- Background refetching keeps data fresh

#### Security Notes

- Read-only contract interactions (no write operations implemented)
- MetaMask handles private key security
- Public RPC endpoints used (consider rate limiting for production)
- No sensitive data stored in transaction parsing

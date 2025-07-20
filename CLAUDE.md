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

No test framework is currently configured in this project.

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS.

### Tech Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Linting**: ESLint with Next.js config

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page that renders HomeView
- `views/` - React view components (presentation layer)
  - `HomeView.tsx` - Wallet connection landing page
  - `DashboardView.tsx` - Dashboard with balance and transaction history
- `components/` - Reusable React components (currently empty)
- `lib/` - Utility functions and shared logic (currently empty)
- `types/` - TypeScript type definitions (currently empty)
- `public/` - Static assets including logo.png

### Architecture Pattern

The project follows a view-based architecture where:

- App Router pages (`src/app/page.tsx`) import and render view components
- View components (`views/`) contain the main UI logic and state
- This pattern separates routing concerns from presentation logic

### Key Features

- Wallet connection interface in HomeView
- Dashboard with mock transaction history and balance display
- Responsive design using Tailwind CSS
- TypeScript with strict mode enabled
- Path alias `@/*` configured for `./src/*`

### Development Notes

- Uses Turbopack for faster development builds
- Tailwind CSS v4 with PostCSS configuration
- No testing framework currently set up
- No components in the `components/` directory yet - consider moving reusable UI elements there

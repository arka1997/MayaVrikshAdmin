# MayaVriksh Plant Admin Dashboard

## Overview

MayaVriksh is a comprehensive React-based admin dashboard for managing a plant nursery business. The application provides full CRUD operations for plants, categories, colors, fertilizers, tags, and variants. It features a modern UI built with Material-UI and Shadcn/ui components, offering both light and dark themes. The system supports complex plant management including seasonal care guidelines, fertilizer schedules, size profiles, and color variants with detailed specifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Libraries**: Dual approach using Material-UI (MUI) for complex components and Shadcn/ui for consistent design system components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: Redux Toolkit for global state management with separate slices for plants, categories, and theme
- **Client-Side Routing**: React Router v6 for navigation between dashboard pages
- **Data Fetching**: TanStack Query (React Query) for server state management alongside Redux for local state

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Design**: RESTful API endpoints with consistent error handling and request/response logging
- **Development Server**: Vite integration for hot module replacement in development

### Form Management & Validation
- **Forms**: React Hook Form for performant form handling with minimal re-renders
- **Validation**: Zod schemas for runtime type validation with integration to React Hook Form via @hookform/resolvers
- **File Handling**: Custom file upload components with drag-and-drop support for plant images

### Database Schema Design
- **Plants**: Core entity with comprehensive fields including scientific names, temperature ranges, care instructions, and spiritual/emotional attributes
- **Categories**: Hierarchical organization of plants
- **Variants**: Support for multiple variants per plant including size profiles, color variants, and seasonal care guidelines
- **Fertilizers**: Separate entity with scheduling capabilities linked to plants
- **Tags & Colors**: Flexible tagging system and color management for product variants

### Error Handling & Logging
- **Error Boundaries**: React Error Boundary for graceful UI error handling
- **API Error Handling**: Global error handler with retry mechanism for failed requests
- **Logging**: Custom logger utility with configurable log levels for development and production
- **User Feedback**: Toast notifications using custom toast system for user feedback

### Development Tools
- **Build System**: Vite for fast builds and development server
- **Type Safety**: Strict TypeScript configuration with path mapping for clean imports
- **Code Quality**: ESLint and TypeScript compiler checks
- **Hot Reload**: Vite HMR integration with Express server for seamless development

## External Dependencies

### Database
- **Neon Database**: PostgreSQL-compatible serverless database using @neondatabase/serverless driver
- **Database Migrations**: Drizzle Kit for schema migrations and database management

### UI Component Libraries
- **Material-UI (MUI)**: Comprehensive React component library with emotion styling engine
- **Radix UI**: Headless UI primitives for accessibility-compliant components
- **Shadcn/ui**: Consistent design system built on top of Radix UI with Tailwind CSS

### State Management & HTTP
- **Redux Toolkit**: Simplified Redux setup with createSlice and configureStore
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Axios**: HTTP client with interceptors for authentication and retry logic

### Development & Build Tools
- **Vite**: Build tool and development server with plugin ecosystem
- **TypeScript**: Static type checking and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **React Hook Form**: Performant forms with minimal re-renders and easy validation integration

### Validation & Utilities
- **Zod**: Runtime type validation and schema definition
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **clsx & tailwind-merge**: Conditional CSS class merging utilities
- **Lucide React**: Icon library for consistent iconography
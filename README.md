# City Pulse

A full-stack monorepo for city data management built with modern technologies.

## Architecture

This monorepo contains two main applications:

- **API (`apps/api`)**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Web (`apps/web`)**: Next.js + App Router + TypeScript + Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the API server:
   ```bash
   npm run dev:api
   ```

3. Start the web application:
   ```bash
   npm run dev:web
   ```

## Project Structure

Use the following command to view the project structure:

```bash
npm run structure
```

## Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Package Management**: npm workspaces
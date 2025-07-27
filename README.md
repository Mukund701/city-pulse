City Pulse 🌆
City Pulse is a full-stack, AI-powered web application designed to discover, track, and display events happening in cities around the world. It features a dynamic data pipeline that scrapes live event information, uses AI to structure the data, and displays it on a polished, interactive frontend.

This project is fully functional in a local environment and is ready for its final deployment phase.

Key Features
Automated Event Scraping: A powerful Python scraper built with Selenium that can browse a live website (allevents.in) to find event listings for any city.

AI-Powered Data Structuring: Leverages the Google Gemini AI to intelligently process raw scraped text and convert it into clean, structured JSON, complete with inferred categories and standardized dates.

Full End-to-End Data Flow: The system is fully integrated. The backend can trigger the scraper for a specific city, which sends structured data back to the API to be saved in the database, preventing duplicates.

Dynamic Frontend: A modern, responsive frontend built with Next.js and Tailwind CSS that allows users to search for cities and view detailed event information.

On-Demand Scraping: Users can trigger the scraping process for a specific city directly from the city's page, providing up-to-the-minute event data.

Interactive UI/UX:

An animated search bar with a flowing gradient border and autocomplete suggestions.

A dynamic "constellation" particle background using tsparticles that interacts with the user's mouse.

A responsive header that changes appearance on scroll.

Graceful fade-in animations for cards as they enter the viewport.

Technology Stack
The project is built as a monorepo with three main components:

Backend:

Framework: Node.js, Express.js

Language: TypeScript

Database ORM: Prisma

AI: Google Generative AI (Gemini)

Frontend:

Framework: Next.js

Language: TypeScript

Styling: Tailwind CSS

UI Components: shadcn/ui

Animation: tsparticles

Scraper:

Language: Python

Libraries: Selenium, BeautifulSoup4, requests

Database:

Provider: Supabase

Database: PostgreSQL

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18 or later)

npm (v9 or later)

Python (v3.9 or later)

A Supabase account for the database

A Google AI Studio API key for Gemini

Installation & Setup
Clone the Repository

git clone https://github.com/Mukund701/city-pulse.git
cd city-pulse

Install JavaScript Dependencies
This project uses npm workspaces. Run the install command from the root directory to install dependencies for all apps.

npm install

Set Up the Python Virtual Environment
This ensures all Python packages are isolated to this project.

# Create the virtual environment
python -m venv .venv

# Activate it (on Windows)
.venv\Scripts\activate

# Install Python packages
pip install -r scraper/requirements.txt

Set Up Environment Variables

API: In the apps/api folder, create a .env file and add your secrets:

DATABASE_URL="your_supabase_connection_string"
GOOGLE_API_KEY="your_google_gemini_api_key"

Frontend: In the apps/web folder, create a .env.local file and add the URL for your local API:

NEXT_PUBLIC_API_URL="http://localhost:3001"

Set Up the Database Schema
Navigate to the API directory and run the Prisma migrations to set up your database tables.

cd apps/api
npx prisma migrate dev

Running the Application
You need to run the API and the frontend in two separate terminals.

Start the Backend API Server

# Run from the project root
npm run dev:api

The API will be running at http://localhost:3001.

Start the Frontend Development Server

# Run from the project root
npm run dev:web

Open http://localhost:3000 in your browser to see the application.

Project Status
This application is fully functional but is not yet deployed. All features have been implemented and tested in a local development environment.

Next Steps
The final phase of this project involves:

Automation: Setting up a GitHub Action to run the scraper automatically on a daily schedule to keep event data fresh.

Deployment: Deploying the backend API to a hosting service like Railway and the frontend to Vercel to make the application live on the internet.

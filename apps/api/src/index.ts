// apps/api/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient, EventCategory } from '@prisma/client';
import { exec } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

// --- Initializations ---
dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json());

// --- Health Check Endpoint ---
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// --- City Endpoints ---
app.get('/api/cities', async (req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany();
    res.json(cities);
  } catch (error) {
    console.error('Failed to retrieve cities:', error);
    res.status(500).json({ error: 'Unable to retrieve cities.' });
  }
});

app.get('/api/cities/by-name/:name', async (req: Request, res: Response) => {
  try {
    const cityName = decodeURIComponent(req.params.name);
    const city = await prisma.city.findFirst({
      where: { name: { contains: cityName, mode: 'insensitive' } },
    });
    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }
    res.json(city);
  } catch (error) {
    console.error('Failed to retrieve city by name:', error);
    res.status(500).json({ error: 'Unable to retrieve city.' });
  }
});

// --- Event Endpoints ---
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const { cityId } = req.query;
    if (typeof cityId !== 'string') {
      return res.status(400).json({ error: 'A valid cityId query parameter is required.' });
    }
    const parsedCityId = parseInt(cityId, 10);
    if (isNaN(parsedCityId)) {
        return res.status(400).json({ error: 'cityId must be a valid number.' });
    }
    const events = await prisma.event.findMany({
      where: { cityId: parsedCityId },
      orderBy: { eventDate: 'asc' },
    });
    res.json(events);
  } catch (error) {
    console.error('Failed to retrieve events:', error);
    res.status(500).json({ error: 'Unable to retrieve events.' });
  }
});

app.get('/api/events/featured', async (req: Request, res: Response) => {
  try {
    const featuredEvents = await prisma.event.findMany({
      where: {
        isFeatured: true,
        eventDate: { gte: new Date() },
      },
      orderBy: { eventDate: 'asc' },
      take: 6,
    });
    res.json(featuredEvents);
  } catch (error) {
    console.error('Failed to retrieve featured events:', error);
    res.status(500).json({ error: 'Unable to retrieve featured events.' });
  }
});

app.get('/api/events/:id', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        city: {
          select: { name: true },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(event);
  } catch (error) {
    console.error(`Failed to retrieve event ${req.params.id}:`, error);
    res.status(500).json({ error: 'Unable to retrieve event.' });
  }
});

app.post('/api/events', async (req: Request, res: Response) => {
  try {
    const { title, description, category, location, date, imageUrl, cityId } = req.body;
    if (!title || !category || !date || !location || !cityId) {
        return res.status(400).json({ error: 'Missing required event fields.' });
    }
    const parsedCityId = parseInt(cityId, 10);
    if (isNaN(parsedCityId)) {
        return res.status(400).json({ error: 'cityId must be a valid number.' });
    }
    const uppercaseCategory = category.toUpperCase();
    const validatedCategory = Object.values(EventCategory).includes(uppercaseCategory as EventCategory)
      ? uppercaseCategory as EventCategory
      : EventCategory.OTHER;

    await prisma.event.create({
      data: {
        title,
        description,
        category: validatedCategory,
        location,
        eventDate: new Date(date),
        cityId: parsedCityId,
        imageUrl,
      },
    });
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Failed to create event:', error);
    res.status(500).json({ error: 'Unable to create event.' });
  }
});

// --- Search Endpoint ---
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    if (typeof query !== 'string' || !query) {
      return res.json([]);
    }
    const cities = await prisma.city.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 5,
    });
    res.json(cities);
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: 'Unable to perform search.' });
  }
});

// --- Scraper Trigger Endpoint ---
app.post('/api/cities/:id/find-events', async (req: Request, res: Response) => {
  try {
    const cityId = parseInt(req.params.id, 10);
    if (isNaN(cityId)) {
      return res.status(400).json({ error: 'Invalid city ID.' });
    }
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }
    const cityNameForScraper = city.name.toLowerCase().replace(/\s+/g, '-');
    const projectRoot = path.join(__dirname, '..', '..', '..');
    const pythonExecutable = path.join(projectRoot, '.venv', 'Scripts', 'python');
    const scraperScript = path.join(projectRoot, 'scraper', 'scraper.py');
    const command = `"${pythonExecutable}" "${scraperScript}" ${cityNameForScraper} ${cityId}`;
    
    console.log(`Executing command: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Scraper execution error for city ${cityId}: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Scraper stderr for city ${cityId}: ${stderr}`);
        return;
      }
      console.log(`Scraper stdout for city ${cityId}: ${stdout}`);
    });
    res.status(202).json({ message: `Scraping for ${city.name} started.` });
  } catch (error) {
    console.error('Failed to start scraper:', error);
    res.status(500).json({ error: 'Failed to start scraper process.' });
  }
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
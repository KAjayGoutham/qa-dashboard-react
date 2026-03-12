import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'flows.json');

app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        const initialData = {
            modules: [],
            environments: {
                QA: 'QA',
                SAT: 'SAT',
                Prod: 'Prod'
            },
            releaseNames: {
                QA: 'Release 1.0',
                SAT: 'Release 1.0',
                Prod: 'Release 1.0'
            },
            currentEnvironment: 'QA',
            lastUpdated: new Date().toISOString()
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

// GET - Read all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// POST - Save all data
app.post('/api/data', async (req, res) => {
    try {
        const data = {
            ...req.body,
            lastUpdated: new Date().toISOString()
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// GET - Read modules only
app.get('/api/modules', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const jsonData = JSON.parse(data);
        res.json(jsonData.modules || []);
    } catch (error) {
        console.error('Error reading modules:', error);
        res.status(500).json({ error: 'Failed to read modules' });
    }
});

// POST - Save modules only
app.post('/api/modules', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.modules = req.body;
        jsonData.lastUpdated = new Date().toISOString();
        await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));
        res.json({ success: true, message: 'Modules saved successfully' });
    } catch (error) {
        console.error('Error saving modules:', error);
        res.status(500).json({ error: 'Failed to save modules' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize and start server
async function startServer() {
    await ensureDataDirectory();
    await initializeDataFile();
    
    app.listen(PORT, () => {
        console.log(`🚀 QA Dashboard Server running on http://localhost:${PORT}`);
        console.log(`📁 Data file: ${DATA_FILE}`);
        console.log(`✅ Server ready to accept requests`);
    });
}

startServer().catch(console.error);

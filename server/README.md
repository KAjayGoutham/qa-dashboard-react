# QA Dashboard Backend Server

Simple Express server providing JSON file persistence for the QA Dashboard.

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server runs on `http://localhost:3001`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/data` - Get all data
- `POST /api/data` - Save all data
- `GET /api/modules` - Get modules only
- `POST /api/modules` - Save modules only

## Data Storage

Data is stored in `./data/flows.json` (auto-created on first run)

## Requirements

- Node.js 18+ (for native fetch and ES modules)
- npm or yarn

## Development

```bash
# Install with dev dependencies
npm install

# Run with auto-restart (if nodemon installed)
npm run dev
```

See `../SERVER_SETUP.md` for complete documentation.

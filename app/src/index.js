const express = require('express');
const mongoose = require('mongoose');

const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quotes';
const SERVICE_NAME = process.env.SERVICE_NAME || 'quotes-api';

const quoteSchema = new mongoose.Schema(
  {
    pair: { type: String, required: true, index: true },
    buy: { type: Number, required: true },
    sell: { type: Number, required: true },
    source: { type: String, default: 'manual' },
  },
  { timestamps: true }
);

const Quote = mongoose.model('Quote', quoteSchema);

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  console.log(
    JSON.stringify({
      level: 'info',
      service: SERVICE_NAME,
      method: req.method,
      path: req.path,
      ts: new Date().toISOString(),
    })
  );
  next();
});

app.get('/health', (_req, res) => {
  const mongoUp = mongoose.connection.readyState === 1;
  res.status(mongoUp ? 200 : 503).json({
    service: SERVICE_NAME,
    status: mongoUp ? 'ok' : 'degraded',
    mongo: mongoUp ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

app.get('/ready', (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ready: false });
  }
  res.json({ ready: true });
});

app.get('/quotes', async (req, res) => {
  try {
    const { pair, limit = '20' } = req.query;
    const filter = pair ? { pair } : {};
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit, 10) || 20, 100));
    res.json({ count: quotes.length, items: quotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/quotes', async (req, res) => {
  try {
    const { pair, buy, sell, source } = req.body || {};
    if (!pair || typeof buy !== 'number' || typeof sell !== 'number') {
      return res
        .status(400)
        .json({ error: 'pair, buy (number) y sell (number) son requeridos' });
    }
    const quote = await Quote.create({ pair, buy, sell, source });
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (_req, res) => {
  res.json({
    service: SERVICE_NAME,
    message: 'Kambista Cloud Engineer Challenge — quotes-api',
    endpoints: ['GET /health', 'GET /ready', 'GET /quotes', 'POST /quotes'],
  });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(JSON.stringify({ level: 'info', msg: 'mongo connected' }));
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'mongo connection failed', err: err.message })
    );
  }

  const server = app.listen(PORT, () => {
    console.log(
      JSON.stringify({ level: 'info', msg: `listening on :${PORT}`, service: SERVICE_NAME })
    );
  });

  const shutdown = async (signal) => {
    console.log(JSON.stringify({ level: 'info', msg: `received ${signal}, shutting down` }));
    server.close(() => {
      mongoose.connection.close(false).finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();

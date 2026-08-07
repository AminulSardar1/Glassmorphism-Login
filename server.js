import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiDataHandler from './api/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// API endpoint for signup / data
app.all('/api/data', (req, res) => {
  apiDataHandler(req, res);
});

app.all('/api/signup', (req, res) => {
  apiDataHandler(req, res);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;


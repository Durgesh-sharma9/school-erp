import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../data');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create backend data directory:', e);
  }
}

export function loadJson(filename, fallback = {}) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(`[LocalStore] Error reading ${filename}:`, e.message);
  }
  return fallback;
}

export function saveJson(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`[LocalStore] Error saving ${filename}:`, e.message);
  }
}

// Global cached DB connectivity flag to eliminate 7-10s Prisma timeouts when Postgres is down
let isDbOnline = false;
let dbCheckDone = false;

export async function checkDbConnection(prisma) {
  if (dbCheckDone) return isDbOnline;
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 400));
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeoutPromise]);
    isDbOnline = true;
    console.log('✅ PostgreSQL database is ONLINE and CONNECTED.');
  } catch (e) {
    isDbOnline = false;
    console.log('⚡ PostgreSQL is OFFLINE. Using high-performance persistent local JSON store (0ms latency).');
  }
  dbCheckDone = true;
  return isDbOnline;
}

export function getIsDbOnline() {
  return isDbOnline;
}

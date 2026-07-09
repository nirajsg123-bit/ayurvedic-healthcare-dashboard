// Persistent datastore for user-generated data (registered doctors, reviews,
// bookings, OTPs, sessions). Uses a JSON file so it works on Vercel's ephemeral
// filesystem: local path data/store.json (read-write) and /tmp on Vercel.
// In-memory cache is seeded from disk; writes are flushed synchronously so a
// single lambda invocation keeps state for its lifetime and across requests.

const fs = require('fs');
const path = require('path');

const STORE_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
const STORE_PATH = path.join(STORE_DIR, 'store.json');

function emptyStore() {
  return {
    registeredDoctors: [], // appended to the generated `doctors` array
    reviews: {},           // doctorId -> [ {id, patient, rating, comment, doctorReply, date} ]
    bookings: [],          // doctor dashboard bookings {id, doctorId, patientName, phone, email, date, time, mode, reason, status, createdAt}
    otps: {},              // key -> {code, expires, purpose, used}
    sessions: {},          // token -> {role, refId, expires}
    admins: [              // bootstrap admin (change after first login)
      { username: 'admin', password: 'admin123', name: 'Site Admin' }
    ]
  };
}

let cache = null;

function ensureDir() {
  try { if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true }); } catch (e) {}
}
function load() {
  if (cache) return cache;
  ensureDir();
  try {
    if (fs.existsSync(STORE_PATH)) {
      cache = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      // merge any new top-level keys
      const base = emptyStore();
      for (const k in base) if (!(k in cache)) cache[k] = base[k];
    } else {
      cache = emptyStore();
      save();
    }
  } catch (e) {
    console.error('store load error, resetting:', e.message);
    cache = emptyStore();
  }
  return cache;
}
function save() {
  ensureDir();
  const tmp = STORE_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
  fs.renameSync(tmp, STORE_PATH); // atomic
}

module.exports = {
  get: () => load(),
  save,
  reset() { cache = null; }
};

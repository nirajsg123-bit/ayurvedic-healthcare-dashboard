// Ayurvedic Healthcare Dashboard - Server
// All-in-one server: serves static files + REST API for doctors, hospitals, herbs, therapies, yoga, health benefits
// Port: 4500 (served at root URL)

const express = require('express');
const path = require('path');
const fs = require('fs');

const locations = require('./data/locations');
const { generateDoctors } = require('./data/doctors');
const { generateHospitals } = require('./data/hospitals');
const { generateInfiniteHerbs } = require('./data/herbs');
const { generateTherapies } = require('./data/therapies');
const { generateYoga } = require('./data/yoga');
const { generateHealthBenefits } = require('./data/healthBenefits');
const { generateAppointments } = require('./data/appointments');
const { generateHealthTracker } = require('./data/healthTracker');
const { generateFavorites } = require('./data/favorites');
const { generateAnalytics } = require('./data/analytics');

const app = express();
app.use(express.json({ limit: '5mb' }));

// ---------- ROBUSTNESS: never crash the server on a bad request ----------
app.use((err, req, res, next) => {
  console.error('Request error:', err.message);
  if (!res.headersSent) res.status(500).json({ error: 'Internal error', detail: err.message });
});
process.on('uncaughtException', (e) => console.error('uncaughtException:', e.message));
process.on('unhandledRejection', (e) => console.error('unhandledRejection:', e && e.message));

// Load data once at startup
const doctors = generateDoctors();
const hospitals = generateHospitals();
const herbs = generateInfiniteHerbs();
const therapies = generateTherapies();
const yoga = generateYoga();
const healthBenefits = generateHealthBenefits();
const appointments = generateAppointments();
const healthTracker = generateHealthTracker();
const favorites = generateFavorites();
const analytics = generateAnalytics();

console.log('Data loaded:');
console.log('  Doctors:', doctors.length);
console.log('  Hospitals:', hospitals.length);
console.log('  Herbs:', herbs.length);
console.log('  Therapies:', therapies.length);
console.log('  Yoga asanas/techniques:', yoga.length);
console.log('  Health conditions:', healthBenefits.length);
console.log('  Appointments:', appointments.length);
console.log('  Health tracker entries:', healthTracker.length);
console.log('  Favorites:', favorites.length);

// ---------- STATIC FILES (root URL) ----------
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API ROOT ----------
app.get('/api', (req, res) => {
  res.json({
    name: 'Ayurvedic Healthcare Dashboard API',
    version: '1.0.0',
    endpoints: {
      doctors: '/api/doctors',
      hospitals: '/api/hospitals',
      herbs: '/api/herbs',
      therapies: '/api/therapies',
      yoga: '/api/yoga',
      healthBenefits: '/api/health-benefits',
      stats: '/api/stats',
      locations: '/api/locations',
      search: '/api/search?q=...',
      filterOptions: '/api/filter-options'
    }
  });
});

// ---------- LOCATIONS ----------
app.get('/api/locations', (req, res) => {
  res.json({
    countries: locations.countries,
    states: locations.states,
    districts: locations.districts,
    villages: locations.villages
  });
});

app.get('/api/filter-options', (req, res) => {
  // Return all filterable values for the UI
  const { districts } = locations;
  const doctorSpecialtiesSet = new Set();
  doctors.forEach(d => doctorSpecialtiesSet.add(d.specialty));
  const doctorDegrees = new Set();
  doctors.forEach(d => doctorDegrees.add(d.degree));
  const hospitalTypesSet = new Set();
  hospitals.forEach(h => hospitalTypesSet.add(h.type));
  const hospitalAccreditations = new Set();
  hospitals.forEach(h => h.accreditations.forEach(a => hospitalAccreditations.add(a)));
  const herbCategories = new Set();
  herbs.forEach(h => herbCategories.add(h.category));
  const therapyCategories = new Set();
  therapies.forEach(t => therapyCategories.add(t.category));
  const yogaCategories = new Set();
  yoga.forEach(y => yogaCategories.add(y.category));
  const yogaDifficulties = new Set();
  yoga.forEach(y => yogaDifficulties.add(y.difficulty));
  const healthCategories = new Set();
  healthBenefits.forEach(h => healthCategories.add(h.category));

  res.json({
    countries: locations.countries,
    states: locations.states,
    districts: Object.keys(districts),
    citiesByState: districts,
    villages: locations.villages,
    doctorSpecialties: Array.from(doctorSpecialtiesSet).sort(),
    doctorDegrees: Array.from(doctorDegrees).sort(),
    doctorLanguages: ['Hindi', 'English', 'Sanskrit', 'Marathi', 'Tamil', 'Bengali', 'Telugu', 'Malayalam', 'Kannada', 'Gujarati', 'Punjabi', 'Urdu'],
    consultationModes: ['In-person', 'Video Consult', 'Home Visit'],
    hospitalTypes: Array.from(hospitalTypesSet).sort(),
    hospitalAccreditations: Array.from(hospitalAccreditations).sort(),
    hospitalFacilities: ['OPD', 'IPD', 'ICU', 'Emergency 24x7', 'Pharmacy', 'Pathology Lab', 'Radiology', 'CT Scan', 'MRI', 'X-Ray', 'Ultrasound', 'ECG', 'Endoscopy', 'Operation Theatre', 'Labour Room', 'NICU', 'PICU', 'Blood Bank', 'Ambulance', 'Cafeteria', 'Parking', 'Wheelchair Access', 'Wi-Fi', 'AC Rooms', 'Reception', 'Panchakarma Theatre', 'Ksharasutra Unit', 'Agni Karma Unit', 'Herbal Garden', 'Yoga Hall', 'Meditation Hall', 'Diet Kitchen', 'Steam Bath', 'Massage Rooms', 'Waiting Lounge', 'Telemedicine', 'Online Booking', 'Home Sample Collection', '24x7 Doctor On Call', 'Trauma Care', 'Dialysis', 'Cath Lab', 'Cardiac Care Unit'],
    doctorAreas: Array.from(new Set(doctors.map(d => d.area))).sort(),
    hospitalAreas: Array.from(new Set(hospitals.map(h => h.area))).sort(),
    herbCategories: Array.from(herbCategories).sort(),
    therapyCategories: Array.from(therapyCategories).sort(),
    yogaCategories: Array.from(yogaCategories).sort(),
    yogaDifficulties: Array.from(yogaDifficulties).sort(),
    healthCategories: Array.from(healthCategories).sort(),
    healthSeverities: ['Mild', 'Moderate', 'Severe', 'Moderate to Severe', 'Mild to Moderate'],
    doshas: ['Vata', 'Pitta', 'Kapha', 'Vata-', 'Pitta-', 'Kapha-', 'Vata+', 'Pitta+', 'Kapha+', 'Tridosha', 'Tridosha Balance', 'Vata-Pitta-', 'Vata-Kapha-', 'Pitta-Kapha-', 'Kapha-Vata'],
    evidenceLevels: ['Moderate', 'High', 'Very High']
  });
});

// ---------- DOCTORS ----------
app.get('/api/doctors', (req, res) => {
  const { q, country, state, district, city, area, village, specialty, ayurvedicOnly, onlineBooking, homeVisit, video, minRating, maxFee, minExperience, sortBy, sortDir, page = 1, limit = 50 } = req.query;
  let results = [...doctors];
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.specialty.toLowerCase().includes(term) ||
      d.clinic.toLowerCase().includes(term) ||
      d.city.toLowerCase().includes(term) ||
      d.state.toLowerCase().includes(term) ||
      d.area.toLowerCase().includes(term) ||
      d.degree.toLowerCase().includes(term) ||
      d.address.toLowerCase().includes(term)
    );
  }
  if (country && country !== 'all') results = results.filter(d => d.country === country);
  if (state && state !== 'all') results = results.filter(d => d.state === state);
  if (district && district !== 'all') results = results.filter(d => d.city === district || d.area === district);
  if (city && city !== 'all') results = results.filter(d => d.city === city);
  if (area && area !== 'all') results = results.filter(d => d.area === area);
  if (village && village !== 'all') results = results.filter(d => d.area === village || d.city === village);
  if (specialty && specialty !== 'all') results = results.filter(d => d.specialty === specialty);
  if (ayurvedicOnly === 'true') results = results.filter(d => d.isAyurvedic);
  if (onlineBooking === 'true') results = results.filter(d => d.onlineBooking);
  if (homeVisit === 'true') results = results.filter(d => d.consultationModes.includes('Home Visit'));
  if (video === 'true') results = results.filter(d => d.consultationModes.includes('Video Consult'));
  if (minRating) results = results.filter(d => d.rating >= parseFloat(minRating));
  if (maxFee) results = results.filter(d => d.consultationFee <= parseFloat(maxFee));
  if (minExperience) results = results.filter(d => d.experience >= parseInt(minExperience));

  // Sort
  if (sortBy) {
    const dir = (sortDir === 'desc') ? -1 : 1;
    results.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));

  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)),
    data: paged
  });
});

app.get('/api/doctors/:id', (req, res) => {
  const d = doctors.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Doctor not found' });
  res.json(d);
});

// ---------- HOSPITALS ----------
app.get('/api/hospitals', (req, res) => {
  const { q, country, state, district, city, area, type, ayurvedicOnly, panchakarma, minRating, minBeds, maxBeds, hasEmergency, hasAmbulance, hasPharmacy, parking, onlineBooking, sortBy, sortDir, page = 1, limit = 50 } = req.query;
  let results = [...hospitals];
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(term) ||
      h.type.toLowerCase().includes(term) ||
      h.city.toLowerCase().includes(term) ||
      h.state.toLowerCase().includes(term) ||
      h.area.toLowerCase().includes(term) ||
      h.specialties.some(s => s.toLowerCase().includes(term)) ||
      h.ayurvedicTherapies.some(t => t.toLowerCase().includes(term)) ||
      h.address.toLowerCase().includes(term)
    );
  }
  if (country && country !== 'all') results = results.filter(h => h.country === country);
  if (state && state !== 'all') results = results.filter(h => h.state === state);
  if (district && district !== 'all') results = results.filter(h => h.city === district || h.area === district);
  if (city && city !== 'all') results = results.filter(h => h.city === city);
  if (area && area !== 'all') results = results.filter(h => h.area === area);
  if (type && type !== 'all') results = results.filter(h => h.type === type);
  if (ayurvedicOnly === 'true') results = results.filter(h => h.isAyurvedic);
  if (panchakarma === 'true') results = results.filter(h => h.panchakarmaAvailable);
  if (minRating) results = results.filter(h => h.rating >= parseFloat(minRating));
  if (minBeds) results = results.filter(h => h.totalBeds >= parseInt(minBeds));
  if (maxBeds) results = results.filter(h => h.totalBeds <= parseInt(maxBeds));
  if (hasEmergency === 'true') results = results.filter(h => h.facilities.includes('Emergency 24x7'));
  if (hasAmbulance === 'true') results = results.filter(h => h.hasAmbulance);
  if (hasPharmacy === 'true') results = results.filter(h => h.hasPharmacy);
  if (parking === 'true') results = results.filter(h => h.hasParking);
  if (onlineBooking === 'true') results = results.filter(h => h.facilities.includes('Online Booking'));

  if (sortBy) {
    const dir = (sortDir === 'desc') ? -1 : 1;
    results.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)),
    data: paged
  });
});

app.get('/api/hospitals/:id', (req, res) => {
  const h = hospitals.find(x => x.id === req.params.id);
  if (!h) return res.status(404).json({ error: 'Hospital not found' });
  res.json(h);
});

// ---------- HERBS ----------
app.get('/api/herbs', (req, res) => {
  const { q, category, dosha, partUsed, minResearch, evidenceLevel, sortBy, sortDir, page = 1, limit = 50 } = req.query;
  let results = [...herbs];
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(term) ||
      h.sanskrit.toLowerCase().includes(term) ||
      (h.commonNames || []).some(n => n.toLowerCase().includes(term)) ||
      h.family.toLowerCase().includes(term) ||
      (h.primaryUses || []).some(u => u.toLowerCase().includes(term)) ||
      (h.healthConditions || []).some(c => c.toLowerCase().includes(term)) ||
      (h.formulations || []).some(f => f.toLowerCase().includes(term))
    );
  }
  if (category && category !== 'all') results = results.filter(h => h.category === category);
  if (dosha && dosha !== 'all') results = results.filter(h => h.doshaEffect && h.doshaEffect.includes(dosha));
  if (partUsed && partUsed !== 'all') results = results.filter(h => h.partUsed && h.partUsed.toLowerCase().includes(partUsed.toLowerCase()));
  if (minResearch) results = results.filter(h => h.researchCitations >= parseInt(minResearch));
  if (evidenceLevel && evidenceLevel !== 'all') results = results.filter(h => h.evidenceLevel === evidenceLevel);

  if (sortBy) {
    const dir = (sortDir === 'desc') ? -1 : 1;
    results.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)),
    data: paged
  });
});

app.get('/api/herbs/:id', (req, res) => {
  const h = herbs.find(x => x.id === req.params.id);
  if (!h) return res.status(404).json({ error: 'Herb not found' });
  res.json(h);
});

// ---------- THERAPIES ----------
app.get('/api/therapies', (req, res) => {
  const { q, category, type, indication, page = 1, limit = 50 } = req.query;
  let results = [...therapies];
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.sanskrit.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      (t.indications || []).some(i => i.toLowerCase().includes(term))
    );
  }
  if (category && category !== 'all') results = results.filter(t => t.category === category);
  if (type && type !== 'all') results = results.filter(t => t.type === type);
  if (indication && indication !== 'all') results = results.filter(t => (t.indications || []).some(i => i.toLowerCase().includes(indication.toLowerCase())));

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)),
    data: paged
  });
});

app.get('/api/therapies/:id', (req, res) => {
  const t = therapies.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Therapy not found' });
  res.json(t);
});

// ---------- YOGA ----------
app.get('/api/yoga', (req, res) => {
  const { q, category, difficulty, indication, page = 1, limit = 50 } = req.query;
  let results = [...yoga];
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(y =>
      y.name.toLowerCase().includes(term) ||
      y.english.toLowerCase().includes(term) ||
      y.sanskrit.toLowerCase().includes(term) ||
      (y.benefits || []).some(b => b.toLowerCase().includes(term)) ||
      (y.indications || []).some(i => i.toLowerCase().includes(term))
    );
  }
  if (category && category !== 'all') results = results.filter(y => y.category === category);
  if (difficulty && difficulty !== 'all') results = results.filter(y => y.difficulty === difficulty);
  if (indication && indication !== 'all') results = results.filter(y => (y.benefits || []).some(b => b.toLowerCase().includes(indication.toLowerCase())) || (y.indications || []).some(i => i.toLowerCase().includes(indication.toLowerCase())));

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)),
    data: paged
  });
});

app.get('/api/yoga/:id', (req, res) => {
  const y = yoga.find(x => x.id === req.params.id);
  if (!y) return res.status(404).json({ error: 'Yoga not found' });
  res.json(y);
});

// ---------- HEALTH BENEFITS ----------
app.get('/api/health-benefits', (req, res) => {
  const { q, category, severity, dosha, page = 1, limit = 50 } = req.query;
  let results = [...healthBenefits];
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(term) ||
      (c.ayurvedicName || '').toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term) ||
      (c.symptoms || []).some(s => s.toLowerCase().includes(term)) ||
      (c.herbs || []).some(h => h.toLowerCase().includes(term)) ||
      (c.causes || []).some(c2 => c2.toLowerCase().includes(term))
    );
  }
  if (category && category !== 'all') results = results.filter(c => c.category === category);
  if (severity && severity !== 'all') results = results.filter(c => c.severity === severity);
  if (dosha && dosha !== 'all') results = results.filter(c => (c.doshaImbalance || '').includes(dosha));

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)),
    data: paged
  });
});

app.get('/api/health-benefits/:id', (req, res) => {
  const c = healthBenefits.find(x => x.id === req.params.id);
  if (!c) {
    // Try by slug of name
    const lower = req.params.id.toLowerCase();
    const c2 = healthBenefits.find(x => x.name.toLowerCase().includes(lower) || (x.ayurvedicName || '').toLowerCase().includes(lower));
    if (!c2) return res.status(404).json({ error: 'Condition not found' });
    return res.json(c2);
  }
  res.json(c);
});

// ---------- AI SYMPTOM DIAGNOSIS ENGINE ----------
app.post('/api/diagnose', (req, res) => {
  const b = req.body || {};
  const input = (b.symptoms || []).map(s => s.toString().toLowerCase().trim()).filter(Boolean);
  const text = (b.text || '').toString().toLowerCase();
  if (!input.length && !text) return res.status(400).json({ error: 'Provide symptoms or text' });
  // Build a symptom pool from explicit symptoms + tokens in free text
  const STOP = ['have','having','suffering','from','with','and','the','a','an','i','am','feeling','feel','pain','in','my','of','is','are','for','since','days','weeks'];
  const textToks = text.split(/[^a-z ]/).join(' ').split(' ').map(t=>t.trim()).filter(t=>t.length>2 && !STOP.includes(t));
  const pool = [...new Set([...input, ...textToks])];
  const scored = [];
  healthBenefits.forEach(c => {
    const cSym = (c.symptoms || []).map(s => s.toLowerCase());
    let hits = 0; const matched = [];
    pool.forEach(p => {
      cSym.forEach(s => {
        if (s.includes(p) || p.includes(s)) { hits++; if (!matched.includes(s)) matched.push(s); }
      });
    });
    // also score by causes / name keyword
    let extra = 0;
    pool.forEach(p => {
      if ((c.name||'').toLowerCase().includes(p)) extra += 2;
      if ((c.causes||[]).some(x=>x.toLowerCase().includes(p))) extra += 1;
    });
    const matchedCount = matched.length;            // distinct symptoms matched
    const score = hits + extra + matchedCount * 3;  // weight distinct matches heavily
    if (score > 0) scored.push({ condition: c, score, matched, matchedCount, matchRatio: hits / Math.max(cSym.length, 1) });
  });
  // Rank: most distinct symptoms matched first, then overall score, then match ratio
  scored.sort((a, b) => (b.matchedCount - a.matchedCount) || (b.score - a.score) || (b.matchRatio - a.matchRatio));
  const top = scored.slice(0, 5);
  // For top condition, pull real doctors & herbs
  const primary = top[0];
  let linkedDoctors = [], linkedHerbs = [];
  if (primary) {
    const spec = (primary.condition.specialist || '').toLowerCase();
    const cat = (primary.condition.category || '').toLowerCase();
    linkedDoctors = doctors.filter(d => {
      const ds = (d.specialty || '').toLowerCase();
      const dd = (d.degree || '').toLowerCase();
      return spec.split(/[+,/()]/).some(tok => tok.trim().length > 3 && (ds.includes(tok.trim()) || dd.includes(tok.trim())))
        || (cat === 'digestive' && ds.includes('kayachikitsa'))
        || ds.includes('ayurved');
    }).slice(0, 6);
    const herbNames = (primary.condition.herbs || []).map(h => h.toLowerCase());
    linkedHerbs = herbs.filter(h => {
      const hn = (h.name || '').toLowerCase();
      const ha = (h.ayurvedicName || h.botanicalName || '').toLowerCase();
      return herbNames.some(n => hn.includes(n.split(' ')[0]) || ha.includes(n.split(' ')[0]));
    }).slice(0, 8);
  }
  res.json({
    pool,
    diagnoses: top.map(t => ({
      name: t.condition.name,
      ayurvedicName: t.condition.ayurvedicName,
      category: t.condition.category,
      severity: t.condition.severity,
      doshaImbalance: t.condition.doshaImbalance,
      score: t.score,
      matchRatio: Math.round(t.matchRatio * 100),
      matchedSymptoms: t.matched,
      symptoms: t.condition.symptoms,
      causes: t.condition.causes,
      herbs: t.condition.herbs,
      formulations: t.condition.formulations,
      diet: t.condition.diet,
      lifestyle: t.condition.lifestyle,
      yoga: t.condition.yoga,
      pranayama: t.condition.pranayama,
      homeRemedies: t.condition.homeRemedies,
      duration: t.condition.duration,
      prevention: t.condition.prevention,
      specialist: t.condition.specialist
    })),
    doctors: linkedDoctors, herbs: linkedHerbs
  });
});

// ---------- GLOBAL SEARCH ----------
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ doctors: [], hospitals: [], herbs: [], therapies: [], yoga: [], conditions: [] });
  const term = q.toLowerCase();

  const docResults = doctors.filter(d =>
    d.name.toLowerCase().includes(term) ||
    d.specialty.toLowerCase().includes(term) ||
    d.city.toLowerCase().includes(term) ||
    d.state.toLowerCase().includes(term) ||
    d.clinic.toLowerCase().includes(term)
  ).slice(0, 20);

  const hospResults = hospitals.filter(h =>
    h.name.toLowerCase().includes(term) ||
    h.type.toLowerCase().includes(term) ||
    h.city.toLowerCase().includes(term) ||
    h.state.toLowerCase().includes(term)
  ).slice(0, 20);

  const herbResults = herbs.filter(h =>
    h.name.toLowerCase().includes(term) ||
    h.sanskrit.toLowerCase().includes(term) ||
    (h.commonNames || []).some(n => n.toLowerCase().includes(term)) ||
    (h.primaryUses || []).some(u => u.toLowerCase().includes(term))
  ).slice(0, 20);

  const therapyResults = therapies.filter(t =>
    t.name.toLowerCase().includes(term) ||
    t.sanskrit.toLowerCase().includes(term) ||
    (t.indications || []).some(i => i.toLowerCase().includes(term))
  ).slice(0, 20);

  const yogaResults = yoga.filter(y =>
    y.name.toLowerCase().includes(term) ||
    y.english.toLowerCase().includes(term) ||
    (y.benefits || []).some(b => b.toLowerCase().includes(term))
  ).slice(0, 20);

  const condResults = healthBenefits.filter(c =>
    c.name.toLowerCase().includes(term) ||
    (c.ayurvedicName || '').toLowerCase().includes(term) ||
    (c.symptoms || []).some(s => s.toLowerCase().includes(term))
  ).slice(0, 20);

  res.json({
    doctors: docResults,
    hospitals: hospResults,
    herbs: herbResults,
    therapies: therapyResults,
    yoga: yogaResults,
    conditions: condResults
  });
});

// ---------- STATS ----------
app.get('/api/stats', (req, res) => {
  // State-wise doctor count
  const doctorByState = {};
  doctors.forEach(d => { doctorByState[d.state] = (doctorByState[d.state] || 0) + 1; });
  const hospitalByState = {};
  hospitals.forEach(h => { hospitalByState[h.state] = (hospitalByState[h.state] || 0) + 1; });
  const ayurDoctorCount = doctors.filter(d => d.isAyurvedic).length;
  const ayurHospCount = hospitals.filter(h => h.isAyurvedic).length;
  const totalStates = Object.keys(doctorByState).length;
  res.json({
    doctors: { total: doctors.length, ayurvedic: ayurDoctorCount, allopathy: doctors.length - ayurDoctorCount, byState: doctorByState, statesCovered: totalStates },
    hospitals: { total: hospitals.length, ayurvedic: ayurHospCount, allopathy: hospitals.length - ayurHospCount, byState: hospitalByState, statesCovered: Object.keys(hospitalByState).length },
    herbs: { total: herbs.length, categories: Array.from(new Set(herbs.map(h => h.category))).length },
    therapies: { total: therapies.length, categories: Array.from(new Set(therapies.map(t => t.category))).length },
    yoga: { total: yoga.length, categories: Array.from(new Set(yoga.map(y => y.category))).length },
    healthConditions: { total: healthBenefits.length, categories: Array.from(new Set(healthBenefits.map(c => c.category))).length }
  });
});

// ---------- APPOINTMENTS (backend) ----------
function todayStr() { return new Date().toISOString().split('T')[0]; }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

app.get('/api/appointments', (req, res) => {
  const { q, status, type, date, doctorId, hospitalId, page = 1, limit = 30 } = req.query;
  let results = [...appointments];
  if (req.query.id) {
    const found = appointments.filter(a => a.id === req.query.id);
    if (found.length) { res.json({ total: found.length, page: 1, limit: found.length, pages: 1, data: found }); return; }
  }
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(a =>
      a.patientName.toLowerCase().includes(term) ||
      a.patientId.toLowerCase().includes(term) ||
      a.doctorName.toLowerCase().includes(term) ||
      a.hospitalName.toLowerCase().includes(term)
    );
  }
  if (status && status !== 'all') results = results.filter(a => a.status === status);
  if (type && type !== 'all') results = results.filter(a => a.appointmentType === type);
  if (doctorId && doctorId !== 'all') results = results.filter(a => a.doctorId === doctorId);
  if (hospitalId && hospitalId !== 'all') results = results.filter(a => a.hospitalId === hospitalId);
  if (date && date !== 'all') {
    const t = todayStr();
    results = results.filter(a => {
      const d = a.appointmentDate;
      if (date === 'today') return d === t;
      if (date === 'upcoming') return d >= t;
      if (date === 'past') return d < t;
      if (date === 'week') return Math.abs(daysBetween(d, t)) <= 7;
      if (date === 'month') return Math.abs(daysBetween(d, t)) <= 30;
      return true;
    });
  }
  results.sort((a, b) => (a.appointmentDate < b.appointmentDate ? 1 : -1));
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({ total: results.length, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(results.length / parseInt(limit)), data: paged });
});

app.get('/api/appointments/meta', (req, res) => {
  const doctorsLite = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 500)
    .map(d => ({ id: d.id, name: d.name, specialty: d.specialty, city: d.city, state: d.state }));
  const hospitalsLite = [...hospitals].sort((a, b) => b.rating - a.rating).slice(0, 300)
    .map(h => ({ id: h.id, name: h.name, city: h.city, state: h.state }));
  res.json({ doctors: doctorsLite, hospitals: hospitalsLite });
});

app.post('/api/appointments', (req, res) => {
  const b = req.body || {};
  const doctor = doctors.find(d => d.id === b.doctorId);
  const hospital = hospitals.find(h => h.id === b.hospitalId);
  if (!doctor || !hospital) return res.status(400).json({ error: 'Valid doctor and hospital required' });
  const apt = {
    id: 'APT' + String(appointments.length + 1).padStart(7, '0'),
    patientName: b.patientName || 'Walk-in Patient',
    patientId: b.patientId || 'PAT' + String(Date.now()).slice(-5),
    patientPhone: b.patientPhone || '—',
    patientEmail: b.patientEmail || '',
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    appointmentDate: b.appointmentDate || todayStr(),
    appointmentTime: b.appointmentTime || '10:00',
    appointmentType: b.appointmentType || 'In-person',
    status: b.status || 'Scheduled',
    consultationFee: doctor.consultationFee,
    paidAmount: 0,
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    bookingDate: todayStr(),
    symptoms: b.symptoms || '',
    diagnosis: '',
    prescription: '',
    followUpRequired: false,
    followUpDate: '',
    notes: b.notes || '',
    cancellationReason: '',
    reminderSent: false,
    feedbackRating: '',
    feedbackComment: ''
  };
  appointments.push(apt);
  res.json(apt);
});

// PATCH: update appointment (status / reschedule)
app.patch('/api/appointments/:id', (req, res) => {
  const apt = appointments.find(a => a.id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  const b = req.body || {};
  if (b.status) { apt.status = b.status; if (b.status === 'Cancelled') apt.cancellationReason = b.reason || apt.cancellationReason; }
  if (b.appointmentDate) apt.appointmentDate = b.appointmentDate;
  if (b.appointmentTime) apt.appointmentTime = b.appointmentTime;
  if (b.paymentStatus) { apt.paymentStatus = b.paymentStatus; }
  if (b.paidAmount !== undefined) { apt.paidAmount = b.paidAmount; if (apt.paidAmount >= apt.consultationFee) apt.paymentStatus = 'Paid'; }
  if (b.diagnosis !== undefined) apt.diagnosis = b.diagnosis;
  if (b.prescription !== undefined) apt.prescription = b.prescription;
  if (b.feedbackRating !== undefined) { apt.feedbackRating = b.feedbackRating; apt.feedbackComment = b.feedbackComment || ''; }
  res.json(apt);
});

// ---------- HEALTH TRACKER (backend) ----------
app.get('/api/tracker', (req, res) => {
  const { patient, metric, status, range, page = 1, limit = 40 } = req.query;
  let results = [...healthTracker];
  if (patient && patient !== 'all') results = results.filter(t => t.patientName === patient);
  if (metric && metric !== 'all') results = results.filter(t => t.metricName === metric);
  if (status && status !== 'all') results = results.filter(t => t.status === status);
  if (range && range !== 'all') {
    const days = parseInt(range);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    results = results.filter(t => new Date(t.recordedDate) >= cutoff);
  }
  results.sort((a, b) => (a.recordedDate < b.recordedDate ? 1 : -1));
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paged = results.slice(start, start + parseInt(limit));
  res.json({ total: results.length, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(results.length / parseInt(limit)), data: paged });
});

app.get('/api/tracker/patients', (req, res) => {
  const set = {};
  healthTracker.forEach(t => { set[t.patientName] = (set[t.patientName] || 0) + 1; });
  const patients = Object.keys(set).sort().map(name => ({ name, records: set[name] }));
  const metrics = Array.from(new Set(healthTracker.map(t => t.metricName))).sort();
  res.json({ patients, metrics });
});

app.post('/api/tracker', (req, res) => {
  const b = req.body || {};
  if (!b.patientName || !b.metricName || b.value === undefined) return res.status(400).json({ error: 'patientName, metricName and value required' });
  const value = parseFloat(b.value);
  let status = b.status || 'Normal';
  const alerts = status === 'Critical' ? ['Value outside normal range - consult doctor']
    : status === 'Elevated' ? ['Monitor closely, consider lifestyle changes']
    : status === 'Low' ? ['Value below normal - consult doctor'] : [];
  const rec = {
    id: 'HTR' + String(healthTracker.length + 1).padStart(7, '0'),
    patientName: b.patientName,
    patientId: b.patientId || 'PAT' + String(Date.now()).slice(-5),
    metricName: b.metricName,
    metricUnit: '',
    value,
    status,
    recordedDate: b.recordedDate || todayStr(),
    recordedTime: b.recordedTime || new Date().toTimeString().slice(0, 5),
    notes: b.notes || '',
    trend: b.trend || 'Stable',
    targetValue: b.targetValue && !isNaN(parseFloat(b.targetValue)) ? parseFloat(b.targetValue).toString() : 'Normal range',
    source: 'Manual Entry',
    doctorReviewed: false,
    alerts
  };
  healthTracker.push(rec);
  res.json(rec);
});

// ---------- ANALYTICS (backend) ----------
function countBy(arr, keyFn) {
  const m = {};
  arr.forEach(x => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; });
  return m;
}
function toSeries(ObjOrArr) {
  if (Array.isArray(ObjOrArr)) {
    return ObjOrArr.map((x, i) => ({ label: x.name || String(i + 1), value: x.value !== undefined ? x.value : 1 }));
  }
  return Object.entries(ObjOrArr).map(([k, v]) => ({ label: k, value: typeof v === 'object' ? (v.total || 0) : v }));
}
function sortDesc(series) { return series.slice().sort((a, b) => b.value - a.value); }

app.get('/api/analytics/states', (req, res) => {
  const states = {};
  const add = (s, key) => { if (!s) return; states[s] = states[s] || { state: s, doctors: 0, hospitals: 0, herbs: 0 }; states[s][key]++; };
  doctors.forEach(d => add(d.state, 'doctors'));
  hospitals.forEach(h => add(h.state, 'hospitals'));
  herbs.forEach(h => { const r = (h.regions && h.regions.length) ? h.regions[0] : (h.region || ''); add(r, 'herbs'); });
  const list = Object.values(states).sort((a, b) => (b.doctors + b.hospitals) - (a.doctors + a.hospitals));
  res.json(list);
});

app.get('/api/analytics', (req, res) => {
  const { category = 'overview', period = 'monthly', state = 'all' } = req.query;
  const inState = (item) => state === 'all' || item.state === state;
  const docSub = doctors.filter(inState);
  const hospSub = hospitals.filter(inState);
  const apptSub = appointments.filter(a => state === 'all' || (doctors.find(d => d.id === a.doctorId) || {}).state === state);
  const kpis = [];
  const charts = [];

  // Bucket helper for time series
  function bucketByMonth(items, dateKey) {
    const m = {};
    items.forEach(a => { const k = a[dateKey].substring(0, 7); m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).sort().map(k => ({ label: k, value: m[k] }));
  }
  function bucketRevenue(items) {
    const m = {};
    items.forEach(a => {
      if (a.paymentStatus === 'Paid' || a.paymentStatus === 'Partial') {
        const k = a.appointmentDate.substring(0, 7);
        m[k] = (m[k] || 0) + (a.paidAmount || 0);
      }
    });
    return Object.keys(m).sort().map(k => ({ label: k, value: m[k] }));
  }
  function periodLabel(k) {
    if (period === 'yearly') return k.substring(0, 4);
    if (period === 'quarterly') { const [y, m] = k.split('-'); return y + '-Q' + (Math.ceil(parseInt(m) / 3)); }
    return k;
  }
  function groupPeriod(series) {
    if (period === 'monthly' || period === 'all') return series;
    const m = {};
    series.forEach(s => { const k = periodLabel(s.label); m[k] = (m[k] || 0) + s.value; });
    return Object.keys(m).sort().map(k => ({ label: k, value: m[k] }));
  }

  if (category === 'overview' || category === 'doctors') {
    const byState = countBy(docSub, d => d.state);
    const bySpec = countBy(docSub, d => d.specialty);
    const ayur = docSub.filter(d => d.isAyurvedic).length;
    if (category === 'overview') {
      kpis.push({ label: 'Total Doctors', value: docSub.length.toLocaleString(), sub: state === 'all' ? 'All India' : state });
      kpis.push({ label: 'Ayurvedic Doctors', value: ayur.toLocaleString(), sub: Math.round(ayur / (docSub.length || 1) * 100) + '% of total' });
      kpis.push({ label: 'Total Hospitals', value: hospSub.length.toLocaleString(), sub: state === 'all' ? 'All India' : state });
      kpis.push({ label: 'Herbs in DB', value: herbs.length.toLocaleString(), sub: Array.from(new Set(herbs.map(h => h.category))).length + ' categories' });
      kpis.push({ label: 'Appointments', value: apptSub.length.toLocaleString(), sub: 'recorded' });
      kpis.push({ label: 'Health Tracker', value: healthTracker.length.toLocaleString(), sub: 'readings' });
    } else {
      kpis.push({ label: 'Doctors', value: docSub.length.toLocaleString(), sub: state === 'all' ? 'All India' : state });
      kpis.push({ label: 'Ayurvedic', value: ayur.toLocaleString(), sub: Math.round(ayur / (docSub.length || 1) * 100) + '%' });
      const avgRating = docSub.length ? (docSub.reduce((s, d) => s + d.rating, 0) / docSub.length).toFixed(2) : '0';
      const avgFee = docSub.length ? Math.round(docSub.reduce((s, d) => s + d.consultationFee, 0) / docSub.length) : 0;
      kpis.push({ label: 'Avg Rating', value: '★ ' + avgRating, sub: 'across ' + docSub.length + ' doctors' });
      kpis.push({ label: 'Avg Fee', value: '₹' + avgFee, sub: 'per consultation' });
      kpis.push({ label: 'Specialties', value: Object.keys(bySpec).length, sub: 'unique' });
      kpis.push({ label: 'States Covered', value: Object.keys(byState).length, sub: 'across India' });
    }
    charts.push({ title: 'Doctors by State', type: 'bar', data: sortDesc(toSeries(byState)).slice(0, 12) });
    charts.push({ title: 'Top Specialties', type: 'bar', data: sortDesc(toSeries(bySpec)).slice(0, 10) });
    charts.push({ title: 'Ayurvedic vs Allopathic', type: 'donut', data: [
      { label: 'Ayurvedic', value: ayur }, { label: 'Allopathic/Other', value: docSub.length - ayur }
    ] });
  }

  if (category === 'overview' || category === 'hospitals') {
    const byState = countBy(hospSub, h => h.state);
    const byType = countBy(hospSub, h => h.type);
    const ayur = hospSub.filter(h => h.isAyurvedic).length;
    const totalBeds = hospSub.reduce((s, h) => s + h.totalBeds, 0);
    if (category === 'hospitals') {
      kpis.push({ label: 'Hospitals', value: hospSub.length.toLocaleString(), sub: state === 'all' ? 'All India' : state });
      kpis.push({ label: 'Ayurvedic', value: ayur.toLocaleString(), sub: Math.round(ayur / (hospSub.length || 1) * 100) + '%' });
      kpis.push({ label: 'Total Beds', value: totalBeds.toLocaleString(), sub: 'capacity' });
      kpis.push({ label: 'ICU Beds', value: hospSub.reduce((s, h) => s + h.icuBeds, 0).toLocaleString(), sub: 'critical care' });
      const avgRating = hospSub.length ? (hospSub.reduce((s, h) => s + h.rating, 0) / hospSub.length).toFixed(2) : '0';
      kpis.push({ label: 'Avg Rating', value: '★ ' + avgRating, sub: 'across ' + hospSub.length });
      kpis.push({ label: 'Types', value: Object.keys(byType).length, sub: 'categories' });
    }
    charts.push({ title: 'Hospitals by State', type: 'bar', data: sortDesc(toSeries(byState)).slice(0, 12) });
    charts.push({ title: 'Hospital Types', type: 'donut', data: sortDesc(toSeries(byType)).slice(0, 8) });
    const bedByState = {};
    hospSub.forEach(h => { bedByState[h.state] = (bedByState[h.state] || 0) + h.totalBeds; });
    charts.push({ title: 'Bed Capacity by State', type: 'bar', data: sortDesc(Object.entries(bedByState).map(([k, v]) => ({ label: k, value: v }))).slice(0, 10) });
  }

  if (category === 'overview' || category === 'herbs') {
    const byCat = countBy(herbs, h => h.category);
    const byEv = countBy(herbs, h => h.evidenceLevel);
    const avgCit = herbs.length ? Math.round(herbs.reduce((s, h) => s + (h.researchCitations || 0), 0) / herbs.length) : 0;
    if (category === 'herbs') {
      kpis.push({ label: 'Herbs', value: herbs.length.toLocaleString(), sub: Array.from(new Set(herbs.map(h => h.category))).length + ' categories' });
      kpis.push({ label: 'Avg Citations', value: avgCit, sub: 'per herb' });
      kpis.push({ label: 'Very High Evidence', value: (herbs.filter(h => h.evidenceLevel === 'Very High').length), sub: 'herbs' });
      kpis.push({ label: 'High Evidence', value: herbs.filter(h => h.evidenceLevel === 'High').length, sub: 'herbs' });
      kpis.push({ label: 'Families', value: Array.from(new Set(herbs.map(h => h.family))).length, sub: 'botanical' });
      kpis.push({ label: 'With Formulations', value: herbs.filter(h => (h.formulations || []).length > 0).length, sub: 'herbs' });
    }
    charts.push({ title: 'Herbs by Category', type: 'donut', data: sortDesc(toSeries(byCat)) });
    charts.push({ title: 'Evidence Levels', type: 'donut', data: sortDesc(toSeries(byEv)) });
    charts.push({ title: 'Top Herbs by Citations', type: 'bar', data: sortDesc(herbs.map(h => ({ label: h.name, value: h.researchCitations || 0 }))).slice(0, 10) });
  }

  if (category === 'overview' || category === 'therapies') {
    const byCat = countBy(therapies, t => t.category);
    const byType = countBy(therapies, t => t.type);
    if (category === 'therapies') {
      kpis.push({ label: 'Therapies', value: therapies.length.toLocaleString(), sub: Array.from(new Set(therapies.map(t => t.category))).length + ' categories' });
      kpis.push({ label: 'Types', value: Object.keys(byType).length, sub: 'modality' });
      kpis.push({ label: 'With Procedure', value: therapies.filter(t => (t.procedure || []).length > 0).length, sub: 'documented' });
      kpis.push({ label: 'With Contraindications', value: therapies.filter(t => (t.contraindications || []).length > 0).length, sub: 'safety noted' });
      kpis.push({ label: 'Avg Cost', value: '₹' + (therapies.filter(t => t.cost && !isNaN(t.cost)).reduce((s, t) => s + parseInt(t.cost), 0) / (therapies.filter(t => t.cost && !isNaN(t.cost)).length || 1)).toFixed(0), sub: 'per session' });
      kpis.push({ label: 'Rasayana', value: therapies.filter(t => t.category === 'Rasayana (Rejuvenation)').length, sub: 'rejuvenation' });
    }
    charts.push({ title: 'Therapies by Category', type: 'donut', data: sortDesc(toSeries(byCat)) });
    charts.push({ title: 'Therapy Types', type: 'bar', data: sortDesc(toSeries(byType)) });
  }

  if (category === 'overview' || category === 'yoga') {
    const byCat = countBy(yoga, y => y.category);
    const byDiff = countBy(yoga, y => y.difficulty);
    if (category === 'yoga') {
      kpis.push({ label: 'Practices', value: yoga.length.toLocaleString(), sub: Array.from(new Set(yoga.map(y => y.category))).length + ' categories' });
      kpis.push({ label: 'Asanas', value: yoga.filter(y => y.category === 'Asana').length, sub: 'postures' });
      kpis.push({ label: 'Pranayama', value: yoga.filter(y => y.category === 'Pranayama').length, sub: 'breathing' });
      kpis.push({ label: 'Meditation', value: yoga.filter(y => y.category === 'Meditation').length, sub: 'techniques' });
      kpis.push({ label: 'Beginner-friendly', value: yoga.filter(y => y.difficulty === 'Beginner').length, sub: 'practices' });
      kpis.push({ label: 'Advanced', value: yoga.filter(y => y.difficulty === 'Advanced').length, sub: 'practices' });
    }
    charts.push({ title: 'Yoga by Category', type: 'donut', data: sortDesc(toSeries(byCat)) });
    charts.push({ title: 'Difficulty Levels', type: 'donut', data: sortDesc(toSeries(byDiff)) });
  }

  if (category === 'overview' || category === 'conditions') {
    const byCat = countBy(healthBenefits, c => c.category);
    const bySev = countBy(healthBenefits, c => c.severity);
    if (category === 'conditions') {
      kpis.push({ label: 'Conditions', value: healthBenefits.length.toLocaleString(), sub: Array.from(new Set(healthBenefits.map(c => c.category))).length + ' categories' });
      kpis.push({ label: 'With Herbs', value: healthBenefits.filter(c => (c.herbs || []).length > 0).length, sub: 'mapped' });
      kpis.push({ label: 'With Diet', value: healthBenefits.filter(c => (c.diet || []).length > 0).length, sub: 'guidance' });
      kpis.push({ label: 'With Yoga', value: healthBenefits.filter(c => (c.yoga || []).length > 0).length, sub: 'prescribed' });
      kpis.push({ label: 'With Panchakarma', value: healthBenefits.filter(c => (c.panchakarma || []).length > 0).length, sub: 'recommended' });
      kpis.push({ label: 'Severe', value: healthBenefits.filter(c => c.severity === 'Severe').length, sub: 'conditions' });
    }
    charts.push({ title: 'Conditions by Category', type: 'donut', data: sortDesc(toSeries(byCat)) });
    charts.push({ title: 'Severity Distribution', type: 'bar', data: sortDesc(toSeries(bySev)) });
  }

  if (category === 'overview' || category === 'appointments') {
    const byStatus = countBy(apptSub, a => a.status);
    const byType = countBy(apptSub, a => a.appointmentType);
    const completed = apptSub.filter(a => a.status === 'Completed').length;
    if (category === 'appointments') {
      kpis.push({ label: 'Appointments', value: apptSub.length.toLocaleString(), sub: 'total' });
      kpis.push({ label: 'Completed', value: completed.toLocaleString(), sub: Math.round(completed / (apptSub.length || 1) * 100) + '%' });
      kpis.push({ label: 'Cancelled', value: apptSub.filter(a => a.status === 'Cancelled').length.toLocaleString(), sub: 'rate' });
      kpis.push({ label: 'No-Show', value: apptSub.filter(a => a.status === 'No-Show').length.toLocaleString(), sub: 'rate' });
      kpis.push({ label: 'Video Consults', value: apptSub.filter(a => a.appointmentType === 'Video Consult').length.toLocaleString(), sub: 'telemedicine' });
      const avgRating = apptSub.filter(a => a.feedbackRating).reduce((s, a) => s + parseFloat(a.feedbackRating), 0) / (apptSub.filter(a => a.feedbackRating).length || 1);
      kpis.push({ label: 'Avg Feedback', value: isNaN(avgRating) ? '—' : '★ ' + avgRating.toFixed(1), sub: 'patient rating' });
    }
    charts.push({ title: 'Appointment Trend (' + period + ')', type: 'line', data: groupPeriod(bucketByMonth(apptSub, 'appointmentDate')) });
    charts.push({ title: 'By Status', type: 'donut', data: sortDesc(toSeries(byStatus)) });
    charts.push({ title: 'By Type', type: 'bar', data: sortDesc(toSeries(byType)) });
  }

  if (category === 'overview' || category === 'revenue') {
    const rev = bucketRevenue(apptSub);
    const totalRev = rev.reduce((s, r) => s + r.value, 0);
    if (category === 'revenue') {
      kpis.push({ label: 'Total Revenue', value: '₹' + totalRev.toLocaleString(), sub: 'collected' });
      kpis.push({ label: 'Avg / Appt', value: '₹' + (apptSub.length ? Math.round(totalRev / apptSub.length) : 0).toLocaleString(), sub: 'blended' });
      kpis.push({ label: 'Paid', value: '₹' + apptSub.filter(a => a.paymentStatus === 'Paid').reduce((s, a) => s + a.paidAmount, 0).toLocaleString(), sub: 'full' });
      kpis.push({ label: 'Partial', value: '₹' + apptSub.filter(a => a.paymentStatus === 'Partial').reduce((s, a) => s + a.paidAmount, 0).toLocaleString(), sub: 'part' });
      kpis.push({ label: 'Pending', value: '₹' + apptSub.filter(a => a.paymentStatus === 'Pending').reduce((s, a) => s + a.consultationFee, 0).toLocaleString(), sub: 'unpaid' });
      kpis.push({ label: 'Months', value: rev.length, sub: 'period covered' });
    }
    charts.push({ title: 'Revenue Trend (' + period + ')', type: 'line', data: groupPeriod(rev) });
    charts.push({ title: 'Revenue by Payment Status', type: 'donut', data: sortDesc([
      { label: 'Paid', value: apptSub.filter(a => a.paymentStatus === 'Paid').reduce((s, a) => s + a.paidAmount, 0) },
      { label: 'Partial', value: apptSub.filter(a => a.paymentStatus === 'Partial').reduce((s, a) => s + a.paidAmount, 0) },
      { label: 'Pending', value: apptSub.filter(a => a.paymentStatus === 'Pending').reduce((s, a) => s + a.consultationFee, 0) }
    ]) });
  }

  if (category === 'overview' || category === 'patients') {
    const ages = apptSub.length ? [] : [];
    // Age distribution derived from a seeded spread for completeness
    const ageGroups = { '18-30': 0, '31-45': 0, '46-60': 0, '61-75': 0, '75+': 0 };
    const rng = seededFor(999);
    const n = apptSub.length || 1000;
    for (let i = 0; i < n; i++) { const age = 18 + Math.floor(rng() * 70); if (age <= 30) ageGroups['18-30']++; else if (age <= 45) ageGroups['31-45']++; else if (age <= 60) ageGroups['46-60']++; else if (age <= 75) ageGroups['61-75']++; else ageGroups['75+']++; }
    const gender = { Male: Math.round(n * 0.54), Female: Math.round(n * 0.42), Other: Math.round(n * 0.04) };
    if (category === 'patients') {
      kpis.push({ label: 'Unique Patients', value: (apptSub.length || healthTracker.length).toLocaleString(), sub: 'in dataset' });
      kpis.push({ label: 'Avg Age', value: '42', sub: 'years' });
      kpis.push({ label: 'Male', value: gender.Male.toLocaleString(), sub: Math.round(gender.Male / n * 100) + '%' });
      kpis.push({ label: 'Female', value: gender.Female.toLocaleString(), sub: Math.round(gender.Female / n * 100) + '%' });
      kpis.push({ label: 'Top Age Group', value: '31-45', sub: 'working adults' });
      kpis.push({ label: 'Tracker Records', value: healthTracker.length.toLocaleString(), sub: 'vitals logged' });
    }
    charts.push({ title: 'Age Distribution', type: 'bar', data: toSeries(ageGroups) });
    charts.push({ title: 'Gender Split', type: 'donut', data: toSeries(gender) });
  }

  res.json({ category, period, state, kpis, charts });
});

function seededFor(seed) { let s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

// ---------- SEO: robots.txt & sitemap.xml (BEFORE catch-all) ----------
const SITE = 'https://ayurvedic-healthcare-dashboard.vercel.app';
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml\n`);
});
app.get('/sitemap.xml', (req, res) => {
  const pages = ['', '/?section=doctors', '/?section=hospitals', '/?section=herbs', '/?section=therapies', '/?section=yoga', '/?section=health', '/?section=analytics', '/?section=appointments', '/?section=tracker'];
  const urls = pages.map(p => `  <url><loc>${SITE}${p}</loc><changefreq>weekly</changefreq><priority>${p===''?'1.0':'0.8'}</priority></url>`).join('\n');
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
});

// ---------- CATCH-ALL for SPA ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4500;
// Only bind a port when run directly (local dev). When required by a serverless
// handler (api/index.js) we export `app` instead of listening.
if (require.main === module) {
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('AYURVEDIC HEALTHCARE DASHBOARD');
  console.log('========================================');
  console.log('Server running at:');
  console.log('  Local:   http://localhost:' + PORT);
  console.log('  Network: http://0.0.0.0:' + PORT);
  console.log('');
  console.log('Sections:');
  console.log('  - Find Doctors   (' + doctors.length.toLocaleString() + ' across India)');
  console.log('  - Hospitals      (' + hospitals.length.toLocaleString() + ')');
  console.log('  - Herbs          (' + herbs.length.toLocaleString() + ')');
  console.log('  - Therapies      (' + therapies.length.toLocaleString() + ')');
  console.log('  - Yoga & Meditation (' + yoga.length.toLocaleString() + ')');
  console.log('  - Health Conditions (' + healthBenefits.length.toLocaleString() + ')');
  console.log('========================================');
});
}

module.exports = app;

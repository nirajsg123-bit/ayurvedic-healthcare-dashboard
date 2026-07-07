// Ayurvedic Healthcare Dashboard - Vercel Serverless Handler
// All-in-one: serves static files (public/index.html) + REST API for doctors, hospitals, herbs, therapies, yoga, health benefits
// Serverless entry point: module.exports = app (no app.listen)

const express = require('express');
const path = require('path');

const locations = require('../data/locations');
const { generateDoctors } = require('../data/doctors');
const { generateHospitals } = require('../data/hospitals');
const { generateInfiniteHerbs } = require('../data/herbs');
const { generateTherapies } = require('../data/therapies');
const { generateYoga } = require('../data/yoga');
const { generateHealthBenefits } = require('../data/healthBenefits');
const { generateAppointments } = require('../data/appointments');
const { generateHealthTracker } = require('../data/healthTracker');
const { generateFavorites } = require('../data/favorites');
const { generateAnalytics } = require('../data/analytics');

const app = express();
app.use(express.json({ limit: '5mb' }));

// Load data once per cold start (serverless)
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

console.log('[ayurvedic] Data loaded:', {
  doctors: doctors.length, hospitals: hospitals.length, herbs: herbs.length,
  therapies: therapies.length, yoga: yoga.length, healthBenefits: healthBenefits.length,
  appointments: appointments.length, healthTracker: healthTracker.length,
  favorites: favorites.length, analytics: analytics.length
});

// ---------- STATIC FILES (root URL) ----------
app.use(express.static(path.join(__dirname, '..', 'public')));

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
    total: results.length, page: parseInt(page), limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)), data: paged
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
    total: results.length, page: parseInt(page), limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)), data: paged
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
    total: results.length, page: parseInt(page), limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)), data: paged
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
    total: results.length, page: parseInt(page), limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)), data: paged
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
    total: results.length, page: parseInt(page), limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)), data: paged
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
    total: results.length, page: parseInt(page), limit: parseInt(limit),
    pages: Math.ceil(results.length / parseInt(limit)), data: paged
  });
});

app.get('/api/health-benefits/:id', (req, res) => {
  const c = healthBenefits.find(x => x.id === req.params.id);
  if (!c) {
    const lower = req.params.id.toLowerCase();
    const c2 = healthBenefits.find(x => x.name.toLowerCase().includes(lower) || (x.ayurvedicName || '').toLowerCase().includes(lower));
    if (!c2) return res.status(404).json({ error: 'Condition not found' });
    return res.json(c2);
  }
  res.json(c);
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
    (Array.isArray(h.commonNames) ? h.commonNames : (h.commonNames ? String(h.commonNames).split(',') : [])).some(n => String(n).toLowerCase().includes(term)) ||
    (Array.isArray(h.primaryUses) ? h.primaryUses : (h.primaryUses ? String(h.primaryUses).split(',') : [])).some(u => String(u).toLowerCase().includes(term))
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
    doctors: docResults, hospitals: hospResults, herbs: herbResults,
    therapies: therapyResults, yoga: yogaResults, conditions: condResults
  });
});

// ---------- STATS ----------
app.get('/api/stats', (req, res) => {
  const doctorByState = {};
  doctors.forEach(d => { doctorByState[d.state] = (doctorByState[d.state] || 0) + 1; });
  const hospitalByState = {};
  hospitals.forEach(h => { hospitalByState[h.state] = (hospitalByState[h.state] || 0) + 1; });
  const ayurDoctorCount = doctors.filter(d => d.isAyurvedic).length;
  const ayurHospCount = hospitals.filter(h => h.isAyurvedic).length;
  res.json({
    doctors: { total: doctors.length, ayurvedic: ayurDoctorCount, allopathy: doctors.length - ayurDoctorCount, byState: doctorByState, statesCovered: Object.keys(doctorByState).length },
    hospitals: { total: hospitals.length, ayurvedic: ayurHospCount, allopathy: hospitals.length - ayurHospCount, byState: hospitalByState, statesCovered: Object.keys(hospitalByState).length },
    herbs: { total: herbs.length, categories: Array.from(new Set(herbs.map(h => h.category))).length },
    therapies: { total: therapies.length, categories: Array.from(new Set(therapies.map(t => t.category))).length },
    yoga: { total: yoga.length, categories: Array.from(new Set(yoga.map(y => y.category))).length },
    healthConditions: { total: healthBenefits.length, categories: Array.from(new Set(healthBenefits.map(c => c.category))).length }
  });
});

// ---------- APPOINTMENTS, TRACKER, FAVORITES, ANALYTICS (mirror server.js if needed by frontend) ----------
app.get('/api/appointments', (req, res) => { res.json({ total: appointments.length, data: appointments.slice(0, 100) }); });
app.get('/api/health-tracker', (req, res) => { res.json({ total: healthTracker.length, data: healthTracker.slice(0, 100) }); });
app.get('/api/favorites', (req, res) => { res.json({ total: favorites.length, data: favorites.slice(0, 100) }); });
app.get('/api/analytics', (req, res) => { res.json({ data: analytics }); });

// ---------- CATCH-ALL for SPA ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
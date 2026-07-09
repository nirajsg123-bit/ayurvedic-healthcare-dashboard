<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ayurvedic Healthcare Dashboard - India | Doctors, Hospitals, Herbs, Yoga</title>
<style>
:root {
  /* Light theme (default) */
  --primary: #2d5016;
  --primary-light: #4a7c2e;
  --primary-dark: #1a3009;
  --accent: #d97706;
  --accent-light: #f59e0b;
  --bg: #faf7f0;
  --card: #ffffff;
  --text: #1f2937;
  --text-light: #6b7280;
  --border: #e5e7eb;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --pitta: #dc2626;
  --vata: #7c3aed;
  --kapha: #2563eb;
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --sidebar-w: 280px;
  --sidebar-collapsed-w: 64px;
  --header-h: 64px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --z-dropdown: 100;
  --z-modal: 200;
  --z-toast: 300;
  --z-sidebar: 150;
  --toast-bg: #1f2937;
  --toast-text: #ffffff;
}

/* Dark theme variables */
[data-theme="dark"] {
  --primary: #4ade80;
  --primary-light: #86efac;
  --primary-dark: #22c55e;
  --accent: #fbbf24;
  --accent-light: #fcd34d;
  --bg: #111827;
  --card: #1f2937;
  --text: #f9fafb;
  --text-light: #9ca3af;
  --border: #374151;
  --success: #34d399;
  --warning: #fbbf24;
  --danger: #f87171;
  --pitta: #f87171;
  --vata: #c084fc;
  --kapha: #60a5fa;
  --shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.2);
  --toast-bg: #f9fafb;
  --toast-text: #111827;
}

/* Sanskrit theme variables */
[data-theme="sanskrit"] {
  --primary: #1b5e20;
  --primary-light: #2e7d32;
  --primary-dark: #0d3d0f;
  --accent: #bf8b00;
  --accent-light: #d4a817;
  --bg: #f5f0e1;
  --card: #fdfbf7;
  --text: #1a1a1a;
  --text-light: #5d5d5d;
  --border: #e8dcc8;
  --success: #2e7d32;
  --warning: #bf8b00;
  --danger: #c62828;
  --pitta: #c62828;
  --vata: #6a1b9a;
  --kapha: #1565c0;
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04);
  font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

/* Header */
.header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
  padding: 12px 24px;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1600px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 12px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
}
.logo-icon {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.nav-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}
.nav-tab {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-tab:hover { background: rgba(255,255,255,0.2); }
.nav-tab.active { background: white; color: var(--primary); border-color: white; }

/* Search bar in header */
.global-search {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  min-width: 360px;
}
.global-search input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 14px;
}
.global-search button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 50%, #d97706 100%);
  color: white;
  padding: 40px 24px;
  text-align: center;
}
.hero h1 { font-size: 32px; margin-bottom: 8px; }
.hero p { font-size: 16px; opacity: 0.95; max-width: 800px; margin: 0 auto 20px; }
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.hero-stat {
  background: rgba(255,255,255,0.15);
  padding: 10px 18px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}
.hero-stat-num { font-size: 24px; font-weight: 700; }
.hero-stat-label { font-size: 12px; opacity: 0.9; }

/* Container */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

/* Section heading */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0 16px;
  flex-wrap: wrap;
  gap: 12px;
}
.section-title {
  font-size: 24px;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Filter panel */
.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  align-items: end;
}
.filter-item label {
  display: block;
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
  font-weight: 500;
}
.filter-item input,
.filter-item select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  background: white;
}
.filter-item input:focus,
.filter-item select:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(74, 124, 46, 0.1);
}
.filter-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}
.btn:hover { background: var(--primary-light); }
.btn-secondary {
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
}
.btn-secondary:hover { background: var(--bg); }
.btn-accent { background: var(--accent); }
.btn-accent:hover { background: var(--accent-light); }

/* Search panel (main) */
.search-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  margin-bottom: 24px;
}
.search-title {
  font-size: 20px;
  color: var(--primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Cards grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--border);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}
.card-subtitle {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 8px;
}
.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 4px;
  margin-bottom: 4px;
}
.badge-ayur { background: #dcfce7; color: #166534; }
.badge-panchakarma { background: #ddd6fe; color: #5b21b6; }
.badge-pitta { background: #fee2e2; color: #991b1b; }
.badge-vata { background: #ede9fe; color: #6b21a8; }
.badge-kapha { background: #dbeafe; color: #1e40af; }
.badge-default { background: #f3f4f6; color: #374151; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-success { background: #d1fae5; color: #065f46; }
.badge-info { background: #dbeafe; color: #1e40af; }

.card-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin: 6px 0;
  gap: 8px;
}
.card-row-label { color: var(--text-light); }
.card-row-value { color: var(--text); font-weight: 500; text-align: right; }
.card-rating { color: var(--accent); font-weight: 600; }
.card-location {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
  flex: 1;
}
.btn-sm:hover { background: var(--bg); }
.btn-sm-primary { background: var(--primary); color: white; border-color: var(--primary); }
.btn-sm-primary:hover { background: var(--primary-light); }

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0;
  flex-wrap: wrap;
}
.pagination button {
  padding: 8px 14px;
  border: 1px solid var(--border);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.pagination button.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Detail modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}
.modal-overlay.active { display: flex; }
.modal {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: var(--shadow-lg);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
}
.modal-title { font-size: 24px; color: var(--primary); }
.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-light);
}
.modal-section { margin: 16px 0; }
.modal-section h3 {
  color: var(--primary);
  margin-bottom: 8px;
  font-size: 16px;
}
.modal-section p, .modal-section li {
  color: var(--text);
  font-size: 14px;
  margin: 4px 0;
}
.modal-section ul { padding-left: 20px; }

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 2px solid var(--border);
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.tab {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-light);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}
.tab:hover { color: var(--primary); }
.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* Hidden */
.hidden { display: none !important; }

/* Responsive */
@media (max-width: 768px) {
  .header { padding: 8px 12px; }
  .header-row { gap: 8px; }
  .logo { font-size: 16px; }
  .logo-icon { width: 32px; height: 32px; font-size: 18px; }
  .global-search { min-width: 100%; order: 3; }
  .nav-tabs { width: 100%; justify-content: center; }
  .nav-tab { padding: 6px 10px; font-size: 12px; }
  .hero h1 { font-size: 22px; }
  .hero p { font-size: 14px; }
  .container { padding: 12px; }
  .cards-grid { grid-template-columns: 1fr; }
  .filter-grid { grid-template-columns: 1fr 1fr; }
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary); }

/* Auto-suggest dropdown */
.search-wrap { position: relative; }
.suggest-box {
  position: absolute;
  top: 100%; left: 0; right: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-top: 4px;
  max-height: 360px;
  overflow-y: auto;
  z-index: 50;
  display: none;
  box-shadow: var(--shadow-lg);
}
.suggest-box.active { display: block; }
.suggest-cat {
  padding: 6px 12px;
  background: var(--bg);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-light);
  text-transform: uppercase;
}
.suggest-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}
.suggest-item:hover { background: var(--bg); }
.suggest-item .name { font-weight: 500; }
.suggest-item .meta { font-size: 11px; color: var(--text-light); }

.empty {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}
.empty-icon { font-size: 48px; margin-bottom: 8px; }

.section-desc {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 12px;
}

.dosha-pill { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-right: 4px; }
.dosha-Vata { background: #ede9fe; color: #6b21a8; }
.dosha-Pitta { background: #fee2e2; color: #991b1b; }
.dosha-Kapha { background: #dbeafe; color: #1e40af; }
.dosha-Tridosha { background: #d1fae5; color: #065f46; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  background: var(--bg);
  padding: 12px;
  border-radius: 8px;
  margin: 12px 0;
}
.info-cell .info-label { font-size: 11px; color: var(--text-light); text-transform: uppercase; }
.info-cell .info-value { font-size: 14px; font-weight: 600; color: var(--text); margin-top: 2px; }
</style>

  <style>
    @keyframes toastIn { from { transform: translateY(10px); opacity:0;} to {transform:translateY(0);opacity:1;} }
    .badge-danger { background:#fee2e2; color:#dc2626; }
  </style>
</head>
<body>

<header class="header">
  <div class="header-row">
    <div class="logo">
      <div class="logo-icon">🕉</div>
      <span>Ayurvedic Health & Wellness — India</span>
    </div>
    <div class="search-wrap" style="flex: 1; max-width: 600px;">
      <div class="global-search">
        <input type="text" id="globalSearch" placeholder="Search doctors, hospitals, herbs, yoga, conditions..." autocomplete="off">
        <button onclick="performGlobalSearch()">Search</button>
      </div>
      <div class="suggest-box" id="suggestBox"></div>
    </div>
    <div class="header-tools" style="display: flex; gap: 8px; align-items: center;">
      <button class="btn btn-secondary btn-sm" id="themeToggle" onclick="cycleTheme()" title="Switch theme (Light/Dark/Sanskrit)">
        <span id="themeIcon">☀️</span> <span id="themeLabel">Light</span>
      </button>
      <button class="btn btn-secondary btn-sm" onclick="exportCurrentSectionCSV()" title="Export current view to CSV">📥 Export</button>
      <button class="btn btn-secondary btn-sm" onclick="toggleCompareMode()" id="compareToggle" title="Compare mode">⚖️ Compare</button>
      <button class="btn btn-secondary btn-sm" onclick="showFavorites()" title="My Favorites">⭐ Favorites</button>
      <button class="btn btn-secondary btn-sm" onclick="showSearchHistory()" title="Search History">🕐 History</button>
    </div>
    <nav class="nav-tabs">
      <button class="nav-tab active" data-section="doctors">👨‍⚕️ Doctors</button>
      <button class="nav-tab" data-section="hospitals">🏥 Hospitals</button>
      <button class="nav-tab" data-section="herbs">🌿 Herbs</button>
      <button class="nav-tab" data-section="therapies">💆 Therapies</button>
      <button class="nav-tab" data-section="yoga">🧘 Yoga</button>
      <button class="nav-tab" data-section="health">❤️ Health</button>
      <button class="nav-tab" data-section="analytics">📊 Analytics</button>
      <button class="nav-tab" data-section="appointments">📅 Appointments</button>
      <button class="nav-tab" data-section="tracker">📈 Tracker</button>
    </nav>
  </div>
</header>

<div class="hero">
  <h1>Complete Ayurvedic Healthcare for India</h1>
  <p>Find the best Ayurvedic & allopathic doctors, hospitals, panchakarma centers, therapies, herbs, yoga, and health guidance from every state, district, and city in India.</p>
  <div class="hero-stats" id="heroStats">
    <div class="hero-stat"><div class="hero-stat-num" id="stat-doctors">—</div><div class="hero-stat-label">Doctors</div></div>
    <div class="hero-stat"><div class="hero-stat-num" id="stat-hospitals">—</div><div class="hero-stat-label">Hospitals</div></div>
    <div class="hero-stat"><div class="hero-stat-num" id="stat-herbs">—</div><div class="hero-stat-label">Herbs</div></div>
    <div class="hero-stat"><div class="hero-stat-num" id="stat-therapies">—</div><div class="hero-stat-label">Therapies</div></div>
    <div class="hero-stat"><div class="hero-stat-num" id="stat-yoga">—</div><div class="hero-stat-label">Yoga</div></div>
    <div class="hero-stat"><div class="hero-stat-num" id="stat-health">—</div><div class="hero-stat-label">Health Conditions</div></div>
  </div>
</div>

<div class="container">
  <!-- DOCTORS SECTION -->
  <section id="section-doctors" class="section">
    <div class="search-panel">
      <h2 class="search-title">🔍 Find Ayurvedic & Allopathic Doctors in India</h2>
      <p class="section-desc">Search across 36 states & union territories, 700+ districts, and thousands of cities. Filter by specialty, mode of consultation, fee, and more.</p>
      <div class="filter-grid">
        <div class="filter-item">
          <label>Search by name, clinic, city</label>
          <input type="text" id="doc-search" placeholder="e.g. Dr. Sharma, Varanasi, Panchakarma">
        </div>
        <div class="filter-item">
          <label>Country</label>
          <select id="doc-country"><option value="all">All Countries</option></select>
        </div>
        <div class="filter-item">
          <label>State</label>
          <select id="doc-state"><option value="all">All States</option></select>
        </div>
        <div class="filter-item">
          <label>District / City</label>
          <select id="doc-district"><option value="all">All</option></select>
        </div>
        <div class="filter-item">
          <label>Village / Area</label>
          <select id="doc-village"><option value="all">All</option></select>
        </div>
        <div class="filter-item">
          <label>Specialty</label>
          <select id="doc-specialty"><option value="all">All Specialties</option></select>
        </div>
        <div class="filter-item">
          <label>Mode of Consultation</label>
          <select id="doc-mode">
            <option value="all">All</option>
            <option value="inperson">In-person</option>
            <option value="video">Video Consult</option>
            <option value="home">Home Visit</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Doctor Type</label>
          <select id="doc-type">
            <option value="all">All Doctors</option>
            <option value="ayurvedic">Ayurvedic Only</option>
            <option value="panchakarma">Panchakarma Certified</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Min Rating</label>
          <select id="doc-rating">
            <option value="0">Any</option>
            <option value="3.5">3.5+</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Max Fee (₹)</label>
          <input type="number" id="doc-fee" placeholder="e.g. 500">
        </div>
        <div class="filter-item">
          <label>Min Experience (years)</label>
          <input type="number" id="doc-experience" placeholder="e.g. 5">
        </div>
        <div class="filter-item">
          <label>Sort By</label>
          <select id="doc-sort">
            <option value="rating-desc">Rating (High to Low)</option>
            <option value="rating-asc">Rating (Low to High)</option>
            <option value="consultationFee-asc">Fee (Low to High)</option>
            <option value="consultationFee-desc">Fee (High to Low)</option>
            <option value="experience-desc">Experience (High to Low)</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button class="btn btn-accent" onclick="loadDoctors(1)">🔍 Search</button>
        <button class="btn btn-secondary" onclick="resetDoctorFilters()">Reset Filters</button>
        <span id="doc-count" style="margin-left:auto; align-self:center; color:var(--text-light); font-size:14px;"></span>
      </div>
    </div>
    <div class="cards-grid" id="doctors-grid"></div>
    <div class="pagination" id="doctors-pagination"></div>
  </section>

  <!-- HOSPITALS SECTION -->
  <section id="section-hospitals" class="section hidden">
    <div class="search-panel">
      <h2 class="search-title">🏥 Find Ayurvedic Hospitals, Panchakarma Centers & Wellness Resorts</h2>
      <p class="section-desc">Multi-specialty hospitals, Ayurvedic hospitals, panchakarma centers, wellness resorts, eye hospitals, maternity homes, and more across India.</p>
      <div class="filter-grid">
        <div class="filter-item">
          <label>Search</label>
          <input type="text" id="hosp-search" placeholder="e.g. Apollo, Kottakkal, Eye Hospital">
        </div>
        <div class="filter-item">
          <label>Country</label>
          <select id="hosp-country"><option value="all">All</option></select>
        </div>
        <div class="filter-item">
          <label>State</label>
          <select id="hosp-state"><option value="all">All States</option></select>
        </div>
        <div class="filter-item">
          <label>District / City</label>
          <select id="hosp-district"><option value="all">All</option></select>
        </div>
        <div class="filter-item">
          <label>Hospital Type</label>
          <select id="hosp-type"><option value="all">All Types</option></select>
        </div>
        <div class="filter-item">
          <label>Hospital Category</label>
          <select id="hosp-category">
            <option value="all">All</option>
            <option value="ayurvedic">Ayurvedic Hospitals</option>
            <option value="panchakarma">Panchakarma Centers</option>
            <option value="allopathy">Multi-Specialty (Allopathy)</option>
            <option value="wellness">Wellness Resorts</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Min Rating</label>
          <select id="hosp-rating">
            <option value="0">Any</option>
            <option value="3.5">3.5+</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Min Beds</label>
          <input type="number" id="hosp-beds" placeholder="e.g. 50">
        </div>
        <div class="filter-item">
          <label>Facilities Required</label>
          <select id="hosp-facility">
            <option value="all">Any</option>
            <option value="Emergency 24x7">Emergency 24x7</option>
            <option value="ICU">ICU</option>
            <option value="Ambulance">Ambulance</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Panchakarma Theatre">Panchakarma Theatre</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Sort By</label>
          <select id="hosp-sort">
            <option value="rating-desc">Rating</option>
            <option value="totalBeds-desc">Bed Count</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button class="btn btn-accent" onclick="loadHospitals(1)">🔍 Search</button>
        <button class="btn btn-secondary" onclick="resetHospitalFilters()">Reset Filters</button>
        <span id="hosp-count" style="margin-left:auto; align-self:center; color:var(--text-light); font-size:14px;"></span>
      </div>
    </div>
    <div class="cards-grid" id="hospitals-grid"></div>
    <div class="pagination" id="hospitals-pagination"></div>
  </section>

  <!-- HERBS SECTION -->
  <section id="section-herbs" class="section hidden">
    <div class="search-panel">
      <h2 class="search-title">🌿 Ayurvedic Herbs & Their Uses — Complete Database</h2>
      <p class="section-desc">Search 1000+ Ayurvedic herbs (with regional varieties) covering rasa, guna, virya, vipaka, dosha effect, formulations, dosage, indications, and research citations.</p>
      <div class="filter-grid">
        <div class="filter-item">
          <label>Search by name, Sanskrit, use</label>
          <input type="text" id="herb-search" placeholder="e.g. Ashwagandha, immunity, skin">
        </div>
        <div class="filter-item">
          <label>Category</label>
          <select id="herb-category"><option value="all">All Categories</option></select>
        </div>
        <div class="filter-item">
          <label>Dosha Effect</label>
          <select id="herb-dosha">
            <option value="all">All</option>
            <option value="Vata">Vata-</option>
            <option value="Pitta">Pitta-</option>
            <option value="Kapha">Kapha-</option>
            <option value="Tridosha">Tridosha Balance</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Plant Part Used</label>
          <select id="herb-part">
            <option value="all">All</option>
            <option value="root">Root</option>
            <option value="leaf">Leaves</option>
            <option value="fruit">Fruit</option>
            <option value="seed">Seed</option>
            <option value="bark">Bark</option>
            <option value="flower">Flower</option>
            <option value="rhizome">Rhizome</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Evidence Level</label>
          <select id="herb-evidence">
            <option value="all">All</option>
            <option value="Very High">Very High</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Sort By</label>
          <select id="herb-sort">
            <option value="researchCitations-desc">Research Citations (High to Low)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="category-asc">Category</option>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button class="btn btn-accent" onclick="loadHerbs(1)">🔍 Search</button>
        <button class="btn btn-secondary" onclick="resetHerbFilters()">Reset Filters</button>
        <span id="herb-count" style="margin-left:auto; align-self:center; color:var(--text-light); font-size:14px;"></span>
      </div>
    </div>
    <div class="cards-grid" id="herbs-grid"></div>
    <div class="pagination" id="herbs-pagination"></div>
  </section>

  <!-- THERAPIES SECTION -->
  <section id="section-therapies" class="section hidden">
    <div class="search-panel">
      <h2 class="search-title">💆 Ayurvedic Therapies & Panchakarma Treatments</h2>
      <p class="section-desc">Complete guide to Panchakarma (Vamana, Virechana, Basti, Nasya, Raktamokshana), Abhyanga, Shirodhara, Pizichil, Kati Basti, Kshara Sutra, and more.</p>
      <div class="filter-grid">
        <div class="filter-item">
          <label>Search by therapy, indication</label>
          <input type="text" id="th-search" placeholder="e.g. Shirodhara, joint pain, panchakarma">
        </div>
        <div class="filter-item">
          <label>Category</label>
          <select id="th-category"><option value="all">All</option></select>
        </div>
        <div class="filter-item">
          <label>Type</label>
          <select id="th-type">
            <option value="all">All</option>
            <option value="Main Therapy">Main Therapy</option>
            <option value="Preparatory Therapy">Preparatory</option>
            <option value="External">External</option>
            <option value="Local">Local</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Indication</label>
          <input type="text" id="th-indication" placeholder="e.g. Back pain, hair fall">
        </div>
      </div>
      <div class="filter-actions">
        <button class="btn btn-accent" onclick="loadTherapies(1)">🔍 Search</button>
        <button class="btn btn-secondary" onclick="resetTherapyFilters()">Reset Filters</button>
        <span id="th-count" style="margin-left:auto; align-self:center; color:var(--text-light); font-size:14px;"></span>
      </div>
    </div>
    <div class="cards-grid" id="therapies-grid"></div>
    <div class="pagination" id="therapies-pagination"></div>
  </section>

  <!-- YOGA SECTION -->
  <section id="section-yoga" class="section hidden">
    <div class="search-panel">
      <h2 class="search-title">🧘 Yoga Asanas, Pranayama, Mudras & Meditation</h2>
      <p class="section-desc">Complete guide to yoga asanas (standing, seated, backbends, inversions, supine, hip openers, core), pranayama techniques, mudras, and meditation practices.</p>
      <div class="filter-grid">
        <div class="filter-item">
          <label>Search by name, benefit</label>
          <input type="text" id="yoga-search" placeholder="e.g. Tadasana, stress relief, breathing">
        </div>
        <div class="filter-item">
          <label>Category</label>
          <select id="yoga-category"><option value="all">All</option></select>
        </div>
        <div class="filter-item">
          <label>Difficulty</label>
          <select id="yoga-difficulty">
            <option value="all">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Indication / Health Goal</label>
          <input type="text" id="yoga-indication" placeholder="e.g. back pain, anxiety">
        </div>
      </div>
      <div class="filter-actions">
        <button class="btn btn-accent" onclick="loadYoga(1)">🔍 Search</button>
        <button class="btn btn-secondary" onclick="resetYogaFilters()">Reset Filters</button>
        <span id="yoga-count" style="margin-left:auto; align-self:center; color:var(--text-light); font-size:14px;"></span>
      </div>
    </div>
    <div class="cards-grid" id="yoga-grid"></div>
    <div class="pagination" id="yoga-pagination"></div>
  </section>

  <!-- HEALTH BENEFITS SECTION -->
    <section id="section-health" class="section hidden">
      <div class="search-panel">
        <h2 class="search-title">❤️ Health Conditions — Complete Ayurvedic Treatment Guide</h2>
        <p class="section-desc">Comprehensive Ayurvedic perspective on common health conditions: causes, symptoms, herbs, formulations, diet, lifestyle, yoga, pranayama, home remedies, and specialist info.</p>
        <div class="filter-grid">
          <div class="filter-item">
            <label>Search condition or symptom</label>
            <input type="text" id="h-search" placeholder="e.g. diabetes, acidity, joint pain">
          </div>
          <div class="filter-item">
            <label>Body System</label>
            <select id="h-category"><option value="all">All</option></select>
          </div>
          <div class="filter-item">
            <label>Severity</label>
            <select id="h-severity">
              <option value="all">All</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Dosha Imbalance</label>
            <select id="h-dosha">
              <option value="all">All</option>
              <option value="Vata">Vata</option>
              <option value="Pitta">Pitta</option>
              <option value="Kapha">Kapha</option>
              <option value="Vata-Pitta">Vata-Pitta</option>
              <option value="Vata-Kapha">Vata-Kapha</option>
              <option value="Tridosha">Tridosha</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-accent" onclick="loadHealth(1)">🔍 Search</button>
          <button class="btn btn-secondary" onclick="resetHealthFilters()">Reset Filters</button>
          <span id="h-count" style="margin-left:auto; align-self:center; color:var(--text-light); font-size:14px;"></span>
        </div>
      </div>
      <div class="cards-grid" id="health-grid"></div>
      <div class="pagination" id="health-pagination"></div>
    </section>

    <!-- ANALYTICS SECTION -->
    <section id="section-analytics" class="section hidden">
      <div class="search-panel">
        <h2 class="search-title">📊 Advanced Analytics & Insights</h2>
        <p class="section-desc">Comprehensive analytics across all healthcare data: doctor distribution, hospital capacity, herb research trends, therapy effectiveness, patient demographics, and revenue insights.</p>
        <div class="filter-grid">
          <div class="filter-item">
            <label>Analytics Category</label>
            <select id="anl-category">
              <option value="overview">Overview Dashboard</option>
              <option value="doctors">Doctor Analytics</option>
              <option value="hospitals">Hospital Analytics</option>
              <option value="herbs">Herb Research</option>
              <option value="therapies">Therapy Distribution</option>
              <option value="yoga">Yoga Practice</option>
              <option value="conditions">Condition Prevalence</option>
              <option value="appointments">Appointment Trends</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="patients">Patient Demographics</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Time Period</label>
            <select id="anl-period">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div class="filter-item">
            <label>State Filter</label>
            <select id="anl-state"><option value="all">All States</option></select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-accent" onclick="loadAnalytics()">🔍 Generate Report</button>
          <button class="btn btn-secondary" onclick="resetAnalyticsFilters()">Reset</button>
          <button class="btn btn-secondary" onclick="exportAnalytics()">📥 Export</button>
        </div>
      </div>
      <div class="analytics-grid" id="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px;"></div>
    </section>

    <!-- APPOINTMENTS SECTION -->
    <section id="section-appointments" class="section hidden">
      <div class="search-panel">
        <h2 class="search-title">📅 Appointment Management</h2>
        <p class="section-desc">Book, manage, and track appointments with doctors and hospitals. View history, upcoming visits, and manage your healthcare schedule.</p>
        <div class="filter-grid">
          <div class="filter-item">
            <label>Search Patient</label>
            <input type="text" id="apt-search" placeholder="Patient name or ID">
          </div>
          <div class="filter-item">
            <label>Status</label>
            <select id="apt-status">
              <option value="all">All</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Type</label>
            <select id="apt-type">
              <option value="all">All</option>
              <option value="In-person">In-person</option>
              <option value="Video Consult">Video Consult</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Date Range</label>
            <select id="apt-date">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Doctor</label>
            <select id="apt-doctor"><option value="all">All Doctors</option></select>
          </div>
          <div class="filter-item">
            <label>Hospital</label>
            <select id="apt-hospital"><option value="all">All Hospitals</option></select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-accent" onclick="loadAppointments(1)">🔍 Search</button>
          <button class="btn btn-secondary" onclick="resetAppointmentFilters()">Reset</button>
          <button class="btn btn-secondary" onclick="exportAppointments()">📥 Export</button>
          <button class="btn" onclick="showBookAppointmentModal()">➕ Book New</button>
        </div>
      </div>
      <div class="cards-grid" id="appointments-grid"></div>
      <div class="pagination" id="appointments-pagination"></div>
    </section>

    <!-- HEALTH TRACKER SECTION -->
    <section id="section-tracker" class="section hidden">
      <div class="search-panel">
        <h2 class="search-title">📈 Personal Health Tracker</h2>
        <p class="section-desc">Track vital health metrics over time: weight, blood pressure, blood sugar, cholesterol, thyroid, vitamins, sleep, activity, and more. Visualize trends and share with doctors.</p>
        <div class="filter-grid">
          <div class="filter-item">
            <label>Patient</label>
            <select id="trk-patient"><option value="all">All Patients</option></select>
          </div>
          <div class="filter-item">
            <label>Metric</label>
            <select id="trk-metric">
              <option value="all">All Metrics</option>
              <option value="Weight">Weight (kg)</option>
              <option value="Blood Pressure Systolic">BP Systolic (mmHg)</option>
              <option value="Blood Pressure Diastolic">BP Diastolic (mmHg)</option>
              <option value="Blood Sugar (Fasting)">Fasting Glucose (mg/dL)</option>
              <option value="Blood Sugar (Post-meal)">Post-Meal Glucose (mg/dL)</option>
              <option value="HbA1c">HbA1c (%)</option>
              <option value="Cholesterol Total">Total Cholesterol (mg/dL)</option>
              <option value="HDL Cholesterol">HDL (mg/dL)</option>
              <option value="LDL Cholesterol">LDL (mg/dL)</option>
              <option value="Triglycerides">Triglycerides (mg/dL)</option>
              <option value="Thyroid TSH">TSH (mIU/L)</option>
              <option value="Vitamin D">Vitamin D (ng/mL)</option>
              <option value="Vitamin B12">Vitamin B12 (pg/mL)</option>
              <option value="Hemoglobin">Hemoglobin (g/dL)</option>
              <option value="Body Temperature">Temperature (°F)</option>
              <option value="Heart Rate">Heart Rate (bpm)</option>
              <option value="Oxygen Saturation">SpO2 (%)</option>
              <option value="Sleep Hours">Sleep (hrs)</option>
              <option value="Steps Walked">Steps</option>
              <option value="Water Intake">Water (L)</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Status</label>
            <select id="trk-status">
              <option value="all">All</option>
              <option value="Normal">Normal</option>
              <option value="Elevated">Elevated</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
              <option value="Improving">Improving</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Time Range</label>
            <select id="trk-period">
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-accent" onclick="loadTracker(1)">🔍 Load Data</button>
          <button class="btn btn-secondary" onclick="resetTrackerFilters()">Reset</button>
          <button class="btn btn-secondary" onclick="exportTracker()">📥 Export</button>
          <button class="btn" onclick="showAddTrackerModal()">➕ Add Reading</button>
        </div>
      </div>
      <div class="tracker-charts" id="tracker-charts" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 16px; margin-bottom: 16px;"></div>
      <div class="cards-grid" id="tracker-grid"></div>
      <div class="pagination" id="tracker-pagination"></div>
    </section>
  </div>

<!-- Modal -->
<div class="modal-overlay" id="modal">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title" id="modal-title"></h2>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div id="modal-body"></div>
  </div>
</div>

<script>
// ============================================================
// STATE
// ============================================================
let filterOptions = {};
let currentSection = 'doctors';
let currentDoctorPage = 1;
let currentHospitalPage = 1;
let currentHerbPage = 1;
let currentTherapyPage = 1;
let currentYogaPage = 1;
let currentHealthPage = 1;

// ============================================================
// INIT
// ============================================================
async function init() {
  loadTheme();
  await loadFilterOptions();
  loadStats();
  setupSearchAutocomplete();
  setupNavTabs();
  loadDoctors(1);
  loadAnalyticsMeta();
  loadAppointmentMeta();
  loadTrackerMeta();
}

// Theme System
function loadTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeUI(saved);
}

function cycleTheme() {
  const themes = ['light', 'dark', 'sanskrit'];
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeUI(next);
}

function updateThemeUI(theme) {
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (!icon || !label) return;
  if (theme === 'dark') { icon.textContent = '🌙'; label.textContent = 'Dark'; }
  else if (theme === 'sanskrit') { icon.textContent = '🕉️'; label.textContent = 'Sanskrit'; }
  else { icon.textContent = '☀️'; label.textContent = 'Light'; }
}

// Compare Mode
let compareMode = false;
let compareItems = [];

function toggleCompareMode() {
  compareMode = !compareMode;
  const btn = document.getElementById('compareToggle');
  if (compareMode) {
    btn.classList.add('active');
    btn.style.background = 'var(--accent)';
    btn.style.color = 'white';
    showToast('Compare mode ON - click cards to add to comparison (max 4)', 'info');
  } else {
    btn.classList.remove('active');
    btn.style.background = '';
    btn.style.color = '';
    compareItems = [];
    showToast('Compare mode OFF', 'info');
  }
}

function addToCompare(type, id, name) {
  if (!compareMode) return;
  if (compareItems.some(item => item.type === type && item.id === id)) {
    showToast('Already in comparison', 'warning');
    return;
  }
  if (compareItems.length >= 4) {
    showToast('Maximum 4 items for comparison', 'error');
    return;
  }
  compareItems.push({ type, id, name });
  showToast(`Added ${name} to comparison (${compareItems.length}/4)`, 'success');
  if (compareItems.length >= 2) {
    showCompareModal();
  }
}

function showCompareModal() {
  if (compareItems.length < 2) return;
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  title.textContent = `⚖️ Compare ${compareItems.length} Items`;
  body.innerHTML = '<div style="text-align:center; padding: 20px;">Loading comparison...</div>';
  modal.classList.add('active');
  
  Promise.all(compareItems.map(item => 
    fetch('/api/' + (item.type === 'condition' ? 'health-benefits' : item.type + 's') + '/' + item.id).then(r => r.json())
  )).then(data => {
    renderComparison(data);
  });
}

function renderComparison(items) {
  const body = document.getElementById('modal-body');
  if (items.length === 0) return;
  const type = items[0].type || (items[0].specialty ? 'doctor' : items[0].type ? 'hospital' : 'unknown');
  
  let html = '<table style="width:100%; font-size:12px;"><thead><tr><th style="width:150px;">Property</th>';
  items.forEach(item => {
    html += '<th>' + (item.name || item.english || item.name) + '</th>';
  });
  html += '</tr></thead><tbody>';
  
  // Compare common properties based on type
  const props = getCompareProperties(type);
  props.forEach(prop => {
    html += '<tr><td><strong>' + prop.label + '</strong></td>';
    items.forEach(item => {
      const val = getNestedProp(item, prop.key);
      html += '<td>' + (val || '—') + '</td>';
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  body.innerHTML = html;
}

function getCompareProperties(type) {
  switch(type) {
    case 'doctor': return [
      {label: 'Specialty', key: 'specialty'}, {label: 'Degree', key: 'degree'},
      {label: 'Experience', key: 'experience'}, {label: 'Rating', key: 'rating'},
      {label: 'Fee (₹)', key: 'consultationFee'}, {label: 'City', key: 'city'},
      {label: 'State', key: 'state'}, {label: 'Languages', key: 'languages'},
      {label: 'Video Consult', key: 'consultationModes'}, {label: 'Home Visit', key: 'consultationModes'},
      {label: 'Online Booking', key: 'onlineBooking'}, {label: 'Panchakarma', key: 'panchakarmaCertified'}
    ];
    case 'hospital': return [
      {label: 'Type', key: 'type'}, {label: 'Category', key: 'isAyurvedic'},
      {label: 'Beds', key: 'totalBeds'}, {label: 'ICU Beds', key: 'icuBeds'},
      {label: 'Doctors', key: 'totalDoctors'}, {label: 'Rating', key: 'rating'},
      {label: 'City', key: 'city'}, {label: 'State', key: 'state'},
      {label: 'Emergency', key: 'facilities'}, {label: 'Panchakarma', key: 'panchakarmaAvailable'},
      {label: 'Yoga Center', key: 'yogaCenter'}, {label: 'Accreditations', key: 'accreditations'}
    ];
    case 'herb': return [
      {label: 'Sanskrit', key: 'sanskrit'}, {label: 'Category', key: 'category'},
      {label: 'Dosha', key: 'doshaEffect'}, {label: 'Citations', key: 'researchCitations'},
      {label: 'Evidence', key: 'evidenceLevel'}, {label: 'Part Used', key: 'partUsed'},
      {label: 'Rasa', key: 'rasa'}, {label: 'Virya', key: 'virya'}
    ];
    case 'therapy': return [
      {label: 'Category', key: 'category'}, {label: 'Type', key: 'type'},
      {label: 'Duration', key: 'duration'}, {label: 'Cost', key: 'cost'},
      {label: 'Best Season', key: 'bestSeason'}
    ];
    case 'yoga': return [
      {label: 'English', key: 'english'}, {label: 'Category', key: 'category'},
      {label: 'Difficulty', key: 'difficulty'}, {label: 'Duration', key: 'duration'},
      {label: 'Best Time', key: 'bestTime'}, {label: 'Chakra', key: 'chakra'}
    ];
    case 'condition': return [
      {label: 'Ayurvedic Name', key: 'ayurvedicName'}, {label: 'Category', key: 'category'},
      {label: 'Severity', key: 'severity'}, {label: 'Dosha', key: 'doshaImbalance'},
      {label: 'Duration', key: 'duration'}, {label: 'Specialist', key: 'specialist'}
    ];
    default: return [];
  }
}

function getNestedProp(obj, path) {
  if (!obj || !path) return '—';
  if (path.includes('.')) {
    return path.split('.').reduce((o, k) => o?.[k], obj) || '—';
  }
  const val = obj[path];
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') return JSON.stringify(val);
  return val || '—';
}

// Favorites System
function showFavorites() {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  title.textContent = '⭐ My Favorites';
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  if (favs.length === 0) {
    body.innerHTML = '<div class="empty"><div class="empty-icon">⭐</div><div>No favorites yet. Click the star on any card to save.</div></div>';
  } else {
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
    favs.forEach(fav => {
      html += '<div class="card" style="margin-bottom: 12px;">';
      html += '<div class="card-header"><div><div class="card-title">' + fav.name + '</div>';
      html += '<div class="card-subtitle">' + fav.type + ' • ' + fav.details + '</div></div>';
      html += '<div class="card-actions"><button class="btn-sm btn-sm-primary" onclick="showDetail(\'' + fav.type + '\', \'' + fav.id + '\')">View</button>';
      html += '<button class="btn-sm btn-danger" onclick="removeFavorite(\'' + fav.id + '\', \'' + fav.type + '\')">Remove</button></div>';
      html += '</div>';
    });
    html += '</div>';
    body.innerHTML = html;
  }
  modal.classList.add('active');
}

function toggleFavorite(type, id, name, details) {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const idx = favs.findIndex(f => f.type === type && f.id === id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    showToast('Removed from favorites', 'info');
  } else {
    favs.unshift({ type, id, name, details, addedAt: new Date().toISOString() });
    showToast('Added to favorites ⭐', 'success');
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function removeFavorite(id, type) {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const filtered = favs.filter(f => !(f.id === id && f.type === type));
  localStorage.setItem('favorites', JSON.stringify(filtered));
  showFavorites();
}

// Search History
function showSearchHistory() {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  title.textContent = '🕐 Search History';
  const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  
  if (history.length === 0) {
    body.innerHTML = '<div class="empty"><div class="empty-icon">🕐</div><div>No search history yet.</div></div>';
  } else {
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
    history.slice(0, 50).forEach(h => {
      html += '<div class="card" style="margin-bottom: 8px; padding: 12px;">';
      html += '<div style="display:flex; justify-content:space-between;">';
      html += '<div><strong>' + h.query + '</strong> <span style="color:var(--text-light); font-size:12px;">(' + h.section + ')</span></div>';
      html += '<span style="color:var(--text-light); font-size:11px;">' + new Date(h.time).toLocaleString() + '</span>';
      html += '</div>';
      html += '<div class="card-actions" style="margin-top:8px;">';
      html += '<button class="btn-sm btn-sm-primary" onclick="repeatSearch(\'' + h.query + '\', \'' + h.section + '\')">Repeat</button>';
      html += '</div>';
      html += '</div>';
    });
    html += '<div class="filter-actions" style="margin-top:16px;"><button class="btn btn-danger btn-sm" onclick="clearSearchHistory()">Clear History</button></div>';
    html += '</div>';
    body.innerHTML = html;
  }
  modal.classList.add('active');
}

function addToSearchHistory(query, section) {
  if (!query || query.trim().length < 2) return;
  const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  history.unshift({ query, section, time: new Date().toISOString() });
  // Keep only last 100
  if (history.length > 100) history.splice(100);
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

function repeatSearch(query, section) {
  document.getElementById('globalSearch').value = query;
  switchTab(section);
  setTimeout(() => {
    const searchInput = document.getElementById(section === 'doctors' ? 'doc-search' : 
      section === 'hospitals' ? 'hosp-search' : 
      section === 'herbs' ? 'herb-search' : 
      section === 'therapies' ? 'th-search' : 
      section === 'yoga' ? 'yoga-search' : 'h-search');
    if (searchInput) {
      searchInput.value = query;
      if (section === 'doctors') loadDoctors(1);
      else if (section === 'hospitals') loadHospitals(1);
      else if (section === 'herbs') loadHerbs(1);
      else if (section === 'therapies') loadTherapies(1);
      else if (section === 'yoga') loadYoga(1);
      else if (section === 'health') loadHealth(1);
    }
  }, 100);
  closeModal();
}

function clearSearchHistory() {
  localStorage.removeItem('searchHistory');
  showSearchHistory();
}

function clearCompare() {
  compareItems = [];
  const btn = document.getElementById('compareToggle');
  btn.classList.remove('active');
  btn.style.background = '';
  btn.style.color = '';
  showToast('Comparison cleared', 'info');
}

async function loadFilterOptions() {
  const res = await fetch('/api/filter-options');
  filterOptions = await res.json();
  populateSelect('doc-country', filterOptions.countries);
  populateSelect('doc-state', filterOptions.states);
  populateSelect('doc-specialty', filterOptions.doctorSpecialties);
  populateSelect('hosp-country', filterOptions.countries);
  populateSelect('hosp-state', filterOptions.states);
  populateSelect('hosp-type', filterOptions.hospitalTypes);
  populateSelect('herb-category', filterOptions.herbCategories);
  populateSelect('th-category', filterOptions.therapyCategories);
  populateSelect('yoga-category', filterOptions.yogaCategories);
  populateSelect('h-category', filterOptions.healthCategories);

  // District/Village selectors
  const updateDocDistrict = () => {
    const state = document.getElementById('doc-state').value;
    const districts = state !== 'all' ? (filterOptions.citiesByState[state] || []) : [];
    populateSelect('doc-district', districts);
    populateSelect('doc-village', filterOptions.villages);
  };
  document.getElementById('doc-state').addEventListener('change', updateDocDistrict);

  const updateHospDistrict = () => {
    const state = document.getElementById('hosp-state').value;
    const districts = state !== 'all' ? (filterOptions.citiesByState[state] || []) : [];
    populateSelect('hosp-district', districts);
  };
  document.getElementById('hosp-state').addEventListener('change', updateHospDistrict);
}

function populateSelect(id, options) {
  const sel = document.getElementById(id);
  if (!sel) return;
  const cur = sel.value;
  const first = sel.options[0] ? sel.options[0].outerHTML : '<option value="all">All</option>';
  sel.innerHTML = first;
  options.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o;
    opt.textContent = o;
    sel.appendChild(opt);
  });
  sel.value = cur || 'all';
}

async function loadStats() {
  const res = await fetch('/api/stats');
  const s = await res.json();
  document.getElementById('stat-doctors').textContent = s.doctors.total.toLocaleString();
  document.getElementById('stat-hospitals').textContent = s.hospitals.total.toLocaleString();
  document.getElementById('stat-herbs').textContent = s.herbs.total.toLocaleString();
  document.getElementById('stat-therapies').textContent = s.therapies.total.toLocaleString();
  document.getElementById('stat-yoga').textContent = s.yoga.total.toLocaleString();
  document.getElementById('stat-health').textContent = s.healthConditions.total.toLocaleString();
}

// ============================================================
// NAVIGATION
// ============================================================
function setupNavTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.dataset.section;
      currentSection = section;
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
      document.getElementById('section-' + section).classList.remove('hidden');
      window.scrollTo(0, 0);
      // Lazy-load
      if (section === 'hospitals' && !document.getElementById('hospitals-grid').innerHTML.trim()) loadHospitals(1);
      if (section === 'herbs' && !document.getElementById('herbs-grid').innerHTML.trim()) loadHerbs(1);
      if (section === 'therapies' && !document.getElementById('therapies-grid').innerHTML.trim()) loadTherapies(1);
      if (section === 'yoga' && !document.getElementById('yoga-grid').innerHTML.trim()) loadYoga(1);
      if (section === 'health' && !document.getElementById('health-grid').innerHTML.trim()) loadHealth(1);
      if (section === 'analytics' && !document.getElementById('analytics-grid').innerHTML.trim()) loadAnalytics();
      if (section === 'appointments' && !document.getElementById('appointments-grid').innerHTML.trim()) loadAppointments(1);
      if (section === 'tracker' && !document.getElementById('tracker-grid').innerHTML.trim()) loadTracker(1);
    });
  });
}

// ============================================================
// TOAST + TAB HELPERS (referenced by compare/favorites/history)
// ============================================================
function showToast(msg, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(c);
  }
  const colors = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#2563eb' };
  const el = document.createElement('div');
  el.style.cssText = 'background:' + (colors[type] || colors.info) + ';color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,.2);max-width:320px;animation:toastIn .2s ease;';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 2600);
}
function switchTab(section) {
  const tab = document.querySelector('.nav-tab[data-section="' + section + '"]');
  if (tab) tab.click();
}

// ============================================================
// GLOBAL SEARCH AUTOCOMPLETE
// ============================================================
let searchTimeout;
function setupSearchAutocomplete() {
  const input = document.getElementById('globalSearch');
  const box = document.getElementById('suggestBox');
  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = input.value.trim();
    if (q.length < 2) { box.classList.remove('active'); return; }
    searchTimeout = setTimeout(async () => {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q));
      const data = await res.json();
      renderSuggestions(data);
    }, 250);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) box.classList.remove('active');
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performGlobalSearch();
  });
}
function renderSuggestions(data) {
  const box = document.getElementById('suggestBox');
  const sections = [
    { label: '👨‍⚕️ Doctors', items: data.doctors, type: 'doctor' },
    { label: '🏥 Hospitals', items: data.hospitals, type: 'hospital' },
    { label: '🌿 Herbs', items: data.herbs, type: 'herb' },
    { label: '💆 Therapies', items: data.therapies, type: 'therapy' },
    { label: '🧘 Yoga', items: data.yoga, type: 'yoga' },
    { label: '❤️ Health Conditions', items: data.conditions, type: 'condition' }
  ];
  let html = '';
  let total = 0;
  sections.forEach(s => {
    if (s.items && s.items.length > 0) {
      html += '<div class="suggest-cat">' + s.label + '</div>';
      s.items.slice(0, 5).forEach(item => {
        const name = item.name || item.english || '';
        const meta = item.city ? item.city + ', ' + item.state : (item.family || item.category || item.sanskrit || '');
        html += '<div class="suggest-item" data-type="' + s.type + '" data-id="' + item.id + '">';
        html += '<div class="name">' + name + '</div>';
        if (meta) html += '<div class="meta">' + meta + '</div>';
        html += '</div>';
      });
      total += s.items.length;
    }
  });
  if (total === 0) {
    html = '<div class="suggest-item" style="text-align:center; color:#6b7280;">No results found</div>';
  }
  box.innerHTML = html;
  box.classList.add('active');
  box.querySelectorAll('.suggest-item').forEach(item => {
    const type = item.dataset.type;
    const id = item.dataset.id;
    if (type && id) {
      item.addEventListener('click', () => showDetail(type, id));
    }
  });
}
async function performGlobalSearch() {
  const q = document.getElementById('globalSearch').value.trim();
  if (!q) return;
  const res = await fetch('/api/search?q=' + encodeURIComponent(q));
  const data = await res.json();
  renderSuggestions(data);
}

// ============================================================
// DOCTORS
// ============================================================
async function loadDoctors(page = 1) {
  currentDoctorPage = page;
  const params = new URLSearchParams();
  const val = id => document.getElementById(id).value;
  if (val('doc-search')) params.set('q', val('doc-search'));
  ['doc-country', 'doc-state', 'doc-district', 'doc-village', 'doc-specialty'].forEach(id => {
    const v = val(id); if (v && v !== 'all') params.set(id.replace('doc-', ''), v);
  });
  const mode = val('doc-mode');
  if (mode === 'video') params.set('video', 'true');
  if (mode === 'home') params.set('homeVisit', 'true');
  if (mode === 'inperson') params.set('inperson', 'true');
  const type = val('doc-type');
  if (type === 'ayurvedic') params.set('ayurvedicOnly', 'true');
  if (type === 'panchakarma') params.set('panchakarma', 'true');
  if (val('doc-rating') && val('doc-rating') !== '0') params.set('minRating', val('doc-rating'));
  if (val('doc-fee')) params.set('maxFee', val('doc-fee'));
  if (val('doc-experience')) params.set('minExperience', val('doc-experience'));
  if (val('doc-sort')) {
    const [sb, sd] = val('doc-sort').split('-');
    params.set('sortBy', sb);
    params.set('sortDir', sd);
  }
  params.set('page', page);
  params.set('limit', 24);
  const res = await fetch('/api/doctors?' + params.toString());
  const data = await res.json();
  renderCards('doctors-grid', data.data, renderDoctorCard);
  renderPagination('doctors-pagination', data, loadDoctors);
  document.getElementById('doc-count').textContent = `${data.total.toLocaleString()} doctors found`;
}
function resetDoctorFilters() {
  ['doc-search', 'doc-fee', 'doc-experience'].forEach(id => document.getElementById(id).value = '');
  ['doc-country', 'doc-state', 'doc-district', 'doc-village', 'doc-specialty', 'doc-mode', 'doc-type'].forEach(id => document.getElementById(id).value = 'all');
  document.getElementById('doc-rating').value = '0';
  document.getElementById('doc-sort').value = 'rating-desc';
  loadDoctors(1);
}
function renderDoctorCard(d) {
  let badges = '';
  if (d.isAyurvedic) badges += '<span class="badge badge-ayur">Ayurvedic</span>';
  if (d.panchakarmaCertified) badges += '<span class="badge badge-panchakarma">Panchakarma</span>';
  if (d.onlineBooking) badges += '<span class="badge badge-info">Online Booking</span>';
  if (d.consultationModes.includes('Video Consult')) badges += '<span class="badge badge-success">Video</span>';
  if (d.consultationModes.includes('Home Visit')) badges += '<span class="badge badge-warning">Home Visit</span>';
  const isFav = JSON.parse(localStorage.getItem('favorites') || '[]').some(f => f.type === 'doctor' && f.id === d.id);
  return `
    <div class="card" onclick="addToCompare('doctor', '${d.id}', '${d.name.replace(/'/g, "\\'")}')">
      <div class="card-header">
        <div>
          <div class="card-title">${d.name}</div>
          <div class="card-subtitle">${d.specialty} • ${d.degree}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="card-rating">★ ${d.rating}</div>
          <button class="btn-sm ${isFav ? 'btn-sm-primary' : ''}" onclick="event.stopPropagation(); toggleFavorite('doctor', '${d.id}', '${d.name.replace(/'/g, "\\'")}', '${d.specialty} • ${d.city}, ${d.state}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">⭐</button>
        </div>
      </div>
      ${badges ? '<div class="card-tags">' + badges + '</div>' : ''}
      <div class="card-row"><span class="card-row-label">Experience</span><span class="card-row-value">${d.experience} years</span></div>
      <div class="card-row"><span class="card-row-label">Fee</span><span class="card-row-value">₹${d.consultationFee}</span></div>
      <div class="card-row"><span class="card-row-label">Patients</span><span class="card-row-value">${d.totalPatients.toLocaleString()}+</span></div>
      <div class="card-row"><span class="card-row-label">Hours</span><span class="card-row-value">${d.availableHours}</span></div>
      <div class="card-location">📍 ${d.area}, ${d.city}, ${d.state}</div>
      <div class="card-actions">
        <button class="btn-sm btn-sm-primary" onclick="event.stopPropagation(); showDetail('doctor', '${d.id}')">View Details</button>
        <button class="btn-sm" onclick="event.stopPropagation(); window.open('tel:${d.phone}')">📞 Call</button>
      </div>
    </div>
  `;
}

// ============================================================
// HOSPITALS
// ============================================================
async function loadHospitals(page = 1) {
  currentHospitalPage = page;
  const params = new URLSearchParams();
  const val = id => document.getElementById(id).value;
  if (val('hosp-search')) params.set('q', val('hosp-search'));
  ['hosp-country', 'hosp-state', 'hosp-district', 'hosp-type'].forEach(id => {
    const v = val(id); if (v && v !== 'all') params.set(id.replace('hosp-', ''), v);
  });
  const cat = val('hosp-category');
  if (cat === 'ayurvedic') params.set('ayurvedicOnly', 'true');
  if (cat === 'panchakarma') params.set('panchakarma', 'true');
  if (val('hosp-rating') && val('hosp-rating') !== '0') params.set('minRating', val('hosp-rating'));
  if (val('hosp-beds')) params.set('minBeds', val('hosp-beds'));
  const fac = val('hosp-facility');
  if (fac === 'Emergency 24x7') params.set('hasEmergency', 'true');
  if (fac === 'Ambulance') params.set('hasAmbulance', 'true');
  if (fac === 'Pharmacy') params.set('hasPharmacy', 'true');
  if (val('hosp-sort')) {
    const [sb, sd] = val('hosp-sort').split('-');
    params.set('sortBy', sb);
    params.set('sortDir', sd);
  }
  params.set('page', page);
  params.set('limit', 24);
  const res = await fetch('/api/hospitals?' + params.toString());
  const data = await res.json();
  renderCards('hospitals-grid', data.data, renderHospitalCard);
  renderPagination('hospitals-pagination', data, loadHospitals);
  document.getElementById('hosp-count').textContent = `${data.total.toLocaleString()} hospitals found`;
}
function resetHospitalFilters() {
  ['hosp-search', 'hosp-beds'].forEach(id => document.getElementById(id).value = '');
  ['hosp-country', 'hosp-state', 'hosp-district', 'hosp-type', 'hosp-category', 'hosp-facility'].forEach(id => document.getElementById(id).value = 'all');
  document.getElementById('hosp-rating').value = '0';
  document.getElementById('hosp-sort').value = 'rating-desc';
  loadHospitals(1);
}
function renderHospitalCard(h) {
  let badges = '';
  if (h.isAyurvedic) badges += '<span class="badge badge-ayur">Ayurvedic</span>';
  if (h.panchakarmaAvailable) badges += '<span class="badge badge-panchakarma">Panchakarma</span>';
  if (h.yogaCenter) badges += '<span class="badge badge-info">Yoga Center</span>';
  if (h.accreditations.length > 0) badges += '<span class="badge badge-success">' + h.accreditations[0] + '</span>';
  const isFav = JSON.parse(localStorage.getItem('favorites') || '[]').some(f => f.type === 'hospital' && f.id === h.id);
  return `
    <div class="card" onclick="addToCompare('hospital', '${h.id}', '${h.name.replace(/'/g, "\\'")}')">
      <div class="card-header">
        <div>
          <div class="card-title">${h.name}</div>
          <div class="card-subtitle">${h.type} • Est. ${h.established}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="card-rating">★ ${h.rating} <span style="color:#9ca3af;font-size:11px;">(${h.totalReviews})</span></div>
          <button class="btn-sm ${isFav ? 'btn-sm-primary' : ''}" onclick="event.stopPropagation(); toggleFavorite('hospital', '${h.id}', '${h.name.replace(/'/g, "\\'")}', '${h.type} • ${h.city}, ${h.state}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">⭐</button>
        </div>
      </div>
      ${badges ? '<div class="card-tags">' + badges + '</div>' : ''}
      <div class="card-row"><span class="card-row-label">Total Beds</span><span class="card-row-value">${h.totalBeds}</span></div>
      <div class="card-row"><span class="card-row-label">ICU Beds</span><span class="card-row-value">${h.icuBeds}</span></div>
      <div class="card-row"><span class="card-row-label">Doctors</span><span class="card-row-value">${h.totalDoctors}</span></div>
      <div class="card-row"><span class="card-row-label">Nurses</span><span class="card-row-value">${h.totalNurses}</span></div>
      <div class="card-row"><span class="card-row-label">Tariff (Gen Ward)</span><span class="card-row-value">₹${h.tariff.general}/day</span></div>
      <div class="card-location">📍 ${h.area}, ${h.city}, ${h.state} - ${h.pincode}</div>
      <div class="card-actions">
        <button class="btn-sm btn-sm-primary" onclick="event.stopPropagation(); showDetail('hospital', '${h.id}')">View Details</button>
        <button class="btn-sm" onclick="event.stopPropagation(); window.open('tel:${h.emergency}')">🚨 Emergency</button>
      </div>
    </div>
  `;
}

// ============================================================
// HERBS
// ============================================================
async function loadHerbs(page = 1) {
  currentHerbPage = page;
  const params = new URLSearchParams();
  const val = id => document.getElementById(id).value;
  if (val('herb-search')) params.set('q', val('herb-search'));
  ['herb-category', 'herb-dosha', 'herb-part', 'herb-evidence'].forEach(id => {
    const v = val(id); if (v && v !== 'all') params.set(id.replace('herb-', ''), v);
  });
  if (val('herb-sort')) {
    const [sb, sd] = val('herb-sort').split('-');
    params.set('sortBy', sb);
    params.set('sortDir', sd);
  }
  params.set('page', page);
  params.set('limit', 24);
  const res = await fetch('/api/herbs?' + params.toString());
  const data = await res.json();
  renderCards('herbs-grid', data.data, renderHerbCard);
  renderPagination('herbs-pagination', data, loadHerbs);
  document.getElementById('herb-count').textContent = `${data.total.toLocaleString()} herbs found`;
}
function resetHerbFilters() {
  ['herb-search'].forEach(id => document.getElementById(id).value = '');
  ['herb-category', 'herb-dosha', 'herb-part', 'herb-evidence'].forEach(id => document.getElementById(id).value = 'all');
  document.getElementById('herb-sort').value = 'researchCitations-desc';
  loadHerbs(1);
}
function renderHerbCard(h) {
  const uses = (h.primaryUses || []).slice(0, 4).map(u => '<span class="badge badge-default">' + u + '</span>').join('');
  let doshaClass = 'dosha-Tridosha';
  if (h.doshaEffect && h.doshaEffect.includes('Vata')) doshaClass = 'dosha-Vata';
  else if (h.doshaEffect && h.doshaEffect.includes('Pitta')) doshaClass = 'dosha-Pitta';
  else if (h.doshaEffect && h.doshaEffect.includes('Kapha')) doshaClass = 'dosha-Kapha';
  return `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">🌿 ${h.name}</div>
          <div class="card-subtitle"><em>${h.sanskrit}</em> • ${h.family}</div>
        </div>
        <div class="card-rating">${h.researchCitations} cites</div>
      </div>
      <div class="card-tags">
        <span class="badge badge-info">${h.category}</span>
        <span class="dosha-pill ${doshaClass}">${h.doshaEffect}</span>
        <span class="badge badge-${h.evidenceLevel === 'Very High' ? 'success' : h.evidenceLevel === 'High' ? 'info' : 'default'}">${h.evidenceLevel}</span>
      </div>
      <div class="card-row"><span class="card-row-label">Rasa</span><span class="card-row-value">${(h.rasa || []).join(', ')}</span></div>
      <div class="card-row"><span class="card-row-label">Virya</span><span class="card-row-value">${h.virya}</span></div>
      <div class="card-row"><span class="card-row-label">Part Used</span><span class="card-row-value">${h.partUsed}</span></div>
      <div style="margin-top:8px; font-size:12px; color:var(--text-light);"><strong>Uses:</strong> ${(h.primaryUses || []).slice(0, 3).join(', ')}</div>
      <div class="card-tags">${uses}</div>
      <div class="card-actions">
        <button class="btn-sm btn-sm-primary" onclick="showDetail('herb', '${h.id}')">Full Profile</button>
      </div>
    </div>
  `;
}

// ============================================================
// THERAPIES
// ============================================================
async function loadTherapies(page = 1) {
  currentTherapyPage = page;
  const params = new URLSearchParams();
  const val = id => document.getElementById(id).value;
  if (val('th-search')) params.set('q', val('th-search'));
  ['th-category', 'th-type'].forEach(id => {
    const v = val(id); if (v && v !== 'all') params.set(id.replace('th-', ''), v);
  });
  if (val('th-indication')) params.set('indication', val('th-indication'));
  params.set('page', page);
  params.set('limit', 24);
  const res = await fetch('/api/therapies?' + params.toString());
  const data = await res.json();
  renderCards('therapies-grid', data.data, renderTherapyCard);
  renderPagination('therapies-pagination', data, loadTherapies);
  document.getElementById('th-count').textContent = `${data.total.toLocaleString()} therapies found`;
}
function resetTherapyFilters() {
  ['th-search', 'th-indication'].forEach(id => document.getElementById(id).value = '');
  ['th-category', 'th-type'].forEach(id => document.getElementById(id).value = 'all');
  loadTherapies(1);
}
function renderTherapyCard(t) {
  const indic = (t.indications || []).slice(0, 3).map(i => '<span class="badge badge-default">' + i + '</span>').join('');
  return `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">${t.name}</div>
          <div class="card-subtitle"><em>${t.sanskrit}</em></div>
        </div>
        <div class="card-rating">${t.category}</div>
      </div>
      <div class="card-tags">
        <span class="badge badge-ayur">${t.type}</span>
      </div>
      <p style="font-size:13px; color:var(--text-light); margin:8px 0;">${t.description || ''}</p>
      <div class="card-row"><span class="card-row-label">Duration</span><span class="card-row-value">${t.durationPerSession || t.duration || ''}</span></div>
      <div class="card-row"><span class="card-row-label">Cost</span><span class="card-row-value">${t.cost || '—'}</span></div>
      <div class="card-row"><span class="card-row-label">Best Season</span><span class="card-row-value">${t.bestSeason || '—'}</span></div>
      <div style="margin-top:8px; font-size:12px; color:var(--text-light);"><strong>Indicated for:</strong></div>
      <div class="card-tags">${indic}</div>
      <div class="card-actions">
        <button class="btn-sm btn-sm-primary" onclick="showDetail('therapy', '${t.id}')">Full Procedure</button>
      </div>
    </div>
  `;
}

// ============================================================
// YOGA
// ============================================================
async function loadYoga(page = 1) {
  currentYogaPage = page;
  const params = new URLSearchParams();
  const val = id => document.getElementById(id).value;
  if (val('yoga-search')) params.set('q', val('yoga-search'));
  ['yoga-category', 'yoga-difficulty'].forEach(id => {
    const v = val(id); if (v && v !== 'all') params.set(id.replace('yoga-', ''), v);
  });
  if (val('yoga-indication')) params.set('indication', val('yoga-indication'));
  params.set('page', page);
  params.set('limit', 24);
  const res = await fetch('/api/yoga?' + params.toString());
  const data = await res.json();
  renderCards('yoga-grid', data.data, renderYogaCard);
  renderPagination('yoga-pagination', data, loadYoga);
  document.getElementById('yoga-count').textContent = `${data.total.toLocaleString()} asanas/practices found`;
}
function resetYogaFilters() {
  ['yoga-search', 'yoga-indication'].forEach(id => document.getElementById(id).value = '');
  ['yoga-category', 'yoga-difficulty'].forEach(id => document.getElementById(id).value = 'all');
  loadYoga(1);
}
function renderYogaCard(y) {
  const ben = (y.benefits || []).slice(0, 3).map(b => '<span class="badge badge-success">' + b + '</span>').join('');
  return `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">🧘 ${y.name}</div>
          <div class="card-subtitle">${y.english} • <em>${y.sanskrit}</em></div>
        </div>
        <div class="card-rating">${y.difficulty}</div>
      </div>
      <div class="card-tags">
        <span class="badge badge-info">${y.category}</span>
      </div>
      <div class="card-row"><span class="card-row-label">Duration</span><span class="card-row-value">${y.duration || '—'}</span></div>
      <div class="card-row"><span class="card-row-label">Best Time</span><span class="card-row-value">${y.bestTime || '—'}</span></div>
      ${y.chakra ? '<div class="card-row"><span class="card-row-label">Chakra</span><span class="card-row-value">' + y.chakra + '</span></div>' : ''}
      <div style="margin-top:8px; font-size:12px; color:var(--text-light);"><strong>Benefits:</strong></div>
      <div class="card-tags">${ben}</div>
      <div class="card-actions">
        <button class="btn-sm btn-sm-primary" onclick="showDetail('yoga', '${y.id}')">Full Guide</button>
      </div>
    </div>
  `;
}

// ============================================================
// HEALTH BENEFITS
// ============================================================
async function loadHealth(page = 1) {
  currentHealthPage = page;
  const params = new URLSearchParams();
  const val = id => document.getElementById(id).value;
  if (val('h-search')) params.set('q', val('h-search'));
  ['h-category', 'h-severity', 'h-dosha'].forEach(id => {
    const v = val(id); if (v && v !== 'all') params.set(id.replace('h-', ''), v);
  });
  params.set('page', page);
  params.set('limit', 24);
  const res = await fetch('/api/health-benefits?' + params.toString());
  const data = await res.json();
  renderCards('health-grid', data.data, renderHealthCard);
  renderPagination('health-pagination', data, loadHealth);
  document.getElementById('h-count').textContent = `${data.total.toLocaleString()} conditions found`;
}
function resetHealthFilters() {
  ['h-search'].forEach(id => document.getElementById(id).value = '');
  ['h-category', 'h-severity', 'h-dosha'].forEach(id => document.getElementById(id).value = 'all');
  loadHealth(1);
}
function renderHealthCard(c) {
  const symptoms = (c.symptoms || []).slice(0, 3).map(s => '<span class="badge badge-warning">' + s + '</span>').join('');
  const herbs = (c.herbs || []).slice(0, 3).map(h => '<span class="badge badge-ayur">' + h + '</span>').join('');
  return `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">❤️ ${c.name}</div>
          <div class="card-subtitle">${c.ayurvedicName || ''} • ${c.category}</div>
        </div>
        <div class="card-rating">${c.severity}</div>
      </div>
      <div class="card-tags">
        <span class="badge badge-info">${c.doshaImbalance || '—'}</span>
      </div>
      <div style="margin-top:8px; font-size:12px; color:var(--text-light);"><strong>Common Symptoms:</strong></div>
      <div class="card-tags">${symptoms}</div>
      <div style="margin-top:8px; font-size:12px; color:var(--text-light);"><strong>Key Herbs:</strong></div>
      <div class="card-tags">${herbs}</div>
      <div class="card-row"><span class="card-row-label">Specialist</span><span class="card-row-value">${c.specialist || '—'}</span></div>
      <div class="card-row"><span class="card-row-label">Duration</span><span class="card-row-value">${c.duration || '—'}</span></div>
      <div class="card-actions">
        <button class="btn-sm btn-sm-primary" onclick="showDetail('condition', '${encodeURIComponent((c.ayurvedicName || c.name).split('(')[0].trim().toLowerCase())}')">Complete Treatment Guide</button>
      </div>
    </div>
  `;
}

// ============================================================
// HELPERS
// ============================================================
function renderCards(gridId, items, renderer) {
  const grid = document.getElementById(gridId);
  if (!items || items.length === 0) {
    grid.innerHTML = '<div class="empty"><div class="empty-icon">🔍</div><div>No results found. Try adjusting filters.</div></div>';
    return;
  }
  grid.innerHTML = items.map(renderer).join('');
}
function renderPagination(pagId, data, loader) {
  const pag = document.getElementById(pagId);
  if (data.pages <= 1) { pag.innerHTML = ''; return; }
  let html = '';
  html += `<button ${data.page === 1 ? 'disabled' : ''} onclick="${loader.name}(${data.page - 1})">← Prev</button>`;
  const maxButtons = 7;
  let start = Math.max(1, data.page - 3);
  let end = Math.min(data.pages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  if (start > 1) {
    html += `<button onclick="${loader.name}(1)">1</button>`;
    if (start > 2) html += '<button disabled>…</button>';
  }
  for (let i = start; i <= end; i++) {
    html += `<button class="${i === data.page ? 'active' : ''}" onclick="${loader.name}(${i})">${i}</button>`;
  }
  if (end < data.pages) {
    if (end < data.pages - 1) html += '<button disabled>…</button>';
    html += `<button onclick="${loader.name}(${data.pages})">${data.pages}</button>`;
  }
  html += `<button ${data.page === data.pages ? 'disabled' : ''} onclick="${loader.name}(${data.page + 1})">Next →</button>`;
  pag.innerHTML = html;
}

// ============================================================
// DETAIL MODAL
// ============================================================
async function showDetail(type, id) {
  document.getElementById('suggestBox').classList.remove('active');
  const res = await fetch('/api/' + (type === 'condition' ? 'health-benefits' : (type + 's')) + '/' + (type === 'condition' ? id : id));
  if (!res.ok) return;
  const data = await res.json();
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  title.textContent = data.name || data.english || '';
  body.innerHTML = renderDetail(type, data);
  modal.classList.add('active');
}
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

function renderDetail(type, d) {
  if (type === 'doctor') {
    return `
      <div class="info-grid">
        <div class="info-cell"><div class="info-label">Name</div><div class="info-value">${d.name}</div></div>
        <div class="info-cell"><div class="info-label">Specialty</div><div class="info-value">${d.specialty}</div></div>
        <div class="info-cell"><div class="info-label">Degree</div><div class="info-value">${d.degree}</div></div>
        <div class="info-cell"><div class="info-label">Experience</div><div class="info-value">${d.experience} years</div></div>
        <div class="info-cell"><div class="info-label">Rating</div><div class="info-value">★ ${d.rating}</div></div>
        <div class="info-cell"><div class="info-label">Fee</div><div class="info-value">₹${d.consultationFee}</div></div>
        <div class="info-cell"><div class="info-label">Total Patients</div><div class="info-value">${d.totalPatients.toLocaleString()}+</div></div>
        <div class="info-cell"><div class="info-label">Languages</div><div class="info-value">${(d.languages || []).join(', ')}</div></div>
      </div>
      <div class="modal-section">
        <h3>📍 Location</h3>
        <p>${d.address}</p>
        <p><strong>${d.clinic}</strong></p>
      </div>
      <div class="modal-section">
        <h3>🕐 Availability</h3>
        <p><strong>Days:</strong> ${(d.availableDays || []).join(', ')}</p>
        <p><strong>Hours:</strong> ${d.availableHours}</p>
        <p><strong>Modes:</strong> ${(d.consultationModes || []).join(', ')}</p>
        <p><strong>Online Booking:</strong> ${d.onlineBooking ? '✅ Available' : '❌ Not Available'}</p>
      </div>
      <div class="modal-section">
        <h3>📞 Contact</h3>
        <p><strong>Phone:</strong> <a href="tel:${d.phone}">${d.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${d.email}">${d.email}</a></p>
      </div>
      ${d.awards ? '<div class="modal-section"><h3>🏆 Awards</h3><p>' + d.awards + '</p></div>' : ''}
      ${d.panchakarmaCertified ? '<div class="modal-section"><h3>✨ Certification</h3><p>Panchakarma Certified</p></div>' : ''}
    `;
  }
  if (type === 'hospital') {
    return `
      <div class="info-grid">
        <div class="info-cell"><div class="info-label">Type</div><div class="info-value">${d.type}</div></div>
        <div class="info-cell"><div class="info-label">Established</div><div class="info-value">${d.established}</div></div>
        <div class="info-cell"><div class="info-label">Total Beds</div><div class="info-value">${d.totalBeds}</div></div>
        <div class="info-cell"><div class="info-label">ICU Beds</div><div class="info-value">${d.icuBeds}</div></div>
        <div class="info-cell"><div class="info-label">Doctors</div><div class="info-value">${d.totalDoctors}</div></div>
        <div class="info-cell"><div class="info-label">Nurses</div><div class="info-value">${d.totalNurses}</div></div>
        <div class="info-cell"><div class="info-label">Rating</div><div class="info-value">★ ${d.rating} (${d.totalReviews})</div></div>
        <div class="info-cell"><div class="info-label">Visiting Hours</div><div class="info-value">${d.visitingHours}</div></div>
      </div>
      <div class="modal-section">
        <h3>📍 Location</h3>
        <p>${d.address}</p>
        <p>Pincode: ${d.pincode}</p>
      </div>
      <div class="modal-section">
        <h3>💰 Room Tariff (per day)</h3>
        <p><strong>General Ward:</strong> ₹${d.tariff.general}</p>
        <p><strong>Semi-Private:</strong> ₹${d.tariff.semiPrivate}</p>
        <p><strong>Private Room:</strong> ₹${d.tariff.private}</p>
        <p><strong>Suite:</strong> ₹${d.tariff.suite}</p>
        <p><strong>ICU:</strong> ₹${d.tariff.icu}</p>
      </div>
      <div class="modal-section">
        <h3>🏥 Specialties Offered</h3>
        <p>${(d.specialties || []).map(s => '<span class="badge badge-info">' + s + '</span>').join(' ')}</p>
      </div>
      ${d.ayurvedicTherapies && d.ayurvedicTherapies.length > 0 ? '<div class="modal-section"><h3>🌿 Ayurvedic Therapies</h3><p>' + d.ayurvedicTherapies.map(t => '<span class="badge badge-ayur">' + t + '</span>').join(' ') + '</p></div>' : ''}
      <div class="modal-section">
        <h3>✓ Facilities</h3>
        <p>${(d.facilities || []).map(f => '<span class="badge badge-default">' + f + '</span>').join(' ')}</p>
      </div>
      ${d.accreditations && d.accreditations.length > 0 ? '<div class="modal-section"><h3>🏅 Accreditations</h3><p>' + d.accreditations.map(a => '<span class="badge badge-success">' + a + '</span>').join(' ') + '</p></div>' : ''}
      ${d.governmentSchemes && d.governmentSchemes.length > 0 ? '<div class="modal-section"><h3>🏛️ Government Schemes Accepted</h3><p>' + d.governmentSchemes.map(s => '<span class="badge badge-info">' + s + '</span>').join(' ') + '</p></div>' : ''}
      <div class="modal-section">
        <h3>📞 Contact</h3>
        <p><strong>Phone:</strong> <a href="tel:${d.phone}">${d.phone}</a></p>
        <p><strong>Emergency:</strong> <a href="tel:${d.emergency}">${d.emergency}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${d.email}">${d.email}</a></p>
        <p><strong>Website:</strong> <a href="${d.website}" target="_blank">${d.website}</a></p>
      </div>
    `;
  }
  if (type === 'herb') {
    return `
      <div class="info-grid">
        <div class="info-cell"><div class="info-label">Sanskrit Name</div><div class="info-value">${d.sanskrit}</div></div>
        <div class="info-cell"><div class="info-label">Family</div><div class="info-value">${d.family}</div></div>
        <div class="info-cell"><div class="info-label">Category</div><div class="info-value">${d.category}</div></div>
        <div class="info-cell"><div class="info-label">Part Used</div><div class="info-value">${d.partUsed}</div></div>
        <div class="info-cell"><div class="info-label">Dosha Effect</div><div class="info-value">${d.doshaEffect}</div></div>
        <div class="info-cell"><div class="info-label">Research Citations</div><div class="info-value">${d.researchCitations}</div></div>
      </div>
      <div class="modal-section">
        <h3>🌿 Ayurvedic Properties</h3>
        <p><strong>Rasa (Taste):</strong> ${(d.rasa || []).join(', ')}</p>
        <p><strong>Guna (Property):</strong> ${(d.guna || []).join(', ')}</p>
        <p><strong>Virya (Potency):</strong> ${d.virya}</p>
        <p><strong>Vipaka (Post-digestive effect):</strong> ${d.vipaka}</p>
      </div>
      <div class="modal-section">
        <h3>✨ Common Names</h3>
        <p>${(d.commonNames || []).join(', ')}</p>
      </div>
      <div class="modal-section">
        <h3>💊 Primary Uses</h3>
        <p>${(d.primaryUses || []).map(u => '<span class="badge badge-success">' + u + '</span>').join(' ')}</p>
      </div>
      <div class="modal-section">
        <h3>🏥 Health Conditions Treated</h3>
        <p>${(d.healthConditions || []).map(c => '<span class="badge badge-info">' + c + '</span>').join(' ')}</p>
      </div>
      <div class="modal-section">
        <h3>📜 Classical Formulations</h3>
        <ul>${(d.formulations || []).map(f => '<li>' + f + '</li>').join('')}</ul>
      </div>
      <div class="modal-section">
        <h3>💉 Dosage & Administration</h3>
        <p><strong>Dosage:</strong> ${d.dosage}</p>
        <p><strong>Best Time:</strong> ${d.bestTime}</p>
      </div>
      ${d.precautions ? '<div class="modal-section"><h3>⚠️ Precautions</h3><p>' + d.precautions + '</p></div>' : ''}
      ${d.cultivationRegion ? '<div class="modal-section"><h3>🌱 Cultivation</h3><p><strong>Regions:</strong> ' + d.cultivationRegion.join(', ') + '</p><p><strong>Season:</strong> ' + d.growingSeason + '</p><p><strong>Harvest:</strong> ' + d.harvestTime + '</p></div>' : ''}
    `;
  }
  if (type === 'therapy') {
    return `
      <div class="info-grid">
        <div class="info-cell"><div class="info-label">Category</div><div class="info-value">${d.category}</div></div>
        <div class="info-cell"><div class="info-label">Type</div><div class="info-value">${d.type}</div></div>
        <div class="info-cell"><div class="info-label">Duration</div><div class="info-value">${d.duration || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Per Session</div><div class="info-value">${d.durationPerSession || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Cost</div><div class="info-value">${d.cost || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Best Season</div><div class="info-value">${d.bestSeason || '—'}</div></div>
      </div>
      <div class="modal-section">
        <h3>📖 Description</h3>
        <p>${d.description || ''}</p>
      </div>
      <div class="modal-section">
        <h3>✅ Indications (Used For)</h3>
        <p>${(d.indications || []).map(i => '<span class="badge badge-success">' + i + '</span>').join(' ')}</p>
      </div>
      ${d.contraindications ? '<div class="modal-section"><h3>⛔ Contraindications</h3><p>' + d.contraindications.map(c => '<span class="badge badge-warning">' + c + '</span>').join(' ') + '</p></div>' : ''}
      ${d.procedure ? '<div class="modal-section"><h3>📋 Procedure</h3><ol>' + d.procedure.map(p => '<li>' + p + '</li>').join('') + '</ol></div>' : ''}
      ${d.benefits ? '<div class="modal-section"><h3>🌟 Benefits</h3><ul>' + d.benefits.map(b => '<li>' + b + '</li>').join('') + '</ul></div>' : ''}
      ${d.herbsUsed ? '<div class="modal-section"><h3>🌿 Herbs Used</h3><p>' + d.herbsUsed.map(h => '<span class="badge badge-ayur">' + h + '</span>').join(' ') + '</p></div>' : ''}
      ${d.preProcedure ? '<div class="modal-section"><h3>⏮️ Pre-Procedure</h3><p>' + d.preProcedure.map(p => '<span class="badge badge-info">' + p + '</span>').join(' ') + '</p></div>' : ''}
      ${d.postProcedure ? '<div class="modal-section"><h3>⏭️ Post-Procedure</h3><p>' + d.postProcedure.map(p => '<span class="badge badge-info">' + p + '</span>').join(' ') + '</p></div>' : ''}
      ${d.subTypes ? '<div class="modal-section"><h3>🔀 Sub-Types</h3><p>' + d.subTypes.map(s => '<span class="badge badge-default">' + s + '</span>').join(' ') + '</p></div>' : ''}
    `;
  }
  if (type === 'yoga') {
    return `
      <div class="info-grid">
        <div class="info-cell"><div class="info-label">English Name</div><div class="info-value">${d.english}</div></div>
        <div class="info-cell"><div class="info-label">Category</div><div class="info-value">${d.category}</div></div>
        <div class="info-cell"><div class="info-label">Difficulty</div><div class="info-value">${d.difficulty}</div></div>
        <div class="info-cell"><div class="info-label">Duration</div><div class="info-value">${d.duration || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Best Time</div><div class="info-value">${d.bestTime || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Repetitions</div><div class="info-value">${d.repetitions || '—'}</div></div>
        ${d.chakra ? '<div class="info-cell"><div class="info-label">Chakra</div><div class="info-value">' + d.chakra + '</div></div>' : ''}
        ${d.drishti ? '<div class="info-cell"><div class="info-label">Drishti</div><div class="info-value">' + d.drishti + '</div></div>' : ''}
        ${d.breathing ? '<div class="info-cell"><div class="info-label">Breathing</div><div class="info-value">' + d.breathing + '</div></div>' : ''}
      </div>
      ${d.benefits && d.benefits.length > 0 ? '<div class="modal-section"><h3>🌟 Benefits</h3><p>' + d.benefits.map(b => '<span class="badge badge-success">' + b + '</span>').join(' ') + '</p></div>' : ''}
      ${d.indications && d.indications.length > 0 ? '<div class="modal-section"><h3>🏥 Indicated For</h3><p>' + d.indications.map(i => '<span class="badge badge-info">' + i + '</span>').join(' ') + '</p></div>' : ''}
      ${d.contraindications && d.contraindications.length > 0 ? '<div class="modal-section"><h3>⛔ Contraindications (Avoid If)</h3><p>' + d.contraindications.map(c => '<span class="badge badge-warning">' + c + '</span>').join(' ') + '</p></div>' : ''}
      ${d.technique ? '<div class="modal-section"><h3>🧘 Technique</h3><p>' + d.technique + '</p></div>' : ''}
    `;
  }
  if (type === 'condition') {
    return `
      <div class="info-grid">
        <div class="info-cell"><div class="info-label">Ayurvedic Name</div><div class="info-value">${d.ayurvedicName || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Category</div><div class="info-value">${d.category}</div></div>
        <div class="info-cell"><div class="info-label">Severity</div><div class="info-value">${d.severity || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Dosha Imbalance</div><div class="info-value">${d.doshaImbalance || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Specialist</div><div class="info-value">${d.specialist || '—'}</div></div>
        <div class="info-cell"><div class="info-label">Duration</div><div class="info-value">${d.duration || '—'}</div></div>
      </div>
      ${d.symptoms && d.symptoms.length > 0 ? '<div class="modal-section"><h3>🔍 Symptoms</h3><p>' + d.symptoms.map(s => '<span class="badge badge-warning">' + s + '</span>').join(' ') + '</p></div>' : ''}
      ${d.causes && d.causes.length > 0 ? '<div class="modal-section"><h3>⚠️ Causes</h3><ul>' + d.causes.map(c => '<li>' + c + '</li>').join('') + '</ul></div>' : ''}
      ${d.herbs && d.herbs.length > 0 ? '<div class="modal-section"><h3>🌿 Recommended Herbs</h3><p>' + d.herbs.map(h => '<span class="badge badge-ayur">' + h + '</span>').join(' ') + '</p></div>' : ''}
      ${d.formulations && d.formulations.length > 0 ? '<div class="modal-section"><h3>📜 Classical Formulations</h3><ul>' + d.formulations.map(f => '<li>' + f + '</li>').join('') + '</ul></div>' : ''}
      ${d.diet && d.diet.length > 0 ? '<div class="modal-section"><h3>🍽️ Diet Recommendations</h3><ul>' + d.diet.map(f => '<li>' + f + '</li>').join('') + '</ul></div>' : ''}
      ${d.lifestyle && d.lifestyle.length > 0 ? '<div class="modal-section"><h3>🏃 Lifestyle</h3><ul>' + d.lifestyle.map(f => '<li>' + f + '</li>').join('') + '</ul></div>' : ''}
      ${d.yoga && d.yoga.length > 0 ? '<div class="modal-section"><h3>🧘 Yoga Asanas</h3><p>' + d.yoga.map(y => '<span class="badge badge-info">' + y + '</span>').join(' ') + '</p></div>' : ''}
      ${d.pranayama && d.pranayama.length > 0 ? '<div class="modal-section"><h3>💨 Pranayama</h3><p>' + d.pranayama.map(p => '<span class="badge badge-info">' + p + '</span>').join(' ') + '</p></div>' : ''}
      ${d.homeRemedies && d.homeRemedies.length > 0 ? '<div class="modal-section"><h3>🏠 Home Remedies</h3><ul>' + d.homeRemedies.map(r => '<li>' + r + '</li>').join('') + '</ul></div>' : ''}
      ${d.prevention ? '<div class="modal-section"><h3>🛡️ Prevention</h3><p>' + d.prevention + '</p></div>' : ''}
      ${d.warningSign ? '<div class="modal-section"><h3>🚨 Warning</h3><p style="color:var(--danger); font-weight:600;">' + d.warningSign + '</p></div>' : ''}
      ${d.panchakarma ? '<div class="modal-section"><h3>🧪 Panchakarma</h3><p>' + d.panchakarma.map(p => '<span class="badge badge-panchakarma">' + p + '</span>').join(' ') + '</p></div>' : ''}
    `;
  }
}


// ============================================================
// SVG CHART ENGINE (no external dependencies)
// ============================================================
function svgBarChart(data, opts = {}) {
  const w = 440, h = 280, pad = 40;
  const max = Math.max(...data.map(d => d.value), 1);
  const n = data.length;
  const bw = (w - pad * 2) / Math.max(n, 1);
  let bars = '';
  data.forEach((d, i) => {
    const bh = (d.value / max) * (h - pad * 2);
    const x = pad + i * bw;
    const y = h - pad - bh;
    const col = opts.color || '#2f9e8f';
    bars += `<rect x="${x + 4}" y="${y}" width="${Math.max(bw - 8, 2)}" height="${bh}" rx="4" fill="${col}"><title>${d.label}: ${d.value}</title></rect>`;
    if (n <= 12) bars += `<text x="${x + bw / 2}" y="${y - 6}" font-size="10" text-anchor="middle" fill="#374151">${d.value}</text>`;
    if (n <= 8) {
      let lbl = d.label.length > 10 ? d.label.substring(0, 9) + '…' : d.label;
      bars += `<text x="${x + bw / 2}" y="${h - pad + 14}" font-size="9" text-anchor="middle" fill="#6b7280">${lbl}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-height:280px;">${bars}
    <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#e5e7eb"/>
  </svg>`;
}
function svgLineChart(data, opts = {}) {
  const w = 440, h = 280, pad = 40;
  if (!data.length) return '<div style="padding:30px;text-align:center;color:#6b7280;">No time-series data</div>';
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const n = data.length;
  const stepX = (w - pad * 2) / Math.max(n - 1, 1);
  const pts = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((d.value - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${pts[n - 1][0].toFixed(1)},${h - pad} L${pts[0][0].toFixed(1)},${h - pad} Z`;
  const col = opts.color || '#2563eb';
  let dots = '', labels = '';
  pts.forEach((p, i) => {
    dots += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${col}"/>`;
    if (n <= 14) {
      let lbl = data[i].label.length > 6 ? data[i].label.substring(0, 6) : data[i].label;
      labels += `<text x="${p[0]}" y="${h - pad + 14}" font-size="8" text-anchor="middle" fill="#6b7280">${lbl}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-height:280px;">
    <path d="${area}" fill="${col}" opacity="0.12"/>
    <path d="${path}" fill="none" stroke="${col}" stroke-width="2"/>
    ${dots}${labels}
    <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#e5e7eb"/>
  </svg>`;
}
function svgDonutChart(data) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const w = 440, h = 280, cx = 130, cy = 140, r = 90, ir = 55;
  const palette = ['#2f9e8f', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#16a34a', '#db2777'];
  let angle = -Math.PI / 2;
  let arcs = '';
  data.forEach((d, i) => {
    const frac = d.value / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const xi1 = cx + ir * Math.cos(a2), yi1 = cy + ir * Math.sin(a2);
    const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);
    arcs += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${ir},${ir} 0 ${large} 0 ${xi2.toFixed(1)},${yi2.toFixed(1)} Z" fill="${palette[i % palette.length]}"><title>${d.label}: ${d.value}</title></path>`;
    angle = a2;
  });
  let legend = '<div style="display:flex;flex-direction:column;justify-content:center;gap:4px;font-size:12px;">';
  data.forEach((d, i) => {
    const pct = (d.value / total * 100).toFixed(1);
    legend += `<div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${palette[i % palette.length]};display:inline-block;"></span>${d.label} <strong>(${pct}%)</strong></div>`;
  });
  legend += '</div>';
  return `<div style="display:flex;align-items:center;gap:8px;"><svg viewBox="0 0 ${w} ${h}" width="200" style="flex:0 0 auto;">${arcs}
    <text x="${cx}" y="${cy - 4}" font-size="18" text-anchor="middle" fill="#111827" font-weight="bold">${total.toLocaleString()}</text>
    <text x="${cx}" y="${cy + 14}" font-size="10" text-anchor="middle" fill="#6b7280">total</text>
  </svg>${legend}</div>`;
}
function renderChartCard(title, chartHtml) {
  return `<div class="card" style="padding:16px;"><h3 style="margin:0 0 12px;font-size:15px;color:var(--primary);">${title}</h3>${chartHtml}</div>`;
}
function renderKpiCard(k) {
  return `<div class="card" style="padding:16px;text-align:center;">
    <div style="font-size:26px;font-weight:700;color:var(--primary);">${k.value}</div>
    <div style="font-size:13px;color:var(--text-light);margin-top:4px;">${k.label}</div>
    <div style="font-size:11px;color:var(--text-light);margin-top:2px;opacity:.8;">${k.sub || ''}</div>
  </div>`;
}

// ============================================================
// ANALYTICS
// ============================================================
async function loadAnalyticsMeta() {
  const res = await fetch('/api/filter-options');
  const o = await res.json();
  populateSelect('anl-state', o.states, 'All States');
}
async function loadAnalytics() {
  const cat = document.getElementById('anl-category').value;
  const period = document.getElementById('anl-period').value;
  const state = document.getElementById('anl-state').value;
  const res = await fetch('/api/analytics?category=' + encodeURIComponent(cat) + '&period=' + period + '&state=' + encodeURIComponent(state));
  const d = await res.json();
  let html = '';
  if (d.kpis && d.kpis.length) {
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px;">';
    d.kpis.forEach(k => html += renderKpiCard(k));
    html += '</div>';
  }
  if (d.charts && d.charts.length) {
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:16px;">';
    d.charts.forEach(c => {
      let ch = '';
      if (c.type === 'bar') ch = svgBarChart(c.data, {});
      else if (c.type === 'line') ch = svgLineChart(c.data, {});
      else if (c.type === 'donut') ch = svgDonutChart(c.data);
      html += renderChartCard(c.title, ch);
    });
    html += '</div>';
  }
  document.getElementById('analytics-grid').innerHTML = html || '<div class="empty"><div class="empty-icon">📊</div><div>No analytics available.</div></div>';
}
function resetAnalyticsFilters() {
  document.getElementById('anl-category').value = 'overview';
  document.getElementById('anl-period').value = 'monthly';
  document.getElementById('anl-state').value = 'all';
  loadAnalytics();
}
function exportAnalytics() {
  const cat = document.getElementById('anl-category').value;
  const period = document.getElementById('anl-period').value;
  const state = document.getElementById('anl-state').value;
  showToast('Generating analytics report CSV…', 'info');
  fetch('/api/analytics?category=' + encodeURIComponent(cat) + '&period=' + period + '&state=' + encodeURIComponent(state))
    .then(r => r.json()).then(d => {
      let rows = [['Category', cat], ['Period', period], ['State', state]];
      d.kpis.forEach(k => rows.push([k.label, k.value, k.sub || '']));
      rows.push([]);
      d.charts.forEach(c => {
        rows.push([c.title]);
        rows.push(['Label', 'Value']);
        c.data.forEach(s => rows.push([s.label, s.value]));
        rows.push([]);
      });
      exportToCsv('analytics-' + cat + '.csv', rows);
    });
}
function exportToCsv(filename, rows) {
  const csv = rows.map(r => r.map(c => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast('Exported ' + filename, 'success');
}

// ============================================================
// APPOINTMENTS
// ============================================================
async function loadAppointmentMeta() {
  const res = await fetch('/api/appointments/meta');
  const m = await res.json();
  const docSel = document.getElementById('apt-doctor');
  const hospSel = document.getElementById('apt-hospital');
  populateSelect('apt-doctor', m.doctors.map(d => d.name + ' — ' + d.specialty), 'All Doctors');
  // map display name back to id via dataset
  Array.from(docSel.options).forEach((opt, i) => {
    if (i === 0) return;
    const rec = m.doctors[i - 1];
    opt.value = rec.id;
    opt.dataset.name = rec.name;
  });
  populateSelect('apt-hospital', m.hospitals.map(h => h.name + ' — ' + h.city), 'All Hospitals');
  Array.from(hospSel.options).forEach((opt, i) => {
    if (i === 0) return;
    const rec = m.hospitals[i - 1];
    opt.value = rec.id;
    opt.dataset.name = rec.name;
  });
}
let currentAptPage = 1;
async function loadAppointments(page = 1) {
  currentAptPage = page;
  const params = new URLSearchParams();
  if (document.getElementById('apt-search').value) params.set('q', document.getElementById('apt-search').value);
  if (document.getElementById('apt-status').value !== 'all') params.set('status', document.getElementById('apt-status').value);
  if (document.getElementById('apt-type').value !== 'all') params.set('type', document.getElementById('apt-type').value);
  if (document.getElementById('apt-date').value !== 'all') params.set('date', document.getElementById('apt-date').value);
  const docVal = document.getElementById('apt-doctor').value;
  const hospVal = document.getElementById('apt-hospital').value;
  if (docVal && docVal !== 'all') params.set('doctorId', docVal);
  if (hospVal && hospVal !== 'all') params.set('hospitalId', hospVal);
  params.set('page', page);
  params.set('limit', 30);
  const res = await fetch('/api/appointments?' + params.toString());
  const data = await res.json();
  const grid = document.getElementById('appointments-grid');
  if (!data.data.length) { grid.innerHTML = '<div class="empty"><div class="empty-icon">📅</div><div>No appointments found.</div></div>'; document.getElementById('appointments-pagination').innerHTML = ''; return; }
  grid.innerHTML = data.data.map(a => renderAppointmentCard(a)).join('');
  renderPagination('appointments-pagination', data, loadAppointments);
}
function renderAppointmentCard(a) {
  const statusColors = { Scheduled: 'badge-default', Confirmed: 'badge-info', Completed: 'badge-success', Cancelled: 'badge-warning', 'No-Show': 'badge-danger', Rescheduled: 'badge-default' };
  const payColors = { Paid: 'badge-success', Partial: 'badge-warning', Pending: 'badge-default', Refunded: 'badge-info', Failed: 'badge-danger' };
  return `<div class="card">
    <div class="card-header">
      <div>
        <div class="card-title">${a.patientName}</div>
        <div class="card-subtitle">${a.patientId} • ${a.appointmentType}</div>
      </div>
      <div class="card-rating">${a.status}</div>
    </div>
    <div class="card-tags">
      <span class="badge ${statusColors[a.status] || 'badge-default'}">${a.status}</span>
      <span class="badge ${payColors[a.paymentStatus] || 'badge-default'}">${a.paymentStatus}</span>
    </div>
    <div class="card-row"><span class="card-row-label">Doctor</span><span class="card-row-value">${a.doctorName}</span></div>
    <div class="card-row"><span class="card-row-label">Hospital</span><span class="card-row-value">${a.hospitalName}</span></div>
    <div class="card-row"><span class="card-row-label">Date</span><span class="card-row-value">${a.appointmentDate} ${a.appointmentTime}</span></div>
    <div class="card-row"><span class="card-row-label">Fee</span><span class="card-row-value">₹${a.consultationFee} (Paid ₹${a.paidAmount})</span></div>
    ${a.diagnosis ? `<div class="card-row"><span class="card-row-label">Diagnosis</span><span class="card-row-value">${a.diagnosis}</span></div>` : ''}
    <div class="card-actions">
      <button class="btn-sm btn-sm-primary" onclick="showAppointmentDetail('${a.id}')">View</button>
      <button class="btn-sm" onclick="window.open('tel:${a.patientPhone}')">📞 Call</button>
    </div>
  </div>`;
}
function showAppointmentDetail(id) {
  fetch('/api/appointments?q=' + encodeURIComponent(id)).then(r => r.json()).then(d => {
    const a = (d.data || []).find(x => x.id === id) || (d.data || [])[0];
    if (!a) return;
    const modal = document.getElementById('modal');
    modal.querySelector('#modal-title').textContent = '📅 ' + a.patientName + ' — ' + a.id;
    document.getElementById('modal-body').innerHTML = `<div class="info-grid">
      <div class="info-cell"><div class="info-label">Patient</div><div class="info-value">${a.patientName}</div></div>
      <div class="info-cell"><div class="info-label">Patient ID</div><div class="info-value">${a.patientId}</div></div>
      <div class="info-cell"><div class="info-label">Status</div><div class="info-value">${a.status}</div></div>
      <div class="info-cell"><div class="info-label">Type</div><div class="info-value">${a.appointmentType}</div></div>
      <div class="info-cell"><div class="info-label">Date/Time</div><div class="info-value">${a.appointmentDate} ${a.appointmentTime}</div></div>
      <div class="info-cell"><div class="info-label">Doctor</div><div class="info-value">${a.doctorName}</div></div>
      <div class="info-cell"><div class="info-label">Hospital</div><div class="info-value">${a.hospitalName}</div></div>
      <div class="info-cell"><div class="info-label">Fee</div><div class="info-value">₹${a.consultationFee}</div></div>
      <div class="info-cell"><div class="info-label">Paid</div><div class="info-value">₹${a.paidAmount}</div></div>
      <div class="info-cell"><div class="info-label">Payment</div><div class="info-value">${a.paymentStatus} (${a.paymentMethod})</div></div>
    </div>
    <div class="modal-section"><h3>📞 Contact</h3><p>${a.patientPhone}</p><p>${a.patientEmail}</p></div>
    ${a.symptoms ? `<div class="modal-section"><h3>Symptoms</h3><p>${a.symptoms}</p></div>` : ''}
    ${a.diagnosis ? `<div class="modal-section"><h3>Diagnosis</h3><p>${a.diagnosis}</p></div>` : ''}
    ${a.prescription ? `<div class="modal-section"><h3>Prescription</h3><p>${a.prescription}</p></div>` : ''}
    ${a.notes ? `<div class="modal-section"><h3>Notes</h3><p>${a.notes}</p></div>` : ''}
    ${a.followUpRequired ? `<div class="modal-section"><h3>Follow-up</h3><p>${a.followUpDate}</p></div>` : ''}
    ${a.feedbackRating ? `<div class="modal-section"><h3>Feedback</h3><p>★ ${a.feedbackRating} — ${a.feedbackComment || ''}</p></div>` : ''}`;
    modal.classList.add('active');
  });
}
function resetAppointmentFilters() {
  ['apt-search'].forEach(id => document.getElementById(id).value = '');
  ['apt-status', 'apt-type', 'apt-date', 'apt-doctor', 'apt-hospital'].forEach(id => document.getElementById(id).value = 'all');
  loadAppointments(1);
}
function exportAppointments() {
  const params = new URLSearchParams();
  if (document.getElementById('apt-search').value) params.set('q', document.getElementById('apt-search').value);
  if (document.getElementById('apt-status').value !== 'all') params.set('status', document.getElementById('apt-status').value);
  if (document.getElementById('apt-type').value !== 'all') params.set('type', document.getElementById('apt-type').value);
  if (document.getElementById('apt-date').value !== 'all') params.set('date', document.getElementById('apt-date').value);
  const docVal = document.getElementById('apt-doctor').value;
  const hospVal = document.getElementById('apt-hospital').value;
  if (docVal && docVal !== 'all') params.set('doctorId', docVal);
  if (hospVal && hospVal !== 'all') params.set('hospitalId', hospVal);
  params.set('limit', 5000);
  fetch('/api/appointments?' + params.toString()).then(r => r.json()).then(d => {
    const rows = [['ID', 'Patient', 'PatientID', 'Phone', 'Doctor', 'Hospital', 'Date', 'Time', 'Type', 'Status', 'Fee', 'Paid', 'Payment', 'Diagnosis']];
    d.data.forEach(a => rows.push([a.id, a.patientName, a.patientId, a.patientPhone, a.doctorName, a.hospitalName, a.appointmentDate, a.appointmentTime, a.appointmentType, a.status, a.consultationFee, a.paidAmount, a.paymentStatus, a.diagnosis]));
    exportToCsv('appointments.csv', rows);
  });
}
function showBookAppointmentModal() {
  const modal = document.getElementById('modal');
  modal.querySelector('#modal-title').textContent = '➕ Book New Appointment';
  document.getElementById('modal-body').innerHTML = `
    <div class="filter-grid">
      <div class="filter-item"><label>Patient Name</label><input type="text" id="bk-patient" placeholder="e.g. Rajesh Kumar"></div>
      <div class="filter-item"><label>Patient Phone</label><input type="text" id="bk-phone" placeholder="+91 98xxx"></div>
      <div class="filter-item"><label>Doctor</label><select id="bk-doctor"></select></div>
      <div class="filter-item"><label>Hospital</label><select id="bk-hospital"></select></div>
      <div class="filter-item"><label>Date</label><input type="date" id="bk-date"></div>
      <div class="filter-item"><label>Time</label><input type="time" id="bk-time" value="10:00"></div>
      <div class="filter-item"><label>Type</label><select id="bk-type"><option>In-person</option><option>Video Consult</option><option>Home Visit</option><option>Follow-up</option></select></div>
      <div class="filter-item"><label>Status</label><select id="bk-status"><option>Scheduled</option><option>Confirmed</option></select></div>
      <div class="filter-item" style="grid-column:1/-1;"><label>Symptoms / Notes</label><input type="text" id="bk-symptoms" placeholder="optional"></div>
    </div>
    <div class="filter-actions" style="margin-top:12px;">
      <button class="btn btn-accent" onclick="submitAppointment()">✅ Confirm Booking</button>
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    </div>`;
  // populate doctor/hospital selects
  const docSel = document.getElementById('bk-doctor');
  const hospSel = document.getElementById('apt-doctor');
  Array.from(hospSel.options).forEach(o => { if (o.value) { const op = document.createElement('option'); op.value = o.value; op.textContent = o.textContent; docSel.appendChild(op); } });
  const hSel = document.getElementById('bk-hospital');
  const aptHosp = document.getElementById('apt-hospital');
  Array.from(aptHosp.options).forEach(o => { if (o.value) { const op = document.createElement('option'); op.value = o.value; op.textContent = o.textContent; hSel.appendChild(op); } });
  document.getElementById('bk-date').value = new Date().toISOString().split('T')[0];
  modal.classList.add('active');
}
async function submitAppointment() {
  const doctorId = document.getElementById('bk-doctor').value;
  const hospitalId = document.getElementById('bk-hospital').value;
  if (!doctorId || !hospitalId) { showToast('Select a doctor and hospital', 'error'); return; }
  const body = {
    patientName: document.getElementById('bk-patient').value,
    patientPhone: document.getElementById('bk-phone').value,
    doctorId, hospitalId,
    appointmentDate: document.getElementById('bk-date').value,
    appointmentTime: document.getElementById('bk-time').value,
    appointmentType: document.getElementById('bk-type').value,
    status: document.getElementById('bk-status').value,
    symptoms: document.getElementById('bk-symptoms').value
  };
  const res = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) { showToast('Booking failed', 'error'); return; }
  closeModal();
  showToast('Appointment booked ✅', 'success');
  loadAppointments(currentAptPage);
}

// ============================================================
// HEALTH TRACKER
// ============================================================
async function loadTrackerMeta() {
  const res = await fetch('/api/tracker/patients');
  const d = await res.json();
  const pSel = document.getElementById('trk-patient');
  populateSelect('trk-patient', d.patients.map(p => p.name + ' (' + p.records + ')'), 'All Patients');
  Array.from(pSel.options).forEach((opt, i) => { if (i > 0) opt.value = d.patients[i - 1].name; });
}
let currentTrkPage = 1;
async function loadTracker(page = 1) {
  currentTrkPage = page;
  const params = new URLSearchParams();
  if (document.getElementById('trk-patient').value !== 'all') params.set('patient', document.getElementById('trk-patient').value);
  if (document.getElementById('trk-metric').value !== 'all') params.set('metric', document.getElementById('trk-metric').value);
  if (document.getElementById('trk-status').value !== 'all') params.set('status', document.getElementById('trk-status').value);
  if (document.getElementById('trk-period').value !== 'all') params.set('range', document.getElementById('trk-period').value);
  params.set('page', page);
  params.set('limit', 40);
  const res = await fetch('/api/tracker?' + params.toString());
  const data = await res.json();
  document.getElementById('tracker-charts').innerHTML = '';
  const metric = document.getElementById('trk-metric').value;
  const patient = document.getElementById('trk-patient').value;
  if (metric !== 'all' && data.data.length) {
    const series = data.data.slice().reverse().map(t => ({ label: t.recordedDate, value: t.value }));
    document.getElementById('tracker-charts').innerHTML = renderChartCard(metric + (patient !== 'all' ? ' — ' + patient : ' — All Patients'), svgLineChart(series, {}));
  }
  const grid = document.getElementById('tracker-grid');
  if (!data.data.length) { grid.innerHTML = '<div class="empty"><div class="empty-icon">📈</div><div>No tracker readings found.</div></div>'; document.getElementById('tracker-pagination').innerHTML = ''; return; }
  grid.innerHTML = data.data.map(t => renderTrackerCard(t)).join('');
  renderPagination('tracker-pagination', data, loadTracker);
}
function renderTrackerCard(t) {
  const statusColors = { Normal: 'badge-success', Elevated: 'badge-warning', Low: 'badge-info', Critical: 'badge-danger', Improving: 'badge-success' };
  return `<div class="card">
    <div class="card-header">
      <div>
        <div class="card-title">${t.metricName}</div>
        <div class="card-subtitle">${t.patientName} • ${t.source}</div>
      </div>
      <div class="card-rating">${t.value}</div>
    </div>
    <div class="card-tags"><span class="badge ${statusColors[t.status] || 'badge-default'}">${t.status}</span></div>
    <div class="card-row"><span class="card-row-label">Date</span><span class="card-row-value">${t.recordedDate} ${t.recordedTime}</span></div>
    <div class="card-row"><span class="card-row-label">Target</span><span class="card-row-value">${t.targetValue}</span></div>
    <div class="card-row"><span class="card-row-label">Trend</span><span class="card-row-value">${t.trend}</span></div>
    ${t.notes ? `<div class="card-row"><span class="card-row-label">Notes</span><span class="card-row-value">${t.notes}</span></div>` : ''}
    ${t.doctorReviewed ? '<div class="card-row"><span class="card-row-label">Review</span><span class="card-row-value">✅ Doctor reviewed</span></div>' : ''}
  </div>`;
}
function resetTrackerFilters() {
  ['trk-patient', 'trk-metric', 'trk-status', 'trk-period'].forEach(id => document.getElementById(id).value = 'all');
  document.getElementById('trk-period').value = '30';
  loadTracker(1);
}
function exportTracker() {
  const params = new URLSearchParams();
  if (document.getElementById('trk-patient').value !== 'all') params.set('patient', document.getElementById('trk-patient').value);
  if (document.getElementById('trk-metric').value !== 'all') params.set('metric', document.getElementById('trk-metric').value);
  if (document.getElementById('trk-status').value !== 'all') params.set('status', document.getElementById('trk-status').value);
  if (document.getElementById('trk-period').value !== 'all') params.set('range', document.getElementById('trk-period').value);
  params.set('limit', 5000);
  fetch('/api/tracker?' + params.toString()).then(r => r.json()).then(d => {
    const rows = [['ID', 'Patient', 'Metric', 'Value', 'Status', 'Date', 'Time', 'Source', 'Trend', 'Notes']];
    d.data.forEach(t => rows.push([t.id, t.patientName, t.metricName, t.value, t.status, t.recordedDate, t.recordedTime, t.source, t.trend, t.notes]));
    exportToCsv('tracker.csv', rows);
  });
}
function showAddTrackerModal() {
  const modal = document.getElementById('modal');
  modal.querySelector('#modal-title').textContent = '➕ Add Health Reading';
  document.getElementById('modal-body').innerHTML = `
    <div class="filter-grid">
      <div class="filter-item"><label>Patient Name</label><input type="text" id="tk-patient" placeholder="e.g. Rajesh Kumar 001"></div>
      <div class="filter-item"><label>Metric</label><select id="tk-metric">
        <option>Weight</option><option>Blood Pressure Systolic</option><option>Blood Pressure Diastolic</option>
        <option>Blood Sugar (Fasting)</option><option>HbA1c</option><option>Cholesterol Total</option><option>HDL Cholesterol</option>
        <option>LDL Cholesterol</option><option>Triglycerides</option><option>Thyroid TSH</option><option>Vitamin D</option>
        <option>Vitamin B12</option><option>Hemoglobin</option><option>Heart Rate</option><option>Oxygen Saturation</option>
        <option>Sleep Hours</option><option>Steps Walked</option><option>Water Intake</option></select></div>
      <div class="filter-item"><label>Value</label><input type="number" step="0.01" id="tk-value" placeholder="e.g. 120"></div>
      <div class="filter-item"><label>Status</label><select id="tk-status"><option>Normal</option><option>Elevated</option><option>Low</option><option>Critical</option><option>Improving</option></select></div>
      <div class="filter-item"><label>Date</label><input type="date" id="tk-date"></div>
      <div class="filter-item"><label>Time</label><input type="time" id="tk-time" value="09:00"></div>
      <div class="filter-item" style="grid-column:1/-1;"><label>Notes</label><input type="text" id="tk-notes" placeholder="optional"></div>
    </div>
    <div class="filter-actions" style="margin-top:12px;">
      <button class="btn btn-accent" onclick="submitTracker()">✅ Save Reading</button>
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    </div>`;
  document.getElementById('tk-date').value = new Date().toISOString().split('T')[0];
  modal.classList.add('active');
}
async function submitTracker() {
  const patientName = document.getElementById('tk-patient').value;
  const metricName = document.getElementById('tk-metric').value;
  const value = document.getElementById('tk-value').value;
  if (!patientName || value === '') { showToast('Patient name and value required', 'error'); return; }
  const body = {
    patientName, metricName, value,
    status: document.getElementById('tk-status').value,
    recordedDate: document.getElementById('tk-date').value,
    recordedTime: document.getElementById('tk-time').value,
    notes: document.getElementById('tk-notes').value
  };
  const res = await fetch('/api/tracker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) { showToast('Save failed', 'error'); return; }
  closeModal();
  showToast('Reading saved 📈', 'success');
  loadTracker(currentTrkPage);
}



init();
</script>
<!-- ============ AYURVEDA ASSISTANT BOT ============ -->
<div id="bot-launcher" onclick="toggleBot()" title="Ayurveda Assistant">🤖<span class="bot-pulse"></span></div>
<div id="bot-panel" class="hidden">
  <div id="bot-header">
    <div class="bot-avatar">🕉️</div>
    <div>
      <div class="bot-title">Ayurveda Assistant</div>
      <div class="bot-sub">Ask about doctors, herbs, conditions, yoga</div>
    </div>
    <button class="bot-close" onclick="toggleBot()">×</button>
  </div>
  <div id="bot-messages"></div>
  <div id="bot-chips"></div>
  <div id="bot-input-row">
    <input id="bot-input" type="text" placeholder="Type your question…" onkeydown="if(event.key==='Enter')botSend()" />
    <button class="bot-send" onclick="botSend()">➤</button>
  </div>
</div>
<style>
  #bot-launcher{position:fixed;right:22px;bottom:22px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#2f9e8f,#16a34a);color:#fff;font-size:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 20px rgba(47,158,143,.5);z-index:9998;transition:transform .2s;}
  #bot-launcher:hover{transform:scale(1.08);}
  .bot-pulse{position:absolute;inset:0;border-radius:50%;border:2px solid #2f9e8f;animation:botpulse 2s infinite;}
  @keyframes botpulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.5);opacity:0}}
  #bot-panel{position:fixed;right:22px;bottom:96px;width:380px;max-width:92vw;height:560px;max-height:82vh;background:var(--surface,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);z-index:9999;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(47,158,143,.25);}
  #bot-panel.hidden{display:none;}
  #bot-header{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,#2f9e8f,#16a34a);color:#fff;}
  .bot-avatar{font-size:26px;}
  .bot-title{font-weight:700;font-size:15px;}
  .bot-sub{font-size:11px;opacity:.85;}
  .bot-close{margin-left:auto;background:rgba(255,255,255,.2);border:none;color:#fff;font-size:20px;width:30px;height:30px;border-radius:8px;cursor:pointer;}
  #bot-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:var(--bg,#f7faf9);}
  .bot-msg{max-width:88%;padding:10px 13px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-wrap;}
  .bot-msg.bot{background:var(--surface,#fff);align-self:flex-start;border:1px solid #e5e7eb;}
  .bot-msg.user{background:#2f9e8f;color:#fff;align-self:flex-end;}
  .bot-msg a{color:#2563eb;font-weight:600;}
  .bot-card{background:var(--surface,#fff);border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin-top:6px;}
  .bot-card h4{margin:0 0 6px;color:#2f9e8f;font-size:14px;}
  .bot-card .row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:1px dashed #eee;}
  .bot-card .row:last-child{border:none;}
  .bot-mini{display:inline-block;background:#eafaf6;color:#2f9e8f;border-radius:6px;padding:2px 8px;font-size:11px;margin:2px;}
  #bot-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;background:var(--surface,#fff);border-top:1px solid #eee;}
  .bot-chip{background:#f0fdf9;color:#2f9e8f;border:1px solid #b8e6dc;border-radius:14px;padding:5px 11px;font-size:12px;cursor:pointer;transition:.15s;}
  .bot-chip:hover{background:#2f9e8f;color:#fff;}
  #bot-input-row{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #eee;background:var(--surface,#fff);}
  #bot-input{flex:1;border:1px solid #d1d5db;border-radius:10px;padding:9px 12px;font-size:13px;outline:none;}
  #bot-input:focus{border-color:#2f9e8f;}
  .bot-send{background:#2f9e8f;color:#fff;border:none;border-radius:10px;width:42px;cursor:pointer;font-size:16px;}
  .bot-typing{font-style:italic;color:#888;}
</style>
<script>
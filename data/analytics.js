// Analytics Data Generator
// Generates analytics and reporting data for the dashboard

const { generateDoctors } = require('./doctors');
const { generateHospitals } = require('./hospitals');
const { generateInfiniteHerbs } = require('./herbs');
const { generateTherapies } = require('./therapies');
const { generateYoga } = require('./yoga');
const { generateHealthBenefits } = require('./healthBenefits');
const { generateAppointments } = require('./appointments');

const doctors = generateDoctors();
const hospitals = generateHospitals();
const herbs = generateInfiniteHerbs();
const therapies = generateTherapies();
const yoga = generateYoga();
const healthBenefits = generateHealthBenefits();
const appointments = generateAppointments();

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function generateAnalytics() {
  const analytics = [];
  const rng = seededRandom(44444);
  
  // 1. Doctor Analytics by State
  const doctorByState = {};
  doctors.forEach(d => {
    if (!doctorByState[d.state]) doctorByState[d.state] = { total: 0, ayurvedic: 0, allopathic: 0, avgRating: 0, avgFee: 0, specialties: {} };
    doctorByState[d.state].total++;
    if (d.isAyurvedic) doctorByState[d.state].ayurvedic++;
    else doctorByState[d.state].allopathic++;
    doctorByState[d.state].avgRating += d.rating;
    doctorByState[d.state].avgFee += d.consultationFee;
    doctorByState[d.state].specialties[d.specialty] = (doctorByState[d.state].specialties[d.specialty] || 0) + 1;
  });
  Object.values(doctorByState).forEach(s => {
    s.avgRating = (s.avgRating / s.total).toFixed(1);
    s.avgFee = Math.round(s.avgFee / s.total);
    s.topSpecialty = Object.entries(s.specialties).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
  });
  
  // 2. Hospital Analytics by State
  const hospitalByState = {};
  hospitals.forEach(h => {
    if (!hospitalByState[h.state]) hospitalByState[h.state] = { total: 0, ayurvedic: 0, allopathic: 0, totalBeds: 0, avgRating: 0, types: {} };
    hospitalByState[h.state].total++;
    if (h.isAyurvedic) hospitalByState[h.state].ayurvedic++;
    else hospitalByState[h.state].allopathic++;
    hospitalByState[h.state].totalBeds += h.totalBeds;
    hospitalByState[h.state].avgRating += h.rating;
    hospitalByState[h.state].types[h.type] = (hospitalByState[h.state].types[h.type] || 0) + 1;
  });
  Object.values(hospitalByState).forEach(s => {
    s.avgRating = (s.avgRating / s.total).toFixed(1);
    s.topType = Object.entries(s.types).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
  });
  
  // 3. Appointment Analytics
  const appointmentByMonth = {};
  const appointmentByStatus = {};
  const appointmentByType = {};
  appointments.forEach(a => {
    const month = a.appointmentDate.substring(0, 7);
    appointmentByMonth[month] = (appointmentByMonth[month] || 0) + 1;
    appointmentByStatus[a.status] = (appointmentByStatus[a.status] || 0) + 1;
    appointmentByType[a.appointmentType] = (appointmentByType[a.appointmentType] || 0) + 1;
  });
  
  // 4. Revenue Analytics
  const revenueByMonth = {};
  appointments.forEach(a => {
    if (a.paymentStatus === 'Paid' || a.paymentStatus === 'Partial') {
      const month = a.appointmentDate.substring(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + a.paidAmount;
    }
  });
  
  // 5. Top Doctors by Appointments
  const doctorAppointmentCount = {};
  appointments.forEach(a => {
    doctorAppointmentCount[a.doctorId] = (doctorAppointmentCount[a.doctorId] || 0) + 1;
  });
  const topDoctors = Object.entries(doctorAppointmentCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id, count]) => {
      const doc = doctors.find(d => d.id === id);
      return doc ? { ...doc, appointmentCount: count } : null;
    })
    .filter(Boolean);
  
  // 6. Herb Popularity
  const herbCategoriesCount = {};
  herbs.forEach(h => {
    herbCategoriesCount[h.category] = (herbCategoriesCount[h.category] || 0) + 1;
  });
  
  // 7. Therapy Categories
  const therapyCategoriesCount = {};
  therapies.forEach(t => {
    therapyCategoriesCount[t.category] = (therapyCategoriesCount[t.category] || 0) + 1;
  });
  
  // 8. Yoga Categories
  const yogaCategoriesCount = {};
  yoga.forEach(y => {
    yogaCategoriesCount[y.category] = (yogaCategoriesCount[y.category] || 0) + 1;
  });
  
  // 9. Health Condition Categories
  const conditionCategoriesCount = {};
  healthBenefits.forEach(c => {
    conditionCategoriesCount[c.category] = (conditionCategoriesCount[c.category] || 0) + 1;
  });
  
  // 10. Patient Demographics
  const patientAges = appointments.map(a => {
    // Mock age distribution
    return 18 + Math.floor(rng() * 70);
  });
  const ageGroups = { '18-30': 0, '31-45': 0, '46-60': 0, '61-75': 0, '75+': 0 };
  patientAges.forEach(age => {
    if (age <= 30) ageGroups['18-30']++;
    else if (age <= 45) ageGroups['31-45']++;
    else if (age <= 60) ageGroups['46-60']++;
    else if (age <= 75) ageGroups['61-75']++;
    else ageGroups['75+']++;
  });
  
  const genderDist = { Male: 0, Female: 0, Other: 0 };
  appointments.forEach(a => {
    genderDist[a.patientGender] = (genderDist[a.patientGender] || 0) + 1;
  });
  
  analytics.push({
    id: 'ANL_DOCTOR_STATE',
    name: 'Doctors by State',
    category: 'Doctors',
    type: 'state_distribution',
    data: doctorByState,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_HOSPITAL_STATE',
    name: 'Hospitals by State',
    category: 'Hospitals',
    type: 'state_distribution',
    data: hospitalByState,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_APPOINTMENTS_MONTHLY',
    name: 'Appointments by Month',
    category: 'Appointments',
    type: 'time_series',
    data: appointmentByMonth,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_APPOINTMENTS_STATUS',
    name: 'Appointments by Status',
    category: 'Appointments',
    type: 'distribution',
    data: appointmentByStatus,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_APPOINTMENTS_TYPE',
    name: 'Appointments by Type',
    category: 'Appointments',
    type: 'distribution',
    data: appointmentByType,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_REVENUE_MONTHLY',
    name: 'Revenue by Month',
    category: 'Revenue',
    type: 'time_series',
    data: revenueByMonth,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_TOP_DOCTORS',
    name: 'Top Doctors by Appointments',
    category: 'Doctors',
    type: 'ranking',
    data: topDoctors,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_HERB_CATEGORIES',
    name: 'Herbs by Category',
    category: 'Herbs',
    type: 'distribution',
    data: herbCategoriesCount,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_THERAPY_CATEGORIES',
    name: 'Therapies by Category',
    category: 'Therapies',
    type: 'distribution',
    data: therapyCategoriesCount,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_YOGA_CATEGORIES',
    name: 'Yoga by Category',
    category: 'Yoga',
    type: 'distribution',
    data: yogaCategoriesCount,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_CONDITION_CATEGORIES',
    name: 'Health Conditions by Category',
    category: 'Health Conditions',
    type: 'distribution',
    data: conditionCategoriesCount,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_PATIENT_AGE_GROUPS',
    name: 'Patient Age Distribution',
    category: 'Patients',
    type: 'distribution',
    data: ageGroups,
    generatedAt: new Date().toISOString()
  });
  
  analytics.push({
    id: 'ANL_PATIENT_GENDER',
    name: 'Patient Gender Distribution',
    category: 'Patients',
    type: 'distribution',
    data: genderDist,
    generatedAt: new Date().toISOString()
  });
  
  return analytics;
}

module.exports = { generateAnalytics };
// Comprehensive Indian Ayurvedic Hospitals, Panchakarma Centers, Wellness Resorts
const { districts } = require('./locations');

const hospitalNamesAyur = [
  'Kottakkal Arya Vaidya Sala', 'Vaidyaratnam Oushadhasala', 'Sri Sri Tattva Panchakarma',
  'Kairali Ayurvedic Centre', 'Somatheeram Ayurveda Resort', 'Carmelia Ayurveda',
  'Punarnava Ayurveda', 'Vaidyagrama Ayurveda', 'AyurVAID Hospitals', 'Sreedhareeyam Ayurvedic Eye Hospital',
  'Patanjali Yogpeeth', 'Patanjali Ayurveda Hospital', 'Baba Ramdev Patanjali Chikitsalaya',
  'Chakrapani Ayurveda', 'Nagarjuna Ayurvedic Centre', 'AVP Ayurveda Hospital',
  'Sitaram Ayurveda Pharmacy', 'Vaidyashala Ayurveda Hospital', 'Sanjeevani Ayurveda',
  'Bharat Ayurveda', 'Sree Sankara Ayurveda', 'Vishwa Bharati Ayurveda', 'Gandhi Memorial Hospital',
  'Nehru Memorial Ayurveda', 'Tilak Ayurveda', 'Tagore Ayurveda', 'Vivekananda Ayurveda Hospital'
];

const hospitalNamesAllo = [
  'Apollo Hospital', 'Fortis Hospital', 'Max Hospital', 'Manipal Hospital',
  'Medanta - The Medicity', 'Columbia Asia Hospital', 'BLK Super Speciality',
  'Artemis Hospital', 'Medicover Hospital', 'Narayana Health', 'Wockhardt Hospital',
  'Jaslok Hospital', 'Breach Candy Hospital', 'Lilavati Hospital', 'Hiranandani Hospital',
  'Tata Memorial Hospital', 'AIIMS', 'PGI', 'KEM Hospital', 'Nair Hospital', 'Seth GS Medical College',
  'Gangaram Hospital', 'Safdarjung Hospital', 'Ram Manohar Lohia Hospital', 'Lady Hardinge Hospital',
  'Sir Ganga Ram Hospital', 'BLK Hospital', 'Moolchand Hospital', 'Holy Family Hospital',
  'Amrita Institute', 'CMC Vellore', 'Sri Ramachandra Institute', 'MIOT Hospital',
  'Global Hospital', 'Yashoda Hospital', 'Continental Hospital', 'Sunshine Hospital',
  'Care Hospital', 'KIMS Hospital', 'Star Hospital', 'Omega Hospital', 'Citizens Hospital',
  'AIG Hospitals', 'Krishna Institute', 'VIMS', 'KLES Hospital', 'JSS Hospital',
  'NIMHANS', 'Sanjay Gandhi Institute', 'Tata Main Hospital', 'BC Roy Memorial Hospital'
];

const hospitalTypes = [
  'Ayurvedic Hospital', 'Panchakarma Center', 'Wellness Resort', 'Multi-Specialty Hospital',
  'Teaching Hospital', 'Research Institute', 'Naturopathy Hospital', 'Yoga & Meditation Center',
  'Cancer Center', 'Eye Hospital', 'Maternity Home', 'Pediatric Hospital',
  'Cardiac Hospital', 'Orthopedic Hospital', 'Neuro Hospital', 'Dental Hospital',
  'Trauma Center', 'Rehabilitation Center', 'Fertility Clinic', 'Skin Clinic'
];

const facilities = ['OPD', 'IPD', 'ICU', 'Emergency 24x7', 'Pharmacy', 'Pathology Lab',
  'Radiology', 'CT Scan', 'MRI', 'X-Ray', 'Ultrasound', 'ECG', 'Endoscopy',
  'Operation Theatre', 'Labour Room', 'NICU', 'PICU', 'Blood Bank', 'Ambulance',
  'Cafeteria', 'Parking', 'Wheelchair Access', 'Wi-Fi', 'AC Rooms', 'Reception',
  'Panchakarma Theatre', 'Ksharasutra Unit', 'Agni Karma Unit', 'Herbal Garden',
  'Yoga Hall', 'Meditation Hall', 'Diet Kitchen', 'Steam Bath', 'Massage Rooms',
  'Waiting Lounge', 'Telemedicine', 'Online Booking', 'Home Sample Collection',
  '24x7 Doctor On Call', 'Trauma Care', 'Dialysis', 'Cath Lab', 'Cardiac Care Unit'];

const ayurTherapies = ['Panchakarma', 'Abhyanga', 'Swedana', 'Vamana', 'Virechana',
  'Basti', 'Nasya', 'Raktamokshana', 'Shirodhara', 'Shiroabhyanga', 'Kashaya Basti',
  'Patra Pinda Sweda', 'Shashtika Shali Pinda Sweda', 'Pizichil', 'Udvartana',
  'Gandusha', 'Kavala', 'Karna Purana', 'Akshi Tarpana', 'Netra Tarpana',
  'Hridaya Basti', 'Kati Basti', 'Greeva Basti', 'Janu Basti', 'Kukkutanda Sweda',
  'Anuvasana Basti', 'Asthapana Basti', 'Matra Basti', 'Yoga Therapy', 'Meditation',
  'Pranayama', 'Marma Therapy', 'Aroma Therapy', 'Acupressure', 'Sujok Therapy'];

const treatments = ['Cardiology', 'Neurology', 'Orthopedics', 'Gynecology', 'Pediatrics',
  'Dermatology', 'ENT', 'Ophthalmology', 'Dental', 'Gastroenterology', 'Pulmonology',
  'Endocrinology', 'Nephrology', 'Oncology', 'Urology', 'Rheumatology', 'Psychiatry',
  'General Medicine', 'General Surgery', 'Plastic Surgery', 'Cardiothoracic Surgery',
  'Neurosurgery', 'Pediatric Surgery', 'Anesthesiology', 'Physiotherapy', 'Rehabilitation',
  'Panchakarma Therapy', 'Detoxification', 'Weight Management', 'Stress Management',
  'Immunity Boosting', 'Anti-aging', 'Joint Care', 'Skin Care', 'Hair Care',
  'Diabetes Management', 'Hypertension Management', 'Thyroid Care', 'Liver Care',
  'Kidney Care', 'Respiratory Care', 'Digestive Care', 'Mental Health', 'Addiction Recovery',
  'Post Natal Care', 'Infertility Treatment', 'Cancer Care', 'Palliative Care'];

const accreditations = ['NABH', 'NABL', 'JCI', 'ISO 9001:2015', 'NABH Ayush', 'CGHS Approved',
  'ECHS Recognized', 'Ayushman Bharat', 'State Government Approved', 'NAAC A++'];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function generateHospitals() {
  const hospitals = [];
  const rng = seededRandom(7777);
  // Build flat list of all (city, state) pairs
  const cityList = [];
  Object.entries(districts).forEach(([state, cities]) => {
    cities.forEach(c => cityList.push({ city: c, state }));
  });
  cityList.forEach((loc, idx) => {
    // 2-3 hospitals per city
    const count = 2 + Math.floor(rng() * 2);
    for (let i = 0; i < count; i++) {
      const isAyur = rng() < 0.45; // 45% Ayurvedic focused
      const type = isAyur
        ? pick(rng, ['Ayurvedic Hospital', 'Panchakarma Center', 'Wellness Resort', 'Naturopathy Hospital', 'Yoga & Meditation Center', 'Multi-Specialty Hospital'])
        : pick(rng, hospitalTypes.filter(t => !t.includes('Ayurvedic') && !t.includes('Panchakarma') && !t.includes('Wellness') && !t.includes('Naturopathy') && !t.includes('Yoga')));
      const baseName = isAyur ? pick(rng, hospitalNamesAyur) : pick(rng, hospitalNamesAllo);
      const name = baseName + (rng() < 0.6 ? ' - ' + loc.city : '') + (rng() < 0.3 ? ' Branch' : '');
      const totalBeds = 20 + Math.floor(rng() * 800);
      const icuBeds = Math.floor(totalBeds * (0.05 + rng() * 0.15));
      const established = 1950 + Math.floor(rng() * 75);
      const totalDoctors = 5 + Math.floor(rng() * 200);
      const totalNurses = 10 + Math.floor(rng() * 400);
      const phone = '+91 ' + (70000 + Math.floor(rng() * 30000)) + ' ' + (10000 + Math.floor(rng() * 89999));
      const emergency = '108 / +91 ' + (70000 + Math.floor(rng() * 30000)) + ' ' + (10000 + Math.floor(rng() * 89999));
      const areaNames = ['Sector 1', 'Sector 5', 'Sector 10', 'Sector 15', 'Sector 22',
        'MG Road', 'Gandhi Marg', 'Nehru Road', 'Station Road', 'Civil Lines',
        'Old City', 'New City', 'Hospital Road', 'NH Bypass', 'Ring Road',
        'Temple Road', 'Market Road', 'Park Street', 'Lake View', 'Riverside',
        'Hill View', 'Garden Road', 'Mall Road', 'Bus Stand Road', 'Railway Station Road'];
      const area = pick(rng, areaNames);
      const pincode = 100000 + Math.floor(rng() * 800000);
      const email = 'info.' + loc.city.toLowerCase().replace(/[^a-z]/g, '') + idx + i + '@' + pick(rng, ['hospital.in', 'healthcare.in', 'ayushcare.in', 'medicare.in']);
      const website = 'https://www.' + loc.city.toLowerCase().replace(/[^a-z]/g, '') + (idx + i) + '.' + pick(rng, ['hospital.in', 'ayushcare.in', 'health.in', 'clinic.in']);
      const rating = (3.5 + rng() * 1.5).toFixed(1);
      const reviews = 50 + Math.floor(rng() * 5000);

      // Facilities - pick 8-20
      const numFacilities = 8 + Math.floor(rng() * 13);
      const shuffled = [...facilities].sort(() => rng() - 0.5);
      const hospitalFacilities = shuffled.slice(0, numFacilities);

      // Specialties offered
      const numSpec = 5 + Math.floor(rng() * 15);
      const specShuffled = [...treatments].sort(() => rng() - 0.5);
      const specOffered = specShuffled.slice(0, numSpec);

      // Therapies if ayurvedic
      const therapies = isAyur ? ayurTherapies.filter(() => rng() < 0.6) : [];
      const accredit = accreditations.filter(() => rng() < 0.4);

      // Rooms
      const generalBeds = Math.floor(totalBeds * 0.5);
      const privateRooms = Math.floor(totalBeds * 0.2);
      const semiPrivate = Math.floor(totalBeds * 0.15);
      const icuRoomCount = icuBeds;
      const suite = Math.floor(totalBeds * 0.02);
      const tariff = {
        general: 500 + Math.floor(rng() * 2000),
        semiPrivate: 1500 + Math.floor(rng() * 3000),
        private: 3000 + Math.floor(rng() * 7000),
        suite: 10000 + Math.floor(rng() * 20000),
        icu: 5000 + Math.floor(rng() * 10000)
      };

      hospitals.push({
        id: 'HSP' + String(idx * 100 + i + 1).padStart(6, '0'),
        name,
        type,
        established,
        totalBeds,
        icuBeds,
        generalBeds,
        privateRooms,
        semiPrivateRooms: semiPrivate,
        icuRooms: icuRoomCount,
        suites: suite,
        totalDoctors,
        totalNurses,
        phone,
        emergency,
        email,
        website,
        address: area + ', ' + loc.city + ', ' + loc.state,
        city: loc.city,
        state: loc.state,
        country: 'India',
        area,
        pincode,
        rating: parseFloat(rating),
        totalReviews: reviews,
        facilities: hospitalFacilities,
        specialties: specOffered,
        ayurvedicTherapies: therapies,
        accreditations: accredit,
        tariff,
        isAyurvedic: isAyur,
        panchakarmaAvailable: isAyur,
        yogaCenter: isAyur || rng() < 0.4,
        hasPharmacy: rng() < 0.95,
        hasAmbulance: rng() < 0.9,
        hasCafeteria: rng() < 0.85,
        hasParking: rng() < 0.95,
        wheelchairAccess: rng() < 0.95,
        cashlessInsurance: rng() < 0.85,
        governmentSchemes: ['Ayushman Bharat', 'CGHS', 'ECHS', 'State Govt Health Scheme'].filter(() => rng() < 0.6),
        visitingHours: pick(rng, ['24x7', '8:00 AM - 8:00 PM', '9:00 AM - 9:00 PM', 'Mon-Sat 9AM-5PM']),
        appointments: pick(rng, ['Walk-in', 'Online', 'Phone', 'All modes'])
      });
    }
  });
  return hospitals;
}

module.exports = { generateHospitals, hospitalTypes, ayurTherapies, treatments };

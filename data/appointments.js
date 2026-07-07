// Appointments Data Generator
// Generates realistic appointment data for the dashboard

const { generateDoctors } = require('./doctors');
const { generateHospitals } = require('./hospitals');

const doctors = generateDoctors();
const hospitals = generateHospitals();

const appointmentStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled'];
const appointmentTypes = ['In-person', 'Video Consult', 'Home Visit', 'Follow-up', 'Emergency'];
const paymentStatuses = ['Pending', 'Paid', 'Partial', 'Refunded', 'Failed'];
const paymentMethods = ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet', 'Insurance'];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function generateAppointments() {
  const appointments = [];
  const rng = seededRandom(11111);
  
  const patientNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Singh', 'Vikram Joshi',
    'Anjali Reddy', 'Suresh Gupta', 'Meera Nair', 'Rohit Verma', 'Kavita Das',
    'Deepak Agarwal', 'Neha Kapoor', 'Ravi Shah', 'Pooja Mehta', 'Sanjay Jain',
    'Ritu Bansal', 'Manoj Goyal', 'Shweta Mittal', 'Arun Singhal', 'Divya Rastogi'];
  
  for (let i = 0; i < 3000; i++) {
    const doctor = pick(rng, doctors);
    const cityHospitals = hospitals.filter(h => h.city === doctor.city);
    const hospital = pick(rng, cityHospitals.length > 0 ? cityHospitals : hospitals);
    const status = pick(rng, appointmentStatuses);
    const type = pick(rng, appointmentTypes);
    const paymentStatus = pick(rng, paymentStatuses);
    const paymentMethod = pick(rng, paymentMethods);
    
    const daysOffset = -180 + Math.floor(rng() * 270);
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + daysOffset);
    
    const hour = 8 + Math.floor(rng() * 12);
    const minute = pick(rng, [0, 15, 30, 45]);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    const fee = doctor.consultationFee + Math.floor(rng() * 500) - 250;
    const paidAmount = paymentStatus === 'Paid' ? fee : 
                      paymentStatus === 'Partial' ? Math.floor(fee * (0.3 + rng() * 0.5)) : 0;
    
    appointments.push({
      id: 'APT' + String(i + 1).padStart(7, '0'),
      patientName: pick(rng, patientNames) + ' ' + String(Math.floor(i/200) + 1).padStart(3, '0'),
      patientId: 'PAT' + String(Math.floor(i/200) + 1).padStart(5, '0'),
      patientPhone: '+91 ' + String(70000 + Math.floor(rng() * 30000)) + ' ' + String(10000 + Math.floor(rng() * 89999)),
      patientEmail: 'patient' + i + '@healthcare.in',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      appointmentDate: appointmentDate.toISOString().split('T')[0],
      appointmentTime: timeStr,
      appointmentType: type,
      status: status,
      consultationFee: fee,
      paidAmount: paidAmount,
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      bookingDate: new Date(appointmentDate.getTime() - (1 + Math.floor(rng() * 30)) * 86400000).toISOString().split('T')[0],
      symptoms: pick(rng, ['', 'Headache', 'Fever', 'Joint pain', 'Digestive issues', 'Fatigue', 'Skin rash', 'Respiratory issues', 'Anxiety', 'Insomnia', 'Back pain', 'Cough']),
      diagnosis: status === 'Completed' ? pick(rng, ['Viral infection', 'Arthritis', 'Diabetes', 'Hypertension', 'GERD', 'Anxiety disorder', 'Eczema', 'Bronchitis', 'Migraine', 'Sciatica', 'Vitamin deficiency', 'Thyroid disorder']) : '',
      prescription: status === 'Completed' ? pick(rng, ['Medication prescribed', 'Lifestyle changes advised', 'Follow-up in 2 weeks', 'Referral to specialist', 'Panchakarma recommended', 'Yoga therapy advised']) : '',
      followUpRequired: status === 'Completed' && rng() < 0.6,
      followUpDate: status === 'Completed' && rng() < 0.6 ? new Date(appointmentDate.getTime() + (7 + Math.floor(rng() * 30)) * 86400000).toISOString().split('T')[0] : '',
      notes: rng() < 0.2 ? pick(rng, ['Patient requested morning slot', 'Elderly patient - needs assistance', 'First visit', 'Regular follow-up', 'Emergency consultation', 'Insurance claim needed']) : '',
      cancellationReason: status === 'Cancelled' ? pick(rng, ['Patient unwell', 'Schedule conflict', 'Transport issue', 'Financial constraints', 'Feeling better', 'Doctor unavailable']) : '',
      reminderSent: rng() < 0.8,
      feedbackRating: status === 'Completed' ? (3.5 + rng() * 1.5).toFixed(1) : '',
      feedbackComment: status === 'Completed' && rng() < 0.3 ? pick(rng, ['Excellent doctor', 'Very helpful', 'Good experience', 'Would recommend', 'Friendly staff', 'Clean facility']) : ''
    });
  }
  
  return appointments;
}

module.exports = { generateAppointments };
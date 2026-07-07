// Comprehensive Indian Ayurvedic & Allopathic doctors dataset
// Generated from authentic Indian medical directory patterns covering all states

const firstNames = ['Rajesh', 'Suresh', 'Mahesh', 'Dinesh', 'Ramesh', 'Mukesh', 'Hitesh', 'Naresh',
  'Pankaj', 'Prakash', 'Anil', 'Sunil', 'Vinod', 'Manish', 'Ashish', 'Satish', 'Ritesh',
  'Priya', 'Sunita', 'Anita', 'Rekha', 'Meera', 'Geeta', 'Sita', 'Radha', 'Kavita', 'Sarita',
  'Anjali', 'Pooja', 'Neha', 'Ritu', 'Shruti', 'Swati', 'Manju', 'Asha', 'Usha', 'Nisha',
  'Arun', 'Ravi', 'Amit', 'Ajay', 'Vijay', 'Sanjay', 'Manoj', 'Rohit', 'Sandeep', 'Praveen',
  'Rakesh', 'Deepak', 'Rajan', 'Raman', 'Krishna', 'Gopal', 'Hari', 'Shyam', 'Mohan', 'Sohan',
  'Aishwarya', 'Deepa', 'Kiran', 'Lata', 'Maya', 'Nirmala', 'Padma', 'Rama', 'Sushma', 'Vijaya',
  'Bharat', 'Chandra', 'Devendra', 'Eknath', 'Girish', 'Harish', 'Indra', 'Jayant', 'Kishor',
  'Lakshmi', 'Madhav', 'Narayan', 'Omkar', 'Pramod', 'Raghav', 'Sharad', 'Trilok', 'Umesh',
  'Vasant', 'Yash', 'Zubair', 'Aslam', 'Farhan', 'Imran', 'Jameel', 'Khalid', 'Mohammed',
  'Nasir', 'Owais', 'Parvez', 'Qadir', 'Rashid', 'Salim', 'Tariq', 'Waseem', 'Yusuf', 'Zaheer',
  'Ananya', 'Bhavna', 'Chitra', 'Divya', 'Esha', 'Fatima', 'Gargi', 'Hema', 'Ishita', 'Jaya',
  'Komal', 'Lavanya', 'Mahalakshmi', 'Nandini', 'Ojasvi', 'Parvati', 'Qudsia', 'Rachana',
  'Sneha', 'Tanvi', 'Uma', 'Vidya', 'Yamini', 'Zainab'];

const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Shah', 'Joshi', 'Mehta', 'Desai',
  'Rao', 'Reddy', 'Naidu', 'Chowdhury', 'Banerjee', 'Mukherjee', 'Chatterjee', 'Ghosh',
  'Iyer', 'Menon', 'Nair', 'Pillai', 'Krishnan', 'Bhat', 'Kamath', 'Hegde', 'Rao',
  'Kumar', 'Singh', 'Yadav', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Saxena',
  'Jain', 'Agarwal', 'Mittal', 'Bansal', 'Goyal', 'Mahajan', 'Arora', 'Kapoor',
  'Khanna', 'Sethi', 'Bajaj', 'Chopra', 'Malhotra', 'Bhatia', 'Anand', 'Tandon',
  'Srinivasan', 'Subramanian', 'Venkatesh', 'Ramanathan', 'Balakrishnan', 'Sundaram',
  'Khatri', 'Suri', 'Wahi', 'Puri', 'Sodhi', 'Bhalla', 'Chawla', 'Grover', 'Kakkar',
  'Bose', 'Das', 'Dey', 'Sen', 'Roy', 'Dutta', 'Saha', 'Ganguly', 'Chakraborty',
  'Gowda', 'Murthy', 'Shetty', 'Kini', 'Pai', 'Kamath', 'Acharya', 'Rao', 'Hegde',
  'Tiwari', 'Pathak', 'Chaturvedi', 'Srivastava', 'Tripathi', 'Kulshrestha', 'Dwivedi',
  'Vyas', 'Trivedi', 'Bhatt', 'Pandya', 'Acharya', 'Dave', 'Thakkar', 'Mody', 'Dalal',
  'Khan', 'Ahmed', 'Hussain', 'Sheikh', 'Siddiqui', 'Ansari', 'Qureshi', 'Shaikh',
  'Mulla', 'Mansoori', 'Noorani', 'Rizvi', 'Syed', 'Zaidi', 'Farooqi', 'Nizami',
  'Devi', 'Kaur', 'Bedi', 'Gill', 'Sandhu', 'Dhillon', 'Sidhu', 'Virk', 'Sohi',
  'Bora', 'Baruah', 'Hazarika', 'Bhattacharya', 'Deka', 'Saikia', 'Borah', 'Phukan'];

const clinics = ['AyurCare', 'Sanjeevani', 'Vaidyashala', 'Ayushman', 'Holistic Health',
  'Dhanvantari', 'Panchakarma Centre', 'Charak', 'Sushruta', 'Ashwini', 'Jeevak',
  'Madhumeha', 'Ayurkalp', 'Ayurshilpi', 'Ayurjeevana', 'Ayurbhumi', 'Sukhayu',
  'Swasthya', 'Arogyam', 'Punarjani', 'Jeevana', 'Vaidya', 'Ayush Chikitsa',
  'Niramay', 'Suvarnaprashan', 'Ayurniketan', 'Ayurgram', 'Ayursparsh', 'Ayursandhya',
  'Vaidyaratnam', 'Dhanwanthari', 'Vaidyabhushana', 'Aushadhalaya', 'Sanjeevani Ayurveda',
  'Heritage Ayurveda', 'Kerala Ayurveda', 'Kottakkal', 'Vaidyaratnam Oushadhasala',
  'Ayur Central', 'Ayur Sante', 'Ayur Wellness', 'Ayur Roots', 'Ayur Bliss',
  'Shree Ayurveda', 'Sri Ayurveda', 'Bharat Ayurveda', 'Gandhi Ayurveda', 'Nehru Ayurveda',
  'Sai Ayurveda', 'Ramakrishna Ayurveda', 'Vivekananda Ayurveda', 'Aurobindo Ayurveda',
  'Tagore Ayurveda', 'Veda Ayurveda', 'Vedic Ayurveda', 'Traditional Ayurveda', 'Classical Ayurveda',
  'Modern Ayurveda', 'Holistic Ayurveda', 'Wellness Ayurveda', 'Vital Ayurveda',
  'Life Ayurveda', 'Care Ayurveda', 'Cure Ayurveda', 'Healing Ayurveda', 'Nurture Ayurveda',
  'MediCare', 'Apollo Clinic', 'Fortis', 'Max', 'Manipal', 'Columbia Asia', 'Medanta',
  'Star Health', 'Care', 'Sunshine', 'LifeLine', 'Nova', 'Metro', 'City Hospital',
  'Medicare', 'Sahara', 'Relief', 'Cure', 'Heal', 'Arogya', 'Nirog', 'Niramaya'];

const degrees = [
  'BAMS', 'MD (Ayurveda)', 'MS (Ayurveda)', 'PhD (Ayurveda)', 'BAMS, MD (Ayurveda)',
  'BAMS, MSc (Yoga)', 'MBBS', 'MD', 'MS', 'DNB', 'BAMS, PGDYN',
  'MBBS, MD (Internal Medicine)', 'MBBS, MS (Surgery)', 'MBBS, DGO', 'MBBS, DCH',
  'MBBS, DNB (Cardiology)', 'MBBS, DM (Neurology)', 'MBBS, MCh (Urology)',
  'BHMS', 'MD (Homeopathy)', 'BUMS', 'MD (Unani)', 'BNYS', 'ND (Naturopathy)',
  'BPT', 'MPTh (Physiotherapy)', 'BOT', 'MOT (Occupational Therapy)',
  'BSc Nursing', 'MSc Nursing', 'BPharm', 'MPharm'
];

// City list used for doctor placement (subset of major locations)
const majorCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Nashik', state: 'Maharashtra' },
  { city: 'Aurangabad', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'New Delhi', state: 'Delhi' },
  { city: 'Gurugram', state: 'Haryana' },
  { city: 'Faridabad', state: 'Haryana' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Prayagraj', state: 'Uttar Pradesh' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mysuru', state: 'Karnataka' },
  { city: 'Mangaluru', state: 'Karnataka' },
  { city: 'Hubballi', state: 'Karnataka' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Warangal', state: 'Telangana' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Howrah', state: 'West Bengal' },
  { city: 'Siliguri', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Rajkot', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Jodhpur', state: 'Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan' },
  { city: 'Kota', state: 'Rajasthan' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Gwalior', state: 'Madhya Pradesh' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Gaya', state: 'Bihar' },
  { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Cuttack', state: 'Odisha' },
  { city: 'Puri', state: 'Odisha' },
  { city: 'Ranchi', state: 'Jharkhand' },
  { city: 'Jamshedpur', state: 'Jharkhand' },
  { city: 'Dehradun', state: 'Uttarakhand' },
  { city: 'Haridwar', state: 'Uttarakhand' },
  { city: 'Rishikesh', state: 'Uttarakhand' },
  { city: 'Shimla', state: 'Himachal Pradesh' },
  { city: 'Dharamshala', state: 'Himachal Pradesh' },
  { city: 'Chandigarh', state: 'Chandigarh' },
  { city: 'Ludhiana', state: 'Punjab' },
  { city: 'Amritsar', state: 'Punjab' },
  { city: 'Jalandhar', state: 'Punjab' },
  { city: 'Thiruvananthapuram', state: 'Kerala' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Kozhikode', state: 'Kerala' },
  { city: 'Thrissur', state: 'Kerala' },
  { city: 'Guwahati', state: 'Assam' },
  { city: 'Dibrugarh', state: 'Assam' },
  { city: 'Panaji', state: 'Goa' },
  { city: 'Raipur', state: 'Chhattisgarh' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { city: 'Vijayawada', state: 'Andhra Pradesh' },
  { city: 'Tirupati', state: 'Andhra Pradesh' }
];

const ayurSpecialties = ['Ayurveda General Practice', 'Panchakarma', 'Kayachikitsa', 'Shalya Tantra',
  'Shalakya Tantra', 'Prasuti Tantra (Obstetrics)', 'Kaumarbhritya (Pediatrics)',
  'Agada Tantra (Toxicology)', 'Rasayana (Rejuvenation)', 'Vajikarana',
  'Swasthavritta (Preventive)', 'Yoga & Naturopathy'];

const allSpecialties = ayurSpecialties.concat([
  'Allopathy - General Physician', 'Homeopathy', 'Unani', 'Naturopathy', 'Acupuncture',
  'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics',
  'ENT', 'Ophthalmology', 'Dental', 'Psychiatry', 'Oncology', 'Urology',
  'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Nephrology', 'Rheumatology',
  'General Surgery', 'Plastic Surgery', 'Pediatric Surgery', 'Neurosurgery',
  'Cardiothoracic Surgery', 'Physiotherapy', 'Occupational Therapy', 'Speech Therapy',
  'Dietetics & Nutrition'
]);

// Deterministic pseudo-random
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function generateDoctors() {
  const doctors = [];
  const rng = seededRandom(42);
  // 60 doctors per major city
  majorCities.forEach((loc, idx) => {
    const count = 60;
    for (let i = 0; i < count; i++) {
      const isAyur = rng() < 0.55; // 55% Ayurvedic emphasis
      const specialty = isAyur ? pick(rng, ayurSpecialties) : pick(rng, allSpecialties);
      const firstName = pick(rng, firstNames);
      const lastName = pick(rng, lastNames);
      const isAyurDegree = specialty.includes('Ayurveda') || specialty.includes('Panchakarma') ||
        specialty.includes('Yoga') || specialty.includes('Rasayana') || specialty.includes('Vajikarana') ||
        specialty === 'Prasuti Tantra (Obstetrics)' || specialty === 'Kaumarbhritya (Pediatrics)' ||
        specialty === 'Shalya Tantra' || specialty === 'Shalakya Tantra' || specialty === 'Kayachikitsa' ||
        specialty === 'Agada Tantra (Toxicology)' || specialty === 'Swasthavritta (Preventive)';
      const degreePool = isAyurDegree
        ? ['BAMS', 'BAMS, MD (Ayurveda)', 'MD (Ayurveda)', 'MS (Ayurveda)', 'PhD (Ayurveda)', 'BAMS, MSc (Yoga)']
        : (specialty === 'Homeopathy' ? ['BHMS', 'MD (Homeopathy)']
        : (specialty === 'Unani' ? ['BUMS', 'MD (Unani)']
        : (specialty === 'Naturopathy' ? ['BNYS', 'ND (Naturopathy)']
        : (specialty === 'Physiotherapy' ? ['BPT', 'MPTh (Physiotherapy)']
        : (specialty === 'Occupational Therapy' ? ['BOT', 'MOT (Occupational Therapy)']
        : (specialty === 'Dental' ? ['BDS', 'MDS']
        : (specialty === 'Acupuncture' ? ['MBBS, Dip. Acupuncture', 'BAMS, Dip. Acupuncture']
        : (specialty.includes('Surgery') ? ['MBBS, MS', 'MBBS, MCh']
        : (['Cardiology', 'Neurology', 'Gastroenterology', 'Nephrology', 'Endocrinology', 'Pulmonology', 'Rheumatology'].includes(specialty) ? ['MBBS, MD', 'MBBS, DM', 'MBBS, DNB']
        : (['Gynecology', 'Pediatrics', 'ENT', 'Ophthalmology', 'Dermatology', 'Psychiatry', 'Oncology', 'Urology', 'Anesthesiology'].includes(specialty) ? ['MBBS, MS', 'MBBS, MD', 'MBBS, DNB', 'MBBS, DGO']
        : ['MBBS', 'MBBS, MD', 'MBBS, DNB', 'BAMS']))))))))));
      const degree = pick(rng, degreePool);
      const exp = 2 + Math.floor(rng() * 38);
      const fee = isAyurDegree ? (200 + Math.floor(rng() * 800)) : (300 + Math.floor(rng() * 1500));
      const rating = (3.5 + rng() * 1.5).toFixed(1);
      const phone = '+91 ' + (70000 + Math.floor(rng() * 30000)) + ' ' + (10000 + Math.floor(rng() * 89999));
      const clinicName = pick(rng, clinics);
      const village = pick(rng, ['Sadar', 'Civil Lines', 'MG Road', 'Gandhi Chowk', 'Station Road',
        'Nehru Nagar', 'Patel Nagar', 'Subhash Nagar', 'Ram Nagar', 'Krishna Nagar',
        'Hanuman Nagar', 'Gandhi Nagar', 'Tilak Nagar', 'Malviya Nagar', 'Vasant Kunj',
        'Sector 1', 'Sector 5', 'Sector 10', 'Sector 15', 'Sector 22', 'Sector 30',
        'Phase 1', 'Phase 2', 'Old City', 'New City', 'Main Bazaar']);
      const address = village + ', ' + loc.city + ', ' + loc.state;
      const consultationModes = [];
      if (rng() < 0.95) consultationModes.push('In-person');
      if (rng() < 0.85) consultationModes.push('Video Consult');
      if (rng() < 0.4) consultationModes.push('Home Visit');

      doctors.push({
        id: 'DOC' + String(idx * 1000 + i + 1).padStart(6, '0'),
        name: 'Dr. ' + firstName + ' ' + lastName,
        specialty,
        degree,
        experience: exp,
        consultationFee: fee,
        rating: parseFloat(rating),
        phone,
        email: firstName.toLowerCase() + '.' + lastName.toLowerCase() + idx + i + '@' + pick(rng, ['ayurcare.in', 'healthline.in', 'wellness.in', 'medicare.in', 'gmail.com']),
        clinic: clinicName + ' ' + pick(rng, ['Clinic', 'Centre', 'Hospital', 'Hospital & Research Center', 'Healthcare', 'Chikitsalaya', 'Aushadhalaya']),
        address,
        city: loc.city,
        state: loc.state,
        country: 'India',
        area: village,
        languages: pick(rng, [['Hindi', 'English'], ['Hindi', 'English', 'Sanskrit'], ['English', 'Hindi', 'Marathi'], ['Tamil', 'English'], ['Bengali', 'Hindi', 'English'], ['Telugu', 'Hindi', 'English'], ['Malayalam', 'English'], ['Kannada', 'English', 'Hindi'], ['Gujarati', 'Hindi', 'English'], ['Punjabi', 'Hindi', 'English'], ['Urdu', 'Hindi', 'English']]),
        consultationModes,
        availableDays: pick(rng, [['Mon-Sat'], ['Mon-Fri'], ['Mon-Sun'], ['Tue-Sat'], ['Mon, Wed, Fri']]),
        availableHours: pick(rng, ['9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM', '10:00 AM - 6:00 PM', '8:00 AM - 12:00 PM', '24x7', '6:00 AM - 10:00 PM', '9:00 AM - 5:00 PM']),
        isAyurvedic: isAyurDegree,
        panchakarmaCertified: isAyurDegree && rng() < 0.5,
        onlineBooking: rng() < 0.7,
        awards: rng() < 0.2 ? pick(rng, ['Best Ayurveda Doctor 2024', 'Excellence in Panchakarma', 'Charak Award', 'Dhanvantari Award', 'National Ayurveda Ratna', 'Ayurved Bhushan']) : null,
        totalPatients: 100 + Math.floor(rng() * 20000)
      });
    }
  });
  return doctors;
}

module.exports = { generateDoctors, allSpecialties };

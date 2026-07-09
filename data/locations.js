// Comprehensive Indian states, districts, and cities for search filtering
module.exports = {
  countries: ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates',
    'Singapore', 'Malaysia', 'Germany', 'France', 'Netherlands', 'Ireland', 'New Zealand',
    'South Africa', 'Sri Lanka', 'Nepal', 'Bangladesh', 'Mauritius', 'Qatar', 'Saudi Arabia',
    'Oman', 'Kuwait', 'Bahrain', 'Kenya', 'Nigeria', 'Switzerland', 'Italy', 'Spain', 'Portugal', 'Japan'],
  states: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Lakshadweep', 'Puducherry'
  ],
  // Major districts per state (top cities/towns)
  districts: {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kakinada', 'Anantapur', 'Kadapa'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Along', 'Tezu'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Goalpara'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Begusarai', 'Purnia', 'Arrah', 'Chapra', 'Sasaram'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Kanker'],
    'Delhi': ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Lajpat Nagar', 'Karol Bagh', 'Saket', 'Mayur Vihar', 'Janakpuri'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Bharuch', 'Mehsana', 'Morbi'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Yamunanagar', 'Rohtak', 'Hisar', 'Sonipat', 'Panchkula', 'Sirsa', 'Bhiwani'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Mandi', 'Solan', 'Bilaspur', 'Una', 'Hamirpur', 'Kangra', 'Palampur'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Leh', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Poonch', 'Rajouri', 'Sopore'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Phusro', 'Medininagar'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Davanagere', 'Bellary', 'Gulbarga', 'Shimoga', 'Tumkur', 'Udupi', 'Hospet', 'Bijapur'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha', 'Palakkad', 'Malappuram', 'Kannur', 'Kottayam', 'Kasaragod', 'Idukki'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Chhindwara', 'Khandwa'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Resubelpara'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Mamit'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon', 'Phek'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Balasore', 'Baripada', 'Bhadrak', 'Jharsuguda', 'Jeypore'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Firozpur', 'Sangrur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Sri Ganganagar', 'Pali', 'Tonk', 'Hanumangarh', 'Beawar'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Tiruvannamalai', 'Thoothukudi', 'Kanchipuram', 'Dindigul', 'Cuddalore', 'Karur'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Siddipet', 'Suryapet'],
    'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Ambassa', 'Belonia', 'Khowai', 'Teliamura'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Ghaziabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Ayodhya'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Almora', 'Pithoragarh', 'Srinagar'],
    'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Darjeeling', 'Haldia', 'Raiganj', 'Balurghat', 'Jalpaiguri'],
    'Andaman and Nicobar Islands': ['Port Blair', 'Diglipur', 'Rangat', 'Mayabunder', 'Bamboo Flat', 'Garacharma'],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli': ['Silvassa', 'Amli', 'Naroli'],
    'Daman and Diu': ['Daman', 'Diu'],
    'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy', 'Amini', 'Andrott'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Villianur', 'Bahour', 'Nettapakkam']
  },
  // Common villages/towns sample
  villages: [
    'Amla', 'Bageshwar', 'Chakia', 'Devprayag', 'Etah', 'Fatehpur', 'Gohana', 'Hapur',
    'Indri', 'Jhalawar', 'Khalilabad', 'Laksar', 'Manglaur', 'Nanakmatta', 'Orai',
    'Pauri', 'Qazigund', 'Rae Bareli', 'Sadabad', 'Tanakpur', 'Unnao', 'Vaikom',
    'Wai', 'Yawatmal', 'Zirakpur', 'Ambejogai', 'Bhagalpur', 'Chandauli', 'Dahanu',
    'Ettumanoor', 'Fazilka', 'Gadag', 'Hosur', 'Irinjalakuda', 'Jangaon', 'Kadi',
    'Lalganj', 'Manwath', 'Nandurbar', 'Osmanabad', 'Pithampur', 'Quepem', 'Raisen',
    'Sasni', 'Taranagar', 'Upleta', 'Vapi', 'Washim', 'Yadgir', 'Zahirabad',
    'Aizawl', 'Balrampur', 'Churu', 'Dhule', 'Eluru', 'Fatehgarh Sahib', 'Ganjam',
    'Hingoli', 'Itarsi', 'Jhumri Telaiya', 'Kasganj', 'Loni', 'Mehkar', 'Narasaraopet',
    'Oddanchatram', 'Palanpur', 'Quilon', 'Ratangarh', 'Sirsi', 'Tenkasi', 'Udaipur',
    'Vatakara', 'Wardha', 'Yamuna Nagar', 'Zunheboto'
  ],
  // Doctor specialty categories
  specialties: [
    'Ayurveda General Practice', 'Panchakarma', 'Kayachikitsa', 'Shalya Tantra', 'Shalakya Tantra',
    'Prasuti Tantra (Obstetrics)', 'Kaumarbhritya (Pediatrics)', 'Agada Tantra (Toxicology)',
    'Rasayana (Rejuvenation)', 'Vajikarana', 'Swasthavritta (Preventive)', 'Yoga & Naturopathy',
    'Allopathy - General Physician', 'Homeopathy', 'Unani', 'Naturopathy', 'Acupuncture',
    'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics',
    'ENT', 'Ophthalmology', 'Dental', 'Psychiatry', 'Oncology', 'Urology', 'Gastroenterology',
    'Pulmonology', 'Endocrinology', 'Nephrology', 'Rheumatology', 'Anesthesiology',
    'General Surgery', 'Plastic Surgery', 'Pediatric Surgery', 'Neurosurgery', 'Cardiothoracic Surgery',
    'Physiotherapy', 'Occupational Therapy', 'Speech Therapy', 'Dietetics & Nutrition'
  ],
  hospitalTypes: [
    'Ayurvedic Hospital', 'Panchakarma Center', 'Wellness Resort', 'Multi-Specialty Hospital',
    'Teaching Hospital', 'Research Institute', 'Naturopathy Hospital', 'Yoga & Meditation Center',
    'Cancer Center', 'Eye Hospital', 'Maternity Home', 'Pediatric Hospital',
    'Cardiac Hospital', 'Orthopedic Hospital', 'Neuro Hospital', 'Dental Hospital',
    'Trauma Center', 'Rehabilitation Center', 'Fertility Clinic', 'Skin Clinic'
  ]
};

// Favorites Data Generator
// Generates realistic favorites/bookmarks data for patients

const { generateDoctors } = require('./doctors');
const { generateHospitals } = require('./hospitals');
const { generateInfiniteHerbs } = require('./herbs');
const { generateTherapies } = require('./therapies');
const { generateYoga } = require('./yoga');
const { generateHealthBenefits } = require('./healthBenefits');

const doctors = generateDoctors();
const hospitals = generateHospitals();
const herbs = generateInfiniteHerbs();
const therapies = generateTherapies();
const yoga = generateYoga();
const healthBenefits = generateHealthBenefits();

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function generateFavorites() {
  const favorites = [];
  const rng = seededRandom(33333);
  
  const patientNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Singh', 'Vikram Joshi',
    'Anjali Reddy', 'Suresh Gupta', 'Meera Nair', 'Rohit Verma', 'Kavita Das'];
  
  const favoriteTypes = ['doctor', 'hospital', 'herb', 'therapy', 'yoga', 'condition'];
  
  for (let i = 0; i < 2000; i++) {
    const patient = pick(rng, patientNames) + ' ' + String(Math.floor(i/200) + 1).padStart(3, '0');
    const type = pick(rng, favoriteTypes);
    let itemId = '', itemName = '', itemDetails = '';
    
    switch(type) {
      case 'doctor':
        const doc = pick(rng, doctors);
        itemId = doc.id;
        itemName = doc.name;
        itemDetails = `${doc.specialty} | ${doc.city}, ${doc.state} | Rating: ${doc.rating}`;
        break;
      case 'hospital':
        const hosp = pick(rng, hospitals);
        itemId = hosp.id;
        itemName = hosp.name;
        itemDetails = `${hosp.type} | ${hosp.city}, ${hosp.state} | ${hosp.totalBeds} beds | Rating: ${hosp.rating}`;
        break;
      case 'herb':
        const herb = pick(rng, herbs);
        itemId = herb.id;
        itemName = herb.name;
        itemDetails = `${herb.category} | ${herb.primaryUses.slice(0,2).join(', ')}`;
        break;
      case 'therapy':
        const therapy = pick(rng, therapies);
        itemId = therapy.id;
        itemName = therapy.name;
        itemDetails = `${therapy.category} | ${therapy.duration} | ${therapy.indications.slice(0,2).join(', ')}`;
        break;
      case 'yoga':
        const yog = pick(rng, yoga);
        itemId = yog.id;
        itemName = yog.name;
        itemDetails = `${yog.category} | ${yog.difficulty} | ${yog.benefits.slice(0,2).join(', ')}`;
        break;
      case 'condition':
        const cond = pick(rng, healthBenefits);
        itemId = cond.id;
        itemName = cond.name;
        itemDetails = `${cond.category} | ${cond.severity} | ${cond.doshaImbalance}`;
        break;
    }
    
    const daysOffset = -180 + Math.floor(rng() * 180);
    const addedDate = new Date();
    addedDate.setDate(addedDate.getDate() + daysOffset);
    
    const tags = ['My favorites', 'For family', 'Research', 'Treatment plan', 'Reference'].filter(() => rng() < 0.3);
    
    favorites.push({
      id: 'FAV' + String(i + 1).padStart(7, '0'),
      patientName: patient,
      patientId: 'PAT' + String(Math.floor(i/200) + 1).padStart(5, '0'),
      type: type,
      itemId: itemId,
      itemName: itemName,
      itemDetails: itemDetails,
      addedDate: addedDate.toISOString().split('T')[0],
      notes: rng() < 0.2 ? pick(rng, ['Recommended by friend', 'Good reviews', 'Near my home', 'Specialist in my condition', 'Affordable fees', 'Good experience']) : '',
      tags: tags,
      priority: pick(rng, ['High', 'Medium', 'Low']),
      reminderEnabled: rng() < 0.3,
      sharedWithFamily: rng() < 0.2
    });
  }
  
  return favorites;
}

module.exports = { generateFavorites };
// Health Tracker Data Generator
// Generates realistic health tracking data for patients

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function generateHealthTracker() {
  const tracker = [];
  const rng = seededRandom(22222);
  
  const metrics = [
    { name: 'Weight', unit: 'kg', min: 45, max: 120, decimal: 1 },
    { name: 'Blood Pressure Systolic', unit: 'mmHg', min: 90, max: 180, decimal: 0 },
    { name: 'Blood Pressure Diastolic', unit: 'mmHg', min: 60, max: 120, decimal: 0 },
    { name: 'Blood Sugar (Fasting)', unit: 'mg/dL', min: 70, max: 300, decimal: 0 },
    { name: 'Blood Sugar (Post-meal)', unit: 'mg/dL', min: 90, max: 400, decimal: 0 },
    { name: 'HbA1c', unit: '%', min: 4.0, max: 12.0, decimal: 1 },
    { name: 'Cholesterol Total', unit: 'mg/dL', min: 120, max: 350, decimal: 0 },
    { name: 'HDL Cholesterol', unit: 'mg/dL', min: 25, max: 100, decimal: 0 },
    { name: 'LDL Cholesterol', unit: 'mg/dL', min: 50, max: 250, decimal: 0 },
    { name: 'Triglycerides', unit: 'mg/dL', min: 50, max: 500, decimal: 0 },
    { name: 'Thyroid TSH', unit: 'mIU/L', min: 0.1, max: 20.0, decimal: 2 },
    { name: 'Vitamin D', unit: 'ng/mL', min: 5, max: 100, decimal: 1 },
    { name: 'Vitamin B12', unit: 'pg/mL', min: 100, max: 1200, decimal: 0 },
    { name: 'Hemoglobin', unit: 'g/dL', min: 8.0, max: 18.0, decimal: 1 },
    { name: 'Body Temperature', unit: 'F', min: 97.0, max: 103.0, decimal: 1 },
    { name: 'Heart Rate', unit: 'bpm', min: 50, max: 120, decimal: 0 },
    { name: 'Oxygen Saturation', unit: '%', min: 85, max: 100, decimal: 1 },
    { name: 'Sleep Hours', unit: 'hrs', min: 3, max: 12, decimal: 1 },
    { name: 'Steps Walked', unit: 'steps', min: 500, max: 20000, decimal: 0 },
    { name: 'Water Intake', unit: 'L', min: 0.5, max: 5.0, decimal: 1 }
  ];
  
  const patientNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Singh', 'Vikram Joshi', 
                        'Anjali Reddy', 'Suresh Gupta', 'Meera Nair', 'Rohit Verma', 'Kavita Das',
                        'Deepak Agarwal', 'Neha Kapoor', 'Ravi Shah', 'Pooja Mehta', 'Sanjay Jain',
                        'Ritu Bansal', 'Manoj Goyal', 'Shweta Mittal', 'Arun Singhal', 'Divya Rastogi'];
  
  // Generate 5000+ health tracker entries
  for (let i = 0; i < 5000; i++) {
    const patient = pick(rng, patientNames) + ' ' + String(Math.floor(i/200) + 1).padStart(3, '0');
    const metric = pick(rng, metrics);
    const baseValue = metric.min + rng() * (metric.max - metric.min);
    const value = metric.decimal > 0 ? baseValue.toFixed(metric.decimal) : Math.round(baseValue);
    
    const daysOffset = -365 + Math.floor(rng() * 365);
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() + daysOffset);
    
    const statuses = ['Normal', 'Normal', 'Normal', 'Normal', 'Elevated', 'Low', 'Critical', 'Improving'];
    const status = pick(rng, statuses);
    
    let targetValue = 'Normal range';
    if (metric.name.includes('Blood Pressure')) targetValue = '120/80';
    else if (metric.name.includes('Blood Sugar')) targetValue = '<100';
    else if (metric.name.includes('HbA1c')) targetValue = '<5.7';
    else if (metric.name.includes('Cholesterol')) targetValue = '<200';
    
    tracker.push({
      id: 'HTR' + String(i + 1).padStart(7, '0'),
      patientName: patient,
      patientId: 'PAT' + String(Math.floor(i/200) + 1).padStart(5, '0'),
      metricName: metric.name,
      metricUnit: metric.unit,
      value: parseFloat(value),
      status: status,
      recordedDate: recordDate.toISOString().split('T')[0],
      recordedTime: `${String(6 + Math.floor(rng() * 18)).padStart(2, '0')}:${pick(rng, ['00', '15', '30', '45'])}`,
      notes: rng() < 0.2 ? pick(rng, ['Post medication', 'Fasting', 'After meal', 'Morning reading', 'Before bed', 'Post exercise']) : '',
      trend: pick(rng, ['Stable', 'Improving', 'Worsening', 'Fluctuating']),
      targetValue: targetValue,
      source: pick(rng, ['Home Monitor', 'Lab Test', 'Clinic Visit', 'Wearable Device', 'Manual Entry']),
      doctorReviewed: rng() < 0.3,
      alerts: status === 'Critical' ? ['Value outside normal range - consult doctor'] : 
              status === 'Elevated' ? ['Monitor closely, consider lifestyle changes'] : 
              status === 'Low' ? ['Value below normal - consult doctor'] : []
    });
  }
  
  return tracker;
}

module.exports = { generateHealthTracker };
// One-off cleanup: remove fake verified/seeded doctors and seeded fake reviews.
// Real doctors must arrive only via OTP-verified registration (server.js).
const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'data', 'data', 'store.json');
const store = JSON.parse(fs.readFileSync(p, 'utf8'));

// Keep only registered doctors that are NOT the injected fake ones.
// A real doctor in this system has an OTP-verified registration; we drop any
// record whose identity was hard-seeded (password 'secret123' / zeroed fields
// with verified:true) so nothing unverifiable is ever shown as "verified".
const FAKE_PASS = 'secret123';
const before = store.registeredDoctors.length;
store.registeredDoctors = store.registeredDoctors.filter(d =>
  !(d.password === FAKE_PASS && d.experience === 0 && d.address === '' && d.verified === true)
);
// Belt-and-suspenders: even if a real-ish one slipped through, never trust a
// pre-existing verified flag that wasn't set by an admin action this session.
store.registeredDoctors.forEach(d => {
  if (d.verified && d.verificationStatus === 'verified' && d.experience === 0 && d.consultationFee === 0) {
    d.verified = false;
    d.verificationStatus = 'unverified';
  }
});

// Remove all auto-seeded fake reviews (they were generated at startup, not by
// real patients). Genuine reviews will be created by patients posting them.
store.reviews = {};

fs.writeFileSync(p, JSON.stringify(store, null, 2));
console.log(`registeredDoctors ${before} -> ${store.registeredDoctors.length}`);
console.log(`reviews reset to ${Object.keys(store.reviews).length}`);

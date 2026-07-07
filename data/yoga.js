// Comprehensive Yoga Asanas, Pranayama, Mudras, Kriyas, Meditation Database

const yogaAsanas = [
  // Standing poses
  { name: 'Tadasana', english: 'Mountain Pose', sanskrit: 'ताडासन', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Improves posture', 'Strengthens thighs', 'Reduces flat feet', 'Increases awareness', 'Sciatica relief'],
    indications: ['Poor posture', 'Anxiety', 'Low energy', 'Sciatica'],
    contraindications: ['Low blood pressure', 'Insomnia', 'Headache'],
    duration: '30-60 seconds', repetitions: '1-3 times', bestTime: 'Morning',
    chakra: 'Root (Muladhara)', drishti: 'Forward', breathing: 'Deep ujjayi' },

  { name: 'Vrikshasana', english: 'Tree Pose', sanskrit: 'वृक्षासन', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Improves balance', 'Strengthens legs', 'Calms mind', 'Improves focus', 'Stretches groin'],
    indications: ['Sciatica', 'Anxiety', 'Balance issues', 'Low focus'],
    contraindications: ['High blood pressure', 'Low blood pressure', 'Vertigo', 'Recent knee injury'],
    duration: '30-60 seconds each side', repetitions: '1-3 times each side', bestTime: 'Anytime',
    chakra: 'Root', drishti: 'Forward', breathing: 'Steady natural breath' },

  { name: 'Trikonasana', english: 'Triangle Pose', sanskrit: 'त्रिकोणासन', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Stretches legs', 'Stretches spine', 'Improves digestion', 'Reduces stress', 'Energizes body'],
    indications: ['Back pain', 'Stress', 'Indigestion', 'Neck pain'],
    contraindications: ['Diarrhea', 'Low or high blood pressure', 'Headache'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Morning or evening',
    chakra: 'Solar plexus', drishti: 'Up hand', breathing: 'Deep breaths' },

  { name: 'Virabhadrasana I', english: 'Warrior I', sanskrit: 'वीरभद्रासन I', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Strengthens legs', 'Opens hips', 'Stretches chest', 'Builds stamina', 'Improves focus'],
    indications: ['Stiff hips', 'Back pain', 'Weak legs'],
    contraindications: ['High blood pressure', 'Heart problems', 'Knee injury'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Morning',
    chakra: 'Heart', drishti: 'Forward or up', breathing: 'Deep' },

  { name: 'Virabhadrasana II', english: 'Warrior II', sanskrit: 'वीरभद्रासन II', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Strengthens legs', 'Opens hips', 'Stretches groin', 'Builds stamina', 'Stimulates abdominal organs'],
    indications: ['Backache', 'Sciatica', 'Osteoporosis', 'PMS'],
    contraindications: ['Diarrhea', 'High blood pressure', 'Neck issues (do not turn head)'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Morning',
    chakra: 'Sacral + Solar', drishti: 'Over front hand', breathing: 'Deep' },

  { name: 'Virabhadrasana III', english: 'Warrior III', sanskrit: 'वीरभद्रासन III', category: 'Standing', difficulty: 'Intermediate',
    benefits: ['Improves balance', 'Strengthens ankles, legs', 'Tones abdomen', 'Improves posture'],
    indications: ['Tension', 'Fatigue', 'Balance issues'],
    contraindications: ['High blood pressure', 'Recent injury'],
    duration: '20-30 seconds each side', repetitions: '1-3 times', bestTime: 'Morning',
    chakra: 'Solar', drishti: 'Down', breathing: 'Steady' },

  { name: 'Uttanasana', english: 'Standing Forward Bend', sanskrit: 'उत्तानासन', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Calms mind', 'Stretches hamstrings', 'Relieves stress', 'Stimulates liver', 'Reduces fatigue'],
    indications: ['Anxiety', 'Headache', 'Insomnia', 'Mild depression'],
    contraindications: ['Back injury', 'Glaucoma', 'High blood pressure', 'Sciatica'],
    duration: '30-60 seconds', repetitions: '3-5 times', bestTime: 'Morning or evening',
    chakra: 'Sacral + Heart', drishti: 'Toes', breathing: 'Long exhales' },

  { name: 'Urdhva Hastasana', english: 'Upward Salute', sanskrit: 'ऊर्ध्वहस्तासन', category: 'Standing', difficulty: 'Beginner',
    benefits: ['Stretches shoulders', 'Lengthens spine', 'Improves digestion', 'Energizes'],
    indications: ['Tension', 'Back pain', 'Asthma'],
    contraindications: ['Shoulder injury', 'Neck injury'],
    duration: '20-30 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Crown', drishti: 'Thumbs', breathing: 'Inhale on lift' },

  // Seated poses
  { name: 'Sukhasana', english: 'Easy Pose', sanskrit: 'सुखासन', category: 'Seated', difficulty: 'Beginner',
    benefits: ['Calms mind', 'Opens hips', 'Strengthens back', 'Reduces anxiety', 'Improves posture'],
    indications: ['Stress', 'Anxiety', 'Meditation'],
    contraindications: ['Knee injury', 'Sciatica (severe)'],
    duration: '5-30 minutes', repetitions: 'Daily', bestTime: 'Meditation time',
    chakra: 'Root', drishti: 'Nose tip', breathing: 'Slow deep' },

  { name: 'Padmasana', english: 'Lotus Pose', sanskrit: 'पद्मासन', category: 'Seated', difficulty: 'Advanced',
    benefits: ['Calms mind', 'Stretches knees/ankles', 'Improves posture', 'Awakens kundalini', 'Stimulates pelvis'],
    indications: ['Meditation', 'Sciatica', 'Menstrual discomfort'],
    contraindications: ['Knee injury', 'Ankle injury', 'Sacroiliac issues'],
    duration: '5-30 minutes', repetitions: 'Daily', bestTime: 'Meditation time',
    chakra: 'Crown', drishti: 'Nose tip or third eye', breathing: 'Slow deep' },

  { name: 'Siddhasana', english: 'Accomplished Pose', sanskrit: 'सिद्धासन', category: 'Seated', difficulty: 'Intermediate',
    benefits: ['Calms mind', 'Stretches knees', 'Stimulates Muladhara', 'Aids meditation'],
    indications: ['Meditation', 'Spiritual practices'],
    contraindications: ['Knee injury', 'Ankle injury'],
    duration: '15-45 minutes', repetitions: 'Daily', bestTime: 'Meditation time',
    chakra: 'Root + Crown', drishti: 'Third eye', breathing: 'Slow' },

  { name: 'Vajrasana', english: 'Thunderbolt Pose', sanskrit: 'वज्रासन', category: 'Seated', difficulty: 'Beginner',
    benefits: ['Improves digestion', 'Calms mind', 'Aids meditation', 'Strengthens pelvic muscles', 'Cures acidity'],
    indications: ['Indigestion', 'Acidity', 'Gas', 'Back pain', 'Sciatica'],
    contraindications: ['Knee injury', 'Ankle injury', 'Recent abdominal surgery'],
    duration: '5-30 minutes', repetitions: 'Daily after meals', bestTime: 'After meals',
    chakra: 'Manipura', drishti: 'Eyes closed', breathing: 'Deep' },

  { name: 'Baddha Konasana', english: 'Bound Angle Pose', sanskrit: 'बद्ध कोणासन', category: 'Seated', difficulty: 'Beginner',
    benefits: ['Stretches inner thighs', 'Stimulates abdominal organs', 'Improves circulation', 'Relieves stress'],
    indications: ['Menstrual discomfort', 'Sciatica', 'Infertility', 'Urinary disorders'],
    contraindications: ['Knee injury', 'Groin injury', 'Sciatica (acute)'],
    duration: '1-5 minutes', repetitions: 'Daily', bestTime: 'Morning',
    chakra: 'Sacral', drishti: 'Forward', breathing: 'Deep' },

  { name: 'Janu Sirsasana', english: 'Head-to-Knee Pose', sanskrit: 'जानु शीर्षासन', category: 'Seated', difficulty: 'Beginner',
    benefits: ['Stretches hamstrings', 'Calms mind', 'Stimulates liver', 'Improves digestion', 'Reduces anxiety'],
    indications: ['Anxiety', 'Headache', 'Insomnia', 'Menstrual discomfort'],
    contraindications: ['Knee injury', 'Asthma', 'Diarrhea', 'Low back injury'],
    duration: '1-3 minutes each side', repetitions: '3-5 times', bestTime: 'Morning or evening',
    chakra: 'Sacral + Solar', drishti: 'Toes', breathing: 'Deep' },

  { name: 'Paschimottanasana', english: 'Seated Forward Bend', sanskrit: 'पश्चिमोत्तानासन', category: 'Seated', difficulty: 'Beginner',
    benefits: ['Calms mind', 'Stretches spine', 'Stimulates organs', 'Reduces anxiety', 'Treats diabetes'],
    indications: ['Anxiety', 'Headache', 'Insomnia', 'Menstrual discomfort', 'Hypertension'],
    contraindications: ['Back injury', 'Sciatica', 'Hernia', 'Pregnancy', 'Asthma'],
    duration: '1-3 minutes', repetitions: '3-5 times', bestTime: 'Morning or evening',
    chakra: 'Sacral + Solar', drishti: 'Toes', breathing: 'Deep' },

  { name: 'Ardha Matsyendrasana', english: 'Half Lord of the Fishes Pose', sanskrit: 'अर्ध मत्स्येन्द्रासन', category: 'Seated', difficulty: 'Intermediate',
    benefits: ['Stimulates digestion', 'Stretches spine', 'Energizes spine', 'Relieves backache', 'Stimulates liver'],
    indications: ['Backache', 'Sciatica', 'Indigestion', 'Fatigue', 'Asthma'],
    contraindications: ['Spinal injury', 'Pregnancy', 'Menstruation', 'Post-surgery'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Morning',
    chakra: 'Solar + Heart', drishti: 'Over shoulder', breathing: 'Deep' },

  // Backbends
  { name: 'Bhujangasana', english: 'Cobra Pose', sanskrit: 'भुजङ्गासन', category: 'Backbend', difficulty: 'Beginner',
    benefits: ['Strengthens spine', 'Opens chest', 'Stimulates organs', 'Improves flexibility', 'Reduces stress'],
    indications: ['Back pain', 'Asthma', 'Fatigue', 'Stress', 'Menstrual irregularities'],
    contraindications: ['Pregnancy', 'Carpal tunnel', 'Back surgery', 'Hernia', 'Headache'],
    duration: '15-30 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Heart + Throat', drishti: 'Forward or up', breathing: 'Inhale to lift' },

  { name: 'Dhanurasana', english: 'Bow Pose', sanskrit: 'धनुरासन', category: 'Backbend', difficulty: 'Intermediate',
    benefits: ['Stretches spine', 'Strengthens back', 'Stimulates organs', 'Improves posture', 'Opens chest'],
    indications: ['Back pain', 'Constipation', 'Fatigue', 'Diabetes', 'PMS'],
    contraindications: ['Pregnancy', 'Back injury', 'Neck injury', 'High or low blood pressure', 'Hernia'],
    duration: '15-20 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Solar + Heart', drishti: 'Forward', breathing: 'Inhale to lift' },

  { name: 'Urdhva Mukha Svanasana', english: 'Upward-Facing Dog', sanskrit: 'ऊर्ध्व मुख श्वानासन', category: 'Backbend', difficulty: 'Intermediate',
    benefits: ['Strengthens arms/wrists', 'Stretches chest/shoulders', 'Improves posture', 'Energizes'],
    indications: ['Back pain', 'Asthma', 'Fatigue', 'Sciatica'],
    contraindications: ['Pregnancy', 'Back injury', 'Carpal tunnel', 'Headache'],
    duration: '15-30 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Heart + Throat', drishti: 'Forward or up', breathing: 'Deep' },

  { name: 'Ustrasana', english: 'Camel Pose', sanskrit: 'उष्ट्रासन', category: 'Backbend', difficulty: 'Intermediate',
    benefits: ['Stretches front body', 'Opens chest', 'Improves posture', 'Stimulates organs', 'Reduces back pain'],
    indications: ['Back pain', 'Mood disorders', 'Fatigue', 'Menstrual discomfort'],
    contraindications: ['Back injury', 'Neck injury', 'High or low blood pressure', 'Migraine', 'Insomnia'],
    duration: '15-30 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Heart + Throat', drishti: 'Up or nose tip', breathing: 'Deep' },

  // Inversions
  { name: 'Sirsasana', english: 'Headstand', sanskrit: 'शीर्षासन', category: 'Inversion', difficulty: 'Advanced',
    benefits: ['Improves blood circulation to brain', 'Strengthens shoulders', 'Improves memory', 'Calms mind', 'Energizes'],
    indications: ['Memory issues', 'Anxiety', 'Insomnia', 'Headache', 'Sinusitis'],
    contraindications: ['Neck injury', 'High blood pressure', 'Heart disease', 'Glaucoma', 'Menstruation', 'Pregnancy'],
    duration: '1-5 minutes', repetitions: 'Once daily', bestTime: 'Morning (empty stomach)',
    chakra: 'Sahasrara', drishti: 'Closed', breathing: 'Slow deep' },

  { name: 'Sarvangasana', english: 'Shoulder Stand', sanskrit: 'सर्वाङ्गासन', category: 'Inversion', difficulty: 'Intermediate',
    benefits: ['Stimulates thyroid', 'Calms mind', 'Improves circulation', 'Strengthens shoulders', 'Aids sleep'],
    indications: ['Thyroid disorders', 'Sinusitis', 'Insomnia', 'Stress', 'Respiratory issues'],
    contraindications: ['Neck injury', 'High blood pressure', 'Heart disease', 'Menstruation', 'Pregnancy', 'Glaucoma'],
    duration: '1-5 minutes', repetitions: 'Once daily', bestTime: 'Morning or before bed',
    chakra: 'Vishuddha', drishti: 'Toes', breathing: 'Deep' },

  { name: 'Halasana', english: 'Plow Pose', sanskrit: 'हलासन', category: 'Inversion', difficulty: 'Intermediate',
    benefits: ['Stretches spine', 'Calms mind', 'Stimulates thyroid', 'Improves digestion', 'Reduces back pain'],
    indications: ['Back pain', 'Insomnia', 'Headache', 'Sinusitis', 'Infertility'],
    contraindications: ['Neck injury', 'Diarrhea', 'Menstruation', 'Pregnancy', 'High blood pressure'],
    duration: '30-60 seconds', repetitions: '1-3 times', bestTime: 'Morning or evening',
    chakra: 'Vishuddha', drishti: 'Toes', breathing: 'Deep' },

  { name: 'Viparita Karani', english: 'Legs-Up-the-Wall Pose', sanskrit: 'विपरीत करणी', category: 'Inversion', difficulty: 'Beginner',
    benefits: ['Relieves tired legs', 'Calms mind', 'Improves circulation', 'Reduces anxiety', 'Aids sleep'],
    indications: ['Anxiety', 'Insomnia', 'Varicose veins', 'Fatigue', 'Headache'],
    contraindications: ['Serious eye/back issues', 'Glaucoma', 'High blood pressure (severe)'],
    duration: '5-15 minutes', repetitions: 'Daily', bestTime: 'Evening',
    chakra: 'Crown', drishti: 'Closed', breathing: 'Slow deep' },

  // Restorative / Supine
  { name: 'Savasana', english: 'Corpse Pose', sanskrit: 'शवासन', category: 'Supine', difficulty: 'Beginner',
    benefits: ['Deep relaxation', 'Reduces stress', 'Lowers blood pressure', 'Calms nervous system', 'Integrates practice'],
    indications: ['Stress', 'Anxiety', 'Insomnia', 'High blood pressure', 'Fatigue'],
    contraindications: ['Late pregnancy (use side lying)', 'Back discomfort (with support)'],
    duration: '5-30 minutes', repetitions: 'End of practice', bestTime: 'End of session',
    chakra: 'Crown', drishti: 'Closed', breathing: 'Natural' },

  { name: 'Setu Bandha Sarvangasana', english: 'Bridge Pose', sanskrit: 'सेतु बन्ध सर्वाङ्गासन', category: 'Supine', difficulty: 'Beginner',
    benefits: ['Stretches chest/neck/spine', 'Strengthens back', 'Calms mind', 'Stimulates thyroid', 'Reduces anxiety'],
    indications: ['Anxiety', 'Insomnia', 'Thyroid', 'Back pain', 'Sinusitis'],
    contraindications: ['Neck injury', 'Back injury'],
    duration: '30-60 seconds', repetitions: '3-5 times', bestTime: 'Morning or evening',
    chakra: 'Vishuddha', drishti: 'Up', breathing: 'Inhale lift' },

  { name: 'Supta Matsyendrasana', english: 'Supine Spinal Twist', sanskrit: 'सुप्त मत्स्येन्द्रासन', category: 'Supine', difficulty: 'Beginner',
    benefits: ['Increases spine mobility', 'Stretches shoulders/chest', 'Relieves backache', 'Aids digestion'],
    indications: ['Back pain', 'Sciatica', 'Indigestion', 'Stress'],
    contraindications: ['Spinal injury', 'Pregnancy', 'Disc issues (severe)'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Evening',
    chakra: 'Manipura', drishti: 'Opposite shoulder', breathing: 'Deep' },

  // Core / Abdominal
  { name: 'Navasana', english: 'Boat Pose', sanskrit: 'नावासन', category: 'Core', difficulty: 'Intermediate',
    benefits: ['Strengthens core', 'Improves digestion', 'Strengthens hip flexors', 'Stimulates kidneys', 'Improves balance'],
    indications: ['Weak core', 'Indigestion', 'Low stamina', 'Stress'],
    contraindications: ['Pregnancy', 'Hernia', 'Menstruation', 'Recent abdominal surgery', 'Low back injury'],
    duration: '20-60 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Manipura', drishti: 'Toes', breathing: 'Steady' },

  { name: 'Phalakasana', english: 'Plank Pose', sanskrit: 'फलकासन', category: 'Core', difficulty: 'Beginner',
    benefits: ['Strengthens core', 'Strengthens arms/wrists', 'Tones abdomen', 'Improves posture'],
    indications: ['Weak core', 'Poor posture', 'Back pain (when strong)'],
    contraindications: ['Carpal tunnel', 'Pregnancy', 'High blood pressure'],
    duration: '30-60 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Manipura', drishti: 'Forward', breathing: 'Steady' },

  { name: 'Chaturanga Dandasana', english: 'Four-Limbed Staff Pose', sanskrit: 'चतुरङ्ग दण्डासन', category: 'Core', difficulty: 'Intermediate',
    benefits: ['Strengthens arms/wrists', 'Tones abdomen', 'Strengthens back', 'Builds stamina'],
    indications: ['Weak arms', 'Weak core', 'Posture issues'],
    contraindications: ['Carpal tunnel', 'Pregnancy', 'Back injury', 'Wrist injury'],
    duration: '15-30 seconds', repetitions: '3-5 times', bestTime: 'Morning',
    chakra: 'Manipura', drishti: 'Forward', breathing: 'Steady' },

  // Hip openers
  { name: 'Baddha Konasana', english: 'Cobblers Pose', sanskrit: 'बद्ध कोणासन', category: 'Hip Opener', difficulty: 'Beginner',
    benefits: ['Stretches inner thighs', 'Stimulates abdominal organs', 'Improves circulation', 'Opens hips'],
    indications: ['Sciatica', 'Menstrual discomfort', 'Infertility', 'Anxiety'],
    contraindications: ['Knee injury', 'Groin injury'],
    duration: '1-5 minutes', repetitions: 'Daily', bestTime: 'Morning or evening',
    chakra: 'Muladhara + Svadhisthana', drishti: 'Forward', breathing: 'Deep' },

  { name: 'Eka Pada Rajakapotasana', english: 'One-Legged King Pigeon', sanskrit: 'एक पाद राजकपोतासन', category: 'Hip Opener', difficulty: 'Advanced',
    benefits: ['Opens hips', 'Stretches thighs', 'Releases emotions', 'Prepares for backbends'],
    indications: ['Sciatica', 'Tight hips', 'PMS', 'Urinary disorders'],
    contraindications: ['Knee injury', 'Sacroiliac issues', 'Pregnancy'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Evening',
    chakra: 'Svadhisthana + Anahata', drishti: 'Forward', breathing: 'Deep' },

  { name: 'Gomukhasana', english: 'Cow Face Pose', sanskrit: 'गोमुखासन', category: 'Hip Opener', difficulty: 'Intermediate',
    benefits: ['Stretches shoulders', 'Stretches hips', 'Improves posture', 'Releases tension'],
    indications: ['Frozen shoulder', 'Sciatica', 'Tension', 'Stiff hips'],
    contraindications: ['Shoulder injury', 'Neck injury', 'Hip injury'],
    duration: '30-60 seconds each side', repetitions: '1-3 times', bestTime: 'Anytime',
    chakra: 'Anahata + Vishuddha', drishti: 'Forward or closed', breathing: 'Deep' },

  // Pranayama
  { name: 'Anulom Vilom', english: 'Alternate Nostril Breathing', sanskrit: 'अनुलोम विलोम', category: 'Pranayama', difficulty: 'Beginner',
    benefits: ['Calms mind', 'Balances nervous system', 'Improves breathing', 'Reduces stress', 'Improves focus'],
    indications: ['Anxiety', 'Insomnia', 'High blood pressure', 'Sinusitis', 'Migraine', 'Asthma'],
    contraindications: ['Pregnancy (with care)', 'Epilepsy', 'Severe heart conditions'],
    duration: '5-20 minutes', repetitions: 'Daily', bestTime: 'Morning empty stomach',
    chakra: 'All', technique: 'Inhale left nostril, close, exhale right, inhale right, close, exhale left' },

  { name: 'Kapalbhati', english: 'Skull Shining Breath', sanskrit: 'कपालभाति', category: 'Pranayama', difficulty: 'Beginner',
    benefits: ['Detoxifies', 'Strengthens core', 'Improves digestion', 'Energizes', 'Clears sinuses'],
    indications: ['Obesity', 'Diabetes', 'Asthma', 'Sinusitis', 'Indigestion', 'Lung issues'],
    contraindications: ['Pregnancy', 'Heart disease', 'High blood pressure', 'Hernia', 'Menstruation', 'Epilepsy', 'Recent surgery'],
    duration: '5-15 minutes (in rounds of 20-50 breaths)', repetitions: '3-4 rounds', bestTime: 'Morning',
    chakra: 'Manipura', technique: 'Forced exhalations, passive inhalations' },

  { name: 'Bhastrika', english: 'Bellows Breath', sanskrit: 'भस्त्रिका', category: 'Pranayama', difficulty: 'Intermediate',
    benefits: ['Energizes', 'Improves lung capacity', 'Clears mind', 'Boosts metabolism', 'Stimulates digestion'],
    indications: ['Asthma', 'Bronchitis', 'Depression', 'Obesity', 'Sinusitis', 'Fatigue'],
    contraindications: ['Pregnancy', 'Heart disease', 'High blood pressure', 'Epilepsy', 'Hernia', 'Menstruation'],
    duration: '3-5 minutes (in rounds)', repetitions: '3-5 rounds', bestTime: 'Morning',
    chakra: 'Manipura + Anahata', technique: 'Rapid forceful inhalations and exhalations' },

  { name: 'Ujjayi', english: 'Ocean Breath / Victorious Breath', sanskrit: 'उज्जायी', category: 'Pranayama', difficulty: 'Beginner',
    benefits: ['Calms mind', 'Slows breath', 'Builds heat', 'Improves focus', 'Reduces anxiety'],
    indications: ['Anxiety', 'Insomnia', 'Thyroid', 'Sinusitis', 'Asthma'],
    contraindications: ['Generally safe'],
    duration: '5-20 minutes', repetitions: 'During asana practice', bestTime: 'Practice time',
    chakra: 'Vishuddha', technique: 'Constrict throat, breathe through nose with ocean sound' },

  { name: 'Bhramari', english: 'Bee Breath', sanskrit: 'भ्रामरी', category: 'Pranayama', difficulty: 'Beginner',
    benefits: ['Calms mind', 'Reduces stress', 'Lowers blood pressure', 'Improves concentration', 'Treats insomnia'],
    indications: ['Anxiety', 'Insomnia', 'Hypertension', 'Migraine', 'Sinusitis', 'Anger'],
    contraindications: ['Pregnancy', 'Ear infections', 'Recent ENT surgery'],
    duration: '5-10 minutes', repetitions: '7-21 rounds', bestTime: 'Evening or before bed',
    chakra: 'Ajna', technique: 'Inhale deeply, exhale making humming bee sound with eyes closed' },

  { name: 'Nadi Shodhana', english: 'Channel Purifying Breath', sanskrit: 'नाडी शोधन', category: 'Pranayama', difficulty: 'Intermediate',
    benefits: ['Calms mind', 'Balances energy', 'Reduces stress', 'Purifies nadis', 'Improves focus'],
    indications: ['Anxiety', 'Insomnia', 'Hypertension', 'Asthma', 'Sinusitis', 'Migraine'],
    contraindications: ['Pregnancy', 'Epilepsy', 'Severe heart conditions'],
    duration: '10-20 minutes', repetitions: 'Daily', bestTime: 'Morning',
    chakra: 'All 7', technique: 'Alternate nostril breathing with retention' },

  { name: 'Sheetali', english: 'Cooling Breath', sanskrit: 'शीतली', category: 'Pranayama', difficulty: 'Beginner',
    benefits: ['Cools body', 'Calms mind', 'Reduces acidity', 'Lowers blood pressure'],
    indications: ['Pitta disorders', 'Acidity', 'Hypertension', 'Anxiety', 'Fever', 'Hot weather'],
    contraindications: ['Cold weather', 'Respiratory issues', 'Low blood pressure'],
    duration: '3-5 minutes', repetitions: '3-4 rounds', bestTime: 'Summer, afternoon',
    chakra: 'Anahata', technique: 'Inhale through rolled tongue, exhale through nose' },

  // Mudras
  { name: 'Gyan Mudra', english: 'Mudra of Knowledge', sanskrit: 'ज्ञान मुद्रा', category: 'Mudra', difficulty: 'Beginner',
    benefits: ['Improves memory', 'Enhances concentration', 'Reduces stress', 'Aids meditation', 'Treats insomnia'],
    indications: ['Memory issues', 'Anxiety', 'Insomnia', 'Meditation', 'Spiritual practice'],
    contraindications: ['Generally safe'],
    duration: '15-45 minutes', repetitions: 'Daily', bestTime: 'Meditation time',
    elements: 'Fire + Ether', chakra: 'Vishuddha + Ajna', technique: 'Touch tip of index finger to thumb tip' },

  { name: 'Prana Mudra', english: 'Mudra of Life Force', sanskrit: 'प्राण मुद्रा', category: 'Mudra', difficulty: 'Beginner',
    benefits: ['Increases energy', 'Boosts immunity', 'Reduces fatigue', 'Improves vision', 'Strengthens nervous system'],
    indications: ['Fatigue', 'Weak immunity', 'Low energy', 'Vision issues', 'Stress'],
    contraindications: ['Generally safe'],
    duration: '15-30 minutes', repetitions: 'Daily', bestTime: 'Morning or afternoon',
    elements: 'Earth + Water', chakra: 'Muladhara + Svadhisthana', technique: 'Touch tips of ring, little, and middle fingers to thumb' },

  { name: 'Apana Mudra', english: 'Mudra of Digestion', sanskrit: 'अपान मुद्रा', category: 'Mudra', difficulty: 'Beginner',
    benefits: ['Aids digestion', 'Aids elimination', 'Treats constipation', 'Helps menstrual issues', 'Detoxifies'],
    indications: ['Constipation', 'Indigestion', 'Piles', 'Menstrual issues', 'Urinary issues'],
    contraindications: ['Pregnancy'],
    duration: '15-45 minutes', repetitions: 'Daily after meals', bestTime: 'After meals',
    elements: 'Earth + Water + Fire', chakra: 'Muladhara + Svadhisthana + Manipura', technique: 'Touch tips of middle, ring, and thumb together' },

  { name: 'Surya Mudra', english: 'Sun Mudra', sanskrit: 'सूर्य मुद्रा', category: 'Mudra', difficulty: 'Beginner',
    benefits: ['Increases metabolism', 'Reduces weight', 'Improves digestion', 'Boosts energy', 'Treats coldness'],
    indications: ['Obesity', 'Low metabolism', 'Cold extremities', 'Hypothyroidism', 'Lethargy'],
    contraindications: ['Pitta disorders', 'Pregnancy', 'Heat exhaustion'],
    duration: '5-15 minutes', repetitions: 'Daily', bestTime: 'Morning',
    elements: 'Fire + Earth', chakra: 'Manipura', technique: 'Fold ring finger to base of thumb, press thumb on it' },

  { name: 'Chandra Mudra', english: 'Moon Mudra', sanskrit: 'चन्द्र मुद्रा', category: 'Mudra', difficulty: 'Beginner',
    benefits: ['Cools body', 'Calms mind', 'Reduces anxiety', 'Aids sleep', 'Balances Pitta'],
    indications: ['Anxiety', 'Insomnia', 'Acidity', 'Pitta disorders', 'Hypertension', 'Hot weather'],
    contraindications: ['Kapha disorders', 'Cold weather', 'Depression'],
    duration: '15-30 minutes', repetitions: 'Daily', bestTime: 'Evening, summer',
    elements: 'Water + Ether', chakra: 'Anahata + Ajna', technique: 'Fold middle finger to base of thumb, press thumb' },

  // Meditation techniques
  { name: 'Transcendental Meditation', english: 'TM', sanskrit: 'ध्यान', category: 'Meditation', difficulty: 'Beginner',
    benefits: ['Deep relaxation', 'Stress reduction', 'Improved focus', 'Better sleep', 'Lower blood pressure', 'Spiritual growth'],
    indications: ['Stress', 'Anxiety', 'Depression', 'Insomnia', 'Hypertension', 'Addiction', 'Chronic pain'],
    contraindications: ['Severe psychiatric conditions (caution)'],
    duration: '15-20 minutes twice daily', repetitions: 'Daily', bestTime: 'Morning and evening',
    technique: 'Silently repeat a mantra' },

  { name: 'Vipassana Meditation', english: 'Insight Meditation', sanskrit: 'विपश्यना', category: 'Meditation', difficulty: 'Intermediate',
    benefits: ['Self-awareness', 'Emotional regulation', 'Reduces suffering', 'Improves concentration', 'Spiritual insight'],
    indications: ['Stress', 'Anxiety', 'Depression', 'Anger', 'Addiction', 'Chronic pain'],
    contraindications: ['Severe mental health issues (with guidance)'],
    duration: '10-60 minutes daily; 10-day retreats', repetitions: 'Daily', bestTime: 'Morning and evening',
    technique: 'Observe body sensations, breath, and mental phenomena with equanimity' },

  { name: 'Yoga Nidra', english: 'Yogic Sleep', sanskrit: 'योग निद्रा', category: 'Meditation', difficulty: 'Beginner',
    benefits: ['Deep relaxation', 'Stress relief', 'Better sleep', 'Reduces anxiety', 'Restores energy'],
    indications: ['Insomnia', 'Anxiety', 'PTSD', 'Chronic stress', 'Pain', 'Fatigue'],
    contraindications: ['Severe depression (with guidance)', 'Psychosis'],
    duration: '20-45 minutes', repetitions: 'Daily', bestTime: 'Afternoon or before bed',
    technique: 'Systematic body scan in savasana with guided awareness' },

  { name: 'Chakra Meditation', english: 'Chakra Dhyana', sanskrit: 'चक्र ध्यान', category: 'Meditation', difficulty: 'Intermediate',
    benefits: ['Energy balance', 'Emotional healing', 'Spiritual awakening', 'Reduces stress', 'Improves intuition'],
    indications: ['Energy blockages', 'Emotional issues', 'Spiritual practice'],
    contraindications: ['Mental health conditions (with guidance)'],
    duration: '20-45 minutes', repetitions: 'Daily', bestTime: 'Morning',
    technique: 'Focus on each of 7 chakras from root to crown' },

  { name: 'Trataka', english: 'Concentrated Gazing', sanskrit: 'त्राटक', category: 'Meditation', difficulty: 'Beginner',
    benefits: ['Improves concentration', 'Strengthens eyes', 'Calms mind', 'Develops willpower', 'Treats insomnia'],
    indications: ['Eye strain', 'Insomnia', 'Anxiety', 'Lack of focus', 'Headache'],
    contraindications: ['Glaucoma', 'Severe eye disorders'],
    duration: '10-30 minutes', repetitions: 'Daily', bestTime: 'Morning or evening',
    technique: 'Steady gazing at a point (candle flame, image) until tears, then close eyes' }
];

function generateYoga() {
  const all = [...yogaAsanas];
  const r = (seed) => {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  };
  const rng = r(33333);
  // Add variations
  yogaAsanas.forEach((a, i) => {
    for (let n = 0; n < 3; n++) {
      all.push({
        ...a,
        id: 'YGA' + String(i * 1000 + n + 1).padStart(6, '0'),
        name: a.name + ' (' + ['Beginner Variation', 'Advanced Variation', 'Therapeutic Variation'][n] + ')'
      });
    }
  });
  return all;
}

module.exports = { generateYoga };

import { ProgramItem, Coach, DaySchedule, ReviewItem, FAQItem } from '../types';

export interface LocationPlan {
  id: string;
  name: string;
  locations: string[];
  price: number;
  period: string;
  sessions: string;
  schedulePattern: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  whatsappMessage: string;
}

export const TRICITY_LOCATIONS = [
  {
    name: 'Chandigarh',
    tier: 'Zone 1',
    price: '₹13,000/mo',
    description: 'Sectors 1 to 70, IT Park, & Central Hubs',
    highlight: 'Doorstep & Studio Training',
  },
  {
    name: 'Mohali',
    tier: 'Zone 1',
    price: '₹13,000/mo',
    description: 'Phase 1 to 11, Sector 68–82 & Aerocity Belt',
    highlight: 'Elite Combat & Conditioning',
  },
  {
    name: 'Kharar',
    tier: 'Zone 1',
    price: '₹13,000/mo',
    description: 'Sunny Enclave, Kharar Highway & Greater Mohali',
    highlight: 'Flexible Hourly Slots',
  },
  {
    name: 'Zirakpur',
    tier: 'Zone 2',
    price: '₹15,000/mo',
    description: 'VIP Road, PR7 Airport Road & Dhakoli',
    highlight: 'Personalized Conditioning',
  },
  {
    name: 'Panchkula',
    tier: 'Zone 2',
    price: '₹15,000/mo',
    description: 'Sectors 1 to 21, MDC & Industrial Area',
    highlight: 'Doorstep & Studio Training',
  },
  {
    name: 'New Chandigarh',
    tier: 'Zone 2',
    price: '₹15,000/mo',
    description: 'Mullanpur, Medicity, Omaxe & Eco City',
    highlight: 'Premium 1-on-1 Sessions',
  },
];

export const PRICING_PLANS: LocationPlan[] = [
  {
    id: 'plan-zone-1',
    name: 'Chandigarh · Mohali · Kharar',
    locations: ['Chandigarh', 'Mohali', 'Kharar'],
    price: 13000,
    period: 'per month',
    sessions: '16 High-Impact Sessions',
    schedulePattern: 'Alternate Days Schedule (Proper Recovery & Peak Performance)',
    popular: true,
    badge: 'MOST POPULAR · ZONE 1',
    features: [
      'Total 16 Sessions / Month on alternate days',
      'Timings: 6:30 AM to 10:30 PM continuous hourly format',
      '30-minute rest & hygiene gap between sessions',
      'Pick & lock your preferred hourly time slot',
      'Choice of MMA, Boxing, Kickboxing, or Self Defence',
      'Doorstep trainer visits & fully equipped studio options',
      'Direct WhatsApp priority support & query clearance',
    ],
    whatsappMessage: 'Hello MMA Trainers! I want to enroll in the Monthly Training Plan for Chandigarh, Mohali & Kharar (₹13,000/month - 16 sessions). Please let me know available slots.',
  },
  {
    id: 'plan-zone-2',
    name: 'Zirakpur · Panchkula · New Chandigarh',
    locations: ['Zirakpur', 'Panchkula', 'New Chandigarh'],
    price: 15000,
    period: 'per month',
    sessions: '16 High-Impact Sessions',
    schedulePattern: 'Alternate Days Schedule (Proper Recovery & Peak Performance)',
    badge: 'ZONE 2 ELITE',
    features: [
      'Total 16 Sessions / Month on alternate days',
      'Full coverage in Zirakpur, Panchkula & New Chandigarh (Mullanpur)',
      'Continuous 6:30 AM to 10:30 PM hourly slots',
      '30-minute rest buffer for personalized attention',
      'Customized combat conditioning + strength mechanics',
      'Doorstep 1-on-1 elite training with certified masters',
      'Direct WhatsApp support & flexible rescheduling',
    ],
    whatsappMessage: 'Hello MMA Trainers! I want to enroll in the Monthly Training Plan for Zirakpur, Panchkula & New Chandigarh (₹15,000/month - 16 sessions). Please share slot options.',
  },
  {
    id: 'plan-elder-fitness',
    name: 'Elder Age Fitness Training',
    locations: ['All Tricity Locations'],
    price: 15000,
    period: 'per month',
    sessions: '16 Dedicated Wellness Sessions',
    schedulePattern: 'Alternate Days (Gentle Progression & Full Joint Recovery)',
    badge: 'SPECIALIZED SENIOR WELLNESS',
    features: [
      'Vishesh roop se designed for elderly & senior clients',
      'Total 16 Sessions / Month on alternate days',
      'Focus on joint mobility, bone density & functional core',
      'Fall prevention, balance conditioning & posture correction',
      'Gentle cardiovascular drills adapted to health conditions',
      'Continuous 6:30 AM – 10:30 PM flexible home/studio slots',
      '30-minute rest buffer ensures zero fatigue & safe pacing',
    ],
    whatsappMessage: 'Hello MMA Trainers! I would like to inquire about the Elder Age Fitness Training package (₹15,000/month - 16 sessions) for senior wellness. Please guide me.',
  },
  {
    id: 'plan-family-group',
    name: 'Family Group Plan (4 Members)',
    locations: ['All Tricity Locations'],
    price: 20000,
    period: 'per month',
    sessions: '16 Group Training Sessions',
    schedulePattern: 'Alternate Days (Train Together, Recover Together)',
    badge: 'BEST FAMILY VALUE (4 PERSONS)',
    features: [
      'Covers up to 4 family members in a single group (Only ₹5,000/person)',
      'Total 16 Sessions / Month on alternate days',
      'Bond over MMA, Boxing, Kickboxing, or Practical Self Defence',
      'Hourly slots between 6:30 AM and 10:30 PM',
      '30-minute gap ensures custom focus for each family member',
      'Available at your home terrace/lawn or at our facility',
      'Direct WhatsApp priority booking & group scheduling',
    ],
    whatsappMessage: 'Hello MMA Trainers! I want to book the Family Plan for 4 members (₹20,000/month - 16 sessions). Please share the batch timings.',
  },
];

export const TRIAL_SESSION_OFFER = {
  title: 'Exclusive Trial Session',
  price: 999,
  badge: 'ENTRY-LEVEL TESTING & CONSULTATION',
  subtitle: '₹999 Only · 100% Focused 1-on-1 Assessment',
  description:
    'Har naye athlete ya fitness enthusiast ke liye entry-level testing aur comprehensive consultation ke taht humara exclusive Trial Session ₹999 mein uplabdh hai.',
  features: [
    'Complete biomechanical & functional movement assessment',
    'Combat readiness & baseline endurance testing',
    '1-on-1 personalized consultation with our Head Coach',
    'Customized 1-month fitness & combat training roadmap',
    'Slot availability & batch alignment across Tricity',
    'Equipment provided for trial (gloves, wraps, pads)',
  ],
  whatsappMessage: 'Hello MMA Trainers! I want to book the Exclusive Trial Session @ ₹999 for entry-level testing and consultation. Please confirm slot availability.',
};

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'mma',
    title: 'Mixed Martial Arts (MMA)',
    ages: 'TEENS & ADULTS (14+)',
    level: 'BEGINNER TO ADVANCED',
    categoryTag: 'COMPLETE COMBAT SYSTEM',
    description:
      'Combine striking, wrestling takedowns, and ground grappling into a seamless, adaptable combat skill set designed for modern sport and real-world dominance.',
    benefits: [
      'Complete combat integration: striking, clinch, and ground control',
      'Unmatched functional cardiovascular endurance and explosive power',
      '16 sessions/mo alternate days for peak combat adaptation',
      'Continuous 6:30 AM – 10:30 PM hourly slots with 30-min rest buffers',
    ],
    scheduleFreq: '16 Sessions / Mo (Alternate Days)',
    price: 'From ₹13,000/mo · Trial @ ₹999',
    imageAlt: 'MMA fighter training cage work with coach',
    iconType: 'mma',
  },
  {
    id: 'boxing',
    title: 'Boxing',
    ages: 'ALL AGES (12+)',
    level: 'BEGINNER TO PRO',
    categoryTag: 'STRIKING & FOOTWORK',
    description:
      'Master the sweet science. Sharpen hand speed, head movement, devastating punch mechanics, and evasive ring footwork with certified combat instructors.',
    benefits: [
      'Master kinetic power punching, combinations, and slip counters',
      'High-calorie burn and rapid cardiovascular conditioning',
      'Sharpen reflexes, hand-eye coordination, and mental focus',
      'Hourly personal slots available from 6:30 AM to 10:30 PM',
    ],
    scheduleFreq: '16 Sessions / Mo (Alternate Days)',
    price: 'From ₹13,000/mo · Trial @ ₹999',
    imageAlt: 'Boxer throwing powerful combination on focus pads',
    iconType: 'boxing',
  },
  {
    id: 'kickboxing',
    title: 'Kickboxing',
    ages: 'TEENS & ADULTS',
    level: 'ALL FITNESS LEVELS',
    categoryTag: 'STRIKING & CONDITIONING',
    description:
      'High-energy kickboxing and Muay Thai combining punches, heavy low and high kicks, knee strikes, and high-intensity metabolic conditioning.',
    benefits: [
      'Full-body conditioning targeting core, legs, and upper body',
      'Develop blistering kicking power and dynamic hip mobility',
      'Intense stress relief with technical pad work and drills',
      '16 alternate-day sessions ensure deep muscle recovery',
    ],
    scheduleFreq: '16 Sessions / Mo (Alternate Days)',
    price: 'From ₹13,000/mo · Trial @ ₹999',
    imageAlt: 'Kickboxer landing clean roundhouse kick on pads',
    iconType: 'kickboxing',
  },
  {
    id: 'self-defence',
    title: 'Practical Self Defence',
    ages: 'WOMEN, MEN & YOUTH',
    level: 'NO EXPERIENCE NEEDED',
    categoryTag: 'REAL-WORLD PROTECTION',
    description:
      'Battle-tested defensive maneuvers, escape mechanics, situational threat awareness, and leverage techniques to protect yourself and your loved ones in any real-world scenario.',
    benefits: [
      'Practical escapes from grabs, holds, chokes, and cornering',
      'Technique and leverage over raw physical size or strength',
      'Build unshakeable confidence, situational awareness, and poise under stress',
      'Doorstep personal sessions across Chandigarh, Mohali, Kharar & Panchkula',
    ],
    scheduleFreq: '16 Sessions / Mo (Alternate Days)',
    price: 'From ₹13,000/mo · Trial @ ₹999',
    imageAlt: 'Practical self defence instructor demonstrating escape techniques',
    iconType: 'self-defence',
  },
  {
    id: 'elder-fitness',
    title: 'Elder Age Fitness Training',
    ages: 'SENIORS (50+ / 60+ / 70+)',
    level: 'CUSTOM GENTLE PROGRESSION',
    categoryTag: 'MOBILITY & WELLNESS',
    description:
      'Vishesh roop se design ki gayi elder age conditioning. Dedicated gentle functional training tailored to restore joint mobility, balance, core stability, and vibrant everyday vitality.',
    benefits: [
      'Specialized low-impact functional mobility and joint preservation',
      'Fall prevention, balance drills, and improved posture alignment',
      'Rebuild lean muscle mass, cardiovascular health, and bone density',
      '1-on-1 attentive coaching with 30-min buffer gaps for complete safety',
    ],
    scheduleFreq: '16 Sessions / Mo (Alternate Days)',
    price: 'Dedicated Package: ₹15,000/mo',
    imageAlt: 'Senior woman performing guided balance exercises with coach',
    iconType: 'elder',
  },
];

export const COACHES: Coach[] = [
  {
    id: 'coach-vikram',
    name: 'Vikram "The Iron" Rathore',
    role: 'Head Combat & MMA Director',
    discipline: 'MMA & BOXING',
    specialty: 'Fight IQ, Striking Power & Fight Conditioning',
    credentials: [
      'National Wushu & Kickboxing Gold Medalist',
      'Professional MMA Competitor (7-1 Record)',
      '12+ Years Coaching Across Tricity & North India',
    ],
    bio: 'Vikram leads our combat programs across Chandigarh and Mohali. He specializes in breaking down complex striking mechanics, wrestling transitions, and fight stamina for beginners and advanced fighters alike.',
    photoAlt: 'Head Coach Vikram Rathore wrapping hands for MMA session',
  },
  {
    id: 'coach-simran',
    name: 'Simranjeet Kaur',
    role: 'Self Defence & Kickboxing Specialist',
    discipline: 'SELF DEFENCE & KICKBOXING',
    specialty: 'Practical Escapes, Agility & Core Power',
    credentials: [
      'Black Belt 3rd Dan Taekwondo & Krav Maga Certified',
      'Trained 2,000+ Women & Youth in Practical Street Defence',
      'Former State Boxing Champion',
    ],
    bio: 'Simran empowers clients with instinctive, real-world defensive counters and high-octane kickboxing pad work. Her energetic teaching style builds real confidence without intimidation.',
    photoAlt: 'Coach Simranjeet Kaur holding kick pads',
  },
  {
    id: 'coach-arjun',
    name: 'Dr. Arjun Mehta',
    role: 'Senior Conditioning & Elder Wellness Director',
    discipline: 'FUNCTIONAL FITNESS & ELDER MOBILITY',
    specialty: 'Joint Rehabilitation, Balance & Longevity',
    credentials: [
      'Master of Physiotherapy & CSCS Certified Conditioning Specialist',
      '10+ Years Dedicated to Senior Functional Longevity',
      'Certified Clinical Exercise Specialist',
    ],
    bio: 'Arjun designs our specialized Elder Age Fitness training. He ensures every senior athlete trains with absolute medical safety, restoring pain-free movement, balance, and youthful vigor.',
    photoAlt: 'Dr. Arjun Mehta assisting senior client on balance board',
  },
];

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 'BATCH TIMINGS (6:30 AM - 10:30 PM)',
    slots: [
      { time: '06:30 AM – 07:30 AM', name: 'Early Bird Combat & Conditioning', category: 'boxing', tag: 'SLOT 1', level: 'All Levels (30m Rest Gap)' },
      { time: '08:00 AM – 09:00 AM', name: 'Boxing & Kickboxing Fundamentals', category: 'kickboxing', tag: 'SLOT 2', level: 'Beginner / Intermediate' },
      { time: '09:30 AM – 10:30 AM', name: 'Elder Age Functional Wellness & Mobility', category: 'elder', tag: 'SLOT 3', level: 'Seniors / Gentle' },
      { time: '11:00 AM – 12:00 PM', name: 'Practical Self Defence & Situational Escapes', category: 'self-defence', tag: 'SLOT 4', level: 'Women & Adults' },
      { time: '04:00 PM – 05:00 PM', name: 'MMA Striking & Takedown Mechanics', category: 'mma', tag: 'SLOT 5', level: 'Teens & Adults' },
      { time: '05:30 PM – 06:30 PM', name: 'High-Energy Kickboxing & Core Power', category: 'kickboxing', tag: 'SLOT 6', level: 'Conditioning' },
      { time: '07:00 PM – 08:00 PM', name: 'Prime Time MMA & Boxing Rounds', category: 'mma', tag: 'SLOT 7', level: 'All Levels' },
      { time: '08:30 PM – 09:30 PM', name: 'Executive Combat & Stress Release', category: 'boxing', tag: 'SLOT 8', level: 'Busy Professionals' },
      { time: '09:30 PM – 10:30 PM', name: 'Late Night Pad Work & Sparring Drills', category: 'striking', tag: 'SLOT 9', level: 'Dedicated Athlets' },
    ],
  },
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    type: 'review',
    author: 'Harpreet Singh',
    role: 'IT Consultant · Sector 70, Mohali',
    text: 'Training alternate days with 16 sessions a month was the best decision for my work-life balance. The 7:00 AM slot fits right before my office hours, and the coach comes right on time. My stamina and punching power have transformed!',
  },
  {
    id: 'rev-2',
    type: 'review',
    author: 'Suman & Gurpreet Batra',
    role: 'Family Plan Members · Sector 15, Chandigarh',
    text: 'We took the 4-member Family Plan for ₹20,000. It is incredible value! My two kids, my husband and I train kickboxing and self-defence together. It has become our favorite family bonding activity.',
  },
  {
    id: 'rev-3-featured',
    type: 'review',
    featured: true,
    author: 'Col. R.K. Sharma (Retd., 67 yrs)',
    role: 'Elder Age Fitness Member · Panchkula',
    text: 'The Elder Age Fitness program is truly thoughtfully designed. Coach Arjun monitors my knee joints and blood pressure carefully. In just 2 months my balance and morning stiffness have improved drastically.',
  },
  {
    id: 'rev-4',
    type: 'review',
    author: 'Aakriti Mahajan',
    role: 'Architect · Zirakpur (VIP Road)',
    text: 'Started with the ₹999 trial session which gave me a thorough fitness assessment. The practical self defence techniques are so realistic and easy to retain. Highly recommend everyone in Tricity to give it a try!',
  },
  {
    id: 'rev-5',
    type: 'review',
    author: 'Jatinder Dhillon',
    role: 'Business Owner · Kharar',
    text: 'The 16-session alternate day format is pure science. In traditional gyms I used to get burned out in two weeks. Here, the 30-minute rest buffer and alternate recovery days keep my energy soaring all month.',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Tricity ke kin-kin shehro mein aapki training uplabdh hai?',
    answer: 'Hum Chandigarh, Mohali, Kharar, Zirakpur, Panchkula aur New Chandigarh (Mullanpur) mein elite-level doorstep personal training aur high-grade studio sessions deliver karte hain. Humare certified trainers aapki convenience ke mutabiq aapke location par pahunchte hain.',
  },
  {
    id: 'faq-2',
    question: 'Trial Session ki kya cost hai aur isme kya shamil hai?',
    answer: 'Har naye athlete ya fitness enthusiast ke liye humara exclusive Trial Session ₹999 mein uplabdh hai. Isme complete entry-level testing, movement screening, baseline stamina assessment, aur Head Coach ke sath 1-on-1 personalized fitness & training roadmap consultation provide ki jaati hai.',
  },
  {
    id: 'faq-3',
    question: '1 Month training plan mein kitne sessions milte hain aur schedule kya rehta hai?',
    answer: 'Regular one-month training plan ke antargat total 16 sessions provide kiye jaate hain jo pure mahine alternate days (e.g. Monday-Wednesday-Friday ya Tuesday-Thursday-Saturday) par chalte hain. Yeh schedule scientific roop se muscle recovery aur peak combat performance dono ensure karne ke liye design kiya gaya hai.',
  },
  {
    id: 'faq-4',
    question: 'Training timings aur slot booking ka format kya hai?',
    answer: 'Training timings subah 6:30 AM se lekar raat 10:30 PM tak continuous hourly format mein chalte hain. Har session ke baad 30 minutes ka rest & sanitization gap diya jata hai, taaki client ko complete focused attention mile. Client apni subhidha anusaar apna preferred timing slot book kar sakta hai.',
  },
  {
    id: 'faq-5',
    question: 'Location ke hisab se monthly fees structure kya hai?',
    answer: 'Chandigarh, Mohali aur Kharar ke liye fees ₹13,000 per month hai (Zone 1). Jabki Zirakpur, Panchkula aur New Chandigarh ke liye monthly package ₹15,000 hai (Zone 2). Dono packages mein 16 intense 1-on-1 sessions alternate days par diye jaate hain.',
  },
  {
    id: 'faq-6',
    question: 'Elder Age Fitness Training aur Family Plan ke baare mein batayein?',
    answer: 'Elderly clients ke liye dedicated wellness package ₹15,000 per month mein uplabdh hai, jisme joint mobility, balance, fall prevention aur vitality conditioning vishesh roop se plan ki jaati hai. Wahi char logo ke pure group ke liye humara Family Plan ₹20,000 per month mein available hai (keval ₹5,000 per person).',
  },
  {
    id: 'faq-7',
    question: 'Direct WhatsApp support se kaise jud sakte hain?',
    answer: 'Direct support, query clearance aur immediate slot reservation ke liye website par direct WhatsApp button integrate kiya gaya hai. Aap kisi bhi time ek tap par Head Coach se baat kar sakte hain ya apna slot confirm kar sakte hain.',
  },
];

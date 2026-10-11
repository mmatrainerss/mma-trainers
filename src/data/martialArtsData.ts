import { ProgramItem, Coach, DaySchedule, ReviewItem, FAQItem } from '../types';

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'kids',
    title: 'Kids Martial Arts',
    ages: 'AGES 5–12',
    level: 'ALL LEVELS',
    categoryTag: 'YOUTH DEVELOPMENT',
    description: 'Safe, structured classes that help children improve focus, confidence, coordination and basic self-defense skills.',
    benefits: [
      'Build confidence and self-esteem',
      'Improve focus and discipline at school & home',
      'Develop balance, body awareness, and coordination'
    ],
    scheduleFreq: '3 Classes / Week',
    price: '$125/mo',
    imageAlt: 'Kids martial arts training session with instructor',
    iconType: 'kids'
  },
  {
    id: 'bjj',
    title: 'Brazilian Jiu-Jitsu',
    ages: 'TEENS & ADULTS',
    level: 'BEGINNER TO ADVANCED',
    categoryTag: 'GI AND NO-GI',
    description: 'Learn how to control positions, escape safely and use leverage through practical ground-based training.',
    benefits: [
      'Technique over raw physical strength',
      'Better body control, mobility and fluid movement',
      'Improve real-time problem-solving under pressure'
    ],
    scheduleFreq: '3 Classes / Week',
    price: '$179/mo',
    imageAlt: 'Brazilian Jiu-Jitsu sparring and technique execution',
    iconType: 'bjj'
  },
  {
    id: 'muay-thai',
    title: 'Muay Thai & Kickboxing',
    ages: 'TEENS & ADULTS',
    level: 'ALL FITNESS LEVELS',
    categoryTag: 'STRIKING AND CONDITIONING',
    description: 'Learn effective punches, kicks, knees, and footwork while improving conditioning through energetic pad work and controlled partner drills.',
    benefits: [
      'High-energy full-body conditioning and stamina',
      'Sharpen timing, reflexes and offensive/defensive footwork'
    ],
    scheduleFreq: '3 Classes / Week',
    price: '$179/mo',
    imageAlt: 'Muay Thai fighter training on Thai pads with coach',
    iconType: 'striking'
  },
  {
    id: 'mma',
    title: 'Mixed Martial Arts',
    ages: 'ADULTS (16+)',
    level: 'BEGINNER TRACK AVAILABLE',
    categoryTag: 'STRIKING AND GRAPPLING',
    description: 'Combine striking, wrestling and ground techniques to build a complete and adaptable martial arts skill set for sport or self-defense.',
    benefits: [
      'Complete all-round combat training system',
      'Seamlessly adapt at long, clinch, and ground ranges',
      'Improve cardiovascular endurance, grip, and functional power'
    ],
    scheduleFreq: '3 Classes / Week',
    price: '$179/mo',
    imageAlt: 'MMA training in cage setting with coach supervision',
    iconType: 'mma'
  }
];

export const COACHES: Coach[] = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    role: 'Head Brazilian Jiu-Jitsu Coach',
    discipline: 'BRAZILIAN JIU-JITSU',
    specialty: 'Gi / No-Gi & Positional Control',
    credentials: [
      '2nd Degree Brazilian Jiu-Jitsu Black Belt',
      'IBJJF Open Gold Medalist',
      '14+ Years of Dedicated Coaching Experience'
    ],
    bio: 'Alex has trained and competed in Brazilian Jiu-Jitsu for more than 18 years. He teaches clear fundamentals, positional control and safe progression for beginners and experienced students alike.',
    photoAlt: 'Coach Alex Rivera in BJJ Gi'
  },
  {
    id: 'marcus-lee',
    name: 'Marcus Lee',
    role: 'Muay Thai and MMA Coach',
    discipline: 'MUAY THAI & MMA',
    specialty: 'Striking & Fight IQ',
    credentials: [
      '32 Professional Combat Fights',
      'Former Professional Muay Thai Competitor',
      'Regional Championship Winner'
    ],
    bio: 'Marcus combines professional competition experience with a practical, methodical coaching style. His classes focus on clean striking mechanics, conditioning and controlled partner training.',
    photoAlt: 'Coach Marcus Lee with boxing gloves'
  },
  {
    id: 'olivia-brooks',
    name: 'Olivia Brooks',
    role: 'Kids Program Director',
    discipline: 'KIDS MARTIAL ARTS',
    specialty: 'Youth Motor Skills & Character Development',
    credentials: [
      '4th Dan Taekwondo Black Belt',
      'Certified Youth Martial Arts Instructor',
      '10+ Years Teaching Children & Teens'
    ],
    bio: 'Olivia specializes in teaching children through structured, age-appropriate classes. She helps students improve focus, coordination, confidence and respect both on and off the mat.',
    photoAlt: 'Coach Olivia Brooks mentoring youth students'
  }
];

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 'MONDAY',
    slots: [
      { time: '4:00 PM', name: 'Kids Martial Arts', category: 'kids', tag: 'KIDS', level: 'Ages 5–12' },
      { time: '5:00 PM', name: 'BJJ Fundamentals', category: 'bjj', tag: 'BJJ', level: 'All Levels' },
      { time: '6:15 PM', name: 'Muay Thai Beginner', category: 'striking', tag: 'STRIKING', level: 'Beginner' },
      { time: '7:30 PM', name: 'BJJ Gi', category: 'bjj', tag: 'BJJ', level: 'Intermediate' }
    ]
  },
  {
    day: 'TUESDAY',
    slots: [
      { time: '4:00 PM', name: 'Kids Martial Arts', category: 'kids', tag: 'KIDS', level: 'Ages 5–12' },
      { time: '5:00 PM', name: 'MMA Fundamentals', category: 'mma', tag: 'MMA', level: 'Beginner Track' },
      { time: '6:15 PM', name: 'Muay Thai & Kickboxing', category: 'striking', tag: 'STRIKING', level: 'All Levels' },
      { time: '7:30 PM', name: 'BJJ No-Gi', category: 'bjj', tag: 'BJJ', level: 'All Levels' }
    ]
  },
  {
    day: 'WEDNESDAY',
    slots: [
      { time: '4:00 PM', name: 'Kids Martial Arts', category: 'kids', tag: 'KIDS', level: 'Ages 5–12' },
      { time: '5:00 PM', name: 'BJJ Fundamentals', category: 'bjj', tag: 'BJJ', level: 'Fundamentals' },
      { time: '6:15 PM', name: 'MMA Striking', category: 'mma', tag: 'MMA', level: 'Intermediate' },
      { time: '7:30 PM', name: 'BJJ Gi', category: 'bjj', tag: 'BJJ', level: 'All Levels' }
    ]
  },
  {
    day: 'THURSDAY',
    slots: [
      { time: '4:00 PM', name: 'Kids Martial Arts', category: 'kids', tag: 'KIDS', level: 'Ages 5–12' },
      { time: '5:00 PM', name: 'Muay Thai Beginner', category: 'striking', tag: 'STRIKING', level: 'Beginner' },
      { time: '6:15 PM', name: 'MMA Fundamentals', category: 'mma', tag: 'MMA', level: 'Beginner Track' },
      { time: '7:30 PM', name: 'BJJ No-Gi', category: 'bjj', tag: 'BJJ', level: 'All Levels' }
    ]
  },
  {
    day: 'FRIDAY',
    slots: [
      { time: '4:00 PM', name: 'Kids Martial Arts', category: 'kids', tag: 'KIDS', level: 'Ages 5–12' },
      { time: '5:00 PM', name: 'BJJ Fundamentals', category: 'bjj', tag: 'BJJ', level: 'All Levels' },
      { time: '6:15 PM', name: 'Muay Thai & Kickboxing', category: 'striking', tag: 'STRIKING', level: 'Conditioning' },
      { time: '7:30 PM', name: 'Open Mat', category: 'open', tag: 'OPEN', level: 'Supervised Sparring' }
    ]
  },
  {
    day: 'SATURDAY',
    slots: [
      { time: '9:00 AM', name: 'Kids Martial Arts', category: 'kids', tag: 'KIDS', level: 'Ages 5–12' },
      { time: '10:00 AM', name: 'BJJ Open Mat', category: 'open', tag: 'OPEN', level: 'All Belts' },
      { time: '11:30 AM', name: 'Muay Thai & Kickboxing', category: 'striking', tag: 'STRIKING', level: 'Technical Sparring' },
      { time: '1:00 PM', name: 'MMA Striking', category: 'mma', tag: 'MMA', level: 'Advanced Drills' }
    ]
  },
  {
    day: 'SUNDAY',
    isClosed: true,
    slots: [
      { time: 'CLOSED', name: 'Rest & Facility Deep Clean', category: 'closed', tag: 'CLOSED', level: 'Special events & seminars announced monthly' }
    ]
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    type: 'review',
    author: 'Amanda R.',
    role: 'Parent of Kids Program Member',
    text: 'My son looks forward to every class. The coaches are patient, clear and great with beginners. His confidence and focus at school have improved noticeably.',
  },
  {
    id: 'rev-img-1',
    type: 'image',
    imageAlt: 'Kids martial arts training on clean mats',
    aspect: 'aspect-square'
  },
  {
    id: 'rev-2',
    type: 'review',
    author: 'Nathan R.',
    role: 'Muay Thai & Kickboxing Member',
    text: 'The coaches always explain what we are doing and keep everyone safe while pushing conditioning. The community here is ego-free and welcoming.',
  },
  {
    id: 'rev-3-featured',
    type: 'review',
    featured: true,
    author: 'Sarah M.',
    role: 'BJJ Member',
    text: 'From the first class, I felt welcomed, supported and confident that I had found the right place to train.',
  },
  {
    id: 'rev-img-2',
    type: 'image',
    imageAlt: 'Two smiling martial artists with gi belts',
    aspect: 'aspect-[4/5]'
  },
  {
    id: 'rev-4',
    type: 'review',
    author: 'Daniel T.',
    role: 'Muay Thai & Kickboxing Member',
    text: 'The coaches explain each technique clearly and make every session feel focused and productive. It has become the best hour of my day.',
  },
  {
    id: 'rev-img-3',
    type: 'image',
    imageAlt: 'Athletes drilling combinations with focus mitts',
    aspect: 'aspect-video'
  },
  {
    id: 'rev-5',
    type: 'review',
    author: 'Chris M.',
    role: 'Brazilian Jiu-Jitsu Member',
    text: 'I joined with no BJJ experience and felt comfortable from the first class. The training is clear and well structured. No meathead culture here.',
  },
  {
    id: 'rev-6',
    type: 'review',
    author: 'Michael K.',
    role: 'MMA Member',
    text: 'I can train after work, improve at my own pace and always know what to focus on next. Coaches take time to answer technical questions thoroughly.',
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Do I need a lot of space or equipment at home?',
    answer: 'Not at all. For online sessions, you only need enough space to lay down a yoga mat. For boxing or MMA fundamentals, no equipment is required initially, though light dumbbells or resistance bands can be added later.'
  },
  {
    id: 'faq-2',
    question: 'How do the online sessions work?',
    answer: 'We use high-quality video conferencing. Your certified coach will train with you live, correcting your form, pushing your cardio, and ensuring you get a gym-quality workout in your living room.'
  },
  {
    id: 'faq-3',
    question: 'Are the diet plans customized for me?',
    answer: 'Yes. Every diet plan is built around your specific weight loss goals, food preferences, and daily schedule. We calculate your macros and provide sustainable meal options.'
  },
  {
    id: 'faq-4',
    question: 'What if I travel frequently for work?',
    answer: 'Our online coaching model is perfect for travelers. You can join your 1-on-1 sessions from any hotel room, and your diet plan can be adapted for eating out or traveling.'
  },
  {
    id: 'faq-5',
    question: 'Can I do a mix of online and offline sessions?',
    answer: 'Absolutely. We offer hybrid packages so you can do heavy pad work and sparring in-person, while handling your conditioning and technical drills online when you are short on time.'
  },
  {
    id: 'faq-6',
    question: 'Do I need martial arts experience?',
    answer: 'Zero experience is required. Our coaches specialize in breaking down complex combat sports mechanics into easy, beginner-friendly workouts that burn fat and build confidence.'
  },
  {
    id: 'faq-7',
    question: 'How do I track my weight loss progress?',
    answer: 'Your coach will check in with you weekly. We track your weight, body measurements, and energy levels, adjusting your diet and workout intensity to ensure you never hit a plateau.'
  }
];

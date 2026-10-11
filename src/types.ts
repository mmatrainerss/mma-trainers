export interface ProgramItem {
  id: string;
  title: string;
  ages: string;
  level: string;
  categoryTag: string;
  description: string;
  benefits: string[];
  scheduleFreq: string;
  price: string;
  imageAlt: string;
  iconType: 'kids' | 'bjj' | 'striking' | 'mma';
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  discipline: string;
  credentials: string[];
  bio: string;
  photoAlt: string;
  specialty: string;
}

export interface ScheduleSlot {
  time: string;
  name: string;
  category: 'kids' | 'bjj' | 'striking' | 'mma' | 'open' | 'closed';
  tag?: string;
  instructor?: string;
  level?: string;
}

export interface DaySchedule {
  day: string;
  slots: ScheduleSlot[];
  isClosed?: boolean;
}

export interface ReviewItem {
  id: string;
  type: 'review' | 'image';
  author?: string;
  role?: string;
  text?: string;
  imageAlt?: string;
  aspect?: string;
  featured?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

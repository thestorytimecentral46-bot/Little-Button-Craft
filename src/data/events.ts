import { addDays, setHours, setMinutes, startOfToday } from 'date-fns';

export type EventCategory = 'Class' | 'Social' | 'Special Event';

export interface CraftEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  time: string;
  location: string;
  category: EventCategory;
  description: string;
  image: string;
  instructor?: string;
  spotsLeft?: number;
}

const today = startOfToday();

export const initialEvents: CraftEvent[] = [
  {
    id: '1',
    title: 'Fiber Night',
    date: setHours(setMinutes(addDays(today, 2), 30), 18),
    time: '6:30 PM - 8:30 PM',
    location: 'Little Button Craft',
    category: 'Social',
    description: 'Bring your knitting, crochet, embroidery, or any other fiber craft and hang out with fellow crafters! All skill levels welcome. No registration required.',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'Sewing 101: Class 1 of 3',
    date: setHours(setMinutes(addDays(today, 5), 0), 18),
    time: '6:00 PM - 8:00 PM',
    location: 'Little Button Craft',
    category: 'Class',
    description: 'Learn the basics of using a sewing machine in this comprehensive 3-part series. We will cover threading, basic stitches, and complete a simple tote bag project.',
    image: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?auto=format&fit=crop&q=80&w=800',
    instructor: 'Sarah Jenkins',
    spotsLeft: 3,
  },
  {
    id: '3',
    title: 'Speed Friending at Brownhound Downtown',
    date: setHours(setMinutes(addDays(today, 7), 0), 19),
    time: '7:00 PM - 9:00 PM',
    location: 'Brownhound Downtown',
    category: 'Social',
    description: 'Looking to meet new creative friends? Join us for a structured, low-pressure evening of speed friending. Ticket includes one beverage.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '4',
    title: 'Knit For Food: Knit-a-thon',
    date: setHours(setMinutes(addDays(today, 14), 0), 10),
    endDate: setHours(setMinutes(addDays(today, 14), 0), 22),
    time: '10:00 AM - 10:00 PM',
    location: 'Little Button Craft',
    category: 'Special Event',
    description: 'Join us for a 12-hour knitting marathon to raise funds for local food banks. Drop in for an hour or stay all day! Snacks and coffee provided.',
    image: 'https://images.unsplash.com/photo-1605235904827-2b81d8520ce1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '5',
    title: 'Intro to Granny Squares',
    date: setHours(setMinutes(addDays(today, 18), 0), 13),
    time: '1:00 PM - 3:30 PM',
    location: 'Little Button Craft',
    category: 'Class',
    description: 'Learn the classic crochet granny square! Perfect for beginners who know how to chain and double crochet. Materials included.',
    image: 'https://images.unsplash.com/photo-1628339591490-44931a74d227?auto=format&fit=crop&q=80&w=800',
    instructor: 'Mia Rodriguez',
    spotsLeft: 6,
  },
  {
    id: '6',
    title: 'Beginner Needle Felting: Mushroom House',
    date: setHours(setMinutes(addDays(today, 21), 0), 14),
    time: '2:00 PM - 5:00 PM',
    location: 'Little Button Craft',
    category: 'Class',
    description: 'Discover the magic of needle felting! You will learn how to sculpt wool roving into a charming miniature mushroom house. All supplies provided.',
    image: 'https://images.unsplash.com/photo-1615800002234-118859188a18?auto=format&fit=crop&q=80&w=800',
    instructor: 'Elena Woods',
    spotsLeft: 2,
  },
  {
    id: '7',
    title: 'Clothing Swap at Abundance Co Op',
    date: setHours(setMinutes(addDays(today, 25), 0), 11),
    time: '11:00 AM - 2:00 PM',
    location: 'Abundance Co Op',
    category: 'Special Event',
    description: 'Refresh your wardrobe sustainably! Bring gently used clothing, shoes, and accessories to swap. Leftovers will be donated to a local shelter.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '8',
    title: 'Embroidery Basics',
    date: setHours(setMinutes(addDays(today, 28), 30), 17),
    time: '5:30 PM - 8:00 PM',
    location: 'ArtisanWorks',
    category: 'Class',
    description: 'Learn 5 fundamental embroidery stitches while creating a beautiful botanical hoop art piece. Perfect for absolute beginners.',
    image: 'https://images.unsplash.com/photo-1610448721566-47369c768e70?auto=format&fit=crop&q=80&w=800',
    instructor: 'Lily Chen',
    spotsLeft: 8,
  },
];

export const getEvents = (): CraftEvent[] => {
  const stored = localStorage.getItem('craft_events');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
        endDate: e.endDate ? new Date(e.endDate) : undefined
      }));
    } catch (e) {
      console.error('Failed to parse events', e);
    }
  }
  return initialEvents;
};

export const saveEvents = (events: CraftEvent[]) => {
  localStorage.setItem('craft_events', JSON.stringify(events));
};

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  quantity: number;
  timestamp: string;
}

export const getRegistrations = (): Registration[] => {
  const stored = localStorage.getItem('craft_registrations');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse registrations', e);
    }
  }
  return [];
};

export const saveRegistration = (registration: Registration) => {
  const registrations = getRegistrations();
  registrations.unshift(registration);
  localStorage.setItem('craft_registrations', JSON.stringify(registrations));
};

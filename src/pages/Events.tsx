import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import { getEvents, saveEvents, CraftEvent, EventCategory, saveRegistration, Registration } from '../data/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

export default function Events() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CraftEvent[]>([]);
  const [selectedEventDetails, setSelectedEventDetails] = useState<CraftEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regQuantity, setRegQuantity] = useState(1);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const categories = ['All', 'Class', 'Social', 'Special Event'];

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeTab === 'All' || event.category === activeTab;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case 'Class':
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
      case 'Social':
        return 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200';
      case 'Special Event':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200';
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateEvents = selectedDate 
    ? filteredEvents.filter(e => isSameDay(new Date(e.date), selectedDate))
    : [];

  return (
    <div className="flex flex-col w-full">
      {/* Header / Hero Section */}
      <header className="relative overflow-hidden bg-stone-900 text-stone-50 py-20 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-80" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-rose-300 font-medium tracking-widest uppercase text-sm mb-4">Little Button Craft</h2>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6">
              Classes & Events
            </h1>
            <p className="text-lg md:text-xl text-stone-300 max-w-2xl leading-relaxed">
              Join our vibrant community of makers. Whether you're picking up a needle for the first time or looking for friends to craft with, there's a seat at our table for you.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-12 py-12 w-full">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sticky top-20 bg-[#fdfbf7]/95 backdrop-blur-sm z-20 py-4 border-b border-stone-200">
          <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-stone-100 p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="rounded-sm px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm transition-all"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input 
              placeholder="Search events..." 
              className="pl-9 bg-white border-stone-200 focus-visible:ring-rose-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-serif text-stone-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 bg-stone-50 border-b border-stone-200">
                {weekDays.map(day => (
                  <div key={day} className="py-3 text-center text-sm font-medium text-stone-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, dayIdx) => {
                  const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.date), day));
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  
                  return (
                    <div 
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        min-h-[100px] p-2 border-b border-r border-stone-100 cursor-pointer transition-colors
                        ${!isSameMonth(day, monthStart) ? 'bg-stone-50/50 text-stone-400' : 'bg-white text-stone-900'}
                        ${isToday(day) ? 'bg-rose-50/30' : ''}
                        ${isSelected ? 'ring-2 ring-inset ring-rose-400 bg-rose-50/50' : 'hover:bg-stone-50'}
                        ${dayIdx % 7 === 6 ? 'border-r-0' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`
                          text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                          ${isToday(day) ? 'bg-rose-600 text-white' : ''}
                          ${isSelected && !isToday(day) ? 'bg-stone-900 text-white' : ''}
                        `}>
                          {format(day, 'd')}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-xs font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 mt-2">
                        {dayEvents.slice(0, 3).map(event => (
                          <div 
                            key={event.id}
                            className={`text-xs truncate px-1.5 py-1 rounded-sm ${getCategoryColor(event.category)}`}
                            title={event.title}
                          >
                            {event.time.split(' ')[0]} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-stone-500 font-medium pl-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Day Events */}
          <div className="lg:col-span-1">
            <div className="sticky top-40">
              <h3 className="text-2xl font-serif text-stone-900 mb-6">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
              </h3>
              
              {!selectedDate ? (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-stone-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Click on a date in the calendar to view scheduled events and classes.</p>
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-stone-500">
                  <p>No events scheduled for this day.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-stone-200 hover:shadow-md transition-shadow duration-300 bg-white group">
                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge variant="secondary" className={`text-xs font-medium shadow-sm ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg font-serif leading-tight group-hover:text-rose-700 transition-colors">
                            {event.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-0 space-y-3">
                          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                          
                          <div className="space-y-1.5 text-xs text-stone-500 pt-2 border-t border-stone-100">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span>{event.location}</span>
                            </div>
                            {event.instructor && (
                              <div className="flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 shrink-0" />
                                <span>Instructor: {event.instructor}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            className="w-full bg-stone-900 hover:bg-stone-800 text-white transition-colors group-hover:bg-rose-600 text-sm h-9"
                            onClick={() => {
                              setSelectedEventDetails(event);
                              setIsModalOpen(true);
                            }}
                          >
                            {event.category === 'Class' ? 'Register Now' : 'View Details'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-y-auto max-h-[90vh]">
          {selectedEventDetails && (
            <>
              <div className="relative h-48 sm:h-64 w-full">
                <img 
                  src={selectedEventDetails.image} 
                  alt={selectedEventDetails.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className={`font-medium shadow-sm ${getCategoryColor(selectedEventDetails.category)}`}>
                    {selectedEventDetails.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <div className="text-sm font-medium text-rose-600 mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(selectedEventDetails.date), 'EEEE, MMMM do')}
                  </div>
                  <DialogTitle className="text-2xl font-serif leading-tight text-stone-900">
                    {selectedEventDetails.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <DialogDescription className="text-stone-600 text-base leading-relaxed">
                    {selectedEventDetails.description}
                  </DialogDescription>

                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <h4 className="font-serif font-medium text-stone-900">Registration Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Your Name</label>
                        <Input 
                          placeholder="Full Name" 
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="bg-white border-stone-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Email Address</label>
                        <Input 
                          type="email"
                          placeholder="email@example.com" 
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="bg-white border-stone-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Number of Attendees</label>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="number"
                          min="1"
                          max={selectedEventDetails.spotsLeft || 10}
                          value={regQuantity}
                          onChange={(e) => setRegQuantity(parseInt(e.target.value) || 1)}
                          className="w-24 bg-white border-stone-200"
                        />
                        <span className="text-sm text-stone-500 italic">
                          {selectedEventDetails.spotsLeft !== undefined 
                            ? `(Max ${selectedEventDetails.spotsLeft} spots available)` 
                            : "(How many people are coming?)"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-3 text-stone-600">
                      <div className="bg-stone-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-stone-700" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Time</p>
                        <p className="text-sm font-medium">{selectedEventDetails.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-stone-600">
                      <div className="bg-stone-100 p-2 rounded-full">
                        <MapPin className="h-4 w-4 text-stone-700" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Location</p>
                        <p className="text-sm font-medium">{selectedEventDetails.location}</p>
                      </div>
                    </div>

                    {selectedEventDetails.instructor && (
                      <div className="flex items-center gap-3 text-stone-600">
                        <div className="bg-stone-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-stone-700" />
                        </div>
                        <div>
                          <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Instructor</p>
                          <p className="text-sm font-medium">{selectedEventDetails.instructor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="p-6 pt-0 sm:justify-between bg-stone-50 border-t border-stone-100 mt-0">
                <div className="flex items-center text-sm font-medium text-stone-500 mb-4 sm:mb-0">
                  {selectedEventDetails.spotsLeft !== undefined ? (
                    <span className={selectedEventDetails.spotsLeft <= 3 ? "text-rose-600 font-semibold" : ""}>
                      {selectedEventDetails.spotsLeft} spots remaining
                    </span>
                  ) : (
                    <span>Open to all</span>
                  )}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <DialogClose render={<Button variant="outline" className="w-full sm:w-auto">Close</Button>} />
                  <Button 
                    className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white"
                    disabled={selectedEventDetails.spotsLeft !== undefined && selectedEventDetails.spotsLeft <= 0}
                    onClick={() => {
                      if (!regName || !regEmail) {
                        toast.error('Please provide your name and email.');
                        return;
                      }

                      if (selectedEventDetails.spotsLeft !== undefined) {
                        if (selectedEventDetails.spotsLeft >= regQuantity) {
                          const updatedEvents = events.map(e => 
                            e.id === selectedEventDetails.id 
                              ? { ...e, spotsLeft: e.spotsLeft! - regQuantity } 
                              : e
                          );
                          setEvents(updatedEvents);
                          saveEvents(updatedEvents);
                          
                          const registration: Registration = {
                            id: Math.random().toString(36).substr(2, 9),
                            eventId: selectedEventDetails.id,
                            eventTitle: selectedEventDetails.title,
                            userName: regName,
                            userEmail: regEmail,
                            quantity: regQuantity,
                            timestamp: new Date().toISOString()
                          };
                          saveRegistration(registration);

                          toast.success(`Successfully registered ${regQuantity} spot(s) for ${selectedEventDetails.title}!`);
                          setIsModalOpen(false);
                          setRegName('');
                          setRegEmail('');
                          setRegQuantity(1);
                        } else {
                          toast.error(`Sorry, only ${selectedEventDetails.spotsLeft} spots are left.`);
                        }
                      } else {
                        const registration: Registration = {
                          id: Math.random().toString(36).substr(2, 9),
                          eventId: selectedEventDetails.id,
                          eventTitle: selectedEventDetails.title,
                          userName: regName,
                          userEmail: regEmail,
                          quantity: regQuantity,
                          timestamp: new Date().toISOString()
                        };
                        saveRegistration(registration);

                        toast.success(`Successfully RSVP'd ${regQuantity} person(s) for ${selectedEventDetails.title}!`);
                        setIsModalOpen(false);
                        setRegName('');
                        setRegEmail('');
                        setRegQuantity(1);
                      }
                    }}
                  >
                    {selectedEventDetails.spotsLeft !== undefined && selectedEventDetails.spotsLeft <= 0 
                      ? 'Sold Out' 
                      : `${selectedEventDetails.category === 'Class' ? 'Confirm Registration' : 'RSVP Now'} (${regQuantity} spot${regQuantity > 1 ? 's' : ''})`}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

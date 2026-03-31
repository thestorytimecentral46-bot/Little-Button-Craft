import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, saveEvents, CraftEvent, EventCategory, initialEvents, getRegistrations, Registration } from '../data/events';
import { getSettings, saveSettings, SiteSettings } from '../data/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Mail, Calendar, Trash2, User, LogOut, LayoutDashboard, Settings, RotateCcw, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState<CraftEvent[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [aboutSettings, setAboutSettings] = useState<SiteSettings>(getSettings());
  
  const initialEventState: Partial<CraftEvent> = {
    title: '',
    date: new Date(),
    time: '',
    location: 'Little Button Craft',
    category: 'Class',
    description: '',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    instructor: '',
    spotsLeft: 10
  };

  const [newEvent, setNewEvent] = useState<Partial<CraftEvent>>(initialEventState);

  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setEvents(getEvents());
      setAboutSettings(getSettings());
      setRegistrations(getRegistrations());
      loadMessages();
    }
  }, [isAuthenticated]);

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    setMessages(storedMessages);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('admin_password') || 'admin123';
    if (password === storedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      toast.success('Login successful');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    toast.info('Logged out');
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedEvents: CraftEvent[];
    
    if (editingEventId) {
      updatedEvents = events.map(event => 
        event.id === editingEventId 
          ? { ...newEvent, id: editingEventId, date: new Date(newEvent.date as any) } as CraftEvent
          : event
      );
      toast.success('Event updated successfully');
    } else {
      const eventToAdd: CraftEvent = {
        ...newEvent,
        id: Date.now().toString(),
        date: new Date(newEvent.date as any),
      } as CraftEvent;
      updatedEvents = [...events, eventToAdd];
      toast.success('Event added successfully');
    }
    
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    
    setNewEvent(initialEventState);
    setEditingEventId(null);
  };

  const handleEditClick = (event: CraftEvent) => {
    setNewEvent({
      ...event,
      date: new Date(event.date)
    });
    setEditingEventId(event.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setNewEvent(initialEventState);
    setEditingEventId(null);
  };

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    if (editingEventId === id) {
      cancelEdit();
    }
    toast.success('Event deleted');
  };

  const handleDeleteMessage = (id: string) => {
    const updatedMessages = messages.filter(m => m.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
    toast.success('Message deleted');
  };

  const toggleMessageRead = (id: string) => {
    const updatedMessages = messages.map(m => 
      m.id === id ? { ...m, read: !m.read } : m
    );
    setMessages(updatedMessages);
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
  };

  const markAllAsRead = () => {
    const updatedMessages = messages.map(m => ({ ...m, read: true }));
    setMessages(updatedMessages);
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
    toast.success('All messages marked as read');
  };

  const exportMessages = () => {
    if (messages.length === 0) return;
    
    const headers = ['Date', 'First Name', 'Last Name', 'Email', 'Subject', 'Message'];
    const csvContent = [
      headers.join(','),
      ...messages.map(m => [
        `"${format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm')}"`,
        `"${m.firstName}"`,
        `"${m.lastName}"`,
        `"${m.email}"`,
        `"${m.subject}"`,
        `"${m.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact_messages_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Messages exported to CSV');
  };

  const resetEvents = () => {
    setEvents(initialEvents);
    saveEvents(initialEvents);
    setRegistrations([]);
    localStorage.removeItem('craft_registrations');
    toast.success('Events and registrations reset');
  };

  const handleDeleteRegistration = (id: string) => {
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    localStorage.setItem('craft_registrations', JSON.stringify(updated));
    toast.success('Registration removed');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const newPass = (e.target as any).newPassword.value;
    const confirmPass = (e.target as any).confirmPassword.value;
    
    if (newPass !== confirmPass) {
      toast.error('Passwords do not match');
      return;
    }
    
    localStorage.setItem('admin_password', newPass);
    toast.success('Password updated successfully');
    (e.target as any).reset();
  };

  const handleAboutSettingsChange = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(aboutSettings);
    toast.success('About Us images updated successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 px-6">
        <Card className="w-full max-w-md shadow-xl border-stone-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-serif text-center">Owner Access</CardTitle>
            <CardDescription className="text-center">Enter your password to manage the shop</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter owner password"
                  className="h-12"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-stone-900 text-white hover:bg-stone-800 h-12 text-lg">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-stone-100 pt-6">
          </CardFooter>
        </Card>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-500">Welcome back, Little Button Craft owner.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/events')} className="gap-2">
            <Calendar className="h-4 w-4" />
            View Site
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="text-stone-500 hover:text-red-600 gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="bg-stone-100 p-1 w-full md:w-auto overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="registrations" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Registrations
            {registrations.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] bg-rose-100 text-rose-700">
                {registrations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-stone-900 text-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-stone-400">Total Events</CardDescription>
                <CardTitle className="text-4xl font-serif">{events.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-stone-400">Scheduled in your calendar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>New Messages</CardDescription>
                <CardTitle className="text-4xl font-serif text-rose-600">{unreadCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-stone-500">Unread inquiries from customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Messages</CardDescription>
                <CardTitle className="text-4xl font-serif text-stone-900">{messages.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-stone-500">All-time contact submissions</p>
              </CardContent>
            </Card>
            <Card className="bg-rose-50 border-rose-100">
              <CardHeader className="pb-2">
                <CardDescription className="text-rose-700">Registrations</CardDescription>
                <CardTitle className="text-4xl font-serif text-rose-900">{registrations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-rose-600">Total spots booked across all events</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/events')}>
                  <Calendar className="h-5 w-5" />
                  <span>View Calendar</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => {
                  const tab = document.querySelector('[value="events"]') as HTMLElement;
                  tab?.click();
                }}>
                  <Calendar className="h-5 w-5" />
                  <span>Add New Event</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={resetEvents}>
                  <RotateCcw className="h-5 w-5" />
                  <span>Reset Events</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => {
                  const tab = document.querySelector('[value="messages"]') as HTMLElement;
                  tab?.click();
                }}>
                  <Mail className="h-5 w-5" />
                  <span>Check Messages</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => {
                  const tab = document.querySelector('[value="registrations"]') as HTMLElement;
                  tab?.click();
                }}>
                  <User className="h-5 w-5" />
                  <span>View Registrations</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${msg.read ? 'bg-stone-300' : 'bg-rose-500'}`} />
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{msg.firstName} {msg.lastName}</p>
                          <p className="text-xs text-stone-500 truncate">{msg.subject}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">
                        {format(new Date(msg.timestamp), 'MMM d')}
                      </span>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-sm text-stone-500 text-center py-4">No messages yet.</p>
                  )}
                  {messages.length > 0 && (
                    <Button variant="link" className="w-full text-stone-500 text-xs" onClick={() => {
                      const tab = document.querySelector('[value="messages"]') as HTMLElement;
                      tab?.click();
                    }}>
                      View all messages
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit sticky top-24">
              <CardHeader>
                <CardTitle>{editingEventId ? 'Edit Event' : 'Add New Event'}</CardTitle>
                {editingEventId && <CardDescription>Updating: {events.find(e => e.id === editingEventId)?.title}</CardDescription>}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input required type="date" value={newEvent.date ? format(new Date(newEvent.date), 'yyyy-MM-dd') : ''} onChange={e => setNewEvent({...newEvent, date: new Date(e.target.value + 'T12:00:00')})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time (e.g., 6:00 PM - 8:00 PM)</label>
                    <Input required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={newEvent.category} 
                      onChange={e => setNewEvent({...newEvent, category: e.target.value as EventCategory})}
                    >
                      <option value="Class">Class</option>
                      <option value="Social">Social</option>
                      <option value="Special Event">Special Event</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      required
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={newEvent.description} 
                      onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input required value={newEvent.image} onChange={e => setNewEvent({...newEvent, image: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instructor (Optional)</label>
                    <Input value={newEvent.instructor} onChange={e => setNewEvent({...newEvent, instructor: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Spots Left (Optional)</label>
                    <Input type="number" value={newEvent.spotsLeft || ''} onChange={e => setNewEvent({...newEvent, spotsLeft: parseInt(e.target.value)})} />
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" className="w-full bg-stone-900 text-white hover:bg-stone-800">
                      {editingEventId ? 'Update Event' : 'Add Event'}
                    </Button>
                    {editingEventId && (
                      <Button type="button" variant="outline" onClick={cancelEdit} className="w-full">
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif text-stone-900">Current Events</h2>
                <Button variant="ghost" size="sm" onClick={resetEvents} className="text-stone-400 hover:text-stone-900 gap-2">
                  <RotateCcw className="h-3 w-3" />
                  Reset to Defaults
                </Button>
              </div>
              {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                <Card key={event.id} className={`flex flex-col sm:flex-row overflow-hidden transition-all ${editingEventId === event.id ? 'ring-2 ring-rose-300 shadow-md' : ''}`}>
                  <div className="w-full sm:w-48 h-32 sm:h-auto">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <Badge variant="secondary">{event.category}</Badge>
                      </div>
                      <p className="text-sm text-stone-500 mt-1">{format(new Date(event.date), 'MMM d, yyyy')} • {event.time}</p>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(event)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
                    </div>
                  </div>
                </Card>
              ))}
              {events.length === 0 && (
                <Card className="border-dashed border-2 border-stone-200 bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-stone-300 mb-4" />
                    <p className="text-stone-500 font-medium">No events found.</p>
                    <Button variant="link" onClick={resetEvents}>Reset to default events</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-serif text-stone-900">Contact Messages</h2>
                <p className="text-sm text-stone-500">Manage inquiries from the contact form</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                  Mark all as read
                </Button>
                <Button variant="outline" size="sm" onClick={exportMessages} disabled={messages.length === 0}>
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((msg) => (
                  <Card key={msg.id} className={`border-stone-200 transition-all ${!msg.read ? 'bg-stone-50 border-rose-100 ring-1 ring-rose-50' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {!msg.read && <div className="h-2 w-2 rounded-full bg-rose-500" />}
                          <CardTitle className="text-lg font-serif">{msg.subject}</CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-stone-400 hover:text-stone-900"
                            onClick={() => toggleMessageRead(msg.id)}
                            title={msg.read ? "Mark as unread" : "Mark as read"}
                          >
                            {msg.read ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-stone-400 hover:text-red-600"
                            onClick={() => handleDeleteMessage(msg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-medium text-stone-900">{msg.firstName} {msg.lastName}</span>
                        <span>&bull;</span>
                        <a href={`mailto:${msg.email}`} className="text-rose-600 hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {msg.email}
                        </a>
                        <span>&bull;</span>
                        <span>{format(new Date(msg.timestamp), 'MMM d, yyyy h:mm a')}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.message}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed border-2 border-stone-200 bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Mail className="h-12 w-12 text-stone-300 mb-4" />
                    <p className="text-stone-500 font-medium">No messages yet.</p>
                    <p className="text-stone-400 text-sm">When someone fills out the contact form, it will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="registrations">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-serif text-stone-900">Event Registrations</h2>
              <p className="text-sm text-stone-500">{registrations.length} total registrations</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {registrations.length > 0 ? (
                registrations.map((reg) => (
                  <Card key={reg.id} className="border-stone-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-lg text-stone-900">{reg.eventTitle}</h3>
                            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-100">
                              {reg.quantity} spot{reg.quantity > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-stone-500">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {reg.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {reg.userEmail}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-stone-400">
                            {format(new Date(reg.timestamp), 'MMM d, yyyy • h:mm a')}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-stone-400 hover:text-red-600 h-8 w-8"
                            onClick={() => handleDeleteRegistration(reg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed border-2 border-stone-200 bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-stone-300 mb-4" />
                    <p className="text-stone-500 font-medium">No registrations yet.</p>
                    <p className="text-stone-400 text-sm text-center max-w-xs">When someone RSVPs or registers for an event, it will show up here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">Admin Settings</CardTitle>
                <CardDescription>Manage your administrative preferences and security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-stone-900 border-b pb-2">Security</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-stone-600">New Password</label>
                      <Input name="newPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-stone-600">Confirm New Password</label>
                      <Input name="confirmPassword" type="password" required />
                    </div>
                    <Button type="submit" className="bg-stone-900 text-white">Update Password</Button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-stone-900 border-b pb-2">About Us Page Images</h3>
                  <form onSubmit={handleAboutSettingsChange} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-stone-600">First Image URL</label>
                      <Input 
                        value={aboutSettings.aboutImage1} 
                        onChange={e => setAboutSettings({...aboutSettings, aboutImage1: e.target.value})} 
                        placeholder="Enter URL for the first image"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-stone-600">Second Image URL</label>
                      <Input 
                        value={aboutSettings.aboutImage2} 
                        onChange={e => setAboutSettings({...aboutSettings, aboutImage2: e.target.value})} 
                        placeholder="Enter URL for the second image"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" className="bg-stone-900 text-white">Save About Us Images</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setAboutSettings({
                            aboutImage1: aboutSettings.aboutImage2,
                            aboutImage2: aboutSettings.aboutImage1
                          });
                        }}
                      >
                        Swap Images
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-stone-900 border-b pb-2">Data Management</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Reset All Data</p>
                      <p className="text-xs text-stone-500">Restore events to their original state.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetEvents} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                      Reset Events
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

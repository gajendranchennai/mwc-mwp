import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import BudgetTracker from './components/BudgetTracker';
import GuestList from './components/GuestList';
import Checklist from './components/Checklist';
import AIAssistant from './components/AIAssistant';
import InspirationGen from './components/InspirationGen';
import ContactUs from './components/ContactUs';
import EventTimeline from './components/EventTimeline';
import { View, BudgetItem, Guest, Task, ChatMessage, DashboardStats, EventItem, User } from './types';
import { INITIAL_BUDGET, INITIAL_GUESTS, INITIAL_TASKS, INITIAL_EVENTS } from './constants';

interface AuthenticatedAppProps {
  user: User;
  onLogout: () => void;
}

// AuthenticatedApp wraps all the main logic. 
// It uses `user.id` to namespace local storage keys, ensuring data separation.
const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  // Storage keys prefixed with user ID
  const KEY_DATE = `wedding_app_${user.id}_date`;
  const KEY_BUDGET = `wedding_app_${user.id}_budget`;
  const KEY_GUESTS = `wedding_app_${user.id}_guests`;
  const KEY_TASKS = `wedding_app_${user.id}_tasks`;
  const KEY_EVENTS = `wedding_app_${user.id}_events`;

  // State initialization
  const [weddingDate, setWeddingDate] = useState<string>(() => {
    return localStorage.getItem(KEY_DATE) || '2025-06-01';
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem(KEY_BUDGET);
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(KEY_GUESTS);
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(KEY_TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(KEY_EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Persistence Effects
  useEffect(() => localStorage.setItem(KEY_DATE, weddingDate), [weddingDate, KEY_DATE]);
  useEffect(() => localStorage.setItem(KEY_BUDGET, JSON.stringify(budgetItems)), [budgetItems, KEY_BUDGET]);
  useEffect(() => localStorage.setItem(KEY_GUESTS, JSON.stringify(guests)), [guests, KEY_GUESTS]);
  useEffect(() => localStorage.setItem(KEY_TASKS, JSON.stringify(tasks)), [tasks, KEY_TASKS]);
  useEffect(() => localStorage.setItem(KEY_EVENTS, JSON.stringify(events)), [events, KEY_EVENTS]);

  // Derived Stats
  const stats: DashboardStats = {
    daysLeft: Math.max(0, Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
    totalBudget: budgetItems.reduce((acc, curr) => acc + curr.estimated, 0),
    spentBudget: budgetItems.reduce((acc, curr) => acc + curr.actual, 0),
    totalGuests: guests.length,
    confirmedGuests: guests.filter(g => g.rsvpStatus === 'accepted').length,
    pendingTasks: tasks.filter(t => !t.completed).length,
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            stats={stats} 
            tasks={tasks} 
            guests={guests} 
            budgetItems={budgetItems} 
            onNavigate={setCurrentView} 
            weddingDate={weddingDate} 
            setWeddingDate={setWeddingDate} 
          />
        );
      case View.BUDGET:
        return <BudgetTracker items={budgetItems} setItems={setBudgetItems} />;
      case View.GUESTS:
        return <GuestList guests={guests} setGuests={setGuests} />;
      case View.TIMELINE:
        return <EventTimeline events={events} setEvents={setEvents} />;
      case View.CHECKLIST:
        return <Checklist tasks={tasks} setTasks={setTasks} />;
      case View.ASSISTANT:
        return <AIAssistant messages={chatHistory} setMessages={setChatHistory} />;
      case View.INSPIRATION:
        return <InspirationGen />;
      case View.CONTACT:
        return <ContactUs />;
      default:
        return (
          <Dashboard 
            stats={stats} 
            tasks={tasks} 
            guests={guests} 
            budgetItems={budgetItems} 
            onNavigate={setCurrentView} 
            weddingDate={weddingDate} 
            setWeddingDate={setWeddingDate} 
          />
        );
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} onLogout={onLogout} userName={user.name}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('wedding_active_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('wedding_active_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wedding_active_user');
  };

  if (checkingAuth) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>;
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  // Key ensures that when user changes, the AuthenticatedApp component remounts completely,
  // re-initializing the state hooks with the new user's data from localStorage.
  return (
    <AuthenticatedApp 
      key={currentUser.id} 
      user={currentUser} 
      onLogout={handleLogout} 
    />
  );
};

export default App;
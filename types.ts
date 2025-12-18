export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined';
  mealPreference: 'standard' | 'vegetarian' | 'vegan';
  plusOne: boolean;
  photo?: string; // Base64 string for guest photo
  mobileOrCity?: string; // Optional Mobile or City field
}

export interface BudgetItem {
  id: string;
  category: string;
  estimated: number;
  actual: number;
  paid: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO string
  completed: boolean;
  category: string;
}

export interface EventItem {
  id: string;
  name: string;
  time: string; // HH:mm format
  date?: string; // YYYY-MM-DD format
  details?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  BUDGET = 'BUDGET',
  GUESTS = 'GUESTS',
  CHECKLIST = 'CHECKLIST',
  ASSISTANT = 'ASSISTANT',
  INSPIRATION = 'INSPIRATION',
  CONTACT = 'CONTACT',
  TIMELINE = 'TIMELINE',
}

export interface DashboardStats {
  daysLeft: number;
  totalBudget: number;
  spentBudget: number;
  totalGuests: number;
  confirmedGuests: number;
  pendingTasks: number;
}
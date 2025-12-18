import { BudgetItem, Guest, Task, EventItem } from './types';

export const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Determine Budget', dueDate: '2024-01-01', completed: true, category: 'Planning' },
  { id: '2', title: 'Draft Guest List', dueDate: '2024-01-15', completed: false, category: 'Guests' },
  { id: '3', title: 'Book Venue', dueDate: '2024-02-01', completed: false, category: 'Venue' },
  { id: '4', title: 'Hire Photographer', dueDate: '2024-02-15', completed: false, category: 'Vendors' },
  { id: '5', title: 'Send Save the Dates', dueDate: '2024-03-01', completed: false, category: 'Guests' },
];

export const INITIAL_BUDGET: BudgetItem[] = [
  { id: '1', category: 'Venue', estimated: 200000, actual: 0, paid: 0 },
  { id: '2', category: 'Catering', estimated: 150000, actual: 0, paid: 0 },
  { id: '3', category: 'Photography', estimated: 50000, actual: 0, paid: 0 },
  { id: '4', category: 'Attire', estimated: 50000, actual: 0, paid: 0 },
  { id: '5', category: 'Decor', estimated: 50000, actual: 0, paid: 0 },
];

export const INITIAL_GUESTS: Guest[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', rsvpStatus: 'accepted', mealPreference: 'standard', plusOne: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', rsvpStatus: 'pending', mealPreference: 'vegetarian', plusOne: false },
];

export const INITIAL_EVENTS: EventItem[] = [
  { id: '1', name: 'Getting Ready', time: '09:00', date: '2025-06-01', details: 'Bride and Groom prep at separate locations' },
  { id: '2', name: 'First Look', time: '14:00', date: '2025-06-01', details: 'Garden area behind the main hall' },
  { id: '3', name: 'Ceremony Begins', time: '16:00', date: '2025-06-01', details: 'Main Wedding Hall' },
  { id: '4', name: 'Reception Dinner', time: '18:30', date: '2025-06-01', details: 'Ballroom' },
];
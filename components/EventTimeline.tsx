import React, { useState } from 'react';
import { EventItem } from '../types';
import { Clock, Plus, Trash2, Calendar, MapPin, FileDown } from 'lucide-react';
import { exportTimelinePDF } from '../services/pdfService';

interface EventTimelineProps {
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
}

const EventTimeline: React.FC<EventTimelineProps> = ({ events, setEvents }) => {
  const [newEvent, setNewEvent] = useState<Omit<EventItem, 'id'>>({ name: '', time: '', date: '', details: '' });

  const addEvent = () => {
    if (!newEvent.name || !newEvent.time || !newEvent.date) return;
    setEvents(prev => [...prev, { ...newEvent, id: Date.now().toString() }]);
    setNewEvent({ name: '', time: '', date: '', details: '' });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Sort events by date then time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date || '9999-12-31';
    const dateB = b.date || '9999-12-31';
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    return a.time.localeCompare(b.time);
  });

  // Group events by date
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = event.date || 'Undated';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, EventItem[]>);

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Undated') return 'Undated';
    return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">Event Time Chart</h2>
          <p className="text-gray-500 mt-1">Plan your wedding day schedule down to the minute.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Event Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 sticky top-6">
            <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-brand-500" /> Add New Event
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Event Name</label>
                <input 
                  type="text" 
                  value={newEvent.name} 
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="e.g. Ceremony Start"
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Date</label>
                <input 
                  type="date" 
                  value={newEvent.date} 
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Time</label>
                <input 
                  type="time" 
                  value={newEvent.time} 
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Additional Details</label>
                <textarea 
                  value={newEvent.details} 
                  onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                  placeholder="Location info, instructions, etc."
                  rows={3}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3 text-sm"
                />
              </div>

              <button 
                onClick={addEvent}
                disabled={!newEvent.name || !newEvent.time || !newEvent.date}
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Add to Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Display */}
        <div className="lg:col-span-2">
           <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 min-h-[500px]">
              {sortedEvents.length > 0 ? (
                <div className="space-y-12">
                  {Object.keys(groupedEvents).map(dateKey => (
                    <div key={dateKey}>
                       <h4 className="flex items-center gap-2 font-serif font-bold text-xl text-gray-800 mb-6 border-b border-gray-100 pb-2">
                         <Calendar size={20} className="text-brand-500" />
                         {formatDate(dateKey)}
                       </h4>
                       <div className="relative border-l-2 border-brand-100 ml-3 md:ml-6 space-y-8 py-2">
                        {groupedEvents[dateKey].map((event) => (
                          <div key={event.id} className="relative pl-8 md:pl-12 group">
                            {/* Node */}
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-brand-400 group-hover:border-brand-600 group-hover:scale-125 transition-all shadow-sm z-10"></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl bg-gray-50/50 hover:bg-brand-50/30 border border-transparent hover:border-brand-100 transition-all">
                              <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                        {new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <h4 className="text-xl font-bold text-gray-800">{event.name}</h4>
                                  </div>
                                  {event.details && (
                                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">{event.details}</p>
                                  )}
                              </div>
                              <button 
                                onClick={() => deleteEvent(event.id)}
                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors self-start"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                   <div className="bg-gray-50 p-6 rounded-full mb-4">
                     <Clock size={32} className="text-gray-300" />
                   </div>
                   <h3 className="text-gray-600 font-bold mb-1">Your timeline is empty</h3>
                   <p className="text-sm">Start adding events to create your day's schedule.</p>
                </div>
              )}
           </div>
        </div>
      </div>

       {/* Report Footer */}
       <div className="flex justify-center mt-8">
        <button 
          onClick={() => exportTimelinePDF(events)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-xl transition-all font-medium border border-gray-200 hover:border-brand-200 bg-white"
        >
          <FileDown size={18} />
          <span>Download Timeline Report</span>
        </button>
      </div>
    </div>
  );
};

export default EventTimeline;
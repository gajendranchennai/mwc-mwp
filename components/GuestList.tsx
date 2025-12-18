import React, { useState } from 'react';
import { Guest } from '../types';
import { Plus, Search, CheckCircle, XCircle, HelpCircle, Mail, Camera, User, MapPin, Phone, FileDown } from 'lucide-react';
import { exportGuestListPDF } from '../services/pdfService';

interface GuestListProps {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
}

const GuestList: React.FC<GuestListProps> = ({ guests, setGuests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newGuest, setNewGuest] = useState<{name: string, email: string, mobileOrCity: string}>({ name: '', email: '', mobileOrCity: '' });
  const [newGuestPhoto, setNewGuestPhoto] = useState<string | null>(null);

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGuestPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addGuest = () => {
    if (!newGuest.name) return;
    const guest: Guest = {
      id: Date.now().toString(),
      name: newGuest.name,
      email: newGuest.email,
      rsvpStatus: 'pending',
      mealPreference: 'standard',
      plusOne: false,
      photo: newGuestPhoto || undefined,
      mobileOrCity: newGuest.mobileOrCity || undefined
    };
    setGuests(prev => [...prev, guest]);
    setNewGuest({ name: '', email: '', mobileOrCity: '' });
    setNewGuestPhoto(null);
    setIsAdding(false);
  };

  const updateStatus = (id: string, status: Guest['rsvpStatus']) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, rsvpStatus: status } : g));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">Guest List</h2>
          <p className="text-gray-500 mt-1">Manage RSVPs, meal preferences, and guest photos.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="mt-4 md:mt-0 bg-brand-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-brand-200 flex items-center gap-2 hover:bg-brand-700 transition-all font-bold text-sm"
        >
          <Plus size={18} /> Add Guest
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 animate-fade-in">
          <h3 className="font-bold text-gray-800 mb-4">Add New Guest</h3>
          <div className="flex flex-col md:flex-row gap-4 items-start">
             {/* Photo Upload */}
             <div className="shrink-0 group relative">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {newGuestPhoto ? (
                    <img src={newGuestPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-gray-300" size={24} />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoUpload}
                />
                <p className="text-[10px] text-center text-gray-400 mt-1 font-bold">Upload Photo</p>
             </div>

             <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wide">Name</label>
                  <input 
                    className="w-full border-gray-200 rounded-xl border p-3 mt-1 focus:ring-brand-500 focus:border-brand-500" 
                    placeholder="Full Name"
                    value={newGuest.name}
                    onChange={e => setNewGuest({...newGuest, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wide">Email</label>
                  <input 
                    className="w-full border-gray-200 rounded-xl border p-3 mt-1 focus:ring-brand-500 focus:border-brand-500" 
                    placeholder="guest@example.com"
                    value={newGuest.email}
                    onChange={e => setNewGuest({...newGuest, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wide">Mobile / City (Optional)</label>
                  <input 
                    className="w-full border-gray-200 rounded-xl border p-3 mt-1 focus:ring-brand-500 focus:border-brand-500" 
                    placeholder="+91 98765 43210 or Mumbai"
                    value={newGuest.mobileOrCity}
                    onChange={e => setNewGuest({...newGuest, mobileOrCity: e.target.value})}
                  />
                </div>
             </div>
             <button onClick={addGuest} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-black w-full md:w-auto self-end transition-colors h-[50px]">Save</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
           <div className="relative max-w-md">
             <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search guest list..." 
               className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all bg-white"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50">
          <thead>
            <tr>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Meal Preference</th>
              <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {filteredGuests.map(guest => (
              <tr key={guest.id} className="hover:bg-brand-50/30 transition-colors">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 overflow-hidden border border-gray-100 shadow-sm shrink-0">
                      {guest.photo ? (
                        <img src={guest.photo} alt={guest.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-brand-600 font-bold text-sm">{guest.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{guest.name}</div>
                      <div className="text-xs text-gray-400 flex flex-col gap-0.5 mt-0.5">
                        <span className="flex items-center gap-1"><Mail size={10}/> {guest.email}</span>
                        {guest.mobileOrCity && (
                          <span className="flex items-center gap-1 font-medium text-brand-600/70">
                            <MapPin size={10} /> {guest.mobileOrCity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border 
                    ${guest.rsvpStatus === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      guest.rsvpStatus === 'declined' ? 'bg-red-50 text-red-700 border-red-100' : 
                      'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {guest.rsvpStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {guest.mealPreference.charAt(0).toUpperCase() + guest.mealPreference.slice(1)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-2">
                   <div className="flex justify-end gap-2">
                    <button onClick={() => updateStatus(guest.id, 'accepted')} className="p-2 rounded-lg hover:bg-emerald-50 text-gray-300 hover:text-emerald-600 transition-colors" title="Accept"><CheckCircle size={20}/></button>
                    <button onClick={() => updateStatus(guest.id, 'pending')} className="p-2 rounded-lg hover:bg-amber-50 text-gray-300 hover:text-amber-600 transition-colors" title="Pending"><HelpCircle size={20}/></button>
                    <button onClick={() => updateStatus(guest.id, 'declined')} className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition-colors" title="Decline"><XCircle size={20}/></button>
                   </div>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  <p>No guests found matching your search.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

       {/* Report Footer */}
       <div className="flex justify-center mt-8">
        <button 
          onClick={() => exportGuestListPDF(guests)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-xl transition-all font-medium border border-gray-200 hover:border-brand-200 bg-white"
        >
          <FileDown size={18} />
          <span>Download Guest List Report</span>
        </button>
      </div>
    </div>
  );
};

export default GuestList;
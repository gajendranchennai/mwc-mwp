import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Globe, MessageCircle, X } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // Updated query to include Business Name so the marker shows "My Wedding Clicks"
  const addressQuery = encodeURIComponent("My Wedding Clicks, 50/B, Puzhuthivakkam Main Road, Puzhuthivakkam, Chennai, Tamil Nadu 600091");
  const mapUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleWhatsApp = () => {
    window.open("https://wa.me/917827378274", "_blank");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Wedding Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    // Explicitly setting the email to myweddingclicksindia@gmail.com
    window.location.href = `mailto:myweddingclicksindia@gmail.com?subject=${subject}&body=${body}`;
    setIsFormOpen(false);
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3">Get in Touch</h2>
        <p className="text-gray-500 text-lg">
          We are here to help you plan your perfect wedding. Reach out to us for consultations or support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Card */}
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 col-span-1 flex flex-col h-full relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
           
           <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold text-gray-800 mb-1">My Wedding Clicks</h3>
              <p className="text-brand-500 font-medium text-sm mb-10 tracking-widest uppercase">Love in Every Frame</p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="bg-brand-50 p-3.5 rounded-2xl text-brand-600 shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Visit Our Office</p>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      50/B, Puzhuthivakkam Main Road,<br/>
                      Puzhuthivakkam,<br/>
                      Chennai,<br/>
                      Tamil Nadu 600091
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="bg-brand-50 p-3.5 rounded-2xl text-brand-600 shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Call Us</p>
                    <p className="text-gray-800 font-bold text-lg hover:text-brand-600 transition-colors">
                      <a href="tel:+917827378274">+91 78273 78274</a>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Available Mon - Sat, 9am - 7pm</p>
                  </div>
                </div>

                 <div className="flex items-start space-x-4 group cursor-pointer" onClick={handleWhatsApp}>
                  <div className="bg-green-50 p-3.5 rounded-2xl text-green-600 shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">WhatsApp Us</p>
                    <p className="text-gray-800 font-bold text-lg hover:text-green-600 transition-colors">
                      +91 78273 78274
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Chat for instant queries</p>
                  </div>
                </div>
                
                 <div className="flex items-start space-x-4 group">
                  <div className="bg-brand-50 p-3.5 rounded-2xl text-brand-600 shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Us</p>
                    <p className="text-gray-700 font-medium">myweddingclicksindia@gmail.com</p>
                  </div>
                </div>
              </div>
           </div>
           
           <div className="mt-auto pt-10 relative z-10">
             <button 
               onClick={() => setIsFormOpen(true)}
               className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
             >
               <Send size={18} />
               Send us a Message
             </button>
           </div>
        </div>

        {/* Map Section */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
           <div className="bg-white p-2 rounded-3xl shadow-soft border border-gray-100 flex-1 min-h-[400px] relative group">
              <div className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse -z-10"></div>
              <iframe 
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1.5rem' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out opacity-0 animate-fade-in"
                onLoad={(e) => e.currentTarget.style.opacity = '1'}
              ></iframe>
              
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white max-w-xs hidden md:block">
                 <div className="flex items-center gap-2 text-brand-600 mb-1">
                   <Globe size={16} />
                   <span className="font-bold text-xs uppercase">Location</span>
                 </div>
                 <p className="text-sm text-gray-600 font-medium">Easily accessible from Puzhuthivakkam Main Road.</p>
              </div>
           </div>
           
           {/* Mini Footer / Additional Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-center gap-4">
                 <div className="bg-white p-3 rounded-full text-brand-500 shadow-sm">
                   <Clock size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-800">Quick Response</h4>
                   <p className="text-sm text-gray-500">We usually reply within 24 hours.</p>
                 </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
                 <div className="bg-white p-3 rounded-full text-blue-500 shadow-sm">
                   <Globe size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-800">Pan India Service</h4>
                   <p className="text-sm text-gray-500">Available for destination weddings.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <div className="mb-6">
                 <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                   <Mail size={24} />
                 </div>
                 <h3 className="text-2xl font-serif font-bold text-gray-800">Send Message</h3>
                 <p className="text-gray-500 text-sm mt-1">Fill out the details below to email us directly.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your mobile number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your wedding plans..."
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 transform active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Email
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
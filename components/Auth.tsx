import React, { useState } from 'react';
import { User } from '../types';
import { Heart, ArrowRight, Lock, Mail, User as UserIcon, Loader } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailInput = formData.email.trim().toLowerCase();
    const passwordInput = formData.password.trim();
    const nameInput = formData.name.trim();

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('wedding_app_users') || '[]');
        
        if (isLogin) {
          // Check for matching user (case-insensitive email)
          const user = users.find((u: any) => 
            (u.email || '').trim().toLowerCase() === emailInput && 
            (u.password || '').trim() === passwordInput
          );

          if (user) {
            onLogin({ id: user.id, name: user.name, email: user.email });
          } else {
             // Specific error messaging
             const emailExists = users.some((u: any) => (u.email || '').trim().toLowerCase() === emailInput);
             if (emailExists) {
               setError('Incorrect password');
             } else {
               setError('Account not found. Please sign up.');
             }
          }
        } else {
          // Register
          const existingUser = users.find((u: any) => (u.email || '').trim().toLowerCase() === emailInput);

          if (existingUser) {
            setError('Email already exists. Please sign in.');
          } else {
            if (!nameInput || !emailInput || !passwordInput) {
               setError('All fields are required');
               setLoading(false);
               return;
            }
            const newUser = {
              id: Date.now().toString(),
              name: nameInput,
              email: emailInput,
              password: passwordInput
            };
            localStorage.setItem('wedding_app_users', JSON.stringify([...users, newUser]));
            onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });
          }
        }
      } catch (err) {
        console.error("Auth Error:", err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[600px] border border-gray-100">
        
        {/* Left Side - Visual */}
        <div className="md:w-1/2 bg-brand-600 relative overflow-hidden flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800 z-0"></div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-inner">
               <Heart size={40} className="text-white fill-current" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4">My Wedding Planner</h1>
            <p className="text-brand-100 text-lg leading-relaxed">
              Plan your perfect day with AI-driven insights, budget tracking, and effortless guest management.
            </p>
          </div>
          
          <div className="relative z-10 space-y-2 text-sm text-brand-100 font-medium">
             <div className="flex items-center gap-2 justify-center">
               <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Smart Budgeting
             </div>
             <div className="flex items-center gap-2 justify-center">
               <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Guest List Management
             </div>
             <div className="flex items-center gap-2 justify-center">
               <span className="w-1.5 h-1.5 bg-white rounded-full"></span> AI Planning Assistant
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-xs mx-auto w-full">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mb-8 text-sm">
              {isLogin ? 'Please enter your details to sign in.' : 'Start planning your dream wedding today.'}
            </p>

            {error && (
              <div className="mb-6 bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg flex items-center gap-2 animate-pulse">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : (
                  <>
                    {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-brand-600 font-bold hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
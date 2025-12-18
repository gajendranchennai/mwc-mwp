import React, { useState } from 'react';
import { DashboardStats, View, BudgetItem, Guest, Task } from '../types';
import { Heart, Users, IndianRupee, CheckSquare, Sparkles, ArrowRight, Edit2, Save, X, FileDown, Calendar, AlertCircle } from 'lucide-react';
import { exportDashboardPDF } from '../services/pdfService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  stats: DashboardStats;
  tasks: Task[];
  guests: Guest[];
  budgetItems: BudgetItem[];
  onNavigate: (view: View) => void;
  weddingDate: string;
  setWeddingDate: (date: string) => void;
}

const StatCard: React.FC<{ 
  title: string; 
  value: string | number | React.ReactNode; 
  icon: React.ReactNode; 
  subtext?: string; 
  gradient: string; 
  iconColor: string;
  action?: React.ReactNode;
}> = ({ title, value, icon, subtext, gradient, iconColor, action }) => (
  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center space-x-5">
        <div className={`p-4 rounded-xl ${gradient} ${iconColor} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        {icon}
        </div>
        <div className="flex-1">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
        <div className="text-3xl font-serif font-bold text-gray-800">{value}</div>
        {subtext && <p className="text-xs text-gray-400 mt-1 font-medium">{subtext}</p>}
        </div>
    </div>
    {action && <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">{action}</div>}
  </div>
);

const ActionButton: React.FC<{ label: string; onClick?: () => void; primary?: boolean }> = ({ label, onClick, primary }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl font-semibold text-sm flex justify-between items-center transition-all duration-200 group
      ${primary 
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-200 hover:bg-brand-600' 
        : 'bg-white border border-gray-100 text-gray-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 shadow-sm'
      }`}
  >
    <span>{label}</span>
    <ArrowRight size={16} className={`transition-transform duration-200 ${primary ? 'text-white' : 'text-gray-300 group-hover:text-brand-400'} group-hover:translate-x-1`} />
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, tasks, guests, budgetItems, onNavigate, weddingDate, setWeddingDate }) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(weddingDate);

  const handleSaveDate = () => {
    setWeddingDate(tempDate);
    setIsEditingDate(false);
  };

  const handleCancelEdit = () => {
    setTempDate(weddingDate);
    setIsEditingDate(false);
  };

  // RSVP Data for Chart
  const rsvpData = [
    { name: 'Confirmed', value: guests.filter(g => g.rsvpStatus === 'accepted').length, color: '#10b981' },
    { name: 'Pending', value: guests.filter(g => g.rsvpStatus === 'pending').length, color: '#f59e0b' },
    { name: 'Declined', value: guests.filter(g => g.rsvpStatus === 'declined').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Upcoming Tasks
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Budget Health
  const variance = stats.totalBudget - stats.spentBudget;
  const budgetHealthPercent = stats.totalBudget > 0 ? (stats.spentBudget / stats.totalBudget) * 100 : 0;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-brand-500">Lovebirds</span>
          </h1>
          <p className="text-gray-500 text-lg">Your dream wedding is <span className="font-semibold text-gray-700">{stats.daysLeft} days</span> away.</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Planning Progress</p>
           <div className="flex items-center gap-2">
             <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 w-[65%] rounded-full"></div>
             </div>
             <span className="text-sm font-bold text-brand-600">65%</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Days To Go" 
          value={
            isEditingDate ? (
                <div className="flex items-center gap-2 mt-1">
                    <input 
                        type="date" 
                        value={tempDate} 
                        min={today}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg p-1 bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none w-full"
                    />
                </div>
            ) : stats.daysLeft
          } 
          icon={<Heart size={26} className="fill-current" />} 
          subtext={isEditingDate ? "Set your date" : "Until your big day"} 
          gradient="bg-rose-50"
          iconColor="text-rose-500"
          action={
            isEditingDate ? (
                <div className="flex gap-1 bg-white shadow-sm p-1 rounded-lg">
                    <button onClick={handleSaveDate} className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"><Save size={14}/></button>
                    <button onClick={handleCancelEdit} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"><X size={14}/></button>
                </div>
            ) : (
                <button onClick={() => { setIsEditingDate(true); setTempDate(weddingDate); }} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-brand-50 hover:text-brand-500 transition-colors">
                    <Edit2 size={16} />
                </button>
            )
          }
        />
        <StatCard 
          title="Guest List" 
          value={stats.confirmedGuests} 
          icon={<Users size={26} />} 
          subtext={`of ${stats.totalGuests} confirmed`}
          gradient="bg-blue-50"
          iconColor="text-blue-500" 
        />
        <StatCard 
          title="Budget Used" 
          value={`₹${(stats.spentBudget / 1000).toFixed(0)}k`} 
          icon={<IndianRupee size={26} />} 
          subtext={`of ₹${(stats.totalBudget / 1000).toFixed(0)}k budget`}
          gradient="bg-emerald-50"
          iconColor="text-emerald-500" 
        />
        <StatCard 
          title="Tasks Left" 
          value={stats.pendingTasks} 
          icon={<CheckSquare size={26} />} 
          subtext="High priority items"
          gradient="bg-violet-50"
          iconColor="text-violet-500" 
        />
      </div>

      {/* Visual Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RSVP Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
          <h3 className="text-lg font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-brand-500" /> RSVP Overview
          </h3>
          <div className="h-48 w-full relative">
            {rsvpData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rsvpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {rsvpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 italic text-sm">No RSVP data yet</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">{stats.totalGuests}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
             {rsvpData.map((d) => (
               <div key={d.name} className="text-center">
                 <div className="text-xs font-bold text-gray-400 mb-1">{d.name}</div>
                 <div className="text-sm font-bold" style={{ color: d.color }}>{d.value}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-brand-500" /> Upcoming Tasks
            </h3>
            <button onClick={() => onNavigate(View.CHECKLIST)} className="text-xs text-brand-600 font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-3 flex-1">
            {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
              <div key={task.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3 group hover:border-brand-200 transition-colors">
                 <div className="mt-1 w-2 h-2 rounded-full bg-brand-400 shrink-0"></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{task.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                 </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                <CheckSquare size={32} />
                <p className="text-sm italic">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Health */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
           <h3 className="text-lg font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
            <IndianRupee size={20} className="text-brand-500" /> Budget Health
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-400">Funds Utilization</span>
                <span className={`${budgetHealthPercent > 90 ? 'text-red-500' : 'text-emerald-500'}`}>{Math.round(budgetHealthPercent)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${budgetHealthPercent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(budgetHealthPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Estimated</p>
                  <p className="text-sm font-bold text-gray-700">₹{(stats.totalBudget/1000).toFixed(0)}k</p>
               </div>
               <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Spent</p>
                  <p className="text-sm font-bold text-gray-700">₹{(stats.spentBudget/1000).toFixed(0)}k</p>
               </div>
            </div>

            <div className={`p-4 rounded-2xl flex items-center gap-3 ${variance >= 0 ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
               {variance >= 0 ? <Sparkles size={18}/> : <AlertCircle size={18}/>}
               <div>
                  <p className="text-[10px] font-bold uppercase opacity-70">Variance</p>
                  <p className="text-sm font-bold">₹{Math.abs(variance).toLocaleString('en-IN')} {variance >= 0 ? 'Under' : 'Over'}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-soft border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-serif font-bold text-gray-800">Quick Actions</h2>
             <button className="text-sm text-brand-600 font-semibold hover:underline" onClick={() => onNavigate(View.CHECKLIST)}>View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <ActionButton label="Add New Guest" onClick={() => onNavigate(View.GUESTS)} />
             <ActionButton label="Log Expense" onClick={() => onNavigate(View.BUDGET)} />
             <ActionButton label="Create Task" onClick={() => onNavigate(View.CHECKLIST)} />
             <ActionButton label="Ask Bella AI" primary onClick={() => onNavigate(View.ASSISTANT)} />
          </div>
        </div>

        {/* Daily Inspiration / Tip */}
        <div className="lg:col-span-1 bg-gradient-to-br from-brand-500 to-brand-700 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            
            <div>
              <div className="bg-white/20 w-fit p-3 rounded-full mb-6 backdrop-blur-md">
                <Sparkles size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Daily Wedding Tip</h3>
              <p className="text-brand-50 leading-relaxed font-light">"Remember to take moments for yourselves during the planning process. A date night with no wedding talk is essential!"</p>
            </div>
            
            <button 
              onClick={() => onNavigate(View.INSPIRATION)}
              className="mt-8 bg-white text-brand-600 py-3 px-6 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors self-start shadow-lg"
            >
              Get Inspired
            </button>
        </div>
      </div>

      {/* Report Footer */}
      <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
        <button 
          onClick={() => exportDashboardPDF(stats)}
          className="w-full md:w-auto flex items-center justify-center gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-xl transition-all font-medium border border-gray-200 hover:border-brand-200 bg-white"
        >
          <FileDown size={18} />
          <span>Summary Report</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
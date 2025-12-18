import React, { useState } from 'react';
import { BudgetItem } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { generateBudgetBreakdown } from '../services/geminiService';
import { exportBudgetPDF } from '../services/pdfService';
import { Plus, Wand2, Trash2, IndianRupee, Calculator, FileDown, CheckCircle2, AlertCircle } from 'lucide-react';

interface BudgetTrackerProps {
  items: BudgetItem[];
  setItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
}

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ items, setItems }) => {
  const [loading, setLoading] = useState(false);
  const [totalInput, setTotalInput] = useState(500000);
  const [guestInput, setGuestInput] = useState(100);
  const [locationInput, setLocationInput] = useState('New Delhi');

  const totalEstimated = items.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = items.reduce((sum, item) => sum + item.paid, 0);
  const totalPending = totalActual - totalPaid;
  const variance = totalEstimated - totalActual;

  const handleGenerateBudget = async () => {
    setLoading(true);
    try {
      const newItems = await generateBudgetBreakdown(totalInput, guestInput, locationInput);
      setItems(newItems);
    } catch (err) {
      console.error(err);
      alert('Failed to generate budget. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateActual = (id: string, val: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, actual: val } : i));
  };

  const updatePaid = (id: string, val: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, paid: val } : i));
  };

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-bold text-gray-800 text-sm">{payload[0].name}</p>
          <p className="text-brand-600 font-bold text-lg">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-full overflow-hidden pb-12">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Estimated</p>
           <h2 className="text-2xl font-serif font-bold text-gray-800">{formatCurrency(totalEstimated)}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Actual</p>
           <h2 className="text-2xl font-serif font-bold text-brand-600">{formatCurrency(totalActual)}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
           <h2 className="text-2xl font-serif font-bold text-emerald-600">{formatCurrency(totalPaid)}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pending</p>
           <h2 className={`text-2xl font-serif font-bold ${totalPending > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
             {formatCurrency(totalPending)}
           </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: AI Proposal Generator */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Wand2 size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-lg">Smart Budget Planner</h3>
            </div>
            <p className="text-brand-50 text-sm opacity-90">Generate a professional financial proposal in seconds with AI.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Budget</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input 
                    type="number" 
                    value={totalInput} 
                    onChange={(e) => setTotalInput(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition-all font-medium text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guests</label>
                  <input 
                    type="number" 
                    value={guestInput} 
                    onChange={(e) => setGuestInput(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition-all font-medium text-gray-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</label>
                  <input 
                    type="text" 
                    value={locationInput} 
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition-all font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerateBudget}
              disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  <span>Analyzing Market Rates...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>Generate Proposal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-soft border border-gray-100 p-8 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">Allocation Analysis</h3>
            {items.length > 0 && <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">{items.length} Categories</span>}
          </div>

          {items.length > 0 ? (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={items}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="estimated"
                    nameKey="category"
                    labelLine={false}
                  >
                    {items.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-bold text-gray-600 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <Calculator size={40} className="mb-3 opacity-50" />
              <p className="font-medium">No budget data generated yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed List Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
              <h3 className="font-bold text-lg text-gray-800">Full Financial View</h3>
              <p className="text-sm text-gray-500">Manage payment status and track pending amounts.</p>
            </div>
            <button 
               className="text-sm font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
               onClick={() => setItems([...items, { id: Date.now().toString(), category: 'New Item', estimated: 0, actual: 0, paid: 0 }])}
            >
              <Plus size={16} /> Add Item
            </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {items.map((item) => {
                const pending = item.actual - item.paid;
                const paidPercent = item.actual > 0 ? (item.paid / item.actual) * 100 : 0;
                const isFullyPaid = item.actual > 0 && item.paid >= item.actual;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="font-bold text-gray-800 text-sm">{item.category}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isFullyPaid ? 'bg-emerald-500' : 'bg-amber-400'}`} 
                            style={{ width: `${Math.min(paidPercent, 100)}%` }}
                          />
                        </div>
                        {isFullyPaid ? <CheckCircle2 size={14} className="text-emerald-500"/> : <AlertCircle size={14} className="text-amber-400"/>}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 block">{Math.round(paidPercent)}% paid</span>
                    </td>
                    <td className="px-6 py-5 text-right text-sm text-gray-500 font-medium whitespace-nowrap">
                      {formatCurrency(item.estimated)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="relative inline-block w-24">
                        <input 
                          type="number" 
                          className="w-full px-2 py-1.5 text-right bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-lg text-sm transition-all"
                          value={item.actual}
                          onChange={(e) => updateActual(item.id, Number(e.target.value))}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="relative inline-block w-24">
                        <input 
                          type="number" 
                          className="w-full px-2 py-1.5 text-right bg-emerald-50/50 border border-transparent hover:border-emerald-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg text-sm transition-all text-emerald-700 font-bold"
                          value={item.paid}
                          onChange={(e) => updatePaid(item.id, Number(e.target.value))}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <span className={`text-sm font-bold ${pending > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {formatCurrency(pending)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleRemoveItem(item.id)} 
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

       <div className="flex justify-center mt-4">
        <button 
          onClick={() => exportBudgetPDF(items)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-xl transition-all font-medium border border-gray-200 hover:border-brand-200 bg-white"
        >
          <FileDown size={18} />
          <span>Download Financial Report</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetTracker;
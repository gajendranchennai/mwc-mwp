import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Clock, Trash, Calendar, CheckSquare, FileDown } from 'lucide-react';
import { exportChecklistPDF } from '../services/pdfService';

interface ChecklistProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Checklist: React.FC<ChecklistProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: newTaskTitle,
      dueDate: new Date().toISOString(),
      completed: false,
      category: 'General'
    }]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">Wedding Checklist</h2>
          <p className="text-gray-500 mt-1">Stay organized and stress-free.</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 min-w-[300px]">
           <div className="flex justify-between text-sm font-bold mb-2">
             <span className="text-gray-600">Overall Progress</span>
             <span className="text-brand-600">{Math.round(progress)}%</span>
           </div>
           <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-brand-400 to-brand-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 min-h-[600px]">
         <form onSubmit={addTask} className="flex gap-4 mb-8">
           <input
             type="text"
             value={newTaskTitle}
             onChange={(e) => setNewTaskTitle(e.target.value)}
             placeholder="Add a new task to your list..."
             className="flex-1 border-gray-200 rounded-xl shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-4 bg-gray-50/50 focus:bg-white transition-all"
           />
           <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
             Add Task
           </button>
         </form>

         <div className="space-y-3">
           {tasks.map(task => (
             <div 
                key={task.id} 
                className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${
                  task.completed 
                    ? 'bg-gray-50/50 border-gray-100 opacity-60' 
                    : 'bg-white border-gray-100 hover:border-brand-200 hover:shadow-md'
                }`}
             >
               <div className="flex items-center space-x-5">
                 <button 
                   onClick={() => toggleTask(task.id)}
                   className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                     task.completed 
                       ? 'bg-brand-500 border-brand-500 text-white scale-100' 
                       : 'border-gray-300 hover:border-brand-400 bg-white text-transparent hover:scale-110'
                   }`}
                 >
                   <Check size={16} strokeWidth={4} />
                 </button>
                 <div>
                    <p className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through decoration-2 decoration-gray-300' : 'text-gray-800'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-brand-100">{task.category}</span>
                      {task.dueDate && <span className="flex items-center text-xs text-gray-400 font-medium"><Calendar size={12} className="mr-1 text-gray-300"/> {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
                    </div>
                 </div>
               </div>
               <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                 <Trash size={18} />
               </button>
             </div>
           ))}
           {tasks.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <div className="bg-gray-50 p-6 rounded-full mb-4">
                 <CheckSquare size={32} className="text-gray-300" />
               </div>
               <p>No tasks yet. Start planning!</p>
             </div>
           )}
         </div>
      </div>

       {/* Report Footer */}
       <div className="flex justify-center mt-8">
        <button 
          onClick={() => exportChecklistPDF(tasks)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-xl transition-all font-medium border border-gray-200 hover:border-brand-200 bg-white"
        >
          <FileDown size={18} />
          <span>Download Checklist Report</span>
        </button>
      </div>
    </div>
  );
};

export default Checklist;
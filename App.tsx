
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  Plus, Download, Search, Layout, HelpCircle, 
  Wand2, Loader2, Trash2, Undo2, Redo2, Printer, 
  ChevronDown, Maximize2, Columns, Table as TableIcon,
  Database, Eye, ShieldCheck, Type, Grid3X3, Layers, 
  Calculator, MousePointer2, Share2, PlayCircle, 
  SearchCode, BookOpen, X, Check,
  MessageSquarePlus, Sigma, Pencil, Info, Filter,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Baseline, PaintBucket, Eraser, Binary, Percent, 
  FileText, Copy, FolderOpen, FileUp, Settings, LogOut,
  MoreHorizontal, ChevronRight, Hash, Square, CheckSquare,
  ShieldAlert, Cookie, Book, UserCheck, BarChart3, 
  Clock, Calendar, SortAsc, SortDesc, RefreshCcw, Palette,
  Scissors, Type as FontIcon, FileSpreadsheet, Globe,
  Shield, Zap, Settings2, AlignJustify
} from 'lucide-react';
import { Task } from './types';
import { generateProjectTasks } from './services/geminiService';

const STORAGE_KEY = 'project_planner_tasks_v10';

const INITIAL_TASKS: Task[] = [
  { id: '1', activity: 'Market Research', planStart: 1, planDuration: 5, actualStart: 1, actualDuration: 4, percentComplete: 100 },
  { id: '2', activity: 'Requirements Gathering', planStart: 5, planDuration: 6, actualStart: 5, actualDuration: 7, percentComplete: 80 },
  { id: '3', activity: 'System Design', planStart: 10, planDuration: 8, actualStart: 12, actualDuration: 10, percentComplete: 35 },
  { id: '4', activity: 'Frontend Development', planStart: 18, planDuration: 15, actualStart: 20, actualDuration: 5, percentComplete: 10 },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState('Home'); 
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleUpdateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const handleAddTask = useCallback(() => {
    const newTask: Task = {
      id: Date.now().toString(),
      activity: 'New Activity',
      planStart: 1,
      planDuration: 5,
      actualStart: 1,
      actualDuration: 5,
      percentComplete: 0
    };
    setTasks(prev => [...prev, newTask]);
    setSelectedTaskId(newTask.id);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  }, [selectedTaskId]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const newTasks = await generateProjectTasks(aiPrompt);
      if (newTasks && newTasks.length > 0) {
        setTasks(newTasks);
        setAiPrompt('');
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ'];

  return (
    <div className="flex flex-col h-screen overflow-hidden text-[#333] bg-white font-sans select-none">
      
      {/* 1. Header Area - Deep Blue Screenshot style */}
      <header className="bg-[#0b4ea2] h-11 flex items-center justify-between px-3 shrink-0 shadow-sm z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
             <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                <FileSpreadsheet size={18} className="text-[#0b4ea2]" />
             </div>
             <span className="text-white font-bold text-[15px] tracking-tight">Project Planner AI</span>
          </div>
          
          <nav className="flex items-center space-x-0.5">
             {['File', 'Home', 'Insert', 'Data', 'Review', 'View'].map(tab => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded text-[13px] font-medium transition-all ${activeTab === tab ? 'bg-[#1e3a5f] text-white shadow-inner' : 'text-blue-100 hover:bg-white/10'}`}
               >
                 {tab}
               </button>
             ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4 pr-1">
           <div className="relative group">
              <input type="text" placeholder="Search tools, help..." className="bg-[#1e3a5f] border-none text-white text-[11px] px-9 py-1.5 rounded-sm w-56 placeholder-blue-200/50 outline-none focus:ring-1 ring-blue-300 transition-all" />
              <Search size={12} className="absolute left-3 top-2 text-blue-200/50" />
           </div>
           <HelpCircle size={18} className="text-blue-100 cursor-pointer hover:text-white" />
           <Settings2 size={18} className="text-blue-100 cursor-pointer hover:text-white" />
           <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-[10px] text-white font-bold border border-white/20">AI</div>
        </div>
      </header>

      {/* 2. Ribbon Area - Screenshot style */}
      <div className="bg-[#f3f3f3] border-b border-gray-300 h-24 flex items-center px-4 space-x-2 overflow-x-auto scrollbar-hide shrink-0 shadow-sm">
        
        {/* Clipboard Group */}
        <div className="flex flex-col border-r border-gray-300 pr-3 h-full pt-2">
          <div className="flex items-center space-x-3 mb-auto">
             <div className="flex flex-col items-center cursor-pointer hover:bg-white/50 p-1 rounded group">
                <Copy size={24} className="text-gray-600 group-hover:text-blue-600" />
                <span className="text-[11px] mt-0.5 text-gray-600 font-medium">Paste</span>
             </div>
             <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2 hover:bg-white/50 px-2 py-0.5 rounded cursor-pointer text-[11px] text-gray-700">
                   <Scissors size={14} /> <span>Cut</span>
                </div>
                <div className="flex items-center space-x-2 hover:bg-white/50 px-2 py-0.5 rounded cursor-pointer text-[11px] text-gray-700">
                   <Copy size={14} /> <span>Copy</span>
                </div>
             </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center pb-1">Clipboard</span>
        </div>

        {/* Font Group - Matches Screenshot */}
        <div className="flex flex-col border-r border-gray-300 px-3 h-full pt-2">
          <div className="flex items-center space-x-1 mb-1">
             <div className="flex items-center border border-gray-300 bg-white px-2 py-1 rounded w-32 justify-between cursor-pointer text-[11px]">
                <span>Segoe UI</span> <ChevronDown size={12} className="text-gray-400" />
             </div>
             <div className="flex items-center border border-gray-300 bg-white px-2 py-1 rounded w-14 justify-between cursor-pointer text-[11px]">
                <span>12</span> <ChevronDown size={12} className="text-gray-400" />
             </div>
          </div>
          <div className="flex items-center space-x-1 mb-auto">
             <button className="p-1 hover:bg-white/50 rounded"><Bold size={15} className="text-gray-700" /></button>
             <button className="p-1 hover:bg-white/50 rounded"><Italic size={15} className="text-gray-700" /></button>
             <button className="p-1 hover:bg-white/50 rounded"><Underline size={15} className="text-gray-700" /></button>
             <div className="w-px h-4 bg-gray-300 mx-1"></div>
             <button className="p-1 hover:bg-white/50 rounded"><PaintBucket size={15} className="text-[#0b4ea2]" /></button>
             <button className="p-1 hover:bg-white/50 rounded border-b-2 border-red-500"><Baseline size={15} className="text-gray-700" /></button>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center pb-1">Font</span>
        </div>

        {/* Alignment Group - Matches Screenshot */}
        <div className="flex flex-col border-r border-gray-300 px-3 h-full pt-2">
          <div className="flex items-center space-x-4 mb-2">
             <div className="flex space-x-1">
                <button className="p-1 hover:bg-white/50 rounded"><AlignLeft size={16} className="text-gray-700" /></button>
                <button className="p-1 hover:bg-white/50 rounded"><AlignCenter size={16} className="text-gray-700" /></button>
                <button className="p-1 hover:bg-white/50 rounded"><AlignRight size={16} className="text-gray-700" /></button>
             </div>
          </div>
          <button className="border border-gray-300 bg-white px-4 py-1 rounded-sm text-[11px] font-medium text-gray-700 hover:bg-gray-50 mb-auto">
             Merge & Center
          </button>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center pb-1">Alignment</span>
        </div>

        {/* AI Action Area - Custom Integrated Bar */}
        <div className="flex-grow flex items-center px-4 justify-end">
           <div className="flex items-center bg-white border border-purple-200 rounded-lg p-1.5 space-x-3 w-[450px] shadow-sm ring-purple-100 focus-within:ring-2 transition-all">
              <div className="pl-1">
                 {isGenerating ? <Loader2 size={18} className="text-purple-600 animate-spin" /> : <Wand2 size={18} className="text-purple-400" />}
              </div>
              <input 
                type="text" 
                placeholder="Describe project (e.g. 'Build a website', 'New product launch')" 
                className="bg-transparent flex-grow outline-none text-[12px] italic text-gray-600 placeholder-gray-300"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-[#8e44ad] text-white px-4 py-1.5 rounded-md text-[11px] font-bold hover:bg-[#7d3c98] disabled:bg-gray-300 transition-colors shadow-sm uppercase"
              >
                Generate Plan
              </button>
           </div>
        </div>

        <div className="flex items-center space-x-6 px-4">
           <button onClick={handleAddTask} className="flex flex-col items-center group text-[#0b4ea2]">
              <Plus size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Add Activity</span>
           </button>
           <button className="flex flex-col items-center group text-green-600">
              <Download size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Export XLSX</span>
           </button>
        </div>
      </div>

      {/* 3. Workspace Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative p-8 bg-white">
        
        {/* Title & Legend Group */}
        <div className="flex items-end justify-between mb-8">
           <div className="flex flex-col">
              <h1 className="text-[44px] font-light text-[#5b4a72] leading-none tracking-tight">Project Planner</h1>
           </div>
           
           {/* Legend - Precise matching to screenshot */}
           <div className="flex items-center space-x-6 text-[10px] font-bold text-gray-500 pb-1">
              <div className="flex items-center"><div className="w-3.5 h-3.5 hatch-purple border border-gray-200 mr-2 shadow-sm"></div> Plan Duration</div>
              <div className="flex items-center"><div className="w-3.5 h-3.5 bg-[#674ea7] mr-2 shadow-sm"></div> Actual Start</div>
              <div className="flex items-center"><div className="w-3.5 h-3.5 bg-[#3e2b5b] mr-2 shadow-sm"></div> % Complete</div>
              <div className="flex items-center"><div className="w-3.5 h-3.5 hatch-orange border border-gray-200 mr-2 shadow-sm"></div> Actual (beyond plan)</div>
              <div className="flex items-center"><div className="w-3.5 h-3.5 bg-[#b45f06] mr-2 shadow-sm"></div> % Complete (beyond plan)</div>
           </div>
        </div>

        {/* The Grid */}
        <div className="flex-grow overflow-auto border border-gray-300 rounded-sm scrollbar-thin shadow-inner bg-white">
           <table className="border-collapse table-fixed min-w-max w-full">
              <thead className="sticky top-0 z-50 bg-[#f8f9fa] border-b border-gray-300">
                 <tr className="h-6">
                    <th className="w-10 border border-gray-200 sticky left-0 z-50 bg-[#f8f9fa]"></th>
                    <th className="w-[200px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase text-center px-2">Activity</th>
                    <th className="w-[80px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase text-center px-1">Plan Start</th>
                    <th className="w-[80px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase text-center px-1">Plan Dur.</th>
                    <th className="w-[80px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase text-center px-1">Actual Start</th>
                    <th className="w-[80px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase text-center px-1">Actual Dur.</th>
                    <th className="w-[80px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase text-center px-1">Percent Comp.</th>
                    {/* Gantt Timeline Start */}
                    <th className="w-[100px] border border-gray-200 text-[9px] font-bold text-gray-400 uppercase bg-[#f4f6f8] text-left pl-3">Periods</th>
                    {Array.from({length: 46}).map((_, i) => (
                      <th key={i} className="w-[32px] border border-gray-200 text-[9px] font-bold text-gray-400 text-center">
                        {i + 1}
                      </th>
                    ))}
                 </tr>
              </thead>
              <tbody>
                 {tasks.map((task, idx) => (
                   <GanttRow 
                    key={task.id} 
                    task={task} 
                    index={idx}
                    onUpdateTask={handleUpdateTask}
                    onDelete={() => handleDeleteTask(task.id)}
                    onSelect={() => setSelectedTaskId(task.id)}
                    isSelected={selectedTaskId === task.id}
                   />
                 ))}
                 
                 {/* Empty rows to maintain Excel aesthetic */}
                 {Array.from({length: 12}).map((_, i) => (
                    <tr key={`empty-${i}`} className="h-9">
                       <td className="sticky left-0 border border-gray-200 bg-[#f8f9fa] text-center text-[10px] text-gray-400">{tasks.length + i + 1}</td>
                       <td className="border border-gray-100"></td>
                       <td className="border border-gray-100"></td>
                       <td className="border border-gray-100"></td>
                       <td className="border border-gray-100"></td>
                       <td className="border border-gray-100"></td>
                       <td className="border border-gray-100 px-2">
                          <div className="flex items-center justify-end">
                            <span className="text-[11px] font-bold text-gray-200">0%</span>
                          </div>
                       </td>
                       <td className="border border-gray-100 bg-gray-50/20"></td>
                       {Array.from({length: 46}).map((_, j) => <td key={j} className="border border-gray-50"></td>)}
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      <footer className="h-7 bg-[#f3f3f3] border-t border-gray-300 flex items-center px-4 shrink-0 text-[11px] font-medium text-gray-500">
         <div className="bg-white border-t-2 border-t-[#0b4ea2] h-full flex items-center px-5 shadow-sm text-[#0b4ea2] font-bold">Sheet1</div>
         <div className="w-px h-4 bg-gray-300 mx-2"></div>
         <span className="opacity-70">Ready</span>
         <div className="flex-grow"></div>
         <span className="opacity-70 mr-4">Project Mode: Professional Enterprise</span>
      </footer>

      <style>{`
        .hatch-purple {
            background-image: repeating-linear-gradient(
                45deg,
                #ebe5f5,
                #ebe5f5 5px,
                #e1d8ee 5px,
                #e1d8ee 10px
            );
        }
        .hatch-orange {
            background-image: repeating-linear-gradient(
                45deg,
                #fcd9a1,
                #fcd9a1 5px,
                #f9c470 5px,
                #f9c470 10px
            );
        }
      `}</style>
    </div>
  );
};

const GanttRow: React.FC<{
  task: Task;
  index: number;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDelete: () => void;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ task, index, onUpdateTask, onDelete, onSelect, isSelected }) => {
  const planEnd = task.planStart + task.planDuration;
  const actualEnd = task.actualStart + task.actualDuration;
  const progressRatio = task.percentComplete / 100;
  const progressPoint = task.actualStart + (task.actualDuration * progressRatio);

  return (
    <tr className={`h-11 group transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/20'}`}>
      <td className={`sticky left-0 border border-gray-200 text-center text-[10px] font-bold transition-colors ${isSelected ? 'bg-[#0b4ea2] text-white shadow-md' : 'bg-[#f8f9fa] text-gray-400'}`}>{index + 1}</td>
      <td onClick={onSelect} className="border border-gray-200 px-4 text-[12px] font-bold text-gray-700 cursor-pointer overflow-hidden truncate">
        <input 
          type="text" 
          value={task.activity} 
          onChange={(e) => onUpdateTask(task.id, { activity: e.target.value })} 
          className="w-full bg-transparent outline-none border-none py-1 h-full placeholder-gray-300"
        />
      </td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.planStart} onChange={(e) => onUpdateTask(task.id, { planStart: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px] font-medium h-full" /></td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.planDuration} onChange={(e) => onUpdateTask(task.id, { planDuration: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px] font-medium h-full" /></td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.actualStart} onChange={(e) => onUpdateTask(task.id, { actualStart: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px] font-medium h-full" /></td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.actualDuration} onChange={(e) => onUpdateTask(task.id, { actualDuration: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px] font-medium h-full" /></td>
      <td className="border border-gray-200 px-2">
         <div className="flex flex-col items-end">
           <div className="flex items-center space-x-1">
             <input type="number" value={task.percentComplete} onChange={(e) => onUpdateTask(task.id, { percentComplete: Number(e.target.value) })} className="w-10 bg-transparent text-right outline-none text-[11px] font-black text-[#5b4a72]" />
             <span className="text-[10px] font-bold text-gray-400">%</span>
           </div>
         </div>
      </td>
      <td className="border border-gray-200 bg-gray-50/30"></td>
      
      {/* Gantt Bar Rendering Engine */}
      {Array.from({ length: 46 }).map((_, i) => {
        const p = i + 1;
        const isPlan = p >= task.planStart && p < planEnd;
        const isActual = p >= task.actualStart && p < actualEnd;
        const isComplete = p >= task.actualStart && p < progressPoint;
        
        const isNormalActual = isActual && p < planEnd;
        const isBeyondActual = isActual && p >= planEnd;
        const isNormalComplete = isComplete && p < planEnd;
        const isBeyondComplete = isComplete && p >= planEnd;

        return (
          <td key={p} className="border border-gray-100 p-0 relative min-w-[32px] h-full transition-all">
            {isPlan && <div className="absolute inset-x-0 top-1.5 bottom-1.5 hatch-purple z-0 shadow-sm rounded-sm"></div>}
            
            {isNormalActual && (
              <div 
                className={`absolute inset-x-0 h-4 top-3.5 z-10 ${!isNormalComplete ? 'opacity-40' : ''} shadow-md rounded-sm`}
                style={{ backgroundColor: '#674ea7' }}
              ></div>
            )}
            {isNormalComplete && (
              <div 
                className="absolute inset-x-0 h-4 top-3.5 z-20 shadow-lg border border-white/10 rounded-sm"
                style={{ backgroundColor: '#3e2b5b' }}
              ></div>
            )}
            
            {isBeyondActual && (
              <div className="absolute inset-x-0 h-4 top-3.5 hatch-orange z-10 shadow-md rounded-sm border border-orange-200/50"></div>
            )}
            {isBeyondComplete && (
              <div className="absolute inset-x-0 h-4 top-3.5 bg-[#b45f06] z-20 shadow-lg border border-white/10 rounded-sm"></div>
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default App;

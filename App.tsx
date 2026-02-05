
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  Plus, Download, Search, Layout, HelpCircle, 
  Wand2, Loader2, Trash2, Undo2, Redo2, Printer, 
  ChevronDown, Maximize2, Columns, Table as TableIcon,
  Database, Eye, ShieldCheck, Type, Grid3X3, Layers, 
  Calculator, MousePointer2, Share2, PlayCircle, 
  SearchCode, BookOpen, X, Check,
  MessageSquarePlus, Sigma, Pencil, Info, Filter
} from 'lucide-react';
import { Task } from './types';
import GanttChart from './components/GanttChart';
import { generateProjectTasks } from './services/geminiService';

const STORAGE_KEY = 'project_planner_tasks';

const INITIAL_TASKS: Task[] = [
  { id: '1', activity: 'Activity 01', planStart: 1, planDuration: 5, actualStart: 1, actualDuration: 4, percentComplete: 25 },
  { id: '2', activity: 'Activity 02', planStart: 1, planDuration: 6, actualStart: 1, actualDuration: 6, percentComplete: 100 },
  { id: '3', activity: 'Activity 03', planStart: 2, planDuration: 4, actualStart: 2, actualDuration: 5, percentComplete: 35 },
  { id: '4', activity: 'Activity 04', planStart: 4, planDuration: 8, actualStart: 4, actualDuration: 6, percentComplete: 10 },
  { id: '5', activity: 'Activity 05', planStart: 4, planDuration: 2, actualStart: 4, actualDuration: 8, percentComplete: 85 },
  { id: '6', activity: 'Activity 06', planStart: 4, planDuration: 3, actualStart: 4, actualDuration: 6, percentComplete: 85 },
  { id: '7', activity: 'Activity 07', planStart: 5, planDuration: 4, actualStart: 5, actualDuration: 3, percentComplete: 50 },
  { id: '8', activity: 'Activity 08', planStart: 5, planDuration: 2, actualStart: 5, actualDuration: 5, percentComplete: 60 },
  { id: '9', activity: 'Activity 09', planStart: 5, planDuration: 2, actualStart: 5, actualDuration: 6, percentComplete: 75 },
  { id: '10', activity: 'Activity 10', planStart: 6, planDuration: 5, actualStart: 6, actualDuration: 7, percentComplete: 100 },
  { id: '11', activity: 'Activity 11', planStart: 6, planDuration: 1, actualStart: 5, actualDuration: 8, percentComplete: 60 },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState('Home'); 
  const [periodHighlight, setPeriodHighlight] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'Editing' | 'Viewing'>('Editing');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for AI prompt and generation status
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    if (viewMode === 'Viewing') return;
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(t => t.activity.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  // Fix: Definition for activeTask to resolve "Cannot find name 'activeTask'"
  const activeTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  // AI Task Generation Handler
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

  // Excel columns A-BQ
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ'];

  return (
    <div className="flex flex-col h-screen overflow-hidden text-[#333] bg-[#f3f3f3] font-sans">
      {/* Top Header / Ribbon Tabs */}
      <header className="bg-white border-b border-gray-300 flex flex-col z-30 flex-shrink-0">
        <div className="p-1 flex items-center justify-between h-10 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-[#107c41] rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 p-0.5"><div className="w-1.5 h-1.5 bg-white/20"></div><div className="w-1.5 h-1.5 bg-white/40"></div><div className="w-1.5 h-1.5 bg-white/60"></div><div className="w-1.5 h-1.5 bg-white"></div></div>
            </div>
            <span className="text-[11px] text-gray-500 font-medium truncate">Project_Planner_Schedule.xlsx</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center text-[11px] text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"><MessageSquarePlus size={14} className="mr-1" /> Comments</button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <div className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded flex items-center cursor-pointer hover:bg-gray-100 transition">
               {viewMode === 'Viewing' ? <Eye size={12} className="mr-1 text-gray-500" /> : <Pencil size={12} className="mr-1 text-blue-500" />}
               <span className="text-[11px]">{viewMode}</span>
               <ChevronDown size={10} className="ml-1" />
            </div>
            <button className="bg-[#107c41] text-white text-[11px] px-3 py-1 rounded font-bold ml-2">Edit a copy</button>
          </div>
        </div>
        
        <nav className="flex items-center px-4 space-x-1 border-b border-gray-300">
          {['File', 'Home', 'Insert', 'Share', 'Page Layout', 'Formulas', 'Data', 'Review', 'View', 'Help'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-3 py-1 text-[12px] relative transition-all ${activeTab === tab ? 'font-bold text-[#107c41]' : 'hover:bg-gray-200 text-gray-700'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-[#107c41]"></div>}
            </button>
          ))}
        </nav>

        {/* Dense Ribbon Area */}
        <div className="bg-white border-b border-gray-300 h-16 flex items-center px-4 space-x-4 overflow-x-auto scrollbar-hide">
          <div className="flex flex-col items-center border-r border-gray-200 pr-4">
            <Plus size={20} className="text-blue-600 mb-1" />
            <span className="text-[10px]">Insert</span>
          </div>
          <div className="flex flex-col items-center border-r border-gray-200 pr-4">
            <Sigma size={20} className="text-[#107c41] mb-1" />
            <span className="text-[10px]">Sum</span>
          </div>
          <div className="flex flex-col items-center border-r border-gray-200 pr-4">
            {/* Fix: Filter component correctly imported from lucide-react */}
            <Filter size={20} className="text-gray-600 mb-1" />
            <span className="text-[10px]">Sort & Filter</span>
          </div>
          <div className="flex items-center bg-purple-50 border border-purple-200 rounded p-1.5 space-x-2">
            {isGenerating ? <Loader2 className="text-purple-600 animate-spin" size={16} /> : <Wand2 className="text-purple-600" size={16} />}
            <input 
              type="text" 
              placeholder="AI Generation (e.g. Build a website)" 
              className="bg-transparent text-[11px] focus:outline-none w-48"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Formula Bar */}
        <div className="bg-white border-b border-gray-200 px-2 py-1 flex items-center text-[11px] h-8">
           <div className="w-12 border border-gray-200 text-center text-gray-500 font-bold bg-gray-50 h-full flex items-center justify-center rounded-sm mr-1">B5</div>
           <div className="flex items-center space-x-1 mr-2 px-1 border-r border-gray-200">
              <X size={14} className="text-gray-300 cursor-pointer" onClick={() => setAiPrompt('')} />
              <Check size={14} className="text-gray-300" />
              <span className="text-blue-600 italic font-serif px-1 font-bold">fx</span>
           </div>
           <div className="flex-grow px-2 font-mono truncate">
              {/* Fix: activeTask defined to resolve compilation error */}
              {activeTask ? activeTask.activity : ''}
           </div>
        </div>
      </header>

      {/* Main Spreadsheet Interface */}
      <div className="flex-grow flex flex-col bg-white overflow-hidden relative">
        {/* The Spreadsheet Container */}
        <div className="flex-grow overflow-auto relative scrollbar-thin">
          <table className="border-collapse table-fixed min-w-max">
            {/* Horizontal Header (A, B, C...) */}
            <thead className="sticky top-0 z-50">
              <tr className="bg-[#f3f3f3] h-6">
                <th className="w-10 border border-gray-300 bg-[#f3f3f3] sticky left-0 z-50">
                   <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[10px] border-l-gray-400 absolute bottom-1 right-1"></div>
                </th>
                {columns.map((col, idx) => {
                  let width = 28; // Standard period width
                  if (col === 'B') width = 180; // Activity
                  if (['C', 'D', 'E', 'F'].includes(col)) width = 64; // Values
                  if (col === 'G') width = 80; // Percent
                  if (col === 'H') width = 40; // Spacer
                  if (col === 'A') width = 0; // Handled by row head

                  // Highlight I column (Period 1 start) to match screenshot highlight
                  const isHighlighted = col === 'I';
                  
                  return (
                    <th 
                      key={col} 
                      className={`border border-gray-300 text-[11px] text-gray-500 font-normal ${isHighlighted ? 'bg-[#dff0d8]' : ''}`}
                      style={{ width: `${width}px` }}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Title Header */}
              <tr className="h-16">
                <td className="sticky left-0 bg-[#f3f3f3] border border-gray-300 text-center text-[10px] text-gray-500 z-40">1</td>
                <td colSpan={7} className="px-4 align-bottom">
                  <h1 className="text-[36px] font-light text-[#5b3e6c] leading-none mb-1">Project Planner</h1>
                </td>
                {columns.slice(7).map((_, i) => <td key={i} className="border border-gray-100"></td>)}
              </tr>

              {/* Row 2: Legend and Highlight Control */}
              <tr className="h-10">
                <td className="sticky left-0 bg-[#f3f3f3] border border-gray-300 text-center text-[10px] text-gray-500 z-40">2</td>
                <td colSpan={7} className="px-4 align-top">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-600 italic">Select a period to highlight at right. A legend describing the charting follows.</span>
                    <div className="flex items-center space-x-4 pr-4">
                      <div className="flex items-center bg-[#fce4d6] border border-[#d6a57c] p-1 px-3">
                        <span className="text-[11px] font-bold mr-2 text-[#5b3e6c]">Period Highlight:</span>
                        <input 
                          type="number" 
                          value={periodHighlight} 
                          onChange={(e) => setPeriodHighlight(Number(e.target.value))} 
                          className="w-10 bg-[#fff2cc] border border-gray-300 text-center font-bold text-[11px] outline-none" 
                        />
                      </div>
                      <div className="flex items-center space-x-3 text-[10px]">
                        <div className="flex items-center"><div className="w-4 h-4 hatch-purple border border-gray-300 mr-1"></div> Plan Duration</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-[#7b5e8c] mr-1"></div> Actual Start</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-[#5b3e6c] mr-1"></div> % Complete</div>
                        <div className="flex items-center"><div className="w-4 h-4 hatch-orange border border-gray-300 mr-1"></div> Actual (beyond plan)</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-[#c48434] mr-1"></div> % Complete (beyond plan)</div>
                      </div>
                    </div>
                  </div>
                </td>
                {columns.slice(7).map((_, i) => <td key={i} className="border border-gray-100"></td>)}
              </tr>

              {/* Row 3: Spacer */}
              <tr className="h-6">
                 <td className="sticky left-0 bg-[#f3f3f3] border border-gray-300 text-center text-[10px] text-gray-500 z-40">3</td>
                 {columns.map((_, i) => <td key={i} className="border border-gray-100"></td>)}
              </tr>

              {/* Row 4: Column Headers for Data */}
              <tr className="h-10 bg-white">
                <td className="sticky left-0 bg-[#f3f3f3] border border-gray-300 text-center text-[10px] text-gray-500 z-40">4</td>
                <td className="border border-gray-200 px-2 text-[10px] font-bold text-gray-500 uppercase flex items-center h-full">Activity</td>
                <td className="border border-gray-200 text-center text-[9px] font-bold text-gray-500 uppercase leading-tight">Plan<br/>Start</td>
                <td className="border border-gray-200 text-center text-[9px] font-bold text-gray-500 uppercase leading-tight">Plan<br/>Duration</td>
                <td className="border border-gray-200 text-center text-[9px] font-bold text-gray-500 uppercase leading-tight">Actual<br/>Start</td>
                <td className="border border-gray-200 text-center text-[9px] font-bold text-gray-500 uppercase leading-tight">Actual<br/>Duration</td>
                <td className="border border-gray-200 text-center text-[9px] font-bold text-gray-500 uppercase leading-tight">Percent<br/>Complete</td>
                <td className="border border-gray-200"></td>
                {/* Period Headers I-BQ */}
                {Array.from({length: 60}).map((_, i) => (
                  <td key={i} className={`border border-gray-200 text-center text-[10px] font-bold ${i+1 === periodHighlight ? 'bg-[#dff0d8] text-gray-700' : 'text-gray-400'}`}>
                    {i+1}
                  </td>
                ))}
              </tr>

              {/* Gantt Rows Starting at Row 5 */}
              {filteredTasks.map((task, idx) => (
                <tr key={task.id} className="h-8">
                  <td className={`sticky left-0 border border-gray-300 text-center text-[10px] text-gray-500 z-40 ${selectedTaskId === task.id ? 'bg-[#dff0d8]' : 'bg-[#f3f3f3]'}`}>{idx + 5}</td>
                  <GanttRow 
                    task={task} 
                    onUpdateTask={handleUpdateTask} 
                    onSelect={() => setSelectedTaskId(task.id)}
                    isSelected={selectedTaskId === task.id}
                    highlightPeriod={periodHighlight}
                  />
                </tr>
              ))}

              {/* Empty Rows Fill */}
              {Array.from({ length: 20 }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-8">
                  <td className="sticky left-0 bg-[#f3f3f3] border border-gray-300 text-center text-[10px] text-gray-500 z-40">{filteredTasks.length + 5 + i}</td>
                  {columns.map((_, j) => <td key={j} className="border border-gray-100"></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Sheet Bar */}
      <footer className="h-8 bg-[#f3f3f3] border-t border-gray-300 flex items-center px-4 flex-shrink-0">
        <div className="flex items-center h-full">
           <div className="px-6 bg-white border-t-2 border-t-[#107c41] h-full flex items-center text-[11px] font-bold text-[#5b3e6c] relative shadow-sm">
             Project Planner
           </div>
           <button className="px-3 hover:bg-gray-200 text-gray-500 h-full transition-colors"><Plus size={14} /></button>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-4 text-[11px] text-[#107c41] font-bold">
           <span>Ready</span>
           <div className="w-px h-4 bg-gray-300"></div>
           <span className="text-gray-500 font-normal">Accessibility: Good to go</span>
        </div>
      </footer>
    </div>
  );
};

interface GanttRowProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onSelect: () => void;
  isSelected: boolean;
  highlightPeriod: number;
}

const GanttRow: React.FC<GanttRowProps> = ({ task, onUpdateTask, onSelect, isSelected, highlightPeriod }) => {
  const planEnd = task.planStart + task.planDuration;
  const actualEnd = task.actualStart + task.actualDuration;
  const progressRatio = task.percentComplete / 100;
  const progressPoint = task.actualStart + (task.actualDuration * progressRatio);

  return (
    <>
      <td onClick={onSelect} className={`border border-gray-200 px-2 text-[11px] font-bold truncate max-w-[180px] cursor-pointer ${isSelected ? 'bg-blue-50 outline outline-1 outline-blue-400' : ''}`}>{task.activity}</td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.planStart} onChange={(e) => onUpdateTask(task.id, { planStart: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px]" /></td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.planDuration} onChange={(e) => onUpdateTask(task.id, { planDuration: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px]" /></td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.actualStart} onChange={(e) => onUpdateTask(task.id, { actualStart: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px]" /></td>
      <td className="border border-gray-200 text-center"><input type="number" value={task.actualDuration} onChange={(e) => onUpdateTask(task.id, { actualDuration: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px]" /></td>
      <td className="border border-gray-200 text-center font-bold text-[#5b3e6c]"><input type="number" value={task.percentComplete} onChange={(e) => onUpdateTask(task.id, { percentComplete: Number(e.target.value) })} className="w-full bg-transparent text-center outline-none text-[11px]" />%</td>
      <td className="border border-gray-200"></td>
      
      {/* Period cells */}
      {Array.from({ length: 60 }).map((_, i) => {
        const p = i + 1;
        const isHighlighted = p === highlightPeriod;
        
        // Bar logic segments
        const isPlan = p >= task.planStart && p < planEnd;
        const isActual = p >= task.actualStart && p < actualEnd;
        const isComplete = p >= task.actualStart && p < progressPoint;
        
        const isNormalActual = isActual && p < planEnd;
        const isBeyondActual = isActual && p >= planEnd;
        const isNormalComplete = isComplete && p < planEnd;
        const isBeyondComplete = isComplete && p >= planEnd;

        return (
          <td 
            key={p} 
            className={`border border-gray-100 p-0 relative min-w-[28px] ${isHighlighted ? 'bg-[#fff2cc]' : ''}`}
          >
            {isPlan && <div className="absolute inset-x-0 top-1 bottom-1 hatch-purple opacity-70 z-0"></div>}
            
            {isNormalActual && (
              <div className={`absolute inset-x-0 h-3 top-2.5 bg-[#7b5e8c] shadow-sm z-10 ${!isNormalComplete ? 'opacity-40' : ''}`}></div>
            )}
            {isNormalComplete && (
              <div className="absolute inset-x-0 h-3 top-2.5 bg-[#5b3e6c] z-20"></div>
            )}
            
            {isBeyondActual && (
              <div className="absolute inset-x-0 h-3 top-2.5 hatch-orange z-10 border border-orange-200"></div>
            )}
            {isBeyondComplete && (
              <div className="absolute inset-x-0 h-3 top-2.5 bg-[#c48434] z-20 shadow-sm"></div>
            )}
          </td>
        );
      })}
    </>
  );
};

export default App;

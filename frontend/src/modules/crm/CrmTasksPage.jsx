import React, { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  Calendar,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DEFAULT_TASKS, DEFAULT_ENQUIRIES } from './crmData';
import CRMProfileModal from './components/CRMProfileModal';

// Authentic Inline Calendar Picker from Campus CRM with colored status indicators
const CalendarPicker = ({
  rawTasks,
  selectedDate,
  setSelectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthYearLabel = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const getDayTaskIndicators = (day) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = rawTasks.filter(task => task.dueDate === dStr);

    let hasOverdue = false;
    let hasPending = false;
    let hasCompleted = false;

    dayTasks.forEach(task => {
      if (task.status === 'Completed') hasCompleted = true;
      else if (task.dueDate < '2026-10-11') hasOverdue = true;
      else hasPending = true;
    });

    return { hasOverdue, hasPending, hasCompleted };
  };

  const handleDayClick = (day) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dStr === selectedDate ? '' : dStr);
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 font-sans text-left shadow-2xs">
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 cursor-pointer transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-bold text-slate-900 tracking-tight">{monthYearLabel}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 cursor-pointer transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => <span key={w}>{w}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map((_, i) => <div key={`b-${i}`} className="h-8" />)}
        {days.map(day => {
          const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dStr;
          const { hasOverdue, hasPending, hasCompleted } = getDayTaskIndicators(day);
          const isToday = dStr === '2026-10-11';

          return (
            <button
              type="button"
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-8 w-full rounded-lg flex flex-col justify-between items-center py-1 transition-all text-xs font-semibold cursor-pointer ${
                isSelected 
                  ? 'bg-[#5c67f6] text-white shadow-xs scale-105' 
                  : isToday 
                  ? 'bg-blue-50 border border-blue-400 text-blue-700'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>{day}</span>
              <div className="flex gap-0.5 justify-center items-center h-1.5 w-full">
                {hasOverdue && <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`} />}
                {hasPending && <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />}
                {hasCompleted && <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 font-medium">Filtered by: <strong>{selectedDate}</strong></span>
          <button
            onClick={() => setSelectedDate('')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Clear Date
          </button>
        </div>
      )}
    </div>
  );
};

export function CrmTasksPage({ onNavigate }) {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [activeTab, setActiveTab] = useState('dueToday'); // 'dueToday' | 'overdue' | 'upcoming' | 'completed' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTaskForOutcome, setSelectedTaskForOutcome] = useState(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Add Task Form
  const [newTaskForm, setNewTaskForm] = useState({
    studentName: '',
    parentName: '',
    mobile: '',
    className: 'I',
    taskType: 'Follow-up Call',
    priority: 'High',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: 'Pooja Singh',
    description: ''
  });

  const todayStr = '2026-10-11';

  const toggleTaskCompletion = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        const msg = nextStatus === 'Completed' ? 'Task marked as completed!' : 'Task restored to pending!';
        toast.success(msg);
        return {
          ...t,
          status: nextStatus,
          lastOutcome: nextStatus === 'Completed' ? 'Completed on ' + new Date().toLocaleDateString('en-GB') : ''
        };
      }
      return t;
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTaskForm.studentName || !newTaskForm.mobile) {
      toast.error('Please fill mandatory fields: Student Name and Contact Mobile');
      return;
    }

    const newTask = {
      ...newTaskForm,
      id: Date.now(),
      enquiryId: `TASK-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      lastOutcome: ''
    };

    setTasks(prev => [newTask, ...prev]);
    setShowAddModal(false);
    toast.success('Task created successfully!');
    setNewTaskForm({
      studentName: '',
      parentName: '',
      mobile: '',
      className: 'I',
      taskType: 'Follow-up Call',
      priority: 'High',
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Pooja Singh',
      description: ''
    });
  };

  const handleSaveOutcome = () => {
    if (!selectedTaskForOutcome) return;
    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskForOutcome.id) {
        return {
          ...t,
          status: 'Completed',
          lastOutcome: outcomeNote || 'Call completed successfully.'
        };
      }
      return t;
    }));
    toast.success('Task outcome logged and marked completed!');
    setSelectedTaskForOutcome(null);
    setOutcomeNote('');
  };

  const handleDeleteTask = (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted successfully!');
    }
  };

  // Filter Tasks by Active Tab & Calendar Date
  const filteredTasks = tasks.filter(t => {
    const matchSearch =
      !searchQuery ||
      t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mobile.includes(searchQuery) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (selectedCalendarDate) {
      return t.dueDate === selectedCalendarDate;
    }

    if (activeTab === 'dueToday') {
      return t.status !== 'Completed' && (t.dueDate === todayStr || t.status === 'Pending');
    }
    if (activeTab === 'overdue') {
      return t.status !== 'Completed' && t.dueDate < todayStr;
    }
    if (activeTab === 'upcoming') {
      return t.status !== 'Completed' && t.dueDate > todayStr;
    }
    if (activeTab === 'completed') {
      return t.status === 'Completed';
    }
    return true; // 'all'
  });

  const dueTodayCount = tasks.filter(t => t.status !== 'Completed' && (t.dueDate === todayStr || t.status === 'Pending')).length;
  const overdueCount = tasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr).length;
  const upcomingCount = tasks.filter(t => t.status !== 'Completed' && t.dueDate > todayStr).length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Today's Follow-up Tasks
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600">
              CRM
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Today's Tasks</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3.5 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-transform hover:scale-105 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Column: Calendar Picker */}
        <div className="lg:col-span-1 space-y-4">
          <CalendarPicker
            rawTasks={tasks}
            selectedDate={selectedCalendarDate}
            setSelectedDate={setSelectedCalendarDate}
          />

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-2 shadow-2xs">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">Status Legend</span>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Overdue Follow-up</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Pending Action</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Completed Task</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Switcher & Tasks List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="border-b border-slate-200 px-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex space-x-1 sm:space-x-3">
                <button
                  onClick={() => { setActiveTab('dueToday'); setSelectedCalendarDate(''); }}
                  className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'dueToday' && !selectedCalendarDate
                      ? 'border-[#5c67f6] text-[#5c67f6]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due Today ({dueTodayCount})</span>
                </button>
                <button
                  onClick={() => { setActiveTab('upcoming'); setSelectedCalendarDate(''); }}
                  className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'upcoming' && !selectedCalendarDate
                      ? 'border-[#5c67f6] text-[#5c67f6]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming ({upcomingCount})</span>
                </button>
                <button
                  onClick={() => { setActiveTab('completed'); setSelectedCalendarDate(''); }}
                  className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'completed' && !selectedCalendarDate
                      ? 'border-[#5c67f6] text-[#5c67f6]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Completed ({completedCount})</span>
                </button>
                <button
                  onClick={() => { setActiveTab('all'); setSelectedCalendarDate(''); }}
                  className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'all' && !selectedCalendarDate
                      ? 'border-[#5c67f6] text-[#5c67f6]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>All ({tasks.length})</span>
                </button>
              </div>

              <div className="relative w-48 sm:w-56 py-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Task Cards List */}
            <div className="p-4 space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => {
                  const isCompleted = task.status === 'Completed';
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCompleted
                          ? 'bg-slate-50 border-slate-200 opacity-75'
                          : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {task.studentName} (Class {task.className})
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {task.taskType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                              'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}>
                              {task.priority} Priority
                            </span>
                          </div>

                          <p className="text-xs text-slate-600">{task.description}</p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                            <span>Parent: <strong>{task.parentName}</strong></span>
                            <span>•</span>
                            <span>Phone: <strong>{task.mobile}</strong></span>
                            <span>•</span>
                            <span>Due: <strong>{task.dueDate}</strong></span>
                            <span>•</span>
                            <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                          </div>

                          {task.lastOutcome && (
                            <p className="text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-100 font-medium">
                              Outcome: {task.lastOutcome}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <a
                          href={`tel:${task.mobile}`}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                        <a
                          href={`https://wa.me/91${task.mobile}?text=Hello%20${encodeURIComponent(task.parentName)},%20Greetings%20from%20J%20D%20International%20School.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                        <button
                          onClick={() => setSelectedTaskForOutcome(task)}
                          className="px-3 py-1.5 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Log Call
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No tasks found in this view.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-4 border-b pb-3 uppercase tracking-wide">
              CREATE FOLLOW-UP TASK
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Name*</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.studentName}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={newTaskForm.parentName}
                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, parentName: e.target.value }))}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Contact Mobile*</label>
                  <input
                    type="tel"
                    required
                    value={newTaskForm.mobile}
                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="10-digit number"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Task Type</label>
                  <select
                    value={newTaskForm.taskType}
                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, taskType: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Follow-up Call">Follow-up Call</option>
                    <option value="Campus Visit Confirmation">Campus Visit Confirmation</option>
                    <option value="Entrance Test Reminder">Entrance Test Reminder</option>
                    <option value="Fee Concession Review">Fee Concession Review</option>
                    <option value="Document Collection">Document Collection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Due Date*</label>
                  <input
                    type="date"
                    required
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Task Instructions</label>
                <textarea
                  rows="2"
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What needs to be communicated or collected..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG CALL OUTCOME MODAL */}
      {selectedTaskForOutcome && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTaskForOutcome(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Log Task Outcome: {selectedTaskForOutcome.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedTaskForOutcome.taskType} • {selectedTaskForOutcome.mobile}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Call / Task Outcome</label>
                <textarea
                  rows="3"
                  value={outcomeNote}
                  onChange={(e) => setOutcomeNote(e.target.value)}
                  placeholder="Record summary of call, parent response, or next step..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
              <button
                onClick={() => setSelectedTaskForOutcome(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOutcome}
                className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md cursor-pointer"
              >
                Complete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

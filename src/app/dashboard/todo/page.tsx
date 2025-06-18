"use client"

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import moment from 'moment'; // For easy date/time manipulation
import { motion } from "framer-motion"; // Added for potential future animations if needed, matching NotesComponent

// Define the ToDo interface
interface Todo {
  id: string;
  title: string;
  startDay: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endDay: string; // YYYY-MM-DD
  endTime: string; // HH:MM
  completed: boolean;
}

const initialTodos: Todo[] = [
  {
    id: '1',
    title: 'Team Meeting',
    startDay: '2025-06-20',
    startTime: '10:00',
    endDay: '2025-06-20',
    endTime: '11:00',
    completed: false,
  },
  {
    id: '2',
    title: 'Project Deadline',
    startDay: '2025-06-25',
    startTime: '17:00',
    endDay: '2025-06-25',
    endTime: '18:00',
    completed: false,
  },
  {
    id: '3',
    title: 'Gym Workout',
    startDay: '2025-06-19',
    startTime: '07:00',
    endDay: '2025-06-19',
    endTime: '08:00',
    completed: true,
  },
  {
    id: '4',
    title: 'Study Session',
    startDay: moment().format('YYYY-MM-DD'), // Today
    startTime: '14:00',
    endDay: moment().format('YYYY-MM-DD'),
    endTime: '16:00',
    completed: false,
  },
  {
    id: '5',
    title: 'Code Review',
    startDay: moment().add(1, 'days').format('YYYY-MM-DD'), // Tomorrow
    startTime: '09:00',
    endDay: moment().add(1, 'days').format('YYYY-MM-DD'),
    endTime: '10:00',
    completed: false,
  },
];

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState<Omit<Todo, 'id'>>({
    title: '',
    startDay: moment().format('YYYY-MM-DD'),
    startTime: '09:00',
    endDay: moment().format('YYYY-MM-DD'),
    endTime: '10:00',
    completed: false,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle submitting the To-Do form (add or edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = moment(`${formData.startDay} ${formData.startTime}`);
    const endDateTime = moment(`${formData.endDay} ${formData.endTime}`);

    if (endDateTime.isBefore(startDateTime)) {
      alert('End time cannot be before start time. Please adjust the dates or times.');
      return;
    }

    if (editingTodo) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id ? { ...editingTodo, ...formData, id: editingTodo.id } : todo
      ));
      setEditingTodo(null);
    } else {
      const newTodo: Todo = {
        ...formData,
        id: String(Date.now()),
      };
      setTodos([...todos, newTodo]);
    }
    setFormData({
      title: '',
      startDay: moment().format('YYYY-MM-DD'),
      startTime: '09:00',
      endDay: moment().format('YYYY-MM-DD'),
      endTime: '10:00',
      completed: false,
    });
  };

  // Function to set a To-Do for editing
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      startDay: todo.startDay,
      startTime: todo.startTime,
      endDay: todo.endDay,
      endTime: todo.endTime,
      completed: todo.completed,
    });
  };

  // Filter todos for the selected date to display below the calendar
  const todosForSelectedDate = todos.filter(todo => {
    const todoStartMoment = moment(todo.startDay);
    const todoEndMoment = moment(todo.endDay);
    const selectedMoment = moment(selectedDate);

    return (
      todoStartMoment.isSame(selectedMoment, 'day') ||
      todoEndMoment.isSame(selectedMoment, 'day') ||
      (todoStartMoment.isBefore(selectedMoment, 'day') && todoEndMoment.isAfter(selectedMoment, 'day'))
    );
  }).sort((a, b) => moment(a.startTime, 'HH:MM').diff(moment(b.startTime, 'HH:MM')));

  // Tile content for react-calendar to show indicators for days with todos
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayHasTodo = todos.some(todo =>
        moment(todo.startDay).isSameOrBefore(moment(date), 'day') && moment(todo.endDay).isSameOrAfter(moment(date), 'day')
      );
      return dayHasTodo ? (
        <p className="has-todo-indicator text-blue-500 font-bold text-lg leading-none absolute bottom-1 left-1/2 -translate-x-1/2">
          ●
        </p>
      ) : null;
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-blue-100">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center drop-shadow-sm">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Your Comprehensive To-Do List
        </span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-xl shadow-lg bg-white bg-opacity-95 backdrop-blur-sm">
        {/* Calendar Section */}
        <div className="calendar-section">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Study Schedule</h2>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
              } else if (Array.isArray(value) && value[0] instanceof Date) {
                setSelectedDate(value[0]);
              }
            }}
            value={selectedDate}
            tileContent={tileContent}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">
            To-Dos for <span className="font-bold text-blue-600">{moment(selectedDate).format('YYYY-MM-DD')}</span>
          </h3>
          {todosForSelectedDate.length === 0 ? (
            <p className="text-gray-500 italic">No To-Dos for this date.</p>
          ) : (
            <div className="space-y-3">
              {todosForSelectedDate.map(todo => (
                <motion.div
                  key={todo.id}
                  className={`todo-item p-4 rounded-lg shadow-sm flex justify-between items-center transition-all duration-200 ease-in-out ${
                    todo.completed ? 'bg-green-50 border-green-200 text-gray-600 line-through' : 'bg-white border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <strong className="text-lg text-gray-900 block">{todo.title}</strong>
                    <p className="text-sm text-gray-600">
                      {moment(todo.startDay).format('MMM Do')} {todo.startTime} - {moment(todo.endDay).format('MMM Do')} {todo.endTime}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* To-Do Form Section */}
        <div className="todo-form-section">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
            {editingTodo ? 'Edit Your To-Do' : 'Add a New To-Do'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-gray-50 p-6 rounded-lg shadow-inner">
            <label className="block">
              <span className="text-gray-700 font-medium">Title:</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="e.g., Complete Math Homework"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Start Day:</span>
                <input
                  type="date"
                  name="startDay"
                  value={formData.startDay}
                  onChange={handleInputChange}
                  required
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Start Time:</span>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 font-medium">End Day:</span>
                <input
                  type="date"
                  name="endDay"
                  value={formData.endDay}
                  onChange={handleInputChange}
                  required
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">End Time:</span>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            {editingTodo && (
              <label className="flex items-center text-gray-700 font-medium">
                Completed:
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleInputChange}
                  className="ml-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            )}
            <motion.button
              type="submit"
              className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {editingTodo ? 'Update To-Do' : 'Add To-Do'}
            </motion.button>
            {editingTodo && (
              <motion.button
                type="button"
                onClick={() => {
                  setEditingTodo(null);
                  setFormData({
                    title: '',
                    startDay: moment().format('YYYY-MM-DD'),
                    startTime: '09:00',
                    endDay: moment().format('YYYY-MM-DD'),
                    endTime: '10:00',
                    completed: false,
                  });
                }}
                className="mt-2 w-full py-3 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white-500 font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel Edit
              </motion.button>
            )}
          </form>
        </div>
      </div>
      {/* Global styles for react-calendar and specific todo item overrides */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: 1px solid #e2e8f0; /* border-gray-200 */
          font-family: 'Inter', sans-serif; /* A common modern font */
          line-height: 1.5;
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          padding: 1.5rem; /* p-6 */
          background-color: #ffffff; /* bg-white */
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1.125rem; /* text-lg */
          color: #334155; /* text-slate-700 */
          border-radius: 0.375rem; /* rounded-md */
          transition: background-color 0.2s ease-in-out;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #e0e7ff; /* bg-indigo-100 */
        }
        .react-calendar__navigation button[disabled] {
          background-color: #f1f5f9; /* bg-slate-100 */
          color: #94a3b8; /* text-slate-400 */
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.875em; /* text-sm */
          color: #64748b; /* text-slate-500 */
          margin-bottom: 0.5rem;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .react-calendar__tile {
          max-width: 100%;
          text-align: center;
          padding: 0.75em 0; /* py-3 */
          background: none;
          position: relative;
          border-radius: 0.375rem; /* rounded-md */
          transition: background-color 0.2s ease-in-out;
          color: #1e293b; /* text-slate-800 */
        }
        .react-calendar__tile:disabled {
          background-color: #f8fafc; /* bg-slate-50 */
          color: #cbd5e1; /* text-slate-300 */
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #e0f2fe; /* bg-sky-100 */
        }
        .react-calendar__tile--now {
          background: #dbeafe; /* bg-blue-100 */
          border-radius: 0.375rem; /* rounded-md */
          font-weight: bold;
        }
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #bfdbfe; /* bg-blue-200 */
        }
        .react-calendar__tile--active {
          background: #3b82f6; /* bg-blue-500 */
          color: white;
          border-radius: 0.375rem; /* rounded-md */
          font-weight: bold;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #2563eb; /* bg-blue-600 */
        }
        .react-calendar__tile--range {
          background: #eff6ff; /* bg-blue-50 */
          border-radius: 0;
        }
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          border-radius: 0.375rem; /* rounded-md */
          background: #3b82f6; /* bg-blue-500 */
          color: white;
        }
        /* Specific corners for range selection */
        .react-calendar__tile--rangeStart {
          border-top-left-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
        }
        .react-calendar__tile--rangeEnd {
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        /* Ensure the dot is centered within the tile even with padding/borders */
        .has-todo-indicator {
          font-size: 1.25rem; /* text-xl */
          line-height: 1; /* Adjust to ensure vertical centering */
          text-align: center;
          position: absolute;
          bottom: 4px; /* Adjust as needed */
          left: 50%;
          transform: translateX(-50%);
          color: #2563eb; /* text-blue-600 */
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default TodosPage;



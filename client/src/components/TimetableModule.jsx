"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { Calendar, Plus, Save, X, Clock, User, BookOpen, GraduationCap } from "lucide-react";

function Timetable() {
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    added: [],
    updated: [],
    deleted: []
  });
  const [lecturers,setlecturers] = useState([]);
  const [courses,setCourses] = useState([]);
  
  const [newClass, setNewClass] = useState({
    date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "10:00",
    subject: "",
    professor: "",
    grade: "",
  });

  const defaultNewClass = {
    date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "10:00",
    subject: "",
    professor: "",
    grade: "",
  };

  // Fetch classes from backend
  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/timetable");
      const mapped = res.data.map((cls) => ({
        id: cls.id.toString(),
        title: cls.title,
        start: cls.start,
        end: cls.end,
        backgroundColor: getEventColor(cls.title),
        borderColor: getEventColor(cls.title),
        extendedProps: {
          subject: cls.title.split(' - ')[0],
          professor: cls.title.split(' - ')[1]?.split(' (')[0],
          grade: cls.title.match(/\(Grade (.+)\)/)?.[1]
        }
      }));
      setEvents(mapped);
      setOriginalEvents(mapped);
    } catch (err) {
      console.error("Failed to load timetable", err);
    }
  };

  // Generate colors for events
  const getEventColor = (title) => {
    // Themed palette (avoid bright red) for consistent look
    const colors = [
      '#6366f1', // indigo-500
      '#8b5cf6', // violet-500
      '#4f46e5', // indigo-600
      '#7c3aed', // purple-600
      '#3b82f6', // blue-500
      '#60a5fa', // sky-400
      '#06b6d4', // cyan-500
      '#10b981'  // emerald-500
    ];
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Add new class (temporarily)
  const handleAddClass = () => {
    if (!newClass.subject || !newClass.professor || !newClass.grade) {
      alert("Please fill in all fields");
      return;
    }

    const dayName = new Date(newClass.date).toLocaleDateString("en-US", { weekday: "long" });
    
    const tempId = `temp-${Date.now()}`;
    const startDateTime = `${newClass.date}T${newClass.start_time}:00`;
    const endDateTime = `${newClass.date}T${newClass.end_time}:00`;
    
    const title = `${newClass.subject} - ${newClass.professor} (Grade ${newClass.grade})`;
    
    const newEvent = {
      id: tempId,
      title: title,
      start: startDateTime,
      end: endDateTime,
      backgroundColor: getEventColor(title),
      borderColor: getEventColor(title),
      extendedProps: {
        subject: newClass.subject,
        professor: newClass.professor,
        grade: newClass.grade
      }
    };

    setEvents([...events, newEvent]);
    
    setPendingChanges({
      ...pendingChanges,
      added: [...pendingChanges.added, {
        ...newClass,
        day: dayName,
        tempId: tempId,
        displayInfo: {
          subject: newClass.subject,
          professor: newClass.professor,
          grade: newClass.grade,
          date: newClass.date,
          start_time: newClass.start_time,
          end_time: newClass.end_time
        }
      }]
    });

    setNewClass(defaultNewClass);
    setShowForm(false);
  };

  // Handle drag-and-drop update (temporarily)
  const handleEventDrop = (info) => {
    const { id, start, end } = info.event;
    const newDate = start.toISOString().split("T")[0];
    const newStartTime = start.toTimeString().slice(0, 5);
    const newEndTime = end.toTimeString().slice(0, 5);

    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, start: start.toISOString(), end: end.toISOString() } : e
      )
    );

    if (id.startsWith('temp-')) {
      setPendingChanges({
        ...pendingChanges,
        added: pendingChanges.added.map(item =>
          item.tempId === id
            ? { 
                ...item, 
                date: newDate, 
                start_time: newStartTime, 
                end_time: newEndTime,
                displayInfo: { ...item.displayInfo, date: newDate, start_time: newStartTime, end_time: newEndTime }
              }
            : item
        )
      });
    } else {
      const existingUpdateIndex = pendingChanges.updated.findIndex(u => u.id === id);
      const originalEvent = originalEvents.find(e => e.id === id);
      
      if (existingUpdateIndex >= 0) {
        const updatedChanges = [...pendingChanges.updated];
        updatedChanges[existingUpdateIndex] = {
          ...updatedChanges[existingUpdateIndex],
          newDate,
          newStartTime,
          newEndTime
        };
        setPendingChanges({ ...pendingChanges, updated: updatedChanges });
      } else {
        setPendingChanges({
          ...pendingChanges,
          updated: [...pendingChanges.updated, {
            id,
            title: info.event.title,
            oldDate: originalEvent.start.split('T')[0],
            oldStartTime: originalEvent.start.split('T')[1].slice(0, 5),
            oldEndTime: originalEvent.end.split('T')[1].slice(0, 5),
            newDate,
            newStartTime,
            newEndTime
          }]
        });
      }
    }
  };

  // Handle event resize (temporarily)
  const handleEventResize = (info) => {
    const { id, start, end } = info.event;
    const newDate = start.toISOString().split("T")[0];
    const newStartTime = start.toTimeString().slice(0, 5);
    const newEndTime = end.toTimeString().slice(0, 5);

    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, start: start.toISOString(), end: end.toISOString() } : e
      )
    );

    if (id.startsWith('temp-')) {
      setPendingChanges({
        ...pendingChanges,
        added: pendingChanges.added.map(item =>
          item.tempId === id
            ? { 
                ...item, 
                date: newDate, 
                start_time: newStartTime, 
                end_time: newEndTime,
                displayInfo: { ...item.displayInfo, date: newDate, start_time: newStartTime, end_time: newEndTime }
              }
            : item
        )
      });
    } else {
      const existingUpdateIndex = pendingChanges.updated.findIndex(u => u.id === id);
      const originalEvent = originalEvents.find(e => e.id === id);
      
      if (existingUpdateIndex >= 0) {
        const updatedChanges = [...pendingChanges.updated];
        updatedChanges[existingUpdateIndex] = {
          ...updatedChanges[existingUpdateIndex],
          newDate,
          newStartTime,
          newEndTime
        };
        setPendingChanges({ ...pendingChanges, updated: updatedChanges });
      } else {
        setPendingChanges({
          ...pendingChanges,
          updated: [...pendingChanges.updated, {
            id,
            title: info.event.title,
            oldDate: originalEvent.start.split('T')[0],
            oldStartTime: originalEvent.start.split('T')[1].slice(0, 5),
            oldEndTime: originalEvent.end.split('T')[1].slice(0, 5),
            newDate,
            newStartTime,
            newEndTime
          }]
        });
      }
    }
  };

  // Delete event (temporarily)
  const handleEventClick = (info) => {
    if (!window.confirm("Delete this class?")) return;
    
    const eventId = info.event.id;
    
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    if (eventId.startsWith('temp-')) {
      setPendingChanges({
        ...pendingChanges,
        added: pendingChanges.added.filter(item => item.tempId !== eventId)
      });
    } else {
      const eventToDelete = originalEvents.find(e => e.id === eventId);
      setPendingChanges({
        ...pendingChanges,
        deleted: [...pendingChanges.deleted, {
          id: eventId,
          title: info.event.title,
          date: eventToDelete.start.split('T')[0],
          start_time: eventToDelete.start.split('T')[1].slice(0, 5),
          end_time: eventToDelete.end.split('T')[1].slice(0, 5)
        }],
        updated: pendingChanges.updated.filter(u => u.id !== eventId)
      });
    }
  };

  // Remove specific change from pending
  const removeChange = (type, index) => {
    if (type === 'added') {
      const removedItem = pendingChanges.added[index];
      setEvents(prev => prev.filter(e => e.id !== removedItem.tempId));
      setPendingChanges({
        ...pendingChanges,
        added: pendingChanges.added.filter((_, i) => i !== index)
      });
    } else if (type === 'updated') {
      const removedUpdate = pendingChanges.updated[index];
      const originalEvent = originalEvents.find(e => e.id === removedUpdate.id);
      setEvents(prev => prev.map(e => e.id === removedUpdate.id ? originalEvent : e));
      setPendingChanges({
        ...pendingChanges,
        updated: pendingChanges.updated.filter((_, i) => i !== index)
      });
    } else if (type === 'deleted') {
      const restoredItem = pendingChanges.deleted[index];
      const originalEvent = originalEvents.find(e => e.id === restoredItem.id);
      setEvents(prev => [...prev, originalEvent]);
      setPendingChanges({
        ...pendingChanges,
        deleted: pendingChanges.deleted.filter((_, i) => i !== index)
      });
    }
  };

  // Confirm all changes
  const confirmChanges = async () => {
    try {
      for (const item of pendingChanges.added) {
        await axios.post("http://localhost:8000/timetable", {
          date: item.date,
          day: item.day,
          start_time: item.start_time,
          end_time: item.end_time,
          subject: item.subject,
          professor: item.professor,
          grade: item.grade
        });
      }

      for (const item of pendingChanges.updated) {
        await axios.put(`http://localhost:8000/timetable/${item.id}`, {
          module: item.title,
          oldDate: item.oldDate,
          oldStartTime: item.oldStartTime,
          oldEndTime: item.oldEndTime,
          date: item.newDate,
          start_time: item.newStartTime,
          end_time: item.newEndTime
        });
      }

      for (const item of pendingChanges.deleted) {
        await axios.delete(`http://localhost:8000/timetable/${item.id}`);
      }

      setPendingChanges({ added: [], updated: [], deleted: [] });
      setShowConfirmPopup(false);
      await fetchClasses();
    } catch (err) {
      console.error("Failed to save changes", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const hasChanges = () => {
    return pendingChanges.added.length > 0 || 
           pendingChanges.updated.length > 0 || 
           pendingChanges.deleted.length > 0;
  };

  // Custom event rendering for overlapping
  // Custom event rendering with time display
const renderEventContent = (eventInfo) => {
  const startTime = eventInfo.event.start.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const endTime = eventInfo.event.end.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="p-1.5 h-full overflow-hidden">
      <div className="font-bold text-xs truncate mb-0.5">{startTime} - {endTime}</div>
      <div className="font-semibold text-xs truncate">{eventInfo.event.extendedProps.subject}</div>
      <div className="text-xs opacity-90 truncate">{eventInfo.event.extendedProps.professor}</div>
      <div className="text-xs opacity-75">Grade {eventInfo.event.extendedProps.grade}</div>
    </div>
  );
};

  return (
    <>
      <style>{`
        .fc {
          font-family: inherit;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #e5e7eb !important;
        }
        .fc-timegrid-slot {
          height: 3.5rem !important;
        }

        /* Column header: themed gradient with high-contrast white text */
        .fc-col-header-cell {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          padding: 1rem 0.5rem !important;
          border: none !important;
        }
        /* Ensure nested header elements (weekday + date) are visible */
        .fc-col-header-cell, .fc-col-header-cell *,
        .fc-col-header-cell .fc-col-header-cell-cushion,
        .fc-col-header-cell .fc-col-header-day-number,
        .fc-col-header-cell .fc-col-header-day-text {
          color: #ffffff !important;
          opacity: 1 !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.45) !important;
        }

        /* Axis (time labels) darker for readability */
        .fc-timegrid-axis {
          background: #f9fafb !important;
          font-weight: 600 !important;
          color: #0f172a !important; /* dark slate */
        }

        /* Events: force white text to contrast with themed backgrounds */
        .fc-event {
          border-radius: 8px !important;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          color: #ffffff !important;
        }
        .fc-event .fc-event-main-frame, .fc-event .fc-event-title, .fc-event .fc-event-time, .fc-event * {
          color: #ffffff !important;
          opacity: 1 !important;
        }
        .fc-event:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important;
        }

        .fc-timegrid-event {
          border-radius: 8px !important;
        }

        .fc-button {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 0.5rem 1rem !important;
          transition: all 0.2s !important;
        }
        .fc-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
        }
        .fc-button-active {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
        }
        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #1f2937 !important;
        }

        /* Neutralize accidental Tailwind red utility classes inside the calendar */
        .fc .text-red-500, .fc .text-red-600, .fc .text-red-700 {
          color: inherit !important;
        }

        /* Handle overlapping events spacing */
        .fc-timegrid-event-harness {
          margin-bottom: 2px !important;
        }
      `}</style>

      <div className="relative p-8 bg-gradient-to-br from-slate-50  to-indigo-50 rounded-3xl w-[75vw] min-h-screen flex flex-col shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl" style={{animation: 'pulse 4s ease-in-out infinite', animationDelay: '2s'}}></div>

        {/* Header */}
        <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6 border border-white/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Weekly Timetable</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your class schedule</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg ${
                  hasChanges() 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={() => hasChanges() && setShowConfirmPopup(true)}
                disabled={!hasChanges()}
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 shadow-lg"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-5 h-5" />
                Add Class
              </button>
            </div>
          </div>

          {/* Pending changes indicator */}
          {hasChanges() && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {pendingChanges.added.length > 0 && (
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  +{pendingChanges.added.length} Added
                </span>
              )}
              {pendingChanges.updated.length > 0 && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {pendingChanges.updated.length} Updated
                </span>
              )}
              {pendingChanges.deleted.length > 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  -{pendingChanges.deleted.length} Deleted
                </span>
              )}
            </div>
          )}
        </div>

        {/* Add New Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Add New Class
                </h3>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    value={newClass.date}
                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    value={newClass.start_time}
                    onChange={(e) => setNewClass({ ...newClass, start_time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Duration
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    value={
                      newClass.start_time && newClass.end_time
                        ? Math.round(
                            (new Date(`2000-01-01T${newClass.end_time}`) - 
                             new Date(`2000-01-01T${newClass.start_time}`)) / (1000 * 60 * 60)
                          )
                        : 1
                    }
                    onChange={(e) => {
                      const duration = parseInt(e.target.value);
                      const [hour, minute] = newClass.start_time.split(':');
                      const endHour = parseInt(hour) + duration;
                      const endTime = `${String(endHour).padStart(2, '0')}:${minute}`;
                      setNewClass({ ...newClass, end_time: endTime });
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((d) => (
                      <option key={d} value={d}>
                        {d} hour{d > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="e.g., Physics"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Professor
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="e.g., John Doe"
                    value={newClass.professor}
                    onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Grade
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="e.g., 12"
                    value={newClass.grade}
                    onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
                  onClick={() => {
                    setShowForm(false);
                    setNewClass(defaultNewClass);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white rounded-xl font-semibold transition-all hover:scale-105"
                  onClick={handleAddClass}
                >
                  Add Class
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Changes Modal */}
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h3 className="text-2xl font-bold text-white">Confirm Changes</h3>
                <p className="text-indigo-100 mt-1">Review and confirm your timetable modifications</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Added Classes */}
                {pendingChanges.added.length > 0 && (
                  <div>
                    <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2 text-lg">
                      <Plus className="w-5 h-5" />
                      Added Classes ({pendingChanges.added.length})
                    </h4>
                    {pendingChanges.added.map((item, index) => (
                      <div key={index} className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-3 flex justify-between items-start hover:shadow-md transition-all">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{item.displayInfo.subject}</p>
                          <p className="text-gray-700 flex items-center gap-1 mt-1">
                            <User className="w-4 h-4" />
                            {item.displayInfo.professor}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            Grade {item.displayInfo.grade}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {item.displayInfo.date}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.displayInfo.start_time} - {item.displayInfo.end_time}
                          </p>
                        </div>
                        <button
                          onClick={() => removeChange('added', index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Updated Classes */}
                {pendingChanges.updated.length > 0 && (
                  <div>
                    <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5" />
                      Time Changed ({pendingChanges.updated.length})
                    </h4>
                    {pendingChanges.updated.map((item, index) => (
                      <div key={index} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-3 flex justify-between items-start hover:shadow-md transition-all">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{item.title}</p>
                          <p className="text-gray-700 mt-1">Old: {item.oldDate} — {item.oldStartTime} to {item.oldEndTime}</p>
                          <p className="text-gray-700">New: {item.newDate} — {item.newStartTime} to {item.newEndTime}</p>
                        </div>
                        <button
                          onClick={() => removeChange('updated', index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Deleted Classes */}
                {pendingChanges.deleted.length > 0 && (
                  <div>
                    <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2 text-lg">
                      <X className="w-5 h-5" />
                      Deleted Classes ({pendingChanges.deleted.length})
                    </h4>
                    {pendingChanges.deleted.map((item, index) => (
                      <div key={index} className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-3 flex justify-between items-start hover:shadow-md transition-all">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{item.title}</p>
                          <p className="text-gray-700 mt-1">Date: {item.date}</p>
                          <p className="text-gray-700">Time: {item.start_time} — {item.end_time}</p>
                        </div>
                        <button
                          onClick={() => removeChange('deleted', index)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 flex justify-end gap-3">
                <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowConfirmPopup(false)}>Cancel</button>
                <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={confirmChanges}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar area */}
        <div className="flex-1 relative z-0">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotDuration="00:30:00"
            editable={true}
            eventResizableFromStart={true}
            events={events}
            eventContent={renderEventContent}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventClick={handleEventClick}
            height="auto"
            expandRows={true}
            dayHeaderFormat={{ weekday: 'long' }}
          />
        </div>
      </div>
    </>
  );
}

export default Timetable;
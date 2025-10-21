"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

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
      }));
      setEvents(mapped);
      setOriginalEvents(mapped);
    } catch (err) {
      console.error("Failed to load timetable", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Add new class (temporarily)
  const handleAddClass = () => {
    const dayName = new Date(newClass.date).toLocaleDateString("en-US", { weekday: "long" });
    
    const tempId = `temp-${Date.now()}`;
    const startDateTime = `${newClass.date}T${newClass.start_time}:00`;
    const endDateTime = `${newClass.date}T${newClass.end_time}:00`;
    
    const newEvent = {
      id: tempId,
      title: `${newClass.subject} - ${newClass.professor} (Grade ${newClass.grade})`,
      start: startDateTime,
      end: endDateTime,
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

    // Update events display
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, start: start.toISOString(), end: end.toISOString() } : e
      )
    );

    // Check if this is a new event or existing one
    if (id.startsWith('temp-')) {
      // Update in added array
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
      // Check if already in updated array
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

    // Update events display
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, start: start.toISOString(), end: end.toISOString() } : e
      )
    );

    // Same logic as drag-drop
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
    
    // Remove from display
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    // Check if this is a newly added event or existing one
    if (eventId.startsWith('temp-')) {
      // Remove from added array
      setPendingChanges({
        ...pendingChanges,
        added: pendingChanges.added.filter(item => item.tempId !== eventId)
      });
    } else {
      // Add to deleted array
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
        // Remove from updated if it was there
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
      // Process additions
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

      // Process updates
      for (const item of pendingChanges.updated) {
        await axios.put(`http://localhost:8000/timetable/${item.id}`, {
          date: item.newDate,
          start_time: item.newStartTime,
          end_time: item.newEndTime
        });
      }

      // Process deletions
      for (const item of pendingChanges.deleted) {
        await axios.delete(`http://localhost:8000/timetable/${item.id}`);
      }

      // Reset everything
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

  return (
    <div className="p-6 pb-10 bg-white rounded-xl w-[70vw] h-screen flex flex-col justify-center items-center">
      {/* Header */}
      <div className="w-full flex flex-row justify-between mb-4 items-center">
        <h2 className="text-lg text-black ml-5">Weekly Timetable</h2>
        <button
          className={`${hasChanges() ? 'bg-green-600' : 'bg-gray-400'} text-white px-4 py-2 rounded`}
          onClick={() => hasChanges() && setShowConfirmPopup(true)}
          disabled={!hasChanges()}
        >
          Save Table
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          + Add new
        </button>
      </div>

      {/* Add New Form */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700">Date:</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newClass.date}
                onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700">Start Time:</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={newClass.start_time}
                onChange={(e) => setNewClass({ ...newClass, start_time: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700">Duration (hours)</label>
              <select
                className="w-full p-2 border rounded"
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
              <label className="block text-sm mb-1 font-semibold text-gray-700">Subject</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700">Professor</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newClass.professor}
                onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold text-gray-700">Grade</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newClass.grade}
                onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
              />
            </div>

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleAddClass}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowForm(false);
                  setNewClass(defaultNewClass);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Changes Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Changes</h3>
            
            {/* Added Classes */}
            {pendingChanges.added.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-green-600 mb-2">Added Classes</h4>
                {pendingChanges.added.map((item, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded p-3 mb-2 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-black">{item.displayInfo.subject} - {item.displayInfo.professor}</p>
                      <p className="text-sm text-gray-700">Grade: {item.displayInfo.grade}</p>
                      <p className="text-sm text-gray-700">Date: {item.displayInfo.date}</p>
                      <p className="text-sm text-gray-700">Time: {item.displayInfo.start_time} - {item.displayInfo.end_time}</p>
                    </div>
                    <button
                      onClick={() => removeChange('added', index)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Updated Classes */}
            {pendingChanges.updated.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-blue-600 mb-2">Time Changed</h4>
                {pendingChanges.updated.map((item, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3 mb-2 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-black">{item.title}</p>
                      <p className="text-sm text-gray-700">Old: {item.oldDate} ({item.oldStartTime} - {item.oldEndTime})</p>
                      <p className="text-sm text-gray-700">New: {item.newDate} ({item.newStartTime} - {item.newEndTime})</p>
                    </div>
                    <button
                      onClick={() => removeChange('updated', index)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Deleted Classes */}
            {pendingChanges.deleted.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-2">Deleted Classes</h4>
                {pendingChanges.deleted.map((item, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded p-3 mb-2 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-black">{item.title}</p>
                      <p className="text-sm text-gray-700">Date: {item.date}</p>
                      <p className="text-sm text-gray-700">Time: {item.start_time} - {item.end_time}</p>
                    </div>
                    <button
                      onClick={() => removeChange('deleted', index)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-700 mt-6 mb-4">Do you want to confirm these changes?</p>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded"
                onClick={() => setShowConfirmPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded"
                onClick={confirmChanges}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FullCalendar */}
      <div className="w-full h-full">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          slotMinTime="09:00:00"
          slotMaxTime="19:00:00"
          slotDuration="01:00:00"
          editable={true}
          eventResizableFromStart={true}
          events={events}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          height="100%"
          expandRows={true}
        />
      </div>
    </div>
  );
}

export default Timetable;
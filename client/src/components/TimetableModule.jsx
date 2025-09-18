import React, { useState } from "react";

const Timetable = () => {
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00",
  ];

  const days = [
    { date: "14", day: "Sun" },
    { date: "15", day: "Mon" },
    { date: "16", day: "Tue" },
    { date: "17", day: "Wed" },
    { date: "18", day: "Thu" },
    { date: "19", day: "Fri" },
    { date: "20", day: "Sat" },
  ];

  const [classes, setClasses] = useState([
    {
      day: 0,
      startTime: "09:00",
      duration: 2,
      subject: "Computer Science",
      professor: "Prof. Joeylene Rivera",
      grade: "Grade 11",
      time: "09:00 - 10:20",
    },
    {
      day: 1,
      startTime: "13:00",
      duration: 2,
      subject: "Computer Science",
      professor: "Prof. Joeylene Rivera",
      grade: "Grade 11",
      time: "13:00 - 14:20",
    },
    {
      day: 2,
      startTime: "11:00",
      duration: 2,
      subject: "Computer Science",
      professor: "Prof. Joeylene Rivera",
      grade: "Grade 11",
      time: "11:00 - 12:20",
    },
    {
      day: 4,
      startTime: "17:00",
      duration: 2,
      subject: "Computer Science",
      professor: "Prof. Joeylene Rivera",
      grade: "Grade 11",
      time: "17:00 - 18:20",
    },
    {
      day: 5,
      startTime: "09:00",
      duration: 2,
      subject: "Computer Science",
      professor: "Prof. Joeylene Rivera",
      grade: "Grade 11",
      time: "09:00 - 10:20",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({
    day: 0,
    startTime: "09:00",
    subject: "",
    professor: "",
    grade: "",
  });

  const handleDelete = (dayIndex, time) => {
    setClasses(prev => prev.filter(cls => !(cls.day === dayIndex && cls.startTime === time)));
  };

  const handleAddClass = () => {
    const endHour = parseInt(newClass.startTime.split(":")[0]) + 1;
    const endTime = endHour.toString().padStart(2, "0") + ":20";
    const timeRange = `${newClass.startTime} - ${endTime}`;

    const newEntry = {
      ...newClass,
      duration: 2,
      time: timeRange,
    };

    setClasses(prev => [...prev, newEntry]);
    setShowForm(false);
    setNewClass({
      day: 0,
      startTime: "09:00",
      subject: "",
      professor: "",
      grade: "",
    });
  };

  return (
    <div className="flex h-screen bg-blue-100">

      {/* Main Content */}
      <div className="flex-1 p-6 w-[80vw] overflow-y-auto">
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">February, 14-20</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowForm(true)}
            >
              + Add new
            </button>

            {showForm && (
              <div className="mt-4 p-4 border rounded bg-blue-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Day:</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newClass.day}
                      onChange={(e) =>
                        setNewClass({ ...newClass, day: parseInt(e.target.value) })
                      }
                    >
                      {days.map((d, index) => (
                        <option key={index} value={index}>
                          {d.day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Start Time:</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newClass.startTime}
                      onChange={(e) =>
                        setNewClass({ ...newClass, startTime: e.target.value })
                      }
                    >
                      {timeSlots.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1">Subject</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={newClass.subject}
                      onChange={(e) =>
                        setNewClass({ ...newClass, subject: e.target.value })
                      }
                      placeholder="Enter subject name"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1">Professor</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={newClass.professor}
                      onChange={(e) =>
                        setNewClass({ ...newClass, professor: e.target.value })
                      }
                      placeholder="Enter professor name"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1">Grade</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={newClass.grade}
                      onChange={(e) =>
                        setNewClass({ ...newClass, grade: e.target.value })
                      }
                      placeholder="Enter grade"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleAddClass}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full">

              {/* Header Row */}
              <div className="grid grid-cols-8 gap-px bg-gray-200 mb-px">
                <div className="bg-white p-3 font-medium text-gray-900">Week</div>
                {days.map((day, index) => (
                  <div key={index} className="bg-white p-3 text-center">
                    <div className={`font-medium ${index === 2 ? "text-blue-600" : "text-gray-900"}`}>{day.date}</div>
                    <div className={`text-sm ${index === 2 ? "text-blue-600" : "text-gray-600"}`}>{day.day}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time, timeIndex) => (
                <div key={timeIndex} className="grid grid-cols-8 gap-px bg-gray-200 mb-px relative">
                  <div className="bg-white p-3 font-medium text-gray-900 border-r">{time}</div>
                  {days.map((day, dayIndex) => {
                    const classForThisSlot = classes.find(
                      cls => cls.day === dayIndex && cls.startTime === time
                    );
                    return (
                      <div key={dayIndex} className="bg-white p-3 relative min-h-[60px]">
                        {classForThisSlot && (
                          <div className="absolute inset-1 bg-blue-600 rounded p-2 text-white text-xs">
                            <div
                              className="absolute top-1 right-1 cursor-pointer text-white text-sm"
                              onClick={() => handleDelete(dayIndex, time)}
                            >
                              ✕
                            </div>
                            <div className="font-medium">{classForThisSlot.subject}</div>
                            <div className="text-blue-100">{classForThisSlot.professor}</div>
                            <div className="text-blue-100">{classForThisSlot.grade}</div>
                            <div className="text-blue-200 mt-1">{classForThisSlot.time}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Timetable;

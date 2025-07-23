import React from "react";

const Timetable = () => {
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
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

  const classes = [
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
  ];

  return (
    <div className="flex h-screen bg-blue-100">

      {/* Main Content */}
      
        <div className="flex-1 p-6 w-[80vw] overflow-y-auto ">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">February, 14-20</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Add new</button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-8 gap-px bg-gray-200 mb-px">
                  <div className="bg-white p-3 font-medium text-gray-900">Week</div>
                  {days.map((day, index) => (
                    <div key={index} className="bg-white p-3 text-center">
                      <div className={`font-medium ${index === 2 ? "text-blue-600" : "text-gray-900"}`}>{day.date}</div>
                      <div className={`text-sm ${index === 2 ? "text-blue-600" : "text-gray-600"}`}>{day.day}</div>
                    </div>
                  ))}
                </div>

                {timeSlots.map((time, timeIndex) => (
                  <div key={timeIndex} className="grid grid-cols-8 gap-px bg-gray-200 mb-px relative">
                    <div className="bg-white p-3 font-medium text-gray-900 border-r">{time}</div>
                    {days.map((day, dayIndex) => {
                      const classForThisSlot = classes.find(
                        (cls) => cls.day === dayIndex && cls.startTime === time
                      );
                      return (
                        <div key={dayIndex} className="bg-white p-3 relative min-h-[60px]">
                          {classForThisSlot && (
                            <div className="absolute inset-1 bg-blue-600 rounded p-2 text-white text-xs">
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

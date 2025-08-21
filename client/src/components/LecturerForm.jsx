import { useState } from "react"


export default function LecturerForm() {

  const [courseModules, setCourseModules] = useState([]);

  const addCourseModule = () => {
    const newModule = prompt("Enter module name:");
    if (newModule) {
      setCourseModules([...courseModules, newModule]);
    }
  };

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter(module => module !== moduleToRemove));
  };

  return (
    
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-sm">
        <form className="space-y-8">
          {/* Student Name */}
          <div className="flex items-center gap-8">
            <label htmlFor="student-name" className="w-40 text-[#000000] font-medium">Lecturer Name :</label>
            <div className="flex-1">
              <input id="student-name" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"/>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex items-center gap-8">
            <label htmlFor="profile-photo" className="w-40 text-[#000000] font-medium">Profile Photo :</label>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1">
                <input id="profile-photo" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-60" />
              </div>
              <button className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-6 py-2 rounded-lg">Choose</button>
            </div>
          </div>

          {/* Course Modules */}
          <div className="flex items-start gap-8">
            <label htmlFor="course-modules" className="w-40 text-[#000000] font-medium pt-2">Subjects Taught :</label>
            <div className="flex-1 flex items-center gap-4">
              <div id="course-modules" className="flex-1 flex flex-wrap gap-2">
                {courseModules.map((module) => (
                  <div
                    className="bg-[#253d90] hover:bg-[#1e2f7a] text-white py-1 rounded-md flex items-center pl-2"
                  >
                    {module}
                    <button
                      type="button"
                      onClick={() => removeCourseModule(module)}
                      className="hover:bg-white/20 rounded-full"
                    >
                      <img src="\images\x.png" alt="close" className="w-3"/>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCourseModule}
                className="bg-[#ffffff] hover:bg-[#ffffffe4] text-white rounded-lg flex items-center justify-center"
              >
                <img src="\images\plus.png" alt="plus_icon" className="w-5"/>
              </button>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-8">
            <label htmlFor="gender" className="w-40 text-[#000000] font-medium">Gender :</label>
            <div className="flex-1">
              <input id="gender" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90]  w-90" />
            </div>
          </div>

          {/* Qualifications */}
          <div className="flex items-center gap-8">
            <label htmlFor="qualifications" className="w-40 text-[#000000] font-medium">Qualifications :</label>
            <div className="flex-1">
              <textarea id="qualifications" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90]  w-90" />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-8">
            <label htmlFor="email" className="w-40 text-[#000000] font-medium">Email :</label>
            <div className="flex-1">
              <input type="email" id="email" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90]  w-90" />
            </div>
          </div>

          {/* NIC */}
          <div className="flex items-center gap-8">
            <label htmlFor="nic" className="w-40 text-[#000000] font-medium">NIC :</label>
            <div className="flex-1">
              <input id="nic" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90]  w-90" />
            </div>
          </div>

          {/* Mobile No */}
          <div className="flex items-center gap-8">
            <label htmlFor="mobile" className="w-40 text-[#000000] font-medium">Mobile No :</label>
            <div className="flex-1">
              <input id="mobile" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90]  w-90" />
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-8">
            <label htmlFor="address" className="w-40 text-[#000000] font-medium pt-2">Address :</label>
            <div className="flex-1">
              <input id="address" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90]  w-90" />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex justify-center pt-8">
            <button className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-12 py-3 rounded-lg text-lg font-medium">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

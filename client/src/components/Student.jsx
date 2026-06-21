import Badge from "./Badge";
import { Link } from "react-router-dom";

export default function Student({ name, studentId, courses, status, profilePhoto, gender }) {
  return (
    <Link to={`/view-students/${studentId}`}>
      <div className="w-[250px] h-[320px] sm:w-[220px] sm:h-[300px] transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer">
        
        {/* Card container with background */}
        <div
          className="h-full w-fullrelative bg-white rounded-2xl  shadow-lg bg-cover bg-center overflow-hidden flex flex-col items-start"
          style={{
            backgroundImage: "url(/images/student_background.jpg)",
          }}
        >
          {/* Profile Image */}
          <div className="w-full pl-4 py-4 flex-1/4 backdrop-blur-[0.4px]">
            <div className="w-25 h-25 rounded-full border-3 border-[#ffc20e] overflow-hidden">
              <img
                src={profilePhoto ? `http://localhost:8000/public${profilePhoto}` : '/images/default_user.png'}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-white w-full flex flex-col justify-around rounded-b-2xl p-2 text-start flex-3/4 border-t-1 border-blue-800 pl-3">
            <h2 className="text-lg font-semibold text-black truncate">{name}</h2>
            <p className="text-md text-black truncate">ID: {studentId}</p>
            
            <div className="max-h-[50px] overflow-y-auto text-sm leading-tight scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <p className="text-md text-black">Courses:</p>
              <div className="flex flex-wrap gap-1 text-gray-800">
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-[2px] bg-blue-100 rounded-full text-xs border"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-xs">No courses</p>
                )}
              </div>
            </div>
            {/* Badge */}
            <Badge status={status} />
          </div>
        </div>
      </div>
    </Link>
  );
}

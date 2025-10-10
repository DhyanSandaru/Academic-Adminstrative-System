import { useState } from "react";
import axios from "axios";
import AddCourses from "./AddCourses.jsx";
import { CirclePlus } from 'lucide-react';

export default function StudentForm() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [formStatus, setFormStatus] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [showCoursePopup, setShowCoursePopup] = useState(false);

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter((module) => module !== moduleToRemove));
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/validate-code", { code });
      if (res.data.valid) {
        setStep(2);
      } else {
        setFormStatus("Invalid or expired code.");
      }
    } catch (err) {
      console.error(err);
      setFormStatus("Server error while validating code.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("studentName", form["student-name"].value);
    formData.append("profilePhoto", profilePhoto);
    formData.append("gender", form["gender"].value);
    formData.append("examYear", form["exam-year"].value);
    formData.append("email", form["email"].value);
    formData.append("nic", form["nic"].value);
    formData.append("mobile", form["mobile"].value);
    formData.append("address", form["address"].value);
    formData.append("courseModules", JSON.stringify(courseModules));

    try {
      const res = await axios.post("http://localhost:8000/add-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setFormStatus("Registration submitted for approval.");
      form.reset();
      setProfilePhoto(null);
      setCourseModules([]);
      setStep(1);
    } catch (err) {
      setFormStatus("Submission failed.");
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl text-black p-5 flex flex-col justify-center items-center mb-5 shadow-md">
        <h2 className="font-semibold text-2xl text-blue-900">Welcome to remote registration portal</h2>
        <p className="font-sans text-red-500">(Please stay connected to the wifi network until you are finished with submisson)</p>
      </div>
      {step === 1 && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-black text-xl font-semibold mb-4 text-center">Enter Access Code</h2>
          <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              required
              className="border border-gray-300 px-4 py-2 rounded w-full max-w-xs"
            />
            <button type="submit" className="bg-[#253d90] text-white px-6 py-2 rounded hover:bg-[#1e2f7a]">
              Validate Code
            </button>
          </form>
          {formStatus && <p className="text-red-600 mt-4">{formStatus}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-lg shadow space-y-8 w-2xl">
          <form onSubmit={handleFormSubmit} className="space-y-8">

            {/* Student Name */}
            <div className="flex items-center gap-8">
              <label htmlFor="student-name" className="w-40 text-black font-medium">Student Name:</label>
              <div className="flex-1">
                <input
                  id="student-name"
                  name="student-name"
                  required
                  className="border-b-2 border-black bg-transparent focus:ring-0 focus:border-[#253d90] w-full"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex items-center gap-8">
              <label htmlFor="profile-photo" className="w-40 text-black font-medium">Profile Photo:</label>
              <div className="flex-1 flex flex-row">
                <input
                  id="profile-photo"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                  className="w-full cursor-pointer"
                />             
              </div>
            </div>

            {/* Course Modules */}
            <div className="flex items-start gap-8">
              <label htmlFor="course-modules" className="w-40 text-black font-medium pt-2">Course Modules:</label>
              <div className="flex-1 flex items-center justify-between border-b-2 border-black">
                <div className="flex flex-wrap gap-2">
                  {courseModules.map((module) => (
                    <div key={module} className="bg-[#253d90] text-white py-1 px-2 rounded flex items-center">
                      {module}
                      <button
                        type="button"
                        onClick={() => removeCourseModule(module)}
                        className="ml-2"
                      >
                        <img src="/images/x.png" alt="remove" className="w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCoursePopup(true)}
                  className="bg-white border border-gray-300 px-2 py-1 rounded"
                >
                    <CirclePlus className="text-black"/>
                </button>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-8">
              <p className="w-40 text-black font-medium">Gender:</p>
              <div className="flex gap-6">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-black">
                    <input type="radio" name="gender" value={g} required />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Exam & Year */}
            <div className="flex items-center gap-8">
              <label htmlFor="exam-year" className="w-40 text-black font-medium">Exam & Year:</label>
              <div className="flex-1">
                <input
                  id="exam-year"
                  name="exam-year"
                  required
                  className="border-b-2 border-black bg-transparent focus:ring-0 focus:border-[#253d90] w-full"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-8">
              <label htmlFor="email" className="w-40 text-black font-medium">Email:</label>
              <div className="flex-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="border-b-2 border-black bg-transparent focus:ring-0 focus:border-[#253d90] w-full"
                />
              </div>
            </div>

            {/* NIC */}
            <div className="flex items-center gap-8">
              <label htmlFor="nic" className="w-40 text-black font-medium">NIC:</label>
              <div className="flex-1">
                <input
                  id="nic"
                  name="nic"
                  required
                  className="border-b-2 border-black bg-transparent focus:ring-0 focus:border-[#253d90] w-full"
                />
              </div>
            </div>

            {/* Mobile No */}
            <div className="flex items-center gap-8">
              <label htmlFor="mobile" className="w-40 text-black font-medium">Mobile No:</label>
              <div className="flex-1">
                <input
                  id="mobile"
                  name="mobile"
                  required
                  className="border-b-2 border-black bg-transparent focus:ring-0 focus:border-[#253d90] w-full"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-8">
              <label htmlFor="address" className="w-40 text-black font-medium pt-2">Address:</label>
              <div className="flex-1">
                <input
                  id="address"
                  name="address"
                  required
                  className="border-b-2 border-black bg-transparent focus:ring-0 focus:border-[#253d90] w-full"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <div className="text-center pt-4">
              <button className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-12 py-3 rounded-lg text-lg font-medium">
                Confirm
              </button>
            </div>
          </form>

          {/* Course Selection Popup */}
          {showCoursePopup && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <AddCourses
                selectedCourses={courseModules}
                setSelectedCourses={setCourseModules}
                handleClose={() => setShowCoursePopup(false)}
              />
            </div>
          )}

          {formStatus && <p className="text-center text-green-600">{formStatus}</p>}
        </div>
      )}
    </div>
  );
}

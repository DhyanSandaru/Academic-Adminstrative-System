import { useState } from "react";
import axios from "axios";
import AddCourses from "./AddCourses";
import { useEffect } from "react";

export default function Form() {
  const [courseModules, setCourseModules] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [grade, setGrade] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [showCoursePopup, setShowCoursePopup] = useState(false);

  //removing a selected module from courses field
  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter((m) => m !== moduleToRemove));
  };

  useEffect(()=>{
    if(parseInt(grade, 10) >= 1 && parseInt(grade, 10) <= 8)
      setCurriculum("general")
  }, 
  [grade])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    // Append form data
    formData.append("studentName", form["student-name"].value);
    formData.append("profilePhoto", profilePhoto);
    formData.append("gender", form["gender"].value);
    formData.append("dob", form["dob"].value);
    formData.append("ethnicity", form["ethnicity"].value)
    formData.append("email", form["email"].value);
    formData.append("nic", form["nic"].value);
    formData.append("mobile", form["mobile"].value);
    formData.append("address", form["address"].value);
    formData.append("guardianName", form["guardian-name"].value);
    formData.append("guardianMobile", form["guardian-mobile"].value);
    formData.append("guardianRelation", form["guardian-relation"].value);
    formData.append("previousEducation", form["previous-education"].value);
    formData.append("grade", grade);
    formData.append("curriculum", curriculum);
    formData.append("courseModules", JSON.stringify(courseModules));

    try {
      const res = await axios.post("http://localhost:8000/api/students/add-student", formData);
      alert(res.data.message || "Student added successfully!");
      form.reset();
      setCourseModules([]);
      setProfilePhoto(null);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed!");
    }
  };

  //used for examYear
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen text-gray-900 rounded-2xl shadow-md">
      <form
        onSubmit={handleSubmit}
        className="space-y-12 w-3xl max-w-[90vh] mx-auto p-5"
      >
        {/* ================= PROFILE SECTION ================= */}
        <div className="border-b border-gray-200 pb-12 flex flex-col">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-md text-gray-600">
            Basic details about the student and their selected modules.
          </p>

          <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-8">
            {/* Student Name */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="student-name" className="block text-md font-medium">
                Student Name
              </label>
              <input
                id="student-name"
                type="text"
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Profile Photo */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="profile-photo" className="block text-md font-medium">
                Profile Photo
              </label>
              <div className="w-full my-5 flex flex-col items-center justify-between gap-y-5">
                {profilePhoto ? (
                  <img
                    src={URL.createObjectURL(profilePhoto)}
                    alt="preview"
                    className="w-40 h-40 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Photo
                  </div>
                )}
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="profile-photo"
                  className="cursor-pointer rounded-md bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200"
                >
                  Change
                </label>
              </div>
            </div>

            {/* Course Modules */}
            <div className="col-span-full w-full">
              <label className="block text-md font-medium">Course Modules</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {courseModules.map((module) => (
                  <div
                    key={module}
                    className="bg-indigo-600 text-white pl-2 py-1 rounded-md flex items-center"
                  >
                    {module}
                    <button
                      type="button"
                      onClick={() => removeCourseModule(module)}
                      className="ml-2 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCoursePopup(true)}
                  className="rounded-md bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-medium hover:bg-indigo-200"
                >
                  + Add Module
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PERSONAL INFORMATION ================= */}
        <div className="border-b border-gray-200 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="mt-1 text-md text-gray-600">
            Identification and contact details of the student.
          </p>

          {/* Gender */}
          <div className="sm:col-span-3 mt-8 w-full">
            <label className="block text-md font-medium">Gender</label>
            <div className="mt-2 flex justify-center gap-x-10">
              {["Male", "Female", "other"].map((g) => (
                <label key={g} className="flex items-center gap-x-2 text-md">
                  <input type="radio" name="gender" value={g} className="text-indigo-500" />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* DOB & Nationality */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 w-full">
            <div className="sm:col-span-3">
              <label htmlFor="dob" className="block text-md font-medium">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="ethnicity" className="block text-md font-medium">
                Ethnicity
              </label>
              <select
                id="ethnicity"
                name="ethnicity"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sinhala">Sinhala</option>
                <option value="muslim">Muslim</option>
                <option value="tamik">Tamil</option>
                <option value="other">Other</option>
              </select>

            </div>


            {/* Email */}
            <div className="sm:col-span-full">
              <label htmlFor="email" className="block text-md font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* NIC */}
            <div className="sm:col-span-3">
              <label htmlFor="nic" className="block text-md font-medium">
                NIC
              </label>
              <input
                id="nic"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mobile */}
            <div className="sm:col-span-3">
              <label htmlFor="mobile" className="block text-md font-medium">
                Mobile No
              </label>
              <input
                id="mobile"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address */}
            <div className="col-span-full">
              <label htmlFor="address" className="block text-md font-medium">
                Address
              </label>
              <textarea
                id="address"
                rows="2"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* ================= EDUCATION DETAILS ================= */}
        <div className="border-b border-gray-200 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Education Details</h2>
          <p className="mt-1 text-md text-gray-600">
            Information about student’s previous education and performance.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 w-full">
            <div className="sm:col-span-full">
              <label htmlFor="previous-education" className="block text-md font-medium">
                Previous School / Institution
              </label>
              <input
                id="previous-education"
                type="text"
                placeholder="Enter institution name"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Exam & Year */}
            <div className="sm:col-span-3">
              <label htmlFor="curriculum" className="block text-md font-medium">
                Curriculm
              </label>
              <select
                id="curriculum"
                name="curriculum"
                value={curriculum}
                onChange={(e)=> setCurriculum(e.target.value)}
                disabled={parseInt(grade) >= 1 && parseInt(grade) <= 8}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>--Select Curriculum--</option>
                  {grade && parseInt(grade) >= 1 && parseInt(grade) <= 8?
                  (
                    <option value="general">General</option>
                ): (
                  <>
                    <option value="edexcel">Edexcel</option>
                    <option value="cambridge">Cambridge</option>
                  </>
                )
                  }
                </select> 
            </div>
            
            {/*Grade*/}
            <div className="sm:col-span-3">
              <label htmlFor="grade" className="block text-md font-medium">
                Current Grade
              </label>
              <select
                id="grade"
                name="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">--Select Grade--</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="AS">AS level</option>
                  <option value="A2">A2 level</option>
                </select>  
            </div>

          </div>
        </div>

        {/* ================= GUARDIAN INFORMATION ================= */}
        <div className="border-b border-gray-200 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Guardian Information</h2>
          <p className="mt-1 text-md text-gray-600">
            Details of the student's guardian or parent.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 w-full">
            <div className="sm:col-span-full">
              <label htmlFor="guardian-name" className="block text-md font-medium">
                Guardian Name
              </label>
              <input
                id="guardian-name"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="guardian-mobile" className="block text-md font-medium">
                Guardian Mobile
              </label>
              <input
                id="guardian-mobile"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="guardian-relation" className="block text-md font-medium">
                Relationship to Student
              </label>
              <input
                id="guardian-relation"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* ================= SUBMIT BUTTON ================= */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-12 py-3 text-md font-semibold text-white hover:bg-indigo-700 focus:outline-none"
          >
            Confirm
          </button>
        </div>
      </form>

      {/* ================= COURSE POPUP ================= */}
      {showCoursePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AddCourses
            selectedCourses={courseModules}
            setSelectedCourses={setCourseModules}
            handleClose={() => setShowCoursePopup(false)}
          />
        </div>
      )}
    </div>
  );
}

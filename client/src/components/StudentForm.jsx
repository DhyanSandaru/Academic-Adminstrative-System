import { useState } from "react";
import axios from "axios";
import AddCourses from "./AddCourses";

export default function Form() {
  const [courseModules, setCourseModules] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [errors, setErrors] = useState({});

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter((m) => m !== moduleToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newErrors = {};

    // Gather required fields
    const requiredFields = {
      studentName: form["student-name"].value.trim(),
      dob: form["dob"].value.trim(),
      ethnicity: form["ethnicity"].value.trim(),
      gender: form["gender"].value,
      email: form["email"].value.trim(),
      mobile: form["mobile"].value.trim(),
      address: form["address"].value.trim(),
      grade: form["grade"].value.trim(),
      guardianName: form["guardian-name"].value.trim(),
      guardianMobile: form["guardian-mobile"].value.trim(),
      guardianRelation: form["guardian-relation"].value.trim(),
    };

    // Validation checks
    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!value) newErrors[key] = "This field is required.";
    });

    // Simple email & mobile pattern validation
    if (requiredFields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requiredFields.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (requiredFields.mobile && !/^\d{10}$/.test(requiredFields.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    // Stop if any validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Ask for confirmation if no photo uploaded
    if (!profilePhoto) {
      const proceed = window.confirm("No profile photo selected. Submit without image?");
      if (!proceed) return;
    }

    setErrors({});
    const formData = new FormData();

    formData.append("studentName", requiredFields.studentName);
    formData.append("profilePhoto", profilePhoto);
    formData.append("gender", requiredFields.gender);
    formData.append("dob", requiredFields.dob);
    formData.append("ethnicity", requiredFields.ethnicity);
    formData.append("exam", form["exam"].value);
    formData.append("examYear", form["exam-year"].value);
    formData.append("email", requiredFields.email);
    formData.append("nic", form["nic"].value);
    formData.append("mobile", requiredFields.mobile);
    formData.append("address", requiredFields.address);
    formData.append("guardianName", requiredFields.guardianName);
    formData.append("guardianMobile", requiredFields.guardianMobile);
    formData.append("guardianRelation", requiredFields.guardianRelation);
    formData.append("previousEducation", form["previous-education"].value);
    formData.append("grade", requiredFields.grade);
    formData.append("courseModules", JSON.stringify(courseModules));

    try {
      const res = await axios.post("http://localhost:8000/add-student", formData);
      alert(res.data.message || "Student added successfully!");
      form.reset();
      setCourseModules([]);
      setProfilePhoto(null);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed!");
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    );

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
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
              {renderError("studentName")}
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
              {["male", "female", "other"].map((g) => (
                <label key={g} className="flex items-center gap-x-2 text-md">
                  <input type="radio" name="gender" value={g} className="text-indigo-500" />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
            {renderError("gender")}
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
              {renderError("dob")}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="ethnicity" className="block text-md font-medium">
                Ethnicity
              </label>
              <select name="ethnicity" id="ethnicity"  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Ethnicity</option>
                <option value="sinhala">Sinhala</option>
                <option value="tamil">Tamil</option>
                <option value="muslim">Muslim</option>
                <option value="burgher">Burgher</option>
              </select>
              {renderError("ethnicity")}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-md font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
              {renderError("email")}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="mobile" className="block text-md font-medium">
                Mobile No
              </label>
              <input
                id="mobile"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
              {renderError("mobile")}
            </div>

            <div className="col-span-full">
              <label htmlFor="address" className="block text-md font-medium">
                Address
              </label>
              <textarea
                id="address"
                rows="2"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
              {renderError("address")}
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
            <div className="sm:col-span-3"> 
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
            <div className="sm:col-span-3">
              <label htmlFor="grade" className="block text-md font-medium">
                Current Grade
              </label>
              <input
                id="grade"
                type="text"
                placeholder="e.g., Grade 7 / Grade 10"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
              {renderError("grade")}
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
              {renderError("guardianName")}
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
              {renderError("guardianMobile")}
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
              {renderError("guardianRelation")}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-12 py-3 text-md font-semibold text-white hover:bg-indigo-700 focus:outline-none"
          >
            Confirm
          </button>
        </div>
      </form>

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

import { useState } from "react";
import axios from "axios";

export default function LecturerForm() {
  const [courseModules, setCourseModules] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const addCourseModule = () => {
    const newModule = prompt("Enter subject name:");
    if (newModule) setCourseModules([...courseModules, newModule]);
  };

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter((m) => m !== moduleToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("lecturerName", form["lecturer-name"].value);
    formData.append("profilePhoto", profilePhoto);
    formData.append("gender", form["gender"].value);
    formData.append("qualifications", form["qualifications"].value);
    formData.append("email", form["email"].value);
    formData.append("nic", form["nic"].value);
    formData.append("mobile", form["mobile"].value);
    formData.append("address", form["address"].value);
    formData.append("examYear", form["exam-year"].value);
    formData.append("exam", form["exam"].value);
    formData.append("guardianName", form["guardian-name"].value);
    formData.append("guardianRelationship", form["guardian-relationship"].value);
    formData.append("guardianContact", form["guardian-contact"].value);
    formData.append("guardianAddress", form["guardian-address"].value);
    formData.append("guardianOccupation", form["guardian-occupation"].value);
    formData.append("courseModules", JSON.stringify(courseModules));

    try {
      const res = await axios.post("http://localhost:8000/add-lecturer", formData);
      alert(res.data.message || "Lecturer added successfully!");
      form.reset();
      setCourseModules([]);
      setProfilePhoto(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission Failed");
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen text-gray-900 rounded-2xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-12 w-3xl max-w-5xl mx-auto p-5">
        {/* Profile Section */}
        <div className="border-b border-gray-200 pb-12 flex flex-col">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-md text-gray-600">
            Basic details about the lecturer and their subjects.
          </p>

          <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-8">
            {/* Lecturer Name */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="lecturer-name" className="block text-md font-medium">
                Lecturer Name
              </label>
              <div className="mt-2">
                <input
                  id="lecturer-name"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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

            {/* Subjects Taught */}
            <div className="col-span-full w-full">
              <label className="block text-md font-medium">Subjects Taught</label>
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
                  onClick={addCourseModule}
                  className="rounded-md bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-medium hover:bg-indigo-200"
                >
                  + Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="border-b border-gray-200 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="mt-1 text-md text-gray-600">
            Contact details and identification information.
          </p>
           {/* Gender */}
            <div className="mt-5">
              <label className="block text-md font-medium">Gender</label>
              <div className="mt-2 flex gap-x-6">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-x-2 text-md">
                    <input type="radio" name="gender" value={g} className="text-indigo-500" />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            {/* Exam & Year */}
            <div className="sm:col-span-3">
              <label htmlFor="exam" className="block text-md font-medium">
                Exam & Year
              </label>
              <div className="mt-2 flex gap-4">
                <select
                  id="exam"
                  name="exam"
                  className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Exam</option>
                  <option value="O/L">O/L</option>
                  <option value="A/L">A/L</option>
                  <option value="IELTS">IELTS</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  id="exam-year"
                  name="exam-year"
                  className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-md font-medium">Email</label>
              <input
                id="email"
                type="email"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* NIC */}
            <div className="sm:col-span-3">
              <label htmlFor="nic" className="block text-md font-medium">NIC</label>
              <input
                id="nic"
                type="text"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mobile */}
            <div className="sm:col-span-3">
              <label htmlFor="mobile" className="block text-md font-medium">Mobile No</label>
              <input
                id="mobile"
                type="text"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Qualifications */}
            <div className="col-span-full">
              <label htmlFor="qualifications" className="block text-md font-medium">Qualifications</label>
              <textarea
                id="qualifications"
                rows="3"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            {/* Address */}
            <div className="col-span-full">
              <label htmlFor="address" className="block text-md font-medium">Address</label>
              <input
                id="address"
                type="text"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Education Details Section */}
        <div className="border-b border-gray-200 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Education Details</h2>
          <p className="mt-1 text-md text-gray-600">
            Academic background and professional experience of the lecturer.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Highest Qualification */}
            <div className="sm:col-span-3">
              <label htmlFor="highest-qualification" className="block text-md font-medium">
                Highest Qualification
              </label>
              <input
                id="highest-qualification"
                type="text"
                placeholder="e.g., M.Sc. in Computer Science"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* University / Institute */}
            <div className="sm:col-span-3">
              <label htmlFor="institute" className="block text-md font-medium">
                University / Institute
              </label>
              <input
                id="institute"
                type="text"
                placeholder="e.g., University of Colombo"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Field of Study */}
            <div className="sm:col-span-3">
              <label htmlFor="field" className="block text-md font-medium">
                Field of Study
              </label>
              <input
                id="field"
                type="text"
                placeholder="e.g., Software Engineering"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Years of Experience */}
            <div className="sm:col-span-3">
              <label htmlFor="experience" className="block text-md font-medium">
                Years of Teaching Experience
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                placeholder="e.g., 5"
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Additional Certifications */}
            <div className="col-span-full">
              <label htmlFor="certifications" className="block text-md font-medium">
                Additional Certifications
              </label>
              <textarea
                id="certifications"
                rows="3"
                placeholder="e.g., CELTA, PMP, Microsoft Certified Trainer, etc."
                className="mt-2 block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>
        </div>


        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-10 py-3 text-white font-medium hover:bg-indigo-500"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

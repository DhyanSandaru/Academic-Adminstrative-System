import { useState } from "react";

export default function AddCourseForm() {
  const [courseBanner, setCourseBanner] = useState(null);
  const [modules, setModules] = useState([]);
  const [showModulePopup, setShowModulePopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., POST to backend)
    console.log("Form submitted!");
  };

  const removeModule = (module) => {
    setModules(modules.filter((m) => m !== module));
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen text-gray-900 rounded-2xl shadow-md">
      <form
        onSubmit={handleSubmit}
        className="space-y-12 w-3xl max-w-[90vh] mx-auto p-5"
      >
        {/* ================= COURSE DETAILS ================= */}
        <div className="border-b border-gray-200 pb-12 flex flex-col">
          <h2 className="text-xl font-semibold">Course Details</h2>
          <p className="mt-1 text-md text-gray-600">
            General information about the course and assigned lecturer.
          </p>

          <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-8">
            {/* Course Name */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="course-name" className="block text-md font-medium">
                Course Name
              </label>
              <input
                id="course-name"
                type="text"
                placeholder="e.g., Advanced Mathematics"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Lecturer */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="lecturer" className="block text-md font-medium">
                Lecturer
              </label>
              <select
                id="lecturer"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Lecturer</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Monthly Payment */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="payment" className="block text-md font-medium">
                Monthly Payment (LKR)
              </label>
              <input
                id="payment"
                type="number"
                placeholder="e.g., 2500"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Grade */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="grade" className="block text-md font-medium">
                Grade / Level
              </label>
              <select
                id="grade"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Grade</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="O/L">O/L</option>
                <option value="A/L">A/L</option>
                <option value="IELTS">IELTS</option>
              </select>
            </div>

            {/* Duration */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="duration" className="block text-md font-medium">
                Duration
              </label>
              <input
                id="duration"
                type="text"
                placeholder="e.g., 6 months / 1 year"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course Schedule */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="schedule" className="block text-md font-medium">
                Weekly Schedule
              </label>
              <input
                id="schedule"
                type="text"
                placeholder="e.g., Monday & Wednesday - 3:00 PM to 5:00 PM"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course Banner */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="course-banner" className="block text-md font-medium">
                Course Banner
              </label>
              <div className="w-full my-5 flex flex-col items-center justify-between gap-y-5">
                {courseBanner ? (
                  <img
                    src={URL.createObjectURL(courseBanner)}
                    alt="preview"
                    className="w-60 h-32 rounded-lg object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-60 h-32 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Banner
                  </div>
                )}
                <input
                  id="course-banner"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCourseBanner(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="course-banner"
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
                {modules.map((module) => (
                  <div
                    key={module}
                    className="bg-indigo-600 text-white pl-2 py-1 rounded-md flex items-center"
                  >
                    {module}
                    <button
                      type="button"
                      onClick={() => removeModule(module)}
                      className="ml-2 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowModulePopup(true)}
                  className="rounded-md bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-medium hover:bg-indigo-200"
                >
                  + Add Module
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-full w-full">
              <label htmlFor="description" className="block text-md font-medium">
                Course Description
              </label>
              <textarea
                id="description"
                rows="3"
                placeholder="Briefly describe the course content and objectives..."
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
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

      {/* ================= MODULE POPUP ================= */}
      {showModulePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Replace with your AddModules component */}
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Add Module</h3>
            <input
              type="text"
              placeholder="Enter module name"
              id="module-name"
              className="block w-full mb-4 rounded-md bg-gray-100 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModulePopup(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const module = document.getElementById("module-name").value.trim();
                  if (module && !modules.includes(module)) {
                    setModules([...modules, module]);
                  }
                  setShowModulePopup(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

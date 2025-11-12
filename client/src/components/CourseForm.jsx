import { useState } from "react";
import axios from "axios";
import AddLecturers from "./AddLecturers";

export default function CourseForm() {
  const [formData, setFormData] = useState({
    courseName: "",
    payment: "",
    minAge: "",
    maxAge: "",
    description: "",
  });

  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false);
  const [courseBanner, setCourseBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const bannerOptions = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectBanner = (banner) => {
    setCourseBanner(banner);
    setIsModalOpen(false);
  };

  const validateForm = () => {
    const { courseName, payment, minAge, maxAge, description } = formData;

    if (!courseName || !payment || !minAge || !maxAge || !description) {
      setMessage("⚠️ Please fill all fields before submitting.");
      return false;
    }

    if (selectedLecturers.length === 0) {
      setMessage("⚠️ Please select at least one lecturer.");
      return false;
    }

    if (Number(minAge) < 0 || Number(maxAge) < 0) {
      setMessage("⚠️ Age values cannot be negative.");
      return false;
    }

    if (Number(minAge) >= Number(maxAge)) {
      setMessage("⚠️ Minimum age must be less than maximum age.");
      return false;
    }

    if (!courseBanner) {
      setMessage("⚠️ Please select a banner image.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        courseBanner,
        lecturers: selectedLecturers, // Array of {lecturerId, lecturerName}
      };

      const response = await axios.post(
        "http://localhost:8000/courses/add-course",
        payload
      );

      if (response.status === 200) {
        setMessage("✅ Course added successfully!");
        setFormData({
          courseName: "",
          payment: "",
          minAge: "",
          maxAge: "",
          description: "",
        });
        setSelectedLecturers([]);
        setCourseBanner(null);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("❌ Failed to add course. Please try again.");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gray-50 min-h-screen text-gray-900 rounded-2xl shadow-md w-[70%]">
      <form
        onSubmit={handleSubmit}
        className="space-y-10 w-full mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-sm"
      >
        <div className="border-b border-gray-200 pb-8 flex flex-col">
          <h2 className="text-xl sm:text-2xl font-semibold">Course Details</h2>
          <p className="mt-1 text-sm sm:text-md text-gray-600">
            General information about the course and assigned lecturer.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {/* Course Name */}
            <div>
              <label htmlFor="courseName" className="block text-md font-medium">
                Course Name
              </label>
              <input
                id="courseName"
                type="text"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Mathematics"
                className="mt-2 w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Lecturers */}
            <div>
              <label className="block text-md font-medium">Lecturers</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLecturers.length > 0 ? (
                  selectedLecturers.map((lecturer, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {lecturer.lecturerName} ({lecturer.lecturerId})
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    No lecturers selected
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsLecturerModalOpen(true)}
                className="mt-3 cursor-pointer rounded-md bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 transition"
              >
                Select Lecturers
              </button>
            </div>

            {/* Payment */}
            <div>
              <label htmlFor="payment" className="block text-md font-medium">
                Monthly Payment (LKR)
              </label>
              <input
                id="payment"
                type="number"
                value={formData.payment}
                onChange={handleInputChange}
                placeholder="e.g., 2500"
                className="mt-2 w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Age Requirement */}
            <div>
              <h2 className="block text-md font-medium mb-3">Age Requirement</h2>
              <div className="flex flex-col sm:flex-row gap-5 w-full">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="minAge">Min</label>
                  <input
                    id="minAge"
                    type="number"
                    value={formData.minAge}
                    onChange={handleInputChange}
                    placeholder="Minimum age"
                    className="mt-2 w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="maxAge">Max</label>
                  <input
                    id="maxAge"
                    type="number"
                    value={formData.maxAge}
                    onChange={handleInputChange}
                    placeholder="Maximum age"
                    className="mt-2 w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Course Banner */}
            <div>
              <label className="block text-md font-medium">Course Banner</label>
              <div className="w-full my-5 flex flex-col items-center gap-y-4">
                {courseBanner ? (
                  <img
                    src={courseBanner}
                    alt="preview"
                    className="w-60 sm:w-72 h-32 sm:h-40 rounded-lg object-cover border border-gray-300 shadow-sm"
                  />
                ) : (
                  <div className="w-60 sm:w-72 h-32 sm:h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Banner Selected
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer rounded-md bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 transition"
                >
                  Choose Banner
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-md font-medium">
                Course Description
              </label>
              <textarea
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Briefly describe the course content and objectives..."
                className="mt-2 w-full rounded-md bg-white px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-10 py-3 text-md font-semibold text-white hover:bg-indigo-700 transition focus:outline-none"
          >
            Confirm
          </button>
          {message && (
            <p
              className={`text-sm ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600 font-medium"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>

      {/* Lecturer Selection Modal */}
      {isLecturerModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
          <AddLecturers
            selectedLecturers={selectedLecturers}
            setSelectedLecturers={setSelectedLecturers}
            handleClose={() => setIsLecturerModalOpen(false)}
          />
        </div>
      )}

      {/* Banner Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-lg relative">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              Choose a Course Banner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bannerOptions.map((banner, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                    courseBanner === banner
                      ? "border-indigo-600 scale-[1.02]"
                      : "border-transparent hover:scale-[1.02]"
                  }`}
                  onClick={() => handleSelectBanner(banner)}
                >
                  <img
                    src={banner}
                    alt={`banner ${index + 1}`}
                    className="object-cover w-full h-24 sm:h-28"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full rounded-md bg-gray-100 text-gray-700 py-2 font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

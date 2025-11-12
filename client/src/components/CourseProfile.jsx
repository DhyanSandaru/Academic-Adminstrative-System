import { useEffect, useState } from 'react';
import { BookOpen, User, Calendar, Clock, MapPin, Users, DollarSign, Info, X, Plus } from 'lucide-react';
import axios from 'axios';
import AddLecturers from '../components/AddLecturers';

const bannerOptions = [
  '/images/course_backgrounds/green_tiles.jpg',
  '/images/banner2.jpg',
  '/images/banner3.jpg'
];

export default function CourseProfile({ courseId }) {
  // Separate state for each data source
  const [courseData, setCourseData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    payment: '',
    minAge: '',
    maxAge: '',
    description: '',
    courseBanner: '',
    lecturers: []
  });

  // Initial data to reset on failure
  const [initialData, setInitialData] = useState(null);

  // UI state
  const [previewUrl, setPreviewUrl] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [weekClasses, setWeekClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLecturerOpen, setIsAddLecturerOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [courseId]);

  useEffect(() => {
    if (courseData) {
      const initial = {
        name: courseData.name || '',
        payment: courseData.payment || '',
        minAge: courseData.minAge || '',
        maxAge: courseData.maxAge || '',
        description: courseData.description || '',
        courseBanner: courseData.courseBanner || '',
        lecturers: lecturers || []
      };
      setFormData(initial);
      setInitialData(initial);
      
      if (initial.courseBanner) {
        setPreviewUrl(initial.courseBanner);
      }
    }
  }, [courseData, lecturers]);

  useEffect(() => {
    if (classes.length > 0) {
      filterCurrentWeekClasses();
    }
  }, [classes]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: course } = await axios.get(
        `http://localhost:8000/courses/get-courses/${courseId}`
      );
      setCourseData(course || null);

      // Fetch classes
      let classesData = [];
      if (course?.name) {
        const { data } = await axios.get(
          `http://localhost:8000/timetable/${encodeURIComponent(course.name)}`
        );
        classesData = Array.isArray(data) ? data : [];
      }
      setClasses(classesData);

      // Fetch lecturers
      let lecturersData = [];
      if (course?.name) {
        const { data } = await axios.get(
          `http://localhost:8000/view-lecturers/${encodeURIComponent(course.name)}`
        );
        lecturersData = Array.isArray(data) ? data : [];
      }
      setLecturers(lecturersData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching course data:', error);
      alert('Failed to load course data');
      setLoading(false);
    }
  };

  const filterCurrentWeekClasses = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const filtered = classes.filter(cls => {
      const classDate = new Date(cls.date);
      return classDate >= startOfWeek && classDate <= endOfWeek;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.start_time}`);
      const dateB = new Date(`${b.date} ${b.start_time}`);
      return dateA - dateB;
    });

    setWeekClasses(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSelectBanner = (banner) => {
    setFormData(prev => ({ ...prev, courseBanner: banner }));
    setPreviewUrl(banner);
    setHasChanges(true);
    setIsModalOpen(false);
  };

  const handleRemoveLecturer = (lecturerId) => {
    const updatedLecturers = formData.lecturers.filter(
      lecturer => lecturer.lecturerId !== lecturerId
    );
    setFormData(prev => ({ ...prev, lecturers: updatedLecturers }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      
      // Append all form fields
      data.append('name', formData.name);
      data.append('payment', formData.payment);
      data.append('minAge', formData.minAge);
      data.append('maxAge', formData.maxAge);
      data.append('description', formData.description);
      data.append('courseBanner', formData.courseBanner);
      
      // Append lecturers as JSON string
      data.append('lecturers', JSON.stringify(formData.lecturers));

      const response = await axios.put(
        `http://localhost:8000/update-course/${courseId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        alert('Course details updated successfully');
        setHasChanges(false);
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course: ' + (error.response?.data?.message || error.message));
      
      // Reset to initial data on failure
      if (initialData) {
        setFormData(initialData);
        setPreviewUrl(initialData.courseBanner);
        setHasChanges(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading || !courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Course Details Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="text-white" size={28} />
                <h2 className="text-2xl font-bold text-white">Course Details</h2>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Course Banner Section */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Course Banner</label>
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-4 border-purple-200 shadow-lg">
                {previewUrl ? (
                  <img src={previewUrl} alt="Course Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                    <BookOpen size={80} className="text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md"
              >
                Change Banner
              </button>
            </div>

            {/* Module ID - Read Only */}
            <div className="mb-8 bg-purple-50 p-6 rounded-lg border border-purple-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Module ID</label>
              <input
                type="text"
                value={courseData.module_id}
                readOnly
                className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-center font-semibold text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={18} />
                  Course Fee (LKR)
                </label>
                <input
                  type="number"
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Age</label>
                  <input
                    type="number"
                    name="minAge"
                    value={formData.minAge}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="e.g., 16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Age</label>
                  <input
                    type="number"
                    name="maxAge"
                    value={formData.maxAge}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Info size={18} />
                  Course Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter course description..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Classes Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-800 px-8 py-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-white" size={28} />
              <h2 className="text-2xl font-bold text-white">This Week's Classes</h2>
            </div>
          </div>

          <div className="p-8">
            {weekClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No classes scheduled for this week</p>
              </div>
            ) : (
              <div className="space-y-4">
                {weekClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                          <Calendar size={18} />
                          <span>{formatDate(cls.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                          <Clock size={18} />
                          <span>{formatTime(cls.start_time)} - {formatTime(cls.end_time)}</span>
                        </div>
                        {cls.hall && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={18} />
                            <span>{cls.hall}</span>
                          </div>
                        )}
                      </div>
                      {cls.lecturer_name && (
                        <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg">
                          <User size={20} className="text-green-600" />
                          <span className="font-medium text-gray-700">{cls.lecturer_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course Lecturers Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-white" size={28} />
                <h2 className="text-2xl font-bold text-white">Course Lecturers</h2>
              </div>
              <button
                onClick={() => setIsAddLecturerOpen(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md flex items-center gap-2"
              >
                <Plus size={20} />
                Add Lecturer
              </button>
            </div>
          </div>

          <div className="p-8">
            {formData.lecturers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No lecturers assigned to this course</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.lecturers.map((lecturer, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all duration-200 relative"
                  >
                    <button
                      onClick={() => handleRemoveLecturer(lecturer.lecturerId)}
                      className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full transition-colors"
                      title="Remove lecturer"
                    >
                      <X size={18} />
                    </button>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        {lecturer.profilePhoto ? (
                          <img
                            src={`http://localhost:8000${lecturer.profilePhoto}`}
                            alt={lecturer.lecturerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={32} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {lecturer.lecturerName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-semibold">ID:</span> {lecturer.lecturerId}</p>
                          {lecturer.email && (
                            <p><span className="font-semibold">Email:</span> {lecturer.email}</p>
                          )}
                          {lecturer.mobile && (
                            <p><span className="font-semibold">Mobile:</span> {lecturer.mobile}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Banner Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              Choose a Course Banner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bannerOptions.map((banner, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                    formData.courseBanner === banner
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

      {/* Add Lecturer Modal */}
      {isAddLecturerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 overflow-y-auto py-8">
          <AddLecturers
            selectedLecturers={formData.lecturers}
            setSelectedLecturers={(newLecturers) => {
              setFormData(prev => ({ ...prev, lecturers: newLecturers }));
              setHasChanges(true);
            }}
            handleClose={() => setIsAddLecturerOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
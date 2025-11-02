import { useContext, useEffect, useState } from 'react';
import LecturerContext from './LecturerContext.jsx';
import { GraduationCap, Award, Briefcase } from 'lucide-react';
import AddCourses from '../AddCourses.jsx';

export default function LecturerEducationDetails() {
  const { lecturerData, updateLecturer, saving } = useContext(LecturerContext);

  const [formData, setFormData] = useState({
    highestQualification: '',
    institute: '',
    fieldOfStudy: '',
    experience: '',
    certifications: ''
  });

  const [courseModules, setCourseModules] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCoursePopup, setShowCoursePopup] = useState(false);

  useEffect(() => {
    if (lecturerData) {
      setFormData({
        highestQualification: lecturerData.highestQualification || '',
        institute: lecturerData.institute || '',
        fieldOfStudy: lecturerData.fieldOfStudy || '',
        experience: lecturerData.experience || '',
        certifications: lecturerData.certifications || ''
      });
      setCourseModules(lecturerData.courses || []);
    }
  }, [lecturerData]);

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(prev => prev.filter(m => m !== moduleToRemove));
    setHasChanges(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const result = await updateLecturer({
      highestQualification: formData.highestQualification,
      institute: formData.institute,
      fieldOfStudy: formData.fieldOfStudy,
      experience: formData.experience,
      certifications: formData.certifications,
      courses: courseModules
    });

    if (result.success) {
      alert('Education details updated successfully');
      setHasChanges(false);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    if (JSON.stringify(courseModules) !== JSON.stringify(lecturerData?.courses)) {
      setHasChanges(true);
    }
  }, [courseModules, lecturerData]);

  return (
    <div id='education-details' className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">Education & Experience</h2>
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
        {/* Education Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-purple-600" />
            Educational Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Qualification</label>
              <input
                type="text"
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g., PhD, MSc, BSc"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Institute/University</label>
              <input
                type="text"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="University name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g., Computer Science, Mathematics"
              />
            </div>
          </div>
        </div>

        {/* Experience & Certifications */}
        <div className="border-t-2 border-gray-200 pt-8 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase size={20} className="text-purple-600" />
            Professional Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g., 5 years"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Award size={18} className="text-purple-600" />
                Certifications
              </label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g., AWS Certified, PMP"
              />
            </div>
          </div>
        </div>

        {/* Teaching Courses */}
        <div className="border-t-2 border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Teaching Courses</h3>
          <div className="mt-2 flex flex-col items-center flex-wrap gap-3">
            <div className='border-2 border-gray-300 rounded-lg flex flex-row flex-wrap gap-3 w-full p-3 min-h-[60px]'> 
              {courseModules.length > 0 ? (
                courseModules.map((module) => (
                  <div
                    key={module}
                    className="bg-purple-600 text-white px-3 py-1 rounded-md flex items-center h-fit"
                  >
                    <span className="mr-2">{module}</span>
                    <button
                      type="button"
                      onClick={() => removeCourseModule(module)}
                      className="hover:text-gray-300 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center w-full py-3">No courses assigned yet</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowCoursePopup(true)}
              className="rounded-md bg-purple-100 text-purple-700 px-4 py-2 text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              + Add Course
            </button>
          </div>
        </div>

        {showCoursePopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <AddCourses
              selectedCourses={courseModules}
              setSelectedCourses={(courses) => {
                setCourseModules(courses);
                setHasChanges(true);
              }}
              handleClose={() => setShowCoursePopup(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
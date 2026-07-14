import { useContext, useEffect, useState } from 'react';
import studentContext from './StudentContext.jsx';
import { GraduationCap } from 'lucide-react';
import AddCourses from '../AddCourses.jsx';

export default function EducationDetails() {
  const { studentData, updateStudent, saving } = useContext(studentContext);

  const [formData, setFormData] = useState({
    curriculum: '',
    previousEducation: '',
    grade: ''
  });

  const [courseModules, setCourseModules] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCoursePopup, setShowCoursePopup] = useState(false);

  useEffect(() => {
    if (studentData) {
      setFormData({
        curriculum: studentData.curriculum || '',
        previousEducation: studentData.previousEducation || '',
        grade: studentData.grade || ''
      });
      setCourseModules(studentData.courses || []);
    }
  }, [studentData]);

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(prev => prev.filter(m => m !== moduleToRemove));
    setHasChanges(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData( prev => {
      const next = { ...prev, [name]: value };

      if(name === 'grade'){
        next.curriculum = parseInt(value, 10) >= 1 && parseInt(value, 10) <= 8 ? 'general': '';
      }

      return next;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    const result = await updateStudent({
      exam: formData.exam,
      examYear: formData.examYear,
      previousEducation: formData.previousEducation,
      grade: formData.grade,
      courses: courseModules 
    });

    if (result.success) {
      alert('Education details updated successfully');
      setHasChanges(false);
    } else {
      alert(result.message);
    }
  };

  // Track course changes
  useEffect(() => {
    if (JSON.stringify(courseModules) !== JSON.stringify(studentData?.courses)) {
      setHasChanges(true);
    }
  }, [courseModules, studentData]);

  return (
    <div id='education-details' className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">Education Details</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className='md:col-span-1'>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Curriculum</label>
            <select
              name="curriculum"
              value={formData.curriculum}
              onChange={handleChange}
              disabled={parseInt(formData.grade)>=1 && parseInt(formData.grade) <= 9}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:cursor-not-allowed"
            >
              <option value="" disabled>--Select Curriculum--</option>
              {parseInt(formData.grade)>=1 && parseInt(formData.grade) <= 8?
              (
              <option value="general">General</option>
            )
              :
              (
              <>
                <option value="cambridge">Cambridge</option>
                <option value="edexcel">Edexcel</option>
              </>
              )
              }
            </select>
          </div>

          <div className='md:col-span-1'>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Grade/Results</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            >
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

          <div className='md:col-span-2'>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Previous School/Institution</label>
            <input
              type="text"
              name="previousEducation"
              value={formData.previousEducation}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="School name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enrolled Courses</label>
            <div className="mt-2 flex flex-col items-center flex-wrap gap-3">
              <div className='border-2 border-gray-300 rounded-lg flex flex-row flex-wrap gap-3 w-full p-3 min-h-[60px]'> 
                {courseModules.length > 0 ? (
                  courseModules.map((module) => (
                    <div
                      key={module}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center h-fit"
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
                  <p className="text-gray-400 text-center w-full py-3">No courses added yet</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCoursePopup(true)}
                className="rounded-md bg-indigo-100 text-indigo-700 px-4 py-2 text-sm font-medium hover:bg-indigo-200 transition-colors"
              >
                + Add Module
              </button>
            </div> 
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
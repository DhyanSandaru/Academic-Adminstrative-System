import { useState } from "react";
import { CirclePlus, X } from 'lucide-react';
import axios from "axios";
import AddCourses from "./AddCourses.jsx";
import { BACKEND_URL } from "./config.js";

export default function StudentForm() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [formStatus, setFormStatus] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [errors, setErrors] = useState({});

  
  // Form fields state
  const [formData, setFormData] = useState({
    studentName: '',
    gender: '',
    dob: '',
    ethnicity: '',
    email: '',
    nic: '',
    mobile: '',
    address: '',
    previousEducation: '',
    grade: '',
    curriculum: '',
    guardianName: '',
    guardianMobile: '',
    guardianRelation: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'grade'){
        next.curriculum = (parseInt(value,10) >= 1 && parseInt(value, 10) <= 8)?'general':'';
      }

      return next;
    });
  };

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter((module) => module !== moduleToRemove));
  };

  const handleCodeSubmit = async () => {
    if (!code) {
      setFormStatus("Please enter a valid code.");
      return;
    }
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/verification/validate-code`, { code });
      if (res.data.valid) {
        setStep(2);
        setFormStatus(null);
      } else {
        setFormStatus("Invalid or expired code.");
      }
    } catch (err) {
      console.error(err);
      setFormStatus("Server error while validating code.");
    }
  };

  const handleFormSubmit = async () => {
    const requiredFields = [
      { key: 'studentName', label: 'Student Name' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'ethnicity', label: 'Ethnicity' },
      { key: 'gender', label: 'Gender' },
      { key: 'email', label: 'Email' },
      { key: 'mobile', label: 'Mobile Number' },
      { key: 'address', label: 'Address' },
      { key: 'grade', label: 'Current Grade' },
      { key: 'curriculum', label:'Curriculum'},
      { key: 'guardianName', label: 'Guardian Name' },
      { key: 'guardianMobile', label: 'Guardian Mobile' },
      { key: 'guardianRelation', label: 'Relationship' },
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field.key]?.trim()) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if errors exist

    // Confirm submission without profile photo
    if (!profilePhoto) {
      const proceed = window.confirm(
        "No profile photo uploaded. Do you want to submit without a photo?"
      );
      if (!proceed) return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    formDataToSend.append("profilePhoto", profilePhoto || "");
    formDataToSend.append("courseModules", JSON.stringify(courseModules));

    try {
      const res = await axios.post(`${BACKEND_URL}/api/requests/add-request`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormStatus("Registration submitted for approval successfully!");
      setErrors({}); // clear errors on success

      setTimeout(() => {
        setFormData({
          studentName: '',
          gender: '',
          dob: '',
          ethnicity: '',
          email: '',
          nic: '',
          mobile: '',
          address: '',
          previousEducation: '',
          grade: '',
          curriculum:'',
          guardianName: '',
          guardianMobile: '',
          guardianRelation: ''
        });
        setProfilePhoto(null);
        setCourseModules([]);
        setStep(1);
        setFormStatus(null);
        setCode('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setFormStatus(err.response?.data?.message || "Submission failed. Please try again.");
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <h1 className="font-bold text-2xl sm:text-3xl text-indigo-900 text-center mb-2">
            Remote Registration Portal
          </h1>
          <p className="text-sm sm:text-base text-red-500 text-center font-medium">
            Please stay connected to WiFi until submission is complete
          </p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Enter Access Code
              </h2>
              <p className="text-sm text-gray-600">
                Please enter the code provided by your institution
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your access code"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-center text-lg tracking-wider font-semibold"
              />
              <button 
                onClick={handleCodeSubmit}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
              >
                Validate Code
              </button>
            </div>
            
            {formStatus && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {formStatus}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="space-y-8">
              
              {/* Profile Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-600 mt-1">Basic details and selected modules</p>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                  {errors.studentName && (
                    <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>
                  )}
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Photo *
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    {profilePhoto ? (
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
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
                      className="cursor-pointer bg-indigo-100 text-indigo-700 px-6 py-2 rounded-lg font-medium hover:bg-indigo-200 transition"
                    >
                      {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                    </label>
                  </div>
                </div>

                {/* Course Modules */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Course Modules *
                  </label>
                  <div className="border-2 border-gray-200 rounded-xl p-4 min-h-[80px] flex flex-wrap gap-2">
                    {courseModules.length === 0 ? (
                      <p className="text-gray-400 text-sm w-full text-center py-4">
                        No modules selected yet
                      </p>
                    ) : (
                      courseModules.map((module) => (
                        <div
                          key={module}
                          className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          {module}
                          <button
                            onClick={() => removeCourseModule(module)}
                            className="hover:bg-indigo-700 rounded p-0.5"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => setShowCoursePopup(true)}
                    className="mt-3 w-full sm:w-auto bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition flex items-center justify-center gap-2"
                  >
                    <CirclePlus size={20} />
                    Add Modules
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Identification and contact details</p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gender 
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["male", "female", "other"].map((g) => (
                      <button
                        key={g}
                        onClick={() => handleInputChange('gender', g)}
                        className={`p-3 border-2 rounded-xl font-medium text-sm sm:text-base  text-black transition ${
                          formData.gender === g
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                {/* DOB & Ethnicity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                    {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ethnicity *
                    </label>
                    <select
                      value={formData.ethnicity}
                      onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    >
                      <option value="" disabled>--Select Ethnicity--</option>
                      <option value="sinhala">Sinhala</option>
                      <option value="tamil">Tamil</option>
                      <option value="muslim">Musilm</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.ethnicity && (
                    <p className="text-red-500 text-xs mt-1">{errors.ethnicity}</p>
                  )}
                  </div>
                </div>
                

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                </div>

                {/* NIC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC *
                  </label>
                  <input
                    value={formData.nic}
                    onChange={(e) => handleInputChange('nic', e.target.value)}
                    placeholder="Enter NIC number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="07X XXX XXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    placeholder="Enter your full address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* Education Details */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Education Details</h3>
                  <p className="text-sm text-gray-600 mt-1">Previous education information</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous School/Institution *
                    </label>
                    <input
                      value={formData.previousEducation}
                      onChange={(e) => handleInputChange('previousEducation', e.target.value)}
                      placeholder="Enter institution name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    >
                      <option value="" disabled>--Select Grade--</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="AS">AS level</option>
                      <option value="A2">A2 level</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curriculum *
                    </label>
                    <select
                      value={formData.curriculum}
                      onChange={(e) => handleInputChange('curriculum', e.target.value)}
                      disabled={parseInt(formData.grade, 10) >= 1 && parseInt(formData.grade, 10) <= 8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>--Select Curriculum--</option>
                      {parseInt(formData.grade, 10) >= 1 && parseInt(formData.grade, 10) <= 8?
                      (
                        <option value="general">General</option>
                      ):
                      (
                        <>
                          <option value="cambridge">Cambridge</option>
                          <option value="edexcel">Edexcel</option>
                        </>
                      )
                      }
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Guardian Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Parent or guardian contact details</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Name *
                  </label>
                  <input
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    placeholder="Enter guardian's full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Mobile *
                    </label>
                    <input
                      type="tel"
                      value={formData.guardianMobile}
                      onChange={(e) => handleInputChange('guardianMobile', e.target.value)}
                      placeholder="07X XXX XXXX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <input
                      value={formData.guardianRelation}
                      onChange={(e) => handleInputChange('guardianRelation', e.target.value)}
                      placeholder="e.g., Father, Mother"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleFormSubmit}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
                >
                  Submit Registration
                </button>
              </div>
            </div>

            {formStatus && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-center font-medium animate-pulse">
                {formStatus}
              </div>
            )}
          </div>
        )}

        {/* Course Selection Popup */}
        {showCoursePopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <AddCourses
              selectedCourses={courseModules}
              setSelectedCourses={setCourseModules}
              handleClose={() => setShowCoursePopup(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
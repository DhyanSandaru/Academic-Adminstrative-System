import ProfileLayout from "../components/profiles/ProfileLayout";
import PersonalDetails from "../components/profiles/PersonalDetails.jsx";
import EducationDetails from "../components/profiles/EducationDetails.jsx";
import ContactDetails from "../components/profiles/ContactDetails.jsx";
import PaymentDetails from "../components/profiles/PaymentStatus";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import studentContext from "../components/profiles/StudentContext.jsx";

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { student_id } = useParams();

  // Single fetch on mount
  useEffect(() => {
    const fetchStudentbyID = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/view-students/id/${student_id}`);

        const validatedData = {
          name: response.data.student_name ?? '',
          studentId: response.data.student_id ?? '',
          profilePhoto: response.data.profile_photo ?? '',
          gender: response.data.gender ?? '',
          dob: response.data.dob ?? '',
          ethnicity: response.data.ethnicity ?? '',
          exam: response.data.exam ?? '',
          examYear: response.data.exam_year ?? '',
          email: response.data.email ?? '',
          nic: response.data.nic ?? '',
          mobile: response.data.mobile ?? '',
          address: response.data.address ?? '',
          guardianName: response.data.guardian_name ?? '',
          guardianMobile: response.data.guardian_mobile ?? '',
          guardianRelation: response.data.guardian_relation ?? '',
          previousEducation: response.data.previous_education ?? '',
          grade: response.data.grade ?? '',
          payment_status: response.data.payment_status ?? '',
          courses: response.data.courses ?? [],
          submittedAt: response.data.submitted_at ?? ''
        };

        setStudentData(validatedData);
      } catch (err) {
        console.error('Fetch error:', err);
        const message = err.response?.data?.message || "Failed to load student data";
        alert(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentbyID();
  }, [student_id]);

  // FIXED: Single update function with proper handling of arrays and files
  const updateStudent = useCallback(async (updatedFields, photoFile = null) => {
    if (!studentData) return { success: false, message: 'No student data loaded' };

    try {
      setSaving(true);

      const formDataToSend = new FormData();

      // Merge current data with updates
      const mergedData = { ...studentData, ...updatedFields };

      // Append all fields to FormData, handling arrays properly
      Object.entries(mergedData).forEach(([key, value]) => {
        if (key === 'courses' && Array.isArray(value)) {
          // Send courses as JSON string or as comma-separated based on backend expectation
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Append photo if changed
      if (photoFile) {
        formDataToSend.append("profilePhoto", photoFile);
      }

      const response = await axios.put(
        `http://localhost:8000/view-students/${studentData.studentId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status >= 200 && response.status < 300) {
        // Update local state with merged data
        setStudentData(prev => ({
          ...prev,
          ...updatedFields
        }));
        return { success: true, message: "Updated successfully" };
      } else {
        return { success: false, message: "Failed to update" };
      }
    } catch (err) {
      console.error("Update error:", err);
      const message = err.response?.data?.message || "Error while updating";
      return { success: false, message };
    } finally {
      setSaving(false);
    }
  }, [studentData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Failed to load student data</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <studentContext.Provider value={{ studentData, setStudentData, updateStudent, saving }}>
      <ProfileLayout title={studentData.name}>
        <PersonalDetails />
        <ContactDetails />
        <EducationDetails />
        <PaymentDetails />
      </ProfileLayout>
    </studentContext.Provider>
  );
}
import ProfileLayout from "../components/profiles/ProfileLayout";
import PersonalDetails from "../components/profiles/PersonalDetails.jsx";
import EducationDetails from "../components/profiles/EducationDetails.jsx";
import ContactDetails from "../components/profiles/ContactDetails.jsx";
import PaymentDetails from "../components/profiles/PaymentStatus";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import studentContext from "../components/profiles/StudentContext.jsx";
import { Trash } from "lucide-react";

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const { student_id } = useParams();
  const navigate = useNavigate();

  // Single fetch on mount
  useEffect(() => {
    const fetchStudentbyID = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/students/view-students/id/${student_id}`);

        const validatedData = {
          name: response.data.student_name ?? '',
          studentId: response.data.student_id ?? '',
          profilePhoto: response.data.profile_photo ?? '',
          gender: response.data.gender ?? '',
          dob: response.data.dob ?? '',
          ethnicity: response.data.ethnicity ?? '',
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
          age: response.data.age ?? 0,
          curriculum: response.data.curriculum ?? '',
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

  const handleDelete = async() => {

    try{
       await axios.delete(`http://localhost:8000/api/students/delete-student/${student_id}`);
       navigate('/view-students')

       alert("Student has been deleted successfully")
    }
    catch(err){
      alert(err.response?.data?.message || "Student deletion failed ")
    }   
  }

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
        `http://localhost:8000/api/students/view-students/${studentData.studentId}`,
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
        <div className="w-full flex justify-center">
          <button
            className='bg-red-500 text-white flex flex-row items-center rounded-lg gap-2 h-16 hover:bg-red-600'
            onClick={()=> setDeletePopup(true)}
            >
              <Trash className="text-white" size={20}/>
              <p className='text-lg'>Delete Student</p>
          </button>
        </div>
        <PersonalDetails />
        <ContactDetails />
        <EducationDetails />
        <PaymentDetails />
        {deletePopup && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
            <p className="text-lg mb-4 text-black">
              Do you want to delete {studentData.name}'s profile?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setDeletePopup(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      </ProfileLayout>
      
    </studentContext.Provider>
  );
}
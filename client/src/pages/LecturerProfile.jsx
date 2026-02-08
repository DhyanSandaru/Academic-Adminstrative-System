import LecturerLayout from "../components/LecturerProfiles/LecturerLayout.jsx";
import LecturerPersonalDetails from "../components/LecturerProfiles/PersonalDetails.jsx";
import LecturerContactDetails from "../components/LecturerProfiles/ContactDetails.jsx";
import LecturerEducationDetails from "../components/LecturerProfiles/EducationDetails.jsx";
import Salary from "../components/LecturerProfiles/SalaryCalculation.jsx";
import { Trash } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LecturerContext from "../components/LecturerProfiles/LecturerContext.jsx";

export default function LecturerProfile() {
  const [lecturerData, setLecturerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const { lecturer_id } = useParams();

  // Single fetch on mount
  useEffect(() => {
    const fetchLecturerById = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/view-lecturers/id/${lecturer_id}`);

        const validatedData = {
          name: response.data.lecturer_name ?? '',
          lecturerId: response.data.lecturer_id ?? '',
          profilePhoto: response.data.profile_photo ?? '',
          gender: response.data.gender ?? '',
          email: response.data.email ?? '',
          nic: response.data.nic ?? '',
          mobile: response.data.mobile ?? '',
          address: response.data.address ?? '',
          highestQualification: response.data.highest_qualification ?? '',
          institute: response.data.institute ?? '',
          fieldOfStudy: response.data.field_of_study ?? '',
          experience: response.data.experience ?? '',
          certifications: response.data.certifications ?? '',
          joinedYear: response.data.joined_year ?? '',
          courses: response.data.courses ?? [],
          createdAt: response.data.created_at ?? ''
        };

        setLecturerData(validatedData);
      } catch (err) {
        console.error('Fetch error:', err);
        const message = err.response?.data?.message || "Failed to load lecturer data";
        alert(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerById();
  }, [lecturer_id]);

   const handleDelete = async() => {

    try{
       await axios.delete(`http://localhost:8000/delete-lecturer/${lecturer_id}`);
       navigate('/view-students')

       alert("Lecturer has been deleted successfully")
    }
    catch(err){
      alert(err.response?.data?.message || "Lecturer deletion failed ")
    }   
  }


  // Single update function used by all components
  const updateLecturer = useCallback(async (updatedFields, photoFile = null) => {
    if (!lecturerData) return { success: false, message: 'No lecturer data loaded' };

    try {
      setSaving(true);

      const formDataToSend = new FormData();

      // Merge current data with updates
      const mergedData = { ...lecturerData, ...updatedFields };

      // Append all fields to FormData, handling arrays properly
      Object.entries(mergedData).forEach(([key, value]) => {
        if (key === 'courses' && Array.isArray(value)) {
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
        `http://localhost:8000/update-lecturers/${lecturerData.lecturerId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status >= 200 && response.status < 300) {
        setLecturerData(prev => ({
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
  }, [lecturerData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading lecturer profile...</p>
        </div>
      </div>
    );
  }

  if (!lecturerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Failed to load lecturer data</p>
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
    <LecturerContext.Provider value={{ lecturerData, setLecturerData, updateLecturer, saving }}>
      <LecturerLayout title={lecturerData.name}>
        <div className="w-full flex justify-center">
          <button
            className='bg-red-500 text-white flex flex-row items-center rounded-lg gap-2 h-16 hover:bg-red-600'
            onClick={()=> setDeletePopup(true)}
            >
              <Trash className="text-white" size={20}/>
              <p className='text-lg'>Delete Lecturer</p>
          </button>
        </div>
        <LecturerPersonalDetails />
        <LecturerContactDetails />
        <LecturerEducationDetails />
        <Salary />
      </LecturerLayout>
      {deletePopup && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
            <p className="text-lg mb-4 text-black">
              Do you want to delete {lecturerData.name}'s profile?
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
    </LecturerContext.Provider>
  );
}
import ProfileLayout from "../components/profiles/ProfileLayout";
import PersonalDetails from "../components/profiles/PersonalDetails.jsx"
import EducationDetails from "../components/profiles/EducationDetails.jsx";
import ContactDetails from "../components/profiles/ContactDetails.jsx";
import PaymentDetails from "../components/profiles/PaymentStatus";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import studentContext from "../components/profiles/StudentContext.jsx";

export default function StudentProfile(){
  const[studentData,setStudentData] = useState(null);
  const {student_id} = useParams();

  useEffect(() => {
    const fetchStudentbyID = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/view-students/${student_id}`);

        const validatedData = {
          name: response.data.name ?? '',
          studentId: response.data.studentId ?? '',
          profilePhoto: response.data.profilePhoto ?? '',
          gender: response.data.gender ?? '',
          examYear: response.data.examYear ?? '',
          email: response.data.email ?? '',
          nic: response.data.nic ?? '',
          mobile: response.data.mobile ?? '',
          address: response.data.address ?? '',
          payment_status: response.data.payment_status ?? '',
          courses: response.data.courses ?? []
        };

        setStudentData(validatedData);

      } catch (err) {

        if (err.response) {
          const status = err.response.status;
          const message = err.response.data?.message || "Server responded with an error";
          console.error(`Server Error (${status}): ${message}`);
          alert(message);
        } else if (err.request) {
          console.error("No response from server.");
          alert("Network error or no response from server.");
        } else {
          console.error("Frontend error:", err.message);
          alert("Something went wrong on the frontend.");
        }
      }
  };

  fetchStudentbyID(); // call it immediately

  }, [student_id]);


  if (!studentData) return <p>Loading...</p>;

  return(
        <studentContext.Provider value={{studentData,setStudentData}}>
            <ProfileLayout title={studentData.name}>
                <PersonalDetails/>
                <EducationDetails/>
                <ContactDetails/>
                <PaymentDetails/>
            </ProfileLayout>
        </studentContext.Provider>
  )
}
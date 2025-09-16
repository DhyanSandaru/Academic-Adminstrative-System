import LecturerLayout from "../components/LecturerProfiles/LecturerLayout.jsx";
import LecturerPersonalDetails from "../components/LecturerProfiles/PersonalDetails.jsx";
import LecturerContactDetails from "../components/LecturerProfiles/ContactDetails.jsx";
import LecturerSubjectDetails from "../components/LecturerProfiles/EducationDetails.jsx";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import lecturerContext from "../components/LecturerProfiles/LecturerContext.jsx";

export default function LecturerProfile() {
  
  const [lecturerData, setLecturerData] = useState(null);
  const { lecturer_id } = useParams();

  useEffect(() => {
    const fetchLecturerById = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/view-lecturers/${lecturer_id}`);

        const validatedData = {
          name: response.data.name ?? '',
          lecturerId: response.data.lecturerId ?? '',
          profilePhoto: response.data.profilePhoto ?? '',
          gender: response.data.gender ?? '',
          qualifications: response.data.qualifications ?? '',
          email: response.data.email ?? '',
          nic: response.data.nic ?? '',
          mobile: response.data.mobile ?? '',
          address: response.data.address ?? '',
          examYear: response.data.examYear ?? '',
          subjects: response.data.subjects ?? []
        };

        setLecturerData(validatedData);

      } catch (err) {
        if (err.response) {
          console.error(`Server Error (${err.response.status}): ${err.response.data?.message}`);
          alert(err.response.data?.message || "Server responded with an error");
        } else if (err.request) {
          console.error("No response from server.");
          alert("Network error or no response from server.");
        } else {
          console.error("Frontend error:", err.message);
          alert("Something went wrong on the frontend.");
        }
      }
    };

    fetchLecturerById();

  }, [lecturer_id]);

  if (!lecturerData) return <p>Loading...</p>;

  return (
    <lecturerContext.Provider value={{ lecturerData, setLecturerData }}>
      <LecturerLayout>
        <LecturerPersonalDetails />
        <LecturerContactDetails />
        <LecturerSubjectDetails />
      </LecturerLayout>
    </lecturerContext.Provider>
  );
}

import axios from "axios";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RemoteReg() {
  const [newCode, setNewCode] = useState("");
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch code
  const fetchNewCode = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/verification/new-code");
      setNewCode(response.data.code);
    } catch (err) {
      console.error("Error fetching code:", err);
    }
  };

  // Fetch all pending requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/requests/view-requests");
      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleApprove = async () => {
    const confirmApprove = window.confirm(
      `Are you sure you want to APPROVE the registration of "${selectedRequest.student_name}"?`
    );
    if (!confirmApprove) return;

    try {
      await axios.post(`http://localhost:8000/api/requests/approve-request/${selectedRequest.id}`);
      await fetchRequests(); // Wait for list to refresh
      setSelectedRequest(null);
      alert("Request approved successfully!");
    } catch (err) {
      alert("Approval failed");
      console.error(err);
    }
  };

  const handleReject = async () => {
    const confirmReject = window.confirm(
      `Are you sure you want to REJECT the registration of "${selectedRequest.student_name}"?`
    );
    if (!confirmReject) return;

    try {
      await axios.delete(`http://localhost:8000/api/requests/reject-request/${selectedRequest.id}`);
      await fetchRequests(); // Wait for list to refresh
      setSelectedRequest(null);
      alert("Request rejected successfully!");
    } catch (err) {
      alert("Rejection failed");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (showCodePopup) fetchNewCode();
  }, [showCodePopup]);

  return (
    <div className="rounded-xl w-full p-10 flex flex-col gap-5">
      {/* Code Generator */}
      <div className="flex flex-row gap-8 items-center w-full bg-white p-8 rounded-xl">
        <p className="text-black text-lg">Generate a new code</p>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => setShowCodePopup(true)}
        >
          <Sparkles />
          <span className="font-semibold text-md">Generate</span>
        </button>
      </div>

      {/* Request List */}
      <div className="rounded-xl bg-white p-8">
        <h2 className="text-black border-b-2 border-gray-300 mb-6 text-lg font-semibold">
          Current Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-around bg-gray-100 rounded-lg p-4 shadow hover:bg-gray-200 cursor-pointer"
                onClick={() => setSelectedRequest(req)}
              >
                <img
                  src={`http://localhost:8000${req.profile_photo}`}
                  alt="student"
                  className="w-20 h-20 rounded-full object-cover mr-6"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-black">{req.studentName}</p>
                  <p className="text-sm text-gray-700">Exam Year: {req.examYear}</p>
                  <p className="text-sm text-gray-700">
                    Modules: {JSON.parse(req.courseModules).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Popup */}
      {showCodePopup && (
        <div className="fixed inset-0 z-50 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-md rounded-lg shadow-xl flex flex-col justify-center items-center p-6 relative">
            <button
              onClick={() => setShowCodePopup(false)}
              className="absolute top-3 right-3 hover:bg-gray-200 rounded-full p-1"
            >
              <X className="text-black w-5 h-5" />
            </button>
            <p className="text-black my-3 text-lg font-semibold">New code generated!</p>
            <div className="bg-blue-500 rounded-lg px-6 py-3 w-full text-center">
              <p className="text-white text-lg font-semibold tracking-wider">{newCode}</p>
            </div>
            <p className="text-black my-3 text-sm text-center px-4">
              This code can be used to access the registration portal.
            </p>
          </div>
        </div>
      )}

      {/* Request Detail Popup */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-3 right-3 hover:bg-gray-200 rounded-full p-1"
            >
              <X className="text-black w-5 h-5" />
            </button>

            <div className="flex gap-6 mb-6">
              <img
                src={`http://localhost:8000${selectedRequest.profile_photo}`}
                alt="student"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-4">{selectedRequest.studentName}</h3>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-3 text-black mb-6">
              <h4 className="text-lg font-semibold border-b pb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <p><b>Gender:</b> {selectedRequest.gender}</p>
                <p><b>Date of Birth:</b> {selectedRequest.dob}</p>
                <p><b>NIC:</b> {selectedRequest.nic}</p>
                <p><b>Ethnicity:</b> {selectedRequest.ethnicity}</p>
                <p><b>Email:</b> {selectedRequest.email}</p>
                <p><b>Mobile:</b> {selectedRequest.mobile}</p>
              </div>
              <p><b>Address:</b> {selectedRequest.address}</p>
            </div>

            {/* Guardian Information Section */}
            <div className="space-y-3 text-black mb-6">
              <h4 className="text-lg font-semibold border-b pb-2">Guardian Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <p><b>Guardian Name:</b> {selectedRequest.guardianName}</p>
                <p><b>Guardian Mobile:</b> {selectedRequest.guardianMobile}</p>
                <p className="col-span-2"><b>Relation:</b> {selectedRequest.guardianRelation}</p>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-3 text-black mb-6">
              <h4 className="text-lg font-semibold border-b pb-2">Academic Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <p><b>Previous Education:</b> {selectedRequest.previousEducation}</p>
                <p><b>Grade:</b> {selectedRequest.grade}</p>
                <p><b>Exam:</b> {selectedRequest.exam}</p>
                <p><b>Exam Year:</b> {selectedRequest.examYear}</p>
              </div>
              <p><b>Course Modules:</b> {JSON.parse(selectedRequest.courseModules).join(", ")}</p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

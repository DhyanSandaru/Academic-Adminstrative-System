// RemoteRegistration.jsx
// Admin panel for the Socket.IO reverse-verification registration flow.
// Left panel: live Waiting Room (Socket.IO) — shows 3-digit number buttons.
// Right panel: pending request queue (existing REST/approve-reject flow, unchanged).

import axios from "axios";
import { Wifi, WifiOff, Users, CheckCircle, X, UserCheck, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:8000";

// ── Waiting Room Panel ────────────────────────────────────────────────────────
function WaitingRoomPanel() {
  const [connected, setConnected] = useState(false);
  const [waitingStudents, setWaitingStudents] = useState([]);
  const [authorizing, setAuthorizing] = useState(null); // number being authorized
  const [recentlyAuthorized, setRecentlyAuthorized] = useState([]); // brief flash
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      query: { clientType: "admin" },
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));

    socket.on("waiting_room_update", (students) => {
      setWaitingStudents(students);
    });

    socket.on("authorize_error", ({ message }) => {
      alert(`Authorization error: ${message}`);
      setAuthorizing(null);
    });

    return () => socket.disconnect();
  }, []);

  const handleAuthorize = (number) => {
    setAuthorizing(number);
    socketRef.current.emit("authorize_student", number);

    // Show success flash then clean up
    setTimeout(() => {
      setRecentlyAuthorized((prev) => [...prev, number]);
      setAuthorizing(null);
      setTimeout(() => {
        setRecentlyAuthorized((prev) => prev.filter((n) => n !== number));
      }, 2000);
    }, 400);
  };

  return (
    <div className="bg-white rounded-xl p-6 h-full flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Waiting Room</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Students waiting for registration authorization
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
            connected
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {connected ? (
            <Wifi size={13} />
          ) : (
            <WifiOff size={13} />
          )}
          {connected ? "Live" : "Disconnected"}
        </div>
      </div>

      {/* Student number grid */}
      <div className="flex-1 min-h-0">
        {waitingStudents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Users size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">No students waiting</p>
            <p className="text-xs text-gray-400 mt-1">
              Students will appear here when they connect
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {waitingStudents.map(({ number, connectedAt }) => {
              const isAuthorizing = authorizing === number;
              const isAuthorized = recentlyAuthorized.includes(number);
              const waitSeconds = Math.floor((Date.now() - connectedAt) / 1000);
              const waitLabel =
                waitSeconds < 60
                  ? `${waitSeconds}s`
                  : `${Math.floor(waitSeconds / 60)}m`;

              return (
                <button
                  key={number}
                  onClick={() => handleAuthorize(number)}
                  disabled={isAuthorizing || isAuthorized}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 font-bold text-3xl group
                    ${isAuthorized
                      ? "border-green-400 bg-green-50 text-green-600 scale-95"
                      : isAuthorizing
                      ? "border-indigo-300 bg-indigo-50 text-indigo-400 cursor-wait"
                      : "border-gray-200 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md active:scale-95"
                    }`}
                >
                  {isAuthorized ? (
                    <CheckCircle size={32} className="text-green-500" />
                  ) : (
                    <span>{number}</span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] font-normal text-gray-400 mt-1">
                    <Clock size={10} />
                    {waitLabel}
                  </span>
                  {!isAuthorized && !isAuthorizing && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Authorize
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Click a number to instantly authorize that student&apos;s registration form
      </p>
    </div>
  );
}

// ── Request Queue Panel (unchanged REST flow) ─────────────────────────────────
function RequestQueuePanel() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/requests/view-requests`);
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
      await axios.post(`${BACKEND_URL}/api/requests/approve-request/${selectedRequest.id}`);
      await fetchRequests();
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
      await axios.delete(`${BACKEND_URL}/api/requests/reject-request/${selectedRequest.id}`);
      await fetchRequests();
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

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Submitted Requests</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Review and approve student registrations
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600">
          <UserCheck size={13} />
          {requests.length} pending
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="py-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <UserCheck size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No pending requests</p>
          <p className="text-xs text-gray-400 mt-1">
            Submitted forms will appear here for review
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 cursor-pointer transition-all"
              onClick={() => setSelectedRequest(req)}
            >
              <img
                src={`${BACKEND_URL}${req.profile_photo}`}
                alt="student"
                className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{req.studentName}</p>
                <p className="text-sm text-gray-500">Exam Year: {req.examYear}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Modules: {JSON.parse(req.courseModules).join(", ")}
                </p>
              </div>
              <span className="text-xs text-indigo-500 font-medium shrink-0">Review →</span>
            </div>
          ))}
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-1.5 transition"
            >
              <X className="text-gray-500 w-5 h-5" />
            </button>

            <div className="flex gap-5 mb-6">
              <img
                src={`${BACKEND_URL}${selectedRequest.profile_photo}`}
                alt="student"
                className="w-28 h-28 object-cover rounded-xl border-2 border-gray-100 shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedRequest.studentName}</h3>
                <p className="text-sm text-gray-500">Pending approval</p>
              </div>
            </div>

            <div className="space-y-5 text-gray-800">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-2 mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Gender:</span> {selectedRequest.gender}</p>
                  <p><span className="font-medium">Date of Birth:</span> {selectedRequest.dob}</p>
                  <p><span className="font-medium">NIC:</span> {selectedRequest.nic}</p>
                  <p><span className="font-medium">Ethnicity:</span> {selectedRequest.ethnicity}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                  <p><span className="font-medium">Mobile:</span> {selectedRequest.mobile}</p>
                  <p className="col-span-2"><span className="font-medium">Address:</span> {selectedRequest.address}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-2 mb-3">
                  Guardian Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Guardian Name:</span> {selectedRequest.guardianName}</p>
                  <p><span className="font-medium">Guardian Mobile:</span> {selectedRequest.guardianMobile}</p>
                  <p className="col-span-2"><span className="font-medium">Relation:</span> {selectedRequest.guardianRelation}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-2 mb-3">
                  Academic Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Previous Education:</span> {selectedRequest.previousEducation}</p>
                  <p><span className="font-medium">Grade:</span> {selectedRequest.grade}</p>
                  <p><span className="font-medium">Exam:</span> {selectedRequest.exam}</p>
                  <p><span className="font-medium">Exam Year:</span> {selectedRequest.examYear}</p>
                  <p className="col-span-2">
                    <span className="font-medium">Course Modules:</span>{" "}
                    {JSON.parse(selectedRequest.courseModules).join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleReject}
                className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
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

// ── Root export ───────────────────────────────────────────────────────────────
export default function RemoteReg() {
  return (
    <div className="rounded-xl w-full p-6 flex flex-col gap-5">
      <WaitingRoomPanel />
      <RequestQueuePanel />
    </div>
  );
}

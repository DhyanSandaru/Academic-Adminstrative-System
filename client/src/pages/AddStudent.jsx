import { useNavigate } from "react-router-dom";
import { UserRoundCog, QrCode } from 'lucide-react';
import Layout from "../components/Layout";

export default function AddStudent() {
  const navigate = useNavigate();

  return (
    <Layout title="Add Student">
      <div className="w-full min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
        <div className="text-center space-y-6 bg-white p-20 rounded-xl">
          <h2 className="text-2xl font-bold text-black">Choose How to Add a Student</h2>

          <div className="flex items-center flex-col gap-4">
            <button
              onClick={() => navigate("/add-student/manual")}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center font-semibold justify-center gap-2 shadow w-72 h-18"
            >
              <UserRoundCog />
              Enter Details Manually
            </button>

            <button
              onClick={() => navigate("/add-student/remote")}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 shadow w-72 h-18"
            >
              <QrCode />
              Remote Registration (QR/Code)
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

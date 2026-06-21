import { useNavigate } from "react-router-dom";
import { UserRoundPlus, QrCode, ArrowRight } from 'lucide-react';
import Layout from "../components/Layout";

export default function AddStudent() {
  const navigate = useNavigate();

  return (
    <Layout title="Add Student">
      <div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add a New Student</h1>
          <p className="text-lg text-gray-600">Choose the method that works best for you to register a new student in the system</p>
        </div>

        {/* Options Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
          
          {/* Manual Entry Card */}
          <div 
            onClick={() => navigate("/add-student/manual")}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-100 hover:border-blue-300"
          >
            <div className="flex flex-col items-center h-full">
              {/* Icon Container */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-full p-6 mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserRoundPlus className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Manual Entry</h3>
              <p className="text-gray-600 text-center mb-6 flex-grow">
                Enter student details directly into the form. Perfect for detailed information entry and verification.
              </p>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-lg">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Remote Registration Card */}
          <div 
            onClick={() => navigate("/add-student/remote")}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-100 hover:border-green-300"
          >
            <div className="flex flex-col items-center h-full">
              {/* Icon Container */}
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-full p-6 mb-6 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-12 h-12 text-green-600" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">QR/Code Registration</h3>
              <p className="text-gray-600 text-center mb-6 flex-grow">
                Use QR codes or registration codes for quick and efficient student registration from remote locations.
              </p>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-lg">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600 text-sm max-w-2xl">
          <p>Need help? Both methods will guide you through the process step by step with validation at each stage.</p>
        </div>
      </div>
    </Layout>
  );
}

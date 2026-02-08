import { User, Phone, Lock } from "lucide-react";
import Layout from "../Layout"; // main site header/navigation

export default function AdminLayout({
  children,
  showForm,
  setShowForm,
  activeSection,
  scrollToSection,
  personalRef,
  contactRef,
  accountRef,
}) {
  return (
    <Layout title="Admin Profile">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 md:px-0 space-y-6">
        {/* ---------- Top Navigation & Add Admin Button ---------- */}
        {!showForm && (
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-center bg-white p-4 rounded-2xl shadow-md mb-6">
            {/* Section Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
              <button
                onClick={() => scrollToSection(personalRef, "personal")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                  activeSection === "personal"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <User size={20} /> Personal Details
              </button>

              <button
                onClick={() => scrollToSection(contactRef, "contact")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                  activeSection === "contact"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Phone size={20} /> Contact Details
              </button>

              <button
                onClick={() => scrollToSection(accountRef, "account")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                  activeSection === "account"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Lock size={20} /> Account Details
              </button>
            </div>

            {/* Add Admin Button
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md w-full md:w-auto text-sm sm:text-base"
            >
              Add Admin
            </button> */}
          </div>
        )}

        {/* ---------- Page Content ---------- */}
        {children}
      </div>
    </Layout>
  );
}

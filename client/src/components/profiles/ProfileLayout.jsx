import { useCallback } from 'react';
import Layout from '../Layout';
import { User, Phone, GraduationCap, CreditCard, Trash } from 'lucide-react';
import axios from 'axios';

export default function ProfileLayout({ children, title }) {
  // Memoized smooth scroll function to prevent recreation on every render
  const smoothScroll = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <Layout title={title}>
      <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-5 mb-6 sticky top-4 z-10">
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[200px]">
                <button 
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                  onClick={() => smoothScroll("personal-details")}
                >
                  <User size={20} />
                  Personal Details
                </button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <button 
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                  onClick={() => smoothScroll("contact-details")}
                >
                  <Phone size={20} />
                  Contact Details
                </button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <button 
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                  onClick={() => smoothScroll("education-details")}
                >
                  <GraduationCap size={20} />
                  Education Details
                </button>
              </div>

              <div className="flex-1 min-w-[200px]">
                <button 
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                  onClick={() => smoothScroll("payment-details")}
                >
                  <CreditCard size={20} />
                  Payment Status
                </button>
              </div>
            </div>
          </div>
            
          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}
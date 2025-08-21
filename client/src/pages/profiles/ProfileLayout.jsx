import {Link} from 'react-router-dom'
import Layout from '../../components/Layout';

export default function ProfileLayout({ children }) {
  return (
    <Layout>
      <div className="min-h-screen bg-[#e3edf9] p-6 flex gap-6 justify-center items-center">
        {/* Sidebar */}
        <div className="w-60 h-fit bg-white rounded-lg shadow">
          <div className="p-6 space-y-4 flex flex-col">
            <Link to='/personal-details'>
              <button className="w-full justify-center text-black font-medium py-3 rounded-lg bg-[#ffc20e]">
              Personal Details
            </button>
            </Link>

            <Link to='/contact-details'>
               <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
              Contact Details
            </button>
            </Link>
           
           <Link to='/education-details'>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Education Details
              </button>
            </Link>
            <Link to='/payment-status'>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Payment Status
              </button>
            </Link>
            
          </div>
        </div>

        {/* Page-specific content */}
        <div className="flex-1 bg-white rounded-lg shadow text-black w-[50vw]">
          {children}
        </div>
    </div>
    </Layout>
    
  );
}

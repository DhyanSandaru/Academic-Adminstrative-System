import {Link} from 'react-scroll'
import Layout from '../Layout';

export default function ProfileLayout({ children,title}) {
  return (
    <Layout title={title}>
      <div className="w-3/4 bg-[#e3edf9] p-6 flex flex-col gap-6 justify-center items-center">
        {/* Sidebar */}
        <div className="h-fit bg-white rounded-lg shadow">
          <div className="p-6 space-x-4 flex flex-row">
            <Link to='/view-lecturers/personal-details'>
              <button className="w-full justify-center text-black font-medium py-3 rounded-lg bg-[#ffc20e]">
              Personal Details
            </button>
            </Link>

            <Link to='/view-lecturers/contact-details'>
               <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
              Contact Details
            </button>
            </Link>
           
           <Link to='/view-lecturers/education-details'>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Education Details
              </button>
            </Link>
          
            <Link to='/view-lecturers/calculate-salary'>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Calculate Salary
              </button>
            </Link>
            
          </div>
        </div>

        {/* Page-specific content */}
        <div className="rounded-lg shadow text-black flex flex-col gap-10 w-full">
          {children}
        </div>
    </div>
    </Layout>
    
  );
}

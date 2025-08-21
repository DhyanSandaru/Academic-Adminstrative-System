
export default function LecturerProfile() {
  return (
    <div className="min-h-screen bg-[#e3edf9]">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="w-6 h-6 text-black">{'<'}</span>
          <h1 className="text-xl font-medium text-black">
            View Students / Joeylene Rivera
          </h1>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 h-fit bg-white rounded-lg shadow">
            <div className="p-6 space-y-4">
              <button className="w-full justify-center text-black font-medium py-3 rounded-lg bg-[#ffc20e]">
                Personal Details
              </button>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Contact Details
              </button>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Education Details
              </button>
              <button className="w-full justify-center font-medium py-3 rounded-lg bg-[#e3edf9] text-black">
                Payment Status
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="p-8">
              {/* Edit Button */}
              <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 text-[#878585]">
                  <span className="w-5 h-5">✎</span>
                  Edit
                </button>
              </div>

              {/* Profile Section */}
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                  
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium mb-1 text-[#878585]">
                    Student Name
                  </p>
                  <h2 className="text-2xl font-bold text-black">
                    Joyylene Rivera
                  </h2>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-medium mb-1 text-[#878585]">
                    Student ID
                  </p>
                  <p className="text-xl font-bold text-black">S8591</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2 text-[#878585]">NIC</p>
                  <p className="text-lg font-semibold text-black">
                    200576459765
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-2 text-[#878585]">
                    Gender
                  </p>
                  <p className="text-lg font-semibold text-black">Female</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

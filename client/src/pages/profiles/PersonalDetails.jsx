import ProfileLayout from './ProfileLayout.jsx';

export default function LecturerProfile() {
  return (
    <ProfileLayout>
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
            {/* Optional Image Goes Here */}
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium mb-1 text-[#878585]">
              Student Name
            </p>
            <h2 className="text-2xl font-bold text-black">Joeylene Rivera</h2>
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
            <p className="text-lg font-semibold text-black">200576459765</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-2 text-[#878585]">Gender</p>
            <p className="text-lg font-semibold text-black">Female</p>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

import { useState } from "react";

export default function AddAdminForm() {
  return (
    <div className="flex-1 p-8">
      <form className="space-y-8 max-w-4xl mx-auto">
        {/* Admin Name */}
        <div className="flex items-center gap-8">
          <label htmlFor="admin-name" className="w-40 text-[#000000] font-medium">
            Admin Name :
          </label>
          <div className="flex-1">
            <input
              id="admin-name"
              className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
            />
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex items-center gap-8">
            <label htmlFor="profile-photo" className="w-40 text-[#000000] font-medium">Profile Photo :</label>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1">
                <input id="profile-photo" className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-60" />
              </div>
              <button className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-6 py-2 rounded-lg">Choose</button>
            </div>
          </div>


        {/* Email */}
        <div className="flex items-center gap-8">
          <label htmlFor="email" className="w-40 text-[#000000] font-medium">
            Email :
          </label>
          <div className="flex-1">
            <input
              type="email"
              id="email"
              className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center gap-8">
          <label htmlFor="password" className="w-40 text-[#000000] font-medium">
            Password :
          </label>
          <div className="flex-1">
            <input
              type="password"
              id="password"
              className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-12 py-3 rounded-lg text-lg font-medium"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
}

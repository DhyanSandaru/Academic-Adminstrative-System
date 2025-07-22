import Navbar2 from "./Navbar2";
import { useState } from "react";

export default function Layout({ children,title }) {

    const [sideBarOpen, setSideBarOpen] = useState(true);

    const toggleSidebar = () => {
        setSideBarOpen(!sideBarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#e3edf9]">
            <Navbar2 isOpen={sideBarOpen} setIsopen={setSideBarOpen} admin="admin123"/>
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <header className="bg-white px-6 py-4 flex items-center gap-4 border-b">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-200">
                    <img src="/images/side_nav.png" alt="sidebar" className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <img src="/images/add_student.png" alt="" className="w-8"/>
                    <h2 className="text-xl font-semibold text-[#000000]">{title}</h2>
                </div>
                </header>
                {/* Main Content */}
                <main className="flex flex-col p-4 justify-center items-center gap-5">
                    {children}
                </main>
            </div>
        </div>
    );
}
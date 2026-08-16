import Navbar2 from "./Navbar2";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ConnectionStatus from "./ConnectionStatus";
import { Bell } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Layout({ children,title }) {

    const {user, pendingRequestsCount} = useContext(AuthContext);
    const [sideBarOpen, setSideBarOpen] = useState(true);

    const toggleSidebar = () => {
        setSideBarOpen(!sideBarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#e3edf9]">
            <Navbar2 isOpen={sideBarOpen} setIsopen={setSideBarOpen} admin={user.name}/>
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <header className="bg-white px-6 py-4 flex items-center gap-4 border-b rounded-xl m-3">
                    <button onClick={toggleSidebar} className="p-2 hover:bg-gray-200">
                        <img src="/images/side_nav.png" alt="sidebar" className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/images/add_student.png" alt="" className="w-8"/>
                        <h2 className="text-xl font-semibold text-[#000000]">{title}</h2>
                    </div>
                    <ConnectionStatus/>
                    <div className="ml-3">
                        <div className="relative">
                            <Link to={"/add-student/remote"}>
                                <button title="Pending requests" className="p-2 hover:bg-gray-100 rounded-full">
                                    <Bell className="text-gray-600" />
                                </button>
                            </Link>
                            {pendingRequestsCount > 0 && (
                                <span className="absolute -top-0 -right-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
                            )}
                        </div>
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
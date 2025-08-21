export default function Navbar(props){
    return(
        <div className="flex flex-col gap-4 p-4 bg-blue-900 h-screen w-64 text-white">
            <div className="flex items-center gap-2 mb-10 mt-3">
                <img src="/images/admin-icon.png" alt="admin_icon" className="w-20 ml-3"/>
                <p>props.admin</p>
            </div>
            <div>
                <p className="mb-3">Features</p>
                <div className="navitems">
                    <img src="/images/dashboard-icon.png" alt="dashboard" className="w-7"/>
                    <span>Dashboard</span>
                </div>
                <div className="navitems">
                     <img src="/images/timetable-icon.png" alt="timetable" className="w-7"/>
                    <span>Timetable</span>
                </div>
            </div>
            <div >
                <p className="mb-3">Student management</p>
                <div className="navitems">
                    <img src="/images/student.png" alt="add_student" className="w-9 -mr-1"/>
                    <span>Add student</span>
                </div>
                <div className="navitems">
                    <img src="/images/view-students.png" alt="view_students" className="w-8" />
                    <span>View Student</span>
                </div>
            </div>
            <div>
                <p className="mb-3">Lecturer Management</p>
                <div className="navitems">
                    <img src="/images/add-lecturer.png" alt="add_lecturer" className="w-8" />
                    <span>Add Lecturer</span>
                </div>
                <div className="navitems">
                    <img src="/images/view-lecturers.png" alt="view_lecturers" className="w-8" />
                    <span>View Lecturers</span>
                </div>
            </div>
            <div>
                <p className="mb-3">Payment Management</p>
                 <div className="navitems">
                    <img src="/images/add-payment.png" alt="add_payment" className="w-9 -mr-1" />
                    <span>Add Payement</span>
                </div>
                 <div className="navitems">
                    <img src="/images/view-payments.png" alt="view_payments" className="w-8 -mr-1" />
                    <span>View Payments</span>
                </div>
            </div>
            <button className="bg-red-500">Log out</button>
        </ div>
    )
}
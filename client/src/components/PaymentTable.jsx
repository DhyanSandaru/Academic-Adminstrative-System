import { useState } from "react";
import PaymentReceipt from "./PaymentReceipt.jsx";

export default function PaymentTable({payments}){
    const [paymentData, setPaymentData] = useState({
        studentName: '',
        studentId: '',
        courseModule: '',
        lecturer: '',
        amount: '',
        refNo: '',
        createdAt: ''
    });
    const [popup, setpopup] = useState(false);
    return(
        <>
            <div className="overflow-x-auto shadow-2xl w-full rounded-lg">
                <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-[#253d90]">
                    <th className="py-3 px-4 text-center font-semibold text-white">Name</th>
                    <th className="py-3 px-4 text-center font-semibold text-white">Student ID</th>
                    <th className="py-3 px-4 text-center font-semibold text-white">Date</th>
                    <th className="py-3 px-4 text-center font-semibold text-white">Time</th>
                    <th className="py-3 px-4 text-center font-semibold text-white">Course</th>
                    <th className="py-3 px-4 text-center font-semibold text-white">Lecturer</th>
                    <th className="py-3 px-4 text-center font-semibold text-white">Payment</th>
                    </tr>
                </thead>
                </table>
            </div>
            {/* Scrollable Table Body */}
            <div className="overflow-y-auto flex-1 overflow-x-auto w-full rounded-lg">
                <table className="w-full table-fixed">
                <tbody>
                    {payments.length > 0 ? (
                    payments.map((payment, index) => (
                        <tr
                        key={index}
                        onClick={() => {
                            setPaymentData(
                                {
                                    studentName: payment.student_name,
                                    studentId: payment.student_id,
                                    courseModule: payment.course_module,
                                    lecturer: payment.lecturer,
                                    amount: payment.amount,
                                    refNo: payment.ref_no,
                                    createdAt: payment.created_at
                                }
                            )
                            setpopup(true);
                        }}
                    
                        className={`${index % 2 === 0 ? "bg-white" : "bg-[#f8f9fa]"} border-b hover:bg-gray-100 hover:scale-103 transition duration-150 ease-in-out cursor-pointer`}
                        >
                        <td className="py-3 px-4 font-medium text-[#121c3e]">{payment.student_name}</td>
                        <td className="py-3 px-4 text-[#121c3e]">{payment.student_id}</td>
                        <td className="py-3 px-4 text-[#121c3e]">
                            {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-[#121c3e]">
                            {new Date(payment.created_at).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 text-[#121c3e]">{payment.course_module}</td>
                        <td className="py-3 px-4 text-[#121c3e]">{payment.lecturer}</td>
                        <td className="py-3 px-4 text-[#121c3e] font-medium">{payment.amount}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="7" className="py-6 text-center text-[#121c3e]">
                        No records found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
                {popup && (
                    <PaymentReceipt data={paymentData} onClose={() => setPaymentData(null)}/>
                )}
            </div>
        </>
    )
}
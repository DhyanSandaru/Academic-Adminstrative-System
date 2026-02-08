import { useState } from "react";
import PaymentReceipt from "./PaymentReceipt.jsx";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileDown, FileSpreadsheet } from "lucide-react";

export default function PaymentTable({payments}){

    const exportPDF = () => {
    if (!payments || payments.length === 0) return alert("No payment records to export.");

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Payment Report", 14, 15);

    const headers = ["Name", "Student ID", "Date", "Time", "Course", "Lecturer", "Payment"];
    const rows = payments.map(p => [
        p.student_name,
        p.student_id,
        new Date(p.created_at).toLocaleDateString(),
        new Date(p.created_at).toLocaleTimeString(),
        p.course_module,
        p.lecturer,
        p.amount,
    ]);

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [18, 28, 62] },
    });

    doc.save("payments.pdf");
    };

    const exportExcel = () => {
        if (!payments || payments.length === 0) return;

        const worksheetData = payments.map((p) => ({
        Name: p.student_name,
        "Student ID": p.student_id,
        Date: new Date(p.created_at).toLocaleDateString(),
        Time: new Date(p.created_at).toLocaleTimeString(),
        Course: p.course_module,
        Lecturer: p.lecturer,
        Payment: p.amount,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

        const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        });
        saveAs(new Blob([excelBuffer]), "payments.xlsx");
    };


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
                {/* ✅ Export Buttons */}
                <div className="flex justify-end gap-3 mb-4">
                    <button
                    onClick={exportPDF}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                    >
                    <FileDown size={16} />
                    Export PDF
                    </button>
                    <button
                    onClick={exportExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                    <FileSpreadsheet size={16} />
                    Export Excel
                    </button>
                </div>

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
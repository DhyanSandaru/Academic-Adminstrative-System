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
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                {/* ✅ Export Buttons */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                    <div className="flex justify-end gap-3">
                        <button
                        onClick={exportPDF}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                        <FileDown size={16} />
                        Export PDF
                        </button>
                        <button
                        onClick={exportExcel}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                        <FileSpreadsheet size={16} />
                        Export Excel
                        </button>
                    </div>
                </div>

                {/* Fixed Header */}
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                            <tr>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Name</th>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Student ID</th>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Date</th>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Time</th>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Course</th>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Lecturer</th>
                                <th className="py-4 px-6 text-left font-bold text-sm uppercase tracking-wider">Payment</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto max-h-96 overflow-x-auto">
                    <table className="w-full table-fixed">
                        <tbody className="divide-y divide-gray-200">
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
                            
                                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 hover:scale-102 transition-all duration-200 cursor-pointer border-b border-gray-100`}
                                >
                                <td className="py-4 px-6 text-gray-900 font-medium">{payment.student_name}</td>
                                <td className="py-4 px-6 text-gray-700">{payment.student_id}</td>
                                <td className="py-4 px-6 text-gray-700">
                                    {new Date(payment.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-gray-700">
                                    {new Date(payment.created_at).toLocaleTimeString()}
                                </td>
                                <td className="py-4 px-6 text-gray-700">{payment.course_module}</td>
                                <td className="py-4 px-6 text-gray-700">{payment.lecturer}</td>
                                <td className="py-4 px-6 text-gray-900 font-semibold">{payment.amount}</td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-gray-500 text-lg">
                                No payment records found.
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {popup && (
                <PaymentReceipt data={paymentData} onClose={() => setpopup(false)} del={true}/>
            )}
        </>
    )
}
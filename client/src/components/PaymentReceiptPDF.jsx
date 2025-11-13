import { Download } from "lucide-react";
import jsPDF from "jspdf";

export default function PaymentReceiptPDF({ data }) {
  if (!data) return null;

  const {
    studentName,
    studentId,
    courseModule,
    lecturer,
    amount,
    refNo,
    createdAt,
  } = data;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor("#1e3a8a");
    doc.setFont("helvetica", "bold");
    doc.text("Payment Confirmation", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#4b5563");
    doc.setFont("helvetica", "normal");
    doc.text("This is a confirmation of your recent payment.", 105, 28, { align: "center" });

    // Divider
    doc.setDrawColor("#1e3a8a");
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Payment Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 20, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const details = [
      ["Reference Number", refNo],
      ["Date", formattedDate],
      ["Time", formattedTime],
      ["Amount Paid", `LKR ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ];

    details.forEach(([label, value], index) => {
      doc.text(`${label}:`, 20, 55 + index * 8);
      doc.text(`${value}`, 80, 55 + index * 8);
    });

    // Student & Course Details
    doc.setFont("helvetica", "bold");
    doc.text("Student & Course Details", 20, 90);

    doc.setFont("helvetica", "normal");
    const studentDetails = [
      ["Student Name", studentName],
      ["Student ID", studentId],
      ["Course Module", courseModule],
      ["Lecturer", lecturer],
    ];

    studentDetails.forEach(([label, value], index) => {
      doc.text(`${label}:`, 20, 100 + index * 8);
      doc.text(`${value}`, 80, 100 + index * 8);
    });

    // Footer / Thank you
    doc.setFont("helvetica", "italic");
    doc.setTextColor("#6b7280");
    doc.text("Thank you for your payment!", 105, 150, { align: "center" });

    doc.save(`Payment_Receipt_${refNo}.pdf`);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </button>
  );
}

import { Check, Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import PaymentReceiptPDF from "./PaymentReceiptPDF";

export default function PaymentReceipt({ data, onClose }) {
  if (!data) return null;
  const receiptRef = useRef(null);

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

 const handleDownload = async () => {
    if (!receiptRef.current) return;

    // 1️⃣ Capture receipt DOM as canvas
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`receipt_${refNo}.pdf`);
  };


  return (
    <div
      className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        ref={receiptRef}
      >
        {/* Success Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#41d195] to-[#36b880] rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2547b6] rounded-2xl pt-16 pb-0 px-8 text-white relative overflow-hidden shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-20 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16"></div>

          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-blue-200 text-base">
              Your payment has been processed successfully
            </p>
          </div>

          {/* Amount Section */}
          <div className="bg-blue-200 bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center relative z-10">
            <p className="text-gray-700 text-sm mb-2 uppercase tracking-wider">Amount Paid</p>
            <p className="text-4xl font-bold text-gray-800">LKR {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="w-full h-px bg-blue-400 bg-opacity-30 mb-6 relative z-10" />

          {/* Payment Details */}
          <div className="space-y-4 mb-6 relative z-10">
            <DetailRow label="Reference Number" value={refNo} highlight />
            <DetailRow label="Date" value={formattedDate} />
            <DetailRow label="Time" value={formattedTime} />
          </div>

          <div className="w-full h-px bg-blue-400 bg-opacity-30 mb-6 relative z-10" />

          {/* Student & Course Details */}
          <div className="space-y-4 mb-6 relative z-10">
            <DetailRow label="Student Name" value={studentName} />
            <DetailRow label="Student ID" value={studentId} />
            <DetailRow label="Course Module" value={courseModule} />
            <DetailRow label="Lecturer" value={lecturer} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8 relative z-10 justify-center">
            <PaymentReceiptPDF data={data}/>
           
          </div>

          {/* Scalloped Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <svg viewBox="0 0 400 32" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,32 C13.33,16 26.67,16 40,32 C53.33,16 66.67,16 80,32 C93.33,16 106.67,16 120,32 C133.33,16 146.67,16 160,32 C173.33,16 186.67,16 200,32 C213.33,16 226.67,16 240,32 C253.33,16 266.67,16 280,32 C293.33,16 306.67,16 320,32 C333.33,16 346.67,16 360,32 C373.33,16 386.67,16 400,32 L400,32 L0,32 Z"
                className="fill-white"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-blue-200 text-sm">{label}</span>
      <span className={`font-semibold text-right max-w-[60%] ${highlight ? 'text-green-300' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}



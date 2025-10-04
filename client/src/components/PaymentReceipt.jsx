// PaymentReceipt.jsx
import { Check } from "lucide-react";

export default function PaymentReceipt({ data, onClose }) {
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

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full scale-95 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-16 h-16 bg-[#41d195] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#28429b] rounded-3xl pt-16 pb-0 px-8 text-white relative overflow-hidden">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-2xl font-bold mb-4">Payment Success!</p>
            <p className="text-[#a8b5e8] text-lg">
              Your payment has been successfully done.
            </p>
          </div>

          <div className="w-full h-px bg-[#4a5bb8] mb-3" />

          {/* Total Payment */}
          <div className="text-center mb-8">
            <p className="text-[#a8b5e8] text-lg mb-2">Total Payment</p>
            <p className="text-xl font-bold">LKR {amount}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <InfoCard label="Ref Number" value={refNo} />
            <InfoCard label="Payment Time" value={formattedDate} />
            <InfoCard label="Student ID" value={studentId} />
            <InfoCard label="Student Name" value={studentName} />
            <InfoCard label="Lecturer" value={lecturer} />
            <InfoCard label="Course Module" value={courseModule} />
          </div>

          {/* Scalloped Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <svg viewBox="0 0 400 32" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,32 C13.33,16 26.67,16 40,32 C53.33,16 66.67,16 80,32 C93.33,16 106.67,16 120,32 C133.33,16 146.67,16 160,32 C173.33,16 186.67,16 200,32 C213.33,16 226.67,16 240,32 C253.33,16 266.67,16 280,32 C293.33,16 306.67,16 320,32 C333.33,16 346.67,16 360,32 C373.33,16 386.67,16 400,32 L400,32 L0,32 Z"
                fill="#edeff2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border border-[#4a5bb8] rounded-xl p-4">
      <p className="text-[#a8b5e8] text-sm mb-1">{label}</p>
      <p className="text-white font-semibold text-lg truncate">{value}</p>
    </div>
  );
}

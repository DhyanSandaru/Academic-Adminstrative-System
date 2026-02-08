import { useContext, useEffect, useState } from 'react';
import LecturerContext from './LecturerContext.jsx';
import { DollarSign, Calendar, TrendingUp, Download } from 'lucide-react';
import PaymentReceipt from '../PaymentReceipt.jsx';

export default function SalaryCalculation() {
  const { lecturerData } = useContext(LecturerContext);
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salaryPercentage, setSalaryPercentage] = useState(15);
  const [paymentData, setPaymentData] = useState(null);
  const [popup, setPopup] = useState(false);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (lecturerData?.lecturerId) {
      fetchPayments();
    }
  }, [lecturerData, selectedMonth, selectedYear]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/lecturer-payments/${lecturerData.lecturerId}?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
    const lecturerSalary = (totalRevenue * salaryPercentage) / 100;
    return { totalRevenue, lecturerSalary };
  };

  const { totalRevenue, lecturerSalary } = calculateTotals();

  const handleRowClick = (payment) => {
    setPaymentData({
      studentName: payment.student_name,
      studentId: payment.student_id,
      courseModule: payment.course_module,
      lecturer: payment.lecturer,
      amount: payment.amount,
      refNo: payment.ref_no,
      createdAt: payment.created_at
    });
    setPopup(true);
  };

  return (
    <div id="salary-calculation" className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">Salary Calculation</h2>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Month Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Percentage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <TrendingUp className="inline mr-2" size={16} />
              Salary Percentage (%)
            </label>
            <input
              type="number"
              value={salaryPercentage}
              onChange={(e) => setSalaryPercentage(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.5"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Total Payments</p>
            <p className="text-3xl font-bold text-blue-800">{payments.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-800">Rs. {totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Your Salary ({salaryPercentage}%)
            </p>
            <p className="text-3xl font-bold text-purple-800">Rs. {lecturerSalary.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Payment Records - {months[selectedMonth - 1]} {selectedYear}
            </h3>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading payments...</div>
          ) : (
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
                      <th className="py-3 px-4 text-center font-semibold text-white">Payment</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="overflow-y-auto max-h-96 overflow-x-auto w-full rounded-lg">
                <table className="w-full table-fixed">
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(payment)}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'
                          } border-b hover:bg-gray-100 hover:scale-103 transition duration-150 ease-in-out cursor-pointer`}
                        >
                          <td className="py-3 px-4 font-medium text-[#121c3e]">
                            {payment.student_name}
                          </td>
                          <td className="py-3 px-4 text-[#121c3e]">{payment.student_id}</td>
                          <td className="py-3 px-4 text-[#121c3e]">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-[#121c3e]">
                            {new Date(payment.created_at).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4 text-[#121c3e]">{payment.course_module}</td>
                          <td className="py-3 px-4 text-[#121c3e] font-medium">
                            Rs. {parseFloat(payment.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-[#121c3e]">
                          No payment records found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {popup && paymentData && (
        <PaymentReceipt data={paymentData} onClose={() => setPopup(false)} />
      )}
    </div>
  );
}
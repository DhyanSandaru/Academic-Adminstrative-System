import { useContext, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import studentContext from './StudentContext.jsx';
import HorizontalSlider from '../HorizontalSlider.jsx';
import { DollarSign, Table2 } from 'lucide-react';
import PaymentTable from '../PaymentTable.jsx';
import { BiTimeFive } from 'react-icons/bi';

export default function PaymentStatus() {
  const { studentData } = useContext(studentContext);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentData?.studentId || !studentData?.courses?.length) {
      setLoading(false);
      return;
    }

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/payments/${studentData.studentId}`
        );
        setMonthlyPayments(response.data || []);
      } catch (err) {
        console.error('Error fetching payments:', err);
        // Don't alert, just log - payment failures shouldn't disrupt profile viewing
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [studentData?.studentId]); // Only refetch if studentId changes

  // Memoize payment slides to prevent recalculation on every render
  const paymentSlides = useMemo(() => {
    if (!studentData?.courses || monthlyPayments.length === 0) return [];

    const now = new Date();
    const slides = [];

    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      const paidCourses = monthlyPayments
        .filter((p) => {
          const createdAt = new Date(p.created_at);
          return (
            createdAt.getMonth() === monthDate.getMonth() &&
            createdAt.getFullYear() === monthDate.getFullYear()
          );
        })
        .map((p) => ({
          course_module: p.course_module,
          lecturer: p.lecturer,
          amount: p.amount
        }));

      const courseStatuses = studentData.courses.map((course) => {
        const paidCourse = paidCourses.find((p) => p.course_module === course);
        return {
          name: course,
          status: paidCourse ? 'Paid' : 'Pending',
          lecturer: paidCourse?.lecturer || 'N/A',
          amount: paidCourse?.amount || 'N/A'
        };
      });

      slides.push(
        <div key={monthKey} className="pl-6 bg-white">
          <h3 className="text-xl font-bold mb-4 text-black text-center">{monthKey}</h3>
          {courseStatuses.map((course, index) => (
            <div key={index} className='rounded-xl shadow p-5 mb-3'>
              <div className="flex justify-between items-center py-2">
                <span className='text-black font-medium'>{course.name}</span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    course.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <div className='flex justify-around text-gray-700 text-sm'>
                <span>Lecturer: {course.lecturer}</span>  
                <span>Amount: {course.amount}</span>     
              </div>
            </div>
          ))}
        </div>
      );
    }

    return slides;
  }, [studentData?.courses, monthlyPayments]);

  if (loading) {
    return (
      <div id='payment-details' className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div id='payment-details' className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-6">
        <div className="flex items-center gap-3">
          <DollarSign className="text-white" size={28} />
          <h2 className="text-2xl font-bold text-white">Payment Details</h2>
        </div>
      </div>
      
      <div className='w-full items-center justify-center my-10 flex flex-col px-8 gap-10'>
        <div className='pt-8 flex flex-col gap-5 w-full'>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BiTimeFive size={20} className="text-amber-600" />
            Monthly Payments
          </h3>
          {paymentSlides.length > 0 ? (
            <HorizontalSlider slides={paymentSlides} width={800} />
          ) : (
            <p className="text-gray-500 text-center py-8">No payment history available</p>
          )}
        </div>

        <div className='border-t-2 border-gray-200 pt-8 flex flex-col gap-5 w-full'>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Table2 size={20} className="text-amber-600" />
            All Payments
          </h3>
          <PaymentTable payments={monthlyPayments} />
        </div>
      </div>
    </div>
  );
}
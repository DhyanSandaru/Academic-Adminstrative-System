import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import studentContext from './StudentContext.jsx';
import HorizontalSlider from '../HorizontalSlider.jsx';
import Badge from '../Badge.jsx';

export default function PaymentStatus() {
  const { studentData } = useContext(studentContext);
  const [monthlyPayments, setMonthlyPayments] = useState([]);

  useEffect(() => {
    if (!studentData) return;

    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/payments/${studentData.studentId}`
        );
        const allPayments = response.data;

        const now = new Date();
        const slides = [];

        for (let i = 0; i < 3; i++) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = monthDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          });

          const paidCourses = allPayments
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
              lecturer: paidCourse ? paidCourse.lecturer : 'N/A',
              amount: paidCourse? paidCourse.amount : 'N/A'
            };
          });


          // Build slide
          slides.push(
            <div className="lpl-6 bg-white">
              <h3 className="text-xl font-bold mb-4 text-center">{monthKey}</h3>
              {courseStatuses.map((course, i) => (
                <div className='rounded-xl shadow p-5'>

                  <div
                    key={i}
                    className="flex justify-between items-center py-2"
                  >
                    <span>{course.name}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                        course.status === 'Paid'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <div className='flex justify-around text-gray-700'>
                    <span>Lecturer: {course.lecturer}</span>  
                    <span>Amount: {course.amount}</span>     
                  </div>

                </div>
              ))}
            </div>
          );
        }

        setMonthlyPayments(slides);
      } catch (err) {
        console.error('Error fetching payments:', err);
        alert('Failed to load payment data');
      }
    };

    fetchPayments();
  }, [studentData]);

  if (!studentData) return <p>Loading...</p>;

  return (
    <div className=" bg-white rounded-xl shadow-xl flex items-center justify-center p-10">
      <HorizontalSlider slides={monthlyPayments} width={500} />
    </div>
  );
}

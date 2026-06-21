// Dashboard.jsx - Updated with separate API calls
import React, { useEffect, useState, useMemo } from "react";
import { User, Shield, ClipboardPlus, DollarSign, GraduationCap, Loader, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FlashCard from './FlashCard.jsx';
import { AuthContext } from "../context/AuthContext.jsx";

const API_BASE_URL = 'http://localhost:8000/api/dashboard';

const COLORS = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899'
};

const PAYMENT_COLORS = ['#10b981', '#f59e0b'];
const COURSE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = React.useContext(AuthContext);
  
  // Flash cards data
  const [flashCardsData, setFlashCardsData] = useState({
    totalStudents: { value: 0, change: 0, percentage: 0 },
    totalLecturers: { value: 0, change: 0, percentage: 0 },
    availableCourses: { value: 0 },
    monthPayments: { value: 0, change: 0, percentage: 0 },
    newStudents: { value: 0 },
    pendingPayments: { value: 0 }
  });
  
  // Chart data
  const [registrationData, setRegistrationData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [paymentCollectionRate, setPaymentCollectionRate] = useState([]);
  const [lecturerWorkload, setLecturerWorkload] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);

  // Memoized time display to prevent chart re-renders
  const timeDisplay = useMemo(() => ({
    date: currentTime.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    time: currentTime.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }), [currentTime]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch flash cards data
  useEffect(() => {
    const fetchFlashCards = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/flashcards`);
        if (!response.ok) throw new Error('Failed to fetch flash cards data');
        const data = await response.json();
        setFlashCardsData(data);
      } catch (err) {
        console.error('Error fetching flash cards:', err);
        setError('Failed to load flash cards data.');
      }
    };

    fetchFlashCards();
  }, []);

  // Fetch all chart data
  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          registrationsRes,
          revenueRes,
          courseRes,
          paymentRes,
          collectionRateRes,
          lecturerWorkloadRes,
          pendingAppsRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/registrations`),
          fetch(`${API_BASE_URL}/revenue`),
          fetch(`${API_BASE_URL}/course-distribution`),
          fetch(`${API_BASE_URL}/payment-status`),
          fetch(`${API_BASE_URL}/payment-collection-rate`),
          fetch(`${API_BASE_URL}/lecturer-workload`),
          fetch(`${API_BASE_URL}/pending-applications`)
        ]);

        // Check if all responses are ok
        if (!registrationsRes.ok || !revenueRes.ok || !courseRes.ok || !paymentRes.ok || !collectionRateRes.ok || !lecturerWorkloadRes.ok || !pendingAppsRes.ok) {
          throw new Error('Failed to fetch chart data');
        }

        const [registrations, revenue, courses, payments, collectionRate, lecturerWorkloadData, pendingApps] = await Promise.all([
          registrationsRes.json(),
          revenueRes.json(),
          courseRes.json(),
          paymentRes.json(),
          collectionRateRes.json(),
          lecturerWorkloadRes.json(),
          pendingAppsRes.json()
        ]);

        setRegistrationData(registrations);
        setRevenueData(revenue);
        setCourseDistribution(courses);
        setPaymentStatus(payments);
        setPaymentCollectionRate(collectionRate);
        setLecturerWorkload(lecturerWorkloadData);
        setPendingApplications(pendingApps);

      } catch (err) {
        console.error('Error fetching charts data:', err);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  // Combine registration and revenue data for charts
  const combinedData = useMemo(() => {
  const map = new Map();

  registrationData.forEach(r => {
    map.set(r.month, { month: r.month, registrations: r.registrations, revenue: 0 });
  });

  revenueData.forEach(r => {
    if (map.has(r.month)) {
      map.get(r.month).revenue = r.revenue;
    } else {
      map.set(r.month, { month: r.month, registrations: 0, revenue: r.revenue });
    }
  });

  return Array.from(map.values());
}, [registrationData, revenueData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 w-full">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-gray-500 text-sm">Welcome back,</p>
            <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Admin'}</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Date</span>
              <span className="text-gray-800 font-semibold">{timeDisplay.date}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Time</span>
              <span className="text-gray-800 font-semibold">{timeDisplay.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Cards Grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <FlashCard
          icon={User}
          title="Total Students"
          value={flashCardsData.totalStudents.value.toLocaleString()}
          theme="blue"
          changedNo={flashCardsData.totalStudents.change ? `${flashCardsData.totalStudents.change >= 0 ? '+' : ''}${flashCardsData.totalStudents.change}` : null}
          percentage={flashCardsData.totalStudents.percentage ? `${flashCardsData.totalStudents.percentage >= 0 ? '+' : ''}${flashCardsData.totalStudents.percentage}` : null}
        />
        <FlashCard
          icon={Shield}
          title="Total Lecturers"
          value={flashCardsData.totalLecturers.value.toLocaleString()}
          theme="purple"
          changedNo={flashCardsData.totalLecturers.change ? `${flashCardsData.totalLecturers.change >= 0 ? '+' : ''}${flashCardsData.totalLecturers.change}` : null}
          percentage={flashCardsData.totalLecturers.percentage ? `${flashCardsData.totalLecturers.percentage >= 0 ? '+' : ''}${flashCardsData.totalLecturers.percentage}` : null}
        />
        <FlashCard
          icon={GraduationCap}
          title="Available Courses"
          value={flashCardsData.availableCourses.value.toLocaleString()}
          theme="red"
        />
        <FlashCard
          icon={DollarSign}
          title="Month Payments"
          value={`$${flashCardsData.monthPayments.value.toLocaleString()}`}
          theme="green"
          changedNo={flashCardsData.monthPayments.change ? `${flashCardsData.monthPayments.change >= 0 ? '+' : ''}$${Math.abs(flashCardsData.monthPayments.change).toLocaleString()}` : null}
          percentage={flashCardsData.monthPayments.percentage ? `${flashCardsData.monthPayments.percentage >= 0 ? '+' : ''}${flashCardsData.monthPayments.percentage}` : null}
        />
      </div>

      {/* Charts Grid - Organized by sections */}
      
      {/* ===== STUDENT ANALYTICS SECTION ===== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Student Registrations - Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Registrations Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke={COLORS.blue}
                  strokeWidth={3}
                  dot={{ fill: COLORS.blue, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Registrations"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pending Applications */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Applications</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pendingApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="total_pending" fill={COLORS.orange} radius={[8, 8, 0, 0]} name="Pending" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== FINANCIAL ANALYTICS SECTION ===== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Payment Status - Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  isAnimationActive={false}
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Collection Rate - Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Collection Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentCollectionRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="collection_rate"
                  stroke={COLORS.green}
                  strokeWidth={3}
                  dot={{ fill: COLORS.green, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Collection Rate (%)"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend - Full Width */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.green}
                strokeWidth={3}
                dot={{ fill: COLORS.green, r: 5 }}
                activeDot={{ r: 7 }}
                name="Revenue ($)"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== COURSE & LECTURER ANALYTICS SECTION ===== */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course & Lecturer Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Course Distribution - Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Enrollment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="course" 
                  stroke="#6b7280" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="students" radius={[8, 8, 0, 0]} name="Students" isAnimationActive={false}>
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COURSE_COLORS[index % COURSE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-800">{courseDistribution.length}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-gray-600">Total Lecturers</p>
                <p className="text-2xl font-bold text-gray-800">{lecturerWorkload.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-gray-600">Total Students in Courses</p>
                <p className="text-2xl font-bold text-gray-800">
                  {courseDistribution.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lecturer Workload - Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lecturer Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lecturerWorkload} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="lecturer" type="category" stroke="#6b7280" width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="courses" fill={COLORS.purple} name="Courses" isAnimationActive={false} />
              <Bar dataKey="students" fill={COLORS.blue} name="Students" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
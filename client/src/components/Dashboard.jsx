// Dashboard.jsx — redesigned to match reference screenshot.
// Data fetching is delegated to useDashboardData hook (src/hooks/useDashboardData.js).
import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Users, BookOpen, CreditCard, GraduationCap,
  Calendar, Clock, Loader2, AlertTriangle, UserCircle2,
  TrendingUp, BarChart3,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import FlashCard from "./FlashCard.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";

// ── colour tokens ────────────────────────────────────────────────────────────
const CHART_BLUE   = "#3D5A99";
const CHART_GOLD   = "#E8B84B";
const AREA_GRADIENT_ID = "blueGrad";

// Donut: [Unpaid, Paid] — matches screenshot (dark blue + gold)
const DONUT_COLORS = [CHART_BLUE, CHART_GOLD];

// Bar chart: single blue
const BAR_COLOR = CHART_BLUE;

// ── tiny helpers ─────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-gray-900">{children}</h2>
      <div className="mt-1 w-36 h-0.5 bg-gray-800" />
    </div>
  );
}

/** Donut centre label */
function DonutLabel({ cx, cy, total }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.4em" fontSize="22" fontWeight="700" fill="#1f2937">
        {total}
      </tspan>
      <tspan x={cx} dy="1.4em" fontSize="11" fill="#6b7280">
        students
      </tspan>
    </text>
  );
}

/** The right-hand "Last added student" + stats panel */
function StudentInfoPanel({ lastAdded, stats }) {
  const initials = lastAdded
    ? (lastAdded.full_name || lastAdded.name || "?")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="flex flex-col gap-4">
      {/* Last added student card */}
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Last added student
        </p>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
            {lastAdded ? initials : <UserCircle2 size={28} />}
          </div>
          {lastAdded ? (
            <div>
              <p className="font-semibold text-gray-900 leading-tight">
                {lastAdded.full_name || lastAdded.name || "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {lastAdded.student_id || lastAdded.id || "—"}
              </p>
              <p className="text-xs text-gray-500">
                {[lastAdded.grade, lastAdded.curriculum].filter(Boolean).join(" | ") || "—"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No student data</p>
          )}
        </div>
      </div>

      {/* Stats breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Students</span>
          <span className="text-sm font-bold text-gray-900">{stats.total}</span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Male : <span className="font-semibold text-gray-900">{stats.male}</span></span>
          <span className="text-gray-600">Female : <span className="font-semibold text-gray-900">{stats.female}</span></span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Edexcel : <span className="font-semibold text-gray-900">{stats.edexcel}</span></span>
          <span className="text-gray-600">Cambridge : <span className="font-semibold text-gray-900">{stats.cambridge}</span></span>
        </div>
      </div>
    </div>
  );
}

/** The right-hand "Student Payments" panel with donut */
function PaymentInfoPanel({ paymentStatus, summary }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col h-full">
      <p className="text-sm text-gray-500 font-medium">Student Payments</p>
      <p className="text-4xl font-bold text-blue-700 mt-1">{summary.totalStudents} Students</p>
      <p className="text-sm text-gray-400 mt-0.5">{summary.paid} Payments</p>

      {/* Donut chart */}
      <div className="flex-1 min-h-0 mt-2">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={paymentStatus}
              cx="40%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={false}
            >
              {paymentStatus.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={10}
              formatter={(v) => <span className="text-xs text-gray-600">{v}</span>}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    flashCards,
    registrationData,
    revenueData,
    courseDistribution,
    paymentStatus,
    lastAddedStudent,
    studentStats,
    paymentSummary,
    loading,
    error,
  } = useDashboardData();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = currentTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = currentTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // ── loading / error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800 mb-1">Error Loading Dashboard</h2>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fc = flashCards;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 w-full">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Left: Welcome */}
          <div>
            <p className="text-sm text-gray-500 font-medium">Welcome Back,</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {user?.name || "Admin"}
            </h1>
          </div>

          {/* Right: Date + Time */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="font-medium">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="font-semibold text-gray-800 tabular-nums">{timeStr}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-px bg-gray-200" />
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <FlashCard
          icon={Users}
          title="Students"
          value={fc.totalStudents?.value ?? 0}
          theme="blue"
          changedNo={fc.totalStudents?.change ? `+${fc.totalStudents.change}` : null}
        />
        <FlashCard
          icon={BookOpen}
          title="Lecturers"
          value={fc.totalLecturers?.value ?? 0}
          theme="purple"
          changedNo={fc.totalLecturers?.change ? `+${fc.totalLecturers.change}` : null}
        />
        <FlashCard
          icon={CreditCard}
          title="Monthly Payments"
          value={(fc.monthPayments?.value ?? 0).toLocaleString()}
          theme="green"
          changedNo={
            fc.monthPayments?.change
              ? `${fc.monthPayments.change >= 0 ? "+" : ""}${fc.monthPayments.change.toLocaleString()}`
              : null
          }
        />
        <FlashCard
          icon={GraduationCap}
          title="Courses"
          value={fc.availableCourses?.value ?? 0}
          theme="blue"
          active
        />
      </div>

      {/* ── SECTION 1: Student Registrations ────────────────────────────── */}
      <section className="mb-8">
        <SectionTitle>Student Registrations</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Students registrations in this year
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={registrationData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_BLUE} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e5e7eb" }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke={CHART_BLUE}
                  strokeWidth={2.5}
                  fill={`url(#${AREA_GRADIENT_ID})`}
                  dot={false}
                  activeDot={{ r: 5, fill: CHART_BLUE }}
                  name="Registrations"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Info panel — 1/3 width */}
          <div className="lg:col-span-1">
            <StudentInfoPanel lastAdded={lastAddedStudent} stats={studentStats} />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Payment Analytics ────────────────────────────────── */}
      <section className="mb-8">
        <SectionTitle>Payment Analytics</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue area chart — 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Monthly Revenue trend
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_BLUE} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e5e7eb" }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_BLUE}
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: CHART_BLUE }}
                  name="Revenue"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payment donut panel — 1/3 */}
          <div className="lg:col-span-1">
            <PaymentInfoPanel paymentStatus={paymentStatus} summary={paymentSummary} />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Course Details ────────────────────────────────────── */}
      <section>
        <SectionTitle>Course Details</SectionTitle>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={courseDistribution}
              margin={{ top: 5, right: 20, left: -20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="course"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e5e7eb" }}
                labelStyle={{ fontWeight: 600 }}
                cursor={{ fill: "rgba(61,90,153,0.06)" }}
              />
              <Bar
                dataKey="students"
                fill={BAR_COLOR}
                radius={[4, 4, 0, 0]}
                name="Students"
                isAnimationActive={false}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
}
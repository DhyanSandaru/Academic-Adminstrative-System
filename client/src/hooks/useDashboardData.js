// useDashboardData.js
// Custom hook — centralises every API call the Dashboard needs.
// Separating data-fetching from presentation keeps Dashboard.jsx clean and testable.

import { useEffect, useState, useMemo } from "react";

const API_BASE = "http://localhost:8000/api/dashboard";
const STUDENTS_API = "http://localhost:8000/api/students/view-students";

const DEFAULT_FLASH = {
  totalStudents: { value: 0, change: 0, percentage: 0 },
  totalLecturers: { value: 0, change: 0, percentage: 0 },
  availableCourses: { value: 0 },
  monthPayments: { value: 0, change: 0, percentage: 0 },
};

export function useDashboardData() {
  const [flashCards, setFlashCards] = useState(DEFAULT_FLASH);
  const [registrationData, setRegistrationData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [lecturerWorkload, setLecturerWorkload] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [lastAddedStudent, setLastAddedStudent] = useState(null);
  const [studentStats, setStudentStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    edexcel: 0,
    cambridge: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  async function safeFetch(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    return res.json();
  }

  // ── flash cards (non-blocking — updates independently) ───────────────────
  useEffect(() => {
    safeFetch(`${API_BASE}/flashcards`)
      .then(setFlashCards)
      .catch((err) => console.warn("Flash cards fetch failed:", err));
  }, []);

  // ── main chart data ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [
          registrations,
          revenue,
          courses,
          payments,
          lecturers,
          pending,
        ] = await Promise.all([
          safeFetch(`${API_BASE}/registrations`),
          safeFetch(`${API_BASE}/revenue`),
          safeFetch(`${API_BASE}/course-distribution`),
          safeFetch(`${API_BASE}/payment-status`),
          safeFetch(`${API_BASE}/lecturer-workload`),
          safeFetch(`${API_BASE}/pending-applications`),
        ]);

        if (cancelled) return;
        setRegistrationData(registrations);
        setRevenueData(revenue);
        setCourseDistribution(courses);
        setPaymentStatus(payments);
        setLecturerWorkload(lecturers);
        setPendingApplications(pending);
      } catch (err) {
        if (!cancelled) {
          console.error("Dashboard chart fetch failed:", err);
          setError("Failed to load dashboard data. Please refresh.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // ── last added student + stats (derived from student list) ───────────────
  useEffect(() => {
    safeFetch(STUDENTS_API)
      .then((students) => {
        if (!Array.isArray(students) || students.length === 0) return;

        // Most recently added student (assumes descending order or we sort)
        const sorted = [...students].sort((a, b) => {
          const da = new Date(a.createdAt || a.created_at || 0);
          const db = new Date(b.createdAt || b.created_at || 0);
          return db - da;
        });
        setLastAddedStudent(sorted[0]);

        // Aggregate gender & curriculum
        const stats = students.reduce(
          (acc, s) => {
            acc.total++;
            const gender = (s.gender || "").toLowerCase();
            const curriculum = (s.curriculum || s.course_type || "").toLowerCase();
            if (gender === "male" || gender === "m") acc.male++;
            else if (gender === "female" || gender === "f") acc.female++;
            if (curriculum.includes("edexcel")) acc.edexcel++;
            else if (curriculum.includes("cambridge")) acc.cambridge++;
            return acc;
          },
          { total: 0, male: 0, female: 0, edexcel: 0, cambridge: 0 }
        );
        setStudentStats(stats);
      })
      .catch((err) => console.warn("Student list fetch failed:", err));
  }, []);

  // ── combined month data for charts that need both series ─────────────────
  const combinedMonthData = useMemo(() => {
    const map = new Map();
    registrationData.forEach((r) =>
      map.set(r.month, { month: r.month, registrations: r.registrations, revenue: 0 })
    );
    revenueData.forEach((r) => {
      if (map.has(r.month)) map.get(r.month).revenue = r.revenue;
      else map.set(r.month, { month: r.month, registrations: 0, revenue: r.revenue });
    });
    return Array.from(map.values());
  }, [registrationData, revenueData]);

  // ── payment summary totals ────────────────────────────────────────────────
  const paymentSummary = useMemo(() => {
    const totalStudents = paymentStatus.reduce((s, p) => s + (p.value || 0), 0);
    const paidEntry = paymentStatus.find(
      (p) => (p.name || "").toLowerCase() === "paid"
    );
    const paid = paidEntry ? paidEntry.value : 0;
    return { totalStudents, paid, unpaid: totalStudents - paid };
  }, [paymentStatus]);

  return {
    flashCards,
    registrationData,
    revenueData,
    courseDistribution,
    paymentStatus,
    lecturerWorkload,
    pendingApplications,
    lastAddedStudent,
    studentStats,
    combinedMonthData,
    paymentSummary,
    loading,
    error,
  };
}

// Lobby.jsx — Student-facing waiting room page.
// Connects to the Socket.IO server, displays an assigned 3-digit number,
// and transitions to the registration form once the admin authorizes.

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from './config.js';

// Connection states
const STATE = {
  CONNECTING: 'connecting',
  WAITING: 'waiting',
  AUTHORIZED: 'authorized',
  ERROR: 'error',
};

export default function Lobby({ onAuthorized }) {
  const [connectionState, setConnectionState] = useState(STATE.CONNECTING);
  const [assignedNumber, setAssignedNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Connect as a student (no clientType = student by default in socketManager)
    const socket = io(BACKEND_URL, {
      query: { clientType: 'student' },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      setConnectionState(STATE.CONNECTING); // still waiting for number assignment
    });

    socket.on('assigned_number', ({ number }) => {
      setAssignedNumber(number);
      setConnectionState(STATE.WAITING);
    });

    socket.on('registration_authorized', ({ token }) => {
      setConnectionState(STATE.AUTHORIZED);
      // Brief pause to show the success screen, then hand off
      setTimeout(() => onAuthorized(token), 1500);
    });

    socket.on('assignment_error', ({ message }) => {
      setErrorMessage(message);
      setConnectionState(STATE.ERROR);
    });

    socket.on('connect_error', () => {
      setErrorMessage('Could not reach the registration server. Please make sure you are connected to the institution WiFi.');
      setConnectionState(STATE.ERROR);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        setErrorMessage('You were disconnected by the server. Please refresh the page.');
        setConnectionState(STATE.ERROR);
      }
    });

    // Subtle pulse animation every 2s while waiting
    const pulseInterval = setInterval(() => setPulse(p => !p), 2000);

    return () => {
      socket.disconnect();
      clearInterval(pulseInterval);
    };
  }, [onAuthorized]);

  // ── CONNECTING ──────────────────────────────────────────────────────────────
  if (connectionState === STATE.CONNECTING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting…</h2>
          <p className="text-sm text-gray-500">Establishing a secure connection to the registration server.</p>
        </div>
      </div>
    );
  }

  // ── ERROR ───────────────────────────────────────────────────────────────────
  if (connectionState === STATE.ERROR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Connection Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── AUTHORIZED ──────────────────────────────────────────────────────────────
  if (connectionState === STATE.AUTHORIZED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Authorized!</h2>
          <p className="text-sm text-gray-500">Opening your registration form…</p>
        </div>
      </div>
    );
  }

  // ── WAITING ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
      {/* Header card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 max-w-sm w-full text-center border border-indigo-100">
        <h1 className="text-2xl font-bold text-indigo-900 mb-1">Remote Registration Portal</h1>
        <p className="text-xs text-red-500 font-medium">Stay connected to WiFi until your form is submitted</p>
      </div>

      {/* Number card */}
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center border border-indigo-100">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-4">Your Number</p>

        {/* The big number with a subtle pulse ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              pulse ? 'scale-125 opacity-0' : 'scale-100 opacity-20'
            } bg-indigo-400`}
          />
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative z-10">
            <span className="text-6xl font-black text-white tracking-tight select-none">
              {assignedNumber}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-3">Walk up to the desk</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Tell the receptionist:{' '}
          <span className="font-semibold text-indigo-700">"I'm number {assignedNumber}."</span>
          <br />
          They will authorize your registration form from their dashboard.
        </p>

        {/* Live indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Live connection active
        </div>
      </div>
    </div>
  );
}

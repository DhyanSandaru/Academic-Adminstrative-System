import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function Login() {
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const loginData = ({
      username: username,
      password: password
    })
    
    try {
      const response = await axios.post("http://localhost:8000/login", loginData);
      login(response.data.user)
      setLoading(false);
      navigate('/dashboard');
    } 
    catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Incorrect username or password');
      }
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes float-delayed-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 25px) rotate(120deg); }
          66% { transform: translate(30px, -20px) rotate(240deg); }
        }
        @keyframes float-delayed-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, 30px) rotate(120deg); }
          66% { transform: translate(-30px, -15px) rotate(240deg); }
        }
        @keyframes float-delayed-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-20px, -25px) rotate(120deg); }
          66% { transform: translate(25px, 30px) rotate(240deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed-1 { animation: float-delayed-1 20s infinite ease-in-out 5s; }
        .animate-float-delayed-2 { animation: float-delayed-2 20s infinite ease-in-out 10s; }
        .animate-float-delayed-3 { animation: float-delayed-3 20s infinite ease-in-out 15s; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-wiggle { animation: wiggle 4s infinite ease-in-out; }
        .animate-wave { animation: wave 2s infinite ease-in-out; }
      `}</style>

      <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-15 -top-24 -left-24 animate-float"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 opacity-15 top-[60%] -right-12 animate-float-delayed-1"></div>
          <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-br from-green-500 to-cyan-500 opacity-15 -bottom-12 left-[30%] animate-float-delayed-2"></div>
          <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-15 top-[20%] right-[20%] animate-float-delayed-3"></div>
        </div>

        <div className="relative z-10 flex w-[95%] max-w-[1200px] h-[90vh] max-h-[700px] bg-white rounded-[30px] shadow-2xl overflow-hidden">
          {/* Left Panel - Hero Section */}
          <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-12 flex-col relative overflow-hidden">
            {/* Logo */}
            <div className="flex items-center gap-3.5 mb-20 z-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">clever</span>
            </div>

            {/* Hero Text */}
            <div className="max-w-[500px] z-10">
              <h1 className="text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
                Wise Way Academy<br />
                Management System
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Maybe some text here will help me see it better.<br />
                Oh God. Oke, let's do it then.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute w-[180px] h-[180px] bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full -bottom-7 left-16 shadow-2xl shadow-yellow-400/40 flex items-center justify-center animate-bounce-slow">
                <div className="text-5xl animate-wiggle">💬</div>
              </div>
              <div className="absolute w-[320px] h-[320px] bg-gradient-to-br from-blue-300/50 to-indigo-400/30 rounded-full -bottom-24 -right-20 animate-pulse-slow"></div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 flex items-center justify-center p-10 bg-gray-50">
            <div className="bg-white p-12 rounded-3xl w-full max-w-[460px] shadow-lg">
              {/* Welcome Section */}
              <div className="text-center mb-10">
                <div className="text-5xl mb-4 inline-block animate-wave">👋</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Welcome back!</h2>
                <p className="text-base text-gray-600">Login to get started</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-400 rounded-xl mb-7">
                  <div className="w-5 h-5 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-yellow-900 m-0">Verifying credentials...</p>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="p-4 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 text-red-800 rounded-xl mb-7 text-sm">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form className="mb-8" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2.5 text-left">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Type your username"
                    required
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-200"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2.5 text-left">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-200"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 mt-2 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:translate-y-0'
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
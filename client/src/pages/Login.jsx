import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // show loader when request starts

    const loginData = { username, password };

    try {
      const response = await axios.post("http://localhost:8000/login", loginData);
      setLoading(false); // stop loader on success
      navigate('/dashboard');
    } 
    catch (err) {
      setLoading(false); // stop loader on error
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Incorrect username or password');
      }
    }
  };

  return (
    <main className="flex flex-col bg-blue-100 bg-[url(/images/login-background.jpg)] bg-blend-multiply bg-cover bg-center h-screen w-screen justify-center items-center overflow-hidden">
      <div className="bg-grey-100 border-1 p-8 rounded-2xl shadow-lg text-black backdrop-blur-xs">
        <h1 className="pb-5">Login</h1>
        <p className="pb-10">Login to your account</p>

        {/*Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <div className="w-6 h-6 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-yellow-500">Verifying credentials...</p>
          </div>
        )}

        {/*Error message */}
        {!loading && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form className="flex flex-col w-[70vh] gap-4 " onSubmit={handleSubmit}>
          <div className="flex flex-col pb-5">
            <label htmlFor="username" className="text-left">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="pl-8 rounded-lg h-10 bg-white"
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col pb-1">
            <label htmlFor="password" className="text-left">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="pl-8 rounded-lg h-10 bg-white"
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className='flex justify-start items-center pb-5'>
            <label htmlFor="remember" className="pr-1">Remember me</label>
            <input type="checkbox" id="remember" name="remember" disabled={loading} />
          </div>

          <button
            type="submit"
            className={`rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400'}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

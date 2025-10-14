import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig"; // make sure the path is correct

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get Firebase ID token
      const token = await user.getIdToken();

      // Optionally, send token to your backend for verification or session creation
      // await axios.post("http://localhost:8000/session-login", { token });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or network error.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to send password reset email. Check email address.");
    }
  };

  return (
    <main className="flex flex-col bg-blue-100 bg-[url(/images/login-background.jpg)] bg-blend-multiply bg-cover bg-center h-screen w-screen justify-center items-center overflow-hidden">
      <div className="bg-grey-100 border-1 p-8 rounded-2xl shadow-lg text-black backdrop-blur-xs">
        <h1 className="pb-5">Login</h1>
        <p className="pb-10">Login to your account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {resetEmailSent && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            Password reset email sent! Check your inbox.
          </div>
        )}

        <form className="flex flex-col w-[70vh] gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col pb-5">
            <label htmlFor="email" className="text-left">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="pl-8 rounded-lg h-10 bg-white"
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center pb-5">
            <div className="flex items-center">
              <label htmlFor="remember" className="pr-1">Remember me</label>
              <input type="checkbox" id="remember" name="remember" />
            </div>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-blue-500 underline text-sm"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="bg-yellow-400 rounded-lg h-10 font-medium hover:bg-yellow-300">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

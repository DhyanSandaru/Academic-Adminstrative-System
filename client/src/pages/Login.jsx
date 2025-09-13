import {useState} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from "axios";
export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[error, setError] = useState('');

     const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { username, password };

        try {
          const response = await axios.post("http://localhost:8000/login", loginData)

          navigate('/dashboard');
        } 
        catch (err) {
            if(err.response && err.response.data && err.response.data.message){
                setError(err.response.data.message);
            }
            else
                setError('Server error. Please try again later.');
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

                <form className="flex flex-col w-[70vh] gap-4 " onSubmit={handleSubmit}>
                    <div className="flex flex-col pb-5">
                        <label htmlFor="username" className="text-left">Username</label>
                        <input type="text" id="username" name="username" required className=" pl-8 rounded-lg h-10 bg-white"
                        onChange={ e => setUsername(e.target.value)}/>
                    </div>
                    <div className="flex flex-col pb-1">
                        <label htmlFor="password" className="text-left">Password</label>
                        <input type="password" id="password" name="password" required className="pl-8 rounded-lg h-10 bg-white"
                        onChange={ e => setPassword(e.target.value)} />
                    </div>
                        <div className='flex justify-start items-center pb-5'>
                            <label htmlFor="remember" className="pr-1">Remember me</label>
                            <input type="checkbox" id="remember" name="remember" />
                        </div>
                
                    <button type="submit" className="bg-yellow-400 rounded-lg">Sign in</button>
                
                </form>
                <Link to="/dashboard" ><p>Dashboard</p></Link>
            </div>

        </main>
    )
}
import { Link } from 'react-router-dom';
export default function Login() {
    return (
        <main className="flex flex-col bg-[url('')] bg-cover bg-center h-screen w-screen justify-center items-center overflow-hidden">
            <h1 className="pb-5">Login</h1>
            <p className="pb-10">Login to your account</p>
            <form className="flex flex-col w-" action="/login" method="POST">
                <div className="flex flex-col pb-5">
                    <label htmlFor="username" className="text-left">Username</label>
                    <input type="text" id="username" name="username" required className="bg-white pl-8 rounded-lg h-10"/>
                </div>

                <div className="flex flex-col pb-1">
                    <label htmlFor="password" className="text-left">Password</label>
                    <input type="password" id="password" name="password" required className="bg-white pl-8 rounded-lg h-10"/>
                </div>

                <div className="flex flex-row justify-between pb-10">
                    <div>
                        <label htmlFor="remember" className="pr-1">Remember me</label>
                        <input type="checkbox" id="remember" name="remember" />
                    </div>
                    
                    <Link to="/reset-password">Reset Password?</Link>
                </div>

                <button type="submit" className="bg-yellow-400 rounded-lg">Sign in</button>
                
            </form>
            <Link to="/dashboard" ><p>Dashboard</p></Link>

        </main>
    )
}
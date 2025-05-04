
import Navbar from "@/components/layout/Navbar";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar showAuth={false} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-sm bg-card/90 border border-white/10 rounded-xl p-6 shadow-xl">
          <div className="mb-6 text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-300 mt-1">Sign in to your account</p>
          </div>
          <LoginForm />
          <p className="text-center mt-6 text-sm text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="p-4 text-center text-gray-500 text-sm">
        © 2025 Co-Brew Startup Platform. All rights reserved.
      </div>
    </div>
  );
};

export default Login;


import Navbar from "@/components/layout/Navbar";
import SignUpForm from "@/components/auth/SignUpForm";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar showAuth={false} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
          <div className="mb-6 text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-cobrew-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-300 mt-1">Join the startup collaboration platform</p>
          </div>
          <SignUpForm />
          <p className="text-center mt-6 text-sm text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-cobrew-400 hover:text-cobrew-300 hover:underline">
              Sign in
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

export default Signup;

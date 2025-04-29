
import Navbar from "@/components/layout/Navbar";
import SignUpForm from "@/components/auth/SignUpForm";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignUpForm />
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-cobrew-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;


import Navbar from "@/components/layout/Navbar";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth={false} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cobrew-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

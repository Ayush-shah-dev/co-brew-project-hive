
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          {/* Hero section */}
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cobrew-400 to-purple-300">
              The Future of <span className="text-cobrew-500">Startup Collaboration</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Connect with talented individuals, share ideas, and build your startup with powerful collaboration tools designed specifically for early-stage ventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="bg-gradient-to-r from-cobrew-500 to-purple-600 hover:from-cobrew-600 hover:to-purple-700 border-0">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          
          {/* Features section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-white/10 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cobrew-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cobrew-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">Ideation</h2>
              <p className="text-gray-300">
                Capture, organize, and evaluate ideas with collaborative boards. Get feedback from your team in real-time.
              </p>
            </div>
            
            <div className="p-6 border border-white/10 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cobrew-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cobrew-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">Planning</h2>
              <p className="text-gray-300">
                Create roadmaps, assign tasks, and keep projects on track. Set milestones and monitor progress easily.
              </p>
            </div>
            
            <div className="p-6 border border-white/10 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cobrew-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cobrew-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">Execution</h2>
              <p className="text-gray-300">
                Bring your startup to life with powerful execution tools. Collaborate on documents and track progress.
              </p>
            </div>
          </div>

          {/* Floating gradient orbs for design flair */}
          <div className="absolute top-1/4 -left-10 w-40 h-40 bg-cobrew-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-10 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>
      </main>
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Co-Brew Startup Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            The Platform for <span className="text-cobrew-600">Startup Collaboration</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Connect with talented individuals, share ideas, and build your startup with powerful collaboration tools designed specifically for early-stage ventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-cobrew-600 hover:bg-cobrew-700">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-cobrew-100 text-cobrew-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Ideation</h2>
              <p className="text-muted-foreground">
                Capture, organize, and evaluate ideas with collaborative boards. Get feedback from your team in real-time.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-cobrew-100 text-cobrew-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Planning</h2>
              <p className="text-muted-foreground">
                Create roadmaps, assign tasks, and keep projects on track. Set milestones and monitor progress easily.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-cobrew-100 text-cobrew-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Execution</h2>
              <p className="text-muted-foreground">
                Bring your startup to life with powerful execution tools. Collaborate on documents and track progress.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 Co-Brew Startup Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

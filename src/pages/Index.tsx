
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, ArrowDown, Users, Clock, ListTodo, Layers, MessageSquare, Layout } from "lucide-react";

const features = [
  {
    icon: <Users className="h-10 w-10 text-cobrew-600" />,
    title: "Team Collaboration",
    description: "Work together in real-time with your team members regardless of location."
  },
  {
    icon: <Layers className="h-10 w-10 text-cobrew-600" />,
    title: "Idea Board",
    description: "Brainstorm and organize ideas with a visual kanban-style board."
  },
  {
    icon: <ListTodo className="h-10 w-10 text-cobrew-600" />,
    title: "Task Management",
    description: "Create, assign, and track tasks to ensure everyone knows their responsibilities."
  },
  {
    icon: <Clock className="h-10 w-10 text-cobrew-600" />,
    title: "Timeline View",
    description: "Visualize project timelines and milestones with an intuitive Gantt chart."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-cobrew-600" />,
    title: "Real-time Chat",
    description: "Discuss ideas and progress with integrated messaging and comments."
  },
  {
    icon: <Layout className="h-10 w-10 text-cobrew-600" />,
    title: "Document Collaboration",
    description: "Create and edit shared documents with your team in real-time."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-cobrew-50 to-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                <span className="animated-gradient-text">Co-Brew</span> your <br /> ideas to reality
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                The collaborative platform where teams ideate, plan, and build projects together in real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-cobrew-600 hover:bg-cobrew-700 text-lg px-6 py-6" asChild>
                  <Link to="/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="text-lg px-6 py-6" asChild>
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border">
                  <img 
                    src="https://i.postimg.cc/43NSqdC5/co-brew-dashboard.png"
                    alt="Co-Brew Dashboard Preview" 
                    className="w-full h-auto rounded-t-lg"
                  />
                  <div className="p-4 bg-cobrew-50 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-cobrew-600">Co-Brew Platform</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" id="features">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to collaborate</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Co-Brew provides all the tools your team needs to take ideas from concept to completion.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-cobrew-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start collaborating?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of teams who use Co-Brew to bring their best ideas to life.
          </p>
          <Button className="bg-white text-cobrew-600 hover:bg-gray-100 text-lg px-8 py-6" asChild>
            <Link to="/signup">
              Get Started For Free
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cobrew-500 to-cobrew-700 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl">Co-Brew</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-cobrew-600">Terms</a>
              <a href="#" className="text-gray-600 hover:text-cobrew-600">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-cobrew-600">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Co-Brew. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, User, LogOut } from "lucide-react";

const Navbar = ({ showAuth = true }: { showAuth?: boolean }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  // This would be replaced with actual authentication logic
  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cobrew-500 to-cobrew-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">Co-Brew</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {showAuth ? (
            isUserLoggedIn ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleLogin}>
                  Sign In
                </Button>
                <Button 
                  className="bg-cobrew-600 hover:bg-cobrew-700" 
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </div>
            )
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

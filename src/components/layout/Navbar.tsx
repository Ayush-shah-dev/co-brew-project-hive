
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Rocket,
  User,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavbarProps {
  showAuth?: boolean;
}

const Navbar = ({ showAuth = true }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 mr-6">
            <Rocket size={24} className="text-cobrew-600" />
            <span className="font-bold">Co-Brew</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Projects
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {showAuth && (
            <>
              {user ? (
                <>
                  <div className="hidden md:flex">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <div className="h-8 w-8 rounded-full bg-cobrew-100 flex items-center justify-center">
                            <User size={16} className="text-cobrew-600" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/projects">Projects</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                      >
                        <Menu size={20} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <div className="flex flex-col space-y-4 mt-8">
                        <Link
                          to="/dashboard"
                          className="py-2 px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => setOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/projects"
                          className="py-2 px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => setOpen(false)}
                        >
                          Projects
                        </Link>
                        <Link
                          to="/profile"
                          className="py-2 px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => setOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="py-2 px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => setOpen(false)}
                        >
                          Settings
                        </Link>
                        <div
                          className="py-2 px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                          onClick={() => {
                            signOut();
                            setOpen(false);
                          }}
                        >
                          Log out
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="bg-cobrew-600 hover:bg-cobrew-700">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

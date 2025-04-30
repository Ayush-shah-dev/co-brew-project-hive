
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Rocket,
} from "lucide-react";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useMobile();
  const { signOut } = useAuth();
  
  // Don't show sidebar on mobile
  if (isMobile) return null;

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      title: "Projects",
      icon: <FolderKanban size={20} />,
      href: "/projects",
    },
    {
      title: "Team",
      icon: <Users size={20} />,
      href: "/team",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      href: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "group/sidebar h-screen border-r bg-background z-30 overflow-hidden relative flex flex-col",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center h-16 border-b px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <Rocket size={24} className="text-cobrew-600" />
            <span className="font-bold">Co-Brew</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex justify-center w-full">
            <Rocket size={24} className="text-cobrew-600" />
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 -right-4 h-6 w-6 rounded-full bg-background border shadow-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronLeft
          size={16}
          className={cn(
            "transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </Button>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              size={collapsed ? "icon" : "default"}
              asChild
              className={cn(
                "justify-start",
                collapsed ? "w-10 h-10 p-0" : ""
              )}
            >
              <Link to={item.href}>
                {item.icon}
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn(
            "justify-start w-full",
            collapsed ? "w-10 h-10 p-0" : ""
          )}
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

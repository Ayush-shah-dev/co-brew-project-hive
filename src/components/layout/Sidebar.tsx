
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Folder, 
  ListTodo, 
  MessageSquare, 
  Calendar, 
  FileText, 
  PanelLeft, 
  Settings, 
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

const projectItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/project/1/overview' },
  { icon: MessageSquare, label: 'Ideas', path: '/project/1/ideas' },
  { icon: ListTodo, label: 'Tasks', path: '/project/1/tasks' },
  { icon: FileText, label: 'Docs', path: '/project/1/docs' },
  { icon: MessageSquare, label: 'Chat', path: '/project/1/chat' },
  { icon: Calendar, label: 'Timeline', path: '/project/1/timeline' },
];

const mainItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Folder, label: 'Projects', path: '/projects' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [showProjectItems, setShowProjectItems] = useState(
    location.pathname.includes('/project/')
  );

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path.includes('/project/') && location.pathname.includes(path));
  };

  const isProjectPage = location.pathname.includes('/project/');

  return (
    <div
      className={cn(
        "h-screen border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            <PanelLeft size={20} className={collapsed ? "rotate-180" : ""} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {/* Main Navigation */}
          {!showProjectItems && (
            <nav className="space-y-1">
              {mainItems.map((item) => (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive(item.path)
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon size={20} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              ))}
              
              {/* Create New Project Button */}
              {!collapsed ? (
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-dashed border-cobrew-300 hover:border-cobrew-500 text-cobrew-600"
                >
                  <PlusCircle size={16} className="mr-2" />
                  New Project
                </Button>
              ) : (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-full mt-4 border-dashed border-cobrew-300 hover:border-cobrew-500 text-cobrew-600"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">New Project</TooltipContent>
                </Tooltip>
              )}
            </nav>
          )}

          {/* Project Navigation */}
          {showProjectItems && (
            <>
              <div className="flex items-center mb-4">
                {!collapsed && (
                  <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    Project Name
                  </h3>
                )}
              </div>
              <nav className="space-y-1">
                {projectItems.map((item) => (
                  <Tooltip key={item.path} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          isActive(item.path)
                            ? "bg-sidebar-accent text-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                ))}

                {/* Back to Projects Button */}
                {!collapsed ? (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-muted-foreground"
                    onClick={() => setShowProjectItems(false)}
                  >
                    <Folder size={16} className="mr-2" />
                    All Projects
                  </Button>
                ) : (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-full mt-4 text-muted-foreground"
                        onClick={() => setShowProjectItems(false)}
                      >
                        <Folder size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">All Projects</TooltipContent>
                  </Tooltip>
                )}
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

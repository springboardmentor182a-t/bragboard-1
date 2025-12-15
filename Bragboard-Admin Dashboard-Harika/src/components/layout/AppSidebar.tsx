import { LayoutDashboard, Users, MessageSquare, Flag, BarChart3, Settings, TrendingUp, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Moderation", url: "/dashboard/moderation", icon: MessageSquare },
  { title: "Flagged Content", url: "/dashboard/flagged", icon: Flag },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          <h1 className={`font-bold text-xl text-sidebar-foreground transition-opacity ${state === "collapsed" ? "opacity-0" : "opacity-100"}`}>
            BragBoard
          </h1>
          {state === "collapsed" && (
            <div className="flex items-center justify-center">
              <span className="text-sidebar-primary font-bold text-2xl">B</span>
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "opacity-0" : ""}>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3 hover:bg-sidebar-accent rounded-md transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state !== "collapsed" && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent className="px-4 space-y-3">
              <Card className="bg-sidebar-accent/50 border-none">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-sidebar-primary" />
                      <span className="text-xs text-sidebar-foreground">Active Users</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">1,234</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-sidebar-accent/50 border-none">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-xs text-sidebar-foreground">Engagement</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">94.2%</Badge>
                  </div>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {state !== "collapsed" ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@bragboard.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              AD
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

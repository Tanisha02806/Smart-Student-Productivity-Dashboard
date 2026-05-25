import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Timer,
  StickyNote,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/assignments", label: "Tasks", icon: BookOpen },
  { path: "/attendance", label: "Attend", icon: ClipboardCheck },
  { path: "/focus", label: "Focus", icon: Timer },
  { path: "/notes", label: "Notes", icon: StickyNote },
  { path: "/ai-assistant", label: "AI", icon: Sparkles },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 lg:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
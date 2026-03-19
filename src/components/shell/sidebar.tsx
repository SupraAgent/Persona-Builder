"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "BUILDERS",
    items: [
      { label: "Expert Persona", href: "/expert", icon: "\u{1F9E0}" },
      { label: "Agent Builder", href: "/agent", icon: "\u{1F916}" },
      { label: "Unified Builder", href: "/unified", icon: "\u26A1" },
      { label: "Launch Kit", href: "/launch-kit", icon: "\u{1F4E6}" },
    ],
  },
  {
    title: "V2",
    items: [
      { label: "Persona Builder 2", href: "/builder-v2", icon: "\u{1F465}" },
      { label: "Launch Kit 2", href: "/launch-v2", icon: "\u{1F680}" },
      { label: "VibeCode", href: "/vibecode", icon: "\u{1F3B5}" },
    ],
  },
  {
    title: "LIBRARY",
    items: [
      { label: "My Personas", href: "/personas", icon: "\u{1F4DA}" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-white/10 flex flex-col z-30">
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-foreground font-semibold text-sm tracking-tight">
            Persona Builder
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-2 mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "border border-primary/30 bg-primary/5 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                      )}
                    >
                      <span className="text-base leading-none">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Account section */}
      <div className="px-3 py-4 border-t border-white/10">
        <h3 className="px-2 mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          ACCOUNT
        </h3>
        <button
          onClick={signOut}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors w-full"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

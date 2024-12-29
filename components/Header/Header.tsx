import React from "react";
import { LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeDropdown } from "./ThemeDropdown";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4">
      <div className="flex-1">
        <span className="font-mono text-4xl font-semibold text-primary">
          Noted.
        </span>
      </div>

      {/* Center section - Username */}
      {session && (
        <div className="flex-none">
          <span className="text-base-content flex items-center gap-2">
            <User size={16} />
            {session.user?.name || session.user?.email}
          </span>
        </div>
      )}

      {/* Right section */}
      <div className="flex-1 flex justify-end items-center gap-4">
        <ThemeDropdown />

        {/* Sign out button - Only shown when session exists */}
        {session && (
          <button onClick={() => signOut()} className="btn btn-error btn-sm">
            <LogOut size={16} />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

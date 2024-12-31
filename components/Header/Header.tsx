import React from "react";
import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeDropdown } from "./ThemeDropdown";
import { UserDropdown } from "./UserDropdown";
import { DateTime } from "./DateTime";
import { ThoughtOfTheDay } from "./ThoughtOfTheDay";
import MobileHeader from "../Mobile/MobileHeader";

export default function Header() {
  const { data: session } = useSession();

  return (
    <>
      <MobileHeader />

      {/* Desktop Header */}
      <div className="hidden md:flex navbar bg-base-200 border-b border-base-300 px-4">
        <div className="flex-1">
          <span className="font-mono text-4xl font-semibold text-primary">
            Noted.
          </span>
        </div>

        {/* Center section - Username with dropdown */}
        {session && (
          <div className="flex-none text-base-content">
            <UserDropdown
              username={session.user?.name || session.user?.email || ""}
            />
          </div>
        )}

        {/* Right section */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <ThoughtOfTheDay />
          <DateTime />
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
    </>
  );
}

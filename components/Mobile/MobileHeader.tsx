import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut, Quote } from "lucide-react";
import { MobileUserDropdown } from "./MobileUserDropdown";
import { DateTime } from "../Header/DateTime";
import { ThoughtOfTheDay } from "../Header/ThoughtOfTheDay";

export default function MobileHeader() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden navbar bg-base-200 border-b border-base-300 px-4">
        <div className="flex-1">
          <span className="font-mono text-2xl font-semibold text-primary">
            Noted.
          </span>
        </div>

        {session && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="btn btn-ghost btn-circle text-base-content"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-base-100 text-base-content">
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-200">
              <h2 className="text-lg font-bold text-base-content">Settings</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-ghost btn-circle"
              >
                ✕
              </button>
            </div>

            {/* User Info and DateTime Section */}
            {session && (
              <div className="bg-base-200/50 border-b border-base-300 p-4">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12">
                      <span className="text-xl">
                        {session.user?.name?.[0] ||
                          session.user?.email?.[0] ||
                          "?"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-base-content">
                      {session.user?.name}
                    </div>
                    <div className="text-sm text-base-content/70">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center">
                    <DateTime />
                  </div>
                  <div className="flex items-start gap-2 text-sm text-base-content/70">
                    <Quote size={16} className="flex-shrink-0 mt-1" />
                    <ThoughtOfTheDay isMobile={true} />
                  </div>
                </div>
              </div>
            )}

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {session && (
                <MobileUserDropdown
                  username={session.user?.name || session.user?.email || ""}
                  onClose={() => setIsMenuOpen(false)}
                />
              )}
            </div>

            {/* Sign Out Button */}
            {session && (
              <div className="p-4 border-t border-base-300 bg-base-200">
                <button
                  onClick={() => signOut()}
                  className="btn btn-error w-full gap-2"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

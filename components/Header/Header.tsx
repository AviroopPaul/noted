import React, { useState } from "react";
import { useTheme } from "@/app/ThemeContext";
import {
  LogOut,
  Sun,
  Moon,
  Palette,
  ChevronDown,
  Search,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const THEMES = [
  { id: "light", icon: <Sun size={16} />, label: "Light" },
  { id: "dark", icon: <Moon size={16} />, label: "Dark" },
  { id: "cupcake", icon: <Palette size={16} />, label: "Cupcake" },
  { id: "emerald", icon: <Palette size={16} />, label: "Emerald" },
  { id: "corporate", icon: <Palette size={16} />, label: "Corporate" },
  { id: "synthwave", icon: <Palette size={16} />, label: "Synthwave" },
  { id: "retro", icon: <Palette size={16} />, label: "Retro" },
  { id: "cyberpunk", icon: <Palette size={16} />, label: "Cyberpunk" },
  { id: "valentine", icon: <Palette size={16} />, label: "Valentine" },
  { id: "halloween", icon: <Palette size={16} />, label: "Halloween" },
  { id: "garden", icon: <Palette size={16} />, label: "Garden" },
  { id: "forest", icon: <Palette size={16} />, label: "Forest" },
  { id: "aqua", icon: <Palette size={16} />, label: "Aqua" },
  { id: "lofi", icon: <Palette size={16} />, label: "Lo-Fi" },
  { id: "pastel", icon: <Palette size={16} />, label: "Pastel" },
  { id: "fantasy", icon: <Palette size={16} />, label: "Fantasy" },
  { id: "wireframe", icon: <Palette size={16} />, label: "Wireframe" },
  { id: "black", icon: <Palette size={16} />, label: "Black" },
  { id: "luxury", icon: <Palette size={16} />, label: "Luxury" },
  { id: "dracula", icon: <Palette size={16} />, label: "Dracula" },
  { id: "cmyk", icon: <Palette size={16} />, label: "CMYK" },
  { id: "autumn", icon: <Palette size={16} />, label: "Autumn" },
  { id: "business", icon: <Palette size={16} />, label: "Business" },
  { id: "acid", icon: <Palette size={16} />, label: "Acid" },
  { id: "lemonade", icon: <Palette size={16} />, label: "Lemonade" },
  { id: "night", icon: <Palette size={16} />, label: "Night" },
  { id: "coffee", icon: <Palette size={16} />, label: "Coffee" },
  { id: "winter", icon: <Palette size={16} />, label: "Winter" },
] as const;

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThemes = THEMES.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Theme dropdown - Now outside the session check */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm gap-2 text-base-content"
          >
            {THEMES.find((t) => t.id === theme)?.icon}
            <span className="hidden sm:inline">Theme</span>
            <ChevronDown size={14} />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[9999] menu p-2 shadow bg-base-200 rounded-box w-52 h-[300px] overflow-y-scroll overflow-x-hidden flex flex-col"
          >
            <div className="sticky top-0 bg-base-200 p-2 z-10">
              <div className="form-control">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/70" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="input input-sm input-bordered w-full pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredThemes.map((themeOption) => (
                <li key={themeOption.id} className="w-full">
                  <button
                    onClick={() => setTheme(themeOption.id)}
                    className={`text-base-content hover:bg-base-300 w-full ${
                      theme === themeOption.id ? "bg-base-300" : ""
                    }`}
                  >
                    {themeOption.icon}
                    {themeOption.label}
                  </button>
                </li>
              ))}
            </div>
          </ul>
        </div>

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

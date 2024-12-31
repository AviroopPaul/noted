import React, { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { THEMES, Theme } from "@/lib/constants/themes";
import { useTheme } from "@/app/ThemeContext";
import { useSession } from "next-auth/react";

interface MobileThemeDropdownProps {
  onBack: () => void;
}

export function MobileThemeDropdown({ onBack }: MobileThemeDropdownProps) {
  const { theme, setTheme, updateUserDefaultTheme } = useTheme();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Type the THEMES object
  interface ThemeOption {
    id: Theme;
    label: string;
    icon: React.ReactNode;
  }

  interface ThemeGroups {
    light: ThemeOption[];
    dark: ThemeOption[];
  }

  const allThemes = [
    ...(THEMES as ThemeGroups).light,
    ...(THEMES as ThemeGroups).dark,
  ];

  const filteredThemes = allThemes.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleThemeSelect = async (themeId: Theme) => {
    if (session?.user) {
      try {
        await updateUserDefaultTheme(themeId);
      } catch (error) {
        console.error("Failed to update default theme:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-base-100 flex flex-col text-base-content">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center gap-3 bg-base-200">
        <button onClick={onBack} className="btn btn-ghost btn-circle">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Theme Settings</h2>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-base-300">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* Themes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2 p-4">
          {filteredThemes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => handleThemeSelect(themeOption.id)}
              className={`btn btn-lg justify-start gap-3 ${
                theme === themeOption.id ? "btn-primary" : "btn-ghost"
              }`}
            >
              {themeOption.icon}
              <span className="text-lg">{themeOption.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

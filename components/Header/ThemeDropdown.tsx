import React, { useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { THEMES, Theme } from "@/lib/constants/themes";
import { useTheme } from "@/app/ThemeContext";

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [lightExpanded, setLightExpanded] = useState(false);
  const [darkExpanded, setDarkExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleThemeSelect = (themeId: Theme) => {
    setTheme(themeId);
  };

  const filteredThemes = {
    light: THEMES.light.filter((t) =>
      t.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    dark: THEMES.dark.filter((t) =>
      t.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const currentThemeIcon = [...THEMES.light, ...THEMES.dark].find(
    (t) => t.id === theme
  )?.icon;

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="btn btn-ghost btn-sm gap-2 text-base-content"
      >
        {currentThemeIcon}
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown size={14} />
      </label>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[9999] menu p-2 shadow bg-base-200 rounded-box w-52 h-[300px] overflow-y-scroll overflow-x-hidden flex flex-col ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        {/* Search input */}
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
        {/* Theme lists */}
        <div className="flex-1 overflow-y-auto">
          {filteredThemes.light.length > 0 || filteredThemes.dark.length > 0 ? (
            <>
              {/* Light themes section */}
              {filteredThemes.light.length > 0 && (
                <div className="mb-2">
                  <button
                    onClick={() => setLightExpanded(!lightExpanded)}
                    className="w-full px-2 py-1.5 flex items-center gap-2 hover:bg-base-300 transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className={`transform transition-transform text-base-content/70 ${
                        lightExpanded ? "rotate-90" : ""
                      }`}
                    />
                    <span className="text-xs font-semibold text-base-content/70">
                      Light Themes
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-200 ${
                      lightExpanded ? "max-h-[500px]" : "max-h-0"
                    } overflow-hidden`}
                  >
                    {filteredThemes.light.map((themeOption) => (
                      <li key={themeOption.id} className="w-full">
                        <button
                          onClick={() => handleThemeSelect(themeOption.id)}
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
                </div>
              )}

              {/* Dark themes section */}
              {filteredThemes.dark.length > 0 && (
                <div className="mb-2">
                  <button
                    onClick={() => setDarkExpanded(!darkExpanded)}
                    className="w-full px-2 py-1.5 flex items-center gap-2 hover:bg-base-300 transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className={`transform transition-transform text-base-content/70 ${
                        darkExpanded ? "rotate-90" : ""
                      }`}
                    />
                    <span className="text-xs font-semibold text-base-content/70">
                      Dark Themes
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-200 ${
                      darkExpanded ? "max-h-[500px]" : "max-h-0"
                    } overflow-hidden`}
                  >
                    {filteredThemes.dark.map((themeOption) => (
                      <li key={themeOption.id} className="w-full">
                        <button
                          onClick={() => handleThemeSelect(themeOption.id)}
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
                </div>
              )}
            </>
          ) : (
            <div className="px-2 py-2 text-sm text-base-content/70">
              No themes found
            </div>
          )}
        </div>
      </ul>
    </div>
  );
}
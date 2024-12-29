import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  User,
  ChevronRight,
  Search,
  Settings,
  Clock,
} from "lucide-react";
import { THEMES } from "@/lib/constants/themes";
import { useTheme } from "@/app/ThemeContext";
import { useDateTimeSettings } from "@/app/DateTimeContext";
import { DateTimeSettings } from "./DateTimeSettings";

interface ThemeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Themes {
  light: ThemeOption[];
  dark: ThemeOption[];
}

const typedThemes = THEMES as Themes;

export function UserDropdown({ username }: { username: string }) {
  const { theme, updateUserDefaultTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [lightExpanded, setLightExpanded] = useState(false);
  const [darkExpanded, setDarkExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isDateTimeSettingsOpen, setIsDateTimeSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { updateSettings } = useDateTimeSettings();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Get both dropdown elements
      const dateTimeSettingsElement = document.querySelector(
        "[data-datetime-settings]"
      );
      const themeDropdownElement = document.querySelector(
        "[data-theme-dropdown]"
      );

      // Don't close if clicking inside any of the dropdowns
      if (
        dateTimeSettingsElement?.contains(event.target as Node) ||
        themeDropdownElement?.contains(event.target as Node) ||
        dropdownRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      // Close all dropdowns
      setIsDropdownOpen(false);
      setIsThemeDropdownOpen(false);
      setIsDateTimeSettingsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleThemeSelect = async (themeId: string) => {
    try {
      await updateUserDefaultTheme(themeId);
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const filteredThemes = {
    light: typedThemes.light.filter((t: ThemeOption) =>
      t.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    dark: typedThemes.dark.filter((t: ThemeOption) =>
      t.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const currentThemeIcon = [...typedThemes.light, ...typedThemes.dark].find(
    (t) => t.id === theme
  )?.icon;

  const handleThemeDropdownClick = () => {
    setIsThemeDropdownOpen(!isThemeDropdownOpen);
    setIsDateTimeSettingsOpen(false);
  };

  const handleDateTimeSettingsClick = () => {
    setIsDateTimeSettingsOpen(!isDateTimeSettingsOpen);
    setIsThemeDropdownOpen(false);
  };

  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <label
        tabIndex={0}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <User size={16} />
        <span>{username}</span>
        <Settings size={16} className="text-base-content/70" />
      </label>

      {/* Main Dropdown Menu */}
      <ul
        tabIndex={0}
        className={`dropdown-content z-[9999] menu p-2 shadow bg-base-200 rounded-box w-64 absolute left-1/2 -translate-x-1/2 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        <li>
          <button
            onClick={handleThemeDropdownClick}
            className="hover:bg-base-300 w-full flex items-center justify-between px-3"
          >
            <div className="flex items-center gap-2">
              {currentThemeIcon}
              <span>Set Default Theme</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </li>
        <li>
          <button
            onClick={handleDateTimeSettingsClick}
            className="hover:bg-base-300 w-full flex items-center justify-between px-3"
          >
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Date & Time Settings</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>

      {/* Theme Selection Dropdown */}
      {isThemeDropdownOpen && (
        <ul
          data-theme-dropdown
          className="menu shadow bg-base-200 rounded-box w-64 absolute left-[calc(100%+2.5rem)] top-0 z-[9999]"
        >
          <div className="sticky top-0 bg-base-200 p-2 z-10">
            <div className="form-control">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/70" />
                <input
                  type="text"
                  placeholder="Search themes..."
                  className="input input-sm input-bordered w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {/* Light Themes Section */}
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
                  <li key={themeOption.id}>
                    <button
                      onClick={() => handleThemeSelect(themeOption.id)}
                      className={`flex items-center gap-2 px-4 py-2 hover:bg-base-300 w-full ${
                        theme === themeOption.id ? "bg-base-300" : ""
                      }`}
                    >
                      {themeOption.icon}
                      <span>{themeOption.label}</span>
                    </button>
                  </li>
                ))}
              </div>
            </div>

            {/* Dark Themes Section */}
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
                  <li key={themeOption.id}>
                    <button
                      onClick={() => handleThemeSelect(themeOption.id)}
                      className={`flex items-center gap-2 px-4 py-2 hover:bg-base-300 w-full ${
                        theme === themeOption.id ? "bg-base-300" : ""
                      }`}
                    >
                      {themeOption.icon}
                      <span>{themeOption.label}</span>
                    </button>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </ul>
      )}

      {/* Date Time Settings */}
      <DateTimeSettings isOpen={isDateTimeSettingsOpen} />
    </div>
  );
}

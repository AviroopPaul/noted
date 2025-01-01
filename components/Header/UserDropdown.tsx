import React, { useState, useEffect, useRef } from "react";
import {
  User,
  ChevronRight,
  Search,
  Settings,
  Clock,
  Sun,
  Moon,
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

interface AutoThemeSettings {
  enabled: boolean;
  lightTheme: string;
  darkTheme: string;
}

export function UserDropdown({ username }: { username: string }) {
  const { theme, updateUserDefaultTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [lightExpanded, setLightExpanded] = useState(false);
  const [darkExpanded, setDarkExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isDateTimeSettingsOpen, setIsDateTimeSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [autoThemeSettings, setAutoThemeSettings] = useState<AutoThemeSettings>(
    {
      enabled: false,
      lightTheme: typedThemes.light[0]?.id || "",
      darkTheme: typedThemes.dark[0]?.id || "",
    }
  );

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

  useEffect(() => {
    if (autoThemeSettings.enabled) {
      const now = new Date();
      const hours = now.getHours();
      const isDaytime = hours >= 6 && hours < 18;

      handleThemeSelect(
        isDaytime ? autoThemeSettings.lightTheme : autoThemeSettings.darkTheme
      );
    }
  }, [autoThemeSettings]);

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
          <label className="hover:bg-base-300 w-full flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              {autoThemeSettings.enabled ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
              <span>Auto Theming</span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={autoThemeSettings.enabled}
              onChange={(e) =>
                setAutoThemeSettings((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }))
              }
            />
          </label>
        </li>
        {autoThemeSettings.enabled && (
          <>
            <li>
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(true);
                  setLightExpanded(true);
                  setDarkExpanded(false);
                }}
                className="hover:bg-base-300 w-full flex items-center justify-between px-3 pl-8"
              >
                <div className="flex items-center gap-2">
                  <Sun size={16} />
                  <span>Select Light Mode Theme</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(true);
                  setDarkExpanded(true);
                  setLightExpanded(false);
                }}
                className="hover:bg-base-300 w-full flex items-center justify-between px-3 pl-8"
              >
                <div className="flex items-center gap-2">
                  <Moon size={16} />
                  <span>Select Dark Mode Theme</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </li>
          </>
        )}
        {!autoThemeSettings.enabled && (
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
        )}
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
              <div className="w-full px-2 py-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold text-base-content/70">
                  {autoThemeSettings.enabled
                    ? "Select Light Mode Theme"
                    : "Light Themes"}
                </span>
              </div>
              <div
                className={`${
                  !autoThemeSettings.enabled || lightExpanded ? "" : "hidden"
                }`}
              >
                {filteredThemes.light.map((themeOption) => (
                  <li key={themeOption.id}>
                    <button
                      onClick={() => {
                        if (autoThemeSettings.enabled) {
                          setAutoThemeSettings((prev) => ({
                            ...prev,
                            lightTheme: themeOption.id,
                          }));
                        } else {
                          handleThemeSelect(themeOption.id);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 hover:bg-base-300 w-full ${
                        (autoThemeSettings.enabled
                          ? autoThemeSettings.lightTheme
                          : theme) === themeOption.id
                          ? "bg-base-300"
                          : ""
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
              <div className="w-full px-2 py-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold text-base-content/70">
                  {autoThemeSettings.enabled
                    ? "Select Dark Mode Theme"
                    : "Dark Themes"}
                </span>
              </div>
              <div
                className={`${
                  !autoThemeSettings.enabled || darkExpanded ? "" : "hidden"
                }`}
              >
                {filteredThemes.dark.map((themeOption) => (
                  <li key={themeOption.id}>
                    <button
                      onClick={() => {
                        if (autoThemeSettings.enabled) {
                          setAutoThemeSettings((prev) => ({
                            ...prev,
                            darkTheme: themeOption.id,
                          }));
                        } else {
                          handleThemeSelect(themeOption.id);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 hover:bg-base-300 w-full ${
                        (autoThemeSettings.enabled
                          ? autoThemeSettings.darkTheme
                          : theme) === themeOption.id
                          ? "bg-base-300"
                          : ""
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

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Theme as ThemeType } from "@/lib/constants/themes";

interface AutoThemeSettings {
  enabled: boolean;
  lightTheme: string;
  darkTheme: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  updateUserDefaultTheme: (theme: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [defaultTheme, setDefaultTheme] = useState<ThemeType>("light");
  const [autoTheme, setAutoTheme] = useState<AutoThemeSettings | null>(null);
  const { data: session } = useSession();

  // Fetch both user theme and auto theme settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        // First fetch default theme
        const response = await fetch("/api/user/settings");
        const data = await response.json();
        if (data.defaultTheme) {
          setDefaultTheme(data.defaultTheme);
          handleThemeChange(data.defaultTheme);
        }

        // Then fetch auto theme settings
        const autoThemeResponse = await fetch("/api/user/auto-theme");
        const autoThemeData = await autoThemeResponse.json();
        setAutoTheme(autoThemeData.autoTheme);

        // If auto theme is enabled, apply it based on time
        if (autoThemeData.autoTheme.enabled) {
          const now = new Date();
          const hours = now.getHours();
          const isDaytime = hours >= 6 && hours < 18;
          handleThemeChange(
            isDaytime
              ? autoThemeData.autoTheme.lightTheme
              : autoThemeData.autoTheme.darkTheme
          );
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    if (session?.user) {
      fetchUserSettings();
    } else {
      const savedTheme = localStorage.getItem("theme") as ThemeType;
      handleThemeChange(savedTheme || "light");
      setDefaultTheme(savedTheme || "light");
    }
  }, [session]);

  // Handle auto theme switching
  useEffect(() => {
    if (!autoTheme?.enabled) {
      // When auto theme is disabled, revert to default theme
      handleThemeChange(defaultTheme);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const isDaytime = hours >= 6 && hours < 18;
      handleThemeChange(isDaytime ? autoTheme.lightTheme : autoTheme.darkTheme);
    };

    // Check immediately and then every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [autoTheme, defaultTheme]);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    // Only save to localStorage if not using auto theme
    if (!autoTheme?.enabled) {
      localStorage.setItem("theme", newTheme);
    }
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const updateUserDefaultTheme = async (newTheme: ThemeType) => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ defaultTheme: newTheme }),
      });

      if (!response.ok) {
        throw new Error("Failed to update default theme");
      }

      setDefaultTheme(newTheme);

      // Only change the current theme if auto theme is disabled
      if (!autoTheme?.enabled) {
        handleThemeChange(newTheme);
      }
    } catch (error) {
      console.error("Error updating default theme:", error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleThemeChange, updateUserDefaultTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Theme as ThemeType } from "@/lib/constants/themes";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  updateUserDefaultTheme: (theme: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("light");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserTheme = async () => {
      try {
        const response = await fetch("/api/user/settings");
        const data = await response.json();
        console.log("Fetched user theme:", data);
        if (data.defaultTheme) {
          handleThemeChange(data.defaultTheme);
        }
      } catch (error) {
        console.error("Error fetching user theme:", error);
      }
    };

    if (session?.user) {
      fetchUserTheme();
    } else {
      const savedTheme = localStorage.getItem("theme") as ThemeType;
      handleThemeChange(savedTheme || "light"); // Use localStorage theme or default to light
    }
  }, [session]);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
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

      handleThemeChange(newTheme);
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

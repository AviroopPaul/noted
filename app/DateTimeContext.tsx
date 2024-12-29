"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DateTimeSettings {
  use24Hour: boolean;
  useUSDateFormat: boolean;
  showSeconds: boolean;
  timezone: string;
}

interface DateTimeContextType {
  settings: DateTimeSettings;
  updateSettings: (newSettings: Partial<DateTimeSettings>) => void;
}

const defaultSettings: DateTimeSettings = {
  use24Hour: true,
  useUSDateFormat: false,
  showSeconds: false,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const DateTimeContext = createContext<DateTimeContextType | undefined>(
  undefined
);

export function DateTimeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DateTimeSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dateTimeSettings");
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("dateTimeSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<DateTimeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <DateTimeContext.Provider value={{ settings, updateSettings }}>
      {children}
    </DateTimeContext.Provider>
  );
}

export const useDateTimeSettings = () => {
  const context = useContext(DateTimeContext);
  if (context === undefined) {
    throw new Error(
      "useDateTimeSettings must be used within a DateTimeProvider"
    );
  }
  return context;
};

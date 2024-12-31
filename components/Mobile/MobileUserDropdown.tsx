import React from "react";
import { Clock } from "lucide-react";
import { useDateTimeSettings } from "@/app/DateTimeContext";
import { MobileDateTimeSettings } from "./MobileDateTimeSettings";
import { MobileThemeDropdown } from "./MobileThemeDropdown";
import { useTheme } from "@/app/ThemeContext";
import { THEMES } from "@/lib/constants/themes";

interface MobileUserDropdownProps {
  username: string;
  onClose: () => void;
}

export function MobileUserDropdown({
  username,
  onClose,
}: MobileUserDropdownProps) {
  const [activeSection, setActiveSection] = React.useState<
    "main" | "datetime" | "theme"
  >("main");
  const { settings } = useDateTimeSettings();
  const { theme } = useTheme();

  if (activeSection === "datetime") {
    return <MobileDateTimeSettings onBack={() => setActiveSection("main")} />;
  }

  if (activeSection === "theme") {
    return <MobileThemeDropdown onBack={() => setActiveSection("main")} />;
  }

  const currentThemeIcon = [...THEMES.light, ...THEMES.dark].find(
    (t) => t.id === theme
  )?.icon;

  return (
    <div className="flex flex-col">
      {/* Settings Options */}
      <div className="p-4">
        <div className="space-y-4">
          <button
            onClick={() => setActiveSection("theme")}
            className="btn btn-ghost w-full justify-start gap-3 text-lg text-base-content"
          >
            {currentThemeIcon}
            Theme Settings
          </button>

          <button
            onClick={() => setActiveSection("datetime")}
            className="btn btn-ghost w-full justify-start gap-3 text-lg text-base-content"
          >
            <Clock size={24} />
            Date & Time Settings
          </button>
        </div>
      </div>
    </div>
  );
}

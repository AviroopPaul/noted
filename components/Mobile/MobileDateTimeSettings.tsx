import React from "react";
import { ChevronLeft } from "lucide-react";
import { useDateTimeSettings } from "@/app/DateTimeContext";

interface MobileDateTimeSettingsProps {
  onBack: () => void;
}

export function MobileDateTimeSettings({
  onBack,
}: MobileDateTimeSettingsProps) {
  const { settings, updateSettings } = useDateTimeSettings();

  const handleAutoDetectTimezone = () => {
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    updateSettings({ timezone: systemTimezone });
  };

  return (
    <div className="fixed inset-0 z-50 bg-base-100 flex flex-col text-base-content">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center gap-3 bg-base-200">
        <button onClick={onBack} className="btn btn-ghost btn-circle">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Date & Time Settings</h2>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="form-control">
            <label className="label cursor-pointer justify-between">
              <span className="label-text text-lg">24-hour format</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.use24Hour}
                onChange={(e) => updateSettings({ use24Hour: e.target.checked })}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-between">
              <span className="label-text text-lg">US Date Format</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.useUSDateFormat}
                onChange={(e) =>
                  updateSettings({ useUSDateFormat: e.target.checked })
                }
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-between">
              <span className="label-text text-lg">Show Seconds</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.showSeconds}
                onChange={(e) =>
                  updateSettings({ showSeconds: e.target.checked })
                }
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Timezone</span>
            </label>
            <select
              className="select select-bordered w-full text-lg"
              value={settings.timezone}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <button
              onClick={handleAutoDetectTimezone}
              className="btn btn-outline w-full mt-2"
            >
              Auto Detect Timezone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
